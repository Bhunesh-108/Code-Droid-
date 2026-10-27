import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AndroidStatusHeader } from './components/AndroidStatusHeader';
import { TabBar } from './components/TabBar';
import { CodeEditor, CodeEditorHandle } from './components/CodeEditor';
import { TouchAccessoryBar } from './components/TouchAccessoryBar';
import { FileExplorer } from './components/FileExplorer';
import { GitPanel } from './components/GitPanel';
import { SearchPanel } from './components/SearchPanel';
import { AlpInspector } from './components/AlpInspector';
import { SettingsPanel } from './components/SettingsPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { GitDiffModal } from './components/GitDiffModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { WebPreviewModal } from './components/WebPreviewModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';

import { INITIAL_FILES, getLanguageFromFilename } from './utils/fileSystem';
import { GitEngine } from './utils/gitEngine';
import { CodeRunner } from './utils/codeRunners';
import { EditorSettings, FileDiffLine, OpenTab } from './types';

export default function App() {
  // 1. Filesystem State
  const [files, setFiles] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('codedroid_files_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const initialMap: Record<string, string> = {};
    INITIAL_FILES.forEach(f => {
      initialMap[f.path] = f.content || '';
    });
    return initialMap;
  });

  // Save files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('codedroid_files_v2', JSON.stringify(files));
    } catch {
      // ignore
    }
  }, [files]);

  // 2. Git Engine & Status
  const gitEngineRef = useRef<GitEngine>(new GitEngine(files));
  const [gitStatus, setGitStatus] = useState(() => gitEngineRef.current.getStatus(files));

  const refreshGitStatus = (currentFiles = files) => {
    setGitStatus(gitEngineRef.current.getStatus(currentFiles));
  };

  // 3. Active Tabs and Editor state
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { fileId: '11', path: 'index.html', name: 'index.html', language: 'html' },
    { fileId: '12', path: 'style.css', name: 'style.css', language: 'css' },
    { fileId: '13', path: 'app.js', name: 'app.js', language: 'javascript' },
    { fileId: '6', path: 'main.rs', name: 'main.rs', language: 'rust' },
    { fileId: '1', path: 'main.py', name: 'main.py', language: 'python' },
    { fileId: '10', path: 'addition_alp.asm', name: 'addition_alp.asm', language: 'alp' },
  ]);

  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    theme: 'vscode-dark',
    fontSize: 13,
    tabSize: 4,
    wordWrap: false,
    lineNumbers: true,
    showMinimap: false,
    touchHaptics: true,
    autoCloseBrackets: true,
  });

  // 4. UI Layout Panels & Drawers
  const [activeSidebarTab, setActiveSidebarTab] = useState<'files' | 'git' | 'search' | 'alp' | 'settings' | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isWebPreviewOpen, setIsWebPreviewOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [diffModalFile, setDiffModalFile] = useState<string | null>(null);
  const [executionOutput, setExecutionOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const editorRef = useRef<CodeEditorHandle>(null);

  // Modified files calculation
  const modifiedFiles = useMemo(() => {
    return [...gitStatus.unstagedFiles, ...gitStatus.stagedFiles];
  }, [gitStatus]);

  // Handle file select
  const handleSelectFile = (path: string) => {
    if (!files[path] && files[path] !== '') return;
    setActiveFile(path);
    if (!openTabs.some(t => t.path === path)) {
      setOpenTabs(prev => [
        ...prev,
        {
          fileId: path,
          path,
          name: path.split('/').pop() || path,
          language: getLanguageFromFilename(path),
        },
      ]);
    }
  };

  // Handle close tab
  const handleCloseTab = (path: string) => {
    const nextTabs = openTabs.filter(t => t.path !== path);
    setOpenTabs(nextTabs);
    if (activeFile === path && nextTabs.length > 0) {
      setActiveFile(nextTabs[nextTabs.length - 1].path);
    }
  };

  // Handle Code Change
  const handleCodeChange = (newCode: string) => {
    const updated = { ...files, [activeFile]: newCode };
    setFiles(updated);
    refreshGitStatus(updated);
  };

  // File Creation
  const handleCreateFile = (path: string, content = '') => {
    const updated = { ...files, [path]: content };
    setFiles(updated);
    refreshGitStatus(updated);
    handleSelectFile(path);
  };

  // File Deletion
  const handleDeleteFile = (path: string) => {
    const updated = { ...files };
    delete updated[path];
    setFiles(updated);
    refreshGitStatus(updated);
    handleCloseTab(path);
  };

  // File Rename
  const handleRenameFile = (oldPath: string, newPath: string) => {
    const content = files[oldPath] ?? '';
    const updated = { ...files };
    delete updated[oldPath];
    updated[newPath] = content;
    setFiles(updated);
    refreshGitStatus(updated);

    setOpenTabs(prev =>
      prev.map(t => (t.path === oldPath ? { ...t, path: newPath, name: newPath } : t))
    );
    if (activeFile === oldPath) {
      setActiveFile(newPath);
    }
  };

  // Reset to initial demo project
  const handleResetProject = () => {
    const initialMap: Record<string, string> = {};
    INITIAL_FILES.forEach(f => {
      initialMap[f.path] = f.content || '';
    });
    setFiles(initialMap);
    gitEngineRef.current = new GitEngine(initialMap);
    refreshGitStatus(initialMap);
    setActiveFile('main.py');
  };

  // Run Current Active File
  const handleRunCurrentFile = async () => {
    if (!activeFile || !files[activeFile]) return;

    const lang = getLanguageFromFilename(activeFile);

    // If running HTML, automatically launch the Live Web Page Preview
    if (lang === 'html' || activeFile.endsWith('.html') || activeFile.endsWith('.htm')) {
      setIsWebPreviewOpen(true);
      setIsTerminalOpen(true);
      setExecutionOutput(`[CodeDroid Web Preview]\n🌐 Live browser launched for ${activeFile}!\nAuto-injected style.css & app.js into live viewport.`);
      return;
    }

    setIsRunning(true);
    setIsTerminalOpen(true);

    const result = await CodeRunner.runCode(files[activeFile], lang);

    let outputText = `[CodeDroid Runner] ${activeFile} (${lang.toUpperCase()})\n`;
    if (result.stderr) {
      outputText += `\n❌ ERROR:\n${result.stderr}\n`;
    }
    if (result.stdout) {
      outputText += `\n${result.stdout}\n`;
    }
    outputText += `\n⏱️ Execution time: ${result.executionTimeMs}ms (Exit code: ${result.exitCode})`;

    setExecutionOutput(outputText);
    setIsRunning(false);
  };

  // Git Actions
  const handleStageFile = (path: string) => {
    gitEngineRef.current.stageFile(path);
    refreshGitStatus();
  };

  const handleUnstageFile = (path: string) => {
    gitEngineRef.current.unstageFile(path);
    refreshGitStatus();
  };

  const handleStageAll = () => {
    gitEngineRef.current.stageAll(files);
    refreshGitStatus();
  };

  const handleUnstageAll = () => {
    gitEngineRef.current.unstageAll();
    refreshGitStatus();
  };

  const handleDiscardChanges = (path: string) => {
    const headContent = gitEngineRef.current.getHeadFile(path);
    if (headContent !== undefined) {
      const updated = { ...files, [path]: headContent };
      setFiles(updated);
      refreshGitStatus(updated);
    }
  };

  const handleCommit = (message: string) => {
    const commit = gitEngineRef.current.commit(message, files);
    if (commit) {
      refreshGitStatus();
    }
  };

  const handleCreateBranch = (name: string) => {
    gitEngineRef.current.createBranch(name);
    refreshGitStatus();
  };

  const handleSelectBranch = (name: string) => {
    gitEngineRef.current.checkoutBranch(name);
    refreshGitStatus();
  };

  const diffLines: FileDiffLine[] = useMemo(() => {
    if (!diffModalFile) return [];
    return gitEngineRef.current.computeDiff(diffModalFile, files[diffModalFile] || '');
  }, [diffModalFile, files]);

  // Touch Accessory Handlers
  const handleInsertText = (text: string, cursorOffset?: number) => {
    editorRef.current?.insertText(text, cursorOffset);
  };

  const handleMoveCursor = (direction: 'left' | 'right' | 'up' | 'down') => {
    editorRef.current?.moveCursor(direction);
  };

  const handleUndo = () => editorRef.current?.undo();
  const handleRedo = () => editorRef.current?.redo();
  const handleDuplicateLine = () => editorRef.current?.duplicateLine();
  const handleToggleComment = () => editorRef.current?.toggleComment();
  const handleIndent = () => editorRef.current?.indent();
  const handleOutdent = () => editorRef.current?.outdent();

  const currentFileContent = files[activeFile] ?? '';
  const currentLanguage = getLanguageFromFilename(activeFile);

  return (
    <div className="w-screen h-screen bg-[#111115] flex items-center justify-center overflow-hidden font-sans select-none">
      {/* Container: If isMobileDeviceView is true, wrap in stylish Android Bezel frame */}
      <div
        className={`relative flex flex-col bg-[#1b1b22] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-300 ${
          isMobileDeviceView
            ? 'w-full max-w-[420px] h-full max-h-[880px] rounded-[36px] border-[10px] border-[#2c2c36] ring-1 ring-zinc-700/50'
            : 'w-full h-full'
        }`}
      >
        {/* Android Camera Punch Hole cutout (visible in Phone Bezel mode) */}
        {isMobileDeviceView && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-zinc-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#151528] opacity-80" />
            </div>
          </div>
        )}

        {/* 1. Android Status & Top Navigation Header */}
        <AndroidStatusHeader
          currentBranch={gitStatus.branch}
          branches={gitStatus.branches}
          onSelectBranch={handleSelectBranch}
          onCreateBranch={handleCreateBranch}
          isMobileDeviceView={isMobileDeviceView}
          onToggleDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
          onRunCurrentFile={handleRunCurrentFile}
          onOpenTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenWebPreview={() => setIsWebPreviewOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onToggleSidebarTab={tab =>
            setActiveSidebarTab(prev => (prev === tab ? null : tab))
          }
          activeSidebarTab={activeSidebarTab}
          isRunning={isRunning}
          activeFileName={activeFile}
        />

        {/* 2. Middle Region: Main IDE Work Area + Collapsible Drawers */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Main Editor Surface */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Open Tabs Bar */}
            <TabBar
              tabs={openTabs}
              activeFile={activeFile}
              onSelectTab={handleSelectFile}
              onCloseTab={handleCloseTab}
              modifiedFiles={modifiedFiles}
            />

            {/* Code Editor */}
            <CodeEditor
              ref={editorRef}
              code={currentFileContent}
              language={currentLanguage}
              onChange={handleCodeChange}
              fontSize={editorSettings.fontSize}
              tabSize={editorSettings.tabSize}
              wordWrap={editorSettings.wordWrap}
              lineNumbers={editorSettings.lineNumbers}
              touchHaptics={editorSettings.touchHaptics}
              isModified={modifiedFiles.includes(activeFile)}
            />
          </div>

          {/* Collapsible Sidebar Drawer (Files / Git / Search / ALP / Settings) */}
          {activeSidebarTab && (
            <div className="absolute inset-y-0 left-0 w-72 sm:w-80 bg-[#1e1e24] border-r border-[#31313f] shadow-2xl z-40 flex flex-col animate-in slide-in-from-left duration-200">
              {activeSidebarTab === 'files' && (
                <FileExplorer
                  files={files}
                  activeFile={activeFile}
                  onSelectFile={path => {
                    handleSelectFile(path);
                    if (window.innerWidth < 640) setActiveSidebarTab(null);
                  }}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  onRenameFile={handleRenameFile}
                  onResetProject={handleResetProject}
                  modifiedFiles={modifiedFiles}
                />
              )}

              {activeSidebarTab === 'git' && (
                <GitPanel
                  status={gitStatus}
                  onStageFile={handleStageFile}
                  onUnstageFile={handleUnstageFile}
                  onStageAll={handleStageAll}
                  onUnstageAll={handleUnstageAll}
                  onDiscardChanges={handleDiscardChanges}
                  onCommit={handleCommit}
                  onViewDiff={path => setDiffModalFile(path)}
                  onCreateBranch={handleCreateBranch}
                  onSelectBranch={handleSelectBranch}
                />
              )}

              {activeSidebarTab === 'search' && (
                <SearchPanel
                  files={files}
                  onSelectFile={path => {
                    handleSelectFile(path);
                    if (window.innerWidth < 640) setActiveSidebarTab(null);
                  }}
                  onReplaceInFile={(path, newContent) => {
                    const updated = { ...files, [path]: newContent };
                    setFiles(updated);
                    refreshGitStatus(updated);
                  }}
                />
              )}

              {activeSidebarTab === 'alp' && (
                <AlpInspector currentCode={currentFileContent} />
              )}

              {activeSidebarTab === 'settings' && (
                <SettingsPanel
                  settings={editorSettings}
                  onUpdateSettings={newSt =>
                    setEditorSettings(prev => ({ ...prev, ...newSt }))
                  }
                />
              )}
            </div>
          )}
        </div>

        {/* 3. Built-in Terminal Drawer / Bottom Panel */}
        {isTerminalOpen && (
          <TerminalPanel
            files={files}
            git={gitEngineRef.current}
            currentFile={activeFile}
            onClose={() => setIsTerminalOpen(false)}
            onFileChange={(path, content) => {
              if (content === null) {
                handleDeleteFile(path);
              } else {
                handleCreateFile(path, content);
              }
            }}
            externalOutput={executionOutput}
          />
        )}

        {/* 4. Touch Accessory Bar (Mobile Coder's Sticky Accessory Keyboard) */}
        <TouchAccessoryBar
          onInsertText={handleInsertText}
          onMoveCursor={handleMoveCursor}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDuplicateLine={handleDuplicateLine}
          onToggleComment={handleToggleComment}
          onIndent={handleIndent}
          onOutdent={handleOutdent}
          tabSize={editorSettings.tabSize}
          touchHaptics={editorSettings.touchHaptics}
        />

        {/* Android Home Navigation Indicator (Pill bar) */}
        {isMobileDeviceView && (
          <div className="w-full bg-[#16161b] py-1 flex items-center justify-center">
            <div className="w-28 h-1 bg-zinc-500 rounded-full" />
          </div>
        )}

        {/* 5. Modals: Git Diff & Command Palette */}
        {diffModalFile && (
          <GitDiffModal
            filePath={diffModalFile}
            diffLines={diffLines}
            onClose={() => setDiffModalFile(null)}
            onStage={() => handleStageFile(diffModalFile)}
            onDiscard={() => handleDiscardChanges(diffModalFile)}
            isStaged={gitStatus.stagedFiles.includes(diffModalFile)}
          />
        )}

        {isCommandPaletteOpen && (
          <CommandPaletteModal
            files={files}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectFile={handleSelectFile}
            onRunCurrent={handleRunCurrentFile}
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onOpenGit={() => setActiveSidebarTab('git')}
            onOpenAlp={() => setActiveSidebarTab('alp')}
            onOpenSettings={() => setActiveSidebarTab('settings')}
            onOpenWebPreview={() => setIsWebPreviewOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {/* 6. Live Web Page Preview Modal */}
        {isWebPreviewOpen && (
          <WebPreviewModal
            files={files}
            activeFile={activeFile}
            onClose={() => setIsWebPreviewOpen(false)}
            onSelectFile={path => handleSelectFile(path)}
          />
        )}

        {/* 7. Beginner Web Development Guide Modal */}
        <BeginnerGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onSelectFile={path => handleSelectFile(path)}
          onOpenWebPreview={() => setIsWebPreviewOpen(true)}
        />
      </div>
    </div>
  );
}
