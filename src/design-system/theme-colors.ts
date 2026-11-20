/**
 * Theme Color Definitions
 * Phase I: Theme Customization
 * 
 * Base color palettes for light, dark, and custom themes
 * Uses Phase 1 design token foundation
 */

export interface ColorPalette {
  // Primary colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Neutral colors (grays)
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Semantic colors
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
    successBg: string;
    warningBg: string;
    errorBg: string;
    infoBg: string;
  };
  
  // Surface & text
  surface: {
    background: string;
    surface: string;
    surfaceVariant: string;
    onBackground: string;
    onSurface: string;
    border: string;
    borderLight: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
}

/**
 * Light Theme Palette
 * Based on warm paper-and-ink aesthetic from Phase 1
 */
export const lightTheme: ColorPalette = {
  primary: {
    50: '#faf8f6',
    100: '#f5f1ed',
    200: '#ebe3db',
    300: '#dcc9b3',
    400: '#c9a86f',
    500: '#b8884a', // Brand primary
    600: '#a5753d',
    700: '#8a5f31',
    800: '#6f4a28',
    900: '#4a2f17',
  },
  
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#ede9e3',
    300: '#d9d3ca',
    400: '#bfb7ac',
    500: '#a3998c',
    600: '#8b7f75',
    700: '#6b645b',
    800: '#4a4541',
    900: '#2c2420',
  },
  
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    successBg: '#ecfdf5',
    warningBg: '#fffbeb',
    errorBg: '#fef2f2',
    infoBg: '#eff6ff',
  },
  
  surface: {
    background: '#fefdfb',
    surface: '#ffffff',
    surfaceVariant: '#f9f7f4',
    onBackground: '#1a1410',
    onSurface: '#0f0a06',
    border: '#d9d3ca',
    borderLight: '#ede9e3',
  },
  
  text: {
    primary: '#1f1a16',
    secondary: '#6b645b',
    disabled: '#a3998c',
    inverse: '#fefdfb',
  },
};

/**
 * Dark Theme Palette
 * Inverted colors with contrast optimization
 */
export const darkTheme: ColorPalette = {
  primary: {
    50: '#1a0f05',
    100: '#2d1a0d',
    200: '#4a2f17',
    300: '#6f4a28',
    400: '#8a5f31',
    500: '#a5753d', // Brand primary (lighter for dark mode)
    600: '#b8884a',
    700: '#c9a86f',
    800: '#dcc9b3',
    900: '#ebe3db',
  },
  
  neutral: {
    50: '#1a1410',
    100: '#2c2420',
    200: '#4a4541',
    300: '#6b645b',
    400: '#8b7f75',
    500: '#a3998c',
    600: '#bfb7ac',
    700: '#d9d3ca',
    800: '#ede9e3',
    900: '#fafaf9',
  },
  
  semantic: {
    success: '#6ee7b7',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    successBg: '#064e3b',
    warningBg: '#78350f',
    errorBg: '#7f1d1d',
    infoBg: '#1e3a8a',
  },
  
  surface: {
    background: '#0f0a06',
    surface: '#1a1410',
    surfaceVariant: '#2d2420',
    onBackground: '#fefdfb',
    onSurface: '#faf8f6',
    border: '#4a4541',
    borderLight: '#2d2420',
  },
  
  text: {
    primary: '#fefdfb',
    secondary: '#d9d3ca',
    disabled: '#8b7f75',
    inverse: '#0f0a06',
  },
};

/**
 * Custom Palette Builder
 * Creates a custom theme by overriding specific colors
 */
/** Per-group partial overrides, e.g. { primary: { 500: '#f00' } } */
export type PaletteOverrides = { [K in keyof ColorPalette]?: Partial<ColorPalette[K]> };

export function createCustomPalette(
  overrides: PaletteOverrides,
  baseTheme: ColorPalette = lightTheme
): ColorPalette {
  return {
    primary: { ...baseTheme.primary, ...overrides.primary },
    neutral: { ...baseTheme.neutral, ...overrides.neutral },
    semantic: { ...baseTheme.semantic, ...overrides.semantic },
    surface: { ...baseTheme.surface, ...overrides.surface },
    text: { ...baseTheme.text, ...overrides.text },
  };
}

/**
 * Semantic Color Mappings
 * Maps Phase 1 token colors to theme colors
 */
export const semanticColorMap = {
  // Form & Input
  inputBackground: 'surface.surface',
  inputBorder: 'surface.border',
  inputBorderFocus: 'primary.500',
  inputText: 'text.primary',
  inputPlaceholder: 'text.secondary',
  inputDisabled: 'surface.surfaceVariant',
  
  // Buttons
  buttonPrimary: 'primary.500',
  buttonPrimaryHover: 'primary.600',
  buttonPrimaryActive: 'primary.700',
  buttonSecondary: 'neutral.200',
  buttonSecondaryText: 'text.primary',
  buttonDisabled: 'surface.surfaceVariant',
  
  // Text
  textPrimary: 'text.primary',
  textSecondary: 'text.secondary',
  textDisabled: 'text.disabled',
  
  // Feedback
  successText: 'semantic.success',
  warningText: 'semantic.warning',
  errorText: 'semantic.error',
  infoText: 'semantic.info',
  successBg: 'semantic.successBg',
  warningBg: 'semantic.warningBg',
  errorBg: 'semantic.errorBg',
  infoBg: 'semantic.infoBg',
  
  // Borders
  borderPrimary: 'surface.border',
  borderLight: 'surface.borderLight',
  borderFocus: 'primary.300',
  
  // Backgrounds
  bgPrimary: 'surface.background',
  bgSecondary: 'surface.surface',
  bgTertiary: 'surface.surfaceVariant',
};

export type SemanticColor = keyof typeof semanticColorMap;

/**
 * Component Token Aliases (Phase 1 → component layer)
 *
 * Flat, semantic aliases consumed by page-level components (Phase J film
 * production workflows). Values are derived from `lightTheme` so they stay in
 * sync with the palette; spacing/typography mirror `baseTheme` in themes.ts.
 * Colour values are 6-digit hex so components can append an alpha suffix
 * (e.g. `${colorTokens.primary.light}30`).
 */
export const colorTokens = {
  primary: {
    main: lightTheme.primary[500],
    dark: lightTheme.primary[700],
    light: lightTheme.primary[300],
  },
  secondary: {
    light: lightTheme.neutral[200],
  },
  neutral: {
    light: lightTheme.neutral[100],
    lighter: lightTheme.neutral[50],
  },
  background: {
    primary: lightTheme.surface.background,
    secondary: lightTheme.surface.surface,
    tertiary: lightTheme.surface.surfaceVariant,
  },
  /** Colours for interactive elements and status feedback */
  interactive: {
    primary: lightTheme.primary[500],
    primaryHover: lightTheme.primary[700],
    success: lightTheme.semantic.success,
    warning: lightTheme.semantic.warning,
    error: lightTheme.semantic.error,
    info: lightTheme.semantic.info,
  },
  text: {
    primary: lightTheme.text.primary,
    secondary: lightTheme.text.secondary,
    disabled: lightTheme.text.disabled,
    inverse: lightTheme.text.inverse,
  },
  border: {
    primary: lightTheme.surface.border,
    light: lightTheme.surface.borderLight,
  },
  semantic: lightTheme.semantic,
  shadow: lightTheme.neutral[900],
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const;

const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const typography = {
  heading1: { fontFamily: SYSTEM_FONT_STACK, fontSize: '2rem', fontWeight: 700, lineHeight: 1.25 },
  heading2: { fontFamily: SYSTEM_FONT_STACK, fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.25 },
  heading3: { fontFamily: SYSTEM_FONT_STACK, fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25 },
  body: { fontFamily: SYSTEM_FONT_STACK, fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  bodySmall: { fontFamily: SYSTEM_FONT_STACK, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
} as const;
