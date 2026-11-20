/**
 * Radio - Radio button component
 *
 * A styled radio button component for single-choice selection within a group.
 *
 * Features:
 * - Radio button with custom styling
 * - Label support
 * - Group management with RadioGroup
 * - Keyboard navigation
 * - Design token integration
 */

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions } from '@/utils/tokens';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: ReactNode;
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

// Radio wrapper
const RadioWrapper = styled.div<{ size?: 'sm' | 'md' | 'lg'; disabled?: boolean }>`
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

// Hidden radio
const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
`;

// Styled radio circle
const RadioCircle = styled.div<{ size?: 'sm' | 'md' | 'lg'; isChecked?: boolean; disabled?: boolean }>`
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
  border-radius: 50%;
  background-color: ${colorTokens.background.primary};
  transition: all ${transitions.fast};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  /* Inner dot when checked */
  &::after {
    content: '';
    display: ${(props) => (props.isChecked ? 'block' : 'none')};
    width: ${(props) => {
      switch (props.size) {
        case 'sm':
          return '6px';
        case 'lg':
          return '10px';
        default:
          return '8px';
      }
    }};
    height: ${(props) => {
      switch (props.size) {
        case 'sm':
          return '6px';
        case 'lg':
          return '10px';
        default:
          return '8px';
      }
    }};
    background-color: ${(props) => (props.isChecked ? colorTokens.interactive.primary : 'transparent')};
    border-radius: 50%;
  }
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
 * Radio Component
 *
 * A styled radio button component for single-choice selection.
 *
 * @example
 * <fieldset>
 *   <legend>Choose option</legend>
 *   <Radio
 *     name="option"
 *     value="a"
 *     label="Option A"
 *     checked={selected === 'a'}
 *     onChange={(e) => setSelected(e.target.value)}
 *   />
 *   <Radio
 *     name="option"
 *     value="b"
 *     label="Option B"
 *     checked={selected === 'b'}
 *     onChange={(e) => setSelected(e.target.value)}
 *   />
 * </fieldset>
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
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
    const radioId = id || `radio-${generatedId}`;

    return (
      <Container>
        <RadioWrapper size={size} disabled={disabled}>
          <HiddenRadio
            ref={ref}
            id={radioId}
            type="radio"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          <RadioCircle
            size={size}
            isChecked={!!checked}
            disabled={disabled}
          />
        </RadioWrapper>

        {label && (
          <Label htmlFor={radioId}>
            <LabelText>{label}</LabelText>
            {description && <Description>{description}</Description>}
          </Label>
        )}
      </Container>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
