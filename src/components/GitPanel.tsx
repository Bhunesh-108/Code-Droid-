import React, { useState } from 'react';
import {
  GitCommit as GitCommitIcon,
  Plus,
  Minus,
  RotateCcw,
  GitBranch,
  Check,
  FileCode,
  Clock,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { GitCommit, GitStatus } from '../types';

interface GitPanelProps {
  status: GitStatus;
  onStageFile: (path: string) => void;
  onUnstageFile: (path: string) => void;
  onStageAll: () => void;
  onUnstageAll: () => void;
  onDiscardChanges: (path: string) => void;
  onCommit: (message: string) => void;
  onViewDiff: (path: string) => void;
  onCreateBranch: (name: string) => void;
  onSelectBranch: (name: string) => void;
}

export const GitPanel: React.FC<GitPanelProps> = ({
  status,
  onStageFile,
  onUnstageFile,
  onStageAll,
  onUnstageAll,
  onDiscardChanges,
  onCommit,
  onViewDiff,
  onCreateBranch,
  onSelectBranch,
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [stagedExpanded, setStagedExpanded] = useState(true);
  const [changesExpanded, setChangesExpanded] = useState(true);

  const handleCommitSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commitMessage.trim()) return;
    onCommit(commitMessage.trim());
    setCommitMessage('');
  };

  const handleQuickPreset = (prefix: string) => {
    setCommitMessage(prev => (prev ? `${prefix} ${prev.replace(/^[a-z]+:\s*/, '')}` : `${prefix} `));
  };

  const totalChanges =
    status.stagedFiles.length + status.unstagedFiles.length + status.untrackedFiles.length;

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e24] text-zinc-200 overflow-hidden text-xs">
      {/* Git Source Control Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d38] bg-[#18181d]">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
            Source Control
          </span>
          {totalChanges > 0 && (
            <span className="bg-blue-600 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
              {totalChanges}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1 rounded hover:bg-zinc-700/60 transition-colors ${
              showHistory ? 'text-blue-400 bg-blue-900/30' : 'text-zinc-400'
            }`}
            title="Commit History Log"
            aria-label="Commit History Log"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showHistory ? (
        /* Commit History View */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-700/60">
            <span className="text-[11px] font-bold text-zinc-300 uppercase">Commit Log</span>
            <button
              onClick={() => setShowHistory(false)}
              className="text-blue-400 hover:underline text-[11px]"
            >
              Back to changes
            </button>
          </div>

          <div className="space-y-2">
            {status.commits.map((c: GitCommit) => (
              <div
                key={c.hash}
                className="bg-[#24242d] border border-zinc-700/60 rounded-lg p-2.5 space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">{c.hash}</span>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-zinc-100 font-medium">{c.message}</div>
                <div className="text-[10px] text-zinc-400 truncate">{c.author}</div>
                <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-700/40">
                  {c.filesChanged.length} file(s) changed: {c.filesChanged.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Working Trees & Commit Box */
        <div className="flex-1 overflow-y-auto flex flex-col p-2.5 gap-3">
          {/* Commit Message Box */}
          <div className="bg-[#24242d] border border-zinc-700/80 rounded-lg p-2.5 flex flex-col gap-2 shadow-sm">
            <textarea
              value={commitMessage}
              onChange={e => setCommitMessage(e.target.value)}
              placeholder="Commit message (e.g., feat: add prime check)..."
              rows={2}
              className="bg-[#18181f] border border-zinc-700 rounded-md p-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-blue-500 resize-none font-mono"
            />

            {/* Quick Commit Presets */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {['feat:', 'fix:', 'refactor:', 'docs:', 'test:', 'alp:'].map(prefix => (
                <button
                  key={prefix}
                  onClick={() => handleQuickPreset(prefix)}
                  className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] font-mono text-zinc-300 border border-zinc-700"
                >
                  {prefix}
                </button>
              ))}
            </div>

            {/* Primary Commit Button */}
            <button
              onClick={() => handleCommitSubmit()}
              disabled={status.stagedFiles.length === 0 || !commitMessage.trim()}
              className={`w-full py-1.5 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                status.stagedFiles.length > 0 && commitMessage.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Commit ({status.stagedFiles.length} staged)</span>
            </button>
          </div>

          {/* Staged Changes Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-zinc-400 px-1 py-0.5 font-bold uppercase text-[10px] tracking-wider">
              <button
                onClick={() => setStagedExpanded(!stagedExpanded)}
                className="flex items-center gap-1 hover:text-zinc-200"
              >
                {stagedExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Staged Changes ({status.stagedFiles.length})</span>
              </button>
              {status.stagedFiles.length > 0 && (
                <button
                  onClick={onUnstageAll}
                  className="text-zinc-400 hover:text-red-400 flex items-center gap-0.5 lowercase font-normal"
                  title="Unstage all"
                >
                  <Minus className="w-3 h-3" /> unstage all
                </button>
              )}
            </div>

            {stagedExpanded && (
              <div className="space-y-0.5 pl-1">
                {status.stagedFiles.length === 0 ? (
                  <div className="text-zinc-500 italic text-[11px] px-2 py-1">No staged changes</div>
                ) : (
                  status.stagedFiles.map(file => (
                    <div
                      key={file}
                      className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#282833] bg-[#22222a]"
                    >
                      <button
                        onClick={() => onViewDiff(file)}
                        className="flex items-center gap-2 flex-1 text-left truncate"
                        title="Click to view diff"
                      >
                        <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="font-mono text-zinc-200 truncate">{file}</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded">
                          S
                        </span>
                      </button>

                      <button
                        onClick={() => onUnstageFile(file)}
                        className="p-1 hover:text-red-400 rounded hover:bg-zinc-700/60"
                        title="Unstage file"
                        aria-label={`Unstage ${file}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Unstaged & Untracked Changes Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-zinc-400 px-1 py-0.5 font-bold uppercase text-[10px] tracking-wider">
              <button
                onClick={() => setChangesExpanded(!changesExpanded)}
                className="flex items-center gap-1 hover:text-zinc-200"
              >
                {changesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>
                  Changes ({status.unstagedFiles.length + status.untrackedFiles.length})
                </span>
              </button>
              {status.unstagedFiles.length + status.untrackedFiles.length > 0 && (
                <button
                  onClick={onStageAll}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 lowercase font-normal"
                  title="Stage all changes"
                >
                  <Plus className="w-3 h-3" /> stage all
                </button>
              )}
            </div>

            {changesExpanded && (
              <div className="space-y-0.5 pl-1">
                {status.unstagedFiles.length === 0 && status.untrackedFiles.length === 0 ? (
                  <div className="text-zinc-500 italic text-[11px] px-2 py-1">Working tree clean</div>
                ) : (
                  <>
                    {status.unstagedFiles.map(file => (
                      <div
                        key={file}
                        className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#282833] bg-[#22222a]"
                      >
                        <button
                          onClick={() => onViewDiff(file)}
                          className="flex items-center gap-2 flex-1 text-left truncate"
                          title="Click to view diff"
                        >
                          <FileCode className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="font-mono text-zinc-200 truncate">{file}</span>
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-1 rounded">
                            M
                          </span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onDiscardChanges(file)}
                            className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-700/60"
                            title="Discard changes"
                            aria-label={`Discard changes in ${file}`}
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onStageFile(file)}
                            className="p-1 text-blue-400 hover:text-blue-300 rounded hover:bg-zinc-700/60"
                            title="Stage file"
                            aria-label={`Stage ${file}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {status.untrackedFiles.map(file => (
                      <div
                        key={file}
                        className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#282833] bg-[#22222a]"
                      >
                        <div className="flex items-center gap-2 flex-1 text-left truncate">
                          <FileCode className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="font-mono text-zinc-200 truncate">{file}</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded">
                            U
                          </span>
                        </div>

                        <button
                          onClick={() => onStageFile(file)}
                          className="p-1 text-blue-400 hover:text-blue-300 rounded hover:bg-zinc-700/60"
                          title="Stage untracked file"
                          aria-label={`Stage untracked ${file}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
