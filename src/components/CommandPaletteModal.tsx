import React, { useState, useMemo } from 'react';
import { Search, FileCode, Play, Terminal, GitBranch, Settings, X, Cpu, Globe, GraduationCap, Smartphone } from 'lucide-react';

interface CommandPaletteModalProps {
  files: Record<string, string>;
  onClose: () => void;
  onSelectFile: (path: string) => void;
  onRunCurrent: () => void;
  onOpenTerminal: () => void;
  onOpenGit: () => void;
  onOpenAlp: () => void;
  onOpenSettings: () => void;
  onOpenWebPreview?: () => void;
  onOpenGuide?: () => void;
  onOpenApkModal?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  files,
  onClose,
  onSelectFile,
  onRunCurrent,
  onOpenTerminal,
  onOpenGit,
  onOpenAlp,
  onOpenSettings,
  onOpenWebPreview,
  onOpenGuide,
  onOpenApkModal,
}) => {
  const [query, setQuery] = useState('');

  const fileActions = useMemo(() => {
    return Object.keys(files).map(f => ({
      id: `file-${f}`,
      title: `Open file: ${f}`,
      category: 'Files',
      icon: <FileCode className="w-4 h-4 text-blue-400" />,
      action: () => {
        onSelectFile(f);
        onClose();
      },
    }));
  }, [files, onSelectFile, onClose]);

  const commandActions = useMemo(() => {
    return [
      {
        id: 'cmd-run',
        title: 'Run: Execute current active file',
        category: 'Commands',
        icon: <Play className="w-4 h-4 text-emerald-400" />,
        action: () => {
          onRunCurrent();
          onClose();
        },
      },
      {
        id: 'cmd-terminal',
        title: 'View: Open Built-in POSIX Terminal',
        category: 'Commands',
        icon: <Terminal className="w-4 h-4 text-sky-400" />,
        action: () => {
          onOpenTerminal();
          onClose();
        },
      },
      {
        id: 'cmd-git',
        title: 'View: Open Git Source Control',
        category: 'Commands',
        icon: <GitBranch className="w-4 h-4 text-emerald-400" />,
        action: () => {
          onOpenGit();
          onClose();
        },
      },
      {
        id: 'cmd-alp',
        title: 'View: Open 8086 ALP Architecture & Registers',
        category: 'Commands',
        icon: <Cpu className="w-4 h-4 text-purple-400" />,
        action: () => {
          onOpenAlp();
          onClose();
        },
      },
      {
        id: 'cmd-web-preview',
        title: 'View: Open Live Web Page Preview (HTML / CSS / JS)',
        category: 'Commands',
        icon: <Globe className="w-4 h-4 text-emerald-400" />,
        action: () => {
          if (onOpenWebPreview) onOpenWebPreview();
          onClose();
        },
      },
      {
        id: 'cmd-guide',
        title: 'Help: Open Beginner Web Development Guide & Walkthrough',
        category: 'Help',
        icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
        action: () => {
          if (onOpenGuide) onOpenGuide();
          onClose();
        },
      },
      {
        id: 'cmd-apk-install',
        title: 'Android: Install Phone App or Build APK (Gradle 9.6.0)',
        category: 'Android',
        icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
        action: () => {
          if (onOpenApkModal) onOpenApkModal();
          onClose();
        },
      },
      {
        id: 'cmd-settings',
        title: 'Preferences: Open IDE Settings',
        category: 'Commands',
        icon: <Settings className="w-4 h-4 text-zinc-300" />,
        action: () => {
          onOpenSettings();
          onClose();
        },
      },
    ];
  }, [onRunCurrent, onOpenTerminal, onOpenGit, onOpenAlp, onOpenSettings, onOpenWebPreview, onOpenGuide, onClose]);

  const allItems = [...commandActions, ...fileActions];

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(item => item.title.toLowerCase().includes(q));
  }, [allItems, query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-16 px-3">
      <div className="bg-[#1e1e25] border border-[#3f3f52] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-xs text-zinc-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#17171d] border-b border-[#2d2d3a]">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or file name..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-zinc-500"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 italic">No matching commands or files</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-600/30 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5 font-mono text-zinc-200 group-hover:text-white">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">{item.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
