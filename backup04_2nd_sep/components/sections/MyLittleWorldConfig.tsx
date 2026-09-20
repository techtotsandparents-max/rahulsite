'use client';

import React from 'react';
import { X, Sun, CloudRain, CloudLightning, Plane, Bird, Bot, Briefcase, Users, Cloud } from 'lucide-react';
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
  { value: 'creator', label: 'Committee', icon: <Users size={13} /> },
];

const companionOptions = [
  { key: 'airplane' as const, label: 'Airplanes', icon: <Plane size={13} /> },
  { key: 'birds' as const, label: 'Birds', icon: <Bird size={13} /> },
  { key: 'aiCompanion' as const, label: 'AI Companion', icon: <Bot size={13} /> },
];

interface Props {
  onClose?: () => void;
}

export default function MyLittleWorldConfig({ onClose }: Props) {
  const {
    cloudDensity, cloudSize, weather, companions, avatarMode,
    setCloudDensity, setCloudSize, setWeather, setAvatarMode,
    toggleCompanion, surpriseMe, reset,
  } = useWorldStore();

  return (
    <div className="cloud-cfg-card glass-card">
      {/* Header */}
      <div className="cfg-header-row">
        <div className="cfg-title-wrapper">
          <Cloud size={18} className="text-indigo-400" />
          <h3 className="cfg-title font-mono">Cloud Configurator</h3>
        </div>
        <button className="cfg-close-square-btn" onClick={onClose} aria-label="Close Configurator">
          <X size={18} />
        </button>
      </div>

      <div className="cfg-body-content">
        {/* Row 1: Cloud Size Slider */}
        <div className="cfg-slider-block">
          <label className="cfg-label-mono">CLOUD SIZE</label>
          <input
            type="range"
            min="60"
            max="150"
            value={cloudSize * 100}
            onChange={(e) => setCloudSize(Number(e.target.value) / 100)}
            className="cfg-slider-retro"
          />
        </div>

        {/* Row 2: Cloud Density Slider */}
        <div className="cfg-slider-block">
          <label className="cfg-label-mono">CLOUD DENSITY & GLOW</label>
          <input
            type="range"
            min="10"
            max="100"
            value={cloudDensity * 100}
            onChange={(e) => setCloudDensity(Number(e.target.value) / 100)}
            className="cfg-slider-retro"
          />
        </div>

        {/* Row 3: Weather Chips */}
        <div className="cfg-section">
          <span className="cfg-label-mono">WEATHER</span>
          <div className="cfg-chips-row">
            {weatherOptions.map((opt) => (
              <button
                key={opt.value}
                className={`cfg-chip-btn ${weather === opt.value ? 'is-active' : ''}`}
                onClick={() => setWeather(opt.value)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Companions Checkboxes */}
        <div className="cfg-section">
          <span className="cfg-label-mono">COMPANIONS</span>
          <div className="cfg-checkbox-group">
            {companionOptions.map((opt) => (
              <label key={opt.key} className="cfg-checkbox-item">
                <input
                  type="checkbox"
                  checked={companions[opt.key]}
                  onChange={() => toggleCompanion(opt.key)}
                />
                <span className="checkbox-custom-box" />
                {opt.icon}
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Row 5: Mode Chips */}
        <div className="cfg-section">
          <span className="cfg-label-mono">AVATAR MODE</span>
          <div className="cfg-chips-row">
            {modeOptions.map((opt) => (
              <button
                key={opt.value}
                className={`cfg-chip-btn ${avatarMode === opt.value ? 'is-active' : ''}`}
                onClick={() => setAvatarMode(opt.value)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="cfg-bottom-actions">
          <button className="cfg-btn-pill btn-silver" onClick={surpriseMe}>
            RANDOM
          </button>
          <button className="cfg-btn-pill btn-red" onClick={reset}>
            RESET
          </button>
        </div>
      </div>

      <style jsx>{`
        .cloud-cfg-card {
          width: 350px;
          max-width: 90vw;
          background: var(--bg-card-solid);
          border: 2px solid var(--accent-tech);
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(105, 88, 255, 0.2);
          overflow: hidden;
          padding: 18px 20px;
        }

        .cfg-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .cfg-title-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cfg-title {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cfg-close-square-btn {
          width: 32px;
          height: 32px;
          border: 2px solid #6958FF;
          border-radius: 8px;
          background: transparent;
          color: #6958FF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cfg-close-square-btn:hover {
          background: #6958FF;
          color: white;
        }

        .cfg-body-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 14px;
        }

        .cfg-slider-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cfg-label-mono {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .cfg-slider-retro {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(105, 88, 255, 0.2);
          outline: none;
          cursor: pointer;
        }

        .cfg-slider-retro::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6958FF;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(105, 88, 255, 0.5);
        }

        .cfg-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cfg-chips-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cfg-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cfg-chip-btn:hover {
          border-color: #6958FF;
          color: var(--text-primary);
        }

        .cfg-chip-btn.is-active {
          background: rgba(105, 88, 255, 0.2);
          border-color: #6958FF;
          color: var(--text-primary);
          font-weight: 600;
        }

        .cfg-checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cfg-checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .cfg-checkbox-item input {
          position: absolute;
          opacity: 0;
        }

        .checkbox-custom-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 2px solid rgba(105, 88, 255, 0.3);
          background: var(--glass-bg);
          position: relative;
          transition: all 0.2s;
        }

        .cfg-checkbox-item input:checked + .checkbox-custom-box {
          background: #6958FF;
          border-color: #6958FF;
        }

        .cfg-checkbox-item input:checked + .checkbox-custom-box::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.65rem;
          color: white;
          font-weight: 700;
        }

        .cfg-bottom-actions {
          display: flex;
          gap: 12px;
          margin-top: 6px;
        }

        .cfg-btn-pill {
          flex: 1;
          padding: 10px 14px;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-silver {
          background: linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%);
          color: #0F172A;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-silver:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .btn-red {
          background: linear-gradient(180deg, #F43F5E 0%, #E11D48 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
        }

        .btn-red:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(244, 63, 94, 0.45);
        }
      `}</style>
    </div>
  );
}
