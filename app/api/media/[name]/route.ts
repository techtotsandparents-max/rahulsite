import { Readable } from 'node:stream';
import { AzureStorageClient } from '@/lib/azure/storage';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]{0,300}\.(jpg|jpeg|png|webp|mp4)$/i.test(name)) return new Response(null, { status: 404 });
  try {
    const blob = await AzureStorageClient.getBlob(name);
    const properties = await blob.getProperties();
    const size = properties.contentLength ?? 0;
    const range = request.headers.get('range');
    let start = 0;
    let end = size - 1;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
      if (match[1]) { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), end) : end; }
      else { start = Math.max(0, size - Number(match[2])); }
      if (start > end || start < 0 || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }
    const download = await blob.download(start, end - start + 1);
    if (!download.readableStreamBody) return new Response(null, { status: 404 });
    const headers = new Headers({
      'Content-Type': properties.contentType || 'application/octet-stream',
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    });
    if (range) headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    if (properties.etag) headers.set('ETag', properties.etag);
    return new Response(Readable.toWeb(download.readableStreamBody as Readable) as ReadableStream, { status: range ? 206 : 200, headers });
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    return new Response(null, { status: status === 404 ? 404 : 503 });
  }
}