/**
 * Theme Definition System
 * Phase I: Theme Customization
 * 
 * Complete theme objects with colors, typography, spacing
 */

import { ColorPalette, PaletteOverrides, lightTheme, darkTheme, createCustomPalette } from './theme-colors';

export type ThemeName = 'light' | 'dark' | 'custom';

export interface Theme {
  name: ThemeName;
  colors: ColorPalette;
  typography: {
    fontFamily: {
      body: string;
      heading: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
}

/**
 * Base Theme Configuration
 * Shared typography, spacing, and other properties
 */
const baseTheme = {
  typography: {
    fontFamily: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: 'all 150ms ease-in-out',
    base: 'all 300ms ease-in-out',
    slow: 'all 500ms ease-in-out',
  },
};

/**
 * Light Theme
 * Default theme with warm paper-and-ink colors
 */
export const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    colors: lightTheme,
    ...baseTheme,
  },
  
  /**
   * Dark Theme
   * High contrast dark colors for night mode
   */
  dark: {
    name: 'dark',
    colors: darkTheme,
    ...baseTheme,
  },
  
  /**
   * Custom Theme Placeholder
   * Will be populated dynamically by ThemeProvider
   */
  custom: {
    name: 'custom',
    colors: lightTheme,
    ...baseTheme,
  },
};

/**
 * Create Custom Theme
 * Builder function for user-defined themes
 */
export function createTheme(
  _name: string,
  colorOverrides: PaletteOverrides,
  baseThemeName: 'light' | 'dark' = 'light'
): Theme {
  const baseThemeData = themes[baseThemeName];
  const customColors = createCustomPalette(
    colorOverrides,
    baseThemeData.colors
  );
  
  return {
    name: 'custom',
    colors: customColors,
    ...baseTheme,
  };
}

/**
 * CSS Variables Generation
 * Convert theme to CSS custom properties
 */
export function generateCSSVariables(theme: Theme): string {
  const { colors, typography, spacing, borderRadius, shadows, transitions } = theme;
  
  let css = ':root {\n';
  
  // Colors
  css += '  /* Primary Colors */\n';
  Object.entries(colors.primary).forEach(([key, value]) => {
    css += `  --color-primary-${key}: ${value};\n`;
  });
  
  css += '\n  /* Neutral Colors */\n';
  Object.entries(colors.neutral).forEach(([key, value]) => {
    css += `  --color-neutral-${key}: ${value};\n`;
  });
  
  css += '\n  /* Semantic Colors */\n';
  Object.entries(colors.semantic).forEach(([key, value]) => {
    css += `  --color-semantic-${key}: ${value};\n`;
  });
  
  css += '\n  /* Surface Colors */\n';
  Object.entries(colors.surface).forEach(([key, value]) => {
    css += `  --color-surface-${key}: ${value};\n`;
  });
  
  css += '\n  /* Text Colors */\n';
  Object.entries(colors.text).forEach(([key, value]) => {
    css += `  --color-text-${key}: ${value};\n`;
  });
  
  // Typography
  css += '\n  /* Typography */\n';
  css += `  --font-family-body: ${typography.fontFamily.body};\n`;
  css += `  --font-family-heading: ${typography.fontFamily.heading};\n`;
  css += `  --font-family-mono: ${typography.fontFamily.mono};\n`;
  
  // Spacing
  css += '\n  /* Spacing */\n';
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });
  
  // Border Radius
  css += '\n  /* Border Radius */\n';
  Object.entries(borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });
  
  // Shadows
  css += '\n  /* Shadows */\n';
  Object.entries(shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });
  
  // Transitions
  css += '\n  /* Transitions */\n';
  Object.entries(transitions).forEach(([key, value]) => {
    css += `  --transition-${key}: ${value};\n`;
  });
  
  css += '}\n';
  
  return css;
}

/**
 * Get Color Value Helper
 * Retrieve a color from theme by path (e.g., "primary.500")
 */
export function getColorValue(theme: Theme, colorPath: string): string {
  const [category, shade] = colorPath.split('.');
  
  if (category === 'primary') {
    return (theme.colors.primary as any)[shade] || '';
  }
  if (category === 'neutral') {
    return (theme.colors.neutral as any)[shade] || '';
  }
  if (category === 'semantic') {
    return (theme.colors.semantic as any)[shade] || '';
  }
  if (category === 'surface') {
    return (theme.colors.surface as any)[shade] || '';
  }
  if (category === 'text') {
    return (theme.colors.text as any)[shade] || '';
  }
  
  return '';
}
