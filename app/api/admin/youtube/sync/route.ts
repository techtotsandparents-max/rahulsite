import { getAdminSession } from '@/lib/auth';
import { YouTubeService } from '@/services/YouTubeService';
import { z } from 'zod';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session?.user?.isAdmin) return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const parsed = z.object({ channel: z.string().trim().min(1).max(500) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: 'Enter a channel URL, handle, or ID.' }, { status: 400 });
  try {
    return Response.json({ ok: true, data: await YouTubeService.sync(parsed.data.channel) });
  } catch (failure) {
    return Response.json({ ok: false, error: failure instanceof Error ? failure.message : 'Channel sync failed.' }, { status: 502 });
  }
}