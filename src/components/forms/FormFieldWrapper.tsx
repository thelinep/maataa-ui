/**
 * FormFieldWrapper - Reusable form field wrapper component
 *
 * Provides consistent structure for form fields with label, hint text,
 * and error message display. Wraps any form control component.
 *
 * Features:
 * - Consistent spacing and layout
 * - Label with optional required indicator
 * - Helper text (hint or error)
 * - Design token integration
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions } from '@/utils/tokens';

export interface FormFieldWrapperProps {
  /** Label text */
  label?: ReactNode;
  /** Hint text shown below input */
  hint?: ReactNode;
  /** Error message - presence indicates error state */
  error?: ReactNode;
  /** Whether field is required */
  required?: boolean;
  /** Whether to show asterisk for required fields */
  showRequiredAsterisk?: boolean;
  /** The form control content */
  children: ReactNode;
  /** Custom id for accessibility */
  id?: string;
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
 * FormFieldWrapper Component
 *
 * A flexible wrapper for form fields that provides consistent
 * label, hint, and error message display.
 *
 * @example
 * <FormFieldWrapper label="Email" required>
 *   <input type="email" />
 * </FormFieldWrapper>
 *
 * @example
 * <FormFieldWrapper
 *   label="Password"
 *   error="Password must be at least 8 characters"
 * >
 *   <input type="password" />
 * </FormFieldWrapper>
 */
export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  hint,
  error,
  required = false,
  showRequiredAsterisk = true,
  children,
  id,
}) => {
  const hasError = !!error;
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Container>
      {label && (
        <Label htmlFor={fieldId} required={required} hasError={hasError}>
          {label}
          {required && showRequiredAsterisk && <span className="required-asterisk">*</span>}
        </Label>
      )}

      {children}

      {error && (
        <HelperText id={`${fieldId}-error`} variant="error" role="alert">
          <span>⚠</span>
          {error}
        </HelperText>
      )}

      {hint && !error && (
        <HelperText id={`${fieldId}-hint`} variant="hint">
          {hint}
        </HelperText>
      )}
    </Container>
  );
};

FormFieldWrapper.displayName = 'FormFieldWrapper';

export default FormFieldWrapper;
