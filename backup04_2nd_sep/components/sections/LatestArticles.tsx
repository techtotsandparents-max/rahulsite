'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { blogFixtures } from '@/lib/fixtures';

const categoryColors: Record<string, string> = {
  CLOUD_ARCHITECTURE: '#6958FF',
  AI_LESSONS: '#00C9A7',
  TRAVEL_JOURNAL: '#FF8A3D',
  CAREER: '#FFD93D',
};

const categoryLabels: Record<string, string> = {
  CLOUD_ARCHITECTURE: 'Cloud Architecture',
  AI_LESSONS: 'AI Lessons',
  TRAVEL_JOURNAL: 'Travel Journal',
  CAREER: 'Career',
};

export default function LatestArticles() {
  return (
    <section id="latest-articles" className="articles" aria-label="Latest Articles">
      <div className="articles__container container-site">
        <motion.div
          className="articles__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="articles__title">Latest Articles</h2>
          <Link href="/blog" className="articles__view-all">
            View all <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="articles__grid">
          {blogFixtures.slice(0, 3).map((post, i) => (
            <motion.article
              key={post.slug}
              className="article-card glass-card glass-card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="article-card__link" id={`article-${post.slug}`}>
                <div className="article-card__cover">
                  <div
                    className="article-card__cover-gradient"
                    style={{
                      background: `linear-gradient(135deg, ${categoryColors[post.category]}22, ${categoryColors[post.category]}08)`,
                    }}
                  />
                  <div className="article-card__cover-pattern" />
                </div>
                <div className="article-card__body">
                  <div className="article-card__meta">
                    <span
                      className="article-card__category"
                      style={{ color: categoryColors[post.category], borderColor: `${categoryColors[post.category]}40` }}
                    >
                      <Tag size={11} />
                      {categoryLabels[post.category]}
                    </span>
                    <span className="article-card__read-time">
                      <Clock size={11} />
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="article-card__title">{post.title}</h3>
                  <p className="article-card__excerpt">{post.excerpt}</p>
                  <div className="article-card__footer">
                    <time className="article-card__date">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="article-card__read-more">
                      Read more <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .articles {
          position: relative;
          padding: 80px 0;
          z-index: 2;
        }

        .articles__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }

        .articles__title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
        }

        .articles__view-all {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent-tech);
          transition: gap var(--duration-normal);
        }

        .articles__view-all:hover {
          gap: 10px;
        }

        .articles__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .articles__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .articles__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .article-card {
          overflow: hidden;
        }

        .article-card__link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .article-card__cover {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .article-card__cover-gradient {
          position: absolute;
          inset: 0;
        }

        .article-card__cover-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(105, 88, 255, 0.4) 1px, transparent 1px),
            radial-gradient(circle at 60% 30%, rgba(105, 88, 255, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(105, 88, 255, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .article-card__body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .article-card__meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .article-card__category {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .article-card__read-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .article-card__title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text-primary);
        }

        .article-card__excerpt {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.6;
          flex: 1;
        }

        .article-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .article-card__date {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .article-card__read-more {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--accent-tech);
          transition: gap var(--duration-normal);
        }

        .article-card:hover .article-card__read-more {
          gap: 8px;
        }
      `}</style>
    </section>
  );
}
