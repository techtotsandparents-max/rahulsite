import { NextRequest, NextResponse } from 'next/server';
import { deleteItem, isSupportedDataType, updateItem } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  if (!isSupportedDataType(type)) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }

  const body = await request.json();

  try {
    const updated = await updateItem(type, id, body);
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
  const { type, id } = await params;

  if (!isSupportedDataType(type)) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }

  try {
    const deleted = await deleteItem(type, id);
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
