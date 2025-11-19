import { useEffect } from 'react';
import { usePrefetch } from '@/hooks/usePrefetch';

/**
 * Provider pour activer le prefetch des routes
 */
export function PrefetchProvider({ children }: { children: React.ReactNode }) {
  usePrefetch();
  return <>{children}</>;
}

