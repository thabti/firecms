import { NextRequest, NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import sharp from "sharp";

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

    // Object to store all URLs
    const urls: Record<string, string> = {};

    // Upload original (optimized)
    const originalOptimized = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    const originalRef = ref(
      storage,
      `images/${baseFilename}.${originalFormat}`
    );
    await uploadBytes(originalRef, originalOptimized, {
      contentType: `image/${originalFormat}`,
    });
    urls.original = await getDownloadURL(originalRef);

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

        const sizeRef = ref(
          storage,
          `images/${baseFilename}_${sizeName}.jpg`
        );
        await uploadBytes(sizeRef, resizedBuffer, {
          contentType: "image/jpeg",
        });
        urls[sizeName] = await getDownloadURL(sizeRef);
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
