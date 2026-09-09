'use client';
import Link from 'next/link';
import { ArrowLeft, Settings, Key, Globe, Shield } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';

function SettingsContent() {
  return (
    <div className="ast-page">
      <header className="ast-header">
        <Link href="/admin/dashboard" className="ast-back"><ArrowLeft size={16} /> Dashboard</Link>
        <h1 className="ast-title">Settings</h1>
      </header>
      <div className="ast-sections">
        <div className="ast-card">
          <div className="ast-card__icon"><Key size={18} /></div>
          <div>
            <h3 className="ast-card__title">Admin Password</h3>
            <p className="ast-card__desc">Change via <code>.env.local</code> → <code>ADMIN_PASSWORD</code>. Restart dev server after changes.</p>
          </div>
        </div>
        <div className="ast-card">
          <div className="ast-card__icon"><Globe size={18} /></div>
          <div>
            <h3 className="ast-card__title">Content Storage</h3>
            <p className="ast-card__desc">Admin-created content is saved to <code>data/content.json</code>. Fixture data in <code>lib/fixtures.ts</code> is read-only.</p>
          </div>
        </div>
        <div className="ast-card">
          <div className="ast-card__icon"><Shield size={18} /></div>
          <div>
            <h3 className="ast-card__title">Authentication</h3>
            <p className="ast-card__desc">Session stored in <code>sessionStorage</code>. Closes when browser tab is closed. No persistent cookies.</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ast-page { min-height: 100vh; background: #060d1f; color: #F0F0F5; padding: 32px 28px 80px; font-family: 'Inter', sans-serif; }
        .ast-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
        .ast-back { display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: rgba(160,168,192,0.60); text-decoration: none; }
        .ast-back:hover { color: #6958FF; }
        .ast-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; }
        .ast-sections { display: flex; flex-direction: column; gap: 14px; max-width: 640px; }
        .ast-card { display: flex; align-items: flex-start; gap: 16px; padding: 22px; background: rgba(13,27,62,0.60); border: 1px solid rgba(105,88,255,0.16); border-radius: 16px; }
        .ast-card__icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(105,88,255,0.14); border: 1px solid rgba(105,88,255,0.22); display: flex; align-items: center; justify-content: center; color: #A78BFA; flex-shrink: 0; }
        .ast-card__title { font-size: 0.92rem; font-weight: 700; color: #F0F0F5; margin-bottom: 6px; }
        .ast-card__desc { font-size: 0.80rem; color: rgba(160,168,192,0.60); line-height: 1.6; }
        .ast-card__desc code { font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; background: rgba(105,88,255,0.12); padding: 1px 5px; border-radius: 4px; color: #A78BFA; }
      `}</style>
    </div>
  );
}

export default function AdminSettingsPage() {
  return <AdminGuard><SettingsContent /></AdminGuard>;
}
