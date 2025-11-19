import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour prefetch les routes probables
 * Améliore la navigation en préchargeant les routes au hover
 */
export function usePrefetch() {
  const location = useLocation();
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Prefetch les routes probables après un délai
    const timer = setTimeout(() => {
      const routesToPrefetch = [
        '/categories',
        '/cart',
        '/about',
        '/contact',
      ];

      routesToPrefetch.forEach((route) => {
        if (!prefetchedRoutes.current.has(route) && route !== location.pathname) {
          // Prefetch avec link prefetch (plus simple et fiable)
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          link.as = 'document';
          document.head.appendChild(link);
          prefetchedRoutes.current.add(route);
        }
      });
    }, 2000); // Attendre 2s après le chargement initial

    return () => clearTimeout(timer);
  }, [location.pathname]);
}

/**
 * Prefetch une route spécifique
 */
export function prefetchRoute(route: string) {
  if (typeof window === 'undefined') return;
  
  // Utiliser link prefetch pour les routes
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  link.as = 'document';
  document.head.appendChild(link);
}

