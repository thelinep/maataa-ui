/**
 * usePrevious Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Store previous value
 */

import { useEffect, useRef } from 'react';

/**
 * usePrevious Hook
 * Get the previous value of a variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
