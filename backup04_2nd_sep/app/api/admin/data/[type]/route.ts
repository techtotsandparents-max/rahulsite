import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { adventures: [], blogs: [], projects: [] };
  }
}

function writeData(data: object) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function isAuthenticated(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const data = readData();
  const collection = data[type as keyof typeof data] || [];
  return NextResponse.json({ ok: true, data: collection });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { type } = await params;
  const body = await req.json();
  const data = readData();
  if (!data[type as keyof typeof data]) {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  }
  // Generate id if not present
  const newItem = { ...body, id: body.id || `${type}-${Date.now()}` };
  (data[type as keyof typeof data] as object[]).push(newItem);
  writeData(data);
  return NextResponse.json({ ok: true, data: newItem });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { type } = await params;
  const body = await req.json();
  const data = readData();
  const collection = data[type as keyof typeof data] as Array<{ id: string }>;
  if (!collection) return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  const idx = collection.findIndex((item) => item.id === body.id);
  if (idx === -1) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  collection[idx] = { ...collection[idx], ...body };
  writeData(data);
  return NextResponse.json({ ok: true, data: collection[idx] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { type } = await params;
  const { id } = await req.json();
  const data = readData();
  const collection = data[type as keyof typeof data] as Array<{ id: string }>;
  if (!collection) return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
  data[type as keyof typeof data] = collection.filter((item) => item.id !== id) as never;
  writeData(data);
  return NextResponse.json({ ok: true });
}
