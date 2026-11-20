/**
 * useAsync Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Handle async operations with loading/error state
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
  execute: () => Promise<T>;
}

/**
 * useAsync Hook
 * Execute async functions with automatic state management
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncState<T> {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      if (isMountedRef.current) {
        setData(response);
        setStatus('success');
      }
      return response;
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus('error');
      }
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    isMountedRef.current = true;
    if (immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [execute, immediate]);

  return { status, data, error, execute };
}

export default useAsync;
