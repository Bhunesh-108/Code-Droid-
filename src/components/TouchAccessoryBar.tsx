import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Undo2,
  Redo2,
  Copy,
  Hash,
  Indent,
  Outdent,
} from 'lucide-react';
import { triggerHaptic, HapticPatterns } from '../utils/haptics';

interface TouchAccessoryBarProps {
  onInsertText: (text: string, cursorOffset?: number) => void;
  onMoveCursor: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onUndo: () => void;
  onRedo: () => void;
  onDuplicateLine: () => void;
  onToggleComment: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  tabSize?: number;
  touchHaptics?: boolean;
}

export const TouchAccessoryBar: React.FC<TouchAccessoryBarProps> = ({
  onInsertText,
  onMoveCursor,
  onUndo,
  onRedo,
  onDuplicateLine,
  onToggleComment,
  onIndent,
  onOutdent,
  tabSize = 4,
  touchHaptics = true,
}) => {
  const quickSymbols = [
    { label: 'TAB', insert: ' '.repeat(tabSize), bold: true },
    { label: '{ }', insert: '{}', offset: -1 },
    { label: '( )', insert: '()', offset: -1 },
    { label: '[ ]', insert: '[]', offset: -1 },
    { label: '< >', insert: '<>', offset: -1 },
    { label: ';', insert: ';' },
    { label: ':', insert: ':' },
    { label: '=', insert: ' = ' },
    { label: '==', insert: ' == ' },
    { label: '=>', insert: ' => ' },
    { label: '" "', insert: '""', offset: -1 },
    { label: "' '", insert: "''", offset: -1 },
    { label: '` `', insert: '``', offset: -1 },
    { label: '$', insert: '$' },
    { label: '#', insert: '#' },
    { label: '&', insert: '&' },
    { label: '&&', insert: ' && ' },
    { label: '|', insert: '|' },
    { label: '||', insert: ' || ' },
    { label: '!', insert: '!' },
    { label: '!=', insert: ' != ' },
    { label: '+', insert: ' + ' },
    { label: '-', insert: ' - ' },
    { label: '*', insert: ' * ' },
    { label: '/', insert: ' / ' },
    { label: '%', insert: ' % ' },
    { label: '_', insert: '_' },
    { label: '\\', insert: '\\' },
    { label: '?', insert: '?' },
    { label: '->', insert: '->' },
    { label: '//', insert: '// ' },
  ];

  const handleSymbolClick = (insert: string, offset?: number) => {
    triggerHaptic(HapticPatterns.keyTap, touchHaptics);
    onInsertText(insert, offset);
  };

  const handleCursorClick = (dir: 'left' | 'right' | 'up' | 'down') => {
    triggerHaptic(HapticPatterns.caretNudge, touchHaptics);
    onMoveCursor(dir);
  };

  const handleActionClick = (actionFn: () => void) => {
    triggerHaptic(HapticPatterns.action, touchHaptics);
    actionFn();
  };

  return (
    <div className="bg-[#1c1c22] border-t border-[#31313d] flex flex-col select-none shadow-lg z-20">
      {/* Scrollable Symbol Row */}
      <div className="flex items-center gap-1 overflow-x-auto py-1 px-1.5 no-scrollbar scroll-smooth">
        {quickSymbols.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSymbolClick(item.insert, item.offset)}
            className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-mono transition-colors active:scale-95 ${
              item.bold
                ? 'bg-blue-600/40 text-blue-200 border border-blue-500/40 font-bold'
                : 'bg-[#292934] hover:bg-[#343444] active:bg-blue-600 active:text-white text-zinc-200 border border-zinc-700/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Navigation & Action Controls Row */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#16161b] border-t border-[#26262f] text-zinc-300">
        {/* Caret Nudge Controls */}
        <div className="flex items-center gap-0.5 bg-[#23232c] p-0.5 rounded-md border border-zinc-700/50">
          <button
            type="button"
            onClick={() => handleCursorClick('left')}
            className="p-1 hover:bg-zinc-700 active:bg-blue-600 rounded active:text-white"
            title="Move caret left"
            aria-label="Move caret left"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleCursorClick('down')}
            className="p-1 hover:bg-zinc-700 active:bg-blue-600 rounded active:text-white"
            title="Move caret down"
            aria-label="Move caret down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleCursorClick('up')}
            className="p-1 hover:bg-zinc-700 active:bg-blue-600 rounded active:text-white"
            title="Move caret up"
            aria-label="Move caret up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleCursorClick('right')}
            className="p-1 hover:bg-zinc-700 active:bg-blue-600 rounded active:text-white"
            title="Move caret right"
            aria-label="Move caret right"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Operations: Undo / Redo / Duplicate / Comment / Indent */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleActionClick(onUndo)}
            className="p-1.5 bg-[#23232c] hover:bg-zinc-700 active:bg-blue-600 active:text-white rounded text-zinc-300"
            title="Undo"
            aria-label="Undo edit"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick(onRedo)}
            className="p-1.5 bg-[#23232c] hover:bg-zinc-700 active:bg-blue-600 active:text-white rounded text-zinc-300"
            title="Redo"
            aria-label="Redo edit"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick(onIndent)}
            className="p-1.5 bg-[#23232c] hover:bg-zinc-700 active:bg-blue-600 active:text-white rounded text-zinc-300"
            title="Indent"
            aria-label="Indent line"
          >
            <Indent className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick(onOutdent)}
            className="p-1.5 bg-[#23232c] hover:bg-zinc-700 active:bg-blue-600 active:text-white rounded text-zinc-300"
            title="Outdent"
            aria-label="Outdent line"
          >
            <Outdent className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick(onDuplicateLine)}
            className="p-1.5 bg-[#23232c] hover:bg-zinc-700 active:bg-blue-600 active:text-white rounded text-zinc-300"
            title="Duplicate line"
            aria-label="Duplicate line"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleActionClick(onToggleComment)}
            className="p-1.5 bg-[#23232c] hover:bg-zinc-700 active:bg-blue-600 active:text-white rounded text-zinc-300"
            title="Toggle comment"
            aria-label="Toggle comment"
          >
            <Hash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
