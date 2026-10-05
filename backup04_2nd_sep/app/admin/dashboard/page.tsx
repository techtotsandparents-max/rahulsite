'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plane, FileText, Video, Code2, LogOut, LayoutDashboard,
  Plus, Settings, ChevronRight, Globe, Users, Eye, TrendingUp,
  Terminal, Menu, X
} from 'lucide-react';
import AdminGuard, { getAdminToken } from '@/components/admin/AdminGuard';
import { adventureFixtures, blogFixtures, videoFixtures, projectFixtures } from '@/lib/fixtures';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/adventures', label: 'Adventures', icon: Plane },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/youtube', label: 'YouTube', icon: Video },
  { href: '/admin/projects', label: 'Projects', icon: Code2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const STATS = [
  { label: 'Adventures', value: adventureFixtures.length, icon: Plane, color: '#FF8A3D', href: '/admin/adventures' },
  { label: 'Blog Posts', value: blogFixtures.length, icon: FileText, color: '#6958FF', href: '/admin/blog' },
  { label: 'YouTube Videos', value: videoFixtures.length, icon: Video, color: '#EF4444', href: '/admin/youtube' },
  { label: 'Projects', value: projectFixtures.length, icon: Code2, color: '#10B981', href: '/admin/projects' },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('admin-token');
    router.push('/admin');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="ad-sidebar__backdrop"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside className={`ad-sidebar ${open ? 'is-open' : ''}`}>
        {/* Brand */}
        <div className="ad-sidebar__brand">
          <div className="ad-sidebar__logo"><Terminal size={18} /></div>
          <div>
            <p className="ad-sidebar__site">RahulTripathi.dev</p>
            <p className="ad-sidebar__role">Content Studio</p>
          </div>
          <button className="ad-sidebar__close-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="ad-sidebar__nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`ad-sidebar__link ${pathname === href ? 'is-active' : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {pathname === href && <ChevronRight size={14} className="ad-sidebar__chevron" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="ad-sidebar__footer">
          <Link href="/" target="_blank" className="ad-sidebar__view-site">
            <Globe size={14} /> View Live Site
          </Link>
          <button onClick={handleLogout} className="ad-sidebar__logout">
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
}

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmsAdventures, setCmsAdventures] = useState<object[]>([]);

  useEffect(() => {
    // Load any admin-added adventures from content.json
    fetch('/api/admin/data/adventures', {
      headers: { 'x-admin-token': getAdminToken() },
    })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setCmsAdventures(d.data); })
      .catch(() => {});
  }, []);

  const totalAdventures = adventureFixtures.length + cmsAdventures.length;

  return (
    <div className="ad-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="ad-main">
        {/* Top bar */}
        <header className="ad-topbar">
          <button
            className="ad-topbar__menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="ad-topbar__title">Dashboard</div>
          <div className="ad-topbar__actions">
            <Link href="/admin/adventures/new" className="ad-topbar__cta">
              <Plus size={15} /> New Adventure
            </Link>
          </div>
        </header>

        <div className="ad-content">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="ad-welcome"
          >
            <h1 className="ad-welcome__title">Hey, Rahul 👋</h1>
            <p className="ad-welcome__sub">Here&apos;s what&apos;s happening on your site today.</p>
          </motion.div>

          {/* Stats grid */}
          <div className="ad-stats-grid">
            {[{ ...STATS[0], value: totalAdventures }, ...STATS.slice(1)].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link href={stat.href} className="ad-stat-card">
                  <div className="ad-stat-card__icon" style={{ background: stat.color + '20', color: stat.color }}>
                    <stat.icon size={20} />
                  </div>
                  <div className="ad-stat-card__body">
                    <p className="ad-stat-card__val">{stat.value}</p>
                    <p className="ad-stat-card__label">{stat.label}</p>
                  </div>
                  <ChevronRight size={16} className="ad-stat-card__arrow" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="ad-quick-section"
          >
            <h2 className="ad-section-title">Quick Actions</h2>
            <div className="ad-quick-grid">
              {[
                { label: 'Add Adventure', desc: 'Log a new destination', icon: Plane, href: '/admin/adventures/new', color: '#FF8A3D' },
                { label: 'Write Blog Post', desc: 'Share knowledge or a story', icon: FileText, href: '/admin/blog/new', color: '#6958FF' },
                { label: 'Add YouTube Video', desc: 'Link a new video', icon: Video, href: '/admin/youtube/new', color: '#EF4444' },
                { label: 'Add Project', desc: 'Showcase open-source work', icon: Code2, href: '/admin/projects/new', color: '#10B981' },
              ].map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.06 }}
                >
                  <Link href={action.href} className="ad-quick-card">
                    <div className="ad-quick-card__icon" style={{ background: action.color + '18', color: action.color }}>
                      <action.icon size={22} />
                    </div>
                    <div>
                      <p className="ad-quick-card__label">{action.label}</p>
                      <p className="ad-quick-card__desc">{action.desc}</p>
                    </div>
                    <Plus size={15} className="ad-quick-card__plus" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Recent adventures preview */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="ad-recent-section"
          >
            <div className="ad-section-header">
              <h2 className="ad-section-title">Recent Adventures</h2>
              <Link href="/admin/adventures" className="ad-section-link">View All →</Link>
            </div>
            <div className="ad-recent-list">
              {adventureFixtures.slice(0, 4).map((adv) => (
                <Link key={adv.slug} href={`/admin/adventures/${adv.slug}`} className="ad-recent-item">
                  <img src={adv.coverImage} alt={adv.destination} className="ad-recent-thumb" />
                  <div className="ad-recent-info">
                    <p className="ad-recent-dest">{adv.emoji} {adv.destination}</p>
                    <p className="ad-recent-meta">{adv.cities.join(', ')} · {new Date(adv.visitedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  {adv.isCurrent && <span className="ad-recent-badge">Live</span>}
                  <ChevronRight size={15} className="ad-recent-arrow" />
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <style jsx>{`
        /* ── Layout ── */
        .ad-layout {
          display: flex;
          min-height: 100vh;
          background: #060d1f;
          color: #F0F0F5;
          font-family: 'Inter', sans-serif;
        }

        /* ── Sidebar ── */
        :global(.ad-sidebar) {
          width: 248px;
          flex-shrink: 0;
          background: rgba(13,27,62,0.90);
          border-right: 1px solid rgba(105,88,255,0.18);
          display: flex;
          flex-direction: column;
          padding: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 100;
        }

        @media (max-width: 900px) {
          :global(.ad-sidebar) {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
          }
          :global(.ad-sidebar.is-open) {
            transform: translateX(0);
          }
        }

        :global(.ad-sidebar__backdrop) {
          display: none;
        }

        @media (max-width: 900px) {
          :global(.ad-sidebar__backdrop) {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            z-index: 99;
          }
        }

        :global(.ad-sidebar__brand) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 22px 20px 18px;
          border-bottom: 1px solid rgba(105,88,255,0.12);
        }

        :global(.ad-sidebar__logo) {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6958FF, #8B7AFF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        :global(.ad-sidebar__site) {
          font-size: 0.88rem;
          font-weight: 700;
          color: #F0F0F5;
          letter-spacing: -0.01em;
        }

        :global(.ad-sidebar__role) {
          font-size: 0.70rem;
          color: rgba(160,168,192,0.55);
          margin-top: 1px;
        }

        :global(.ad-sidebar__close-btn) {
          margin-left: auto;
          background: none;
          border: none;
          color: rgba(160,168,192,0.5);
          cursor: pointer;
          display: none;
          padding: 4px;
        }

        @media (max-width: 900px) {
          :global(.ad-sidebar__close-btn) { display: flex; }
        }

        :global(.ad-sidebar__nav) {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        :global(.ad-sidebar__link) {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 14px;
          border-radius: 11px;
          font-size: 0.86rem;
          font-weight: 500;
          color: rgba(160,168,192,0.75);
          text-decoration: none;
          transition: all 0.18s;
          position: relative;
        }

        :global(.ad-sidebar__link:hover) {
          background: rgba(105,88,255,0.10);
          color: #F0F0F5;
        }

        :global(.ad-sidebar__link.is-active) {
          background: rgba(105,88,255,0.18);
          color: #A78BFA;
          font-weight: 600;
        }

        :global(.ad-sidebar__chevron) {
          margin-left: auto;
          opacity: 0.5;
        }

        :global(.ad-sidebar__footer) {
          padding: 16px 12px 20px;
          border-top: 1px solid rgba(105,88,255,0.12);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.ad-sidebar__view-site),
        :global(.ad-sidebar__logout) {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(160,168,192,0.60);
          text-decoration: none;
          transition: all 0.18s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        :global(.ad-sidebar__view-site:hover) {
          color: #6958FF;
          background: rgba(105,88,255,0.10);
        }

        :global(.ad-sidebar__logout:hover) {
          color: #F87171;
          background: rgba(248,113,113,0.08);
        }

        /* ── Main ── */
        .ad-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-x: hidden;
        }

        /* ── Topbar ── */
        .ad-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 28px;
          border-bottom: 1px solid rgba(105,88,255,0.12);
          background: rgba(6,13,31,0.80);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .ad-topbar__menu-btn {
          display: none;
          background: none;
          border: none;
          color: #F0F0F5;
          cursor: pointer;
          padding: 4px;
        }

        @media (max-width: 900px) {
          .ad-topbar__menu-btn { display: flex; }
        }

        .ad-topbar__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #F0F0F5;
        }

        .ad-topbar__actions { margin-left: auto; }

        .ad-topbar__cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF8A3D, #FF9F5A);
          color: white;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(255,138,61,0.30);
        }

        .ad-topbar__cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255,138,61,0.45);
        }

        /* ── Content ── */
        .ad-content {
          padding: 32px 28px 60px;
          max-width: 1100px;
        }

        .ad-welcome { margin-bottom: 32px; }

        .ad-welcome__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          color: #F0F0F5;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .ad-welcome__sub {
          font-size: 0.88rem;
          color: rgba(160,168,192,0.65);
        }

        /* ── Stats ── */
        .ad-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        :global(.ad-stat-card) {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(13,27,62,0.65);
          border: 1px solid rgba(105,88,255,0.16);
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          transition: all 0.22s;
        }

        :global(.ad-stat-card:hover) {
          border-color: rgba(105,88,255,0.40);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.25);
        }

        :global(.ad-stat-card__icon) {
          width: 46px; height: 46px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        :global(.ad-stat-card__val) {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #F0F0F5;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        :global(.ad-stat-card__label) {
          font-size: 0.75rem;
          color: rgba(160,168,192,0.65);
          margin-top: 3px;
        }

        :global(.ad-stat-card__arrow) {
          margin-left: auto;
          color: rgba(160,168,192,0.30);
          flex-shrink: 0;
        }

        /* ── Quick Actions ── */
        .ad-quick-section { margin-bottom: 40px; }

        .ad-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #F0F0F5;
          margin-bottom: 16px;
        }

        .ad-quick-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }

        :global(.ad-quick-card) {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          background: rgba(13,27,62,0.55);
          border: 1px solid rgba(105,88,255,0.14);
          border-radius: 14px;
          text-decoration: none;
          color: inherit;
          transition: all 0.22s;
          cursor: pointer;
        }

        :global(.ad-quick-card:hover) {
          border-color: rgba(105,88,255,0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.22);
        }

        :global(.ad-quick-card__icon) {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        :global(.ad-quick-card__label) {
          font-size: 0.86rem;
          font-weight: 600;
          color: #F0F0F5;
          margin-bottom: 2px;
        }

        :global(.ad-quick-card__desc) {
          font-size: 0.74rem;
          color: rgba(160,168,192,0.55);
        }

        :global(.ad-quick-card__plus) {
          margin-left: auto;
          color: rgba(160,168,192,0.30);
          flex-shrink: 0;
        }

        /* ── Recent Adventures ── */
        .ad-recent-section { margin-bottom: 40px; }

        .ad-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .ad-section-link {
          font-size: 0.80rem;
          color: #6958FF;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ad-section-link:hover { color: #8B7AFF; }

        .ad-recent-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        :global(.ad-recent-item) {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: rgba(13,27,62,0.55);
          border: 1px solid rgba(105,88,255,0.12);
          border-radius: 13px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        :global(.ad-recent-item:hover) {
          border-color: rgba(105,88,255,0.32);
          background: rgba(13,27,62,0.75);
        }

        :global(.ad-recent-thumb) {
          width: 52px; height: 52px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        :global(.ad-recent-dest) {
          font-size: 0.88rem;
          font-weight: 600;
          color: #F0F0F5;
        }

        :global(.ad-recent-meta) {
          font-size: 0.74rem;
          color: rgba(160,168,192,0.55);
          margin-top: 2px;
        }

        :global(.ad-recent-badge) {
          background: rgba(74,222,128,0.15);
          border: 1px solid rgba(74,222,128,0.35);
          color: #4ADE80;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        :global(.ad-recent-arrow) {
          margin-left: auto;
          color: rgba(160,168,192,0.30);
        }
      `}</style>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
