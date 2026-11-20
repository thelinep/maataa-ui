/**
 * Theme Provider Component
 * Phase I: Theme Customization
 * 
 * Context provider for theme management and switching
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeName, themes, createTheme, generateCSSVariables } from '../design-system/themes';
import { ColorPalette } from '../design-system/theme-colors';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  switchTheme: (name: ThemeName) => void;
  createCustomTheme: (colorOverrides: Partial<ColorPalette>, baseTheme?: 'light' | 'dark') => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  persistToLocalStorage?: boolean;
  systemPreference?: boolean;
}

/**
 * Theme Provider Component
 * Wraps application with theme context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  persistToLocalStorage = true,
  systemPreference = true,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[defaultTheme]);

  /**
   * Initialize theme on mount
   * Check localStorage, system preference, and URL params
   */
  useEffect(() => {
    // Check localStorage first
    if (persistToLocalStorage) {
      const saved = localStorage.getItem('theme');
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'custom')) {
        setThemeName(saved);
        setCurrentTheme(themes[saved]);
        return;
      }
    }

    // Check system preference
    if (systemPreference && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeName('dark');
      setCurrentTheme(themes['dark']);
      return;
    }

    // Use default
    setThemeName(defaultTheme);
    setCurrentTheme(themes[defaultTheme]);
  }, []);

  /**
   * Apply theme changes
   */
  useEffect(() => {
    const root = document.documentElement;

    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', themeName);

    // Apply CSS variables
    const cssVars = generateCSSVariables(currentTheme);
    const styleId = 'theme-variables';
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = cssVars;

    // Apply background color
    root.style.backgroundColor = currentTheme.colors.surface.background;
    root.style.color = currentTheme.colors.text.primary;

    // Persist to localStorage
    if (persistToLocalStorage) {
      localStorage.setItem('theme', themeName);
    }
  }, [themeName, currentTheme, persistToLocalStorage]);

  /**
   * Switch theme by name
   */
  const switchTheme = (name: ThemeName) => {
    setThemeName(name);
    setCurrentTheme(themes[name]);
  };

  /**
   * Create and apply custom theme
   */
  const createCustomThemeHandler = (
    colorOverrides: Partial<ColorPalette>,
    baseTheme: 'light' | 'dark' = 'light'
  ) => {
    const customTheme = createTheme('custom', colorOverrides, baseTheme);
    setThemeName('custom');
    setCurrentTheme(customTheme);
  };

  const isDarkMode = themeName === 'dark';

  const value: ThemeContextType = {
    currentTheme,
    themeName,
    switchTheme,
    createCustomTheme: createCustomThemeHandler,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 * Access theme context in components
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

/**
 * withTheme HOC
 * Class component support for theme context
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: ThemeContextType }>
) {
  return (props: P) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
}
