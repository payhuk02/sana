import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour throttler une valeur
 * @param value - La valeur à throttler
 * @param delay - Le délai en millisecondes (défaut: 300ms)
 * @returns La valeur throttlée
 */
export function useThrottle<T>(value: T, delay: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

