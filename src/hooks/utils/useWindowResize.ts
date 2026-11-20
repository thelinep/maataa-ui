/**
 * useWindowResize Hook
 * Phase I Day 4: Custom Hooks Library
 * 
 * Track window size changes
 */

import { useState, useEffect } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * useWindowResize Hook
 * Get current window size and listen for changes
 */
export function useWindowResize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowResize;
