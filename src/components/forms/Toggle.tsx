/**
 * Toggle - Toggle switch component
 *
 * A styled toggle switch component for boolean state toggling.
 *
 * Features:
 * - Toggle switch with custom styling
 * - Label support
 * - Animated slide transition
 * - Keyboard support (Space to toggle)
 * - Design token integration
 */

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions, borderRadius } from '@/utils/tokens';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: ReactNode;
  /** Label position */
  labelPosition?: 'left' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom id */
  id?: string;
  /** Description text */
  description?: ReactNode;
}

// Container
const Container = styled.div<{ labelPosition?: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-direction: ${(props) => (props.labelPosition === 'left' ? 'row-reverse' : 'row')};
`;

// Content wrapper
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

// Hidden checkbox
const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
`;

// Toggle track
const ToggleTrack = styled.div<{ size?: 'sm' | 'md' | 'lg'; isChecked?: boolean; disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '36px';
      case 'lg':
        return '56px';
      default:
        return '44px';
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '20px';
      case 'lg':
        return '28px';
      default:
        return '24px';
    }
  }};
  background-color: ${(props) =>
    props.isChecked ? colorTokens.interactive.success : colorTokens.border.primary};
  border-radius: ${borderRadius.round};
  transition: background-color ${transitions.normal};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  flex-shrink: 0;
`;

// Toggle thumb
const ToggleThumb = styled.div<{ size?: 'sm' | 'md' | 'lg'; isChecked?: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.isChecked ? 'calc(100% - 18px)' : '2px')};
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
  background-color: ${colorTokens.background.primary};
  border-radius: 50%;
  transition: left ${transitions.normal};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
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
 * Toggle Component
 *
 * A styled toggle switch component for boolean state toggling.
 *
 * @example
 * <Toggle
 *   id="notifications"
 *   label="Enable notifications"
 *   checked={notificationsEnabled}
 *   onChange={(e) => setNotificationsEnabled(e.target.checked)}
 * />
 *
 * @example
 * <Toggle
 *   id="darkMode"
 *   label="Dark mode"
 *   labelPosition="left"
 *   description="Use dark theme"
 *   size="lg"
 * />
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      labelPosition = 'right',
      size = 'md',
      id,
      disabled = false,
      description,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <Container labelPosition={labelPosition}>
        <HiddenCheckbox
          ref={ref}
          id={toggleId}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          {...props}
        />

        <ToggleTrack
          size={size}
          isChecked={!!checked}
          disabled={disabled}
          onClick={() => {
            if (!disabled && ref && 'current' in ref && ref.current) {
              ref.current.click();
            }
          }}
        >
          <ToggleThumb size={size} isChecked={!!checked} />
        </ToggleTrack>

        {label && (
          <ContentWrapper>
            <Label htmlFor={toggleId}>
              <LabelText>{label}</LabelText>
              {description && <Description>{description}</Description>}
            </Label>
          </ContentWrapper>
        )}
      </Container>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
