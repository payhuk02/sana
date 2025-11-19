import { useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour gérer les event listeners avec cleanup automatique
 * Évite les memory leaks et simplifie la gestion des listeners
 */
export function useEventListener<T extends keyof WindowEventMap>(
  eventName: T,
  handler: (event: WindowEventMap[T]) => void,
  element: Window | Document | HTMLElement | null = typeof window !== 'undefined' ? window : null,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef<(event: WindowEventMap[T]) => void>();

  // Mettre à jour la référence du handler si elle change
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element || window;
    if (!targetElement || !targetElement.addEventListener) {
      return;
    }

    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[T]);
      }
    };

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

