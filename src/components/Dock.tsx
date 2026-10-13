import React from 'react';
import { Home, Film, Headphones, Gamepad2, Sparkles, Settings2, ShieldCheck, Users } from 'lucide-react';
import { ViewType, User } from '../types';
import { AlxxLogo } from './AlxxLogo';

interface DockProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const Dock: React.FC<DockProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onOpenAuth,
}) => {
  const navItems = [
    { id: 'home' as ViewType, label: 'Home', icon: Home },
    { id: 'play' as ViewType, label: 'Games', icon: Gamepad2 },
    { id: 'friends' as ViewType, label: 'Chat', icon: Users },
    { id: 'ask' as ViewType, label: 'Ask AI', icon: Sparkles },
    { id: 'watch' as ViewType, label: 'Watch', icon: Film },
    { id: 'listen' as ViewType, label: 'Music', icon: Headphones },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings2 },
  ];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav
      aria-label="alxx.studies navigation dock"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-3xl dock-pill transition-all duration-300"
    >
      {/* ALXX Brand Icon Button */}
      <button
        onClick={() => onSelectView('home')}
        title="alxx.studies Home"
        className="px-2 h-10 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform hover:bg-black/5 dark:hover:bg-white/10"
      >
        <AlxxLogo size="sm" />
      </button>

      <div className="w-[1px] h-6 bg-black/10 dark:bg-white/15 my-auto" />

      {/* Main View Buttons */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={`group relative flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'bg-black/10 dark:bg-white/20 text-current shadow-inner scale-105'
                : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105'
            }`}
          >
            <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

            {/* Tooltip Label */}
            <span className="absolute -top-9 px-2 py-0.5 rounded-lg text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md">
              {item.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-current" />
            )}
          </button>
        );
      })}

      {/* Admin Deck Tab */}
      {isAdmin && (
        <>
          <div className="w-[1px] h-6 bg-black/10 dark:bg-white/15 my-auto" />
          <button
            onClick={() => onSelectView('admin')}
            title="Admin Deck (alxx3433@gmail.com)"
            className={`group relative flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-2xl transition-all duration-200 ${
              currentView === 'admin'
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-amber-600/80 dark:text-amber-400/80 hover:bg-amber-500/10 hover:scale-105'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="absolute -top-9 px-2 py-0.5 rounded-lg text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-amber-600 text-white shadow-md">
              Admin Deck
            </span>
          </button>
        </>
      )}

      {/* Profile / Account Trigger */}
      <div className="w-[1px] h-6 bg-black/10 dark:bg-white/15 my-auto" />
      <button
        onClick={onOpenAuth}
        title={currentUser ? `Logged in as ${currentUser.username}` : 'Log In / Create Account'}
        className="w-10 h-10 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform overflow-hidden"
      >
        {currentUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white text-xs font-bold flex items-center justify-center uppercase shadow-sm">
            {currentUser.username.slice(0, 2)}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-stone-600 dark:text-stone-300 text-xs font-semibold flex items-center justify-center">
            Sign In
          </div>
        )}
      </button>
    </nav>
  );
};
