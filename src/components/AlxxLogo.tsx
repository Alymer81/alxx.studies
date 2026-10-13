import React from 'react';

interface AlxxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const AlxxLogo: React.FC<AlxxLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const sizeMap = {
    sm: 'h-5',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Geometric ALXX Vector Wordmark matching uploaded brand image */}
      <svg
        viewBox="0 0 380 90"
        fill="currentColor"
        className={`${sizeMap[size]} w-auto drop-shadow-sm transition-all`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ALXX"
      >
        {/* 'A' - Chevron apex with thick diagonal strokes and no crossbar */}
        <path d="M 10,84 L 46,6 L 72,6 L 108,84 L 84,84 L 59,28 L 34,84 Z" />

        {/* 'L' - Modern architectural stem with square base shelf */}
        <path d="M 124,6 L 148,6 L 148,64 L 200,64 L 200,84 L 124,84 Z" />

        {/* First 'X' - Bold geometric diagonal intersection */}
        <path d="M 214,6 L 238,6 L 261,44 L 284,6 L 308,6 L 273,56 L 310,84 L 286,84 L 261,48 L 236,84 L 212,84 L 249,56 Z" />

        {/* Second 'X' - Identical bold diagonal intersection */}
        <path d="M 320,6 L 344,6 L 367,44 L 390,6 L 414,6 L 379,56 L 416,84 L 392,84 L 367,48 L 342,84 L 318,84 L 355,56 Z" />
      </svg>

      {showSubtitle && (
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase opacity-75 mt-1 text-current">
          studies
        </span>
      )}
    </div>
  );
};
