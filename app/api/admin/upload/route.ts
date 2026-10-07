import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { MediaService } from '@/services/MediaService';

export async function POST(request: NextRequest) {
  // 1. Auth & Route Level validations
  const session = await getAdminSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (Number(request.headers.get('content-length')) > 101 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: 'Upload exceeds the 100MB limit.' }, { status: 413 });
  }
  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
  }

  // 2. Delegate to the Business Logic Service
  try {
    const uploadResult = await MediaService.processAndUploadFile(file);
    return NextResponse.json({ ok: true, ...uploadResult });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'An error occurred during upload' },
      { status: 400 }
    );
  }
}
