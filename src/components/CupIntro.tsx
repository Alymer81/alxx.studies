import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CupIntroProps {
  onDismiss: () => void;
  show: boolean;
}

interface Pearl {
  id: number;
  cx: number;
  cy: number;
  r: number;
  color: string;
  vy: number;
}

export const CupIntro: React.FC<CupIntroProps> = ({ onDismiss, show }) => {
  const [pearls, setPearls] = useState<Pearl[]>([
    { id: 1, cx: 60, cy: 272, r: 12.5, color: 'url(#cup-p0)', vy: 0 },
    { id: 2, cx: 87, cy: 274.5, r: 12.5, color: 'url(#cup-p1)', vy: 0 },
    { id: 3, cx: 114, cy: 275.5, r: 12.5, color: 'url(#cup-p2)', vy: 0 },
    { id: 4, cx: 141, cy: 274.5, r: 12.5, color: 'url(#cup-p3)', vy: 0 },
    { id: 5, cx: 166.5, cy: 271, r: 12.5, color: 'url(#cup-p4)', vy: 0 },
    { id: 6, cx: 74, cy: 249, r: 12.5, color: 'url(#cup-p5)', vy: 0 },
    { id: 7, cx: 101, cy: 250.5, r: 12.5, color: 'url(#cup-p6)', vy: 0 },
    { id: 8, cx: 128, cy: 249, r: 12.5, color: 'url(#cup-p7)', vy: 0 },
  ]);

  const [teaWobble, setTeaWobble] = useState(0);

  // Shake / Bounce pearls when clicked
  const shakeCup = () => {
    setTeaWobble(prev => prev + 1);
    setPearls(prev =>
      prev.map(p => ({
        ...p,
        cy: Math.max(180, p.cy - (25 + Math.random() * 40)),
      }))
    );
    setTimeout(() => {
      setPearls([
        { id: 1, cx: 60, cy: 272, r: 12.5, color: 'url(#cup-p0)', vy: 0 },
        { id: 2, cx: 87, cy: 274.5, r: 12.5, color: 'url(#cup-p1)', vy: 0 },
        { id: 3, cx: 114, cy: 275.5, r: 12.5, color: 'url(#cup-p2)', vy: 0 },
        { id: 4, cx: 141, cy: 274.5, r: 12.5, color: 'url(#cup-p3)', vy: 0 },
        { id: 5, cx: 166.5, cy: 271, r: 12.5, color: 'url(#cup-p4)', vy: 0 },
        { id: 6, cx: 74, cy: 249, r: 12.5, color: 'url(#cup-p5)', vy: 0 },
        { id: 7, cx: 101, cy: 250.5, r: 12.5, color: 'url(#cup-p6)', vy: 0 },
        { id: 8, cx: 128, cy: 249, r: 12.5, color: 'url(#cup-p7)', vy: 0 },
      ]);
    }, 450);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-2xl bg-black/40"
        >
          {/* Subtle SVG defs */}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <clipPath id="intro-cup-in" clipPathUnits="userSpaceOnUse">
                <path d="M22 106 H198 L179.5 278 Q178.5 286 170 286 H50 Q41.5 286 40.5 278 Z" />
              </clipPath>
              <clipPath id="intro-cup-top" clipPathUnits="userSpaceOnUse">
                <rect x="0" y="-20" width="220" height="64" />
              </clipPath>
              <linearGradient id="cup-glass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#dff0ff" stopOpacity=".55" />
                <stop offset=".5" stopColor="#ffffff" stopOpacity=".2" />
                <stop offset="1" stopColor="#d6e8fb" stopOpacity=".5" />
              </linearGradient>
              <linearGradient id="cup-tea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFF6EC" />
                <stop offset="1" stopColor="#EED6BD" />
              </linearGradient>
              <linearGradient id="cup-lid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".78" />
                <stop offset="1" stopColor="#e3eef9" stopOpacity=".42" />
              </linearGradient>
              <linearGradient id="cup-rim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#dfe8f2" />
              </linearGradient>
              <radialGradient id="cup-shadow" cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor="#1e5078" stopOpacity=".3" />
                <stop offset="1" stopColor="#1e5078" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cup-straw" gradientUnits="userSpaceOnUse" x1="138.6" y1="4.46" x2="161.4" y2="7.54">
                <stop offset="0" stopColor="#0f8f78" />
                <stop offset=".16" stopColor="#2fe0b0" />
                <stop offset=".34" stopColor="#9df7e3" />
                <stop offset=".42" stopColor="#ffffff" />
                <stop offset=".5" stopColor="#7fe6d6" />
                <stop offset=".74" stopColor="#2399c9" />
                <stop offset="1" stopColor="#11518f" />
              </linearGradient>
              <radialGradient id="cup-p0" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#2fe0b0" /><stop offset="1" stopColor="#1a7cc9" /></radialGradient>
              <radialGradient id="cup-p1" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#43c2ff" /><stop offset="1" stopColor="#3058f0" /></radialGradient>
              <radialGradient id="cup-p2" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#ff5a7e" /><stop offset="1" stopColor="#b1124b" /></radialGradient>
              <radialGradient id="cup-p3" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#e064ff" /><stop offset="1" stopColor="#6e3cff" /></radialGradient>
              <radialGradient id="cup-p4" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#ffbe2e" /><stop offset="1" stopColor="#ff4f2b" /></radialGradient>
              <radialGradient id="cup-p5" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#2be0e6" /><stop offset="1" stopColor="#0b8f86" /></radialGradient>
              <radialGradient id="cup-p6" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#5ee08a" /><stop offset="1" stopColor="#139b48" /></radialGradient>
              <radialGradient id="cup-p7" cx=".38" cy=".34" r=".72"><stop offset="0" stopColor="#ff7ac0" /><stop offset="1" stopColor="#4f6bff" /></radialGradient>
            </defs>
          </svg>

          {/* Interactive Animated Boba Cup */}
          <motion.div
            className="cursor-pointer group relative"
            onClick={shakeCup}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Click to shake pearls!"
          >
            <div className="w-56 h-76 sm:w-64 sm:h-84 drop-shadow-2xl">
              <svg viewBox="0 0 220 300" className="w-full h-full filter">
                {/* Shadow */}
                <ellipse cx="110" cy="294" rx="78" ry="7" fill="url(#cup-shadow)" />

                {/* Cup Glass Body */}
                <path d="M18 104 H202 L182 280 Q181 290 171 290 H49 Q39 290 38 280 Z" fill="url(#cup-glass)" />

                {/* Straw back portion */}
                <path d="M138.6 4.46 L161.4 7.54 L125.4 273.54 L102.6 270.46 Z" fill="url(#cup-straw)" opacity=".92" />

                {/* Inside liquid & Pearls */}
                <g clipPath="url(#intro-cup-in)">
                  {/* Milk Tea Liquid */}
                  <g className="transition-transform duration-300">
                    <rect x="0" y="150" width="220" height="160" fill="url(#cup-tea)" opacity=".88" />
                    <ellipse cx="110" cy="150" rx="86" ry="6" fill="#FFFBF5" />
                    <path d="M40 150.5 Q110 158 182 150.5" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".9" />
                  </g>

                  {/* Tapioca Pearls */}
                  {pearls.map((p) => (
                    <g key={p.id} className="transition-all duration-300 ease-out">
                      <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} />
                      <circle cx={p.cx - 4.2} cy={p.cy - 4.6} r={3.6} fill="#fff" opacity=".75" />
                    </g>
                  ))}
                </g>

                {/* Specular glass highlights */}
                <path d="M30 116 L48 276" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".7" />
                <path d="M43 118 L57 262" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".45" />
                <path d="M189 118 L181 190" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".5" />
                <ellipse cx="110" cy="284" rx="66" ry="4.5" fill="#fff" opacity=".5" />

                {/* Outline */}
                <path d="M22 106 H198 L179.5 278 Q178.5 286 170 286 H50 Q41.5 286 40.5 278 Z" fill="none" stroke="#fff" strokeWidth="2.2" opacity=".85" />
                <path d="M18 104 H202 L182 280 Q181 290 171 290 H49 Q39 290 38 280 Z" fill="none" stroke="#37557a" strokeOpacity=".5" strokeWidth="1.6" strokeLinejoin="round" />

                {/* Cup Lid */}
                <path d="M24 92 C24 57 64 41 110 41 C156 41 196 57 196 92 Z" fill="url(#cup-lid)" stroke="#37557a" strokeOpacity=".42" strokeWidth="1.5" />
                <path d="M40 82 C44 62 70 50 100 48" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" opacity=".95" />
                <rect x="12" y="88" width="196" height="17" rx="8.5" fill="url(#cup-rim)" stroke="#37557a" strokeOpacity=".35" strokeWidth="1.2" />
                <path d="M22 91.5 H198" stroke="#fff" strokeWidth="2" strokeLinecap="round" />

                {/* Straw Hole & Straw Top */}
                <ellipse cx="145.99" cy="43.5" rx="15.5" ry="4.6" fill="#cfe1f0" stroke="#fff" strokeWidth="1.6" transform="rotate(7.71 145.99 43.5)" />
                <path d="M138.6 4.46 L161.4 7.54 L125.4 273.54 L102.6 270.46 Z" fill="url(#cup-straw)" clipPath="url(#intro-cup-top)" />
                <ellipse cx="150" cy="6" rx="11.5" ry="3.8" fill="#0c5d6b" stroke="#b9fff0" strokeWidth="1.3" transform="rotate(7.71 150 6)" />
              </svg>
            </div>
            <div className="text-center text-xs text-white/70 mt-2 font-medium">Click cup to bounce pearls</div>
          </motion.div>

          {/* Branding Lockup */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              alxx.studies
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/80 max-w-sm">
              aesthetic study hub, live AI mentor, lo-fi ambience & unblocked games
            </p>
          </motion.div>

          {/* Enter Portal CTA */}
          <motion.button
            onClick={onDismiss}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-7 py-3 rounded-2xl bg-white/90 hover:bg-white text-stone-900 font-semibold shadow-xl backdrop-blur-md transition-all text-sm tracking-wide"
          >
            Enter Portal
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
