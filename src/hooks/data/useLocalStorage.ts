/**
 * useLocalStorage Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Persist state to localStorage
 */

import { useState, useCallback } from 'react';

export interface UseLocalStorageOptions {
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

/**
 * useLocalStorage Hook
 * Manage state with localStorage persistence
 */
export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: UseLocalStorageOptions
): [T | undefined, (value: T) => void, () => void] {
  const [state, setState] = useState<T | undefined>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;

      const stored = window.localStorage.getItem(key);
      if (stored) {
        return options?.deserialize?.(stored) ?? JSON.parse(stored);
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setState(value);
        if (typeof window !== 'undefined') {
          const serialized = options?.serialize?.(value) ?? JSON.stringify(value);
          window.localStorage.setItem(key, serialized);
        }
      } catch (err) {
        console.error('localStorage error:', err);
      }
    },
    [key, options]
  );

  const removeValue = useCallback(() => {
    try {
      setState(undefined);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error('localStorage error:', err);
    }
  }, [key]);

  return [state, setValue, removeValue];
}

export default useLocalStorage;
