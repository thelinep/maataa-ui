/**
 * useModal Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Handle modal open/close state
 */

import { useState, useCallback } from 'react';

export interface UseModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * useModal Hook
 * Manage modal visibility state
 */
export function useModal(initialOpen = false): UseModalState {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}

export default useModal;
