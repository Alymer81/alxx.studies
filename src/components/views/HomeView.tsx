import React, { useState, useEffect } from 'react';
import { Search, Plus, Pin, PinOff, ExternalLink, Sparkles, Check, Image as ImageIcon, Type, Trash2, Globe } from 'lucide-react';
import { Bookmark, ViewType, User, ClockFont, WidgetSettings } from '../../types';
import { CLOCK_FONTS, WALLPAPERS } from '../../data/defaults';
import { AlxxLogo } from '../AlxxLogo';
import { CloudSun, Wind, Droplets } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  onLaunchFramer: (url: string, title: string) => void;
  bookmarks: Bookmark[];
  onTogglePin: (id: string) => void;
  onAddBookmark: (bm: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  currentUser: User | null;
  clockFont: ClockFont;
  onClockFontChange: (font: ClockFont) => void;
  currentWallpaper: string;
  onWallpaperChange: (wallpaperId: string) => void;
  onOpenUpdates: () => void;
  widgets?: WidgetSettings;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onLaunchFramer,
  bookmarks,
  onTogglePin,
  onAddBookmark,
  onDeleteBookmark,
  currentUser,
  clockFont,
  onClockFontChange,
  currentWallpaper,
  onWallpaperChange,
  onOpenUpdates,
  widgets = { showScratchpad: false, showMindset: false, showWeather: false },
}) => {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('duckduckgo');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('🌐');

  // Lightweight Scratchpad memo widget
  const [quickNotes, setQuickNotes] = useState(() => {
    return localStorage.getItem('alxx_scratchpad') || 'Homework: Calc problems 1-12 due Friday. Bio exam next week.';
  });

  // Quote of the day widget
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  ];

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNotesChange = (val: string) => {
    setQuickNotes(val);
    localStorage.setItem('alxx_scratchpad', val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchQuery.includes('.') && !searchQuery.includes(' ')) {
      let target = searchQuery.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      onLaunchFramer(target, 'Web Frame');
      setSearchQuery('');
      return;
    }

    let searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
    if (searchEngine === 'google') {
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (searchEngine === 'bing') {
      searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (searchEngine === 'wikipedia') {
      searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchQuery)}`;
    }

    onLaunchFramer(searchUrl, searchQuery);
    setSearchQuery('');
  };

  const handleCreateBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    onAddBookmark({
      id: `bm_${Date.now()}`,
      title: newTitle.trim(),
      url,
      icon: newIcon.trim() || '🌐',
      pinned: true,
    });
    setNewTitle('');
    setNewUrl('');
    setNewIcon('🌐');
    setShowAddModal(false);
  };

  // Helper for rendering high-res app brand SVGs or Google Favicons
  const renderAppIcon = (bm: Bookmark) => {
    try {
      const parsed = new URL(bm.url.startsWith('http') ? bm.url : `https://${bm.url}`);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#FF0000]">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      }
      if (host.includes('discord.com')) {
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#5865F2]">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        );
      }
      if (host.includes('spotify.com')) {
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1DB954]">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        );
      }
      if (host.includes('reddit.com')) {
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#FF4500]">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.609a1.24 1.24 0 0 1 1.108-.693zM8.617 12.333c-.702 0-1.272.57-1.272 1.272s.57 1.273 1.272 1.273c.702 0 1.272-.57 1.272-1.273s-.57-1.272-1.272-1.272zm6.766 0c-.702 0-1.272.57-1.272 1.272s.57 1.273 1.272 1.273c.702 0 1.272-.57 1.272-1.273s-.57-1.272-1.272-1.272zm-6.61 3.738a.336.336 0 0 0-.047.475 4.846 4.846 0 0 0 3.274 1.458 4.846 4.846 0 0 0 3.274-1.458.337.337 0 0 0-.047-.475.337.337 0 0 0-.475.047 4.17 4.17 0 0 1-2.752 1.226 4.17 4.17 0 0 1-2.752-1.226.336.336 0 0 0-.476-.047z"/>
          </svg>
        );
      }
      if (host.includes('github.com')) {
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-stone-800 dark:fill-white">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      }

      // Crisp favicon using Google service
      return (
        <img
          src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
          alt={bm.title}
          className="w-6 h-6 object-contain rounded-md"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    } catch {
      return <span className="text-xl">{bm.icon || '🌐'}</span>;
    }
  };

  // Font styling class mapping
  const clockFontClass =
    CLOCK_FONTS.find((f) => f.id === clockFont)?.styleClass || 'font-sans font-extrabold tracking-tight';

  const pinnedBookmarks = bookmarks.filter((b) => b.pinned);
  const unpinnedBookmarks = bookmarks.filter((b) => !b.pinned);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 text-stone-900 dark:text-stone-100 flex flex-col items-center">
      {/* Top Header Bar with ALXX Wordmark and Controls */}
      <div className="w-full flex items-center justify-between mb-2">
        <AlxxLogo size="md" showSubtitle />

        <div className="flex items-center gap-2">
          {/* Wallpaper quick changer */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-semibold transition-colors"
              title="Change Background Wallpaper"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wallpaper</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col p-2 rounded-2xl glass-panel shadow-xl w-48 z-30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2 py-0.5">Presets</span>
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => onWallpaperChange(wp.id)}
                  className={`px-2 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                    currentWallpaper === wp.id ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="truncate">{wp.name}</span>
                  {currentWallpaper === wp.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Clock Font Switcher */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-semibold transition-colors"
              title="Change Clock Typography"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Font</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col p-2 rounded-2xl glass-panel shadow-xl w-44 z-30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2 py-0.5">Clock Styles</span>
              {CLOCK_FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onClockFontChange(font.id as ClockFont)}
                  className={`px-2 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                    clockFont === font.id ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{font.name}</span>
                  {clockFont === font.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Updates Badge */}
          <button
            onClick={onOpenUpdates}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Updates</span>
          </button>
        </div>
      </div>

      {/* Customizable Clock & Date Greeting */}
      <div className="text-center my-6 space-y-1 select-none">
        <div className={`text-5xl sm:text-7xl tabular-nums drop-shadow-md transition-all ${clockFontClass}`}>
          {time || '12:00:00'}
        </div>
        <div className="text-xs sm:text-sm font-medium text-stone-500 dark:text-stone-400">
          {dateStr} {currentUser ? `· ${currentUser.username}'s desk` : ''}
        </div>
      </div>

      {/* Main Searcher / Web Framer Proxy */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-4">
        <div className="relative flex items-center p-2 rounded-2xl glass-panel shadow-xl border border-black/10 dark:border-white/10 group focus-within:ring-2 focus-within:ring-amber-500/50 transition-all">
          <div className="pl-3 pr-2 text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search web or type URL to frame..."
            className="w-full bg-transparent text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none py-1.5"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Search
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-2">
          <span>Opens directly in distraction-free Framer</span>
          <div className="flex gap-2">
            {(['duckduckgo', 'google', 'bing', 'wikipedia'] as const).map((eng) => (
              <button
                key={eng}
                type="button"
                onClick={() => setSearchEngine(eng)}
                className={`capitalize hover:underline ${searchEngine === eng ? 'text-amber-500 font-bold' : ''}`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* ================= CLEAN HORIZONTAL DOCK OF PINNED APPS (BOBA / SCREENSHOT STYLE) ================= */}
      <div className="w-full max-w-xl mb-8 flex flex-col items-center">
        {/* Sleek icon row with centered tiles */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 p-2 rounded-3xl glass-panel/60 border border-black/5 dark:border-white/5 w-full">
          {pinnedBookmarks.map((bm) => (
            <div key={bm.id} className="relative group">
              <button
                onClick={() => onLaunchFramer(bm.url, bm.title)}
                className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:shadow-md transition-all relative overflow-hidden"
                title={bm.title}
              >
                {renderAppIcon(bm)}
              </button>

              {/* Tooltip on hover */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-semibold whitespace-nowrap z-20 shadow-lg pointer-events-none">
                {bm.title}
              </div>

              {/* Pin / Unpin button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(bm.id);
                }}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 text-stone-950 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                title="Unpin"
              >
                <PinOff className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {/* Quick Add Button (+) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 rounded-2xl border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center text-stone-400 hover:border-amber-500 hover:text-amber-500 hover:scale-105 transition-all"
            title="Add App or Bookmark"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Unpinned Bookmarks Toggle or Mini Tray */}
        {unpinnedBookmarks.length > 0 && (
          <div className="mt-3 w-full">
            <details className="group text-center">
              <summary className="text-[11px] font-bold uppercase tracking-wider text-stone-400 hover:text-amber-500 cursor-pointer list-none flex items-center justify-center gap-1">
                <span>More Saved Apps ({unpinnedBookmarks.length})</span>
              </summary>
              <div className="flex items-center justify-center flex-wrap gap-2.5 mt-3 p-3 rounded-2xl glass-panel/40">
                {unpinnedBookmarks.map((bm) => (
                  <div key={bm.id} className="relative group/it">
                    <button
                      onClick={() => onLaunchFramer(bm.url, bm.title)}
                      className="w-11 h-11 rounded-xl glass-card flex items-center justify-center shadow-xs group-hover/it:scale-110 transition-all"
                      title={bm.title}
                    >
                      {renderAppIcon(bm)}
                    </button>

                    <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover/it:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(bm.id);
                        }}
                        className="p-1 rounded-full bg-stone-800 text-amber-400 shadow"
                        title="Pin"
                      >
                        <Pin className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBookmark(bm.id);
                        }}
                        className="p-1 rounded-full bg-stone-800 text-rose-400 shadow"
                        title="Delete"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* ================= OPTIONAL HOME WIDGETS (CONFIGURED IN SETTINGS) ================= */}
      {(widgets.showScratchpad || widgets.showMindset || widgets.showWeather) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full mt-2">
          {/* Widget 1: Quick Study Scratchpad */}
          {widgets.showScratchpad && (
            <div className="p-4 rounded-3xl liquid-card space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700 dark:text-stone-300">📝 Study Scratchpad</span>
                <span className="text-[10px] text-stone-400 font-normal">Auto-saved</span>
              </div>
              <textarea
                rows={3}
                value={quickNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Jot down quick formulas, ideas, or assignments..."
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-2.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Widget 2: Daily Inspiration Quote */}
          {widgets.showMindset && (
            <div className="p-4 rounded-3xl liquid-card flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>💡 Daily Mindset</span>
                <button
                  onClick={() => setQuoteIndex((i) => (i + 1) % quotes.length)}
                  className="text-[10px] text-amber-500 hover:underline"
                >
                  Next Quote
                </button>
              </div>
              <blockquote className="text-xs italic text-stone-600 dark:text-stone-300 leading-relaxed my-auto">
                "{quotes[quoteIndex].quote}"
              </blockquote>
              <div className="text-[10px] text-stone-400 font-medium text-right">
                — {quotes[quoteIndex].author}
              </div>
            </div>
          )}

          {/* Widget 3: Live Weather Card */}
          {widgets.showWeather && (
            <div className="p-4 rounded-3xl liquid-card flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span className="flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span>Campus Weather</span>
                </span>
                <span className="text-[10px] text-emerald-500 font-bold">72°F / 22°C</span>
              </div>
              <div className="flex items-center justify-between my-auto">
                <div>
                  <div className="text-xl font-extrabold tracking-tight">Sunny & Clear</div>
                  <div className="text-[10px] text-stone-400">Perfect study atmosphere</div>
                </div>
                <div className="text-right text-[10px] text-stone-400 space-y-0.5">
                  <div className="flex items-center gap-1"><Wind className="w-3 h-3" /> 6 mph NW</div>
                  <div className="flex items-center gap-1"><Droplets className="w-3 h-3" /> 42% Humidity</div>
                </div>
              </div>
              <div className="text-[9px] text-stone-400">Auto-synced weather desk</div>
            </div>
          )}
        </div>
      )}

      {/* Add Custom Bookmark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 text-white p-5 border border-white/10 shadow-2xl">
            <h3 className="text-sm font-bold mb-3">Add Custom Bookmark</h3>
            <form onSubmit={handleCreateBookmark} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khan Academy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-white/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-stone-400 mb-1">URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://khanacademy.org"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-white/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-stone-400 mb-1">Icon / Emoji</label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="e.g. 📚 or 🚀"
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-white/10 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 font-semibold text-stone-950 hover:bg-amber-400"
                >
                  Add Bookmark
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-800 font-semibold text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
