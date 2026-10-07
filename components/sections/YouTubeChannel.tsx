'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { RefreshCw } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/SocialIcons';
import type { YouTubeChannelSnapshot } from '@/lib/schemas';
import styles from '@/components/admin/ContentTools.module.css';

export default function YouTubeChannel() {
  const { data: session } = useSession();
  const [channel, setChannel] = useState<YouTubeChannelSnapshot | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/youtube', { signal: controller.signal }).then(async (response) => {
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to load channel.');
      setChannel(result.data);
      if (result.data) setInput(result.data.channelId);
    }).catch((failure) => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);

  return <section style={{ margin: '24px 0 48px' }}>
    {session?.user?.isAdmin && <form className={styles.tools} onSubmit={async (event) => {
      event.preventDefault(); setBusy(true); setError('');
      try {
        const response = await fetch('/api/admin/youtube/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel: input }) });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Sync failed.');
        setChannel(result.data);
      } catch (failure) { setError(failure instanceof Error ? failure.message : 'Sync failed.'); }
      finally { setBusy(false); }
    }}>
      <label className={styles.field} style={{ flex: '1 1 240px' }}><span>YouTube channel URL, @handle or ID</span><input value={input} onChange={(event) => setInput(event.target.value)} required disabled={busy} /></label>
      <button type="submit" className={styles.button} disabled={busy}><RefreshCw size={16} /> {busy ? 'Syncing...' : channel ? 'Sync playlists' : 'Connect channel'}</button>
      {channel && <small>Last synced {new Date(channel.syncedAt).toLocaleString()}</small>}
    </form>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {channel && <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        {channel.thumbnail && <img src={channel.thumbnail} alt="" width={72} height={72} style={{ borderRadius: '50%' }} />}
        <div><h2 style={{ fontSize: '1.5rem' }}>{channel.title}</h2><a href={`https://www.youtube.com/channel/${channel.channelId}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><YoutubeIcon size={18} /> View channel</a></div>
      </div>
      <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', maxWidth: 800 }}>{channel.description}</p>
      {channel.playlists.length === 0 && <p>No public playlists found.</p>}
      {channel.playlists.map((playlist) => <section key={playlist.id} style={{ padding: '28px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{playlist.title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{playlist.description}</p>
        <iframe src={`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlist.id)}`} title={playlist.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', maxWidth: 960, aspectRatio: '16 / 9', border: 0, borderRadius: 6 }} />
        <p><a href={`https://www.youtube.com/playlist?list=${encodeURIComponent(playlist.id)}`} target="_blank" rel="noopener noreferrer">{playlist.itemCount} videos on YouTube</a></p>
      </section>)}
    </>}
  </section>;
}