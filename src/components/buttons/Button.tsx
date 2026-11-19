/**
 * Button - Foundational button component
 *
 * A flexible, accessible button component with multiple variants,
 * sizes, and states. All button interactions throughout the app
 * should use this component.
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, destructive, ghost)
 * - Multiple sizes (sm, md, lg)
 * - Loading and disabled states
 * - Full keyboard navigation and accessibility
 * - Design token integration
 */

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions, shadows } from '@/utils/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Whether button is in loading state */
  isLoading?: boolean;
  /** Loading indicator content */
  loadingContent?: ReactNode;
  /** Whether to display as a block (full width) */
  isBlock?: boolean;
  /** Icon to display before text */
  leftIcon?: ReactNode;
  /** Icon to display after text */
  rightIcon?: ReactNode;
}

// Get colors based on variant
const getVariantColors = (variant: ButtonVariant, disabled?: boolean) => {
  if (disabled) {
    return {
      bg: colorTokens.background.secondary,
      color: colorTokens.text.disabled,
      border: colorTokens.border.secondary,
      bgHover: colorTokens.background.secondary,
    };
  }

  switch (variant) {
    case 'primary':
      return {
        bg: colorTokens.interactive.primary,
        color: colorTokens.background.primary,
        border: colorTokens.interactive.primary,
        bgHover: '#7A6240', // Darker shade
      };
    case 'secondary':
      return {
        bg: colorTokens.background.secondary,
        color: colorTokens.interactive.primary,
        border: colorTokens.border.primary,
        bgHover: colorTokens.background.tertiary,
      };
    case 'outline':
      return {
        bg: 'transparent',
        color: colorTokens.interactive.primary,
        border: colorTokens.border.primary,
        bgHover: colorTokens.background.secondary,
      };
    case 'destructive':
      return {
        bg: colorTokens.interactive.error,
        color: colorTokens.background.primary,
        border: colorTokens.interactive.error,
        bgHover: '#702B23', // Darker shade
      };
    case 'ghost':
      return {
        bg: 'transparent',
        color: colorTokens.interactive.primary,
        border: 'transparent',
        bgHover: colorTokens.background.secondary,
      };
    default:
      return {
        bg: colorTokens.interactive.primary,
        color: colorTokens.background.primary,
        border: colorTokens.interactive.primary,
        bgHover: '#7A6240',
      };
  }
};

// Get padding based on size
const getPadding = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return `${spacing.xs} ${spacing.sm}`;
    case 'lg':
      return `${spacing.md} ${spacing.lg}`;
    default:
      return `${spacing.sm} ${spacing.md}`;
  }
};

// Get font size based on size
const getFontSize = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return '12px';
    case 'lg':
      return '16px';
    default:
      return typography.body.fontSize;
  }
};

// Styled button
const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading: boolean;
  isBlock: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  font-family: ${typography.body.fontFamily};
  font-size: ${(props) => getFontSize(props.size)};
  font-weight: 500;
  line-height: 1.4;
  padding: ${(props) => getPadding(props.size)};
  border-radius: ${borderRadius.md};
  border: 1px solid ${(props) => getVariantColors(props.variant, props.disabled).border};
  background-color: ${(props) => getVariantColors(props.variant, props.disabled).bg};
  color: ${(props) => getVariantColors(props.variant, props.disabled).color};

  /* Layout */
  width: ${(props) => (props.isBlock ? '100%' : 'auto')};

  /* Transitions */
  transition:
    background-color ${transitions.fast},
    border-color ${transitions.fast},
    box-shadow ${transitions.fast},
    opacity ${transitions.fast};

  /* Cursor */
  cursor: ${(props) => (props.disabled || props.isLoading ? 'not-allowed' : 'pointer')};

  /* Focus state */
  &:focus {
    outline: none;
    box-shadow:
      0 0 0 3px ${(props) => {
        const colors = getVariantColors(props.variant, props.disabled);
        const color = colors.border === 'transparent' ? colorTokens.interactive.primary : colors.border;
        return color + '33'; // 20% opacity
      }};
  }

  /* Hover state */
  &:hover:not(:disabled) {
    background-color: ${(props) => getVariantColors(props.variant, props.disabled).bgHover};
    box-shadow: ${shadows.md};
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading state */
  ${(props) =>
    props.isLoading &&
    `
    opacity: 0.8;
    cursor: wait;
    pointer-events: none;
  `}

  /* Icon sizing */
  svg {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
  }
`;

// Spinner animation
const Spinner = styled.div`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Button Component
 *
 * A flexible, accessible button component with support for
 * multiple variants, sizes, and states.
 *
 * @example
 * <Button>Click me</Button>
 *
 * @example
 * <Button variant="destructive" size="lg">Delete</Button>
 *
 * @example
 * <Button isLoading>Loading...</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingContent = 'Loading...',
      isBlock = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        isLoading={isLoading}
        isBlock={isBlock}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            {loadingContent}
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
