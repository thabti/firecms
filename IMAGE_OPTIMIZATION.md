# Image Optimization Guide

FireCMS includes comprehensive image optimization features to ensure fast page loads and excellent user experience.

## Features

### 1. Client-Side Compression

Images are automatically compressed before upload using `browser-image-compression`:

- **Max size**: 2 MB (configurable)
- **Max dimensions**: 2048px (configurable)
- **Quality**: 80% (maintains good visual quality)
- **Format**: Converts to optimized JPEG

**Benefits:**
- Reduces upload time
- Saves bandwidth
- Shows real-time compression stats to users

### 2. Server-Side Processing

Once uploaded, Sharp processes images to create multiple optimized sizes:

**Generated Sizes:**
- **Thumbnail**: 300×300px (cover fit) - For previews and lists
- **Medium**: 800×800px (inside fit) - For most content displays
- **Large**: 1600×1600px (inside fit) - For high-res displays
- **Original**: Optimized original with auto-rotation

**Optimizations:**
- Auto-rotation based on EXIF data
- Progressive JPEG encoding
- Quality optimization (90% for original, 85% for resized)
- Maintains aspect ratios

### 3. Next.js Image Component

Public pages use Next.js `<Image>` component for:

- Automatic lazy loading
- Responsive images with srcset
- WebP format conversion (when supported)
- Blur placeholder generation
- Priority loading for above-the-fold images

## Configuration

### Adjust Compression Settings

Edit `/src/lib/image-utils.ts`:

```typescript
const compressedFile = await compressImage(file, {
  maxSizeMB: 2, // Maximum file size
  maxWidthOrHeight: 2048, // Max dimension
  initialQuality: 0.8, // Quality (0-1)
});
```

### Adjust Server-Side Sizes

Edit `/src/app/api/upload/route.ts`:

```typescript
const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 300, fit: "cover" as const },
  medium: { width: 800, height: 800, fit: "inside" as const },
  large: { width: 1600, height: 1600, fit: "inside" as const },
  // Add more sizes as needed
};
```

### Customize Next.js Image Behavior

Edit `/src/components/optimized-image.tsx`:

```typescript
<Image
  src={src}
  alt={block.alt}
  width={width}
  height={height}
  quality={85} // Add quality setting
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

## Usage in Code

### Upload API Response

When uploading an image, you receive:

```json
{
  "url": "https://firebase.storage/.../image.jpg",
  "urls": {
    "original": "https://firebase.storage/.../image.jpg",
    "thumbnail": "https://firebase.storage/.../image_thumbnail.jpg",
    "medium": "https://firebase.storage/.../image_medium.jpg",
    "large": "https://firebase.storage/.../image_large.jpg"
  },
  "filename": "1234567890-myimage",
  "originalSize": 2048000,
  "dimensions": {
    "width": 4000,
    "height": 3000
  }
}
```

### Using in Components

```typescript
// For display, use medium by default
<img src={block.urls?.medium || block.url} alt={block.alt} />

// For thumbnails
<img src={block.urls?.thumbnail || block.url} alt={block.alt} />

// For high-res displays
<img src={block.urls?.large || block.url} alt={block.alt} />
```

## Firebase Storage Structure

Images are organized in Firebase Storage:

```
/images
  ├── 1234567890-myimage.jpg         (original, optimized)
  ├── 1234567890-myimage_thumbnail.jpg
  ├── 1234567890-myimage_medium.jpg
  └── 1234567890-myimage_large.jpg
```

## Performance Tips

### 1. Use Appropriate Sizes

- **List views**: Use thumbnail (300px)
- **Content cards**: Use medium (800px)
- **Full-width images**: Use large (1600px)
- **Zoom/lightbox**: Use original

### 2. Enable Firebase CDN

Firebase Storage includes CDN by default. Ensure your storage bucket is configured correctly.

### 3. Set Cache Headers

Firebase Storage automatically sets appropriate cache headers. Images are cached for 1 hour by default.

### 4. Consider Firebase Extensions

For more advanced optimization, install the **Resize Images** Firebase Extension:

1. Go to Firebase Console → Extensions
2. Install "Resize Images"
3. Configure desired sizes
4. Images will be automatically processed on upload

### 5. Monitor Storage Usage

- Check Firebase Storage usage in console
- Set up storage rules to prevent abuse
- Consider lifecycle policies for old images

## Storage Rules

Add these rules to Firebase Storage for security:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{imageId} {
      // Allow read for all
      allow read;

      // Allow write only for authenticated users (when you add auth)
      allow write: if request.auth != null;

      // Validate file size (max 10MB)
      allow write: if request.resource.size < 10 * 1024 * 1024;

      // Validate file type
      allow write: if request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Troubleshooting

### Images not loading

1. Check Firebase Storage is enabled
2. Verify CORS settings in Firebase
3. Check storage rules allow read access
4. Verify `next.config.ts` includes Firebase domain in `remotePatterns`

### Compression not working

1. Check `browser-image-compression` is installed
2. Verify file type is supported (JPEG, PNG, WebP, GIF)
3. Check browser console for errors

### Sharp errors

1. Ensure Sharp is installed: `pnpm add sharp`
2. Restart dev server after installing Sharp
3. Check Sharp supports your image format

## Best Practices

1. **Always provide alt text** for accessibility
2. **Use descriptive filenames** before uploading
3. **Compress images** before uploading (automatic)
4. **Use appropriate sizes** for different contexts
5. **Enable lazy loading** for below-the-fold images
6. **Set priority** for above-the-fold images
7. **Monitor storage costs** in Firebase console

## Future Enhancements

Consider these improvements:

1. **WebP conversion** - Convert all images to WebP format
2. **AVIF support** - Next-gen format with better compression
3. **Image CDN** - Use Cloudinary or Imgix for advanced features
4. **AI-powered alt text** - Generate alt text automatically
5. **Smart cropping** - Detect faces/subjects for better thumbnails
6. **Metadata extraction** - Store EXIF data for photos
7. **Duplicate detection** - Prevent uploading same image twice
