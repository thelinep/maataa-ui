import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWebVitals, trackWebVitals } from './metrics';

type Listener = (list: { getEntries: () => PerformanceEntry[] }) => void;
const observers = new Map<string, Listener>();

class FakeObserver {
  constructor(private readonly cb: Listener) {}
  observe(init: { type: string }) {
    observers.set(init.type, this.cb);
  }
  disconnect() {}
}

const emit = (type: string, entries: Array<Record<string, unknown>>) =>
  observers.get(type)?.({ getEntries: () => entries as unknown as PerformanceEntry[] });

function hidePage() {
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  observers.clear();
  vi.stubGlobal('PerformanceObserver', FakeObserver);
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete window.__analyticsQueue;
});

describe('trackWebVitals', () => {
  it('collects LCP, session-windowed CLS and INP, and reports once when hidden', () => {
    const onReport = vi.fn();
    window.__analyticsQueue = [];
    const stop = trackWebVitals({ onReport });

    emit('largest-contentful-paint', [{ startTime: 900, renderTime: 1200.4 }, { startTime: 1500, renderTime: 1820.6 }]);
    // window 1: 0.05 + 0.04 (1 s apart at most); window 2 after a 2 s gap: 0.02; input-driven shift ignored
    emit('layout-shift', [
      { startTime: 1000, value: 0.05, hadRecentInput: false },
      { startTime: 1500, value: 0.04, hadRecentInput: false },
      { startTime: 1600, value: 0.5, hadRecentInput: true },
      { startTime: 3600, value: 0.02, hadRecentInput: false },
    ]);
    emit('event', [
      { interactionId: 1, duration: 96 },
      { interactionId: 0, duration: 500 },
      { interactionId: 2, duration: 184 },
    ]);

    expect(getWebVitals()).toMatchObject({ lcp: 1821, cls: 0.09, inp: 184 });

    hidePage();
    hidePage();
    expect(onReport).toHaveBeenCalledTimes(1);
    expect(onReport.mock.calls[0][0]).toMatchObject({ lcp: 1821, cls: 0.09, inp: 184 });
    expect(window.__analyticsQueue).toEqual([expect.objectContaining({ event: 'web_vitals', lcp: 1821 })]);
    stop();
  });

  it('does nothing without PerformanceObserver', () => {
    vi.stubGlobal('PerformanceObserver', undefined);
    // @ts-expect-error simulate an old browser
    delete window.PerformanceObserver;
    const stop = trackWebVitals();
    expect(getWebVitals()).toEqual({});
    stop();
  });
});
