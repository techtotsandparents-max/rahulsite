'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { Loader2, LogOut, Trash2 } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import PostEditor, { type PostDraft } from '@/components/admin/PostEditor';
import TravelEditor, { type TravelDraft } from '@/components/admin/TravelEditor';

type TabId = 'blogs' | 'adventures' | 'projects' | 'videos' | 'settings';

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  source?: 'cosmos' | 'fixtures';
  isPlaceholder?: boolean;
}

interface GenericItem {
  id?: string;
  slug?: string;
  title?: string;
  destination?: string;
  youtubeId?: string;
  [key: string]: unknown;
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'blogs', label: 'Blog Management' },
  { id: 'adventures', label: 'Travel Journal CMS' },
  { id: 'projects', label: 'Projects Manager' },
  { id: 'videos', label: 'YouTube Video Curator' },
  { id: 'settings', label: 'Site Settings' },
];

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>('blogs');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [source, setSource] = useState<string>('');

  const [blogs, setBlogs] = useState<GenericItem[]>([]);
  const [adventures, setAdventures] = useState<GenericItem[]>([]);
  const [projects, setProjects] = useState<GenericItem[]>([]);
  const [videos, setVideos] = useState<GenericItem[]>([]);

  const [projectForm, setProjectForm] = useState({ title: '', slug: '', description: '', githubUrl: '', techCsv: '' });
  const [videoForm, setVideoForm] = useState({ title: '', youtubeId: '', topic: '' });
  const [settingsForm, setSettingsForm] = useState({
    weather: 'sunny',
    avatarMode: 'focus',
    companionEnabled: true,
  });

  async function loadType(type: TabId) {
    setLoading(true);
    setNotice('');
    try {
      const response = await fetch(`/api/admin/data/${type}`);
      const payload = (await response.json()) as ApiResponse<GenericItem[]>;
      if (!payload.ok) {
        setNotice(payload.error ?? 'Failed to load data.');
        return;
      }

      if (payload.source) {
        setSource(payload.source);
      }

      const incoming = payload.data ?? [];
      if (type === 'blogs') setBlogs(incoming);
      if (type === 'adventures') setAdventures(incoming);
      if (type === 'projects') setProjects(incoming);
      if (type === 'videos') setVideos(incoming);
    } catch {
      setNotice('Unable to fetch admin data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadType(activeTab);
  }, [activeTab]);

  async function createRecord(type: TabId, data: Record<string, unknown>) {
    const response = await fetch(`/api/admin/data/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = (await response.json()) as ApiResponse<GenericItem>;
    if (!payload.ok) {
      setNotice(payload.error ?? 'Create failed.');
      return;
    }

    setNotice('Saved successfully.');
    await loadType(type);
  }

  async function deleteRecord(type: Exclude<TabId, 'settings'>, id: string) {
    const response = await fetch(`/api/admin/data/${type}/${id}`, { method: 'DELETE' });
    const payload = (await response.json()) as ApiResponse<null>;
    if (!payload.ok) {
      setNotice(payload.error ?? 'Delete failed.');
      return;
    }

    setNotice('Deleted successfully.');
    await loadType(type);
  }

  return (
    <div className="cms-page">
      <header className="cms-top">
        <div>
          <p className="cms-kicker">Admin CMS Console</p>
          <h1>RahulTech Studio</h1>
          <p className="cms-source">Data source: {source || 'loading'}</p>
        </div>
        <button className="cms-logout" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={14} /> Sign out
        </button>
      </header>

      <nav className="cms-tabs" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`cms-tab ${activeTab === tab.id ? 'is-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {notice && <p className="cms-notice">{notice}</p>}

      <section className="cms-panel">
        {loading ? (
          <div className="cms-loading">
            <Loader2 size={20} className="spin" /> Loading...
          </div>
        ) : (
          <>
            {activeTab === 'blogs' && (
              <>
                <PostEditor
                  onSave={async (post: PostDraft) => {
                    await createRecord('blogs', {
                      ...post,
                      isPublished: true,
                      publishedAt: new Date().toISOString(),
                    });
                  }}
                />
                <div className="cms-list">
                  {blogs.map((blog) => (
                    <article key={(blog.id as string) || (blog.slug as string)} className="cms-item">
                      <div>
                        <h3>{(blog.title as string) || 'Untitled post'}</h3>
                        <p>{(blog.excerpt as string) || ''}</p>
                      </div>
                      {blog.id && (
                        <button onClick={() => void deleteRecord('blogs', blog.id as string)} className="cms-delete">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'adventures' && (
              <>
                <TravelEditor
                  onSave={async (draft: TravelDraft) => {
                    await createRecord('adventures', {
                      slug: `${draft.destination.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                      destination: draft.destination,
                      country: draft.country,
                      countryCode: draft.countryCode,
                      cities: draft.citiesCsv.split(',').map((city) => city.trim()).filter(Boolean),
                      excerpt: draft.excerpt,
                      visitedAt: draft.visitedAt,
                      endedAt: draft.endedAt || undefined,
                      isCurrent: draft.isCurrent,
                      coverImage: draft.coverImage,
                      profilePhotoAtLocation: draft.coverImage,
                      photos: draft.coverImage ? [draft.coverImage] : [],
                      highlights: draft.highlightsCsv.split(',').map((item) => item.trim()).filter(Boolean),
                      travelStyle: draft.travelStyle,
                      emoji: draft.emoji,
                      lat: draft.lat,
                      lng: draft.lng,
                    });
                  }}
                />
                <div className="cms-list">
                  {adventures.map((item) => (
                    <article key={(item.id as string) || (item.slug as string)} className="cms-item">
                      <div>
                        <h3>{(item.destination as string) || 'Adventure'}</h3>
                        <p>{(item.country as string) || ''}</p>
                      </div>
                      {item.id && (
                        <button onClick={() => void deleteRecord('adventures', item.id as string)} className="cms-delete">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'projects' && (
              <>
                <div className="cms-form-grid">
                  <input className="cms-input" placeholder="Title" value={projectForm.title} onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))} />
                  <input className="cms-input" placeholder="Slug" value={projectForm.slug} onChange={(event) => setProjectForm((prev) => ({ ...prev, slug: event.target.value }))} />
                  <textarea className="cms-area" rows={4} placeholder="Description" value={projectForm.description} onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))} />
                  <input className="cms-input" placeholder="GitHub URL" value={projectForm.githubUrl} onChange={(event) => setProjectForm((prev) => ({ ...prev, githubUrl: event.target.value }))} />
                  <input className="cms-input" placeholder="Tech stack tags (comma separated)" value={projectForm.techCsv} onChange={(event) => setProjectForm((prev) => ({ ...prev, techCsv: event.target.value }))} />
                  <button
                    className="cms-submit"
                    onClick={() =>
                      void createRecord('projects', {
                        ...projectForm,
                        tech: projectForm.techCsv.split(',').map((tag) => tag.trim()).filter(Boolean),
                      })
                    }
                  >
                    Save Project
                  </button>
                </div>
                <div className="cms-list">
                  {projects.map((project) => (
                    <article key={(project.id as string) || (project.slug as string)} className="cms-item">
                      <div>
                        <h3>{(project.title as string) || 'Project'}</h3>
                        <p>{(project.description as string) || ''}</p>
                      </div>
                      {project.id && (
                        <button onClick={() => void deleteRecord('projects', project.id as string)} className="cms-delete">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'videos' && (
              <>
                <div className="cms-form-grid">
                  <input className="cms-input" placeholder="Video title" value={videoForm.title} onChange={(event) => setVideoForm((prev) => ({ ...prev, title: event.target.value }))} />
                  <input className="cms-input" placeholder="YouTube ID" value={videoForm.youtubeId} onChange={(event) => setVideoForm((prev) => ({ ...prev, youtubeId: event.target.value }))} />
                  <input className="cms-input" placeholder="Topic" value={videoForm.topic} onChange={(event) => setVideoForm((prev) => ({ ...prev, topic: event.target.value }))} />
                  <button className="cms-submit" onClick={() => void createRecord('videos', { ...videoForm })}>
                    Save Video
                  </button>
                </div>
                <div className="cms-list">
                  {videos.map((video) => (
                    <article key={(video.id as string) || (video.youtubeId as string)} className="cms-item">
                      <div>
                        <h3>{(video.title as string) || 'Video'}</h3>
                        <p>{(video.topic as string) || ''}</p>
                      </div>
                      {video.id && (
                        <button onClick={() => void deleteRecord('videos', video.id as string)} className="cms-delete">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="cms-form-grid">
                <label className="cms-label">
                  Active weather
                  <select className="cms-input" value={settingsForm.weather} onChange={(event) => setSettingsForm((prev) => ({ ...prev, weather: event.target.value }))}>
                    <option value="sunny">Sunny</option>
                    <option value="rainy">Rainy</option>
                    <option value="foggy">Foggy</option>
                  </select>
                </label>
                <label className="cms-label">
                  Avatar mode
                  <select className="cms-input" value={settingsForm.avatarMode} onChange={(event) => setSettingsForm((prev) => ({ ...prev, avatarMode: event.target.value }))}>
                    <option value="focus">Focus</option>
                    <option value="mentor">Mentor</option>
                    <option value="travel">Travel</option>
                  </select>
                </label>
                <label className="cms-switch">
                  <input type="checkbox" checked={settingsForm.companionEnabled} onChange={(event) => setSettingsForm((prev) => ({ ...prev, companionEnabled: event.target.checked }))} />
                  Enable companion mode
                </label>
                <button
                  className="cms-submit"
                  onClick={() =>
                    void createRecord('settings', {
                      type: 'site-settings-audit',
                      payload: settingsForm,
                    })
                  }
                >
                  Save Settings Snapshot
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {activeTab !== 'settings' && (
        <p className="cms-footnote">Records without id are fixture rows and remain read-only.</p>
      )}

      <style jsx>{`
        .cms-page {
          min-height: 100vh;
          background: #060d1f;
          color: #f0f0f5;
          padding: 32px;
          font-family: 'Inter', sans-serif;
        }

        .cms-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .cms-top h1 {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          letter-spacing: -0.02em;
        }

        .cms-kicker {
          margin: 0 0 6px;
          color: #a78bfa;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .cms-source {
          margin: 6px 0 0;
          color: rgba(160, 168, 192, 0.8);
          font-size: 0.8rem;
        }

        .cms-logout {
          border: 1px solid rgba(248, 113, 113, 0.4);
          background: rgba(248, 113, 113, 0.12);
          color: #fca5a5;
          border-radius: 10px;
          padding: 8px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .cms-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .cms-tab {
          border: 1px solid rgba(105, 88, 255, 0.2);
          background: rgba(13, 27, 62, 0.55);
          color: rgba(240, 240, 245, 0.9);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .cms-tab.is-active {
          border-color: rgba(105, 88, 255, 0.55);
          background: rgba(105, 88, 255, 0.25);
        }

        .cms-notice {
          margin: 0 0 12px;
          font-size: 0.84rem;
          color: #fde68a;
        }

        .cms-panel {
          background: rgba(13, 27, 62, 0.55);
          border: 1px solid rgba(105, 88, 255, 0.2);
          border-radius: 16px;
          padding: 16px;
        }

        .cms-loading {
          display: flex;
          gap: 8px;
          align-items: center;
          color: rgba(240, 240, 245, 0.9);
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .cms-form-grid {
          display: grid;
          gap: 10px;
        }

        .cms-input,
        .cms-area {
          background: rgba(6, 13, 31, 0.75);
          border: 1px solid rgba(105, 88, 255, 0.24);
          border-radius: 10px;
          color: #f0f0f5;
          padding: 10px 12px;
          font-size: 0.85rem;
        }

        .cms-area {
          resize: vertical;
        }

        .cms-submit {
          border: none;
          background: linear-gradient(135deg, #6958ff, #8b7aff);
          color: white;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .cms-list {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .cms-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          background: rgba(6, 13, 31, 0.62);
          border: 1px solid rgba(105, 88, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
        }

        .cms-item h3 {
          margin: 0 0 5px;
          font-size: 0.95rem;
        }

        .cms-item p {
          margin: 0;
          color: rgba(160, 168, 192, 0.95);
          font-size: 0.8rem;
        }

        .cms-delete {
          border: 1px solid rgba(248, 113, 113, 0.3);
          background: rgba(248, 113, 113, 0.12);
          color: #fca5a5;
          border-radius: 8px;
          padding: 6px 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .cms-label {
          display: grid;
          gap: 6px;
          color: rgba(240, 240, 245, 0.9);
          font-size: 0.82rem;
        }

        .cms-switch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(240, 240, 245, 0.9);
          font-size: 0.84rem;
        }

        .cms-footnote {
          margin-top: 12px;
          color: rgba(160, 168, 192, 0.82);
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .cms-page {
            padding: 20px;
          }

          .cms-top {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
