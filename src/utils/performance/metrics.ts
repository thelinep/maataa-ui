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

// Web Vitals tracking
export function trackWebVitals(): void {
  if ('PerformanceObserver' in window) {
    // Track Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Track Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}
