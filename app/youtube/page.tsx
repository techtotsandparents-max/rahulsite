'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, ExternalLink, Clock, Filter } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';
import { videoFixtures } from '@/lib/fixtures';
import { useContent } from '@/components/admin/useContent';
import ContentTools from '@/components/admin/ContentTools';
import YouTubeChannel from '@/components/sections/YouTubeChannel';

const topicColors: Record<string, string> = {
  'Cloud By Design': '#00C9A7',
  'The Committee Files': '#6958FF',
  'Money By Design': '#FF8A3D',
  'Life By Design': '#FF4488',
};

const topics = ['All', 'Cloud By Design', 'The Committee Files', 'Money By Design', 'Life By Design'];

export default function YouTubePage() {
  const content = useContent('videos', videoFixtures);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [playing, setPlaying] = useState<string | null>(null);
  const availableTopics = [...new Set([...topics, ...content.items.map((item) => item.topic)])];
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-tech)', marginBottom: '24px' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '8px' }}>
              Balance By Design
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px' }}>
              I'm a cloud architect who also runs an apartment society, raises kids, travels and plays cricket — and I show you exactly how I get all of it done..
            </p>
            <YouTubeChannel />
            <ContentTools type="videos" source={content.source} onChanged={content.reload} importItems={content.items.length === 0 ? videoFixtures : undefined} />
            {content.error && <p role="alert">{content.error}</p>}

            {/* Topic Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {availableTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  aria-pressed={selectedTopic === topic}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    background: topic === selectedTopic ? 'var(--accent-tech-dim)' : 'rgba(13, 27, 62, 0.5)',
                    color: topic === selectedTopic ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  {topic === 'All' && <Filter size={13} />}
                  {topic}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', paddingBottom: '80px' }}>
              {content.items.filter((video) => selectedTopic === 'All' || video.topic === selectedTopic).map((video, i) => (
                <motion.div
                  key={video.youtubeId}
                  className="glass-card glass-card-hover"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ overflow: 'hidden' }}
                >
                  {playing === video.youtubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ width: '100%', aspectRatio: '16/9', border: 0 }} /> : <div style={{
                    aspectRatio: '16/9',
                    backgroundImage: `url(https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <button type="button" aria-label={`Play ${video.title}`} onClick={() => setPlaying(video.youtubeId)} style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'rgba(105, 88, 255, 0.8)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', paddingLeft: '3px',
                      boxShadow: '0 4px 20px rgba(105, 88, 255, 0.4)',
                    }}>
                      <Play size={24} fill="white" color="white" />
                    </button>
                    <span style={{
                      position: 'absolute', bottom: '8px', right: '8px',
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '4px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.7)',
                      fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)',
                    }}>
                      <Clock size={10} /> {video.duration}
                    </span>
                  </div>}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: topicColors[video.topic] || '#6958FF' }}>
                      {video.topic}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.35 }}>
                      {video.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button onClick={() => setPlaying(video.youtubeId)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '8px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500,
                        cursor: 'pointer', background: 'var(--accent-tech-dim)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                      }}>
                        <Play size={13} /> Watch Embedded
                      </button>
                      <a
                        href={`https://youtube.com/watch?v=${video.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '8px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500,
                          cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-body)',
                        }}
                      >
                        <ExternalLink size={13} /> Watch on YouTube
                      </a>
                    </div>
                    <ContentTools type="videos" item={video} source={content.source} onChanged={content.reload} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <SunsetFooter />
    </>
  );
}
