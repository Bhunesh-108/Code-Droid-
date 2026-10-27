import React from 'react';
import { X, Check, FileCode, RotateCcw } from 'lucide-react';
import { FileDiffLine } from '../types';

interface GitDiffModalProps {
  filePath: string;
  diffLines: FileDiffLine[];
  onClose: () => void;
  onStage?: () => void;
  onDiscard?: () => void;
  isStaged?: boolean;
}

export const GitDiffModal: React.FC<GitDiffModalProps> = ({
  filePath,
  diffLines,
  onClose,
  onStage,
  onDiscard,
  isStaged = false,
}) => {
  const additions = diffLines.filter(d => d.type === 'add').length;
  const deletions = diffLines.filter(d => d.type === 'del').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#1e1e25] border border-[#383849] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#17171d] border-b border-[#2d2d3a]">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span className="font-mono font-bold text-sm text-white">{filePath}</span>
            <span className="text-zinc-500 text-[11px]">(Working Tree Diff)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono font-semibold">+{additions}</span>
            <span className="text-red-400 font-mono font-semibold">-{deletions}</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white ml-2"
              aria-label="Close diff modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diff Content View */}
        <div className="flex-1 overflow-auto font-mono text-[12px] bg-[#141418] p-1 select-text">
          {diffLines.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 italic">No differences found with HEAD</div>
          ) : (
            diffLines.map((line, idx) => {
              const isAdd = line.type === 'add';
              const isDel = line.type === 'del';

              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 leading-relaxed font-mono ${
                    isAdd
                      ? 'bg-emerald-950/40 text-emerald-200'
                      : isDel
                      ? 'bg-red-950/40 text-red-200 line-through opacity-80'
                      : 'text-zinc-400'
                  }`}
                >
                  {/* Old line number */}
                  <span className="w-8 text-right pr-2 text-zinc-600 select-none text-[11px]">
                    {line.oldLineNumber || ''}
                  </span>
                  {/* New line number */}
                  <span className="w-8 text-right pr-2 text-zinc-600 select-none text-[11px]">
                    {line.newLineNumber || ''}
                  </span>
                  {/* Prefix marker */}
                  <span
                    className={`w-4 font-bold select-none ${
                      isAdd ? 'text-emerald-400' : isDel ? 'text-red-400' : 'text-transparent'
                    }`}
                  >
                    {isAdd ? '+' : isDel ? '-' : ' '}
                  </span>
                  {/* Code line */}
                  <pre className="flex-1 m-0 whitespace-pre overflow-x-auto">{line.content || ' '}</pre>
                </div>
              );
            })
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#17171d] border-t border-[#2d2d3a]">
          <div className="flex items-center gap-2">
            {onDiscard && (
              <button
                onClick={() => {
                  onDiscard();
                  onClose();
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-red-400 hover:bg-red-950/50 rounded border border-red-900/60 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Discard
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium"
            >
              Close
            </button>
            {onStage && (
              <button
                onClick={() => {
                  onStage();
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> {isStaged ? 'Already Staged' : 'Stage File'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
