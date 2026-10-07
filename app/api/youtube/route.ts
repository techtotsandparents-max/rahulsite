import { YouTubeService } from '@/services/YouTubeService';

export async function GET() {
  try {
    return Response.json({ ok: true, data: await YouTubeService.getChannel() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ ok: false, error: 'Channel content is temporarily unavailable.' }, { status: 503 });
  }
}