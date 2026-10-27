import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Globe,
  RotateCw,
  X,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Code,
  Terminal,
  Check,
  Sparkles
} from 'lucide-react';

interface WebPreviewModalProps {
  files: Record<string, string>;
  activeFile: string;
  onClose: () => void;
  onSelectFile?: (path: string) => void;
}

export const WebPreviewModal: React.FC<WebPreviewModalProps> = ({
  files,
  activeFile,
  onClose,
  onSelectFile,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'log' | 'error' | 'warn' | 'info'; text: string; time: string }>>([]);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Determine target HTML file (default to index.html or active file if it's html)
  const targetHtmlPath = useMemo(() => {
    if (activeFile.endsWith('.html')) return activeFile;
    if (files['index.html']) return 'index.html';
    const anyHtml = Object.keys(files).find(f => f.endsWith('.html'));
    return anyHtml || 'index.html';
  }, [activeFile, files]);

  // Combine HTML with linked CSS and JS files in the project
  const bundledHtml = useMemo(() => {
    let rawHtml = files[targetHtmlPath] || `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; background: #0f172a; color: #f8fafc; }
    h1 { color: #38bdf8; }
  </style>
</head>
<body>
  <h1>Welcome to CodeDroid Web Preview</h1>
  <p>Create an <code>index.html</code> file to build custom web pages!</p>
</body>
</html>`;

    // Inject console capture script
    const consoleCaptureScript = `
      <script>
        (function() {
          const oldLog = console.log;
          const oldError = console.error;
          const oldWarn = console.warn;
          const oldInfo = console.info;

          function send(type, args) {
            try {
              const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
              window.parent.postMessage({ source: 'codedroid-web-preview', type, text }, '*');
            } catch(e) {}
          }

          console.log = function(...args) { send('log', args); oldLog.apply(console, args); };
          console.error = function(...args) { send('error', args); oldError.apply(console, args); };
          console.warn = function(...args) { send('warn', args); oldWarn.apply(console, args); };
          console.info = function(...args) { send('info', args); oldInfo.apply(console, args); };
          window.onerror = function(msg, url, line) {
            send('error', [msg + ' (line ' + line + ')']);
          };
        })();
      </script>
    `;

    // Replace linked stylesheets with inline styles if they exist in files
    rawHtml = rawHtml.replace(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi, (match, href) => {
      const cleanHref = href.replace(/^\.\//, '');
      if (files[cleanHref]) {
        return `<style data-source="${cleanHref}">\n${files[cleanHref]}\n</style>`;
      }
      return match;
    });

    // Replace script tags with src pointing to local files
    rawHtml = rawHtml.replace(/<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src) => {
      const cleanSrc = src.replace(/^\.\//, '');
      if (files[cleanSrc]) {
        return `<script data-source="${cleanSrc}">\n${files[cleanSrc]}\n</script>`;
      }
      return match;
    });

    // If head exists, inject capture script; otherwise prepend
    if (rawHtml.includes('<head>')) {
      rawHtml = rawHtml.replace('<head>', `<head>\n${consoleCaptureScript}`);
    } else {
      rawHtml = consoleCaptureScript + rawHtml;
    }

    return rawHtml;
  }, [files, targetHtmlPath]);

  // Listen for console logs from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'codedroid-web-preview') {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setConsoleLogs(prev => [...prev.slice(-100), {
          type: event.data.type,
          text: event.data.text,
          time,
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bundledHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInNewWindow = () => {
    const blob = new Blob([bundledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-[#18181f] border border-[#31313d] rounded-2xl w-full max-w-4xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Browser Bar */}
        <div className="bg-[#21212a] border-b border-[#2d2d38] px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: Window Controls + Browser Address Bar */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => {
                setRefreshKey(k => k + 1);
                setConsoleLogs([]);
              }}
              className="p-1.5 hover:bg-zinc-700/60 rounded-md text-zinc-300 transition-colors"
              title="Reload Web Page"
              aria-label="Reload Web Page"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Address Bar */}
            <div className="flex-1 max-w-md bg-[#131317] border border-zinc-700/60 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-mono text-zinc-300 truncate">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-zinc-500 select-none">https://</span>
              <span className="text-emerald-300 font-semibold truncate">localhost:3000/{targetHtmlPath}</span>
            </div>

            {/* Quick Web Files Switcher */}
            <div className="flex items-center gap-1 hidden md:flex text-xs font-mono">
              {['index.html', 'style.css', 'app.js'].filter(f => files[f]).map(f => (
                <button
                  key={f}
                  onClick={() => onSelectFile && onSelectFile(f)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    activeFile === f
                      ? 'bg-blue-600/40 text-blue-300 border border-blue-500/40 font-bold'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                  }`}
                  title={`Edit ${f}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Viewport mode toggles + Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Viewport Width Buttons */}
            <div className="flex items-center bg-[#131317] p-0.5 rounded-lg border border-zinc-700/60">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded ${deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded ${deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded ${deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="Full Responsive View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Web Console */}
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 border transition-colors ${
                showConsole
                  ? 'bg-amber-600/30 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-700'
              }`}
              title="Toggle Browser Console"
            >
              <Terminal className="w-3.5 h-3.5" />
              {consoleLogs.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                  {consoleLogs.length}
                </span>
              )}
            </button>

            {/* Copy Bundled HTML */}
            <button
              onClick={handleCopyCode}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors"
              title="Copy Full HTML code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
            </button>

            {/* Open in new tab */}
            <button
              onClick={handleOpenInNewWindow}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-md transition-colors ml-1"
              title="Close Preview"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Viewport Area */}
        <div className="flex-1 bg-[#121216] relative flex items-center justify-center overflow-auto p-2 sm:p-4">
          <div
            className={`h-full bg-white transition-all duration-300 shadow-2xl rounded-lg overflow-hidden flex flex-col border border-zinc-700 ${
              deviceMode === 'mobile'
                ? 'w-[375px] max-w-full rounded-[24px] border-[6px] border-[#2a2a35]'
                : deviceMode === 'tablet'
                ? 'w-[720px] max-w-full rounded-[16px] border-[4px] border-[#2a2a35]'
                : 'w-full'
            }`}
          >
            <iframe
              ref={iframeRef}
              key={refreshKey}
              title="Web Page Preview"
              srcDoc={bundledHtml}
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              className="w-full h-full border-none bg-white"
            />
          </div>
        </div>

        {/* Collapsible Browser Console Drawer */}
        {showConsole && (
          <div className="h-44 bg-[#141419] border-t border-[#2e2e3a] flex flex-col font-mono text-xs">
            <div className="px-3 py-1.5 bg-[#1b1b22] border-b border-[#2d2d38] flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5 font-bold text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-amber-400" /> Browser Console Output
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {consoleLogs.length === 0 ? (
                <div className="text-zinc-500 italic py-2 px-1">
                  No console messages yet. Use <code className="text-blue-400">console.log()</code> in your JavaScript to inspect data.
                </div>
              ) : (
                consoleLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 py-0.5 px-1.5 rounded ${
                      log.type === 'error'
                        ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                        : log.type === 'warn'
                        ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500'
                        : 'text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span className="text-[10px] text-zinc-500 shrink-0">{log.time}</span>
                    <span className="font-bold text-[10px] uppercase shrink-0 text-zinc-400">[{log.type}]</span>
                    <span className="break-all whitespace-pre-wrap">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bottom Status bar */}
        <div className="px-3 py-1.5 bg-[#1a1a20] border-t border-[#2d2d38] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" /> Live HTML, CSS & JS Sync Active
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline">Active Source: {targetHtmlPath}</span>
          </div>
          <div className="text-[11px] text-zinc-500">
            {deviceMode === 'mobile' ? '375 × 667 (Mobile)' : deviceMode === 'tablet' ? '720 × 1024 (Tablet)' : '100% Fluid'}
          </div>
        </div>

      </div>
    </div>
  );
};
