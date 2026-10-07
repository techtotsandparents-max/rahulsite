import { z } from 'zod';
import { DataService } from './DataService';
import type { YouTubeChannelSnapshot } from '@/lib/schemas';

const thumbnails = z.object({ high: z.object({ url: z.string() }).optional(), default: z.object({ url: z.string() }).optional() }).default({});
const snippet = z.object({ title: z.string(), description: z.string().default(''), thumbnails });
const channelsSchema = z.object({ items: z.array(z.object({ id: z.string(), snippet, contentDetails: z.object({ relatedPlaylists: z.object({ uploads: z.string() }) }) })) });
const playlistsSchema = z.object({ nextPageToken: z.string().optional(), items: z.array(z.object({ id: z.string(), snippet, contentDetails: z.object({ itemCount: z.number() }) })) });

export function channelQuery(input: string): Record<string, string> {
  let channel = input.trim();
  if (/^https?:\/\//i.test(channel)) {
    const parsed = new URL(channel);
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(parsed.hostname)) throw new Error('Enter a YouTube channel URL, handle, or channel ID.');
    const parts = parsed.pathname.split('/').filter(Boolean);
    channel = parts[0] === 'channel' ? parts[1] : parts[0];
  }
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(channel || '')) return { id: channel };
  if (/^@[^/?#\s]+$/.test(channel || '')) return { forHandle: channel };
  throw new Error('Use a channel ID starting with UC, an @handle, or its YouTube URL.');
}

async function youtube(resource: 'channels' | 'playlists', params: Record<string, string>) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('Set YOUTUBE_API_KEY in the Web App environment and enable YouTube Data API v3.');
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${resource}?${new URLSearchParams(params)}`, {
    headers: { 'X-Goog-Api-Key': apiKey }, cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`YouTube request failed (${response.status}). Check the API key, enabled API, and quota.`);
  return response.json();
}

export class YouTubeService {
  static async getChannel(): Promise<YouTubeChannelSnapshot | null> {
    if (!DataService.isDatabaseConfigured()) return null;
    const settings = await DataService.listItems('settings');
    const channel = settings.find((item) => item.id === 'youtube-channel');
    return channel?.snapshot as YouTubeChannelSnapshot || null;
  }

  static async sync(input: string): Promise<YouTubeChannelSnapshot> {
    if (!DataService.isDatabaseConfigured()) throw new Error('Configure Cosmos DB before connecting a channel.');
    const query = channelQuery(input);
    const result = channelsSchema.parse(await youtube('channels', { part: 'snippet,contentDetails', ...query }));
    const channel = result.items[0];
    if (!channel) throw new Error('YouTube channel not found.');
    const playlists: YouTubeChannelSnapshot['playlists'] = [];
    let pageToken = '';
    do {
      const page = playlistsSchema.parse(await youtube('playlists', { part: 'snippet,contentDetails', channelId: channel.id, maxResults: '50', ...(pageToken ? { pageToken } : {}) }));
      playlists.push(...page.items.map((item) => ({ id: item.id, title: item.snippet.title, description: item.snippet.description, thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '', itemCount: item.contentDetails.itemCount })));
      pageToken = page.nextPageToken || '';
      if (pageToken && playlists.length >= 1000) throw new Error('This channel exceeds the 1,000-playlist sync limit.');
    } while (pageToken);
    const snapshot: YouTubeChannelSnapshot = {
      channelId: channel.id, title: channel.snippet.title, description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url || '',
      syncedAt: new Date().toISOString(), playlists,
    };
    const existing = await DataService.updateItem('settings', 'youtube-channel', { snapshot });
    if (!existing) await DataService.createItem('settings', { id: 'youtube-channel', snapshot });
    return snapshot;
  }
}