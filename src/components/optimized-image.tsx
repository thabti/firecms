import Image from "next/image";
import type { ImageBlock } from "@/types";

interface OptimizedImageProps {
  block: ImageBlock;
  priority?: boolean;
  className?: string;
}

/**
 * OptimizedImage component that uses Next.js Image for automatic optimization
 * and responsive images with multiple sizes from local storage
 */
export function OptimizedImage({
  block,
  priority = false,
  className = "",
}: OptimizedImageProps) {
  // Use medium size by default, with fallback to original
  const src = block.urls?.medium || block.url;
  const { width = 800, height = 600 } = block.dimensions || {};

  return (
    <div className={`my-8 ${className}`}>
      <div className="relative w-full">
        <Image
          src={src}
          alt={block.alt}
          width={width}
          height={height}
          priority={priority}
          className="rounded-lg shadow-md w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      {block.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
}
