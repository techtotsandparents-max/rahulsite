import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/services/DataService';
import { getAdminSession } from '@/lib/auth';
import { contentSchemas, type ContentType } from '@/lib/content';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  // Defense-in-depth: verify admin session even though middleware guards this route
  const session = await getAdminSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;

  if (!DataService.isSupportedDataType(type)) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const schema = contentSchemas[type as ContentType];
  const parsed = schema?.safeParse(body);
  if (schema && !parsed?.success) {
    return NextResponse.json({ ok: false, error: parsed?.error?.issues[0]?.message ?? 'Invalid content' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'Invalid content' }, { status: 400 });
  }
  const update = { ...(parsed?.success ? parsed.data : body), id, updatedAt: new Date().toISOString() };
  delete update._id;
  delete update.createdAt;

  try {
    const items = await DataService.listItems(type);
    if (update.slug && items.some((item) => item.id !== id && item.slug === update.slug)) {
      return NextResponse.json({ ok: false, error: 'This slug already exists.' }, { status: 409 });
    }
    const updated = await DataService.updateItem(type, id, update);
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: updated });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Database update failed. Ensure Cosmos DB is configured.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  // Defense-in-depth: verify admin session even though middleware guards this route
  const session = await getAdminSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;

  if (!DataService.isSupportedDataType(type)) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }

  try {
    const deleted = await DataService.deleteItem(type, id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Database delete failed. Ensure Cosmos DB is configured.' },
      { status: 500 }
    );
  }
}
