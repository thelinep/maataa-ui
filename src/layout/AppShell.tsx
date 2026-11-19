/**
 * AppShell - Main application shell
 *
 * The root layout component that provides the app structure:
 * - Top navigation bar
 * - Collapsible sidebar
 * - Main content area
 * - Workspace switching
 */

import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { PageLayout, TopBar, Sidebar, type SidebarSection } from '@/components';
import { colorTokens, spacing } from '@/utils/tokens';

export interface AppShellProps {
  /** Page title/heading */
  title?: ReactNode;
  /** Main page content */
  children: ReactNode;
  /** Sidebar navigation sections */
  navSections?: SidebarSection[];
  /** Current workspace name */
  workspace?: string;
  /** User info for menu */
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  /** User menu items */
  onUserMenuClick?: (action: string) => void;
}

// Logo placeholder
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: 18px;
`;

// User avatar
const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${colorTokens.interactive.primary};
  color: ${colorTokens.background.primary};
  font-weight: 600;
  font-size: 14px;
`;

// User info
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  div:first-child {
    font-weight: 500;
    color: ${colorTokens.text.primary};
    font-size: 14px;
  }

  div:last-child {
    color: ${colorTokens.text.secondary};
    font-size: 12px;
  }
`;

// User menu button
const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${colorTokens.text.primary};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colorTokens.interactive.primary};
    border-radius: 4px;
  }
`;

/**
 * AppShell Component
 *
 * Main application shell providing layout structure for all pages.
 *
 * @example
 * <AppShell
 *   title="Projects"
 *   workspace="Acme Corp"
 *   user={{ name: "John Doe", email: "john@example.com" }}
 *   navSections={navigationSections}
 * >
 *   <ProjectListPage />
 * </AppShell>
 */
export const AppShell: React.FC<AppShellProps> = ({
  title,
  children,
  navSections = [],
  workspace = 'Workspace',
  user,
  onUserMenuClick,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Create logo
  const logo = (
    <LogoContainer>
      🎭 MAATAA
    </LogoContainer>
  );

  // Create user menu
  const userMenuContent = user && (
    <UserMenuButton onClick={() => onUserMenuClick?.('menu')}>
      <UserAvatar title={user.name}>
        {user.name.charAt(0).toUpperCase()}
      </UserAvatar>
      <UserInfo>
        <div>{user.name}</div>
        <div>{user.email}</div>
      </UserInfo>
    </UserMenuButton>
  );

  // Create top bar
  const topBar = (
    <TopBar
      logo={logo}
      title={title || workspace}
      rightContent={userMenuContent}
    />
  );

  // Create sidebar
  const sidebar = navSections.length > 0 && (
    <Sidebar
      sections={navSections}
      isCollapsed={isSidebarCollapsed}
      onToggleCollapse={setIsSidebarCollapsed}
    />
  );

  return (
    <PageLayout
      header={topBar}
      sidebar={sidebar}
    >
      {children}
    </PageLayout>
  );
};

AppShell.displayName = 'AppShell';

export default AppShell;
