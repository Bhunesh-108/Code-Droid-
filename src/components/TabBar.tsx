import React from 'react';
import { X } from 'lucide-react';
import { OpenTab } from '../types';
import { getLanguageFromFilename } from '../utils/fileSystem';

interface TabBarProps {
  tabs: OpenTab[];
  activeFile: string;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
  modifiedFiles: string[];
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeFile,
  onSelectTab,
  onCloseTab,
  modifiedFiles,
}) => {
  const getLanguageColor = (filename: string) => {
    const lang = getLanguageFromFilename(filename);
    switch (lang) {
      case 'python':
        return 'text-amber-400';
      case 'javascript':
        return 'text-yellow-400';
      case 'c':
        return 'text-cyan-400';
      case 'cpp':
        return 'text-blue-400';
      case 'csharp':
        return 'text-purple-400';
      case 'swift':
        return 'text-orange-400';
      case 'rust':
        return 'text-rose-400';
      case 'go':
        return 'text-teal-400';
      case 'kotlin':
        return 'text-indigo-400';
      case 'alp':
        return 'text-fuchsia-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getLanguageLabel = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py':
        return 'py';
      case 'c':
        return 'c';
      case 'cpp':
      case 'cc':
        return 'c++';
      case 'cs':
        return 'c#';
      case 'swift':
        return 'swift';
      case 'rs':
        return 'rs';
      case 'go':
        return 'go';
      case 'kt':
        return 'kt';
      case 'asm':
      case 'alp':
        return 'alp';
      case 'js':
        return 'js';
      case 'ts':
        return 'ts';
      default:
        return ext || 'txt';
    }
  };

  return (
    <div className="flex items-center bg-[#18181d] border-b border-[#2a2a35] overflow-x-auto no-scrollbar select-none h-9 text-xs">
      <div className="flex items-center h-full flex-1">
        {tabs.map(tab => {
          const isActive = tab.path === activeFile;
          const isModified = modifiedFiles.includes(tab.path);
          const langColor = getLanguageColor(tab.path);
          const label = getLanguageLabel(tab.path);

          return (
            <div
              key={tab.path}
              onClick={() => onSelectTab(tab.path)}
              className={`flex items-center gap-1.5 px-3 h-full cursor-pointer border-r border-[#262631] font-mono transition-colors flex-shrink-0 ${
                isActive
                  ? 'bg-[#1e1e24] text-white border-t-2 border-t-blue-500 font-medium'
                  : 'text-zinc-400 hover:bg-[#202027] hover:text-zinc-200'
              }`}
            >
              <span className={`text-[11px] font-bold ${langColor}`}>
                {label}
              </span>

              <span className="truncate max-w-[120px]">{tab.name}</span>

              {isModified ? (
                <span className="w-2 h-2 rounded-full bg-amber-400 ml-1" title="Unsaved changes" />
              ) : tabs.length > 1 ? (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onCloseTab(tab.path);
                  }}
                  className="p-0.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-white ml-0.5"
                  aria-label={`Close tab ${tab.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
