/**
 * File upload utilities for handling investor file uploads
 */

import { mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { join } from 'path';

export interface FileUploadResult {
  filePath: string;
  fileOriginalName: string;
  fileSize: number;
  mimeType: string;
}

export interface UploadConfig {
  uploadDir?: string;
  maxPathLength?: number;
}

/**
 * Convert Web ReadableStream to Node.js Readable stream
 * Web File API returns ReadableStream, but Node.js pipeline expects Readable
 */
function webStreamToNodeStream(webStream: ReadableStream): Readable {
  const reader = webStream.getReader();

  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (error) {
        this.destroy(error as Error);
      }
    },
  });
}

/**
 * Sanitize filename by replacing non-alphanumeric characters
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * Generate unique filename with timestamp and random suffix
 */
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = sanitizeFilename(originalFilename);
  return `${timestamp}-${randomSuffix}-${sanitizedFilename}`;
}

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDirectory(
  uploadDir: string
): Promise<string> {
  const uploadPath = join(process.cwd(), uploadDir);

  try {
    await mkdir(uploadPath, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw new Error('Failed to create upload directory');
  }

  return uploadPath;
}

/**
 * Save a single file to disk using streaming
 * Uses streaming instead of loading entire file into memory for better performance
 * and to avoid memory issues with large files or concurrent uploads (critical for serverless)
 */
async function saveFileToDisk(
  file: File,
  uploadPath: string,
  filename: string
): Promise<void> {
  const filePath = join(uploadPath, filename);

  // Convert Web ReadableStream to Node.js Readable stream
  const webStream = file.stream();
  const nodeStream = webStreamToNodeStream(webStream);
  const writeStream = createWriteStream(filePath);

  // Stream file directly to disk with automatic cleanup
  await pipeline(nodeStream, writeStream);
}

/**
 * Upload multiple files and return metadata
 */
export async function uploadFiles(
  files: File[],
  config: UploadConfig = {}
): Promise<FileUploadResult[]> {
  const uploadDir = config.uploadDir || process.env.UPLOAD_DIR || './uploads';
  const maxPathLength = config.maxPathLength || 500;

  // Ensure upload directory exists
  const uploadPath = await ensureUploadDirectory(uploadDir);

  // Process each file
  const fileDataArray: FileUploadResult[] = [];

  for (const file of files) {
    const uniqueFilename = generateUniqueFilename(file.name);
    const dbFilePath = `${uploadDir}/${uniqueFilename}`;

    // Validate file path length (database limit)
    if (dbFilePath.length > maxPathLength) {
      throw new Error(
        `File name "${file.name}" results in a path that is too long. Please use a shorter filename.`
      );
    }

    // Save file to disk
    await saveFileToDisk(file, uploadPath, uniqueFilename);

    // Collect file metadata
    fileDataArray.push({
      filePath: dbFilePath,
      fileOriginalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  }

  return fileDataArray;
}


