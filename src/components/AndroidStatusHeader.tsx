import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Play,
  Smartphone,
  Maximize2,
  Terminal as TerminalIcon,
  Search,
  GitBranch,
  Settings,
  Cpu,
  RotateCw,
  FolderOpen,
  Globe,
  GraduationCap
} from 'lucide-react';

interface AndroidStatusHeaderProps {
  currentBranch: string;
  branches: string[];
  onSelectBranch: (branch: string) => void;
  onCreateBranch: (branch: string) => void;
  isMobileDeviceView: boolean;
  onToggleDeviceView: () => void;
  onRunCurrentFile: () => void;
  onOpenTerminal: () => void;
  onOpenCommandPalette: () => void;
  onOpenWebPreview?: () => void;
  onOpenGuide?: () => void;
  onToggleSidebarTab: (tab: 'files' | 'git' | 'search' | 'alp' | 'settings') => void;
  activeSidebarTab: 'files' | 'git' | 'search' | 'alp' | 'settings' | null;
  isRunning?: boolean;
  activeFileName?: string;
}

export const AndroidStatusHeader: React.FC<AndroidStatusHeaderProps> = ({
  currentBranch,
  branches,
  onSelectBranch,
  onCreateBranch,
  isMobileDeviceView,
  onToggleDeviceView,
  onRunCurrentFile,
  onOpenTerminal,
  onOpenCommandPalette,
  onOpenWebPreview,
  onOpenGuide,
  onToggleSidebarTab,
  activeSidebarTab,
  isRunning = false,
  activeFileName,
}) => {
  const [time, setTime] = useState<string>('12:45');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBranchInput.trim()) {
      onCreateBranch(newBranchInput.trim());
      setNewBranchInput('');
      setShowNewBranch(false);
      setShowBranchDropdown(false);
    }
  };

  return (
    <header className="flex flex-col bg-[#1f1f23] border-b border-[#2d2d34] text-zinc-200 select-none">
      {/* Android Top System Bar (Only visible in Phone View or full top) */}
      <div className="flex items-center justify-between px-3.5 py-1 text-[11px] font-medium text-zinc-400 bg-[#18181c]">
        <div className="flex items-center gap-2">
          <span>{time}</span>
          <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1 rounded font-mono">5G</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Wifi className="w-3.5 h-3.5 text-zinc-300" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">98%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main IDE App Navigation Bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 h-12 bg-[#25252b]">
        {/* Left: Brand + Branch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSidebarTab('files')}
            className={`p-1.5 rounded-md hover:bg-zinc-700/60 active:scale-95 transition-all ${
              activeSidebarTab === 'files' ? 'bg-blue-600/30 text-blue-400' : 'text-zinc-300'
            }`}
            title="Files Explorer"
            aria-label="Files Explorer"
          >
            <FolderOpen className="w-5 h-5 text-blue-400" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                <span className="text-blue-400 font-black">Code</span>Droid
              </span>
              <span className="text-[9px] uppercase px-1 py-0.2 bg-zinc-700/80 text-zinc-300 rounded font-semibold">
                Mobile
              </span>
            </div>

            {/* Git Branch Selector */}
            <div className="relative">
              <button
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 focus:outline-none"
                aria-label="Select Git branch"
              >
                <GitBranch className="w-3 h-3 text-emerald-400" />
                <span className="font-mono truncate max-w-[85px] text-emerald-400 font-medium">
                  {currentBranch}
                </span>
                <span className="text-[9px]">▾</span>
              </button>

              {showBranchDropdown && (
                <div className="absolute left-0 top-6 z-50 w-52 bg-[#1e1e24] border border-[#3f3f4e] rounded-lg shadow-xl p-2 text-xs">
                  <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 px-1">
                    Git Branches
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-0.5">
                    {branches.map(b => (
                      <button
                        key={b}
                        onClick={() => {
                          onSelectBranch(b);
                          setShowBranchDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center justify-between text-xs ${
                          b === currentBranch ? 'bg-blue-600/40 text-blue-300 font-bold' : 'hover:bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <span className="font-mono truncate">{b}</span>
                        {b === currentBranch && <span className="text-[10px] text-blue-400">active</span>}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-700/60 mt-1.5 pt-1.5">
                    {!showNewBranch ? (
                      <button
                        onClick={() => setShowNewBranch(true)}
                        className="w-full text-left px-2 py-1 text-blue-400 hover:bg-blue-900/30 rounded text-[11px] font-medium"
                      >
                        + Create new branch...
                      </button>
                    ) : (
                      <form onSubmit={handleBranchSubmit} className="space-y-1">
                        <input
                          type="text"
                          value={newBranchInput}
                          onChange={e => setNewBranchInput(e.target.value)}
                          placeholder="branch-name"
                          className="w-full bg-[#121215] border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                          autoFocus
                        />
                        <div className="flex gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowNewBranch(false)}
                            className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold"
                          >
                            Create
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Quick Action Icons for Mobile Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleSidebarTab('git')}
            className={`p-1.5 rounded-md hover:bg-zinc-700/60 active:scale-95 transition-all ${
              activeSidebarTab === 'git' ? 'bg-emerald-600/30 text-emerald-400' : 'text-zinc-400'
            }`}
            title="Git Source Control"
            aria-label="Git Source Control"
          >
            <GitBranch className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleSidebarTab('search')}
            className={`p-1.5 rounded-md hover:bg-zinc-700/60 active:scale-95 transition-all ${
              activeSidebarTab === 'search' ? 'bg-amber-600/30 text-amber-400' : 'text-zinc-400'
            }`}
            title="Search Files"
            aria-label="Search Files"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleSidebarTab('alp')}
            className={`p-1.5 rounded-md hover:bg-zinc-700/60 active:scale-95 transition-all ${
              activeSidebarTab === 'alp' ? 'bg-purple-600/30 text-purple-400' : 'text-zinc-400'
            }`}
            title="8086 ALP CPU & Registers"
            aria-label="8086 ALP CPU and Registers"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={onOpenTerminal}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60 active:scale-95 rounded-md transition-all"
            title="Built-in Terminal"
            aria-label="Built-in Terminal"
          >
            <TerminalIcon className="w-4 h-4 text-sky-400" />
          </button>

          {onOpenWebPreview && (
            <button
              onClick={onOpenWebPreview}
              className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 active:scale-95 rounded-md transition-all"
              title="Live Web Page Preview (HTML / CSS / JS)"
              aria-label="Live Web Page Preview"
            >
              <Globe className="w-4 h-4" />
            </button>
          )}

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 active:scale-95 rounded-md transition-all"
              title="Beginner Guide: How Web Development Works"
              aria-label="Beginner Guide"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onToggleSidebarTab('settings')}
            className={`p-1.5 rounded-md hover:bg-zinc-700/60 active:scale-95 transition-all ${
              activeSidebarTab === 'settings' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400'
            }`}
            title="IDE Settings"
            aria-label="IDE Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Quick Run Button + Viewport Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRunCurrentFile}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
            title={`Run ${activeFileName || 'Code'}`}
            aria-label={`Run ${activeFileName || 'Code'}`}
          >
            {isRunning ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="text-[11px] font-bold">Run</span>
          </button>

          {/* Toggle Phone Frame View vs Full Desktop/Fluid */}
          <button
            onClick={onToggleDeviceView}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700/60 rounded-md transition-colors"
            title={isMobileDeviceView ? 'Switch to Fullscreen/Fluid View' : 'Switch to Android Phone Bezel Frame'}
            aria-label={isMobileDeviceView ? 'Switch to Fullscreen View' : 'Switch to Android Phone Bezel Frame'}
          >
            {isMobileDeviceView ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
