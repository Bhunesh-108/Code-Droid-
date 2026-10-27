import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { highlightCode } from '../utils/syntaxHighlighter';
import { Search, X, Replace, ChevronDown, ChevronUp } from 'lucide-react';
import { triggerHaptic, HapticPatterns } from '../utils/haptics';

export interface CodeEditorHandle {
  insertText: (text: string, cursorOffset?: number) => void;
  moveCursor: (direction: 'left' | 'right' | 'up' | 'down') => void;
  undo: () => void;
  redo: () => void;
  duplicateLine: () => void;
  toggleComment: () => void;
  indent: () => void;
  outdent: () => void;
  focus: () => void;
}

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (newCode: string) => void;
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
  lineNumbers?: boolean;
  isModified?: boolean;
  touchHaptics?: boolean;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  (
    {
      code,
      language,
      onChange,
      fontSize = 14,
      tabSize = 4,
      wordWrap = false,
      lineNumbers = true,
      isModified = false,
      touchHaptics = true,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineGutterRef = useRef<HTMLDivElement>(null);

    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    const [history, setHistory] = useState<string[]>([code]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Search & Replace state
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [replaceQuery, setReplaceQuery] = useState('');
    const [searchMatches, setSearchMatches] = useState<number[]>([]);
    const [currentMatchIdx, setCurrentMatchIdx] = useState(0);

    // Synchronize scrolling between textarea, highlighted pre, and line numbers gutter
    const handleScroll = () => {
      if (!textareaRef.current) return;
      const top = textareaRef.current.scrollTop;
      const left = textareaRef.current.scrollLeft;

      if (preRef.current) {
        preRef.current.scrollTop = top;
        preRef.current.scrollLeft = left;
      }
      if (lineGutterRef.current) {
        lineGutterRef.current.scrollTop = top;
      }
    };

    // Update cursor position readout
    const updateCursorInfo = () => {
      if (!textareaRef.current) return;
      const pos = textareaRef.current.selectionStart;
      const textUpToCursor = textareaRef.current.value.substring(0, pos);
      const lines = textUpToCursor.split('\n');
      const currentLine = lines.length;
      const currentCol = lines[lines.length - 1].length + 1;
      setCursorPos({ line: currentLine, col: currentCol });
    };

    // Record history for Undo/Redo
    const pushHistory = (newCode: string) => {
      const newHist = history.slice(0, historyIndex + 1);
      newHist.push(newCode);
      if (newHist.length > 50) newHist.shift();
      setHistory(newHist);
      setHistoryIndex(newHist.length - 1);
      onChange(newCode);
    };

    // Imperative methods for touch keyboard and shortcuts
    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      insertText: (text: string, cursorOffset = 0) => {
        if (!textareaRef.current) return;
        const ta = textareaRef.current;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const current = ta.value;

        const next = current.substring(0, start) + text + current.substring(end);
        const newPos = start + text.length + cursorOffset;

        pushHistory(next);
        setTimeout(() => {
          ta.focus();
          ta.setSelectionRange(newPos, newPos);
          updateCursorInfo();
        }, 0);
      },
      moveCursor: (direction: 'left' | 'right' | 'up' | 'down') => {
        if (!textareaRef.current) return;
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        const lines = ta.value.split('\n');

        let currentLineIdx = 0;
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length + 1 > pos) {
            currentLineIdx = i;
            break;
          }
          charCount += lines[i].length + 1;
        }
        const colInLine = pos - charCount;

        let nextPos = pos;
        if (direction === 'left') {
          nextPos = Math.max(0, pos - 1);
        } else if (direction === 'right') {
          nextPos = Math.min(ta.value.length, pos + 1);
        } else if (direction === 'up') {
          if (currentLineIdx > 0) {
            let prevLineStart = 0;
            for (let i = 0; i < currentLineIdx - 1; i++) {
              prevLineStart += lines[i].length + 1;
            }
            const prevLineLen = lines[currentLineIdx - 1].length;
            nextPos = prevLineStart + Math.min(colInLine, prevLineLen);
          }
        } else if (direction === 'down') {
          if (currentLineIdx < lines.length - 1) {
            let nextLineStart = 0;
            for (let i = 0; i <= currentLineIdx; i++) {
              nextLineStart += lines[i].length + 1;
            }
            const nextLineLen = lines[currentLineIdx + 1].length;
            nextPos = nextLineStart + Math.min(colInLine, nextLineLen);
          }
        }

        ta.focus();
        ta.setSelectionRange(nextPos, nextPos);
        updateCursorInfo();
      },
      undo: () => {
        triggerHaptic(HapticPatterns.action, touchHaptics);
        if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          onChange(prev);
        }
      },
      redo: () => {
        triggerHaptic(HapticPatterns.action, touchHaptics);
        if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          onChange(next);
        }
      },
      duplicateLine: () => {
        if (!textareaRef.current) return;
        triggerHaptic(HapticPatterns.action, touchHaptics);
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        const lines = ta.value.split('\n');

        let charCount = 0;
        let lineIdx = 0;
        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length + 1 > pos) {
            lineIdx = i;
            break;
          }
          charCount += lines[i].length + 1;
        }

        const currentLineText = lines[lineIdx];
        lines.splice(lineIdx + 1, 0, currentLineText);
        const newCode = lines.join('\n');
        pushHistory(newCode);
      },
      toggleComment: () => {
        if (!textareaRef.current) return;
        triggerHaptic(HapticPatterns.action, touchHaptics);
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        const lines = ta.value.split('\n');

        let charCount = 0;
        let lineIdx = 0;
        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length + 1 > pos) {
            lineIdx = i;
            break;
          }
          charCount += lines[i].length + 1;
        }

        const line = lines[lineIdx];
        const commentChar = language === 'python' ? '# ' : language === 'alp' ? '; ' : '// ';

        if (line.trim().startsWith(commentChar.trim())) {
          // Uncomment
          lines[lineIdx] = line.replace(commentChar, '').replace(commentChar.trim(), '');
        } else {
          // Comment
          lines[lineIdx] = commentChar + line;
        }

        const newCode = lines.join('\n');
        pushHistory(newCode);
      },
      indent: () => {
        if (!textareaRef.current) return;
        triggerHaptic(HapticPatterns.action, touchHaptics);
        const spaces = ' '.repeat(tabSize);
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        const newCode = ta.value.substring(0, pos) + spaces + ta.value.substring(pos);
        pushHistory(newCode);
        setTimeout(() => {
          ta.setSelectionRange(pos + tabSize, pos + tabSize);
        }, 0);
      },
      outdent: () => {
        if (!textareaRef.current) return;
        triggerHaptic(HapticPatterns.action, touchHaptics);
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        const lines = ta.value.split('\n');
        let charCount = 0;
        let lineIdx = 0;
        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length + 1 > pos) {
            lineIdx = i;
            break;
          }
          charCount += lines[i].length + 1;
        }

        if (lines[lineIdx].startsWith('  ')) {
          lines[lineIdx] = lines[lineIdx].substring(2);
          pushHistory(lines.join('\n'));
        }
      },
    }));

    // Auto-close brackets and quotes on typing
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        triggerHaptic(HapticPatterns.action, touchHaptics);
        const spaces = ' '.repeat(tabSize);
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newCode = ta.value.substring(0, start) + spaces + ta.value.substring(end);
        pushHistory(newCode);
        setTimeout(() => {
          ta.setSelectionRange(start + tabSize, start + tabSize);
        }, 0);
      } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        triggerHaptic(HapticPatterns.keyTap, touchHaptics);
        setShowSearch(!showSearch);
      }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      pushHistory(e.target.value);
      updateCursorInfo();
    };

    // Calculate Search Matches
    useEffect(() => {
      if (!searchQuery.trim()) {
        setSearchMatches([]);
        return;
      }
      const matches: number[] = [];
      let index = code.indexOf(searchQuery);
      while (index !== -1) {
        matches.push(index);
        index = code.indexOf(searchQuery, index + 1);
      }
      setSearchMatches(matches);
      setCurrentMatchIdx(0);
    }, [searchQuery, code]);

    const handleReplace = () => {
      if (searchMatches.length === 0 || !textareaRef.current) return;
      triggerHaptic(HapticPatterns.action, touchHaptics);
      const targetPos = searchMatches[currentMatchIdx];
      const newCode =
        code.substring(0, targetPos) +
        replaceQuery +
        code.substring(targetPos + searchQuery.length);
      pushHistory(newCode);
    };

    const handleReplaceAll = () => {
      if (!searchQuery) return;
      triggerHaptic(HapticPatterns.successPulse, touchHaptics);
      const newCode = code.replaceAll(searchQuery, replaceQuery);
      pushHistory(newCode);
    };

    // Generate line numbers
    const lines = code.split('\n');
    const totalLines = lines.length;

    // Syntax highlighted HTML
    const highlightedHtml = highlightCode(code, language);

    return (
      <div className="relative flex-1 flex flex-col bg-[#1e1e24] overflow-hidden select-text text-zinc-100 font-mono">
        {/* Floating Quick Search & Replace Bar */}
        {showSearch && (
          <div className="absolute top-2 right-4 z-30 bg-[#25252d] border border-[#3e3e4f] shadow-2xl rounded-lg p-2 flex flex-col gap-1.5 text-xs w-72">
            <div className="flex items-center gap-1.5 bg-[#18181f] px-2 py-1 rounded border border-zinc-700">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Find in file..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full text-xs font-mono"
                autoFocus
              />
              <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                {searchMatches.length > 0 ? `${currentMatchIdx + 1} of ${searchMatches.length}` : '0'}
              </span>
              <button
                onClick={() => setShowSearch(false)}
                className="text-zinc-400 hover:text-white"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceQuery}
                onChange={e => setReplaceQuery(e.target.value)}
                className="bg-[#18181f] border border-zinc-700 rounded px-2 py-1 text-xs text-white outline-none w-full font-mono"
              />
              <button
                onClick={handleReplace}
                className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-[11px] text-zinc-200"
                title="Replace match"
              >
                <Replace className="w-3 h-3" />
              </button>
              <button
                onClick={handleReplaceAll}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-[11px] font-semibold text-white whitespace-nowrap"
              >
                All
              </button>
            </div>
          </div>
        )}

        {/* Editor Body */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Line Numbers Gutter */}
          {lineNumbers && (
            <div
              ref={lineGutterRef}
              className="w-12 flex-shrink-0 bg-[#18181d] border-r border-[#2d2d38] select-none text-right pr-2 pt-3 overflow-hidden text-zinc-500 font-mono"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
            >
              {Array.from({ length: totalLines }).map((_, idx) => {
                const lineNum = idx + 1;
                const isCurrent = lineNum === cursorPos.line;
                return (
                  <div
                    key={lineNum}
                    className={`h-[1.6em] transition-colors ${
                      isCurrent ? 'text-zinc-200 font-bold bg-zinc-800/60' : ''
                    }`}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>
          )}

          {/* Code Container */}
          <div className="relative flex-1 h-full overflow-hidden">
            {/* Highlighted syntax backdrop */}
            <pre
              ref={preRef}
              aria-hidden="true"
              className={`absolute inset-0 pointer-events-none p-3 m-0 font-mono overflow-hidden ${
                wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
              }`}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }}
            />

            {/* Editable transparent input area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onKeyUp={updateCursorInfo}
              onClick={updateCursorInfo}
              onScroll={handleScroll}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className={`absolute inset-0 w-full h-full p-3 m-0 bg-transparent text-transparent caret-blue-400 font-mono resize-none outline-none border-none overflow-auto ${
                wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.6,
                WebkitTextFillColor: 'transparent',
              }}
            />
          </div>
        </div>

        {/* Bottom Editor Status Bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#18181d] border-t border-[#2a2a35] text-[11px] text-zinc-400 select-none">
          <div className="flex items-center gap-3">
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
            <span className="hidden sm:inline">Spaces: {tabSize}</span>
            <span>UTF-8</span>
            {isModified && <span className="text-amber-400 font-medium">● Modified</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hover:text-zinc-200 flex items-center gap-1"
              title="Search and Replace"
            >
              <Search className="w-3 h-3" />
              <span className="hidden sm:inline">Find</span>
            </button>
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded uppercase font-semibold text-[10px]">
              {language.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';
