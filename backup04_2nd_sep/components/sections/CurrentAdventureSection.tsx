'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, MapPin, Globe,
  BookOpen, Play, Users, Code, Plane, ArrowRight, ExternalLink
} from 'lucide-react';
import { GithubIcon, YoutubeIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/icons/SocialIcons';
import { adventureFixtures } from '@/lib/fixtures';

const SOCIAL_LINKS = [
  { name: 'GitHub', Icon: GithubIcon, url: 'https://github.com/rahultripathi' },
  { name: 'YouTube', Icon: YoutubeIcon, url: 'https://youtube.com/@rahultripathi' },
  { name: 'LinkedIn', Icon: LinkedinIcon, url: 'https://linkedin.com/in/rahultripathi' },
  { name: 'X / Twitter', Icon: TwitterIcon, url: 'https://x.com/rahultripathi' },
  { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com/rahultripathi' },
];

const STATS = [
  { icon: BookOpen, val: '150+', label: 'Blog Posts', color: '#6958FF', href: '/blog' },
  { icon: Play, val: '25K+', label: 'YouTube Views', color: '#EF4444', href: '/youtube' },
  { icon: Users, val: '10K+', label: 'Community', color: '#F59E0B', href: '/blog' },
  { icon: Globe, val: '15+', label: 'Countries Explored', color: '#10B981', href: '/travel' },
  { icon: Code, val: '6+', label: 'Years in Tech', color: '#3B82F6', href: '/about' },
];

export default function CurrentAdventureSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const adventures = adventureFixtures;
  const currentTrip = adventures[activeIdx] || adventures[0];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : adventures.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < adventures.length - 1 ? prev + 1 : 0));
  };

  const handleCardClick = (idx: number, slug: string) => {
    if (idx === activeIdx) {
      router.push(`/travel/${slug}`);
    } else {
      setActiveIdx(idx);
    }
  };

  return (
    <section className="cas-section" aria-label="Stats & Current Adventure">
      <div className="container-site">

        {/* ── 1. Top Header Row: Stats Capsule Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cas-top-row"
        >
          {/* Stats Capsule Bar */}
          <div className="cas-stats-capsule">
            {STATS.map((s, i) => (
              <div key={i} className="cas-stat-wrapper">
                <Link href={s.href} className="cas-stat-item" title={`View ${s.label}`}>
                  <div className="cas-stat-icon" style={{ color: s.color, background: s.color + '18' }}>
                    <s.icon size={16} />
                  </div>
                  <div className="cas-stat-text">
                    <span className="cas-stat-val">{s.val}</span>
                    <span className="cas-stat-label">{s.label}</span>
                  </div>
                </Link>
                {i < STATS.length - 1 && <div className="cas-stat-divider" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 2. Current Adventure Card (Matching Reference Image 2) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="cas-adventure-card"
        >
          {/* Card Header Title */}
          <div className="cas-header">
            <div className="cas-header-title">
              <span className="cas-plane-icon">✈️</span>
              <h2>Current Adventure</h2>
            </div>
          </div>

          {/* Body Content Row */}
          <div className="cas-body">

            {/* Left Nav Arrow & Location Info */}
            <div className="cas-left-col">
              <button
                onClick={handlePrev}
                className="cas-arrow-btn"
                aria-label="Previous destination"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="cas-loc-info">
                <Link href={`/travel/${currentTrip.slug}`} className="cas-loc-name" title={`View ${currentTrip.country} travel story`}>
                  <MapPin size={18} className="cas-pin-icon" />
                  <span>{currentTrip.country}</span>
                </Link>
                <p className="cas-loc-cities">{currentTrip.cities.join(' • ')}</p>
                <p className="cas-loc-date">{currentTrip.visitedAt ? 'May 2026' : 'Active'}</p>

                {/* Read Story CTA Link Button */}
                <Link
                  href={`/travel/${currentTrip.slug}`}
                  className="cas-read-story-btn"
                  id={`read-story-${currentTrip.slug}`}
                >
                  Read Story <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Middle Cards Slider Gallery (4 Featured Destinations + 5th Where Next Card matching Image 2) */}
            <div className="cas-cards-slider">
              {adventures.slice(0, 4).map((trip, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={trip.slug}
                    onClick={() => handleCardClick(idx, trip.slug)}
                    className={`cas-item-card ${isActive ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    title={isActive ? `Click to read ${trip.destination} story` : `Select ${trip.destination}`}
                  >
                    <img
                      src={trip.coverImage}
                      alt={trip.destination}
                      className="cas-item-img"
                    />
                    <div className="cas-item-overlay" />

                    {/* Active Card Top-Right Badge Indicator */}
                    {isActive && (
                      <div className="cas-active-badge-dot" title="Active selection — click to open blog">
                        <ExternalLink size={10} className="cas-badge-link-icon" />
                      </div>
                    )}

                    {/* Active Card Bottom Indicators */}
                    {isActive && (
                      <div className="cas-item-dots">
                        <span className="dot active" />
                        <span className="dot" />
                        <span className="dot" />
                      </div>
                    )}

                    {/* Destination Label Overlay */}
                    {!isActive && (
                      <div className="cas-item-label">{trip.destination}</div>
                    )}
                  </div>
                );
              })}

              {/* "Where next?" Dashed Trajectory Card (5th Card matching Image 2) */}
              <Link href="/travel" className="cas-item-card cas-where-next-card" title="Explore all adventures">
                <div className="cas-wn-trajectory">
                  <svg viewBox="0 0 100 50" className="cas-wn-svg">
                    <path
                      d="M 15 42 Q 50 8, 85 18"
                      stroke="#FF8A3D"
                      strokeWidth="1.8"
                      strokeDasharray="4 4"
                      fill="none"
                      opacity="0.85"
                    />
                  </svg>
                  <Plane className="cas-wn-plane-icon" size={18} />
                </div>
                <p className="cas-wn-text">Where next?</p>
              </Link>
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="cas-arrow-btn cas-arrow-btn--next"
              aria-label="Next destination"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        </motion.div>

      </div>

      <style jsx>{`
        .cas-section {
          padding: 24px 0 60px;
          position: relative;
          z-index: 2;
        }

        /* ── Top Header Row (Stats Capsule) ── */
        .cas-top-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        /* Left Social Buttons */
        .cas-social-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cas-social-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .cas-social-btn:hover {
          background: rgba(105, 88, 255, 0.22);
          border-color: #6958FF;
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(105, 88, 255, 0.3);
        }

        /* Right Stats Capsule Bar */
        .cas-stats-capsule {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 10px 24px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .cas-stat-wrapper {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        :global(.cas-stat-item) {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        :global(.cas-stat-item:hover) {
          transform: translateY(-1px);
        }

        .cas-stat-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cas-stat-text {
          display: flex;
          flex-direction: column;
        }

        .cas-stat-val {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .cas-stat-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .cas-stat-divider {
          width: 1px;
          height: 24px;
          background: var(--border-subtle);
        }

        /* ── Current Adventure Main Card ── */
        .cas-adventure-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 22px 26px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .cas-header {
          margin-bottom: 16px;
        }

        .cas-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cas-plane-icon {
          font-size: 1.2rem;
        }

        .cas-header-title h2 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Body Row */
        .cas-body {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Left Location Column */
        .cas-left-col {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 190px;
          flex-shrink: 0;
        }

        .cas-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cas-arrow-btn:hover {
          background: rgba(105, 88, 255, 0.25);
          border-color: #6958FF;
          color: var(--text-primary);
        }

        .cas-arrow-btn--next {
          margin-left: 4px;
        }

        .cas-loc-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        :global(.cas-loc-name) {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        :global(.cas-loc-name:hover) {
          color: #FF8A3D;
        }

        :global(.cas-pin-icon) {
          color: #FF8A3D;
          flex-shrink: 0;
        }

        .cas-loc-cities {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .cas-loc-date {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* Read Story Button */
        :global(.cas-read-story-btn) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 6px 14px;
          border-radius: 8px;
          background: linear-gradient(135deg, #FF8A3D, #FF9F5A);
          color: white;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 3px 10px rgba(255, 138, 61, 0.25);
          width: fit-content;
        }

        :global(.cas-read-story-btn:hover) {
          transform: translateX(2px);
          box-shadow: 0 4px 16px rgba(255, 138, 61, 0.4);
        }

        /* Middle Cards Slider Gallery */
        .cas-cards-slider {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 6px 2px;
        }

        .cas-cards-slider::-webkit-scrollbar {
          display: none;
        }

        .cas-item-card {
          position: relative;
          flex: 1;
          min-width: 135px;
          height: 135px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          border: 1px solid var(--glass-border);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cas-item-card:hover {
          transform: translateY(-4px);
          border-color: rgba(105, 88, 255, 0.50);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
        }

        .cas-item-card.is-active {
          border: 2.5px solid #FF8A3D;
          box-shadow: 0 0 18px rgba(255, 138, 61, 0.40), 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .cas-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .cas-item-card:hover .cas-item-img {
          transform: scale(1.08);
        }

        .cas-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%);
        }

        /* Active Badge Top Right Dot */
        .cas-active-badge-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 3;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(13, 27, 62, 0.85);
          border: 1.5px solid #FF8A3D;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF8A3D;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        :global(.cas-badge-link-icon) {
          color: #FF8A3D;
        }

        /* Active Slide Dots */
        .cas-item-dots {
          position: absolute;
          bottom: 12px;
          left: 14px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cas-item-dots .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
        }

        .cas-item-dots .dot.active {
          background: #FF8A3D;
          width: 12px;
          border-radius: 999px;
        }

        .cas-item-label {
          position: absolute;
          bottom: 12px;
          left: 14px;
          z-index: 3;
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
        }

        /* "Where next?" Card */
        :global(.cas-where-next-card) {
          background: var(--glass-bg);
          border: 1px dashed var(--glass-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
        }

        .cas-wn-trajectory {
          position: relative;
          width: 60px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cas-wn-svg {
          width: 100%;
          height: 100%;
        }

        :global(.cas-wn-plane-icon) {
          position: absolute;
          top: 0;
          right: 2px;
          color: #FF8A3D;
          transform: rotate(15deg);
        }

        .cas-wn-text {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 600;
          color: #FF8A3D;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .cas-top-row {
            flex-direction: column;
            align-items: stretch;
          }
          .cas-stats-capsule {
            overflow-x: auto;
          }
        }

        @media (max-width: 640px) {
          .cas-body {
            flex-direction: column;
            align-items: stretch;
          }
          .cas-left-col {
            justify-content: space-between;
          }
          .cas-arrow-btn--next {
            align-self: flex-end;
          }
        }
      `}</style>
    </section>
  );
}


