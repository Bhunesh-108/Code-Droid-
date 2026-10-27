import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Code2,
  Palette,
  Zap,
  Globe,
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Lightbulb
} from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (path: string) => void;
  onOpenWebPreview: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  onOpenWebPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'steps' | 'files' | 'glossary'>('concepts');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#1a1a22] border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-[#22222d] border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Beginner Web Guide
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Zero Knowledge Friendly
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Learn how websites work and how to build one on your phone with CodeDroid
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#17171d] px-3 gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'concepts'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            1. The 3 Building Blocks
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            2. Quick Walkthrough
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            3. Explore Sample Files
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            4. Simple Glossary
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: THE 3 BUILDING BLOCKS */}
          {activeTab === 'concepts' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-white">Think of a web page like a human being or a house:</span>
                <p className="mt-1 text-zinc-300">
                  Every website you visit (Google, YouTube, or your own page) is made of three friendly languages working together.
                </p>
              </div>

              {/* HTML Card */}
              <div className="p-3.5 rounded-xl bg-[#20202c] border border-zinc-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs font-bold">
                      <Code2 className="w-4 h-4 inline mr-1" /> HTML
                    </span>
                    <span className="text-white font-bold text-sm">The Skeleton & Structure</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">index.html</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  HTML provides the raw bones and contents: headings, paragraphs, buttons, pictures, and forms.
                  Without HTML, there is nothing on the screen.
                </p>
                <div className="bg-[#121217] p-2.5 rounded-lg font-mono text-[11px] text-amber-300/90 border border-zinc-800">
                  &lt;h1&gt;Hello World&lt;/h1&gt; <span className="text-zinc-500">&lt;!-- Big Heading --&gt;</span><br />
                  &lt;p&gt;This is my first website!&lt;/p&gt; <span className="text-zinc-500">&lt;!-- Paragraph --&gt;</span><br />
                  &lt;button&gt;Click Me&lt;/button&gt; <span className="text-zinc-500">&lt;!-- Clickable Button --&gt;</span>
                </div>
              </div>

              {/* CSS Card */}
              <div className="p-3.5 rounded-xl bg-[#20202c] border border-zinc-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                      <Palette className="w-4 h-4 inline mr-1" /> CSS
                    </span>
                    <span className="text-white font-bold text-sm">The Clothes & Interior Design</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">style.css</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  CSS makes everything look stunning. It chooses background colors, gradients, rounded corners, shadows, and how things arrange neatly on your mobile screen.
                </p>
                <div className="bg-[#121217] p-2.5 rounded-lg font-mono text-[11px] text-sky-300/90 border border-zinc-800">
                  body &#123; background: #0f172a; color: white; &#125;<br />
                  button &#123; border-radius: 8px; background: #2563eb; &#125;
                </div>
              </div>

              {/* JS Card */}
              <div className="p-3.5 rounded-xl bg-[#20202c] border border-zinc-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 font-mono text-xs font-bold">
                      <Zap className="w-4 h-4 inline mr-1" /> JavaScript
                    </span>
                    <span className="text-white font-bold text-sm">The Brain & Muscles</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">app.js</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  JavaScript makes your page alive and interactive. When a visitor taps a button, JS calculates scores, shows alerts, toggles light/dark themes, or fetches data.
                </p>
                <div className="bg-[#121217] p-2.5 rounded-lg font-mono text-[11px] text-emerald-300/90 border border-zinc-800">
                  button.addEventListener('click', () =&gt; &#123;<br />
                  &nbsp;&nbsp;count++;<br />
                  &nbsp;&nbsp;counterDisplay.textContent = count;<br />
                  &#125;);
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP WALKTHROUGH */}
          {activeTab === 'steps' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs leading-relaxed">
                Follow these 4 simple steps directly inside CodeDroid to see your web page running right now:
              </div>

              {/* Step 1 */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#20202c] border border-zinc-800 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs sm:text-sm">Look at the Top Editor Tabs</h4>
                  <p className="text-zinc-300 text-xs">
                    You'll see <code className="text-amber-300 font-mono bg-zinc-800 px-1 py-0.5 rounded">index.html</code>, <code className="text-blue-300 font-mono bg-zinc-800 px-1 py-0.5 rounded">style.css</code>, and <code className="text-yellow-300 font-mono bg-zinc-800 px-1 py-0.5 rounded">app.js</code> already open and ready for you.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#20202c] border border-zinc-800 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs sm:text-sm">Make a Personal Change</h4>
                  <p className="text-zinc-300 text-xs">
                    Tap on <code className="text-amber-300 font-mono bg-zinc-800 px-1 py-0.5 rounded">index.html</code>. Find line 13:
                    <span className="block my-1 text-zinc-100 font-mono bg-[#111116] p-1.5 rounded">
                      &lt;h1&gt;Hello from CodeDroid!&lt;/h1&gt;
                    </span>
                    Change it to your own name, like <code className="text-emerald-300 font-mono">&lt;h1&gt;Welcome to Alex's App!&lt;/h1&gt;</code>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#20202c] border border-zinc-800 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs sm:text-sm">Preview Your Page Live</h4>
                  <p className="text-zinc-300 text-xs">
                    Tap the green <strong className="text-emerald-400">Run</strong> button in the top right, or tap the <strong className="text-emerald-400">Globe (🌐)</strong> icon.
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    A browser window will pop up right inside CodeDroid displaying your live, interactive web page!
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#20202c] border border-zinc-800 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs sm:text-sm">Test the Button Taps</h4>
                  <p className="text-zinc-300 text-xs">
                    In the preview, tap the <strong className="text-blue-300">"Tap Me!"</strong> button to see the counter increase, and tap <strong className="text-blue-300">"Toggle Dark / Light"</strong> to watch the entire page theme switch smoothly!
                  </p>
                </div>
              </div>

              {/* Quick Launch Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenWebPreview();
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all text-xs sm:text-sm"
                >
                  <Globe className="w-4 h-4" />
                  Open Live Web Page Preview Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EXPLORE SAMPLE FILES */}
          {activeTab === 'files' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-300">
                Click any of these files to open it in your editor and start playing with code:
              </p>

              {/* index.html shortcut */}
              <div className="p-3 rounded-xl bg-[#20202c] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="text-orange-400 font-mono">index.html</span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Structure</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Contains the text, heading, interactive buttons, and loads style.css & app.js.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectFile('index.html');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  Edit HTML <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* style.css shortcut */}
              <div className="p-3 rounded-xl bg-[#20202c] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="text-sky-400 font-mono">style.css</span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Design</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Sets modern dark-mode gradient backgrounds, pill badges, and smooth animations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectFile('style.css');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  Edit CSS <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* app.js shortcut */}
              <div className="p-3 rounded-xl bg-[#20202c] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="text-yellow-400 font-mono">app.js</span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Logic</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Listens to button clicks, adds a celebratory badge at 10 clicks, and toggles theme.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectFile('app.js');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  Edit JS <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SIMPLE GLOSSARY */}
          {activeTab === 'glossary' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#20202c] border border-zinc-800">
                <span className="font-bold text-blue-300 font-mono text-xs">&lt;Tag&gt;</span>
                <p className="text-zinc-300 text-xs mt-0.5">
                  Code enclosed in angle brackets like <code className="text-amber-300">&lt;h1&gt;</code> or <code className="text-amber-300">&lt;p&gt;</code> telling the browser what kind of item to draw.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#20202c] border border-zinc-800">
                <span className="font-bold text-purple-300 font-mono text-xs">Attribute (e.g., id="btn", class="primary")</span>
                <p className="text-zinc-300 text-xs mt-0.5">
                  Extra information given to a tag. For example, an <code className="text-purple-300">id</code> is a unique name so JavaScript can easily find that specific button.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#20202c] border border-zinc-800">
                <span className="font-bold text-emerald-300 font-mono text-xs">DOM (Document Object Model)</span>
                <p className="text-zinc-300 text-xs mt-0.5">
                  The live tree of elements in the browser memory. When JavaScript changes the text or color, it modifies the DOM.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#20202c] border border-zinc-800">
                <span className="font-bold text-amber-300 font-mono text-xs">Event Listener (e.g., click / tap)</span>
                <p className="text-zinc-300 text-xs mt-0.5">
                  A small sentinel in JavaScript waiting for user actions (like tapping a screen or typing) to immediately trigger code.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#20202c] border border-zinc-800">
                <span className="font-bold text-sky-300 font-mono text-xs">Console Log (console.log)</span>
                <p className="text-zinc-300 text-xs mt-0.5">
                  A diagnostic note written by the program. In the Live Preview, click the "Console" tab at the top to see your messages!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#1e1e26] border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Tip: You can re-open this guide anytime via the 🎓 icon or Command Palette</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
          >
            Got it, Let's Code!
          </button>
        </div>

      </div>
    </div>
  );
};
