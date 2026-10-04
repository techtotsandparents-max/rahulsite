import { NextRequest, NextResponse } from 'next/server';
import {
  createItem,
  isDatabaseConfigured,
  isSupportedDataType,
  listItems,
} from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import {
  adventureFixtures,
  blogFixtures,
  projectFixtures,
  videoFixtures,
} from '@/lib/fixtures';

const fixtureMap = {
  blogs: blogFixtures,
  adventures: adventureFixtures,
  projects: projectFixtures,
  videos: videoFixtures,
  settings: [],
};

function normalizePayload(type: 'blogs' | 'adventures' | 'projects' | 'videos' | 'settings', payload: Record<string, unknown>) {
  const now = new Date().toISOString();
  return {
    ...payload,
    id: typeof payload.id === 'string' && payload.id ? payload.id : `${type}-${Date.now()}`,
    createdAt: payload.createdAt ?? now,
    updatedAt: now,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!isSupportedDataType(type)) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, data: fixtureMap[type], source: 'fixtures', isPlaceholder: true });
  }

  try {
    const data = await listItems(type);
    return NextResponse.json({ ok: true, data, source: 'cosmos' });
  } catch {
    return NextResponse.json({ ok: true, data: fixtureMap[type], source: 'fixtures', isPlaceholder: true });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  // Defense-in-depth: verify admin session even though middleware guards this route
  const session = await getAdminSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await params;

  if (!isSupportedDataType(type)) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Database not configured. Set Cosmos DB environment variables.' },
      { status: 500 }
    );
  }

  const body = await request.json();
  const created = normalizePayload(type, body);

  try {
    const data = await createItem(type, created);
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Database insert failed. Check Cosmos DB connectivity.' },
      { status: 500 }
    );
  }
}
