'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, RotateCcw, Sun, CloudRain, CloudLightning, Plane, Bird, Bot, Briefcase, Camera, Cloud } from 'lucide-react';
import { useWorldStore } from '@/stores/world.store';
import type { Weather, AvatarMode } from '@/stores/world.store';

const weatherOptions: { value: Weather; label: string; icon: React.ReactNode }[] = [
  { value: 'clear', label: 'Sunny', icon: <Sun size={13} /> },
  { value: 'rain', label: 'Rain', icon: <CloudRain size={13} /> },
  { value: 'storm', label: 'Storm', icon: <CloudLightning size={13} /> },
];

const modeOptions: { value: AvatarMode; label: string; icon: React.ReactNode }[] = [
  { value: 'work', label: 'Work', icon: <Briefcase size={13} /> },
  { value: 'travel', label: 'Travel', icon: <Plane size={13} /> },
  { value: 'creator', label: 'Creator', icon: <Camera size={13} /> },
];

const companionOptions = [
  { key: 'airplane' as const, label: 'Airplanes', icon: <Plane size={13} /> },
  { key: 'birds' as const, label: 'Birds', icon: <Bird size={13} /> },
  { key: 'aiCompanion' as const, label: 'AI Companion', icon: <Bot size={13} /> },
];

interface Props {
  inlineMode?: boolean;
}

export default function MyLittleWorldConfig({ inlineMode = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cloudDensity, cloudSize, weather, companions, avatarMode,
    setCloudDensity, setCloudSize, setWeather, setAvatarMode,
    toggleCompanion, surpriseMe, reset,
  } = useWorldStore();

  const configContent = (
    <div className="cfg-body">
      {/* Cloud Density */}
      <div className="cfg-group">
        <label className="cfg-label" htmlFor={inlineMode ? 'cloud-density-inline' : 'cloud-density'}>Cloud Density</label>
        <input
          id={inlineMode ? 'cloud-density-inline' : 'cloud-density'}
          type="range"
          min="0" max="100"
          value={cloudDensity * 100}
          onChange={(e) => setCloudDensity(Number(e.target.value) / 100)}
          className="cfg-slider"
        />
      </div>

      {/* Cloud Size */}
      <div className="cfg-group">
        <label className="cfg-label" htmlFor={inlineMode ? 'cloud-size-inline' : 'cloud-size'}>Cloud Size</label>
        <input
          id={inlineMode ? 'cloud-size-inline' : 'cloud-size'}
          type="range"
          min="50" max="200"
          value={cloudSize * 100}
          onChange={(e) => setCloudSize(Number(e.target.value) / 100)}
          className="cfg-slider"
        />
      </div>

      {/* Weather */}
      <div className="cfg-group">
        <span className="cfg-label">Weather</span>
        <div className="cfg-chips">
          {weatherOptions.map((opt) => (
            <button
              key={opt.value}
              className={`cfg-chip ${weather === opt.value ? 'cfg-chip--active' : ''}`}
              onClick={() => setWeather(opt.value)}
              aria-pressed={weather === opt.value}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Companions */}
      <div className="cfg-group">
        <span className="cfg-label">Companions</span>
        <div className="cfg-checks">
          {companionOptions.map((opt) => (
            <label key={opt.key} className="cfg-check">
              <input
                type="checkbox"
                checked={companions[opt.key]}
                onChange={() => toggleCompanion(opt.key)}
              />
              <span className="cfg-check__box" />
              {opt.icon}
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className="cfg-group">
        <span className="cfg-label">Mode</span>
        <div className="cfg-chips">
          {modeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`cfg-chip ${avatarMode === opt.value ? 'cfg-chip--active' : ''}`}
              onClick={() => setAvatarMode(opt.value)}
              aria-pressed={avatarMode === opt.value}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="cfg-actions">
        <button className="cfg-action" onClick={surpriseMe} id="cfg-randomize">
          <Shuffle size={13} /> Randomize
        </button>
        <button className="cfg-action" onClick={reset} id="cfg-reset">
          <RotateCcw size={13} /> Reset
        </button>
      </div>
    </div>
  );

  // INLINE MODE: Always visible panel (used inside HeroSection on desktop)
  if (inlineMode) {
    return (
      <div className="cfg-panel cfg-panel--inline glass-card" role="region" aria-label="Cloud Configurator">
        <div className="cfg-header">
          <div className="cfg-header__left">
            <Cloud size={15} />
            <h3 className="cfg-header__title">Cloud Configurator</h3>
          </div>
          <button className="cfg-close" aria-label="Close" onClick={() => {}}>
            <X size={16} />
          </button>
        </div>
        {configContent}

        <style jsx>{`${sharedStyles}`}</style>
      </div>
    );
  }

  // FLOATING MODE: Mobile bottom-sheet / overlay
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="cfg-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="cfg-panel cfg-panel--floating glass-card"
              role="dialog"
              aria-modal="true"
              aria-label="Cloud Configurator"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="cfg-header">
                <div className="cfg-header__left">
                  <Cloud size={15} />
                  <h3 className="cfg-header__title">Cloud Configurator</h3>
                </div>
                <button className="cfg-close" onClick={() => setIsOpen(false)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              {configContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style jsx>{`${sharedStyles}
        .cfg-backdrop {
          position: fixed;
          inset: 0;
          z-index: 950;
          background: rgba(0, 0, 0, 0.4);
        }

        .cfg-panel--floating {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 960;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 20px 20px 0 0;
        }

        @media (min-width: 768px) {
          .cfg-panel--floating {
            top: 50%;
            right: 24px;
            left: auto;
            bottom: auto;
            transform: translateY(-50%);
            width: 320px;
            border-radius: 20px;
          }
        }
      `}</style>
    </>
  );
}

const sharedStyles = `
  .cfg-panel {
    padding: 0;
    overflow: hidden;
  }

  .cfg-panel--inline {
    border-radius: 16px;
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3), 0 0 30px rgba(105, 88, 255, 0.08);
  }

  .cfg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px 12px;
    border-bottom: 1px solid rgba(105, 88, 255, 0.15);
  }

  .cfg-header__left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--accent-tech);
  }

  .cfg-header__title {
    font-family: var(--font-display);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .cfg-close {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .cfg-close:hover {
    background: rgba(105, 88, 255, 0.1);
    color: var(--text-primary);
  }

  .cfg-body {
    padding: 14px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cfg-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cfg-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .cfg-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 5px;
    border-radius: 3px;
    background: rgba(105, 88, 255, 0.15);
    outline: none;
    cursor: pointer;
  }

  .cfg-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6958FF;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(105, 88, 255, 0.4);
  }

  .cfg-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .cfg-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 8px;
    background: rgba(13, 27, 62, 0.5);
    border: 1px solid rgba(105, 88, 255, 0.15);
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--font-body);
  }

  .cfg-chip:hover {
    border-color: rgba(105, 88, 255, 0.4);
    color: var(--text-primary);
  }

  .cfg-chip--active {
    background: rgba(105, 88, 255, 0.15);
    border-color: #6958FF;
    color: var(--text-primary);
  }

  .cfg-checks {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cfg-check {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.15s;
  }

  .cfg-check:hover {
    background: rgba(105, 88, 255, 0.05);
  }

  .cfg-check input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .cfg-check__box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid rgba(105, 88, 255, 0.3);
    background: rgba(13, 27, 62, 0.5);
    position: relative;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .cfg-check input:checked + .cfg-check__box {
    background: #6958FF;
    border-color: #6958FF;
  }

  .cfg-check input:checked + .cfg-check__box::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.6rem;
    color: white;
    font-weight: 700;
  }

  .cfg-actions {
    display: flex;
    gap: 8px;
    padding-top: 4px;
  }

  .cfg-action {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 9px 14px;
    border-radius: 8px;
    font-size: 0.73rem;
    font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid rgba(105, 88, 255, 0.15);
    background: rgba(13, 27, 62, 0.5);
    color: var(--text-secondary);
  }

  .cfg-action:hover {
    border-color: #6958FF;
    color: var(--text-primary);
    background: rgba(105, 88, 255, 0.1);
    transform: translateY(-1px);
  }
`;
