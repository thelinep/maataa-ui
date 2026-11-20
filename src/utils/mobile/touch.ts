// Touch event utilities for mobile interactions

export interface TouchCoordinates {
  x: number;
  y: number;
  timestamp: number;
}

export class TouchGestureDetector {
  private touchStart: TouchCoordinates | null = null;
  private touchEnd: TouchCoordinates | null = null;
  private minSwipeDistance = 50;

  recordTouchStart(e: TouchEvent): void {
    const touch = e.touches[0];
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }

  recordTouchEnd(e: TouchEvent): void {
    const touch = e.changedTouches[0];
    this.touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }

  getSwipeDirection(): 'left' | 'right' | 'up' | 'down' | null {
    if (!this.touchStart || !this.touchEnd) return null;

    const diffX = this.touchEnd.x - this.touchStart.x;
    const diffY = this.touchEnd.y - this.touchStart.y;

    if (Math.abs(diffX) < this.minSwipeDistance && Math.abs(diffY) < this.minSwipeDistance) {
      return null;
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
      return diffX > 0 ? 'right' : 'left';
    }

    return diffY > 0 ? 'down' : 'up';
  }

  getSwipeVelocity(): number {
    if (!this.touchStart || !this.touchEnd) return 0;
    
    const distance = Math.hypot(
      this.touchEnd.x - this.touchStart.x,
      this.touchEnd.y - this.touchStart.y
    );
    
    const time = this.touchEnd.timestamp - this.touchStart.timestamp;
    return distance / time;
  }

  isLongPress(durationMs: number = 500): boolean {
    if (!this.touchStart || !this.touchEnd) return false;
    return this.touchEnd.timestamp - this.touchStart.timestamp >= durationMs;
  }

  isDoubleTap(lastTap: TouchCoordinates | null, maxDelay: number = 300): boolean {
    if (!this.touchEnd || !lastTap) return false;
    
    const timeDiff = this.touchEnd.timestamp - lastTap.timestamp;
    if (timeDiff > maxDelay) return false;

    const distance = Math.hypot(
      this.touchEnd.x - lastTap.x,
      this.touchEnd.y - lastTap.y
    );

    return distance < 50; // Allow small movement for double tap
  }

  reset(): void {
    this.touchStart = null;
    this.touchEnd = null;
  }
}

export const touchDetector = new TouchGestureDetector();
