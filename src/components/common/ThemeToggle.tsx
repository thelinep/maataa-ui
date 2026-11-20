/**
 * Theme Toggle Component
 * Phase I: Theme Customization
 * 
 * UI component for switching between light/dark themes
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';

/**
 * Styled Components
 */
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 0.5rem);
  padding: var(--spacing-sm, 0.5rem);
  background-color: var(--color-surface-surfaceVariant, #f9f7f4);
  border-radius: var(--radius-md, 0.5rem);
  border: 1px solid var(--color-surface-borderLight, #ede9e3);
`;

const ToggleButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm, 0.25rem);
  background-color: ${props => 
    props.active 
      ? 'var(--color-primary-500, #b8884a)' 
      : 'transparent'
  };
  color: ${props => 
    props.active 
      ? 'var(--color-text-inverse, #fefdfb)' 
      : 'var(--color-text-primary, #1f1a16)'
  };
  cursor: pointer;
  transition: var(--transition-fast, all 150ms ease-in-out);
  font-size: 1rem;

  &:hover {
    background-color: ${props => 
      props.active 
        ? 'var(--color-primary-600, #a5753d)' 
        : 'var(--color-surface-surface, #ffffff)'
    };
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Selector = styled.select`
  padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
  border: 1px solid var(--color-surface-border, #d9d3ca);
  border-radius: var(--radius-sm, 0.25rem);
  background-color: var(--color-surface-surface, #ffffff);
  color: var(--color-text-primary, #1f1a16);
  font-size: var(--font-size-sm, 0.875rem);
  font-family: var(--font-family-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto);
  cursor: pointer;
  transition: var(--transition-fast, all 150ms ease-in-out);

  &:hover {
    border-color: var(--color-primary-300, #dcc9b3);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary-500, #b8884a);
    box-shadow: 0 0 0 3px rgba(184, 136, 74, 0.1);
  }
`;

const Label = styled.label`
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #6b645b);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 0.25rem);
`;

/**
 * Icon Components
 */
const SunIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const AutoIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="1" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
  </svg>
);

interface ThemeToggleProps {
  showLabel?: boolean;
  showDropdown?: boolean;
  compact?: boolean;
}

/**
 * Theme Toggle Component
 * Allows switching between light, dark, and system preference themes
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = true,
  showDropdown = false,
  compact = false,
}) => {
  // Note: This assumes useTheme from ThemeProvider is re-exported
  // In actual implementation, import { useTheme } from '../providers/ThemeProvider'
  
  return (
    <ThemeToggleContent 
      showLabel={showLabel} 
      showDropdown={showDropdown} 
      compact={compact} 
    />
  );
};

/**
 * Internal component with theme logic
 */
const ThemeToggleContent: React.FC<{
  showLabel: boolean;
  showDropdown: boolean;
  compact: boolean;
}> = ({ showLabel, showDropdown, compact }) => {
  // Placeholder for actual theme context usage
  // In real implementation: const { themeName, switchTheme } = useTheme();
  
  const [themeName, setThemeName] = React.useState<'light' | 'dark' | 'custom'>('light');

  if (showDropdown) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {showLabel && <Label>Theme:</Label>}
        <Selector 
          value={themeName} 
          onChange={(e) => setThemeName(e.target.value as any)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </Selector>
      </div>
    );
  }

  return (
    <ToggleContainer>
      {showLabel && <Label>Theme:</Label>}
      
      <ToggleButton
        active={themeName === 'light'}
        onClick={() => setThemeName('light')}
        title="Light Mode"
        aria-label="Switch to light theme"
      >
        <SunIcon />
      </ToggleButton>

      <ToggleButton
        active={themeName === 'dark'}
        onClick={() => setThemeName('dark')}
        title="Dark Mode"
        aria-label="Switch to dark theme"
      >
        <MoonIcon />
      </ToggleButton>

      <ToggleButton
        active={themeName === 'custom'}
        onClick={() => setThemeName('custom')}
        title="System Preference"
        aria-label="Use system theme preference"
      >
        <AutoIcon />
      </ToggleButton>
    </ToggleContainer>
  );
};

export default ThemeToggle;
