import React, { useState } from 'react';
import {
  FileCode,
  FolderOpen,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { getLanguageFromFilename } from '../utils/fileSystem';

interface FileExplorerProps {
  files: Record<string, string>;
  activeFile: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string, content?: string) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onResetProject: () => void;
  modifiedFiles: string[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onResetProject,
  modifiedFiles,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      let name = newFileName.trim();
      if (!name.includes('.')) name += '.py';
      onCreateFile(name, '');
      setNewFileName('');
      setIsCreating(false);
      onSelectFile(name);
    }
  };

  const handleRenameSubmit = (oldPath: string) => {
    if (renameInput.trim() && renameInput.trim() !== oldPath) {
      onRenameFile(oldPath, renameInput.trim());
    }
    setRenamingPath(null);
  };

  const getFileBadge = (filename: string) => {
    const lang = getLanguageFromFilename(filename);
    switch (lang) {
      case 'python':
        return <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded font-mono">PY</span>;
      case 'javascript':
        return <span className="text-[10px] bg-yellow-500/20 text-yellow-300 font-bold px-1 rounded font-mono">JS</span>;
      case 'c':
        return <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-1 rounded font-mono">C</span>;
      case 'cpp':
        return <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-1 rounded font-mono">C++</span>;
      case 'csharp':
        return <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1 rounded font-mono">C#</span>;
      case 'swift':
        return <span className="text-[10px] bg-orange-500/20 text-orange-300 font-bold px-1 rounded font-mono">SWIFT</span>;
      case 'rust':
        return <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1 rounded font-mono">RS</span>;
      case 'go':
        return <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-1 rounded font-mono">GO</span>;
      case 'kotlin':
        return <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-1 rounded font-mono">KT</span>;
      case 'alp':
        return <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-300 font-bold px-1 rounded font-mono">ALP</span>;
      default:
        return <span className="text-[10px] bg-zinc-700 text-zinc-300 font-bold px-1 rounded font-mono">DOC</span>;
    }
  };

  const fileNames = Object.keys(files);

  const downloadProject = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(files, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'codedroid-project.json');
    dlAnchorElem.click();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e24] text-zinc-200 overflow-hidden text-xs">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d38] bg-[#18181d]">
        <div className="flex items-center gap-1.5">
          <FolderOpen className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
            Project Files
          </span>
          <span className="text-zinc-500 text-[10px]">({fileNames.length})</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-zinc-700/60 text-zinc-300 hover:text-white rounded"
            title="New File"
            aria-label="New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={downloadProject}
            className="p-1 hover:bg-zinc-700/60 text-zinc-300 hover:text-white rounded"
            title="Export Project JSON"
            aria-label="Export Project"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetProject}
            className="p-1 hover:bg-zinc-700/60 text-zinc-300 hover:text-white rounded"
            title="Reset Starter Templates"
            aria-label="Reset Starter Templates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New File Creation Input */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-2 bg-[#262631] border-b border-zinc-700 flex items-center gap-1">
          <input
            type="text"
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            placeholder="main.rs, app.swift, server.go..."
            className="flex-1 bg-[#15151a] border border-blue-500 rounded px-2 py-1 text-xs text-white font-mono outline-none"
            autoFocus
          />
          <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300" aria-label="Confirm new file">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="p-1 text-zinc-400 hover:text-white"
            aria-label="Cancel new file"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {fileNames.map(path => {
          const isActive = path === activeFile;
          const isModified = modifiedFiles.includes(path);
          const isRenaming = renamingPath === path;

          if (isRenaming) {
            return (
              <div key={path} className="flex items-center gap-1 p-1 bg-zinc-800 rounded">
                <input
                  type="text"
                  value={renameInput}
                  onChange={e => setRenameInput(e.target.value)}
                  className="flex-1 bg-[#121216] border border-blue-500 rounded px-1.5 py-0.5 text-xs text-white font-mono outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleRenameSubmit(path)}
                  className="p-1 text-emerald-400"
                  aria-label="Confirm rename"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setRenamingPath(null)}
                  className="p-1 text-zinc-400"
                  aria-label="Cancel rename"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={path}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-600/30 text-white font-medium border-l-2 border-blue-400'
                  : 'hover:bg-[#25252f] text-zinc-300'
              }`}
              onClick={() => onSelectFile(path)}
            >
              <div className="flex items-center gap-2 truncate flex-1">
                {getFileBadge(path)}
                <span className="font-mono truncate text-xs">{path}</span>
                {isModified && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Modified" />
                )}
              </div>

              {/* Action buttons on hover/focus */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setRenamingPath(path);
                    setRenameInput(path);
                  }}
                  className="p-1 hover:text-white rounded hover:bg-zinc-700/60"
                  title="Rename"
                  aria-label={`Rename ${path}`}
                >
                  <Edit2 className="w-3 h-3 text-zinc-400 hover:text-zinc-200" />
                </button>
                {fileNames.length > 1 && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteFile(path);
                    }}
                    className="p-1 hover:text-red-400 rounded hover:bg-zinc-700/60"
                    title="Delete"
                    aria-label={`Delete ${path}`}
                  >
                    <Trash2 className="w-3 h-3 text-zinc-400 hover:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Languages Footer */}
      <div className="p-2 border-t border-[#2a2a35] bg-[#16161b] flex flex-col gap-1.5">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold">Starter Presets:</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onCreateFile('main.rs', '// Rust starter\nfn main() {\n    println!("Hello from Rust!");\n}\n')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[9px] text-rose-400 font-mono"
          >
            +Rust
          </button>
          <button
            onClick={() => onCreateFile('Program.cs', '// C# starter\nusing System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello C#!");\n    }\n}\n')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[9px] text-purple-400 font-mono"
          >
            +C#
          </button>
          <button
            onClick={() => onCreateFile('main.swift', '// Swift starter\nprint("Hello from Swift on Android!")\n')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[9px] text-orange-400 font-mono"
          >
            +Swift
          </button>
          <button
            onClick={() => onCreateFile('kernel.c', '/* C starter */\n#include <stdio.h>\nint main() {\n    printf("Hello C!\\n");\n    return 0;\n}\n')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[9px] text-cyan-400 font-mono"
          >
            +C
          </button>
          <button
            onClick={() => onCreateFile('server.go', '// Go starter\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello Go!");\n}\n')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[9px] text-teal-400 font-mono"
          >
            +Go
          </button>
          <button
            onClick={() => onCreateFile('App.kt', '// Kotlin starter\nfun main() {\n    println("Hello Kotlin!");\n}\n')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[9px] text-indigo-400 font-mono"
          >
            +Kotlin
          </button>
        </div>
      </div>
    </div>
  );
};
