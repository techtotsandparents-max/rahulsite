import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { getAdminSession } from '@/lib/auth';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const ALLOWED_PREFIXES = ['image/', 'video/'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'mp4'];
const MAX_IMAGE_SIZE_MB = 20;
const MAX_VIDEO_SIZE_MB = 100;

function isAllowedFileType(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const isAllowedExtension = ALLOWED_EXTENSIONS.includes(extension);
  const isAllowedMime = ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix));

  return isAllowedExtension && isAllowedMime;
}

function getMaxSizeBytes(file: File) {
  if (file.type.startsWith('video/')) {
    return MAX_VIDEO_SIZE_MB * 1024 * 1024;
  }
  return MAX_IMAGE_SIZE_MB * 1024 * 1024;
}

async function getStorageConnectionString(): Promise<string | undefined> {
  let connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const keyVaultUri = process.env.AZURE_KEYVAULT_URI;

  if (connectionString) return connectionString;
  if (!keyVaultUri) return undefined;

  try {
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUri, credential);
    const secret = await client.getSecret('storage-connection-string');
    return secret.value;
  } catch (error) {
    console.error('Failed to fetch Storage connection string from Key Vault:', error);
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const connectionString = await getStorageConnectionString();
  const containerName = process.env.AZURE_STORAGE_CONTAINER ?? 'uploads';
  const cdnBase = process.env.AZURE_STORAGE_CDN_URL;

  if (!connectionString) {
    return NextResponse.json({ ok: false, error: 'Storage is not configured' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
  }

  if (!isAllowedFileType(file)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid file type. Allowed: JPG, JPEG, PNG, WebP, MP4.' },
      { status: 400 }
    );
  }

  if (file.size > getMaxSizeBytes(file)) {
    const sizeLimit = file.type.startsWith('video/') ? `${MAX_VIDEO_SIZE_MB}MB` : `${MAX_IMAGE_SIZE_MB}MB`;
    return NextResponse.json({ ok: false, error: `File too large. Max ${sizeLimit}.` }, { status: 400 });
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  const blobName = `${Date.now()}-${safeName}`;
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const data = await file.arrayBuffer();
  await blobClient.uploadData(Buffer.from(data), {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });

  const url = cdnBase
    ? `${cdnBase.replace(/\/$/, '')}/${blobName}`
    : blobClient.url;

  return NextResponse.json({
    ok: true,
    url,
    blobName,
    size: file.size,
    mimeType: file.type,
  });
}
