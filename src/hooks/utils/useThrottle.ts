/**
 * useThrottle Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Throttle callback execution
 */

import { useCallback, useRef } from 'react';

/**
 * useThrottle Hook
 * Throttle a callback to execute at most once per delay
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRunRef = useRef(Date.now());

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();
      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;
}

export default useThrottle;
