import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour gérer localStorage avec debounce automatique
 * Évite les écritures excessives dans localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs: number = 500
): [T, (value: T | ((val: T) => T)) => void] {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Timeout pour debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à value d'être une fonction pour avoir la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Mettre à jour l'état immédiatement
      setStoredValue(valueToStore);

      // Debounce l'écriture dans localStorage
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }, debounceMs);
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  };

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [storedValue, setValue];
}

