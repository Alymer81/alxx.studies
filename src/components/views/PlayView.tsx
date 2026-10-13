import React, { useState, useEffect } from 'react';
import { Game, User } from '../../types';
import {
  Search,
  ArrowLeft,
  Maximize2,
  RotateCcw,
  EyeOff,
  Plus,
  Play,
  Flame,
  ExternalLink,
  Pin,
  PinOff,
  ShieldCheck,
  Gamepad2,
} from 'lucide-react';

interface PlayViewProps {
  games: Game[];
  currentUser: User | null;
  onNavigateToAdmin: () => void;
}

export const PlayView: React.FC<PlayViewProps> = ({
  games,
  currentUser,
  onNavigateToAdmin,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [useProxy, setUseProxy] = useState(false);
  const [visibleCount, setVisibleCount] = useState(70);

  // Pinned Games state
  const [pinnedGameIds, setPinnedGameIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alxx_pinned_games');
      return saved ? JSON.parse(saved) : ['vc_vice_city', 'skate_3_web'];
    } catch {
      return ['vc_vice_city', 'skate_3_web'];
    }
  });

  const togglePinGame = (gameId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const strId = String(gameId);
    setPinnedGameIds((prev) => {
      const next = prev.includes(strId)
        ? prev.filter((id) => id !== strId)
        : [...prev, strId];
      localStorage.setItem('alxx_pinned_games', JSON.stringify(next));
      return next;
    });
  };

  // Keyboard escape listener to close game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeGame) {
        setActiveGame(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame]);

  const categories = [
    'All',
    'Featured',
    'Action',
    'Arcade',
    'Driving',
    'Sports',
    'Puzzle',
    'Multiplayer',
    'Retro',
  ];

  const filteredGames = games.filter((game) => {
    const title = (game.name || game.title || '').toLowerCase();
    const cat = (game.category || '').toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'Featured') {
      return (
        game.id === 'vc_vice_city' ||
        game.id === 'skate_3_web' ||
        pinnedGameIds.includes(String(game.id)) ||
        (game.tags && game.tags.includes('Featured'))
      );
    }
    return cat.includes(categoryFilter.toLowerCase());
  });

  const pinnedGamesList = games.filter((g) =>
    pinnedGameIds.includes(String(g.id))
  );

  const handleLaunchAboutBlank = (game: Game) => {
    const targetUrl = getGameEffectiveUrl(game);
    if (!targetUrl) return;

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

  const getGameCover = (game: Game) => {
    return game.cover || game.thumbnail || '';
  };

  const getGameEffectiveUrl = (game: Game) => {
    const rawUrl = game.url || game.embedUrl || '';
    if (!rawUrl) return '';

    // If using proxy or if vice city
    if (game.id === 'vc_vice_city') return '/api/proxy/vc';
    if (useProxy && rawUrl.startsWith('http')) {
      return `/api/proxy/frame?url=${encodeURIComponent(rawUrl)}`;
    }
    return rawUrl;
  };

  return (
    <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-6 pb-28 text-stone-900 dark:text-stone-100">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Play Lounge</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold liquid-pill">
              {games.length} Games
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Full unblocked games archive in 7–8 per row tiles. Pin your favorites, play instant fullscreen, or cloak.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {currentUser?.role === 'admin' && (
            <button
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs hover:bg-amber-500/30 transition-colors shrink-0 liquid-pill"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Admin Game Tools</span>
            </button>
          )}

          <div className="relative flex items-center liquid-glass rounded-xl px-3 py-1.5 text-xs w-full sm:w-72 border border-black/10 dark:border-white/10">
            <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 700+ games..."
              className="w-full bg-transparent text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= PINNED GAMES SECTION (IF ANY PINNED) ================= */}
      {pinnedGamesList.length > 0 && !search && categoryFilter === 'All' && (
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Pinned Games ({pinnedGamesList.length})
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-4 sm:gap-5">
            {pinnedGamesList.map((game) => {
              const gameTitle = game.name || game.title || 'Game';
              const coverUrl = getGameCover(game);

              return (
                <div
                  key={`pinned_${game.id}`}
                  onClick={() => {
                    setUseProxy(false);
                    setActiveGame(game);
                  }}
                  className="group relative aspect-square rounded-2xl overflow-hidden liquid-card p-1 text-left flex flex-col justify-end transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-2 hover:ring-amber-500/60 cursor-pointer"
                  title={gameTitle}
                >
                  {/* Rounded Cover */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={gameTitle}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover rounded-xl group-hover:scale-108 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback procedural badge if image missing or broken */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-rose-800 to-stone-900 rounded-xl flex items-center justify-center p-2 text-center -z-10">
                    <div className="space-y-1">
                      <Gamepad2 className="w-6 h-6 text-amber-300 mx-auto opacity-75" />
                      <span className="text-[10px] font-bold text-white line-clamp-2">
                        {gameTitle}
                      </span>
                    </div>
                  </div>

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity rounded-xl" />

                  {/* Unpin button */}
                  <button
                    onClick={(e) => togglePinGame(game.id, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-500 text-stone-950 shadow-md hover:scale-110 transition-transform z-20"
                    title="Unpin game"
                  >
                    <PinOff className="w-3 h-3" />
                  </button>

                  {/* Play Glyph */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </span>
                  </div>

                  {/* Title */}
                  <div className="relative z-10 p-2 w-full">
                    <h3 className="font-bold text-xs text-white truncate drop-shadow-md">
                      {gameTitle}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'bg-black/5 dark:bg-white/5 text-stone-600 dark:text-stone-300 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {cat === 'Featured' ? '🔥 Featured Hits' : cat}
          </button>
        ))}
      </div>

      {/* ================= 8-9 CARDS PER ROW LIQUID GLASS ROUNDED SQUARE GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-4 sm:gap-5">
        {filteredGames.slice(0, visibleCount).map((game, idx) => {
          const gameTitle = game.name || game.title || 'Game';
          const coverUrl = getGameCover(game);
          const isFeatured = game.id === 'vc_vice_city' || game.id === 'skate_3_web';
          const isPinned = pinnedGameIds.includes(String(game.id));

          return (
            <div
              key={`${game.id}_${idx}`}
              onClick={() => {
                setUseProxy(false);
                setActiveGame(game);
              }}
              className="group relative aspect-square rounded-2xl overflow-hidden liquid-card p-1 text-left flex flex-col justify-end transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-2 hover:ring-amber-500/50 cursor-pointer"
              title={gameTitle}
            >
              {/* Rounded Cover */}
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={gameTitle}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl group-hover:scale-108 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}

              {/* Procedural Fallback Cover */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black rounded-xl flex items-center justify-center p-2 text-center -z-10">
                <div className="space-y-1">
                  <Gamepad2 className="w-6 h-6 text-amber-400 mx-auto opacity-70" />
                  <span className="text-[10px] font-bold text-white line-clamp-2">
                    {gameTitle}
                  </span>
                </div>
              </div>

              {/* Gradient scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity rounded-xl" />

              {/* Badges: Hit + Pin toggle */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                {isFeatured ? (
                  <div className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase shadow flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 fill-current" /> Hit
                  </div>
                ) : <span />}

                <button
                  onClick={(e) => togglePinGame(game.id, e)}
                  className={`pointer-events-auto p-1.5 rounded-full transition-all shadow ${
                    isPinned
                      ? 'bg-amber-500 text-stone-950 opacity-100 scale-100'
                      : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-stone-950'
                  }`}
                  title={isPinned ? 'Unpin' : 'Pin to top'}
                >
                  <Pin className="w-3 h-3 fill-current" />
                </button>
              </div>

              {/* Hover Play Glyph */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </span>
              </div>

              {/* Game Title Tag */}
              <div className="relative z-10 p-2 w-full">
                <h3 className="font-bold text-xs text-white truncate drop-shadow-md">
                  {gameTitle}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {filteredGames.length > visibleCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 70)}
            className="px-6 py-2.5 rounded-2xl liquid-glass hover:bg-black/10 dark:hover:bg-white/20 text-xs font-bold transition-all shadow-sm"
          >
            Load More Games ({visibleCount} of {filteredGames.length})
          </button>
        </div>
      )}

      {filteredGames.length === 0 && (
        <div className="text-center py-20 text-stone-400 text-xs">
          No games found matching "{search}".
        </div>
      )}

      {/* ================= FULL SCREEN GAME VIEWPORT WITH AUTOHIDE HOVER CONTROLS ================= */}
      {activeGame && (
        <div className="fixed inset-0 z-50 w-full h-full bg-black text-white animate-fadeIn overflow-hidden">
          {/* Top Hover Detection Hotspot (Menu NOT VISIBLE unless hovered near top) */}
          <div className="absolute top-0 left-0 right-0 h-16 z-50 flex justify-center items-start pt-2 pointer-events-none group">
            {/* Liquid Glass Back Button & Controls Deck (visible ONLY on hover) */}
            <div className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-2xl liquid-glass shadow-2xl border border-white/20 text-white backdrop-blur-2xl">
              {/* Liquid Glass Back Button */}
              <button
                onClick={() => setActiveGame(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
                title="Return to Play Lounge (or press Esc)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Games (Esc)</span>
              </button>

              {/* Title Badge */}
              <span className="text-xs font-bold truncate max-w-[140px] sm:max-w-xs px-2 text-stone-200">
                {activeGame.name || activeGame.title}
              </span>

              {/* Proxy stream toggle */}
              <button
                onClick={() => {
                  setUseProxy(!useProxy);
                  setIframeKey((k) => k + 1);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  useProxy
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/10 hover:bg-white/20 text-stone-300'
                }`}
                title={useProxy ? 'Bypass Proxy Active' : 'Switch to Bypass Proxy if game is blocked'}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{useProxy ? 'Proxied' : 'Direct'}</span>
              </button>

              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
                title="Reload Game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleLaunchAboutBlank(activeGame)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
                title="Launch in stealth about:blank tab"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">about:blank</span>
              </button>

              <a
                href={getGameEffectiveUrl(activeGame)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
                title="Open Game in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  const elem = document.documentElement;
                  if (!document.fullscreenElement) {
                    elem.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                className="p-1.5 rounded-xl hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
                title="Toggle Monitor Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 100% Edge-to-Edge True Full Screen Game Iframe */}
          <iframe
            key={iframeKey}
            id="app-iframe"
            src={getGameEffectiveUrl(activeGame)}
            title={activeGame.name || activeGame.title || 'Game'}
            className="w-full h-full border-none absolute inset-0 bg-black"
            allow="accelerometer; autoplay; bluetooth; camera; clipboard-read; clipboard-write; cross-origin-isolated; display-capture; encrypted-media; fullscreen; gamepad; geolocation; gyroscope; hid; identity-credentials-get; idle-detection; local-fonts; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; serial; usb; web-share; window-management; xr-spatial-tracking; keyboard-map"
            allowFullScreen={true}
          />
        </div>
      )}
    </div>
  );
};
