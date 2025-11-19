import * as React from "react";
import { useMediaQuery } from "./useMediaQuery";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook optimisé pour détecter si on est sur mobile
 * Utilise useMediaQuery pour meilleure performance et cleanup automatique
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}
