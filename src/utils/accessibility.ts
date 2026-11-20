/**
 * Accessibility Utilities
 * Phase I Day 3: Advanced Accessibility
 * 
 * WCAG 2.1 AAA compliance utilities
 */

/**
 * Generate unique ID for aria-labelledby
 */
let idCounter = 0;

export function generateId(prefix: string = 'id'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Create semantic aria label
 */
export function createAriaLabel(
  text: string,
  context?: string,
  status?: string
): string {
  let label = text;
  
  if (context) {
    label += ` (${context})`;
  }
  
  if (status) {
    label += `, ${status}`;
  }
  
  return label;
}

/**
 * Announce message to screen readers
 * Uses aria-live region
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  // Find or create live region
  let liveRegion = document.querySelector(
    `[aria-live="${priority}"]`
  ) as HTMLElement;

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = message;
}

/**
 * Get all focusable elements in container
 */
export function getFocusableElements(container?: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const root = container || document;
  return Array.from(root.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

/**
 * Scroll element into view if not visible
 */
export function scrollIntoViewIfNeeded(element: HTMLElement): void {
  if (!isInViewport(element)) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Check color contrast ratio (WCAG)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
  // Parse hex color
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsWCAG_AA(color1: string, color2: string): boolean {
  return getContrastRatio(color1, color2) >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard (7:1 for normal text)
 */
export function meetsWCAG_AAA(color1: string, color2: string): boolean {
  return getContrastRatio(color1, color2) >= 7;
}

/**
 * Check if element is hidden from screen readers
 */
export function isHiddenFromScreenReaders(element: HTMLElement): boolean {
  return (
    element.getAttribute('aria-hidden') === 'true' ||
    element.style.display === 'none' ||
    element.style.visibility === 'hidden' ||
    element.offsetParent === null
  );
}

/**
 * Check if element has accessible name
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  const textContent = element.textContent?.trim();

  return !!(ariaLabel || ariaLabelledBy || title || textContent);
}

/**
 * Get accessible name of element
 */
export function getAccessibleName(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  const title = element.getAttribute('title');
  if (title) return title;

  return element.textContent?.trim() || '';
}

/**
 * Check keyboard accessibility
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tagName = element.tagName.toLowerCase();
  const tabindex = element.getAttribute('tabindex');

  // Check if naturally keyboard accessible
  const nativelyAccessible = ['button', 'a', 'input', 'select', 'textarea'].includes(tagName);

  if (nativelyAccessible) return true;

  // Check if has positive tabindex
  if (tabindex && parseInt(tabindex) > 0) return true;

  return false;
}

/**
 * Find next focusable element
 */
export function getNextFocusableElement(
  current: HTMLElement,
  container?: HTMLElement
): HTMLElement | null {
  const focusable = getFocusableElements(container);
  const currentIndex = focusable.indexOf(current);

  if (currentIndex === -1) return focusable[0] || null;
  if (currentIndex === focusable.length - 1) return focusable[0] || null;

  return focusable[currentIndex + 1] || null;
}

/**
 * Find previous focusable element
 */
export function getPreviousFocusableElement(
  current: HTMLElement,
  container?: HTMLElement
): HTMLElement | null {
  const focusable = getFocusableElements(container);
  const currentIndex = focusable.indexOf(current);

  if (currentIndex <= 0) return focusable[focusable.length - 1] || null;

  return focusable[currentIndex - 1] || null;
}

/**
 * Trap focus within container
 * Used for modals and dialogs
 */
export function trapFocus(
  event: KeyboardEvent,
  container: HTMLElement
): void {
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements(container);
  const activeElement = document.activeElement as HTMLElement;

  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  if (event.shiftKey) {
    // Shift + Tab
    if (activeElement === focusable[0]) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    }
  } else {
    // Tab
    if (activeElement === focusable[focusable.length - 1]) {
      event.preventDefault();
      focusable[0].focus();
    }
  }
}

/**
 * Check if screen reader is likely active
 * Note: This is a heuristic and not 100% reliable
 */
export function isScreenReaderActive(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Check for accessibility tree
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  document.body.appendChild(liveRegion);

  const isActive = liveRegion.getAttribute('aria-live') !== null;

  document.body.removeChild(liveRegion);

  return isActive;
}
