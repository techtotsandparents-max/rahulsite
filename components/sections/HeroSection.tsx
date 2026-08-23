'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Play, Settings } from 'lucide-react';
import { GithubIcon, YoutubeIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/icons/SocialIcons';
import MyLittleWorldConfig from './MyLittleWorldConfig';

const socialLinks = [
  { name: 'GitHub', Icon: GithubIcon, url: 'https://github.com/rahultripathi' },
  { name: 'YouTube', Icon: YoutubeIcon, url: 'https://youtube.com/@rahultripathi' },
  { name: 'LinkedIn', Icon: LinkedinIcon, url: 'https://linkedin.com/in/rahultripathi' },
  { name: 'X / Twitter', Icon: TwitterIcon, url: 'https://x.com/rahultripathi' },
  { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com/rahultripathi' },
];

export default function HeroSection() {
  return (
    <section id="hero-section" aria-label="Hero — Building in the Cloud, Exploring the World" className="hero-section">
      {/* Glow Effects */}
      <div className="hero-ambient-bg" aria-hidden="true">
        <div className="glow-blob glow-blob--purple" />
        <div className="glow-blob glow-blob--orange" />
      </div>

      <div className="container-site hero-container">
        {/* ============================================================
            COLUMN 1: Left Text & Call to Action
           ============================================================ */}
        <motion.div
          className="hero-col-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
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

          {/* Social Icons — Clean Horizontal Row */}
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
            COLUMN 2: Center 3D Avatar World & Floating Sky Elements
           ============================================================ */}
        <motion.div
          className="hero-col-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="avatar-world-box">
            {/* Curved Flight Trail SVG */}
            <svg className="flight-trail-svg" viewBox="0 0 500 300" fill="none" aria-hidden="true">
              <path
                d="M 40 220 C 140 60, 360 80, 460 30"
                stroke="rgba(105, 88, 255, 0.35)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
              />
              {/* Flying Airplane icon on path */}
              <g transform="translate(430, 35) rotate(-25)">
                <text fontSize="22">✈️</text>
              </g>
            </svg>

            {/* Floating Sky Elements */}
            <div className="sky-float sky-float--balloon">🎈</div>
            <div className="sky-float sky-float--cloud-lg">☁️</div>
            <div className="sky-float sky-float--cloud-sm">☁️</div>
            <div className="sky-bird sky-bird--1">🐦</div>
            <div className="sky-bird sky-bird--2">🐦</div>

            {/* Central Vector 3D Avatar & Cloud */}
            <div className="center-avatar-stage">
              {/* SVG 3D Character Illustration */}
              <svg className="avatar-svg-graphic" viewBox="0 0 340 320" fill="none">
                <defs>
                  {/* Cloud Gradients */}
                  <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.85" />
                  </linearGradient>
                  <radialGradient id="cloudGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6958FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6958FF" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>

                {/* Cloud Glow Shadow */}
                <ellipse cx="170" cy="260" rx="140" ry="30" fill="url(#cloudGlow)" />

                {/* Main Fluffy Cloud Base */}
                <path
                  d="M 60 250 
                     C 30 250, 20 220, 45 200 
                     C 30 180, 55 150, 85 160 
                     C 105 130, 155 125, 185 145 
                     C 215 125, 265 135, 285 165 
                     C 315 165, 335 195, 315 220 
                     C 335 245, 305 260, 275 255 
                     Z"
                  fill="url(#cloudGrad)"
                  filter="drop-shadow(0px 10px 20px rgba(0,0,0,0.3))"
                />

                {/* Additional Cloud Puff Overlay */}
                <circle cx="110" cy="220" r="35" fill="#F1F5F9" opacity="0.6" />
                <circle cx="170" cy="210" r="45" fill="#FFFFFF" opacity="0.7" />
                <circle cx="230" cy="225" r="38" fill="#E2E8F0" opacity="0.6" />

                {/* Sitting Avatar Character */}
                {/* Legs cross-legged */}
                <ellipse cx="170" cy="195" rx="55" ry="18" fill="#0F172A" />

                {/* Torso / Black Hoodie */}
                <path d="M 135 135 Q 170 128 205 135 L 210 185 Q 170 192 130 185 Z" fill="url(#hoodieGrad)" />
                {/* Hoodie details */}
                <path d="M 160 135 L 170 155 L 180 135" stroke="#475569" strokeWidth="2" fill="none" />

                {/* Hands on Laptop */}
                <ellipse cx="148" cy="168" rx="8" ry="6" fill="url(#skinGrad)" />
                <ellipse cx="192" cy="168" rx="8" ry="6" fill="url(#skinGrad)" />

                {/* Head / Hair / Glasses */}
                {/* Neck */}
                <rect x="163" y="125" width="14" height="12" rx="4" fill="url(#skinGrad)" />
                {/* Head */}
                <ellipse cx="170" cy="105" rx="22" ry="24" fill="url(#skinGrad)" />
                {/* Hair */}
                <path d="M 146 100 C 146 75, 194 75, 194 100 C 185 85, 155 85, 146 100 Z" fill="#090D16" />
                {/* Glasses */}
                <rect x="153" y="98" width="14" height="10" rx="3" fill="none" stroke="#0F172A" strokeWidth="2.5" />
                <rect x="173" y="98" width="14" height="10" rx="3" fill="none" stroke="#0F172A" strokeWidth="2.5" />
                <line x1="167" y1="103" x2="173" y2="103" stroke="#0F172A" strokeWidth="2" />
                {/* Smile */}
                <path d="M 164 118 Q 170 124 176 118" stroke="#7C2D12" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Open Laptop */}
                <rect x="135" y="152" width="70" height="42" rx="4" fill="#1E293B" stroke="#6958FF" strokeWidth="2" />
                <rect x="139" y="156" width="62" height="34" rx="2" fill="#090D16" />
                {/* Code text lines on screen */}
                <rect x="143" y="160" width="30" height="3" fill="#4ADE80" rx="1.5" />
                <rect x="143" y="166" width="45" height="3" fill="#60A5FA" rx="1.5" />
                <rect x="143" y="172" width="38" height="3" fill="#F472B6" rx="1.5" />
                <rect x="143" y="178" width="22" height="3" fill="#FBBF24" rx="1.5" />

                {/* Laptop Keyboard Base */}
                <polygon points="125,194 215,194 225,200 115,200" fill="#334155" />
              </svg>

              {/* Laptop Screen Sticker Speech Bubble */}
              <div className="laptop-speech-bubble">
                Let&apos;s <strong className="txt-purple">BUILD</strong><br />
                <strong>SOMETHING</strong><br />
                <strong className="txt-orange">GREAT</strong>
              </div>

              {/* Gear Icon Hint */}
              <div className="gear-interactive-hint">
                <button className="gear-circle-btn" aria-label="Play with Cloud Configurator">
                  <Settings size={18} />
                </button>
                <div className="gear-hint-text">
                  Click the gear<br />to play!
                </div>
              </div>

              {/* AI Robot Companion */}
              <div className="ai-companion-floating">
                <div className="ai-robot-head">
                  🤖
                  <div className="ai-pulse-ring" />
                </div>
                <div className="ai-speech-bubble">
                  Need architecture<br />advice?
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            COLUMN 3: Right Cloud Configurator Panel
           ============================================================ */}
        <motion.div
          className="hero-col-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MyLittleWorldConfig inlineMode />
        </motion.div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 100px 0 40px;
          overflow: hidden;
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
          opacity: 0.5;
        }

        .glow-blob--purple {
          top: 15%;
          left: 20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(105, 88, 255, 0.25), transparent 70%);
        }

        .glow-blob--orange {
          bottom: 10%;
          right: 15%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(255, 138, 61, 0.15), transparent 70%);
        }

        /* Hero Grid Layout */
        .hero-container {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr 1.1fr 320px;
            gap: 24px;
          }
        }

        @media (min-width: 1280px) {
          .hero-container {
            grid-template-columns: 400px 1fr 340px;
            gap: 32px;
          }
        }

        /* LEFT COLUMN STYLES */
        .hero-col-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 100px;
          background: rgba(105, 88, 255, 0.12);
          border: 1px solid rgba(105, 88, 255, 0.25);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
          width: fit-content;
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
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
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
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 440px;
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

        /* Clean Horizontal Social Row */
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
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(13, 27, 62, 0.6);
          border: 1px solid rgba(105, 88, 255, 0.2);
          color: var(--text-secondary);
          transition: all 0.25s ease;
        }

        .social-glass-btn:hover {
          color: white;
          background: rgba(105, 88, 255, 0.2);
          border-color: #6958FF;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(105, 88, 255, 0.25);
        }

        /* CENTER COLUMN STYLES */
        .hero-col-center {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-world-box {
          position: relative;
          width: 100%;
          max-width: 460px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flight-trail-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Sky Floats */
        .sky-float {
          position: absolute;
          pointer-events: none;
          user-select: none;
        }

        .sky-float--balloon {
          top: 10%;
          left: 4%;
          font-size: 2.2rem;
          animation: float 6s ease-in-out infinite;
        }

        .sky-float--cloud-lg {
          top: 4%;
          right: 12%;
          font-size: 2.5rem;
          opacity: 0.6;
          animation: float 8s ease-in-out infinite;
        }

        .sky-float--cloud-sm {
          top: 25%;
          right: 2%;
          font-size: 1.8rem;
          opacity: 0.4;
          animation: float 7s ease-in-out infinite reverse;
        }

        .sky-bird {
          position: absolute;
          font-size: 1.2rem;
          pointer-events: none;
        }

        .sky-bird--1 {
          top: 18%;
          left: 28%;
          animation: float 4s ease-in-out infinite;
        }

        .sky-bird--2 {
          top: 24%;
          left: 36%;
          font-size: 0.9rem;
          opacity: 0.6;
          animation: float 4.5s ease-in-out infinite 0.5s;
        }

        /* Stage */
        .center-avatar-stage {
          position: relative;
          width: 320px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-svg-graphic {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.4));
        }

        /* Speech Bubble on Laptop Screen */
        .laptop-speech-bubble {
          position: absolute;
          top: 35px;
          right: -15px;
          padding: 8px 12px;
          background: rgba(13, 27, 62, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(105, 88, 255, 0.35);
          border-radius: 10px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-primary);
          line-height: 1.35;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: float 5s ease-in-out infinite;
          z-index: 5;
        }

        .txt-purple { color: #6958FF; }
        .txt-orange { color: #FF8A3D; }

        /* Gear Hint */
        .gear-interactive-hint {
          position: absolute;
          bottom: 45px;
          left: -20px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 5;
        }

        .gear-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(13, 27, 62, 0.8);
          border: 1px solid rgba(105, 88, 255, 0.3);
          color: #6958FF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .gear-circle-btn:hover {
          transform: rotate(90deg);
        }

        .gear-hint-text {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-style: italic;
          line-height: 1.2;
        }

        /* AI Companion Floating Robot */
        .ai-companion-floating {
          position: absolute;
          top: 60px;
          right: -35px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 5;
          animation: float 5s ease-in-out infinite 1s;
        }

        .ai-robot-head {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(105, 88, 255, 0.4), rgba(13, 27, 62, 0.9));
          border: 2px solid rgba(105, 88, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .ai-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(105, 88, 255, 0.3);
          animation: pulse-glow 3s infinite;
        }

        .ai-speech-bubble {
          padding: 6px 10px;
          background: rgba(13, 27, 62, 0.9);
          border: 1px solid rgba(105, 88, 255, 0.3);
          border-radius: 8px;
          font-size: 0.65rem;
          color: var(--text-secondary);
          line-height: 1.3;
          white-space: nowrap;
        }

        /* RIGHT COLUMN STYLES */
        .hero-col-right {
          display: none;
        }

        @media (min-width: 1024px) {
          .hero-col-right {
            display: block;
          }
        }

        /* MOBILE RESPONSIVE BREAKPOINTS */
        @max-width: 1023px {
          .hero-section {
            padding: 90px 0 20px;
            min-height: auto;
          }

          .hero-col-left {
            align-items: center;
            text-align: center;
          }

          .hero-subtitle {
            text-align: center;
          }

          .hero-cta-group {
            justify-content: center;
          }

          .hero-social-row {
            justify-content: center;
          }

          .avatar-world-box {
            height: 320px;
          }
        }
      `}</style>
    </section>
  );
}
