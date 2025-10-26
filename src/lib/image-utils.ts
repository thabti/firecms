import imageCompression from "browser-image-compression";

export interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  initialQuality?: number;
}

/**
 * Compress an image file before uploading
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 1, // Maximum file size in MB
    maxWidthOrHeight: 2048, // Maximum width or height
    useWebWorker: true,
    initialQuality: 0.8,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Get image dimensions from a file
 * @param file - The image file
 * @returns Promise with width and height
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
}

/**
 * Validate image file type
 * @param file - The file to validate
 * @returns true if valid image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  return validTypes.includes(file.type);
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
