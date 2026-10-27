import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Send,
  CornerDownLeft,
} from 'lucide-react';
import { GitEngine } from '../utils/gitEngine';
import { TerminalEngine } from '../utils/terminalEngine';

interface TerminalPanelProps {
  files: Record<string, string>;
  git: GitEngine;
  currentFile?: string;
  onClose: () => void;
  onFileChange?: (path: string, content: string | null) => void;
  externalOutput?: string;
}

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  files,
  git,
  currentFile,
  onClose,
  onFileChange,
  externalOutput,
}) => {
  const [activeTab, setActiveTab] = useState<'bash' | 'output'>('bash');
  const [isMaximized, setIsMaximized] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: 'welcome-1',
      type: 'system',
      text: 'CodeDroid Linux Shell (Android 14 / Linux 6.1 aarch64)',
    },
    {
      id: 'welcome-2',
      type: 'output',
      text: 'Type "help" for a list of commands, or tap the quick pills below.',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastOutputRef = useRef(externalOutput);

  // Auto-scroll on new log entries and switch to output tab only when new externalOutput arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (externalOutput && externalOutput !== lastOutputRef.current) {
      lastOutputRef.current = externalOutput;
      setActiveTab('output');
    }
  }, [logs, externalOutput]);

  const runCommand = async (cmdText: string) => {
    if (!cmdText.trim()) return;

    // Add to history
    setHistory(prev => [...prev, cmdText]);
    setHistoryIndex(-1);

    const result = await TerminalEngine.executeCommand(
      cmdText,
      files,
      git,
      currentFile,
      onFileChange
    );

    if (result.clear) {
      setLogs([]);
    } else {
      const newItems: LogLine[] = result.lines.map(l => ({
        id: Math.random().toString(36).substring(2, 9),
        type: l.type,
        text: l.text,
      }));
      setLogs(prev => [...prev, ...newItems]);
    }
    setCommandInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(commandInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setCommandInput(history[nextIdx] || '');
        } else {
          setHistoryIndex(-1);
          setCommandInput('');
        }
      }
    }
  };

  const quickShortcuts = [
    'run',
    'python3 main.py',
    'node index.js',
    'gcc kernel.c',
    'g++ algo.cpp',
    'dotnet run',
    'swift main.swift',
    'cargo run',
    'go run server.go',
    'kotlinc App.kt',
    'nasm addition_alp.asm',
    'git status',
    'git diff',
    'ls',
    'clear',
  ];

  return (
    <div
      className={`border-t border-[#31313e] bg-[#141418] flex flex-col text-xs font-mono transition-all duration-200 z-30 shadow-2xl ${
        isMaximized ? 'h-[75vh]' : 'h-64 sm:h-72'
      }`}
    >
      {/* Terminal Title Bar & Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#191920] border-b border-[#282833] select-none text-zinc-300">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('bash')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                activeTab === 'bash'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'hover:text-white text-zinc-400'
              }`}
            >
              bash
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                activeTab === 'output'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'hover:text-white text-zinc-400'
              }`}
            >
              Output
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs([])}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded"
            title="Clear terminal"
            aria-label="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded"
            title={isMaximized ? 'Restore height' : 'Maximize terminal'}
            aria-label={isMaximized ? 'Restore height' : 'Maximize terminal'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded"
            title="Close terminal"
            aria-label="Close terminal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {activeTab === 'bash' ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#121216]">
          {/* Output Log Stream */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 font-mono text-[11.5px] leading-relaxed">
            {logs.map(log => {
              let colorClass = 'text-zinc-300';
              if (log.type === 'input') colorClass = 'text-sky-300 font-bold';
              else if (log.type === 'error') colorClass = 'text-red-400 font-medium';
              else if (log.type === 'success') colorClass = 'text-emerald-400 font-semibold';
              else if (log.type === 'system') colorClass = 'text-zinc-500 italic';

              return (
                <div key={log.id} className={`${colorClass} whitespace-pre-wrap break-words`}>
                  {log.text}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Touch Command Chips for Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-2 py-1.5 bg-[#17171d] border-t border-[#262630] no-scrollbar">
            {quickShortcuts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => runCommand(chip)}
                className="flex-shrink-0 px-2 py-0.5 bg-[#23232c] hover:bg-[#2e2e3a] active:bg-sky-600 active:text-white text-zinc-300 rounded text-[10px] border border-zinc-700/60 font-mono transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Command Prompt Input */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a1a21] border-t border-[#2d2d38]">
            <span className="text-emerald-400 font-bold select-none text-xs">droid@mobile:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g., python3 main.py)..."
              className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-zinc-600"
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
            />
            <button
              onClick={() => runCommand(commandInput)}
              className="p-1 text-sky-400 hover:text-sky-300 active:scale-95 transition-transform"
              aria-label="Send command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Direct Output Tab */
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs bg-[#121216] whitespace-pre-wrap text-zinc-200">
          {externalOutput || (
            <div className="text-zinc-500 italic">No execution output yet. Click 'Run' to execute active file.</div>
          )}
        </div>
      )}
    </div>
  );
};
