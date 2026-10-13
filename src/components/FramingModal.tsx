import React, { useState } from 'react';
import { ExternalLink, Maximize2, RotateCcw, Shield, X, EyeOff } from 'lucide-react';

interface FramingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialTitle?: string;
}

export const FramingModal: React.FC<FramingModalProps> = ({
  isOpen,
  onClose,
  initialUrl = 'https://en.wikipedia.org',
  initialTitle = 'Study Viewport',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [activeUrl, setActiveUrl] = useState(initialUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen) return null;

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = url.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    setActiveUrl(target);
  };

  // Launch URL in about:blank stealth window (Cloaker)
  const launchAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup blocked. Please allow popups for alxx.studies to use about:blank cloaking.');
      return;
    }

    win.document.title = 'Classes'; // Stealth disguise title
    const doc = win.document;
    const iframe = doc.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.zIndex = '999999';
    iframe.src = activeUrl;
    doc.body.style.margin = '0';
    doc.body.appendChild(iframe);
  };

  // Launch via Blob Cloaking
  const launchBlobFrame = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Dashboard</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
    iframe { border: none; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <iframe src="${activeUrl}" allowfullscreen></iframe>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`flex flex-col bg-stone-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full transition-all ${
        isFullscreen ? 'h-full rounded-none' : 'max-w-5xl h-[88vh]'
      }`}>
        {/* Top Browser Bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-stone-950/90 border-b border-white/10 text-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} title="Close" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-semibold ml-2 text-stone-400 hidden sm:inline">alxx.studies Framer</span>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleNavigate} className="flex-1 max-w-lg mx-2">
            <div className="flex items-center bg-stone-800/80 border border-white/10 rounded-xl px-3 py-1 text-xs">
              <Shield className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to frame (e.g. https://example.com)"
                className="w-full bg-transparent text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIframeKey(k => k + 1)}
                className="p-1 hover:text-white text-stone-400"
                title="Reload"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={launchAboutBlank}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-stone-200 transition-colors"
              title="Spawn in about:blank unlogged tab"
            >
              <EyeOff className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">about:blank</span>
            </button>

            <button
              onClick={launchBlobFrame}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-stone-200 transition-colors"
              title="Spawn as masked Blob URL"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden md:inline">Blob</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative flex-1 w-full bg-stone-950 overflow-hidden">
          <iframe
            key={iframeKey}
            src={activeUrl}
            title={initialTitle}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
