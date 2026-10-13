import React, { useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  EyeOff,
  ExternalLink,
  Search,
  Music,
  Radio,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc,
} from 'lucide-react';

interface ListenViewProps {
  currentTrack?: any;
  isPlaying?: boolean;
  volume?: number;
  onPlayTrack?: (track: any) => void;
  onTogglePlay?: () => void;
  onVolumeChange?: (vol: number) => void;
}

interface CuratedStation {
  id: string;
  title: string;
  artist: string;
  cover: string;
  youtubeId: string;
}

const STATIONS: CuratedStation[] = [
  {
    id: 'lofi_girl',
    title: 'Lofi Hip Hop Radio — Beats to Relax/Study to',
    artist: 'Lofi Girl',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    youtubeId: 'jfKfPfyJRdk',
  },
  {
    id: 'synthwave',
    title: 'Synthwave / Chillwave Chill Mix',
    artist: 'Nightride FM',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    youtubeId: '4xDzrJKXOOY',
  },
  {
    id: 'gaming_ost',
    title: 'Minecraft & Chill Relaxing Ambient Mix',
    artist: 'C418 / Chill Gamer',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    youtubeId: 'Dx5qFachd3A',
  },
  {
    id: 'coffee_jazz',
    title: 'Warm Jazz Cafe & Cozy Instrumental Coffee',
    artist: 'Cafe Music BGM',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
    youtubeId: '5qap5aO4i9A',
  },
  {
    id: 'piano_study',
    title: 'Deep Focus Classical Piano for Studying',
    artist: 'Halidon Music',
    cover: 'https://images.unsplash.com/photo-1520523839898-50712163e3a7?w=500&auto=format&fit=crop&q=80',
    youtubeId: '4Tr0otuiQuU',
  },
  {
    id: 'phonk_gym',
    title: 'Aggressive Drift Phonk Study & Workout',
    artist: 'Phonk Nation',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80',
    youtubeId: 'y9j_4W0N9cQ',
  },
];

export const ListenView: React.FC<ListenViewProps> = () => {
  const [activeEngine, setActiveEngine] = useState<'player' | 'beatbump' | 'direct'>('player');
  const [frameKey, setFrameKey] = useState(0);
  const [activeStation, setActiveStation] = useState<CuratedStation>(STATIONS[0]);
  const [customSearch, setCustomSearch] = useState('');
  const [activeVideoId, setActiveVideoId] = useState('jfKfPfyJRdk');
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showStationsDrawer, setShowStationsDrawer] = useState(false);

  // Direct URLs
  const directYtUrl = 'https://music.youtube.com';
  const beatbumpUrl = 'https://hyperpipe.surge.sh';

  const handleLaunchAboutBlank = (targetUrl: string) => {
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
        iframe.src = targetUrl;
        win.document.body.style.margin = '0';
        win.document.body.appendChild(iframe);
      }
    } catch {
      // Ignored
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('music-viewport');
    if (elem) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customSearch.trim();
    if (!query) return;

    // Check if user pasted a YouTube or YouTube Music link
    const ytIdMatch = query.match(/(?:v=|\/embed\/|youtu\.be\/|\/watch\?v=|\/watch\?.*v=)([a-zA-Z0-9_-]{11})/);
    if (ytIdMatch && ytIdMatch[1]) {
      setActiveVideoId(ytIdMatch[1]);
      setActiveStation({
        id: `custom_${Date.now()}`,
        title: 'Custom YouTube Music Track',
        artist: 'User Selected',
        cover: `https://img.youtube.com/vi/${ytIdMatch[1]}/hqdefault.jpg`,
        youtubeId: ytIdMatch[1],
      });
      setIsPlaying(true);
      setCustomSearch('');
      setActiveEngine('player');
      return;
    }

    // Otherwise, load YouTube search query embed
    setActiveVideoId(`search_${encodeURIComponent(query)}`);
    setActiveStation({
      id: `search_${Date.now()}`,
      title: `Search: "${query}"`,
      artist: 'YouTube Music Search Stream',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      youtubeId: '',
    });
    setIsPlaying(true);
    setCustomSearch('');
    setActiveEngine('player');
  };

  return (
    <div
      id="music-viewport"
      className="fixed inset-0 top-0 bottom-0 left-0 right-0 z-10 w-full h-full bg-stone-950 flex flex-col overflow-hidden text-white"
    >
      {/* Floating Top Liquid Glass Navigation & Switcher Deck */}
      <header className="absolute top-3 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Branding & Engine Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl liquid-glass shadow-2xl backdrop-blur-2xl border border-white/20">
          <div className="flex items-center gap-1.5 px-3 py-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-black tracking-wider uppercase text-rose-400">
              YT Music
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          {/* Engine Selector */}
          <button
            onClick={() => setActiveEngine('player')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeEngine === 'player'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Live Player
          </button>

          <button
            onClick={() => setActiveEngine('beatbump')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeEngine === 'beatbump'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Unblocked YouTube Music Web Client"
          >
            Hyperpipe Web
          </button>

          <button
            onClick={() => setActiveEngine('direct')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeEngine === 'direct'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Direct YouTube Music with Stealth Tab"
          >
            Direct / Proxy
          </button>
        </div>

        {/* Right: Quick Tools & Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl liquid-glass shadow-2xl backdrop-blur-2xl border border-white/20">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              placeholder="Search song, artist, or paste YT link..."
              className="w-40 sm:w-64 bg-black/40 text-white placeholder-stone-400 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 border border-white/10"
            />
            <button
              type="submit"
              className="p-1 rounded-lg text-stone-300 hover:text-white absolute right-1"
              title="Search Music"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="h-4 w-px bg-white/20 mx-1" />

          <button
            onClick={() => setFrameKey((k) => k + 1)}
            className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
            title="Reload Player"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleLaunchAboutBlank(activeEngine === 'beatbump' ? beatbumpUrl : directYtUrl)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
            title="Open in stealth about:blank tab"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">about:blank</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ================= ENGINE 1: FULLSCREEN INTERACTIVE YOUTUBE MUSIC PLAYER ================= */}
      {activeEngine === 'player' && (
        <div className="relative w-full h-full flex flex-col justify-between pt-16 pb-24 overflow-hidden">
          {/* Ambient Blurred Artwork Background Halo */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-110 pointer-events-none transition-all duration-700 -z-10"
            style={{ backgroundImage: `url(${activeStation.cover})` }}
          />

          {/* Center Stage: Embedded Full-Fidelity YouTube Audio Stream */}
          <div className="flex-1 w-full flex items-center justify-center p-4 max-w-4xl mx-auto">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 liquid-card relative">
              <iframe
                key={`${activeVideoId}_${frameKey}`}
                src={
                  activeVideoId.startsWith('search_')
                    ? `https://www.youtube-nocookie.com/embed?listType=search&list=${activeVideoId.replace('search_', '')}&autoplay=1`
                    : `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
                }
                title="YouTube Music Stream"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
              />
            </div>
          </div>

          {/* Bottom Floating Music Control Deck with Curated Stations */}
          <div className="max-w-4xl mx-auto w-full px-4 mb-2">
            <div className="p-3 sm:p-4 rounded-3xl liquid-glass shadow-2xl border border-white/20 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Currently Playing Card */}
              <div className="flex items-center gap-3 w-full sm:w-auto truncate">
                <img
                  src={activeStation.cover}
                  alt={activeStation.title}
                  className="w-12 h-12 rounded-2xl object-cover shadow-md shrink-0 border border-white/20"
                />
                <div className="truncate">
                  <h3 className="text-xs sm:text-sm font-extrabold truncate text-white">
                    {activeStation.title}
                  </h3>
                  <p className="text-[11px] text-amber-400 font-medium truncate">
                    {activeStation.artist}
                  </p>
                </div>
              </div>

              {/* Station Quick Chips */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {STATIONS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setActiveStation(st);
                      setActiveVideoId(st.youtubeId);
                      setIsPlaying(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      activeStation.id === st.id
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-stone-300'
                    }`}
                  >
                    <Disc className="w-3 h-3" />
                    <span>{st.artist}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ENGINE 2: BEATBUMP / HYPERPIPE UNBLOCKED WEB APP ================= */}
      {activeEngine === 'beatbump' && (
        <iframe
          key={`beatbump_${frameKey}`}
          src={beatbumpUrl}
          title="Hyperpipe YouTube Music Client"
          className="w-full h-full border-none pt-14 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        />
      )}

      {/* ================= ENGINE 3: DIRECT YOUTUBE MUSIC FRAME / PROXY ================= */}
      {activeEngine === 'direct' && (
        <div className="w-full h-full pt-14 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-3xl liquid-card border border-white/20 text-white space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <Music className="w-6 h-6" />
            </span>
            <h2 className="text-lg font-extrabold">YouTube Music Direct Connection</h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Google restricts YouTube Music inside regular browser iframes with SAMEORIGIN headers. For the complete native experience, click below to launch it inside an unblocked stealth tab or use the Live Player.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => handleLaunchAboutBlank(directYtUrl)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                <span>Launch YouTube Music in Stealth Tab</span>
              </button>

              <button
                onClick={() => setActiveEngine('player')}
                className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Switch to Live Player Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
