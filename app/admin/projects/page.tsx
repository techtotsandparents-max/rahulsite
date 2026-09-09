'use client';
import Link from 'next/link';
import { ArrowLeft, Code2, GitFork, Plus } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import { projectFixtures } from '@/lib/fixtures';

function ProjectsContent() {
  return (
    <div className="apr-page">
      <header className="apr-header">
        <Link href="/admin/dashboard" className="apr-back"><ArrowLeft size={16} /> Dashboard</Link>
        <h1 className="apr-title">Projects</h1>
        <button className="apr-add-btn" onClick={() => alert('Full Projects CMS form coming soon.')}>
          <Plus size={15} /> Add Project
        </button>
      </header>
      <div className="apr-list">
        {projectFixtures.map((p) => (
          <div key={p.slug} className="apr-item">
            <div className="apr-item__icon"><Code2 size={20} /></div>
            <div className="apr-item__info">
              <div className="apr-item__title-row">
                <p className="apr-item__title">{p.title}</p>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="apr-item__gh">
                    <GitFork size={14} />
                  </a>
                )}
              </div>
              <p className="apr-item__desc">{p.description}</p>
              <div className="apr-item__tech">
                {p.tech.map((t) => <span key={t} className="apr-item__tag">{t}</span>)}
              </div>
            </div>
            <span className="apr-item__fixture">Fixture</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .apr-page { min-height: 100vh; background: #060d1f; color: #F0F0F5; padding: 32px 28px 80px; font-family: 'Inter', sans-serif; }
        .apr-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .apr-back { display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: rgba(160,168,192,0.60); text-decoration: none; }
        .apr-back:hover { color: #6958FF; }
        .apr-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; flex: 1; }
        .apr-add-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 11px; background: linear-gradient(135deg, #10B981, #34D399); color: white; font-size: 0.83rem; font-weight: 600; border: none; cursor: pointer; }
        .apr-list { display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
        .apr-item { display: flex; align-items: flex-start; gap: 14px; padding: 18px; background: rgba(13,27,62,0.60); border: 1px solid rgba(105,88,255,0.14); border-radius: 14px; }
        .apr-item__icon { width: 46px; height: 46px; border-radius: 12px; background: rgba(16,185,129,0.12); display: flex; align-items: center; justify-content: center; color: #10B981; flex-shrink: 0; }
        .apr-item__info { flex: 1; }
        .apr-item__title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .apr-item__title { font-size: 0.92rem; font-weight: 700; color: #F0F0F5; }
        .apr-item__gh { color: rgba(160,168,192,0.50); display: flex; text-decoration: none; transition: color 0.2s; }
        .apr-item__gh:hover { color: #F0F0F5; }
        .apr-item__desc { font-size: 0.78rem; color: rgba(160,168,192,0.55); margin-bottom: 10px; line-height: 1.5; }
        .apr-item__tech { display: flex; gap: 6px; flex-wrap: wrap; }
        .apr-item__tag { font-size: 0.68rem; padding: 3px 8px; border-radius: 6px; background: rgba(105,88,255,0.12); border: 1px solid rgba(105,88,255,0.20); color: #A78BFA; }
        .apr-item__fixture { font-size: 0.64rem; color: rgba(160,168,192,0.40); background: rgba(105,88,255,0.10); padding: 2px 7px; border-radius: 5px; border: 1px solid rgba(105,88,255,0.16); flex-shrink: 0; }
      `}</style>
    </div>
  );
}

export default function AdminProjectsPage() {
  return <AdminGuard><ProjectsContent /></AdminGuard>;
}
