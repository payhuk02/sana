import { useEffect, useRef } from 'react';

/**
 * Hook pour créer un AbortController avec cleanup automatique
 * Utile pour annuler les requêtes fetch en cours lors du démontage
 */
export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      // Annuler toutes les requêtes en cours lors du démontage
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const getSignal = () => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    return abortControllerRef.current.signal;
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
    }
  };

  return { signal: getSignal(), abort };
}

