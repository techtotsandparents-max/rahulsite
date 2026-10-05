'use client';

export function RainWeatherEffect() {
  return (
    <div className="rain-weather-container" aria-hidden="true">
      {/* Light Rain Soft Atmosphere Overlay */}
      <div className="rain-mist-overlay" />

      {/* Subtle Micro Raindrop Grid (14 Delicate Drops) */}
      <div className="rain-grid">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="rain-drop-line"
            style={{
              left: `${8 + (i / 14) * 84}%`,
              animationDuration: `${0.9 + (i % 4) * 0.25}s`,
              animationDelay: `${(i % 5) * 0.18}s`,
              height: `${14 + (i % 3) * 8}px`,
              opacity: 0.18 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Micro Splashes along Bottom Cloud Stage */}
      <div className="rain-splash-row">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rain-splash-ring"
            style={{
              left: `${15 + i * 14}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .rain-weather-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .rain-mist-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 30%,
            rgba(56, 189, 248, 0.04) 0%,
            rgba(30, 41, 59, 0.12) 70%,
            transparent 100%
          );
        }

        .rain-grid {
          position: absolute;
          inset: 0;
        }

        .rain-drop-line {
          position: absolute;
          top: -30px;
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(186, 230, 253, 0.4),
            rgba(56, 189, 248, 0.6)
          );
          border-radius: 1px;
          transform: rotate(-8deg);
          animation: rainFallSoft linear infinite;
        }

        @keyframes rainFallSoft {
          0% {
            transform: translateY(-30px) rotate(-8deg);
          }
          100% {
            transform: translateY(650px) rotate(-8deg);
          }
        }

        /* Micro Rain Splash Rings */
        .rain-splash-row {
          position: absolute;
          bottom: 70px;
          left: 0;
          right: 0;
          height: 30px;
        }

        .rain-splash-ring {
          position: absolute;
          bottom: 5px;
          width: 8px;
          height: 4px;
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 50%;
          animation: splashRippleSoft 1.6s ease-out infinite;
        }

        @keyframes splashRippleSoft {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
