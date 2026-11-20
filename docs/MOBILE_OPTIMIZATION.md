# Phase H: Mobile Optimization

## Touch Interactions

Swipe, pinch, long-press, and double-tap detection:

```typescript
import { useTouchGestures } from '@/hooks/mobile';

export function MobileComponent() {
  const { onTouchStart, onTouchEnd } = useTouchGestures({
    onSwipe: (direction) => console.log('Swiped:', direction),
    onDoubleTap: () => console.log('Double tapped'),
    onLongPress: () => console.log('Long pressed')
  });

  return <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>Content</div>;
}
```

## Responsive Layouts

Mobile-first responsive design with breakpoints:

```typescript
import { BREAKPOINTS, MEDIA_QUERIES, isMobileViewport } from '@/utils/mobile';

const styles = styled.div`
  ${MEDIA_QUERIES.mobile} {
    padding: 8px;
    font-size: 14px;
  }
  
  ${MEDIA_QUERIES.tablet} {
    padding: 12px;
    font-size: 16px;
  }
`;
```

## Offline Support

Service worker caching strategy:

- Install: Cache core app files
- Fetch: Network first, fallback to cache
- Activate: Clean up old cache versions

Register in main app:

```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

## Mobile Detection

```typescript
import { isMobileViewport, isTouchDevice, getCurrentBreakpoint } from '@/utils/mobile';

console.log(isMobileViewport()); // true on mobile
console.log(isTouchDevice());    // true on touch devices
console.log(getCurrentBreakpoint()); // 'xs', 'sm', 'md', etc.
```

## Touch Targets

Minimum 44px touch targets for accessibility:

```typescript
import { TOUCH_TARGET_MIN } from '@/utils/mobile';

const TouchButton = styled.button`
  min-width: ${TOUCH_TARGET_MIN};
  min-height: ${TOUCH_TARGET_MIN};
  padding: 12px 16px;
`;
```

