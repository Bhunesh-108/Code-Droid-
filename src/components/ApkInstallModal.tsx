import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  CheckCircle2,
  Copy,
  Cpu,
  WifiOff,
  GitBranch,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'offline'>('pwa');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#18181f] border border-[#2e2e3d] rounded-xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl text-zinc-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2e2e3d] bg-[#1f1f2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                Install CodeDroid on Phone
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                  Offline Ready
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Working APK (Gradle 9.6.0) & 100% On-Device Offline Execution
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2e2e3d] bg-[#14141b] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'pwa'
                ? 'border-blue-500 text-blue-400 bg-[#1b1b24]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install on Phone</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'apk'
                ? 'border-emerald-500 text-emerald-400 bg-[#1b1b24]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Build APK (Gradle 9.6.0)</span>
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'offline'
                ? 'border-amber-500 text-amber-400 bg-[#1b1b24]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>On-Device Engine</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* TAB 1: PWA Direct Phone Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-lg bg-gradient-to-br from-blue-950/40 via-blue-900/20 to-transparent border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white">Instant 1-Click App Installation</h3>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      CodeDroid includes a progressive web app service worker that installs directly to your Android launcher as a native, standalone app. Once installed, it launches without any browser address bar and works <strong>100% offline</strong> without internet!
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-500/20 flex flex-wrap gap-2 items-center justify-between">
                  {isInstalled ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      App is already installed on this device!
                    </div>
                  ) : (
                    <button
                      onClick={() => promptInstall()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all text-xs"
                    >
                      <Download className="w-4 h-4" />
                      {isInstallable ? 'Install CodeDroid App Now' : 'Add App to Phone'}
                    </button>
                  )}
                  <span className="text-[10px] text-zinc-400">Takes 0 MB downloads</span>
                </div>
              </div>

              {/* Step-by-step for Android phone users */}
              <div className="space-y-2">
                <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  How to install on Android phone in 10 seconds:
                </div>

                <div className="space-y-2 text-[11px] text-zinc-300">
                  <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <div className="font-semibold text-white">Open in Android Chrome</div>
                      <div className="text-zinc-400">Navigate to this app link on your Android smartphone.</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="font-semibold text-white">Tap Chrome Menu (⋮)</div>
                      <div className="text-zinc-400">Look for the three vertical dots at the top right of Chrome.</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <div className="font-semibold text-white">Select "Install app" or "Add to Home screen"</div>
                      <div className="text-zinc-400">
                        CodeDroid will be added to your app drawer with its native icon. You can now disconnect from Wi-Fi and use it completely offline!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Gradle 9.6.0 APK Build */}
          {activeTab === 'apk' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-[#131d16] border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Gradle 9.6.0 Configured & Ready
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  The Android project has been generated in <code className="text-emerald-300 font-mono">/android</code> with Gradle wrapper configured strictly at version <strong>9.6.0</strong>:
                </p>
                <div className="mt-2 p-2 bg-black/50 rounded font-mono text-[10px] text-emerald-300 border border-emerald-900/50 overflow-x-auto">
                  distributionUrl=https\://services.gradle.org/distributions/gradle-9.6.0-all.zip
                </div>
              </div>

              {/* Method A: GitHub Actions Automatic APK Build */}
              <div className="space-y-2">
                <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                  Option A: Automatic APK Build via GitHub Actions (Zero Setup)
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  We have included a complete workflow in <code className="text-zinc-200 font-mono">.github/workflows/build-apk.yml</code>. Whenever you push to your GitHub repo, GitHub builds the APK with Gradle 9.6.0 and produces the downloadable <code className="text-zinc-200 font-mono">CodeDroid-Mobile-IDE-v1.0-debug.apk</code>!
                </p>

                <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 space-y-2">
                  <div className="font-semibold text-zinc-300 text-[11px]">How to get your APK from GitHub:</div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-400">
                    <li>Push your repository to GitHub (<code className="text-blue-300 font-mono">git push origin main</code>)</li>
                    <li>Open your repo on GitHub and click the <strong className="text-zinc-200">Actions</strong> tab</li>
                    <li>Click on <strong className="text-zinc-200">Build Android APK (Gradle 9.6.0)</strong></li>
                    <li>Click the finished run, scroll down to <strong className="text-zinc-200">Artifacts</strong>, and download <strong className="text-emerald-400">CodeDroid-Mobile-IDE-v1.0-debug.apk</strong> directly!</li>
                  </ol>
                </div>
              </div>

              {/* Method B: Local Terminal Build with Gradle 9.6.0 */}
              <div className="space-y-2">
                <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Option B: Local Machine / Command Line Build
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  If you have Android Studio or Java installed locally, run this single command to build the debug APK using Gradle 9.6.0:
                </p>

                <div className="relative group">
                  <pre className="p-2.5 bg-black/60 border border-zinc-800 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`cd android && ./gradlew assembleDebug`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('cd android && ./gradlew assembleDebug', 1)}
                    className="absolute top-2 right-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] flex items-center gap-1"
                  >
                    {copiedIndex === 1 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedIndex === 1 ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="text-[10px] text-zinc-400 p-2 bg-[#121217] rounded border border-zinc-800">
                  <span className="text-zinc-300 font-semibold">APK Output Location:</span><br />
                  <code className="text-blue-400 font-mono">android/app/build/outputs/apk/debug/app-debug.apk</code>
                </div>
              </div>

              {/* Sideloading Instructions */}
              <div className="p-2.5 bg-[#171720] border border-zinc-800 rounded-lg space-y-1">
                <div className="font-semibold text-zinc-300 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Installing APK on your Android Phone:
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Send <code className="text-zinc-300 font-mono">app-debug.apk</code> to your phone (via USB, Google Drive, or Telegram). When you tap it, Android will prompt: <em>"Install unknown apps"</em>. Allow your file manager or browser, then tap <strong>Install</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: On-Device Offline Engine */}
          {activeTab === 'offline' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-[#1d1712] border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <WifiOff className="w-4 h-4" />
                  100% Offline & On-Device Execution
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Unlike traditional cloud IDEs (Replit, JDoodle, Piston) that require high-speed internet and send your code to remote servers, CodeDroid executes everything <strong>directly inside your phone's processor</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-[11px]">
                <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    JavaScript & TypeScript (On-Device V8 Engine)
                  </div>
                  <div className="text-zinc-400 text-[10px]">
                    Executes natively on your phone CPU in an isolated sandboxed scope with full <code className="text-zinc-300 font-mono">console.log</code>, math, array, string, and object support with microsecond latency.
                  </div>
                </div>

                <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Python 3.12 (Client-Side AST Interpreter)
                  </div>
                  <div className="text-zinc-400 text-[10px]">
                    Built-in offline Python interpreter supporting variables, arithmetic, functions, for-loops, range, f-strings, lists, and dicts without touching a cloud server.
                  </div>
                </div>

                <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-purple-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    8086 / 8085 ALP Microprocessor Emulator
                  </div>
                  <div className="text-zinc-400 text-[10px]">
                    Cycle-accurate register emulator with AX, BX, CX, DX, SI, DI, SP, BP, Status Flags (ZF, CF, SF, OF), stack pointer, and INT 21H string output. Perfect for assembly course labs on Android!
                  </div>
                </div>

                <div className="p-2.5 bg-[#121217] rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    HTML5, CSS3 & Web Sandbox
                  </div>
                  <div className="text-zinc-400 text-[10px]">
                    Instant preview modal renders offline web pages with automatic CSS and JS injection directly in your device WebView.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#14141a] border-t border-[#2e2e3d] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gradle 9.6.0 • Local Storage • Offline PWA</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 rounded-md font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
