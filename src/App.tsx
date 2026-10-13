import React, { useState, useEffect } from 'react';
import { ViewType, User, Game, Bookmark, DisguiseConfig, ClockFont, YouTubeTrack, UpdateLog, WidgetSettings } from './types';
import { DEFAULT_BOOKMARKS, DISGUISES, THEMES, YOUTUBE_TRACKS, WALLPAPERS } from './data/defaults';
import { Dock } from './components/Dock';
import { FramingModal } from './components/FramingModal';
import { AuthModal } from './components/AuthModal';
import { UpdatesModal } from './components/UpdatesModal';
import { YouTubePlayer } from './components/YouTubePlayer';

import { HomeView } from './components/views/HomeView';
import { WatchView } from './components/views/WatchView';
import { ListenView } from './components/views/ListenView';
import { PlayView } from './components/views/PlayView';
import { AskView } from './components/views/AskView';
import { FriendsView } from './components/views/FriendsView';
import { SettingsView } from './components/views/SettingsView';
import { AdminView } from './components/views/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  // Widget settings
  const [widgets, setWidgets] = useState<WidgetSettings>(() => {
    try {
      const saved = localStorage.getItem('alxx_widgets');
      return saved ? JSON.parse(saved) : { showScratchpad: false, showMindset: false, showWeather: false };
    } catch {
      return { showScratchpad: false, showMindset: false, showWeather: false };
    }
  });

  const handleUpdateWidgets = (w: WidgetSettings) => {
    setWidgets(w);
    localStorage.setItem('alxx_widgets', JSON.stringify(w));
  };

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('alxx_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Theme & Appearance
  const [theme, setTheme] = useState(() => localStorage.getItem('alxx_theme') || 'boba');
  const [accent, setAccent] = useState(() => localStorage.getItem('alxx_accent') || '#8A5631');

  // Clock Typography Style
  const [clockFont, setClockFont] = useState<ClockFont>(() => {
    return (localStorage.getItem('alxx_clock_font') as ClockFont) || 'modern';
  });

  // Wallpaper Setting
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    return localStorage.getItem('alxx_wallpaper') || 'gradient';
  });
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState(() => {
    return localStorage.getItem('alxx_custom_wallpaper') || '';
  });

  // Stealth Cloak & Disguise
  const [activeDisguise, setActiveDisguise] = useState<DisguiseConfig>(() => {
    const savedId = localStorage.getItem('alxx_disguise') || 'none';
    return DISGUISES.find((d) => d.id === savedId) || DISGUISES[0];
  });

  // Emergency Panic Key
  const [panicKey, setPanicKey] = useState(() => localStorage.getItem('alxx_panic_key') || ']');
  const [panicUrl, setPanicUrl] = useState(
    () => localStorage.getItem('alxx_panic_url') || 'https://classroom.google.com'
  );

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('alxx_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  // Games Archive (594 games)
  const [games, setGames] = useState<Game[]>([]);

  // YouTube Background Audio
  const [activeMusicTrack, setActiveMusicTrack] = useState<YouTubeTrack | null>(YOUTUBE_TRACKS[0]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.8);

  // Updates & Changelogs
  const [updates, setUpdates] = useState<UpdateLog[]>([]);
  const [updatesModalOpen, setUpdatesModalOpen] = useState(false);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [framingModal, setFramingModal] = useState({
    isOpen: false,
    url: 'https://en.wikipedia.org',
    title: 'Study Viewport',
  });

  // Load games from backend
  const loadGames = async () => {
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      if (res.ok && data.games) {
        setGames(data.games);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  // Load global bookmarks from backend
  const loadBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      const data = await res.json();
      if (res.ok && data.bookmarks) {
        // Merge global bookmarks with local bookmarks (avoid duplicates by URL)
        setBookmarks((prev) => {
          const map = new Map<string, Bookmark>();
          data.bookmarks.forEach((b: Bookmark) => map.set(b.url, b));
          prev.forEach((b) => map.set(b.url, b));
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  // Load update logs
  const loadUpdates = async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      if (res.ok && data.updates) {
        setUpdates(data.updates);
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
    }
  };

  useEffect(() => {
    loadGames();
    loadBookmarks();
    loadUpdates();
  }, []);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', theme);
    const themeConfig = THEMES.find((t) => t.id === theme);
    if (themeConfig?.isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    root.style.setProperty('--acc', accent);
    localStorage.setItem('alxx_theme', theme);
  }, [theme, accent]);

  // Tab disguise effect
  useEffect(() => {
    document.title = activeDisguise.title;
    const faviconEl = document.getElementById('app-favicon') as HTMLLinkElement | null;
    if (faviconEl) {
      faviconEl.href = activeDisguise.favicon;
    }
    localStorage.setItem('alxx_disguise', activeDisguise.id);
  }, [activeDisguise]);

  // Global Panic Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === panicKey) {
        e.preventDefault();
        window.location.replace(panicUrl);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl]);

  const handleTogglePin = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.map((bm) => (bm.id === id ? { ...bm, pinned: !bm.pinned } : bm));
      localStorage.setItem('alxx_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddBookmark = (newBm: Bookmark) => {
    setBookmarks((prev) => {
      const updated = [newBm, ...prev];
      localStorage.setItem('alxx_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((bm) => bm.id !== id);
      localStorage.setItem('alxx_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUserLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('alxx_user', JSON.stringify(user));
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('alxx_user');
  };

  const handleLaunchFramer = (url: string, title: string) => {
    setFramingModal({ isOpen: true, url, title });
  };

  // Determine active wallpaper background
  const activeWallpaperObj = WALLPAPERS.find((w) => w.id === currentWallpaper);
  const activeWallpaperUrl =
    currentWallpaper === 'custom' ? customWallpaperUrl : activeWallpaperObj?.url || '';

  return (
    <div className="relative min-h-screen text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300">
      {/* Background Atmosphere or Wallpaper */}
      {activeWallpaperUrl ? (
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${activeWallpaperUrl})` }}
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div className="atmo" aria-hidden="true">
          <div className="amb" />
          <div className="veil" />
          <div className="grain" />
        </div>
      )}

      {/* Hidden YouTube Background Audio Player */}
      <YouTubePlayer
        currentTrack={activeMusicTrack}
        isPlaying={isMusicPlaying}
        volume={audioVolume}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {currentView === 'home' && (
          <HomeView
            onNavigate={setCurrentView}
            onLaunchFramer={handleLaunchFramer}
            bookmarks={bookmarks}
            onTogglePin={handleTogglePin}
            onAddBookmark={handleAddBookmark}
            onDeleteBookmark={handleDeleteBookmark}
            currentUser={currentUser}
            clockFont={clockFont}
            onClockFontChange={(f) => {
              setClockFont(f);
              localStorage.setItem('alxx_clock_font', f);
            }}
            currentWallpaper={currentWallpaper}
            onWallpaperChange={(w) => {
              setCurrentWallpaper(w);
              localStorage.setItem('alxx_wallpaper', w);
            }}
            onOpenUpdates={() => setUpdatesModalOpen(true)}
            widgets={widgets}
          />
        )}

        {currentView === 'watch' && <WatchView onLaunchFramer={handleLaunchFramer} />}

        {currentView === 'listen' && (
          <ListenView
            currentTrack={activeMusicTrack}
            isPlaying={isMusicPlaying}
            volume={audioVolume}
            onPlayTrack={(track) => {
              setActiveMusicTrack(track);
              setIsMusicPlaying(true);
            }}
            onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
            onVolumeChange={setAudioVolume}
          />
        )}

        {currentView === 'play' && (
          <PlayView
            games={games}
            currentUser={currentUser}
            onNavigateToAdmin={() => setCurrentView('admin')}
          />
        )}

        {currentView === 'friends' && (
          <FriendsView
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'ask' && <AskView />}

        {currentView === 'settings' && (
          <SettingsView
            currentTheme={theme}
            onThemeChange={setTheme}
            currentAccent={accent}
            onAccentChange={(c) => {
              setAccent(c);
              localStorage.setItem('alxx_accent', c);
            }}
            currentDisguise={activeDisguise.id}
            onDisguiseChange={setActiveDisguise}
            panicKey={panicKey}
            onPanicKeyChange={(k) => {
              setPanicKey(k);
              localStorage.setItem('alxx_panic_key', k);
            }}
            panicUrl={panicUrl}
            onPanicUrlChange={(u) => {
              setPanicUrl(u);
              localStorage.setItem('alxx_panic_url', u);
            }}
            clockFont={clockFont}
            onClockFontChange={(f) => {
              setClockFont(f);
              localStorage.setItem('alxx_clock_font', f);
            }}
            currentWallpaper={currentWallpaper}
            onWallpaperChange={(w) => {
              setCurrentWallpaper(w);
              localStorage.setItem('alxx_wallpaper', w);
            }}
            customWallpaperUrl={customWallpaperUrl}
            onCustomWallpaperChange={(u) => {
              setCustomWallpaperUrl(u);
              localStorage.setItem('alxx_custom_wallpaper', u);
            }}
            widgets={widgets}
            onUpdateWidgets={handleUpdateWidgets}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            currentUser={currentUser}
            onRefreshGames={loadGames}
            onRefreshBookmarks={loadBookmarks}
            onRefreshUpdates={loadUpdates}
            onLaunchFramer={handleLaunchFramer}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Dock */}
      <Dock
        currentView={currentView}
        onSelectView={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Universal Iframe Framer Modal */}
      <FramingModal
        isOpen={framingModal.isOpen}
        onClose={() => setFramingModal((prev) => ({ ...prev, isOpen: false }))}
        initialUrl={framingModal.url}
        initialTitle={framingModal.title}
      />

      {/* Account Authentication & Passwords Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
      />

      {/* Updates & Changelog Modal */}
      <UpdatesModal
        isOpen={updatesModalOpen}
        onClose={() => setUpdatesModalOpen(false)}
        updates={updates}
      />
    </div>
  );
}
