import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Image size configurations
const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 300, fit: "cover" as const },
  medium: { width: 800, height: 800, fit: "inside" as const },
  large: { width: 1600, height: 1600, fit: "inside" as const },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Generate unique filename without extension
    const timestamp = Date.now();
    const fileBaseName = file.name.replace(/\.[^/.]+$/, "");
    const baseFilename = `${timestamp}-${fileBaseName}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const originalFormat = metadata.format || "jpeg";

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "images");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Object to store all URLs
    const urls: Record<string, string> = {};

    // Upload original (optimized)
    const originalOptimized = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    const originalPath = join(uploadsDir, `${baseFilename}.${originalFormat}`);
    await writeFile(originalPath, originalOptimized);
    urls.original = `/uploads/images/${baseFilename}.${originalFormat}`;

    // Generate and upload optimized sizes
    for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      try {
        const resizedBuffer = await sharp(buffer)
          .rotate() // Auto-rotate based on EXIF
          .resize(sizeConfig.width, sizeConfig.height, {
            fit: sizeConfig.fit,
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();

        const sizePath = join(uploadsDir, `${baseFilename}_${sizeName}.jpg`);
        await writeFile(sizePath, resizedBuffer);
        urls[sizeName] = `/uploads/images/${baseFilename}_${sizeName}.jpg`;
      } catch (error) {
        console.error(`Error creating ${sizeName} size:`, error);
        // Continue with other sizes even if one fails
      }
    }

    return NextResponse.json({
      url: urls.original, // Default URL
      urls, // All available sizes
      filename: baseFilename,
      originalSize: file.size,
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
