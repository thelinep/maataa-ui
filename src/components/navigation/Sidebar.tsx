/**
 * Sidebar - Application sidebar navigation
 *
 * Collapsible sidebar navigation with sections and links.
 *
 * Features:
 * - Collapsible state
 * - Navigation sections
 * - Active link styling
 * - Design token integration
 */

import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, transitions, zIndex } from '@/utils/tokens';

export interface SidebarLink {
  id: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SidebarSection {
  id: string;
  title?: ReactNode;
  links: SidebarLink[];
}

export interface SidebarProps {
  /** Navigation sections */
  sections: SidebarSection[];
  /** Collapsed state */
  isCollapsed?: boolean;
  /** Collapse toggle handler */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Width when expanded */
  expandedWidth?: string;
  /** Width when collapsed */
  collapsedWidth?: string;
}

// Sidebar container
const Container = styled.aside<{ isCollapsed?: boolean; expandedWidth?: string; collapsedWidth?: string }>`
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: ${(props) => (props.isCollapsed ? props.collapsedWidth || '64px' : props.expandedWidth || '240px')};
  background-color: ${colorTokens.background.secondary};
  border-right: 1px solid ${colorTokens.border.primary};
  overflow-y: auto;
  z-index: ${zIndex.sticky - 1};
  transition: width ${transitions.normal};
  display: flex;
  flex-direction: column;
`;

// Collapse button
const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background: none;
  border: none;
  border-bottom: 1px solid ${colorTokens.border.primary};
  color: ${colorTokens.text.primary};
  cursor: pointer;
  font-size: 1.2em;
  transition: all ${transitions.fast};

  &:hover {
    background-color: ${colorTokens.background.primary};
  }

  &:focus {
    outline: none;
    background-color: ${colorTokens.background.tertiary};
  }
`;

// Sections container
const SectionsContainer = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.md} 0;
`;

// Section
const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

// Section title
const SectionTitle = styled.h3<{ isCollapsed?: boolean }>`
  font-size: ${typography.label.fontSize};
  font-weight: ${typography.label.fontWeight};
  line-height: ${typography.label.lineHeight};
  text-transform: ${typography.label.textTransform};
  color: ${colorTokens.text.secondary};
  margin: 0;
  padding: 0 ${spacing.md};
  display: ${(props) => (props.isCollapsed ? 'none' : 'block')};
  margin-bottom: ${spacing.sm};
`;

// Link container
const Link = styled.a<{ isActive?: boolean; disabled?: boolean; isCollapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm} ${spacing.md};
  color: ${(props) =>
    props.disabled
      ? colorTokens.text.disabled
      : props.isActive
      ? colorTokens.interactive.primary
      : colorTokens.text.primary};
  text-decoration: none;
  font-size: ${typography.body.fontSize};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all ${transitions.fast};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  margin: 0 ${spacing.sm};
  border-radius: 4px;

  background-color: ${(props) =>
    props.isActive ? colorTokens.background.tertiary : 'transparent'};

  &:hover:not([disabled]) {
    background-color: ${colorTokens.background.tertiary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colorTokens.interactive.primary};
  }

  /* Icon */
  svg {
    width: 1.2em;
    height: 1.2em;
    flex-shrink: 0;
  }

  /* Label visibility based on collapsed state */
  span {
    display: ${(props) => (props.isCollapsed ? 'none' : 'inline')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/**
 * Sidebar Component
 *
 * Collapsible sidebar navigation with sections and links.
 *
 * @example
 * <Sidebar
 *   sections={[
 *     {
 *       id: 'main',
 *       title: 'Main',
 *       links: [
 *         { id: 'projects', label: 'Projects', href: '/projects', icon: <IconProjects /> },
 *         { id: 'team', label: 'Team', href: '/team', icon: <IconTeam /> },
 *       ],
 *     },
 *   ]}
 * />
 */
export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  isCollapsed = false,
  onToggleCollapse,
  expandedWidth = '240px',
  collapsedWidth = '64px',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed);

  const handleToggle = () => {
    const newState = !internalCollapsed;
    setInternalCollapsed(newState);
    onToggleCollapse?.(newState);
  };

  const collapsed = isCollapsed ?? internalCollapsed;

  return (
    <Container isCollapsed={collapsed} expandedWidth={expandedWidth} collapsedWidth={collapsedWidth}>
      <CollapseButton
        onClick={handleToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        aria-label="Toggle sidebar"
      >
        {collapsed ? '→' : '←'}
      </CollapseButton>

      <SectionsContainer>
        {sections.map((section) => (
          <Section key={section.id}>
            {section.title && <SectionTitle isCollapsed={collapsed}>{section.title}</SectionTitle>}
            {section.links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                isActive={link.isActive}
                disabled={link.disabled}
                isCollapsed={collapsed}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                title={collapsed ? String(link.label) : undefined}
              >
                {link.icon && <span>{link.icon}</span>}
                {link.label && <span>{link.label}</span>}
              </Link>
            ))}
          </Section>
        ))}
      </SectionsContainer>
    </Container>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
