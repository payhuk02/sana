import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour utiliser les media queries
 * Plus performant que useIsMobile avec cleanup automatique
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Mettre à jour l'état initial
    setMatches(mediaQuery.matches);

    // Handler pour les changements
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Écouter les changements (moderne API)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    } else {
      // Fallback pour les anciens navigateurs
      mediaQuery.addListener(handler);
      return () => {
        mediaQuery.removeListener(handler);
      };
    }
  }, [query]);

  return matches;
}

