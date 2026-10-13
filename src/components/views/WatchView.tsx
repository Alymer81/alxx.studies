import React, { useState } from 'react';
import { RotateCcw, Maximize2, EyeOff, ExternalLink } from 'lucide-react';

interface WatchViewProps {
  onLaunchFramer?: (url: string, title: string) => void;
}

export const WatchView: React.FC<WatchViewProps> = () => {
  const [frameKey, setFrameKey] = useState(0);
  const movieUrl = 'https://framextv.xyz';

  const handleLaunchAboutBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.title = 'Classes';
        const iframe = win.document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.overflow = 'hidden';
        iframe.src = movieUrl;
        win.document.body.style.margin = '0';
        win.document.body.appendChild(iframe);
      }
    } catch {
      // Ignored
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('framextv-viewport');
    if (elem) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      id="framextv-viewport"
      className="fixed inset-0 top-0 bottom-0 left-0 right-0 z-10 w-full h-full bg-black flex flex-col overflow-hidden"
    >
      {/* Sleek Floating Liquid Glass Top Controls */}
      <header className="absolute top-3 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl liquid-glass shadow-2xl backdrop-blur-xl border border-white/20 text-white transition-opacity duration-300 opacity-80 hover:opacity-100">
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-amber-400 mr-1.5 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          frameXTV
        </span>

        <button
          onClick={() => setFrameKey((k) => k + 1)}
          className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
          title="Reload Stream"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleLaunchAboutBlank}
          className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[11px] font-semibold transition-colors"
          title="Cloak in stealth about:blank"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">about:blank</span>
        </button>

        <a
          href={movieUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
          title="Open in New Tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleFullscreen}
          className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
          title="Full Monitor Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Edge-to-Edge 100% Fullscreen Iframe with zero empty space */}
      <iframe
        key={frameKey}
        src={movieUrl}
        title="frameXTV Cinema"
        className="w-full h-full border-none flex-1 bg-black"
        allow="accelerometer; autoplay; bluetooth; camera; clipboard-read; clipboard-write; cross-origin-isolated; display-capture; encrypted-media; fullscreen; gamepad; geolocation; gyroscope; hid; identity-credentials-get; idle-detection; local-fonts; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; serial; usb; web-share; window-management; xr-spatial-tracking; keyboard-map"
        allowFullScreen={true}
      />
    </div>
  );
};
