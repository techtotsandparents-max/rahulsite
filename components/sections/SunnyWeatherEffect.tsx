'use client';

export function SunnyWeatherEffect() {
  return (
    <div className="sunny-weather-container" aria-hidden="true">
      {/* Gentle Warm Sunbeam Ambient Accent */}
      <div className="sunny-ambient-glow" />

      {/* Subtle Micro Solar Dust */}
      <div className="sun-particles-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="sun-particle"
            style={{
              left: `${15 + (i / 8) * 70}%`,
              animationDuration: `${6 + (i % 4) * 2}s`,
              animationDelay: `${(i % 3) * 1.2}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              opacity: 0.2 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .sunny-weather-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .sunny-ambient-glow {
          position: absolute;
          top: -100px;
          right: 15%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(251, 191, 36, 0.12) 0%,
            rgba(245, 158, 11, 0.05) 45%,
            transparent 70%
          );
          filter: blur(40px);
          animation: sunnySoftGlow 8s ease-in-out infinite alternate;
        }

        @keyframes sunnySoftGlow {
          0% { opacity: 0.5; transform: scale(0.95); }
          100% { opacity: 0.8; transform: scale(1.05); }
        }

        .sun-particles-grid {
          position: absolute;
          inset: 0;
        }

        .sun-particle {
          position: absolute;
          bottom: 20%;
          border-radius: 50%;
          background: #FBBF24;
          box-shadow: 0 0 4px rgba(251, 191, 36, 0.5);
          animation: floatUpSoft linear infinite;
        }

        @keyframes floatUpSoft {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          30% {
            opacity: 0.4;
          }
          70% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-250px) translateX(15px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
