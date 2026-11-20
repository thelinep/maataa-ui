/**
 * Focus Trap Component
 * Phase I Day 3: Advanced Accessibility
 * 
 * Trap focus within a container (modals, dialogs, popovers)
 */

import React, { useRef, useEffect } from 'react';
import { useFocusManagement, useKeyboardNavigation } from '../../hooks/useAccessibility';

interface FocusTrapProps {
  children: React.ReactNode;
  onEscape?: () => void;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
}

/**
 * Focus Trap Component
 * Automatically traps focus within children and restores on unmount
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  onEscape,
  initialFocus,
  finalFocus,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusFirst, previousFocusRef } = useFocusManagement(containerRef);

  useKeyboardNavigation(containerRef, {
    onEscape,
    trapFocus: true,
  });

  useEffect(() => {
    // Focus initial element or first focusable
    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else {
      focusFirst();
    }
  }, [focusFirst, initialFocus]);

  useEffect(() => {
    return () => {
      // Restore focus to final focus or previous focus
      if (finalFocus?.current) {
        finalFocus.current.focus();
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [finalFocus, previousFocusRef]);

  return <div ref={containerRef}>{children}</div>;
};

export default FocusTrap;
