'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Globe, Play, Rocket, User } from 'lucide-react';
import { quickCards } from '@/lib/fixtures';

const iconMap: Record<string, React.ReactNode> = {
  Blog: <BookOpen size={20} />,
  Travel: <Globe size={20} />,
  YouTube: <Play size={20} />,
  Projects: <Rocket size={20} />,
  About: <User size={20} />,
};

const colorMap: Record<string, string> = {
  Blog: '#6958FF',
  Travel: '#FF8A3D',
  YouTube: '#FF4444',
  Projects: '#00C9A7',
  About: '#FFD93D',
};

export default function QuickCards() {
  return (
    <section id="quick-cards" className="quick-cards" aria-label="Quick Navigation">
      <div className="quick-cards__container container-site">
        <div className="quick-cards__grid">
          {quickCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={card.href} className="quick-card glass-card glass-card-hover" id={`quick-card-${card.title.toLowerCase()}`}>
                <div className="quick-card__icon" style={{ color: colorMap[card.title] }}>
                  {iconMap[card.title]}
                </div>
                <div className="quick-card__content">
                  <h3 className="quick-card__title">{card.title}</h3>
                  <p className="quick-card__desc">{card.description}</p>
                </div>
                <ArrowRight size={16} className="quick-card__arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .quick-cards {
          position: relative;
          padding: 40px 0 80px;
          z-index: 2;
        }

        .quick-cards__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        @media (min-width: 1024px) {
          .quick-cards__grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .quick-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .quick-card__icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quick-card__content {
          flex: 1;
          min-width: 0;
        }

        .quick-card__title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .quick-card__desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .quick-card__arrow {
          flex-shrink: 0;
          color: var(--text-muted);
          transition: all var(--duration-normal) var(--ease-smooth);
          margin-top: 2px;
        }

        .quick-card:hover .quick-card__arrow {
          color: var(--accent-tech);
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
