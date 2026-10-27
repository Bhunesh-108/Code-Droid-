import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Replace, FileCode } from 'lucide-react';

interface SearchPanelProps {
  files: Record<string, string>;
  onSelectFile: (path: string) => void;
  onReplaceInFile: (path: string, newContent: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  files,
  onSelectFile,
  onReplaceInFile,
}) => {
  const [query, setQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const results: { path: string; lineNum: number; lineText: string }[] = [];

    for (const [path, content] of Object.entries(files)) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            path,
            lineNum: idx + 1,
            lineText: line.trim(),
          });
        }
      });
    }
    return results;
  }, [files, query]);

  const handleReplaceAllAcrossFiles = () => {
    if (!query.trim()) return;
    for (const [path, content] of Object.entries(files)) {
      if (content.includes(query)) {
        const updated = content.replaceAll(query, replaceText);
        onReplaceInFile(path, updated);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e24] text-zinc-200 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d38] bg-[#18181d]">
        <div className="flex items-center gap-1.5">
          <SearchIcon className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
            Global Search
          </span>
        </div>
        {searchResults.length > 0 && (
          <span className="text-[10px] text-zinc-400 font-mono">
            {searchResults.length} match{searchResults.length === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-2 bg-[#23232c] border-b border-zinc-700/60">
        <div className="flex items-center gap-1.5 bg-[#17171d] border border-zinc-700 rounded-md px-2 py-1.5">
          <SearchIcon className="w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all files..."
            className="w-full bg-transparent text-white outline-none font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex-1 flex items-center gap-1.5 bg-[#17171d] border border-zinc-700 rounded-md px-2 py-1.5">
            <Replace className="w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={replaceText}
              onChange={e => setReplaceText(e.target.value)}
              placeholder="Replace with..."
              className="w-full bg-transparent text-white outline-none font-mono text-xs"
            />
          </div>
          <button
            onClick={handleReplaceAllAcrossFiles}
            disabled={!query.trim()}
            className={`px-2 py-1.5 rounded font-semibold text-[10px] uppercase tracking-wider transition-colors ${
              query.trim()
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Replace All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {query.trim() === '' ? (
          <div className="p-4 text-center text-zinc-500 italic">Type a keyword to search files</div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 italic">No matches found for "{query}"</div>
        ) : (
          searchResults.map((res, idx) => (
            <div
              key={idx}
              onClick={() => onSelectFile(res.path)}
              className="p-2 rounded bg-[#24242d] hover:bg-[#2b2b36] border border-zinc-700/50 cursor-pointer space-y-0.5"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px]">
                <FileCode className="w-3 h-3" />
                <span>{res.path}</span>
                <span className="text-zinc-500 text-[10px]">: line {res.lineNum}</span>
              </div>
              <div className="text-zinc-300 font-mono text-[11.5px] truncate pl-4 text-zinc-400">
                {res.lineText}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
