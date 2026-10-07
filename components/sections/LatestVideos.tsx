'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, ExternalLink, Clock } from 'lucide-react';
import { videoFixtures } from '@/lib/fixtures';
import { useContent } from '@/components/admin/useContent';

const topicColors: Record<string, string> = {
  'LLMs': '#00C9A7',
  'System Design': '#6958FF',
  'Cloud Architecture': '#FF8A3D',
  'Deep Learning': '#FF4488',
};

export default function LatestVideos() {
  const content = useContent('videos', videoFixtures);
  return (
    <section id="latest-videos" className="videos" aria-label="Latest Video Lectures">
      <div className="videos__container container-site">
        <motion.div
          className="videos__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="videos__title">AI Teaching Hub</h2>
            <p className="videos__subtitle">Karpathy-style lectures on AI, cloud, and system design</p>
          </div>
          <Link href="/youtube" className="videos__view-all">
            View all <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="videos__grid">
          {content.items.filter((video) => video.isPublished !== false).slice(0, 4).map((video, i) => (
            <motion.div
              key={video.youtubeId}
              className="video-card glass-card glass-card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Thumbnail placeholder */}
              <div className="video-card__thumb">
                <div
                  className="video-card__thumb-bg"
                  style={{
                    background: `linear-gradient(135deg, ${topicColors[video.topic] || '#6958FF'}20, ${topicColors[video.topic] || '#6958FF'}08)`,
                  }}
                />
                <div className="video-card__play-btn" aria-hidden="true">
                  <Play size={24} fill="white" />
                </div>
                <span className="video-card__duration">
                  <Clock size={10} />
                  {video.duration}
                </span>
              </div>

              <div className="video-card__body">
                <span
                  className="video-card__topic"
                  style={{ color: topicColors[video.topic] || '#6958FF' }}
                >
                  {video.topic}
                </span>
                <h3 className="video-card__title">{video.title}</h3>
                <div className="video-card__actions">
                  <Link href="/youtube" className="video-card__action" id={`video-watch-${video.youtubeId}`}>
                    <Play size={13} />
                    Watch
                  </Link>
                  <a
                    href={`https://youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-card__action video-card__action--external"
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    <ExternalLink size={13} />
                    YouTube
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .videos {
          position: relative;
          padding: 40px 0 80px;
          z-index: 2;
        }

        .videos__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 40px;
          gap: 16px;
        }

        .videos__title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
        }

        .videos__subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .videos__view-all {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent-tech);
          transition: gap var(--duration-normal);
          white-space: nowrap;
          margin-top: 4px;
        }

        .videos__view-all:hover {
          gap: 10px;
        }

        .videos__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 640px) {
          .videos__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .videos__grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .video-card {
          overflow: hidden;
        }

        .video-card__thumb {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          cursor: pointer;
        }

        .video-card__thumb-bg {
          position: absolute;
          inset: 0;
        }

        .video-card__play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(105, 88, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 3px;
          transition: all var(--duration-normal) var(--ease-smooth);
          box-shadow: 0 4px 20px rgba(105, 88, 255, 0.4);
        }

        .video-card:hover .video-card__play-btn {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 6px 30px rgba(105, 88, 255, 0.5);
        }

        .video-card__duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.7);
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--text-primary);
        }

        .video-card__body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .video-card__topic {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .video-card__title {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text-primary);
        }

        .video-card__actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .video-card__action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 500;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all var(--duration-fast);
          background: var(--accent-tech-dim);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          text-decoration: none;
        }

        .video-card__action:hover {
          border-color: var(--accent-tech);
          color: var(--text-primary);
        }

        .video-card__action--external {
          background: transparent;
        }
      `}</style>
    </section>
  );
}
