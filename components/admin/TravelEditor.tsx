'use client';

import { useState } from 'react';
import MediaUploader from '@/components/admin/MediaUploader';

export interface TravelDraft {
  destination: string;
  country: string;
  countryCode: string;
  citiesCsv: string;
  excerpt: string;
  visitedAt: string;
  endedAt: string;
  isCurrent: boolean;
  coverImage: string;
  highlightsCsv: string;
  travelStyle: 'solo' | 'team' | 'remote-work' | 'leisure';
  emoji: string;
  lat: number;
  lng: number;
}

interface TravelEditorProps {
  onSave: (draft: TravelDraft) => Promise<void>;
}

export default function TravelEditor({ onSave }: TravelEditorProps) {
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<TravelDraft>({
    destination: '',
    country: '',
    countryCode: '',
    citiesCsv: '',
    excerpt: '',
    visitedAt: '',
    endedAt: '',
    isCurrent: true,
    coverImage: '',
    highlightsCsv: '',
    travelStyle: 'remote-work',
    emoji: '🌍',
    lat: 0,
    lng: 0,
  });

  return (
    <div className="travel-grid">
      <input className="travel-input" placeholder="Destination" value={draft.destination} onChange={(event) => setDraft((prev) => ({ ...prev, destination: event.target.value }))} />
      <input className="travel-input" placeholder="Country" value={draft.country} onChange={(event) => setDraft((prev) => ({ ...prev, country: event.target.value }))} />
      <input className="travel-input" placeholder="Country code" value={draft.countryCode} onChange={(event) => setDraft((prev) => ({ ...prev, countryCode: event.target.value.toUpperCase() }))} />
      <input className="travel-input" placeholder="Cities (comma separated)" value={draft.citiesCsv} onChange={(event) => setDraft((prev) => ({ ...prev, citiesCsv: event.target.value }))} />
      <textarea className="travel-area" placeholder="Story excerpt" rows={4} value={draft.excerpt} onChange={(event) => setDraft((prev) => ({ ...prev, excerpt: event.target.value }))} />
      <div className="travel-row">
        <input className="travel-input" type="date" value={draft.visitedAt} onChange={(event) => setDraft((prev) => ({ ...prev, visitedAt: event.target.value }))} />
        <input className="travel-input" type="date" value={draft.endedAt} onChange={(event) => setDraft((prev) => ({ ...prev, endedAt: event.target.value }))} />
      </div>
      <div className="travel-row">
        <select className="travel-input" value={draft.travelStyle} onChange={(event) => setDraft((prev) => ({ ...prev, travelStyle: event.target.value as TravelDraft['travelStyle'] }))}>
          <option value="solo">Solo</option>
          <option value="team">Team</option>
          <option value="remote-work">Remote Work</option>
          <option value="leisure">Leisure</option>
        </select>
        <input className="travel-input" placeholder="Emoji" value={draft.emoji} onChange={(event) => setDraft((prev) => ({ ...prev, emoji: event.target.value }))} />
      </div>
      <div className="travel-row">
        <input className="travel-input" type="number" placeholder="Latitude" value={draft.lat} onChange={(event) => setDraft((prev) => ({ ...prev, lat: Number(event.target.value) }))} />
        <input className="travel-input" type="number" placeholder="Longitude" value={draft.lng} onChange={(event) => setDraft((prev) => ({ ...prev, lng: Number(event.target.value) }))} />
      </div>
      <input className="travel-input" placeholder="Highlights (comma separated)" value={draft.highlightsCsv} onChange={(event) => setDraft((prev) => ({ ...prev, highlightsCsv: event.target.value }))} />
      <input className="travel-input" placeholder="Cover image URL" value={draft.coverImage} onChange={(event) => setDraft((prev) => ({ ...prev, coverImage: event.target.value }))} />
      <MediaUploader onUploaded={(url) => setDraft((prev) => ({ ...prev, coverImage: url }))} />
      <label className="travel-check">
        <input type="checkbox" checked={draft.isCurrent} onChange={(event) => setDraft((prev) => ({ ...prev, isCurrent: event.target.checked }))} />
        Mark as current adventure
      </label>
      <button
        className="travel-save"
        onClick={async () => {
          setSaving(true);
          try {
            await onSave(draft);
          } finally {
            setSaving(false);
          }
        }}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Adventure'}
      </button>

      <style jsx>{`
        .travel-grid {
          display: grid;
          gap: 10px;
        }

        .travel-row {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr 1fr;
        }

        .travel-input,
        .travel-area {
          background: rgba(13, 27, 62, 0.55);
          border: 1px solid rgba(105, 88, 255, 0.2);
          border-radius: 10px;
          color: #f0f0f5;
          padding: 10px 12px;
          font-size: 0.86rem;
          width: 100%;
        }

        .travel-area {
          resize: vertical;
        }

        .travel-check {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-size: 0.84rem;
          color: rgba(240, 240, 245, 0.9);
        }

        .travel-save {
          border: none;
          background: linear-gradient(135deg, #ff8a3d, #ff6b35);
          color: white;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
