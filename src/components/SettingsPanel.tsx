import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Type, Palette, Vibrate, VibrateOff } from 'lucide-react';
import { EditorSettings, ThemeType } from '../types';
import { triggerHaptic, HapticPatterns } from '../utils/haptics';

interface SettingsPanelProps {
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [testedHaptic, setTestedHaptic] = useState(false);

  const handleTestHaptic = () => {
    triggerHaptic(HapticPatterns.successPulse, true);
    setTestedHaptic(true);
    setTimeout(() => setTestedHaptic(false), 800);
  };

  const themes: { id: ThemeType; name: string }[] = [
    { id: 'vscode-dark', name: 'VS Code Dark+ (Default)' },
    { id: 'one-dark', name: 'One Dark Pro' },
    { id: 'dracula', name: 'Dracula Theme' },
    { id: 'monokai', name: 'Monokai' },
    { id: 'github-dark', name: 'GitHub Dark High Contrast' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e24] text-zinc-200 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d38] bg-[#18181d]">
        <div className="flex items-center gap-1.5">
          <SettingsIcon className="w-4 h-4 text-zinc-300" />
          <span className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
            IDE Preferences
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Editor Theme */}
        <div className="space-y-1.5">
          <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            Color Theme
          </label>
          <select
            value={settings.theme}
            onChange={e => onUpdateSettings({ theme: e.target.value as ThemeType })}
            className="w-full bg-[#16161b] border border-zinc-700 rounded-md p-2 text-xs text-white outline-none"
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-zinc-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" /> Font Size
            </span>
            <span className="font-mono text-blue-400">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min={11}
            max={22}
            value={settings.fontSize}
            onChange={e => onUpdateSettings({ fontSize: Number(e.target.value) })}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>Compact (11px)</span>
            <span>Mobile Large (22px)</span>
          </div>
        </div>

        {/* Tab Size */}
        <div className="space-y-1.5">
          <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            Tab Indentation Size
          </label>
          <div className="flex gap-2">
            {[2, 4].map(sz => (
              <button
                key={sz}
                onClick={() => onUpdateSettings({ tabSize: sz })}
                className={`flex-1 py-1.5 rounded-md border text-center font-mono font-bold ${
                  settings.tabSize === sz
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                    : 'bg-[#24242d] border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {sz} Spaces
              </button>
            ))}
          </div>
        </div>

        {/* Word Wrap Toggle */}
        <div className="flex items-center justify-between p-2.5 bg-[#24242d] border border-zinc-700/60 rounded-lg">
          <div>
            <div className="font-semibold text-zinc-200">Soft Word Wrap</div>
            <div className="text-[10px] text-zinc-400">Wrap long lines to fit mobile screen width</div>
          </div>
          <input
            type="checkbox"
            checked={settings.wordWrap}
            onChange={e => onUpdateSettings({ wordWrap: e.target.checked })}
            className="w-4 h-4 accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Line Numbers Toggle */}
        <div className="flex items-center justify-between p-2.5 bg-[#24242d] border border-zinc-700/60 rounded-lg">
          <div>
            <div className="font-semibold text-zinc-200">Show Line Numbers</div>
            <div className="text-[10px] text-zinc-400">Display left gutter with code line index</div>
          </div>
          <input
            type="checkbox"
            checked={settings.lineNumbers}
            onChange={e => onUpdateSettings({ lineNumbers: e.target.checked })}
            className="w-4 h-4 accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Touch Haptics (Vibration) Toggle */}
        <div className="p-2.5 bg-[#24242d] border border-zinc-700/60 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.touchHaptics ? (
                <Vibrate className="w-4 h-4 text-emerald-400" />
              ) : (
                <VibrateOff className="w-4 h-4 text-zinc-500" />
              )}
              <div>
                <div className="font-semibold text-zinc-200">Touch Haptics (Vibration)</div>
                <div className="text-[10px] text-zinc-400">
                  Tactile feedback for accessory bar keys, cursor & edits
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.touchHaptics}
              onChange={e => {
                const enabled = e.target.checked;
                onUpdateSettings({ touchHaptics: enabled });
                if (enabled) {
                  triggerHaptic(HapticPatterns.action, true);
                }
              }}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {settings.touchHaptics && (
            <div className="pt-2 border-t border-zinc-700/40 flex items-center justify-between gap-2">
              <span className="text-[10px] text-zinc-400 leading-tight">
                Works on Android Chrome, Firefox & mobile WebViews
              </span>
              <button
                type="button"
                onClick={handleTestHaptic}
                className="px-2.5 py-1 text-[11px] font-medium rounded bg-[#1b1b22] hover:bg-[#2b2b36] active:bg-[#323242] border border-zinc-600 text-zinc-200 flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
              >
                <Vibrate className={`w-3 h-3 ${testedHaptic ? 'text-emerald-400 scale-125' : 'text-zinc-400'} transition-transform`} />
                {testedHaptic ? 'Vibrated!' : 'Test Vibration'}
              </button>
            </div>
          )}
        </div>

        {/* About Info */}
        <div className="pt-2 border-t border-zinc-700/60 space-y-1 text-zinc-400 text-[11px]">
          <div className="font-semibold text-zinc-300">CodeDroid Mobile IDE v1.2</div>
          <div>Built for Android touch coding with VS Code ergonomics.</div>
          <div className="text-zinc-500">Offline-first local storage supported.</div>
        </div>
      </div>
    </div>
  );
};
