import { useRef, useCallback } from 'react';
import { touchDetector } from '@/utils/mobile/touch';

export interface GestureHandlers {
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

export function useTouchGestures(handlers: GestureHandlers) {
  const lastTapRef = useRef<{ x: number; y: number; timestamp: number } | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchDetector.recordTouchStart(e as any);

    // Setup long press detection
    longPressTimeoutRef.current = setTimeout(() => {
      handlers.onLongPress?.();
    }, 500);
  }, [handlers]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchDetector.recordTouchEnd(e as any);

    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    // Check for double tap
    if (lastTapRef.current && touchDetector.isDoubleTap(lastTapRef.current)) {
      handlers.onDoubleTap?.();
      lastTapRef.current = null;
    } else {
      // Record for next tap
      const touch = e.changedTouches[0];
      lastTapRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      };
    }

    // Check for swipe
    const swipeDirection = touchDetector.getSwipeDirection();
    if (swipeDirection) {
      handlers.onSwipe?.(swipeDirection);
    }

    touchDetector.reset();
  }, [handlers]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  };
}
