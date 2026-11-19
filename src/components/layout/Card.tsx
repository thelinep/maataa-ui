/**
 * Card - Foundational layout container component
 *
 * A reusable card component for displaying grouped content.
 * Provides consistent styling, spacing, and optional sections
 * for headers, body, and footer content.
 *
 * Features:
 * - Optional header section
 * - Body section
 * - Optional footer section
 * - Customizable padding and styling
 * - Design token integration
 */

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius, shadows, typography } from '@/utils/tokens';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Header content */
  header?: ReactNode;
  /** Body content */
  children?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
  /** Whether to show a border */
  bordered?: boolean;
  /** Whether to show a shadow */
  shadowed?: boolean;
  /** Custom background color */
  bgColor?: string;
}

// Get padding value
const getPaddingValue = (padding: 'sm' | 'md' | 'lg') => {
  switch (padding) {
    case 'sm':
      return spacing.md;
    case 'lg':
      return spacing.xl;
    default:
      return spacing.lg;
  }
};

// Container
const Container = styled.div<{ bordered?: boolean; shadowed?: boolean; padding?: 'sm' | 'md' | 'lg'; bgColor?: string }>`
  background-color: ${(props) => props.bgColor || colorTokens.background.primary};
  border-radius: ${borderRadius.lg};
  border: ${(props) => (props.bordered ? `1px solid ${colorTokens.border.primary}` : 'none')};
  box-shadow: ${(props) => (props.shadowed ? shadows.md : 'none')};
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    ${(props) => props.shadowed && `box-shadow: ${shadows.lg};`}
  }
`;

// Header
const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colorTokens.border.secondary};

  h2, h3, h4 {
    margin: 0;
    font-size: ${typography.heading3.fontSize};
    font-weight: ${typography.heading3.fontWeight};
    line-height: ${typography.heading3.lineHeight};
    color: ${colorTokens.text.primary};
  }

  h4 {
    font-size: ${typography.heading2.fontSize};
  }
`;

// Body
const BodySection = styled.div<{ padding?: 'sm' | 'md' | 'lg' }>`
  padding: ${(props) => getPaddingValue(props.padding || 'md')};
`;

// Footer
const FooterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  border-top: 1px solid ${colorTokens.border.secondary};
  background-color: ${colorTokens.background.secondary};
`;

/**
 * Card Component
 *
 * A flexible card container for displaying grouped content.
 * Supports optional header and footer sections.
 *
 * @example
 * <Card header="Card Title">
 *   <p>Card content goes here</p>
 * </Card>
 *
 * @example
 * <Card
 *   header="Settings"
 *   footer={<Button>Save</Button>}
 *   bordered
 *   shadowed
 * >
 *   <FormInput label="Name" />
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      header,
      footer,
      children,
      padding = 'md',
      bordered = true,
      shadowed = true,
      bgColor,
      ...props
    },
    ref
  ) => {
    return (
      <Container ref={ref} bordered={bordered} shadowed={shadowed} bgColor={bgColor} {...props}>
        {header && (
          <HeaderSection>
            {typeof header === 'string' ? <h3>{header}</h3> : header}
          </HeaderSection>
        )}

        {children && <BodySection padding={padding}>{children}</BodySection>}

        {footer && <FooterSection>{footer}</FooterSection>}
      </Container>
    );
  }
);

Card.displayName = 'Card';

export default Card;
