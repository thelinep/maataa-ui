/**
 * Design System - Theme Module Exports
 * Phase I: Theme Customization
 */

// Theme configuration
export { themes, createTheme, generateCSSVariables, getColorValue } from './themes';
export type { Theme, ThemeName } from './themes';

// Colors
export { lightTheme, darkTheme, createCustomPalette, semanticColorMap } from './theme-colors';
export type { ColorPalette, SemanticColor, PaletteOverrides } from './theme-colors';
