/**
 * useTheme Hook
 * Phase I: Theme Customization
 * 
 * Custom hook for accessing and managing theme
 */

import { Theme, ThemeName } from '../design-system/themes';
import { ColorPalette, PaletteOverrides } from '../design-system/theme-colors';

// Re-export from provider (assume ThemeContext is exported there)
// This file serves as the main hook entry point

/**
 * Hook to get theme context
 * @returns Current theme, theme name, and control functions
 */
export function useThemeContext() {
  // This will be re-exported from ThemeProvider
  // Actual implementation is in ThemeProvider.tsx
  throw new Error('useThemeContext must be used within ThemeProvider');
}

/**
 * Get color value from current theme
 * @param colorPath - Path to color (e.g., "primary.500", "text.primary")
 * @returns Color hex value
 */
export function getColorFromPath(theme: Theme, colorPath: string): string {
  const [category, ...rest] = colorPath.split('.');
  const shade = rest.join('.');

  if (category === 'primary') {
    return (theme.colors.primary as Record<string, string | undefined>)[shade] || '';
  }
  if (category === 'neutral') {
    return (theme.colors.neutral as Record<string, string | undefined>)[shade] || '';
  }
  if (category === 'semantic') {
    return (theme.colors.semantic as Record<string, string | undefined>)[shade] || '';
  }
  if (category === 'surface') {
    return (theme.colors.surface as Record<string, string | undefined>)[shade] || '';
  }
  if (category === 'text') {
    return (theme.colors.text as Record<string, string | undefined>)[shade] || '';
  }

  return '';
}

/**
 * Detect system color scheme preference
 * @returns 'light' | 'dark' based on system preference
 */
export function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get theme from localStorage
 * @returns Theme name or null if not found
 */
export function getStoredTheme(): ThemeName | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'custom') {
    return stored;
  }
  
  return null;
}

/**
 * Save theme to localStorage
 * @param themeName - Theme name to save
 */
export function saveThemeToStorage(themeName: ThemeName): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', themeName);
  }
}

/**
 * Remove theme from localStorage
 */
export function clearThemeStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('theme');
  }
}

/**
 * Listen for system theme changes
 * @param callback - Function to call when system theme changes
 * @returns Cleanup function
 */
export function listenToSystemThemeChanges(callback: (theme: 'light' | 'dark') => void) {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

/**
 * Get contrasting text color for a background
 * @param bgColor - Background color hex
 * @returns 'light' or 'dark' based on luminance
 */
export function getContrastingTextColor(bgColor: string): 'light' | 'dark' {
  // Remove # if present
  const hex = bgColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return contrasting color
  return luminance > 0.5 ? 'dark' : 'light';
}

/**
 * Merge color palettes
 * @param base - Base palette
 * @param overrides - Colors to override
 * @returns Merged palette
 */
export function mergePalettes(
  base: ColorPalette,
  overrides: PaletteOverrides
): ColorPalette {
  return {
    primary: { ...base.primary, ...overrides.primary },
    neutral: { ...base.neutral, ...overrides.neutral },
    semantic: { ...base.semantic, ...overrides.semantic },
    surface: { ...base.surface, ...overrides.surface },
    text: { ...base.text, ...overrides.text },
  };
}
