import { AzureStorageClient } from '@/lib/azure/storage';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'node:crypto';

const ALLOWED_PREFIXES = ['image/', 'video/'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'mp4'];
const MAX_IMAGE_SIZE_MB = 20;
const MAX_VIDEO_SIZE_MB = 100;

/**
 * The Service layer is your app's "Business Logic".
 * It is completely independent of the Next.js API route request/response.
 * If you ever need to use this upload logic from a Cron job or a different 
 * entry point, you can just call MediaService without mocking HTTP requests.
 */
export class MediaService {
  private static isAllowedFileType(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const isAllowedExtension = ALLOWED_EXTENSIONS.includes(extension);
    const isAllowedMime = ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix));

    return isAllowedExtension && isAllowedMime;
  }

  private static getMaxSizeBytes(file: File) {
    if (file.type.startsWith('video/')) {
      return MAX_VIDEO_SIZE_MB * 1024 * 1024;
    }
    return MAX_IMAGE_SIZE_MB * 1024 * 1024;
  }

  public static async processAndUploadFile(file: File) {
    if (!this.isAllowedFileType(file)) {
      throw new Error('Invalid file type. Allowed: JPG, JPEG, PNG, WebP, MP4.');
    }

    if (file.size > this.getMaxSizeBytes(file)) {
      const sizeLimit = file.type.startsWith('video/') ? `${MAX_VIDEO_SIZE_MB}MB` : `${MAX_IMAGE_SIZE_MB}MB`;
      throw new Error(`File too large. Max ${sizeLimit}.`);
    }

    // 1. Prepare data
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const data = await file.arrayBuffer();
    const detected = await fileTypeFromBuffer(data);
    if (!detected || !['image/jpeg', 'image/png', 'image/webp', 'video/mp4'].includes(detected.mime) || detected.mime !== file.type) {
      throw new Error('The file contents do not match a supported image or MP4 video.');
    }
    const blobName = `${randomUUID()}-${safeName}`;

    // 2. Delegate to Infrastructure Client (Azure)
    const { url } = await AzureStorageClient.uploadBlob(
      Buffer.from(data),
      blobName,
      detected.mime
    );

    // 3. Return normalized result
    return {
      url,
      blobName,
      size: file.size,
      mimeType: file.type,
    };
  }
}
