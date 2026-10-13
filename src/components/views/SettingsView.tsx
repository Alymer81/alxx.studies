import React, { useState } from 'react';
import { THEMES, ACCENTS, DISGUISES, CLOCK_FONTS, WALLPAPERS } from '../../data/defaults';
import { DisguiseConfig, ClockFont, WallpaperConfig, WidgetSettings } from '../../types';
import { Palette, Shield, Zap, Keyboard, Check, Type, Image as ImageIcon, LayoutGrid, CloudSun, BookOpen, Quote } from 'lucide-react';

interface SettingsViewProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  currentAccent: string;
  onAccentChange: (accentColor: string) => void;
  currentDisguise: string;
  onDisguiseChange: (disguise: DisguiseConfig) => void;
  panicKey: string;
  onPanicKeyChange: (key: string) => void;
  panicUrl: string;
  onPanicUrlChange: (url: string) => void;
  clockFont: ClockFont;
  onClockFontChange: (font: ClockFont) => void;
  currentWallpaper: string;
  onWallpaperChange: (wallpaperId: string) => void;
  customWallpaperUrl: string;
  onCustomWallpaperChange: (url: string) => void;
  widgets: WidgetSettings;
  onUpdateWidgets: (w: WidgetSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentTheme,
  onThemeChange,
  currentAccent,
  onAccentChange,
  currentDisguise,
  onDisguiseChange,
  panicKey,
  onPanicKeyChange,
  panicUrl,
  onPanicUrlChange,
  clockFont,
  onClockFontChange,
  currentWallpaper,
  onWallpaperChange,
  customWallpaperUrl,
  onCustomWallpaperChange,
  widgets,
  onUpdateWidgets,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customFavicon, setCustomFavicon] = useState('');
  const [isCapturingPanicKey, setIsCapturingPanicKey] = useState(false);
  const [customWpInput, setCustomWpInput] = useState(customWallpaperUrl);

  const handleApplyCustomDisguise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    onDisguiseChange({
      id: 'custom',
      name: 'Custom Disguise',
      title: customTitle.trim(),
      favicon: customFavicon.trim() || 'https://www.google.com/favicon.ico',
    });
  };

  const handleCustomWallpaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWpInput.trim()) return;
    onCustomWallpaperChange(customWpInput.trim());
    onWallpaperChange('custom');
  };

  const handleKeyDownCapture = (e: React.KeyboardEvent) => {
    if (isCapturingPanicKey) {
      e.preventDefault();
      onPanicKeyChange(e.key);
      setIsCapturingPanicKey(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 text-stone-900 dark:text-stone-100 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Portal Customization</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Personalize wallpapers, clock typography, aesthetic palettes, tab disguises, and stealth shortcuts.
        </p>
      </div>

      {/* ================= CLOCK TYPOGRAPHY ================= */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Type className="w-4 h-4 text-amber-500" /> Digital Clock Font Style
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CLOCK_FONTS.map((font) => {
            const isSelected = clockFont === font.id;
            return (
              <button
                key={font.id}
                onClick={() => onClockFontChange(font.id as ClockFont)}
                className={`p-3.5 rounded-2xl glass-card flex flex-col items-center text-center transition-all ${
                  isSelected ? 'ring-2 ring-amber-500 scale-102 bg-amber-500/10' : ''
                }`}
              >
                <div className={`text-xl mb-1 ${font.styleClass}`}>12:45</div>
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  {font.name}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= WALLPAPER SELECTION ================= */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-500" /> Background Wallpaper
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => onWallpaperChange(wp.id)}
                className={`group relative aspect-video rounded-2xl overflow-hidden glass-card transition-all ${
                  isSelected ? 'ring-3 ring-amber-500 scale-102 shadow-lg' : ''
                }`}
              >
                {wp.url ? (
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-200 via-rose-200 to-teal-200 dark:from-stone-900 dark:via-purple-950 dark:to-stone-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2.5">
                  <span className="text-xs font-bold text-white flex items-center justify-between w-full">
                    <span>{wp.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Wallpaper Form */}
        <form onSubmit={handleCustomWallpaperSubmit} className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2 text-xs">
          <span className="font-semibold text-[11px] text-stone-500 uppercase">Use Custom Wallpaper URL</span>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or any direct image link"
              value={customWpInput}
              onChange={(e) => setCustomWpInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shrink-0"
            >
              Apply Wallpaper
            </button>
          </div>
        </form>
      </div>

      {/* ================= THEME PALETTES ================= */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-500" /> Theme Palettes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`p-3 rounded-2xl glass-card flex items-center gap-3 text-left transition-all ${
                  isSelected ? 'ring-2 ring-amber-500 bg-amber-500/10' : ''
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full shadow-inner border border-white/20 shrink-0"
                  style={{ backgroundColor: theme.baseColor }}
                />
                <div className="truncate flex-1">
                  <div className="font-bold text-xs truncate">{theme.name}</div>
                  <div className="text-[10px] text-stone-400 capitalize">
                    {theme.isDark ? 'Dark Mode' : 'Light Mode'}
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ACCENT COLORS ================= */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Accent Color Customization
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {ACCENTS.map((pair, idx) => {
            const isSelected = currentAccent === pair[0];
            return (
              <button
                key={idx}
                onClick={() => onAccentChange(pair[0])}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-transform ${
                  isSelected ? 'scale-120 ring-2 ring-white ring-offset-2 ring-offset-stone-900' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: pair[0] }}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}

          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-black/10 dark:border-white/10 text-xs">
            <span className="text-[11px] text-stone-500">Custom Hex:</span>
            <input
              type="color"
              value={currentAccent}
              onChange={(e) => onAccentChange(e.target.value)}
              className="w-8 h-8 rounded-xl border border-white/20 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* ================= TAB DISGUISES ================= */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" /> Stealth Tab Cloaking & Disguises
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DISGUISES.map((disguise) => {
            const isSelected = currentDisguise === disguise.id;
            return (
              <button
                key={disguise.id}
                onClick={() => onDisguiseChange(disguise)}
                className={`p-3 rounded-2xl glass-card flex items-center gap-3 text-left transition-all ${
                  isSelected ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : ''
                }`}
              >
                <img src={disguise.favicon} alt="" className="w-5 h-5 rounded shrink-0 object-contain" />
                <div className="truncate flex-1">
                  <div className="font-bold text-xs truncate">{disguise.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{disguise.title}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleApplyCustomDisguise} className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2 text-xs">
          <span className="font-semibold text-[11px] text-stone-500 uppercase">Custom Title & Icon</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Custom Tab Title (e.g. Science Docs)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 focus:outline-none"
            />
            <input
              type="url"
              placeholder="Custom Favicon URL (optional)"
              value={customFavicon}
              onChange={(e) => setCustomFavicon(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
          >
            Apply Custom Disguise
          </button>
        </form>
      </div>

      {/* ================= HOME DASHBOARD WIDGETS ================= */}
      <div className="p-6 rounded-3xl liquid-glass space-y-4">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-amber-500" /> Home Page Widgets & Utilities
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Choose which optional widgets appear on your homepage below your apps dock.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Scratchpad toggle */}
          <div
            onClick={() => onUpdateWidgets({ ...widgets, showScratchpad: !widgets.showScratchpad })}
            className={`p-4 rounded-2xl liquid-card cursor-pointer border transition-all ${
              widgets.showScratchpad
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-black/5 dark:border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                <BookOpen className="w-4 h-4" />
              </span>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  widgets.showScratchpad ? 'bg-amber-500 text-stone-950' : 'bg-stone-500/20 text-stone-400'
                }`}
              >
                {widgets.showScratchpad ? '✓' : ''}
              </span>
            </div>
            <h4 className="font-bold text-xs">Study Scratchpad</h4>
            <p className="text-[10px] text-stone-400 mt-1">Quick autosaved notepad for formulas and notes.</p>
          </div>

          {/* Daily Mindset toggle */}
          <div
            onClick={() => onUpdateWidgets({ ...widgets, showMindset: !widgets.showMindset })}
            className={`p-4 rounded-2xl liquid-card cursor-pointer border transition-all ${
              widgets.showMindset
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-black/5 dark:border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                <Quote className="w-4 h-4" />
              </span>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  widgets.showMindset ? 'bg-amber-500 text-stone-950' : 'bg-stone-500/20 text-stone-400'
                }`}
              >
                {widgets.showMindset ? '✓' : ''}
              </span>
            </div>
            <h4 className="font-bold text-xs">Daily Mindset</h4>
            <p className="text-[10px] text-stone-400 mt-1">Daily rotating inspirational study quotes.</p>
          </div>

          {/* Weather Widget toggle */}
          <div
            onClick={() => onUpdateWidgets({ ...widgets, showWeather: !widgets.showWeather })}
            className={`p-4 rounded-2xl liquid-card cursor-pointer border transition-all ${
              widgets.showWeather
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-black/5 dark:border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                <CloudSun className="w-4 h-4" />
              </span>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  widgets.showWeather ? 'bg-amber-500 text-stone-950' : 'bg-stone-500/20 text-stone-400'
                }`}
              >
                {widgets.showWeather ? '✓' : ''}
              </span>
            </div>
            <h4 className="font-bold text-xs">Campus Weather</h4>
            <p className="text-[10px] text-stone-400 mt-1">Live temperature, conditions, and wind desk.</p>
          </div>
        </div>
      </div>

      {/* ================= PANIC KEY ================= */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-rose-500" /> Emergency Panic Key
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] text-stone-500 font-semibold uppercase mb-1">
              Panic Hotkey Trigger
            </label>
            <button
              type="button"
              onKeyDown={handleKeyDownCapture}
              onClick={() => setIsCapturingPanicKey(true)}
              className={`w-full py-2 px-3 rounded-xl border text-center font-mono font-bold transition-all ${
                isCapturingPanicKey
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10 text-stone-900 dark:text-white'
              }`}
            >
              {isCapturingPanicKey ? 'Press any key...' : `[ ${panicKey} ]`}
            </button>
          </div>
          <div>
            <label className="block text-[11px] text-stone-500 font-semibold uppercase mb-1">
              Emergency Redirect URL
            </label>
            <input
              type="url"
              value={panicUrl}
              onChange={(e) => onPanicUrlChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
