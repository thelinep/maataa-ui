// Mobile-first responsive breakpoints

export const BREAKPOINTS = {
  xs: 0,      // Mobile
  sm: 640,    // Small device
  md: 768,    // Tablet
  lg: 1024,   // Desktop
  xl: 1280,   // Large desktop
  '2xl': 1536 // Extra large
} as const;

export const MEDIA_QUERIES = {
  mobile: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.md}px)`,
  large: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xlarge: `@media (min-width: ${BREAKPOINTS.xl}px)`
} as const;

// Touch target size (minimum 44px for mobile)
export const TOUCH_TARGET_MIN = '44px';

// Mobile-specific spacing
export const MOBILE_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px'
} as const;

// Font sizes optimized for mobile
export const MOBILE_TYPOGRAPHY = {
  h1: '24px',
  h2: '20px',
  h3: '18px',
  body: '16px',
  small: '14px',
  xsmall: '12px'
} as const;

// Check if viewport is mobile
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.sm;
}

// Check if touch-enabled device
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );
}

// Get current breakpoint
export function getCurrentBreakpoint(): keyof typeof BREAKPOINTS {
  if (typeof window === 'undefined') return 'xs';

  const width = window.innerWidth;
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}
