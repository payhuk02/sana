import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  sizes?: string;
  srcSet?: string;
  width?: number;
  height?: number;
}

/**
 * Composant d'image optimisé avec support srcset et sizes
 * Pour une meilleure performance et responsive images
 */
export function ImageOptimized({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackSrc,
  sizes,
  srcSet,
  width,
  height,
}: ImageOptimizedProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Réinitialiser quand src change
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
        setHasError(false);
      } else {
        // Placeholder SVG encodé en base64
        setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=');
      }
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Si erreur avec placeholder SVG
  if (hasError && imgSrc.startsWith('data:image/svg+xml')) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        <ImageOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  // Image avec srcset et sizes pour responsive
  return (
    <div className={`${className} relative ${isLoading ? 'bg-muted animate-pulse' : ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
    </div>
  );
}

