'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, MapPin, Globe, Camera, List,
  Star, Image as ImageIcon, ToggleLeft, ToggleRight, Plus, X
} from 'lucide-react';
import AdminGuard, { getAdminToken } from '@/components/admin/AdminGuard';

interface FormData {
  destination: string;
  country: string;
  countryCode: string;
  cities: string;
  excerpt: string;
  visitedAt: string;
  endedAt: string;
  isCurrent: boolean;
  coverImage: string;
  profilePhotoAtLocation: string;
  photos: string;
  highlights: string;
  travelStyle: 'solo' | 'team' | 'remote-work' | 'leisure';
  emoji: string;
  lat: string;
  lng: string;
}

const EMPTY_FORM: FormData = {
  destination: '',
  country: '',
  countryCode: '',
  cities: '',
  excerpt: '',
  visitedAt: '',
  endedAt: '',
  isCurrent: false,
  coverImage: '',
  profilePhotoAtLocation: '/avatar-3d-head-only.png',
  photos: '',
  highlights: '',
  travelStyle: 'remote-work',
  emoji: '✈️',
  lat: '',
  lng: '',
};

const EMOJI_OPTIONS = ['✈️', '🌍', '🏔️', '🏝️', '🏙️', '🗺️', '🚂', '🛵', '🚗', '⛵'];
const STYLE_OPTIONS: Array<{ value: FormData['travelStyle']; label: string }> = [
  { value: 'remote-work', label: '💻 Remote Work' },
  { value: 'solo', label: '🎒 Solo' },
  { value: 'team', label: '👥 Team' },
  { value: 'leisure', label: '✈️ Leisure' },
];

function FieldLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <label className="anf-label">
      <Icon size={12} /> {label}
    </label>
  );
}

function NewAdventureForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.destination || !form.country || !form.visitedAt || !form.excerpt) {
      setError('Please fill in Destination, Country, Date, and Excerpt.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        slug: `${form.destination.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        cities: form.cities.split(',').map((c) => c.trim()).filter(Boolean),
        photos: form.photos.split('\n').map((p) => p.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
        lat: parseFloat(form.lat) || 0,
        lng: parseFloat(form.lng) || 0,
      };
      const res = await fetch('/api/admin/data/adventures', {
        method: 'POST',
        headers: { 'x-admin-token': getAdminToken(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/adventures'), 1200);
      } else {
        setError('Save failed. Try again.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="anf-page">
      {/* Header */}
      <header className="anf-header">
        <Link href="/admin/adventures" className="anf-back">
          <ArrowLeft size={16} /> Adventures
        </Link>
        <h1 className="anf-title">New Adventure</h1>
        <button onClick={handleSave} disabled={saving || success} className="anf-save-btn">
          {saving ? <><Loader2 size={14} className="anf-spin" /> Saving…</> :
           success ? '✓ Saved!' : <><Save size={14} /> Save Adventure</>}
        </button>
      </header>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="anf-error"
        >
          ⚠ {error}
        </motion.p>
      )}

      <div className="anf-layout">
        {/* ── Left: Form ── */}
        <div className="anf-form">

          {/* Basic Info */}
          <section className="anf-section">
            <h2 className="anf-section-title"><Globe size={16} /> Basic Info</h2>
            <div className="anf-row-2">
              <div className="anf-field">
                <FieldLabel icon={MapPin} label="Destination *" />
                <input className="anf-input" placeholder="e.g. Thailand" value={form.destination} onChange={(e) => set('destination', e.target.value)} />
              </div>
              <div className="anf-field">
                <FieldLabel icon={Globe} label="Country *" />
                <input className="anf-input" placeholder="e.g. Thailand" value={form.country} onChange={(e) => set('country', e.target.value)} />
              </div>
            </div>
            <div className="anf-row-2">
              <div className="anf-field">
                <FieldLabel icon={Globe} label="Country Code" />
                <input className="anf-input" placeholder="e.g. TH" maxLength={2} value={form.countryCode} onChange={(e) => set('countryCode', e.target.value.toUpperCase())} />
              </div>
              <div className="anf-field">
                <FieldLabel icon={MapPin} label="Cities (comma-separated)" />
                <input className="anf-input" placeholder="Bangkok, Chiang Mai" value={form.cities} onChange={(e) => set('cities', e.target.value)} />
              </div>
            </div>
            <div className="anf-field">
              <FieldLabel icon={List} label="Excerpt *" />
              <textarea className="anf-textarea" rows={3} placeholder="A short description of the adventure…" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            </div>
          </section>

          {/* Dates & Style */}
          <section className="anf-section">
            <h2 className="anf-section-title"><Star size={16} /> Dates & Style</h2>
            <div className="anf-row-3">
              <div className="anf-field">
                <FieldLabel icon={List} label="Arrived *" />
                <input type="date" className="anf-input" value={form.visitedAt} onChange={(e) => set('visitedAt', e.target.value)} />
              </div>
              <div className="anf-field">
                <FieldLabel icon={List} label="Departed (leave blank if current)" />
                <input type="date" className="anf-input" value={form.endedAt} onChange={(e) => set('endedAt', e.target.value)} />
              </div>
              <div className="anf-field">
                <FieldLabel icon={List} label="Currently There?" />
                <button
                  type="button"
                  onClick={() => set('isCurrent', !form.isCurrent)}
                  className={`anf-toggle ${form.isCurrent ? 'is-on' : ''}`}
                >
                  {form.isCurrent ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  <span>{form.isCurrent ? 'Yes — Live Now' : 'No — Past Trip'}</span>
                </button>
              </div>
            </div>

            <div className="anf-row-2">
              <div className="anf-field">
                <FieldLabel icon={List} label="Travel Style" />
                <div className="anf-style-grid">
                  {STYLE_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set('travelStyle', s.value)}
                      className={`anf-style-opt ${form.travelStyle === s.value ? 'is-active' : ''}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="anf-field">
                <FieldLabel icon={List} label="Emoji / Flag" />
                <div className="anf-emoji-grid">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => set('emoji', e)}
                      className={`anf-emoji-opt ${form.emoji === e ? 'is-active' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                  <input
                    className="anf-emoji-input"
                    placeholder="🌏"
                    value={form.emoji}
                    onChange={(e) => set('emoji', e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="anf-section">
            <h2 className="anf-section-title"><ImageIcon size={16} /> Images</h2>
            <div className="anf-field">
              <FieldLabel icon={Camera} label="Cover Image URL" />
              <input className="anf-input" placeholder="https://images.unsplash.com/..." value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} />
              {form.coverImage && (
                <div className="anf-img-preview">
                  <img src={form.coverImage} alt="Cover preview" />
                </div>
              )}
            </div>
            <div className="anf-field">
              <FieldLabel icon={Camera} label="Profile Photo at This Location" />
              <input className="anf-input" placeholder="/avatar-3d-head-only.png or a real photo URL" value={form.profilePhotoAtLocation} onChange={(e) => set('profilePhotoAtLocation', e.target.value)} />
            </div>
            <div className="anf-field">
              <FieldLabel icon={Camera} label="Gallery Photos (one URL per line)" />
              <textarea className="anf-textarea" rows={4} placeholder={"https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."} value={form.photos} onChange={(e) => set('photos', e.target.value)} />
            </div>
          </section>

          {/* Highlights */}
          <section className="anf-section">
            <h2 className="anf-section-title"><Star size={16} /> Highlights</h2>
            <div className="anf-field">
              <FieldLabel icon={List} label="One highlight per line" />
              <textarea className="anf-textarea" rows={5} placeholder={"Digital nomad base in Chiang Mai\nStreet food tour through Bangkok night markets\n..."} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} />
            </div>
          </section>

          {/* Coordinates */}
          <section className="anf-section">
            <h2 className="anf-section-title"><Globe size={16} /> Map Coordinates</h2>
            <div className="anf-row-2">
              <div className="anf-field">
                <FieldLabel icon={MapPin} label="Latitude" />
                <input type="number" step="0.0001" className="anf-input" placeholder="e.g. 13.7563" value={form.lat} onChange={(e) => set('lat', e.target.value)} />
              </div>
              <div className="anf-field">
                <FieldLabel icon={MapPin} label="Longitude" />
                <input type="number" step="0.0001" className="anf-input" placeholder="e.g. 100.5018" value={form.lng} onChange={(e) => set('lng', e.target.value)} />
              </div>
            </div>
          </section>
        </div>

        {/* ── Right: Preview ── */}
        <aside className="anf-preview">
          <h2 className="anf-preview-title">Live Preview</h2>
          <div className="anf-preview-card">
            {/* Cover */}
            <div className="anf-prev__cover">
              {form.coverImage ? (
                <img src={form.coverImage} alt="Cover" className="anf-prev__cover-img" />
              ) : (
                <div className="anf-prev__cover-placeholder">
                  <Camera size={28} />
                  <span>Add a cover image URL</span>
                </div>
              )}
              <div className="anf-prev__cover-overlay" />
              {form.isCurrent && (
                <div className="anf-prev__live">
                  <span className="anf-prev__live-dot" /> Live Now
                </div>
              )}
              {/* Profile photo pin */}
              <div className="anf-prev__profile-pin">
                <Image
                  src={form.profilePhotoAtLocation || '/avatar-3d-head-only.png'}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="anf-prev__profile-img"
                  style={{ width: '48px', height: '48px' }}
                  onError={() => {}}
                />
              </div>
              <div className="anf-prev__info">
                <div>{form.emoji || '✈️'}</div>
                <div>
                  <p className="anf-prev__dest">{form.destination || 'Destination'}</p>
                  <p className="anf-prev__cities">{form.cities || 'Cities'}</p>
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="anf-prev__body">
              <p className="anf-prev__excerpt">{form.excerpt || 'Your adventure excerpt will appear here…'}</p>
              {form.highlights && (
                <ul className="anf-prev__highlights">
                  {form.highlights.split('\n').filter(Boolean).slice(0, 3).map((h, i) => (
                    <li key={i}>✦ {h}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .anf-page {
          min-height: 100vh;
          background: #060d1f;
          color: #F0F0F5;
          padding: 32px 28px 80px;
          font-family: 'Inter', sans-serif;
        }

        .anf-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .anf-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: rgba(160,168,192,0.60);
          text-decoration: none;
          transition: color 0.2s;
        }
        .anf-back:hover { color: #6958FF; }

        .anf-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          flex: 1;
        }

        .anf-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 22px;
          border-radius: 11px;
          background: linear-gradient(135deg, #6958FF, #8B7AFF);
          color: white;
          font-size: 0.86rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(105,88,255,0.35);
        }
        .anf-save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(105,88,255,0.50);
        }
        .anf-save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .anf-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .anf-error {
          max-width: 660px;
          font-size: 0.83rem;
          color: #F87171;
          background: rgba(248,113,113,0.10);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 20px;
        }

        /* ── Layout ── */
        .anf-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
          max-width: 1200px;
        }

        @media (max-width: 1024px) {
          .anf-layout { grid-template-columns: 1fr; }
          .anf-preview { order: -1; }
        }

        /* ── Sections ── */
        .anf-section {
          background: rgba(13,27,62,0.55);
          border: 1px solid rgba(105,88,255,0.15);
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .anf-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          color: rgba(167,139,250,0.90);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 4px;
        }

        .anf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .anf-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

        @media (max-width: 700px) {
          .anf-row-2, .anf-row-3 { grid-template-columns: 1fr; }
        }

        /* ── Fields ── */
        .anf-field { display: flex; flex-direction: column; gap: 7px; }

        :global(.anf-label) {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          font-weight: 600;
          color: rgba(160,168,192,0.70);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .anf-input, .anf-textarea {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(8,18,41,0.70);
          border: 1px solid rgba(105,88,255,0.20);
          color: #F0F0F5;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: vertical;
          width: 100%;
        }
        .anf-input:focus, .anf-textarea:focus {
          border-color: #6958FF;
          box-shadow: 0 0 0 3px rgba(105,88,255,0.14);
        }
        .anf-input::placeholder, .anf-textarea::placeholder {
          color: rgba(160,168,192,0.30);
        }

        /* Toggle */
        .anf-toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(8,18,41,0.70);
          border: 1px solid rgba(105,88,255,0.20);
          border-radius: 10px;
          padding: 9px 14px;
          cursor: pointer;
          color: rgba(160,168,192,0.65);
          font-size: 0.84rem;
          transition: all 0.2s;
          width: 100%;
        }
        .anf-toggle.is-on {
          color: #4ADE80;
          border-color: rgba(74,222,128,0.35);
          background: rgba(74,222,128,0.08);
        }

        /* Style options */
        .anf-style-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .anf-style-opt {
          padding: 8px 12px;
          border-radius: 9px;
          border: 1px solid rgba(105,88,255,0.18);
          background: rgba(8,18,41,0.55);
          color: rgba(160,168,192,0.65);
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.18s;
        }
        .anf-style-opt:hover { border-color: rgba(105,88,255,0.40); color: #F0F0F5; }
        .anf-style-opt.is-active {
          border-color: #6958FF;
          background: rgba(105,88,255,0.18);
          color: #A78BFA;
          font-weight: 600;
        }

        /* Emoji grid */
        .anf-emoji-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .anf-emoji-opt {
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1px solid rgba(105,88,255,0.18);
          background: rgba(8,18,41,0.55);
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anf-emoji-opt:hover { border-color: rgba(105,88,255,0.40); }
        .anf-emoji-opt.is-active {
          border-color: #6958FF;
          background: rgba(105,88,255,0.18);
        }
        .anf-emoji-input {
          width: 60px;
          padding: 6px 10px;
          border-radius: 9px;
          background: rgba(8,18,41,0.70);
          border: 1px solid rgba(105,88,255,0.20);
          color: #F0F0F5;
          font-size: 0.88rem;
          outline: none;
          text-align: center;
        }

        /* Image preview */
        .anf-img-preview {
          border-radius: 12px;
          overflow: hidden;
          max-height: 180px;
          margin-top: 6px;
        }
        .anf-img-preview img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        /* ── Preview Panel ── */
        .anf-preview {
          position: sticky;
          top: 24px;
        }

        .anf-preview-title {
          font-size: 0.80rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: rgba(160,168,192,0.50);
          margin-bottom: 12px;
        }

        .anf-preview-card {
          border-radius: 18px;
          overflow: hidden;
          background: rgba(13,27,62,0.65);
          border: 1px solid rgba(105,88,255,0.18);
        }

        .anf-prev__cover {
          position: relative;
          height: 200px;
          background: rgba(8,18,41,0.80);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .anf-prev__cover-img {
          width: 100%; height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
        }

        .anf-prev__cover-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(160,168,192,0.30);
          font-size: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .anf-prev__cover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(8,18,41,0.85) 100%);
          z-index: 1;
        }

        .anf-prev__live {
          position: absolute;
          top: 10px; right: 10px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(13,27,62,0.80);
          border: 1px solid rgba(74,222,128,0.35);
          color: #4ADE80;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
        }

        .anf-prev__live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ADE80;
          animation: live-pulse 2s infinite;
        }
        @keyframes live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
          70% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }

        .anf-prev__profile-pin {
          position: absolute;
          bottom: 12px; left: 14px;
          z-index: 2;
        }

        :global(.anf-prev__profile-img) {
          border-radius: 50% !important;
          border: 2px solid rgba(105,88,255,0.70);
          object-fit: cover;
          background: #0D1B3E;
          box-shadow: 0 0 0 2px rgba(13,27,62,0.8), 0 4px 12px rgba(0,0,0,0.5);
          width: 48px !important;
          height: 48px !important;
        }

        .anf-prev__info {
          position: absolute;
          bottom: 12px;
          left: 72px;
          right: 12px;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          font-size: 1rem;
        }

        .anf-prev__dest {
          font-weight: 700;
          font-size: 0.95rem;
          color: white;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .anf-prev__cities {
          font-size: 0.70rem;
          color: rgba(255,255,255,0.60);
          margin-top: 1px;
        }

        .anf-prev__body {
          padding: 16px;
        }

        .anf-prev__excerpt {
          font-size: 0.80rem;
          color: rgba(160,168,192,0.70);
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .anf-prev__highlights {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .anf-prev__highlights li {
          font-size: 0.73rem;
          color: rgba(160,168,192,0.50);
        }
      `}</style>
    </div>
  );
}

export default function NewAdventurePage() {
  return (
    <AdminGuard>
      <NewAdventureForm />
    </AdminGuard>
  );
}
