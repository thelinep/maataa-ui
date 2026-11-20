/**
 * useToast Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Manage toast notifications
 */

import { useState, useCallback, useRef } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface UseToastState {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastIdCounter = 0;

/**
 * useToast Hook
 * Manage a queue of toast notifications
 */
export function useToast(): UseToastState {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const id = `toast-${++toastIdCounter}-${Date.now()}`;
      const toast: Toast = { id, message, type, duration };

      setToasts(prev => [...prev, toast]);

      if (duration > 0) {
        const timeout = setTimeout(() => {
          removeToast(id);
        }, duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));

    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  return { toasts, addToast, removeToast, clearToasts };
}

export default useToast;
