import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  fallbackSrc?: string;
}

/**
 * Hook pour lazy load des images avec Intersection Observer
 */
export function useLazyLoad(
  src: string,
  options: UseLazyLoadOptions = {}
): [string, boolean, React.RefObject<HTMLImageElement>] {
  const { threshold = 0, rootMargin = '50px', fallbackSrc } = options;
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver<HTMLImageElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
        setIsLoaded(true);
      };
    }
  }, [isIntersecting, src, isLoaded, fallbackSrc]);

  return [imageSrc, isLoaded, ref];
}

