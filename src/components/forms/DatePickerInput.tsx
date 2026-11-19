/**
 * DatePickerInput - Date input component
 *
 * A styled date input component using HTML5 date input.
 * Integrates with the design token system.
 *
 * Features:
 * - HTML5 date input with native browser picker
 * - Label and error support
 * - Date range support (min/max)
 * - Design token integration
 */

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';

export interface DatePickerInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: ReactNode;
  /** Error message */
  error?: ReactNode;
  /** Hint text */
  hint?: ReactNode;
  /** Whether field is required */
  required?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Minimum date */
  min?: string;
  /** Maximum date */
  max?: string;
  /** Whether to show asterisk for required fields */
  showRequiredAsterisk?: boolean;
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

// Label
const Label = styled.label<{ required?: boolean; hasError?: boolean }>`
  font-size: ${typography.label.fontSize};
  font-weight: ${typography.label.fontWeight};
  line-height: ${typography.label.lineHeight};
  text-transform: ${typography.label.textTransform};
  color: ${(props) => (props.hasError ? colorTokens.interactive.error : colorTokens.text.primary)};
  transition: color ${transitions.normal};

  .required-asterisk {
    color: ${colorTokens.interactive.error};
    margin-left: ${spacing.xs};
  }
`;

// Styled date input
const StyledDateInput = styled.input<{ hasError?: boolean; size?: 'sm' | 'md' | 'lg' }>`
  /* Base styles */
  font-family: ${typography.body.fontFamily};
  font-size: ${(props) => {
    switch (props.size) {
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
    switch (props.size) {
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
  border: 1px solid ${(props) => (props.hasError ? colorTokens.interactive.error : colorTokens.border.primary)};
  border-radius: ${borderRadius.md};

  /* Transitions */
  transition:
    border-color ${transitions.fast},
    box-shadow ${transitions.fast},
    background-color ${transitions.fast};

  /* Focus state */
  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? colorTokens.interactive.error : colorTokens.interactive.primary)};
    box-shadow: 0 0 0 3px ${(props) => {
      if (props.hasError) return 'rgba(139, 58, 43, 0.1)';
      return 'rgba(139, 111, 71, 0.1)';
    }};
  }

  /* Hover state */
  &:hover:not(:disabled) {
    border-color: ${(props) => (props.hasError ? colorTokens.interactive.error : colorTokens.border.secondary)};
  }

  /* Disabled state */
  &:disabled {
    background-color: ${colorTokens.background.secondary};
    color: ${colorTokens.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Calendar icon color */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.3);
  }
`;

// Helper text
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
 * DatePickerInput Component
 *
 * A styled date input component with label, hint, and error support.
 *
 * @example
 * <DatePickerInput
 *   label="Start Date"
 *   placeholder="Select a date"
 *   required
 * />
 *
 * @example
 * <DatePickerInput
 *   label="End Date"
 *   min="2024-01-01"
 *   max="2024-12-31"
 *   error="Date must be in 2024"
 * />
 */
export const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
  (
    {
      label,
      error,
      hint,
      required = false,
      size = 'md',
      showRequiredAsterisk = true,
      disabled,
      id,
      min,
      max,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const inputId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <Container>
        {label && (
          <Label htmlFor={inputId} required={required} hasError={hasError}>
            {label}
            {required && showRequiredAsterisk && <span className="required-asterisk">*</span>}
          </Label>
        )}

        <StyledDateInput
          ref={ref}
          id={inputId}
          type="date"
          disabled={disabled}
          hasError={hasError}
          size={size}
          min={min}
          max={max}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
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

DatePickerInput.displayName = 'DatePickerInput';

export default DatePickerInput;
