/**
 * Utilitaires pour optimiser les performances
 */

/**
 * Prefetch une ressource (route, image, etc.)
 */
export function prefetchResource(href: string, as: 'script' | 'style' | 'image' | 'font' | 'fetch' = 'fetch') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Preload une ressource critique
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font' | 'fetch', crossorigin?: boolean) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Lazy load une image avec Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  if (!('IntersectionObserver' in window)) {
    // Fallback pour les navigateurs sans support
    img.src = src;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px', // Commencer à charger 50px avant que l'image soit visible
  });

  observer.observe(img);
}

/**
 * Mesurer les performances d'une fonction
 */
export function measurePerformance<T>(fn: () => T, label: string): T {
  if (import.meta.env.DEV && 'performance' in window) {
    performance.mark(`${label}-start`);
    const result = fn();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    const measure = performance.getEntriesByName(label)[0];
    console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Debounce une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle une fonction
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

