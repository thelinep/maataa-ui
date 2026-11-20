/**
 * Theme System Tests
 * Phase I: Theme Customization
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../providers/ThemeProvider';
import { themes, createTheme } from '../../design-system/themes';
import {
  getSystemPreference,
  getStoredTheme,
  saveThemeToStorage,
  getContrastingTextColor,
  mergePalettes,
} from '../../hooks/useTheme';

/**
 * Test Component
 */
const TestComponent = () => {
  const { themeName, switchTheme, isDarkMode, currentTheme } = useTheme();

  return (
    <div>
      <p data-testid="theme-name">{themeName}</p>
      <p data-testid="is-dark">{isDarkMode ? 'dark' : 'light'}</p>
      <p data-testid="bg-color">{currentTheme.colors.surface.background}</p>
      <button onClick={() => switchTheme('light')}>Light</button>
      <button onClick={() => switchTheme('dark')}>Dark</button>
    </div>
  );
};

describe('Theme System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ThemeProvider', () => {
    test('renders with default theme', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-name')).toHaveTextContent('light');
    });

    test('applies dark theme', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-name')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('dark');
    });

    test('switches themes on button click', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const darkButton = screen.getByRole('button', { name: /dark/i });
      fireEvent.click(darkButton);

      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent('dark');
      });
    });

    test('persists theme to localStorage', async () => {
      render(
        <ThemeProvider defaultTheme="light" persistToLocalStorage>
          <TestComponent />
        </ThemeProvider>
      );

      const darkButton = screen.getByRole('button', { name: /dark/i });
      fireEvent.click(darkButton);

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark');
      });
    });

    test('restores theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');

      render(
        <ThemeProvider persistToLocalStorage>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-name')).toHaveTextContent('dark');
    });

    test('applies CSS variables to document', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const root = document.documentElement;
      const bgColor = getComputedStyle(root).getPropertyValue('--color-surface-background');

      expect(bgColor).toBeTruthy();
    });

    test('sets data-theme attribute', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('useTheme Hook', () => {
    test('throws error outside provider', () => {
      const ErrorComponent = () => {
        try {
          useTheme();
          return null;
        } catch (e: any) {
          return <p>{e.message}</p>;
        }
      };

      render(<ErrorComponent />);
      expect(screen.getByText(/must be used within/i)).toBeInTheDocument();
    });
  });

  describe('Theme Colors', () => {
    test('light theme has correct primary color', () => {
      expect(themes.light.colors.primary['500']).toBe('#b8884a');
    });

    test('dark theme has inverted primary color', () => {
      expect(themes.dark.colors.primary['500']).toBe('#a5753d');
    });

    test('semantic colors exist for feedback', () => {
      const { semantic } = themes.light.colors;
      expect(semantic.success).toBeTruthy();
      expect(semantic.warning).toBeTruthy();
      expect(semantic.error).toBeTruthy();
      expect(semantic.info).toBeTruthy();
    });

    test('surface colors exist for layouts', () => {
      const { surface } = themes.light.colors;
      expect(surface.background).toBeTruthy();
      expect(surface.surface).toBeTruthy();
      expect(surface.border).toBeTruthy();
    });
  });

  describe('Theme Creation', () => {
    test('creates custom theme with color overrides', () => {
      const customTheme = createTheme('custom', {
        primary: { '500': '#FF6B6B' },
      });

      expect(customTheme.colors.primary['500']).toBe('#FF6B6B');
    });

    test('extends dark theme for custom', () => {
      const customTheme = createTheme(
        'custom',
        { semantic: { success: '#00FF00' } },
        'dark'
      );

      expect(customTheme.colors.semantic.success).toBe('#00FF00');
    });

    test('preserves unmodified colors', () => {
      const customTheme = createTheme('custom', {
        primary: { '500': '#FF0000' },
      });

      expect(customTheme.colors.neutral['500']).toBe(
        themes.light.colors.neutral['500']
      );
    });
  });

  describe('Utility Functions', () => {
    test('getSystemPreference detects dark mode', () => {
      const pref = getSystemPreference();
      expect(['light', 'dark']).toContain(pref);
    });

    test('getStoredTheme returns null when empty', () => {
      expect(getStoredTheme()).toBeNull();
    });

    test('saveThemeToStorage persists theme', () => {
      saveThemeToStorage('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('getContrastingTextColor for light background', () => {
      const color = getContrastingTextColor('#FFFFFF');
      expect(color).toBe('dark');
    });

    test('getContrastingTextColor for dark background', () => {
      const color = getContrastingTextColor('#000000');
      expect(color).toBe('light');
    });

    test('mergePalettes combines colors correctly', () => {
      const merged = mergePalettes(
        themes.light.colors,
        { primary: { '500': '#FF0000' } }
      );

      expect(merged.primary['500']).toBe('#FF0000');
      expect(merged.neutral['500']).toBe(themes.light.colors.neutral['500']);
    });
  });

  describe('Theme Structure', () => {
    test('theme includes typography', () => {
      expect(themes.light.typography).toBeDefined();
      expect(themes.light.typography.fontFamily).toBeDefined();
      expect(themes.light.typography.fontSize).toBeDefined();
    });

    test('theme includes spacing', () => {
      expect(themes.light.spacing).toBeDefined();
      expect(themes.light.spacing.md).toBe('1rem');
    });

    test('theme includes border radius', () => {
      expect(themes.light.borderRadius).toBeDefined();
      expect(themes.light.borderRadius.md).toBe('0.5rem');
    });

    test('theme includes shadows', () => {
      expect(themes.light.shadows).toBeDefined();
      expect(themes.light.shadows.sm).toBeTruthy();
    });

    test('theme includes transitions', () => {
      expect(themes.light.transitions).toBeDefined();
      expect(themes.light.transitions.base).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('theme maintains contrast ratios', () => {
      const { text, surface } = themes.light.colors;
      // Basic check that text and background are different
      expect(text.primary).not.toBe(surface.background);
    });

    test('semantic colors have distinct meanings', () => {
      const { semantic } = themes.light.colors;
      const colors = Object.values(semantic);
      const unique = new Set(colors);
      expect(unique.size).toBe(colors.length);
    });
  });
});
