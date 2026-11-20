/**
 * Select - Dropdown select component
 *
 * A styled select component for single-value selection from a list.
 * Integrates with the design token system and supports keyboard navigation.
 *
 * Features:
 * - Native HTML select for accessibility
 * - Label, hint, and error support
 * - Multiple sizes
 * - Keyboard navigation
 * - Design token integration
 */

import { forwardRef, SelectHTMLAttributes, ReactNode, useId } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';
import { useFormField } from './FormFieldWrapper';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label text */
  label?: ReactNode;
  /** Error message */
  error?: ReactNode;
  /** Hint text */
  hint?: ReactNode;
  /** Options to display */
  options: SelectOption[];
  /** Whether field is required */
  required?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Placeholder text */
  placeholder?: string;
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
const Label = styled.label<{ $required?: boolean; $hasError?: boolean }>`
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

// Select wrapper for custom styling
const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

// Styled select
const StyledSelect = styled.select<{ $hasError?: boolean; $size?: 'sm' | 'md' | 'lg' }>`
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

  /* Layout - full width with room for arrow */
  width: 100%;
  appearance: none;
  padding-right: ${spacing.xxxl};

  /* Colors and borders */
  color: ${colorTokens.text.primary};
  background-color: ${colorTokens.background.primary};
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right ${spacing.md} center;
  background-size: 1.2em;
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

  /* Option styling */
  option {
    color: ${colorTokens.text.primary};
    background-color: ${colorTokens.background.primary};
  }

  option:disabled {
    color: ${colorTokens.text.disabled};
  }
`;

// Helper text
const HelperText = styled.div<{ $variant?: 'hint' | 'error' }>`
  font-size: ${typography.bodySmall.fontSize};
  line-height: ${typography.bodySmall.lineHeight};
  color: ${(props) => (props.$variant === 'error' ? colorTokens.interactive.error : colorTokens.text.secondary)};
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
 * Select Component
 *
 * A styled select component for single-value selection with
 * label, hint, and error message support.
 *
 * @example
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 *   required
 * />
 *
 * @example
 * <Select
 *   label="Status"
 *   options={statuses}
 *   placeholder="Select a status"
 *   error="Status is required"
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      required = false,
      size = 'md',
      placeholder,
      showRequiredAsterisk = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const field = useFormField();
    const generatedId = useId();
    const selectId = id || field?.id || `select-${generatedId}`;

    return (
      <Container>
        {label && (
          <Label htmlFor={selectId} $required={required} $hasError={hasError}>
            {label}
            {required && showRequiredAsterisk && <span className="required-asterisk">*</span>}
          </Label>
        )}

        <SelectWrapper>
          <StyledSelect
            ref={ref}
            id={selectId}
            disabled={disabled}
            $hasError={hasError}
            $size={size}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </StyledSelect>
        </SelectWrapper>

        {error && (
          <HelperText id={`${selectId}-error`} $variant="error" role="alert">
            <span>⚠</span>
            {error}
          </HelperText>
        )}

        {hint && !error && (
          <HelperText id={`${selectId}-hint`} $variant="hint">
            {hint}
          </HelperText>
        )}
      </Container>
    );
  }
);

Select.displayName = 'Select';

export default Select;
