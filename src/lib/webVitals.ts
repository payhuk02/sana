/**
 * Utilitaires pour mesurer et optimiser les Web Vitals
 * Core Web Vitals: LCP, FID, CLS
 */

interface Metric {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

type ReportCallback = (metric: Metric) => void;

/**
 * Mesure les Core Web Vitals
 */
export function measureWebVitals(onPerfEntry?: ReportCallback) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime?: number;
        loadTime?: number;
      };
      
      onPerfEntry({
        name: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime || 0,
        delta: lastEntry.renderTime || lastEntry.loadTime || 0,
        id: lastEntry.name,
        rating: getLCPRating(lastEntry.renderTime || lastEntry.loadTime || 0),
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        onPerfEntry({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          delta: entry.processingStart - entry.startTime,
          id: entry.name,
          rating: getFIDRating(entry.processingStart - entry.startTime),
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      onPerfEntry({
        name: 'CLS',
        value: clsValue,
        delta: clsValue,
        id: 'cls',
        rating: getCLSRating(clsValue),
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Obtenir le rating LCP
 */
function getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
}

/**
 * Obtenir le rating FID
 */
function getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 100) return 'good';
  if (value <= 300) return 'needs-improvement';
  return 'poor';
}

/**
 * Obtenir le rating CLS
 */
function getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
}

/**
 * Logger les Web Vitals (pour développement)
 */
export function logWebVitals(metric: Metric) {
  if (import.meta.env.DEV) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }
  
  // En production, envoyer à un service d'analytics
  if (import.meta.env.PROD) {
    // Exemple: envoyer à Google Analytics, Sentry, etc.
    // gtag('event', metric.name, { value: metric.value, rating: metric.rating });
  }
}

