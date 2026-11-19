/**
 * WorkspaceLayout - Workspace container layout
 *
 * Layout for workspace-level views with tabs for different sections.
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { Card, Tabs, type TabItem } from '@/components';
import { spacing, typography, colorTokens } from '@/utils/tokens';

export interface WorkspaceLayoutProps {
  /** Workspace name */
  name?: string;
  /** Workspace description */
  description?: ReactNode;
  /** Tab sections */
  tabs?: TabItem[];
  /** Active tab ID */
  activeTab?: string;
  /** Tab selection handler */
  onTabChange?: (tabId: string) => void;
}

// Header container
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

// Workspace title
const WorkspaceTitle = styled.h1`
  font-size: ${typography.heading1.fontSize};
  font-weight: ${typography.heading1.fontWeight};
  line-height: ${typography.heading1.lineHeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

// Workspace description
const WorkspaceDescription = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
`;

// Content wrapper
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

/**
 * WorkspaceLayout Component
 *
 * Layout for workspace-level pages with tabs.
 *
 * @example
 * <WorkspaceLayout
 *   name="Acme Corp"
 *   description="Main workspace for project management"
 *   tabs={[
 *     { id: 'overview', label: 'Overview', content: <Overview /> },
 *     { id: 'team', label: 'Team', content: <Team /> },
 *   ]}
 *   activeTab="overview"
 *   onTabChange={setActiveTab}
 * />
 */
export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  name,
  description,
  tabs = [],
  activeTab,
  onTabChange,
}) => {
  return (
    <>
      <HeaderContainer>
        {name && <WorkspaceTitle>{name}</WorkspaceTitle>}
        {description && <WorkspaceDescription>{description}</WorkspaceDescription>}
      </HeaderContainer>

      <ContentWrapper>
        {tabs.length > 0 && (
          <Card bordered shadowed>
            <Tabs
              items={tabs}
              activeTabId={activeTab}
              onSelectTab={onTabChange}
            />
          </Card>
        )}
      </ContentWrapper>
    </>
  );
};

WorkspaceLayout.displayName = 'WorkspaceLayout';

export default WorkspaceLayout;
