/**
 * Live Region Component
 * Phase I Day 3: Advanced Accessibility
 * 
 * Announce dynamic content changes to screen readers
 */

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ScreenReaderOnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  relevant?: React.AriaAttributes['aria-relevant'];
  delay?: number;
  children?: React.ReactNode;
}

/**
 * Live Region Component
 * Announces content changes to assistive technologies
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  atomic = true,
  relevant = 'additions text',
  delay = 0,
  children,
}) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!liveRegionRef.current || !message) return;

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set message after delay
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message;
        }
      }, delay);
    } else {
      liveRegionRef.current.textContent = message;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, delay]);

  return (
    <>
      <ScreenReaderOnly
        ref={liveRegionRef}
        role="status"
        aria-live={priority}
        aria-atomic={atomic}
        aria-relevant={relevant}
      >
        {message}
      </ScreenReaderOnly>
      {children}
    </>
  );
};

export default LiveRegion;
