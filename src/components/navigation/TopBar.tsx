/**
 * TopBar - Application top navigation bar
 *
 * Fixed top navigation bar for displaying logo, workspace name,
 * and user/notification items.
 *
 * Features:
 * - Fixed positioning
 * - Logo area
 * - Workspace/title section
 * - Right-side action area
 * - Design token integration
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, shadows, zIndex } from '@/utils/tokens';

export interface TopBarProps {
  /** Logo/brand content */
  logo?: ReactNode;
  /** Title or workspace name */
  title?: ReactNode;
  /** Right-side content (user menu, notifications, etc.) */
  rightContent?: ReactNode;
  /** Additional className */
  className?: string;
}

// TopBar container
const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${colorTokens.background.primary};
  border-bottom: 1px solid ${colorTokens.border.primary};
  box-shadow: ${shadows.md};
  z-index: ${zIndex.sticky};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${spacing.lg};
  gap: ${spacing.lg};
`;

// Logo section
const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-shrink: 0;
  min-width: 0;
`;

// Title section
const TitleSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: ${spacing.md};
`;

// Title text
const Title = styled.h1`
  font-size: ${typography.heading3.fontSize};
  font-weight: ${typography.heading3.fontWeight};
  line-height: ${typography.heading3.lineHeight};
  color: ${colorTokens.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Right content section
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  flex-shrink: 0;
`;

/**
 * TopBar Component
 *
 * Fixed top navigation bar for the application shell.
 *
 * @example
 * <TopBar
 *   logo={<img src="logo.svg" />}
 *   title="Projects"
 *   rightContent={<UserMenu />}
 * />
 */
export const TopBar: React.FC<TopBarProps> = ({
  logo,
  title,
  rightContent,
  className,
}) => {
  return (
    <Container className={className}>
      <LogoSection>
        {logo}
      </LogoSection>

      {title && (
        <TitleSection>
          <Title>{title}</Title>
        </TitleSection>
      )}

      {rightContent && (
        <RightSection>
          {rightContent}
        </RightSection>
      )}
    </Container>
  );
};

TopBar.displayName = 'TopBar';

export default TopBar;
