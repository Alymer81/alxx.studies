import React, { useEffect, useRef } from 'react';
import { YouTubeTrack } from '../types';

interface YouTubePlayerProps {
  currentTrack: YouTubeTrack | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  onTrackEnd?: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  currentTrack,
  isPlaying,
  volume,
  onTrackEnd,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current || !currentTrack) return;

    // Send postMessage to YouTube IFrame API to play/pause
    const action = isPlaying ? 'playVideo' : 'pauseVideo';
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: action, args: [] }),
      '*'
    );
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (!iframeRef.current) return;
    // Set volume (0-100)
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.round(volume * 100)] }),
      '*'
    );
  }, [volume]);

  if (!currentTrack) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <iframe
        ref={iframeRef}
        key={currentTrack.id}
        src={embedUrl}
        title="Background YouTube Audio"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
};
