'use client';

import { motion } from 'framer-motion';
import { Brain, Shield, Compass, Heart } from 'lucide-react';

const pillars = [
  { icon: Brain, label: 'Think', highlight: 'Scalable' },
  { icon: Shield, label: 'Build', highlight: 'Reliable' },
  { icon: Compass, label: 'Explore', highlight: 'Fearlessly' },
  { icon: Heart, label: 'Share', highlight: 'Openly' },
];

export default function SunsetFooter() {
  return (
    <footer id="site-footer" className="sunset-footer" role="contentinfo">
      {/* Sunset gradient overlay */}
      <div className="sunset-footer__gradient" aria-hidden="true" />

      {/* Tagline */}
      <div className="sunset-footer__content container-site">
        <motion.div
          className="sunset-footer__tagline"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="sunset-footer__heading">
            Architecting in the <span className="gradient-text-purple">cloud.</span>
            <br />
            Exploring the <span className="gradient-text-orange">world.</span>
            <br />
            Sharing what I <span className="gradient-text-orange">learn.</span>
          </h2>
        </motion.div>

        {/* Pillars */}
        <motion.div
          className="sunset-footer__pillars"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              className="sunset-footer__pillar"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="sunset-footer__pillar-icon">
                <pillar.icon size={22} />
              </div>
              <span className="sunset-footer__pillar-label">{pillar.label}</span>
              <span className="sunset-footer__pillar-highlight">{pillar.highlight}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Silhouette Scene */}
        <div className="sunset-footer__scene" aria-hidden="true">
          <div className="sunset-footer__mountains" />
          <div className="sunset-footer__character">
            <div className="sunset-footer__person" />
            <div className="sunset-footer__backpack" />
            <div className="sunset-footer__mug" />
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          className="sunset-footer__copyright"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p>© {new Date().getFullYear()} Rahul Tripathi. All rights reserved.</p>
        </motion.div>
      </div>

      <style jsx>{`
        .sunset-footer {
          position: relative;
          padding: 80px 0 40px;
          overflow: hidden;
          margin-top: 60px;
        }

        .sunset-footer__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 138, 61, 0.03) 20%,
            rgba(255, 138, 61, 0.08) 40%,
            rgba(255, 100, 20, 0.12) 60%,
            rgba(180, 60, 0, 0.15) 80%,
            rgba(100, 30, 0, 0.2) 100%
          );
          pointer-events: none;
        }

        .sunset-footer__content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
          text-align: center;
        }

        .sunset-footer__heading {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700;
          line-height: 1.3;
        }

        .sunset-footer__pillars {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .sunset-footer__pillars {
            gap: 56px;
          }
        }

        .sunset-footer__pillar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .sunset-footer__pillar-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-tech);
          transition: all var(--duration-normal) var(--ease-smooth);
        }

        .sunset-footer__pillar:hover .sunset-footer__pillar-icon {
          background: var(--accent-tech-dim);
          border-color: var(--accent-tech);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(105, 88, 255, 0.2);
        }

        .sunset-footer__pillar-label {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sunset-footer__pillar-highlight {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* Silhouette Scene */
        .sunset-footer__scene {
          position: relative;
          width: 100%;
          max-width: 1000px;
          height: 120px;
          margin-top: 20px;
        }

        .sunset-footer__mountains {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(135deg, rgba(30, 15, 5, 0.4), rgba(50, 25, 10, 0.3));
          clip-path: polygon(
            0% 100%,
            0% 70%,
            10% 40%,
            20% 55%,
            30% 25%,
            40% 50%,
            50% 20%,
            60% 45%,
            70% 15%,
            80% 40%,
            90% 30%,
            100% 60%,
            100% 100%
          );
        }

        .sunset-footer__character {
          position: absolute;
          bottom: 15px;
          right: 20%;
          width: 50px;
          height: 50px;
        }

        .sunset-footer__person {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 40px;
          background: rgba(30, 15, 5, 0.6);
          border-radius: 10px 10px 4px 4px;
        }

        .sunset-footer__person::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(30, 15, 5, 0.6);
        }

        .sunset-footer__backpack {
          position: absolute;
          bottom: 2px;
          right: -8px;
          width: 12px;
          height: 18px;
          background: rgba(30, 15, 5, 0.4);
          border-radius: 3px;
        }

        .sunset-footer__mug {
          position: absolute;
          bottom: 2px;
          left: -6px;
          width: 8px;
          height: 10px;
          background: rgba(30, 15, 5, 0.4);
          border-radius: 2px;
        }

        .sunset-footer__copyright {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </footer>
  );
}
