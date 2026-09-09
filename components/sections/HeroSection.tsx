'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Play, Settings } from 'lucide-react';
import { GithubIcon, YoutubeIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/icons/SocialIcons';
import MyLittleWorldConfig from './MyLittleWorldConfig';
import { useWorldStore } from '@/stores/world.store';
import { ParallaxStage } from './ParallaxStage';

const socialLinks = [
  { name: 'GitHub', Icon: GithubIcon, url: 'https://github.com/rahultripathi' },
  { name: 'YouTube', Icon: YoutubeIcon, url: 'https://youtube.com/@rahultripathi' },
  { name: 'LinkedIn', Icon: LinkedinIcon, url: 'https://linkedin.com/in/rahultripathi' },
  { name: 'X / Twitter', Icon: TwitterIcon, url: 'https://x.com/rahultripathi' },
  { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com/rahultripathi' },
];

export default function HeroSection() {
  const [showConfig, setShowConfig] = useState(false);

  // Subscribe to World Store state for real-time reactive updates
  const { cloudSize, cloudDensity, weather, companions, avatarMode } = useWorldStore();

  // Per-mode avatar config
  const avatarConfig = {
    work: {
      src: '/avatar-3d-clean.png',
      alt: 'Rahul Tripathi — Cloud Architect working on laptop on a cloud',
      shadowColor: 'rgba(105, 88, 255,',
      bubble: (
        <>Let&apos;s <strong className="txt-purple">BUILD</strong><br /><strong>SOMETHING</strong><br /><strong className="txt-orange">GREAT</strong></>
      ),
    },
    travel: {
      src: '/avatar-travel-v2.png',
      alt: 'Rahul Tripathi — Traveller on snow mountains with Samsung Z Fold',
      shadowColor: 'rgba(255, 138, 61,',
      bubble: (
        <>Exploring <strong className="txt-orange">THE WORLD</strong><br /><span style={{fontSize:'0.6rem', opacity:0.8}}>Z Fold in hand ✈️</span></>
      ),
    },
    creator: {
      src: '/avatar-creator-v2.png',
      alt: 'Rahul Tripathi — Society Committee Member, Building Better Communities',
      shadowColor: 'rgba(74, 222, 128,',
      bubble: (
        <><strong className="txt-purple">COMMITTEE</strong><br /><strong>MEMBER</strong><br /><span style={{fontSize:'0.6rem', opacity:0.8}}>Building Communities 🏢</span></>
      ),
    },
  } as const;

  const currentAvatar = avatarConfig[avatarMode];

  // Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [-600, 600], [-18, 18]);
  const parallaxY = useTransform(mouseY, [-600, 600], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  return (
    <section
      id="hero-section"
      aria-label="Hero — Building in the Cloud, Exploring the World"
      className="hero-section"
      onMouseMove={handleMouseMove}
    >
      {/* Background ambient radial glows */}
      <div className="hero-ambient-bg" aria-hidden="true">
        <div className="glow-blob glow-blob--purple" />
        <div className="glow-blob glow-blob--orange" />
      </div>

      {/* Weather Overlay (Rain / Storm) */}
      {weather === 'rain' && (
        <div className="weather-rain-overlay">
          <div className="rain-drop drop-1">💧</div>
          <div className="rain-drop drop-2">💧</div>
          <div className="rain-drop drop-3">💧</div>
          <div className="rain-drop drop-4">💧</div>
        </div>
      )}
      {weather === 'storm' && (
        <div className="weather-storm-overlay">
          <div className="lightning-flash">⚡</div>
        </div>
      )}

      {/* ============================================================
          WIDE SPREAD 3D SKY COMPANIONS (CONSTANT ACROSS ALL 3 MODES)
         ============================================================ */}
      <div className="wide-sky-canvas" aria-hidden="true">

        {/* ── 2. Hyper-Realistic 3D Jet Airplane with Glowing Vapor Contrail (Upper Right Sky) ── */}
        {companions.airplane !== false && (
          <div className="sky-element sky-element--airplane">
            {/* Double Glowing Contrail Vapor Arc */}
            <svg viewBox="0 0 340 140" className="jet-contrail-svg">
              <defs>
                <linearGradient id="contrailGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity="0" />
                  <stop offset="40%" stopColor="#818CF8" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#38BDF8" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                d="M 10 130 Q 140 60, 300 20"
                fill="none"
                stroke="url(#contrailGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.85"
                filter="drop-shadow(0 0 8px rgba(129, 140, 248, 0.6))"
              />
              <path
                d="M 15 135 Q 145 65, 305 25"
                fill="none"
                stroke="url(#contrailGrad)"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                opacity="0.5"
              />
            </svg>

            {/* 3D Jet Airplane Model SVG */}
            <div className="jet-3d-model">
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fuselageGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                  <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="jetExhaust" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Jet Thruster Exhaust Glow */}
                <ellipse cx="14" cy="46" rx="8" ry="4" fill="url(#jetExhaust)" transform="rotate(-35 14 46)" />

                {/* Main Wings Sweep */}
                <path d="M 28 32 L 6 12 Q 12 8, 22 14 L 38 28 Z" fill="url(#wingGrad)" />
                <path d="M 36 40 L 22 62 Q 26 64, 34 56 L 44 42 Z" fill="url(#wingGrad)" />

                {/* Aerodynamic Fuselage Nose & Body */}
                <path d="M 62 10 Q 56 12, 38 24 Q 24 34, 12 44 Q 10 46, 14 48 Q 24 44, 42 30 Q 54 20, 62 10 Z" fill="url(#fuselageGrad)" />

                {/* Cockpit Canopy Window */}
                <path d="M 52 16 Q 48 18, 44 22 Q 48 20, 54 17 Z" fill="#38BDF8" opacity="0.9" />

                {/* Tail Fin */}
                <path d="M 18 42 L 8 48 Q 6 42, 12 38 Z" fill="#6958FF" />

                {/* Wingtip Navigation Lights */}
                <circle cx="6" cy="12" r="1.5" fill="#EF4444" className="nav-light-flash" />
                <circle cx="22" cy="62" r="1.5" fill="#22C55E" className="nav-light-flash" />
              </svg>
            </div>
          </div>
        )}

        {/* ── 3. Hyper-Realistic 3D Bird Flock V-Formation (Upper Mid Sky) ── */}
        {companions.birds !== false && (
          <div className="sky-element sky-element--birds" aria-hidden="true">
            <div className="bird-flock-v">
              {/* Lead bird */}
              <svg className="svg-bird bird-lead" width="32" height="16" viewBox="0 0 32 16" fill="none">
                <path d="M 16 8 Q 8 0, 0 6" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 16 8 Q 24 0, 32 6" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
              {/* Wing left 1 */}
              <svg className="svg-bird bird-l1" width="24" height="12" viewBox="0 0 24 12" fill="none">
                <path d="M 12 6 Q 6 0, 0 5" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 12 6 Q 18 0, 24 5" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              {/* Wing right 1 */}
              <svg className="svg-bird bird-r1" width="24" height="12" viewBox="0 0 24 12" fill="none">
                <path d="M 12 6 Q 6 0, 0 5" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 12 6 Q 18 0, 24 5" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              {/* Wing left 2 */}
              <svg className="svg-bird bird-l2" width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M 9 5 Q 4.5 0, 0 4" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 9 5 Q 13.5 0, 18 4" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
              {/* Wing right 2 */}
              <svg className="svg-bird bird-r2" width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M 9 5 Q 4.5 0, 0 4" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 9 5 Q 13.5 0, 18 4" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
        )}

        {/* ── 4. Hyper-Realistic 3D Atmosphere Cloud Clusters ── */}
        <div className="sky-element sky-element--cloud-far-left">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="42" rx="55" ry="18" fill="white" opacity="0.12" />
            <ellipse cx="40" cy="32" rx="30" ry="16" fill="white" opacity="0.16" />
            <ellipse cx="80" cy="35" rx="28" ry="14" fill="white" opacity="0.14" />
            <ellipse cx="60" cy="24" rx="38" ry="20" fill="white" opacity="0.22" />
          </svg>
        </div>

        <div className="sky-element sky-element--cloud-far-right">
          <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="70" cy="50" rx="65" ry="20" fill="white" opacity="0.10" />
            <ellipse cx="45" cy="38" rx="35" ry="18" fill="white" opacity="0.15" />
            <ellipse cx="95" cy="40" rx="32" ry="16" fill="white" opacity="0.14" />
            <ellipse cx="70" cy="28" rx="42" ry="22" fill="white" opacity="0.20" />
          </svg>
        </div>

        {/* ── 5. Floating 3D Sparkle Orbital Particles ── */}
        <div className="sky-element sky-element--orb-1" />
        <div className="sky-element sky-element--orb-2" />

      </div>

      {/* 2-Column Balanced Hero Grid Layout */}
      <div className="container-site hero-container">
        {/* ============================================================
            COLUMN 1: Left Headline Text & Call to Action
           ============================================================ */}
        <motion.div
          className="hero-col-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Role Badge */}
          <div className="badge-pill">
            <span className="badge-dot" />
            <span>Cloud Architect • Builder • Traveller • Creator</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Building in the <span className="title-grad-purple">Cloud.</span>
            <br />
            Exploring the <span className="title-grad-orange">World.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            I architect cloud solutions, share real-world lessons through blogs and videos, and collect stories from the places I explore.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <Link href="/blog" className="btn btn-primary hero-btn-lg" id="hero-read-blog">
              <BookOpen size={18} />
              Read Blog
            </Link>
            <Link href="/youtube" className="btn btn-glass hero-btn-lg" id="hero-watch-videos">
              <Play size={18} />
              Watch Videos
            </Link>
          </div>

          {/* Social Icons Row */}
          <div className="hero-social-row">
            {socialLinks.map(({ name, Icon, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-glass-btn"
                aria-label={`Visit ${name}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* ============================================================
            COLUMN 2: Center 3D Pixar Avatar Cloud Stage (Image 1 Style)
           ============================================================ */}
        <motion.div
          className="hero-col-right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ x: parallaxX, y: parallaxY }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="avatar-world-box">

            {/* Central Large 3D Pixar Character & Cloud Stage */}
            <ParallaxStage>
              <div
                className="center-avatar-stage character-stage"
                style={{
                  transform: `scale(${cloudSize})`,
                  opacity: 0.6 + cloudDensity * 0.4,
                }}
              >
                {/* All modes: clean transparent RGBA PNG via next/image */}
                <div className="avatar-3d-container">
                  <Image
                    key={avatarMode}
                    src={currentAvatar.src}
                    alt={currentAvatar.alt}
                    width={520}
                    height={520}
                    className="avatar-3d-clean-img avatar-mode-img"
                    style={{
                      filter: `drop-shadow(0 25px 50px ${currentAvatar.shadowColor}${0.25 + cloudDensity * 0.35})) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4))`,
                      transition: 'filter 0.4s ease',
                    }}
                    priority
                  />
                </div>

                {/* Speech Bubble — dynamic per mode */}
                <div className="laptop-speech-bubble">
                  {currentAvatar.bubble}
                </div>

                {/* Gear Icon Button (Click to Toggle Cloud Configurator) */}
                <div className="gear-interactive-hint">
                  <button
                    className="gear-circle-btn"
                    onClick={() => setShowConfig(!showConfig)}
                    aria-label="Open Cloud Settings"
                    title="Open Cloud Settings"
                  >
                    <Settings size={22} />
                  </button>
                  <div className="gear-hint-text">
                    Click gear<br />for settings!
                  </div>
                </div>

                {/* AI Robot Companion (Image 1 Style) */}
                {companions.aiCompanion && (
                  <div className="ai-companion-floating">
                    <div className="ai-robot-head">
                      🤖
                      <div className="ai-pulse-ring" />
                    </div>
                    <div className="ai-speech-bubble">
                      Need architecture<br />advice?
                    </div>
                  </div>
                )}
              </div>
            </ParallaxStage>
          </div>
        </motion.div>
      </div>

      {/* Floating Side Configurator Card Popover (Positioned strictly on the RIGHT SIDE matching Image 1) */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            className="config-popover-wrapper"
            style={{
              position: 'fixed',
              top: '110px',
              right: '36px',
              left: 'auto',
              zIndex: 999999,
            }}
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          >
            <MyLittleWorldConfig onClose={() => setShowConfig(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Rolling Cloud Wave SVG Boundary */}
      <div className="hero-bottom-cloud-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="cloud-wave-svg">
          <path
            d="M 0 50 Q 360 110, 720 40 T 1440 60 L 1440 120 L 0 120 Z"
            fill="var(--wave-fill)"
          />
        </svg>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 0 0px;
          overflow: hidden;
          background: var(--bg-hero);
          color: var(--text-primary);
          transition: background 0.4s ease, color 0.4s ease;
        }

        /* Ambient Glow Blobs */
        .hero-ambient-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.45;
        }

        .glow-blob--purple {
          top: 10%;
          left: 15%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(105, 88, 255, 0.3), transparent 70%);
        }

        .glow-blob--orange {
          bottom: 10%;
          right: 15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 138, 61, 0.2), transparent 70%);
        }

        /* Weather Rain & Storm Animation */
        .weather-rain-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          display: flex;
          justify-content: space-around;
        }

        .rain-drop {
          font-size: 1.5rem;
          animation: rainFall 2s linear infinite;
        }
        .drop-1 { animation-delay: 0s; }
        .drop-2 { animation-delay: 0.4s; }
        .drop-3 { animation-delay: 0.8s; }
        .drop-4 { animation-delay: 1.2s; }

        @keyframes rainFall {
          0% { transform: translateY(-50px); opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }

        .weather-storm-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          animation: flashStorm 3s infinite;
        }

        @keyframes flashStorm {
          0%, 90%, 100% { opacity: 0; }
          92%, 95% { opacity: 1; }
        }

        /* 2-Column Balanced Hero Container Grid */
        .hero-container {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr 1.15fr;
            gap: 40px;
          }
        }

        /* LEFT COLUMN STYLES */
        .hero-col-left {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 100px;
          background: rgba(105, 88, 255, 0.12);
          border: 1px solid rgba(105, 88, 255, 0.3);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          width: fit-content;
          box-shadow: 0 4px 16px rgba(105, 88, 255, 0.15);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6958FF;
          box-shadow: 0 0 10px #6958FF;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .title-grad-purple {
          background: linear-gradient(135deg, #6958FF, #9B8AFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .title-grad-orange {
          background: linear-gradient(135deg, #FF8A3D, #FFB366);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 480px;
        }

        .hero-cta-group {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hero-btn-lg {
          padding: 13px 26px;
          font-size: 0.92rem;
        }

        .hero-social-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .social-glass-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          transition: all 0.25s ease;
        }

        .social-glass-btn:hover {
          color: var(--text-primary);
          background: rgba(105, 88, 255, 0.25);
          border-color: #6958FF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(105, 88, 255, 0.3);
        }

        /* RIGHT COLUMN — CENTERED LARGE 3D AVATAR CLOUD STAGE (MATCHING IMAGE 1) */
        .hero-col-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-world-box {
          position: relative;
          width: 100%;
          max-width: 620px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        /* WIDE SKY CANVAS — SPANS FULL HERO BACKGROUND */
        .wide-sky-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .sky-element {
          position: absolute;
          pointer-events: none;
          user-select: none;
        }

        /* 1. Hot Air Balloon — Upper Left Sky (Wide & Uncluttered) */
        .sky-element--balloon {
          top: 35px;
          left: 4%;
          animation: floatBalloon 9s ease-in-out infinite;
          filter: drop-shadow(0 15px 25px rgba(124, 58, 237, 0.35));
        }

        @keyframes floatBalloon {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }

        .burner-pulse {
          animation: burnerGlow 2.5s ease-in-out infinite alternate;
        }

        @keyframes burnerGlow {
          0% { opacity: 0.6; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.15); }
        }

        /* 2. 3D Jet Airplane with Glowing Vapor Contrail — Upper Right Sky */
        .sky-element--airplane {
          top: 25px;
          right: 3%;
          width: 320px;
          height: 140px;
          animation: jetFlight 10s ease-in-out infinite;
        }

        .jet-contrail-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .jet-3d-model {
          position: absolute;
          top: 10px;
          right: 15px;
          filter: drop-shadow(0 10px 20px rgba(56, 189, 248, 0.4));
          animation: jetBank 5s ease-in-out infinite alternate;
        }

        @keyframes jetFlight {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(-10px); }
        }

        @keyframes jetBank {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(3deg); }
        }

        .nav-light-flash {
          animation: navFlash 1s ease-in-out infinite alternate;
        }

        @keyframes navFlash {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        /* 3. 3D Bird Flock V-Formation — Upper Mid Sky */
        .sky-element--birds {
          top: 55px;
          left: 40%;
          animation: flockGlide 12s ease-in-out infinite alternate;
        }

        .bird-flock-v {
          position: relative;
          width: 160px;
          height: 60px;
        }

        .svg-bird {
          position: absolute;
          animation: wingBeat 1.1s ease-in-out infinite alternate;
        }

        .bird-lead { top: 0px; left: 60px; animation-delay: 0s; }
        .bird-l1   { top: 18px; left: 25px; animation-delay: 0.15s; }
        .bird-r1   { top: 18px; left: 95px; animation-delay: 0.1s; }
        .bird-l2   { top: 36px; left: -5px; animation-delay: 0.25s; }
        .bird-r2   { top: 36px; left: 125px; animation-delay: 0.2s; }

        @keyframes wingBeat {
          0%   { transform: scaleY(1) translateY(0px); }
          50%  { transform: scaleY(0.4) translateY(-3px); }
          100% { transform: scaleY(1) translateY(0px); }
        }

        @keyframes flockGlide {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(30px, -15px); }
        }

        /* 4. Atmosphere Depth Cloud Clusters */
        .sky-element--cloud-far-left {
          top: -10px;
          left: -40px;
          opacity: 0.75;
          filter: blur(2px);
          animation: float 14s ease-in-out infinite;
        }

        .sky-element--cloud-far-right {
          top: 40px;
          right: -50px;
          opacity: 0.70;
          filter: blur(2.5px);
          animation: float 16s ease-in-out infinite reverse;
        }

        /* 5. Floating 3D Sparkle Orbital Particles */
        .sky-element--orb-1 {
          top: 18%;
          left: 28%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(167, 139, 250, 0.8);
          box-shadow: 0 0 16px rgba(167, 139, 250, 0.9);
          animation: orbPulse 4s ease-in-out infinite alternate;
        }

        .sky-element--orb-2 {
          top: 25%;
          right: 22%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.8);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.9);
          animation: orbPulse 5s ease-in-out infinite alternate-reverse;
        }

        @keyframes orbPulse {
          0% { transform: scale(0.8) translateY(0); opacity: 0.4; }
          100% { transform: scale(1.4) translateY(-10px); opacity: 1; }
        }

        @keyframes floatCharacter {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(1.5deg);
          }
        }

        /* Large 3D Avatar Stage */
        .center-avatar-stage {
          position: relative;
          width: 500px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .character-stage {
          animation: floatCharacter 6s ease-in-out infinite;
        }

        /* Mode-specific ambient radial glow behind the avatar */
        .avatar-ambient-bg--work {
          background: radial-gradient(ellipse 80% 70% at 50% 60%,
            rgba(105, 88, 255, 0.18) 0%,
            rgba(8, 18, 41, 0.6) 55%,
            transparent 80%);
        }

        .avatar-ambient-bg--travel {
          background: radial-gradient(ellipse 90% 80% at 50% 55%,
            rgba(255, 138, 61, 0.12) 0%,
            rgba(20, 10, 40, 0.5) 45%,
            rgba(8, 18, 41, 0.3) 70%,
            transparent 90%);
        }

        .avatar-ambient-bg--creator {
          background: radial-gradient(ellipse 85% 75% at 50% 58%,
            rgba(74, 222, 128, 0.10) 0%,
            rgba(10, 20, 50, 0.5) 55%,
            transparent 80%);
        }

        .avatar-3d-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          background: transparent;
        }


        .avatar-3d-clean-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* Avatar mode fade-in animation */
        @keyframes avatarFadeIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px); }
        }

        .avatar-mode-img {
          animation: avatarFadeIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        /* Speech Bubble — dynamic per mode */
        .laptop-speech-bubble {
          position: absolute;
          top: 30px;
          right: 30px;
          padding: 10px 14px;
          background: rgba(13, 27, 62, 0.85);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(105, 88, 255, 0.35);
          border-radius: 12px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-primary);
          line-height: 1.4;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 6;
          animation: avatarFadeIn 0.4s ease both;
        }

        .txt-purple { color: #6958FF; }
        .txt-orange { color: #FF8A3D; }
        .txt-green  { color: #4ADE80; }

        /* Gear Hint Button */
        .gear-interactive-hint {
          position: absolute;
          top: 170px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 6;
        }

        .gear-circle-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(13, 27, 62, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(105, 88, 255, 0.4);
          color: #6958FF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
          box-shadow: 0 6px 20px rgba(105, 88, 255, 0.3);
        }

        .gear-circle-btn:hover {
          transform: rotate(90deg) scale(1.08);
          background: rgba(105, 88, 255, 0.25);
        }

        .gear-hint-text {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-style: italic;
          line-height: 1.25;
        }

        /* AI Companion Floating Robot (Image 1 Style) */
        .ai-companion-floating {
          position: absolute;
          bottom: 40px;
          right: -10px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 6;
        }

        .ai-robot-head {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(105, 88, 255, 0.5), rgba(13, 27, 62, 0.95));
          border: 2px solid rgba(105, 88, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 0 20px rgba(105, 88, 255, 0.4);
        }

        .ai-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(105, 88, 255, 0.4);
          animation: pulse-glow 3s infinite;
        }

        .ai-speech-bubble {
          padding: 8px 12px;
          background: rgba(13, 27, 62, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(105, 88, 255, 0.3);
          border-radius: 10px;
          font-size: 0.68rem;
          color: var(--text-secondary);
          line-height: 1.35;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        /* Bottom Rolling Cloud Wave SVG */
        .hero-bottom-cloud-wave {
          position: relative;
          width: 100%;
          height: 80px;
          margin-top: 40px;
        }

        .cloud-wave-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </section>
  );
}
