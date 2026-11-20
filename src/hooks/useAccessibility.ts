/**
 * useAccessibility Hook
 * Phase I Day 3: Advanced Accessibility
 * 
 * Custom hook for accessibility patterns
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  trapFocus,
  getFocusableElements,
  getNextFocusableElement,
  getPreviousFocusableElement,
  announceToScreenReader,
  generateId,
} from '../utils/accessibility';

/**
 * Focus management hook
 */
export function useFocusManagement(containerRef: React.RefObject<HTMLElement>) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store element that had focus before
    previousFocusRef.current = document.activeElement as HTMLElement;

    return () => {
      // Restore focus when component unmounts
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;

    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }, [containerRef]);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;

    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus();
    }
  }, [containerRef]);

  return { focusFirst, focusLast, previousFocusRef };
}

/**
 * Keyboard navigation hook
 */
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options?: {
    onEscape?: () => void;
    onEnter?: () => void;
    trapFocus?: boolean;
  }
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      // Handle Escape
      if (event.key === 'Escape' && options?.onEscape) {
        event.preventDefault();
        options.onEscape();
      }

      // Handle Enter
      if (event.key === 'Enter' && options?.onEnter) {
        event.preventDefault();
        options.onEnter();
      }

      // Trap focus in container
      if (options?.trapFocus && event.key === 'Tab') {
        trapFocus(event, containerRef.current);
      }

      // Arrow key navigation
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        const activeElement = document.activeElement as HTMLElement;
        const nextElement = getNextFocusableElement(activeElement, containerRef.current);
        if (nextElement) {
          event.preventDefault();
          nextElement.focus();
        }
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        const activeElement = document.activeElement as HTMLElement;
        const prevElement = getPreviousFocusableElement(activeElement, containerRef.current);
        if (prevElement) {
          event.preventDefault();
          prevElement.focus();
        }
      }
    },
    [containerRef, options]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown]);
}

/**
 * Screen reader announcements hook
 */
export function useAriaAnnouncements() {
  const announceSuccess = useCallback((message: string) => {
    announceToScreenReader(`Success: ${message}`, 'polite');
  }, []);

  const announceError = useCallback((message: string) => {
    announceToScreenReader(`Error: ${message}`, 'assertive');
  }, []);

  const announceWarning = useCallback((message: string) => {
    announceToScreenReader(`Warning: ${message}`, 'polite');
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  return { announce, announceSuccess, announceError, announceWarning };
}

/**
 * Accessible labels hook
 */
export function useAccessibilityLabels() {
  const generateAriaLabel = useCallback((text: string, context?: string): string => {
    let label = text;
    if (context) label += ` (${context})`;
    return label;
  }, []);

  const generateAriaDescribedBy = useCallback((prefix: string): string => {
    return `${prefix}-description-${generateId()}`;
  }, []);

  const generateAriaLabelledBy = useCallback((prefix: string): string => {
    return `${prefix}-label-${generateId()}`;
  }, []);

  return { generateAriaLabel, generateAriaDescribedBy, generateAriaLabelledBy };
}

/**
 * Combine all accessibility hooks
 */
export function useAccessibility(
  containerRef: React.RefObject<HTMLElement>,
  options?: {
    onEscape?: () => void;
    onEnter?: () => void;
    trapFocus?: boolean;
  }
) {
  const focusManagement = useFocusManagement(containerRef);
  useKeyboardNavigation(containerRef, options);
  const announcements = useAriaAnnouncements();
  const labels = useAccessibilityLabels();

  return {
    ...focusManagement,
    ...announcements,
    ...labels,
  };
}

export default useAccessibility;
