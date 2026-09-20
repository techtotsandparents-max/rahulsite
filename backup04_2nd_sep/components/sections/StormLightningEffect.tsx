'use client';

import { useEffect, useState } from 'react';

export function StormLightningEffect() {
  const [flashKey, setFlashKey] = useState(0);
  const [activeStrike, setActiveStrike] = useState<'left' | 'center' | 'right' | 'fork'>('center');
  const [flashIntensity, setFlashIntensity] = useState(0);

  useEffect(() => {
    // Soft lightning strikes at dynamic intervals
    const triggerStrike = () => {
      const strikes: Array<'left' | 'center' | 'right' | 'fork'> = ['left', 'center', 'right', 'fork'];
      const nextStrike = strikes[Math.floor(Math.random() * strikes.length)];
      setActiveStrike(nextStrike);
      setFlashKey((prev) => prev + 1);
      setFlashIntensity(0.35 + Math.random() * 0.15);

      // Strobe flash decay
      setTimeout(() => setFlashIntensity(0.12), 80);
      setTimeout(() => setFlashIntensity(0.3), 140);
      setTimeout(() => setFlashIntensity(0.05), 220);
      setTimeout(() => setFlashIntensity(0), 380);
    };

    const interval = setInterval(triggerStrike, 3200);
    triggerStrike(); // initial strike

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="storm-lightning-container" aria-hidden="true">
      {/* 1. Full-Screen Atmospheric Thunder Flash Overlay */}
      <div
        className="thunder-ambient-flash"
        style={{
          opacity: flashIntensity,
          background:
            activeStrike === 'fork'
              ? 'radial-gradient(circle at 50% 30%, rgba(192, 132, 252, 0.25), rgba(56, 189, 248, 0.15), rgba(8, 14, 30, 0.6))'
              : 'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.35), rgba(56, 189, 248, 0.15), rgba(8, 14, 30, 0.6))',
        }}
      />

      {/* 2. Dark Storm Atmosphere Backdrop */}
      <div className="storm-clouds-darkening" />

      {/* 3. Subtle Rain Streaks (16 Light Angled Raindrops) */}
      <div className="torrential-rain-grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="rain-streak"
            style={{
              left: `${(i / 16) * 100}%`,
              animationDuration: `${0.6 + (i % 4) * 0.15}s`,
              animationDelay: `${(i % 5) * 0.12}s`,
              height: `${18 + (i % 3) * 12}px`,
              opacity: 0.18 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      {/* 4. Jagged Multi-Branching SVG Lightning Bolts */}
      <svg className="lightning-svg-stage" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <defs>
          <filter id="lightningGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="lightningGlowPurple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="22" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E0F2FE" />
            <stop offset="80%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          <linearGradient id="forkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>

        {/* CENTER POWERFUL MAIN BOLT */}
        {(activeStrike === 'center' || activeStrike === 'fork') && (
          <g key={`center-${flashKey}`} className="bolt-group bolt-animated">
            <path
              d="M 520 0 L 500 90 L 535 150 L 480 240 L 525 310 L 470 410 L 510 490 L 485 580"
              stroke="#38BDF8"
              strokeWidth="14"
              fill="none"
              filter="url(#lightningGlowCyan)"
              opacity="0.85"
            />
            <path
              d="M 520 0 L 500 90 L 535 150 L 480 240 L 525 310 L 470 410 L 510 490 L 485 580"
              stroke="url(#boltGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 535 150 L 590 200 L 620 260"
              stroke="#38BDF8"
              strokeWidth="2.5"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 480 240 L 420 300 L 390 350"
              stroke="#E0F2FE"
              strokeWidth="2"
              fill="none"
              opacity="0.75"
            />
          </g>
        )}

        {/* LEFT FORK LIGHTNING STRIKE */}
        {(activeStrike === 'left' || activeStrike === 'fork') && (
          <g key={`left-${flashKey}`} className="bolt-group bolt-animated">
            <path
              d="M 220 0 L 195 110 L 240 180 L 175 290 L 220 370 L 160 480"
              stroke="#C084FC"
              strokeWidth="12"
              fill="none"
              filter="url(#lightningGlowPurple)"
              opacity="0.8"
            />
            <path
              d="M 220 0 L 195 110 L 240 180 L 175 290 L 220 370 L 160 480"
              stroke="url(#forkGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 240 180 L 295 235 L 330 280"
              stroke="#E9D5FF"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
          </g>
        )}

        {/* RIGHT ELECTRIC LIGHTNING STRIKE */}
        {(activeStrike === 'right' || activeStrike === 'fork') && (
          <g key={`right-${flashKey}`} className="bolt-group bolt-animated">
            <path
              d="M 820 0 L 785 100 L 830 190 L 765 290 L 810 390 L 755 520"
              stroke="#38BDF8"
              strokeWidth="12"
              fill="none"
              filter="url(#lightningGlowCyan)"
              opacity="0.8"
            />
            <path
              d="M 820 0 L 785 100 L 830 190 L 765 290 L 810 390 L 755 520"
              stroke="url(#boltGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 765 290 L 710 340 L 680 390"
              stroke="#38BDF8"
              strokeWidth="2.2"
              fill="none"
              opacity="0.75"
            />
          </g>
        )}
      </svg>

      <style jsx>{`
        .storm-lightning-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
          overflow: hidden;
        }

        .thunder-ambient-flash {
          position: absolute;
          inset: 0;
          transition: opacity 0.05s ease-out;
          pointer-events: none;
          z-index: 1;
        }

        .storm-clouds-darkening {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(8, 14, 30, 0.4), rgba(4, 8, 20, 0.75));
          pointer-events: none;
          z-index: 0;
        }

        .torrential-rain-grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .rain-streak {
          position: absolute;
          top: -60px;
          width: 2px;
          background: linear-gradient(180deg, transparent, rgba(186, 230, 253, 0.8), rgba(56, 189, 248, 0.9));
          border-radius: 2px;
          transform: rotate(-14deg);
          animation: torrentialRain linear infinite;
        }

        @keyframes torrentialRain {
          0% {
            transform: translateY(-80px) rotate(-14deg);
          }
          100% {
            transform: translateY(850px) rotate(-14deg);
          }
        }

        .lightning-svg-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        .bolt-animated {
          animation: lightningStrobe 0.35s ease-out forwards;
        }

        @keyframes lightningStrobe {
          0% {
            opacity: 0;
            transform: scaleY(0.4);
          }
          15% {
            opacity: 1;
            transform: scaleY(1);
          }
          30% {
            opacity: 0.3;
          }
          45% {
            opacity: 1;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
