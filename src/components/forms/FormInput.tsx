/**
 * FormInput - Foundational form input component
 *
 * A flexible, reusable text input component that integrates with
 * the design token system and supports multiple input types.
 *
 * Features:
 * - Multiple input types (text, email, password, number, url, etc.)
 * - Label, hint, and error message support
 * - Full keyboard navigation and accessibility
 * - Design token integration for styling
 * - TypeScript strict mode support
 */

import { forwardRef, InputHTMLAttributes, ReactNode, useId, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';
import { useFormField } from './FormFieldWrapper';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'url'
  | 'tel'
  | 'search'
  | 'hidden'
  | 'date'
  | 'time'
  | 'datetime-local';

export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Input type */
  type?: InputType;
  /** Label text */
  label?: ReactNode;
  /** Hint text shown below input */
  hint?: ReactNode;
  /** Error message - presence indicates error state */
  error?: ReactNode;
  /** Whether field is required */
  required?: boolean;
  /** Whether input is loading/disabled */
  isLoading?: boolean;
  /** Custom size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show asterisk for required fields */
  showRequiredAsterisk?: boolean;
}

// Styled container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  font-family: ${typography.body.fontFamily};
`;

// Label styling
const Label = styled.label<{ $hasError?: boolean }>`
  font-size: ${typography.label.fontSize};
  font-weight: ${typography.label.fontWeight};
  line-height: ${typography.label.lineHeight};
  text-transform: ${typography.label.textTransform};
  color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.text.primary)};
  transition: color ${transitions.normal};

  .required-asterisk {
    color: ${colorTokens.interactive.error};
    margin-left: ${spacing.xs};
  }
`;

// Input styling - main element
const StyledInput = styled.input<{ $hasError?: boolean; $size?: 'sm' | 'md' | 'lg'; $isLoading?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  /* Base styles */
  font-family: ${typography.body.fontFamily};
  font-size: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '12px';
      case 'lg':
        return '16px';
      default:
        return typography.body.fontSize;
    }
  }};
  line-height: ${typography.body.lineHeight};

  /* Spacing */
  padding: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return `${spacing.xs} ${spacing.sm}`;
      case 'lg':
        return `${spacing.md} ${spacing.lg}`;
      default:
        return `${spacing.sm} ${spacing.md}`;
    }
  }};

  /* Colors and borders */
  color: ${colorTokens.text.primary};
  background-color: ${colorTokens.background.primary};
  border: 1px solid ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.border.primary)};
  border-radius: ${borderRadius.md};

  /* Transitions */
  transition:
    border-color ${transitions.fast},
    box-shadow ${transitions.fast},
    background-color ${transitions.fast};

  /* Focus state */
  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.interactive.primary)};
    box-shadow: 0 0 0 3px ${(props) => {
      if (props.$hasError) return 'rgba(139, 58, 43, 0.1)';
      return 'rgba(139, 111, 71, 0.1)';
    }};
  }

  /* Hover state */
  &:hover:not(:disabled) {
    border-color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.border.secondary)};
  }

  /* Disabled state */
  &:disabled {
    background-color: ${colorTokens.background.secondary};
    color: ${colorTokens.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Loading state */
  ${(props) =>
    props.$isLoading &&
    `
    opacity: 0.6;
    cursor: not-allowed;
  `}

  /* Placeholder styling */
  &::placeholder {
    color: ${colorTokens.text.tertiary};
  }

  /* Password visibility toggle space */
  &[type='password'] {
    font-family: 'Courier New', monospace;
    letter-spacing: 0.15em;
  }
`;

// Helper text container
const HelperText = styled.div<{ variant?: 'hint' | 'error' }>`
  font-size: ${typography.bodySmall.fontSize};
  line-height: ${typography.bodySmall.lineHeight};
  color: ${(props) => (props.variant === 'error' ? colorTokens.interactive.error : colorTokens.text.secondary)};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
`;

/**
 * FormInput Component
 *
 * A flexible, accessible form input component with support for
 * labels, hints, error messages, and multiple input types.
 *
 * @example
 * <FormInput
 *   type="email"
 *   label="Email Address"
 *   placeholder="you@example.com"
 *   required
 * />
 *
 * @example
 * <FormInput
 *   type="password"
 *   label="Password"
 *   error="Password must be at least 8 characters"
 * />
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      type = 'text',
      label,
      hint,
      error,
      required = false,
      isLoading = false,
      size = 'md',
      showRequiredAsterisk = true,
      disabled,
      id,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [, setIsFocused] = useState(false);
    const field = useFormField();
    const hasError = !!error || !!field?.invalid;
    const generatedId = useId();
    const inputId = id || field?.id || `input-${generatedId}`;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : field?.describedBy;

    return (
      <Container>
        {label && (
          <Label htmlFor={inputId} $hasError={hasError}>
            {label}
            {required && showRequiredAsterisk && <span className="required-asterisk">*</span>}
          </Label>
        )}

        <StyledInput
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled || isLoading}
          required={required || field?.required || undefined}
          aria-busy={isLoading || undefined}
          $hasError={hasError}
          $size={size}
          $isLoading={isLoading}
          placeholder={placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          {...props}
        />

        {error && (
          <HelperText id={`${inputId}-error`} variant="error" role="alert">
            <span>⚠</span>
            {error}
          </HelperText>
        )}

        {hint && !error && (
          <HelperText id={`${inputId}-hint`} variant="hint">
            {hint}
          </HelperText>
        )}
      </Container>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
