'use client';

import { useMemo, useState } from 'react';

export interface PostDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'CLOUD_ARCHITECTURE' | 'AI_LESSONS' | 'TRAVEL_JOURNAL' | 'CAREER';
  readTime: number;
  externalUrl?: string;
}

interface PostEditorProps {
  onSave: (post: PostDraft) => Promise<void>;
}

const categories: PostDraft['category'][] = ['CLOUD_ARCHITECTURE', 'AI_LESSONS', 'TRAVEL_JOURNAL', 'CAREER'];

export default function PostEditor({ onSave }: PostEditorProps) {
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<PostDraft>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'CLOUD_ARCHITECTURE',
    readTime: 6,
    externalUrl: '',
  });

  const previewTitle = useMemo(() => draft.title || 'Post title preview', [draft.title]);

  return (
    <div className="editor-wrap">
      <div className="editor-grid">
        <input
          value={draft.title}
          placeholder="Title"
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          className="editor-input"
        />
        <input
          value={draft.slug}
          placeholder="Slug"
          onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))}
          className="editor-input"
        />
        <textarea
          value={draft.excerpt}
          placeholder="Excerpt"
          onChange={(event) => setDraft((prev) => ({ ...prev, excerpt: event.target.value }))}
          className="editor-area"
          rows={3}
        />
        <textarea
          value={draft.content}
          placeholder="Markdown or rich content"
          onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
          className="editor-area"
          rows={9}
        />
        <div className="editor-row">
          <select
            className="editor-input"
            value={draft.category}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, category: event.target.value as PostDraft['category'] }))
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="editor-input"
            min={1}
            value={draft.readTime}
            onChange={(event) => setDraft((prev) => ({ ...prev, readTime: Number(event.target.value) || 1 }))}
            placeholder="Read time"
          />
        </div>
        <input
          value={draft.externalUrl}
          placeholder="External URL (optional)"
          onChange={(event) => setDraft((prev) => ({ ...prev, externalUrl: event.target.value }))}
          className="editor-input"
        />
        <button
          type="button"
          className="editor-submit"
          onClick={async () => {
            setSaving(true);
            try {
              await onSave(draft);
              setDraft({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                category: 'CLOUD_ARCHITECTURE',
                readTime: 6,
                externalUrl: '',
              });
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Publish Post'}
        </button>
      </div>

      <div className="preview">
        <p className="preview-label">Live Preview</p>
        <h3>{previewTitle}</h3>
        <p>{draft.excerpt || 'Post excerpt preview will appear here.'}</p>
        <pre>{draft.content || 'Start typing content to preview.'}</pre>
      </div>

      <style jsx>{`
        .editor-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 980px) {
          .editor-wrap {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .editor-grid {
          display: grid;
          gap: 10px;
        }

        .editor-row {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr 1fr;
        }

        .editor-input,
        .editor-area {
          background: rgba(13, 27, 62, 0.55);
          border: 1px solid rgba(105, 88, 255, 0.2);
          border-radius: 10px;
          color: #f0f0f5;
          padding: 10px 12px;
          font-size: 0.86rem;
          width: 100%;
        }

        .editor-area {
          resize: vertical;
          font-family: inherit;
        }

        .editor-submit {
          border: none;
          background: linear-gradient(135deg, #6958ff, #8b7aff);
          color: white;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .preview {
          border: 1px solid rgba(105, 88, 255, 0.25);
          border-radius: 12px;
          background: rgba(6, 13, 31, 0.6);
          padding: 14px;
        }

        .preview-label {
          color: rgba(160, 168, 192, 0.85);
          font-size: 0.75rem;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .preview h3 {
          margin: 0 0 8px;
          font-size: 1.05rem;
        }

        .preview p {
          color: rgba(240, 240, 245, 0.88);
        }

        .preview pre {
          margin: 10px 0 0;
          white-space: pre-wrap;
          font-size: 0.8rem;
          color: rgba(240, 240, 245, 0.78);
        }
      `}</style>
    </div>
  );
}
