# Theme Customization Guide (Phase I)

## Overview

The maataa-ui theme system provides dynamic theme switching with built-in support for light, dark, and custom themes. All themes are based on Phase 1 design tokens and use CSS custom properties for seamless switching.

## Features

- ✅ Light & Dark themes
- ✅ Custom palette builder
- ✅ System preference detection
- ✅ localStorage persistence
- ✅ CSS variables generation
- ✅ Smooth transitions
- ✅ TypeScript support

## Quick Start

### 1. Wrap App with ThemeProvider

```tsx
import { ThemeProvider } from '@/providers';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" persistToLocalStorage>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Access Theme in Components

```tsx
import { useTheme } from '@/providers';

export const MyComponent = () => {
  const { themeName, switchTheme, isDarkMode } = useTheme();

  return (
    <div>
      <p>Current theme: {themeName}</p>
      <button onClick={() => switchTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
};
```

### 3. Use CSS Variables in Styled Components

```tsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-surface-border);
  transition: var(--transition-fast);

  &:hover {
    background-color: var(--color-primary-600);
  }
`;
```

## Theme Structure

### Available Themes

#### Light Theme
- Warm paper-and-ink color palette (Phase 1)
- High contrast for readability
- Default theme

#### Dark Theme
- Inverted color palette
- Optimized for night viewing
- High contrast maintained

#### Custom Theme
- User-defined color overrides
- Extends light or dark base
- Preserved in localStorage

## Color Categories

### Primary Colors
Accent colors for buttons, links, focus states.
```css
--color-primary-50 to --color-primary-900
```

### Neutral Colors
Grayscale for backgrounds, borders, disabled states.
```css
--color-neutral-50 to --color-neutral-900
```

### Semantic Colors
Meaningful colors for UI feedback.
```css
--color-semantic-success
--color-semantic-warning
--color-semantic-error
--color-semantic-info
```

### Surface Colors
Backgrounds and foregrounds.
```css
--color-surface-background
--color-surface-surface
--color-surface-surfaceVariant
--color-surface-border
```

### Text Colors
Typography colors.
```css
--color-text-primary
--color-text-secondary
--color-text-disabled
--color-text-inverse
```

## Component Integration

### Form Inputs

```tsx
import styled from 'styled-components';

const StyledInput = styled.input`
  background-color: var(--color-surface-surface);
  border: 1px solid var(--color-surface-border);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-family-body);

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(184, 136, 74, 0.1);
  }

  &:disabled {
    background-color: var(--color-surface-surfaceVariant);
    color: var(--color-text-disabled);
  }
`;
```

### Buttons

```tsx
const PrimaryButton = styled.button`
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);

  &:hover {
    background-color: var(--color-primary-600);
  }

  &:active {
    background-color: var(--color-primary-700);
  }

  &:disabled {
    background-color: var(--color-surface-surfaceVariant);
    cursor: not-allowed;
  }
`;
```

### Cards

```tsx
const Card = styled.div`
  background-color: var(--color-surface-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;
```

## Creating Custom Themes

### Method 1: Color Overrides

```tsx
import { useTheme } from '@/providers';

const MyComponent = () => {
  const { createCustomTheme } = useTheme();

  const handleCreateCustomTheme = () => {
    createCustomTheme({
      primary: {
        500: '#FF6B6B', // Custom brand color
        600: '#FF5252',
        // ... other shades
      },
      semantic: {
        success: '#51CF66',
        warning: '#FFD93D',
      },
    });
  };

  return (
    <button onClick={handleCreateCustomTheme}>
      Apply Custom Theme
    </button>
  );
};
```

### Method 2: Base Theme Extension

```tsx
import { createTheme } from '@/design-system';

const myCustomTheme = createTheme(
  'my-theme',
  {
    primary: {
      500: '#3B82F6',
    },
  },
  'dark' // Extend dark theme
);
```

## CSS Variables Reference

### Typography
```css
--font-family-body
--font-family-heading
--font-family-mono
--font-size-xs, --font-size-sm, --font-size-base, etc.
```

### Spacing
```css
--spacing-xs (0.25rem)
--spacing-sm (0.5rem)
--spacing-md (1rem)
--spacing-lg (1.5rem)
--spacing-xl (2rem)
--spacing-2xl (3rem)
```

### Border Radius
```css
--radius-none
--radius-sm (0.25rem)
--radius-md (0.5rem)
--radius-lg (0.75rem)
--radius-full (9999px)
```

### Shadows
```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
```

### Transitions
```css
--transition-fast (150ms)
--transition-base (300ms)
--transition-slow (500ms)
```

## Theme Toggle Component

The `ThemeToggle` component provides UI for switching themes.

### Basic Usage

```tsx
import { ThemeToggle } from '@/components/common';

export const Header = () => {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle showLabel={true} />
    </header>
  );
};
```

### Props

- `showLabel?: boolean` - Show "Theme:" label (default: true)
- `showDropdown?: boolean` - Use dropdown instead of buttons (default: false)
- `compact?: boolean` - Compact layout (default: false)

## System Preference Detection

Automatically detect and apply system theme preference:

```tsx
<ThemeProvider 
  defaultTheme="light"
  systemPreference={true}
  persistToLocalStorage={true}
>
  <App />
</ThemeProvider>
```

The provider will:
1. Check localStorage for saved preference
2. Fall back to system preference (prefers-color-scheme)
3. Use defaultTheme if neither available

## Styling Components

### Using CSS Variables

Always use CSS variables instead of hardcoding colors:

```tsx
// ✅ Good
const Box = styled.div`
  color: var(--color-text-primary);
  background: var(--color-surface-background);
`;

// ❌ Avoid
const Box = styled.div`
  color: #1f1a16;
  background: #fefdfb;
`;
```

### Fallbacks for Legacy Browsers

CSS variables include fallback values:

```css
background-color: var(--color-primary-500, #b8884a);
```

## Testing Themes

### Test Theme Switching

```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers';

test('theme toggle works', () => {
  render(
    <ThemeProvider defaultTheme="light">
      <TestComponent />
    </ThemeProvider>
  );

  const button = screen.getByRole('button', { name: /dark/i });
  fireEvent.click(button);

  expect(document.documentElement).toHaveAttribute(
    'data-theme',
    'dark'
  );
});
```

### Test Color Contrast

```tsx
import { getContrastingTextColor } from '@/hooks/useTheme';

test('contrast detection', () => {
  expect(getContrastingTextColor('#FFFFFF')).toBe('dark');
  expect(getContrastingTextColor('#000000')).toBe('light');
});
```

## Browser Support

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- CSS Variables support required

## Accessibility

- ✅ Respects prefers-color-scheme media query
- ✅ Maintains WCAG AA contrast ratios
- ✅ Keyboard accessible theme toggle
- ✅ No flash of wrong theme on page load
- ✅ Preserves user preference

## Performance

- CSS variables apply instantly (no React re-renders needed)
- localStorage prevents theme switching on each page load
- Minimal bundle size (< 50KB minified)
- No runtime color calculations

## Migration from Phase 1 Tokens

If upgrading from Phase 1 to Phase I theming:

```tsx
// Before (Phase 1)
import { colorTokens } from '@/design-system/phase1-design-tokens';
color: ${colorTokens.text.primary};

// After (Phase I)
color: var(--color-text-primary);
```

## Examples

### Theme-Aware Button

```tsx
import styled from 'styled-components';

const ThemedButton = styled.button`
  background-color: var(--color-primary-500);
  color: white;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: var(--color-primary-600);
    }
  }
`;
```

### Dynamic Custom Palette

```tsx
import { useTheme } from '@/providers';

export const PaletteCustomizer = () => {
  const { createCustomTheme } = useTheme();
  const [brandColor, setBrandColor] = React.useState('#b8884a');

  return (
    <div>
      <input
        type="color"
        value={brandColor}
        onChange={(e) => {
          setBrandColor(e.target.value);
          createCustomTheme({ primary: { 500: e.target.value } });
        }}
      />
      <p>Brand Color: {brandColor}</p>
    </div>
  );
};
```

## Troubleshooting

### Theme not persisting

Ensure ThemeProvider has `persistToLocalStorage={true}` and localStorage is not disabled.

### CSS variables not applying

Check that:
1. Component is inside ThemeProvider
2. Using `var(--color-*)` syntax
3. Browser supports CSS custom properties

### Flash of wrong theme

Prevent by:
1. Applying theme in document head (before React renders)
2. Setting `data-theme` attribute early
3. Disabling animations on initial theme

## Resources

- CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- Design Tokens: See Phase 1 documentation
- Color Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
