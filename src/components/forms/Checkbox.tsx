/**
 * Checkbox - Checkbox input component
 *
 * A styled checkbox component with label support and design token integration.
 *
 * Features:
 * - Checkbox with custom styling
 * - Label support
 * - Indeterminate state support
 * - Keyboard navigation
 * - Design token integration
 */

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: ReactNode;
  /** Whether checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom id */
  id?: string;
  /** Description text */
  description?: ReactNode;
}

// Container
const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};
`;

// Checkbox wrapper
const CheckboxWrapper = styled.div<{ size?: 'sm' | 'md' | 'lg'; disabled?: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '2px';
      case 'lg':
        return '4px';
      default:
        return '2px';
    }
  }};
`;

// Hidden checkbox
const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
`;

// Styled checkbox box
const CheckboxBox = styled.div<{ size?: 'sm' | 'md' | 'lg'; isChecked?: boolean; isIndeterminate?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '16px';
      case 'lg':
        return '24px';
      default:
        return '20px';
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '16px';
      case 'lg':
        return '24px';
      default:
        return '20px';
    }
  }};
  border: 2px solid ${(props) => (props.disabled ? colorTokens.border.secondary : colorTokens.border.primary)};
  border-radius: ${borderRadius.sm};
  background-color: ${(props) =>
    props.isChecked || props.isIndeterminate
      ? colorTokens.interactive.primary
      : colorTokens.background.primary};
  transition: all ${transitions.fast};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  /* Checkmark or dash */
  &::after {
    content: '';
    display: block;
    width: ${(props) => {
      switch (props.size) {
        case 'sm':
          return '8px';
        case 'lg':
          return '12px';
        default:
          return '10px';
      }
    }};
    height: ${(props) => {
      switch (props.size) {
        case 'sm':
          return '4px';
        case 'lg':
          return '6px';
        default:
          return '5px';
      }
    }};
    background-color: ${colorTokens.background.primary};
    ${(props) => (props.isIndeterminate ? `border-radius: 0;` : `clip-path: polygon(14% 44%, 0 65%, 46% 100%, 100% 16%, 80% 0%, 43% 62%);`)}
  }

  ${(props) => !props.isChecked && !props.isIndeterminate && `&::after { display: none; }`}
`;

// Label
const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  cursor: pointer;
  user-select: none;

  font-size: ${typography.body.fontSize};
  font-weight: 400;
  color: ${colorTokens.text.primary};
`;

// Label text
const LabelText = styled.span`
  font-weight: 500;
`;

// Description
const Description = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  font-weight: 400;
`;

/**
 * Checkbox Component
 *
 * A styled checkbox component with label support.
 *
 * @example
 * <Checkbox
 *   id="terms"
 *   label="I agree to terms"
 *   description="Read our terms and conditions"
 * />
 *
 * @example
 * <Checkbox
 *   checked={isSelected}
 *   onChange={(e) => setSelected(e.target.checked)}
 *   label="Select this option"
 * />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      size = 'md',
      id,
      disabled = false,
      description,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || `checkbox-${generatedId}`;

    return (
      <Container>
        <CheckboxWrapper size={size} disabled={disabled}>
          <HiddenCheckbox
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          <CheckboxBox
            size={size}
            isChecked={!!checked}
            isIndeterminate={indeterminate && !checked}
            disabled={disabled}
          />
        </CheckboxWrapper>

        {label && (
          <Label htmlFor={checkboxId}>
            <LabelText>{label}</LabelText>
            {description && <Description>{description}</Description>}
          </Label>
        )}
      </Container>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
