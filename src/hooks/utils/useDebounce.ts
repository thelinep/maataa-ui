/**
 * useDebounce Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Debounce values
 */

import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Debounce a value with a delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
