// Performance monitoring utilities

export interface PerformanceMetrics {
  pageLoadTime: number;
  interactiveTime: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToFirstByte: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};

  measure(name: string, fn: () => void): number {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    return measure.duration;
  }

  async measureAsync(name: string, fn: () => Promise<void>): Promise<number> {
    performance.mark(`${name}-start`);
    await fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    return measure.duration;
  }

  getMetrics(): PerformanceMetrics {
    if ('PerformanceObserver' in window) {
      // Collect web vitals
      const entries = performance.getEntries();
      const navigationTiming = entries.find(e => e.entryType === 'navigation') as PerformanceNavigationTiming;
      
      this.metrics.timeToFirstByte = navigationTiming?.responseStart || 0;
      this.metrics.pageLoadTime = navigationTiming?.loadEventEnd || 0;
      this.metrics.interactiveTime = navigationTiming?.domInteractive || 0;
    }
    
    return this.metrics as PerformanceMetrics;
  }

  report(): void {
    const metrics = this.getMetrics();
    console.table(metrics);
    
    // Send to analytics if configured
    if (typeof window !== 'undefined' && window.__analyticsQueue) {
      window.__analyticsQueue.push({
        event: 'performance_metrics',
        metrics
      });
    }
  }

  clear(): void {
    performance.clearMarks();
    performance.clearMeasures();
    this.metrics = {};
  }
}

export const performanceMonitor = new PerformanceMonitor();

/** LargestContentfulPaint entry fields (not yet in TS's DOM lib) */
interface LCPEntry extends PerformanceEntry {
  renderTime?: number;
  loadTime?: number;
}

declare global {
  interface Window {
    __analyticsQueue?: Array<Record<string, unknown>>;
  }
}

/** Core Web Vitals for one page view. Times in milliseconds; CLS has no unit. */
export interface WebVitals {
  /** Largest Contentful Paint */
  lcp?: number;
  /** Cumulative Layout Shift (largest session window) */
  cls?: number;
  /** Interaction to Next Paint (slowest interaction seen) */
  inp?: number;
  /** Time to First Byte */
  ttfb?: number;
}

export interface TrackWebVitalsOptions {
  /** Called once when the page is hidden (tab switch, close, navigation away). */
  onReport?: (vitals: WebVitals) => void;
  /** Also print the values with console.info (stripped from the performance build). @default false */
  debug?: boolean;
}

let latestVitals: WebVitals = {};

/** The values collected so far in this page view. */
export function getWebVitals(): WebVitals {
  return { ...latestVitals };
}

/**
 * Starts collecting Core Web Vitals. Reports once when the page is hidden:
 * to `onReport`, and as a `web_vitals` event on `window.__analyticsQueue`
 * if the app has one. Returns a function that stops collecting.
 */
export function trackWebVitals(options: TrackWebVitalsOptions = {}): () => void {
  latestVitals = {};
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return () => undefined;
  const debug = options.debug ?? false;
  const observers: PerformanceObserver[] = [];
  const watch = (type: string, onEntries: (entries: PerformanceEntry[]) => void, extra: Record<string, unknown> = {}) => {
    try {
      const observer = new PerformanceObserver((list) => onEntries(list.getEntries()));
      observer.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
      observers.push(observer);
    } catch {
      // This browser doesn't support this entry type; skip it.
    }
  };

  const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav) latestVitals.ttfb = Math.round(nav.responseStart);

  watch('largest-contentful-paint', (entries) => {
    const last = entries[entries.length - 1] as LCPEntry | undefined;
    if (last) latestVitals.lcp = Math.round(last.renderTime || last.loadTime || last.startTime);
  });

  // CLS: shifts without recent input, grouped into session windows (gap < 1 s, window < 5 s); keep the largest.
  let session = 0;
  let sessionStart = 0;
  let lastShift = 0;
  watch('layout-shift', (entries) => {
    for (const entry of entries as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
      if (entry.hadRecentInput) continue;
      if (session && entry.startTime - lastShift < 1000 && entry.startTime - sessionStart < 5000) {
        session += entry.value;
      } else {
        session = entry.value;
        sessionStart = entry.startTime;
      }
      lastShift = entry.startTime;
      latestVitals.cls = Math.max(latestVitals.cls ?? 0, Number(session.toFixed(4)));
    }
  });

  watch(
    'event',
    (entries) => {
      for (const entry of entries as Array<PerformanceEntry & { interactionId?: number }>) {
        if (!entry.interactionId) continue;
        latestVitals.inp = Math.max(latestVitals.inp ?? 0, Math.round(entry.duration));
      }
    },
    { durationThreshold: 40 }
  );

  let reported = false;
  const report = () => {
    if (reported || document.visibilityState !== 'hidden') return;
    reported = true;
    const vitals = getWebVitals();
    options.onReport?.(vitals);
    window.__analyticsQueue?.push({ event: 'web_vitals', ...vitals });
    if (debug) console.info('Web Vitals', vitals);
  };
  document.addEventListener('visibilitychange', report);

  return () => {
    observers.forEach((o) => o.disconnect());
    document.removeEventListener('visibilitychange', report);
  };
}
