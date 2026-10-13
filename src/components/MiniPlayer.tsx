import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, X } from 'lucide-react';
import { ViewType } from '../types';

interface MiniPlayerProps {
  isPlaying: boolean;
  activeTrackName: string;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onOpenListen: () => void;
  onStopAll: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  isPlaying,
  activeTrackName,
  volume,
  onTogglePlay,
  onVolumeChange,
  onOpenListen,
  onStopAll,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  if (!isPlaying && !activeTrackName) return null;

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(prevVolume || 0.5);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  return (
    <aside
      aria-label="Audio mini-player"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel shadow-lg border border-black/10 dark:border-white/10 text-xs text-stone-800 dark:text-stone-100 max-w-sm w-[92vw] sm:w-auto"
    >
      {/* Animated Sound Wave or Music Icon */}
      <button
        onClick={onOpenListen}
        className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
        title="Open Listen Studio"
      >
        <Music className="w-3.5 h-3.5 animate-pulse" />
      </button>

      {/* Track info */}
      <button
        onClick={onOpenListen}
        className="flex flex-col text-left truncate flex-1 hover:underline cursor-pointer"
      >
        <span className="font-semibold truncate">{activeTrackName || 'Focus Ambience'}</span>
        <span className="text-[10px] text-stone-500 dark:text-stone-400">alxx.studies audio</span>
      </button>

      {/* Play / Pause toggle */}
      <button
        onClick={onTogglePlay}
        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current transition-colors"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Volume slider */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleToggleMute}
          className="p-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
        >
          {volume === 0 || isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setIsMuted(false);
            onVolumeChange(parseFloat(e.target.value));
          }}
          className="w-14 h-1 accent-amber-600 cursor-pointer"
        />
      </div>

      {/* Stop & Close */}
      <button
        onClick={onStopAll}
        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 ml-1"
        title="Stop and close player"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
