/**
 * Language Selector Component
 * Phase I: Internationalization
 * 
 * UI component for switching between languages
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/useTranslation';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/config';

/**
 * Styled Components
 */
const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 0.5rem);
  padding: var(--spacing-xs, 0.25rem);
  background-color: var(--color-surface-surfaceVariant, #f9f7f4);
  border-radius: var(--radius-md, 0.5rem);
  border: 1px solid var(--color-surface-borderLight, #ede9e3);
`;

const LanguageButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
  border: 1px solid ${props => 
    props.active 
      ? 'var(--color-primary-500, #b8884a)' 
      : 'transparent'
  };
  border-radius: var(--radius-sm, 0.25rem);
  background-color: ${props => 
    props.active 
      ? 'rgba(184, 136, 74, 0.1)' 
      : 'transparent'
  };
  color: var(--color-text-primary, #1f1a16);
  cursor: pointer;
  transition: var(--transition-fast, all 150ms ease-in-out);
  font-size: var(--font-size-sm, 0.875rem);
  font-family: var(--font-family-body);
  font-weight: 500;

  &:hover {
    background-color: ${props => 
      props.active 
        ? 'rgba(184, 136, 74, 0.15)' 
        : 'rgba(0, 0, 0, 0.05)'
    };
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Flag = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

const LanguageDropdown = styled.select`
  padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
  border: 1px solid var(--color-surface-border, #d9d3ca);
  border-radius: var(--radius-sm, 0.25rem);
  background-color: var(--color-surface-surface, #ffffff);
  color: var(--color-text-primary, #1f1a16);
  font-size: var(--font-size-sm, 0.875rem);
  font-family: var(--font-family-body);
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
  white-space: nowrap;
`;

interface LanguageSelectorProps {
  showLabel?: boolean;
  showDropdown?: boolean;
  compact?: boolean;
}

/**
 * Language Selector Component
 * Allows switching between supported languages
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  showLabel = true,
  showDropdown = false,
  compact = false,
}) => {
  return (
    <LanguageSelectorContent 
      showLabel={showLabel} 
      showDropdown={showDropdown} 
      compact={compact} 
    />
  );
};

/**
 * Internal component with i18n logic
 */
const LanguageSelectorContent: React.FC<{
  showLabel: boolean;
  showDropdown: boolean;
  compact: boolean;
}> = ({ showLabel, showDropdown, compact }) => {
  // Note: Actual implementation would use: const { language, changeLanguage } = useTranslation();
  const [language, setLanguage] = React.useState<SupportedLanguage>('en');

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    // In real implementation: await changeLanguage(newLanguage);
  };

  if (showDropdown) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {showLabel && <Label>Language:</Label>}
        <LanguageDropdown
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
          aria-label="Select language"
        >
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, { name, flag }]) => (
            <option key={code} value={code}>
              {flag} {name}
            </option>
          ))}
        </LanguageDropdown>
      </div>
    );
  }

  return (
    <SelectorContainer>
      {showLabel && <Label>Language:</Label>}

      {Object.entries(SUPPORTED_LANGUAGES).map(([code, { name, flag }]) => (
        <LanguageButton
          key={code}
          active={language === code}
          onClick={() => handleLanguageChange(code as SupportedLanguage)}
          title={`Switch to ${name}`}
          aria-label={`Switch to ${name}`}
        >
          <Flag>{flag}</Flag>
          {!compact && <span>{code.toUpperCase()}</span>}
        </LanguageButton>
      ))}
    </SelectorContainer>
  );
};

export default LanguageSelector;
