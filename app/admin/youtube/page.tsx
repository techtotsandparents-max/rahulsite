'use client';
import Link from 'next/link';
import { ArrowLeft, Video, Plus, ExternalLink } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import { videoFixtures } from '@/lib/fixtures';

function YouTubeContent() {
  return (
    <div className="ay-page">
      <header className="ay-header">
        <Link href="/admin/dashboard" className="ay-back"><ArrowLeft size={16} /> Dashboard</Link>
        <h1 className="ay-title">YouTube Videos</h1>
        <button className="ay-add-btn" onClick={() => alert('Full YouTube CMS form coming soon — use the blog admin pattern as reference.')}>
          <Plus size={15} /> Add Video
        </button>
      </header>
      <div className="ay-list">
        {videoFixtures.map((v, i) => (
          <div key={v.youtubeId} className="ay-item">
            <div className="ay-item__thumb">
              <Video size={20} style={{ color: '#EF4444' }} />
            </div>
            <div className="ay-item__info">
              <p className="ay-item__title">{v.title}</p>
              <div className="ay-item__meta">
                <span>{v.topic}</span> · <span>{v.duration}</span> ·{' '}
                <span>{new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            <span className="ay-item__fixture">Fixture</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .ay-page { min-height: 100vh; background: #060d1f; color: #F0F0F5; padding: 32px 28px 80px; font-family: 'Inter', sans-serif; }
        .ay-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .ay-back { display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: rgba(160,168,192,0.60); text-decoration: none; }
        .ay-back:hover { color: #6958FF; }
        .ay-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; flex: 1; }
        .ay-add-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 11px; background: linear-gradient(135deg, #EF4444, #F87171); color: white; font-size: 0.83rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }
        .ay-add-btn:hover { transform: translateY(-1px); }
        .ay-list { display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
        .ay-item { display: flex; align-items: center; gap: 14px; padding: 16px; background: rgba(13,27,62,0.60); border: 1px solid rgba(105,88,255,0.14); border-radius: 14px; transition: all 0.2s; }
        .ay-item:hover { border-color: rgba(105,88,255,0.30); }
        .ay-item__thumb { width: 52px; height: 52px; border-radius: 10px; background: rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ay-item__info { flex: 1; }
        .ay-item__title { font-size: 0.90rem; font-weight: 600; color: #F0F0F5; margin-bottom: 5px; }
        .ay-item__meta { font-size: 0.72rem; color: rgba(160,168,192,0.50); }
        .ay-item__fixture { font-size: 0.64rem; color: rgba(160,168,192,0.40); background: rgba(105,88,255,0.10); padding: 2px 7px; border-radius: 5px; border: 1px solid rgba(105,88,255,0.16); }
      `}</style>
    </div>
  );
}

export default function AdminYoutubePage() {
  return <AdminGuard><YouTubeContent /></AdminGuard>;
}
