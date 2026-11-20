/**
 * DetailLayout - Entity detail page layout
 *
 * Layout for entity detail pages with header, tabs, and sidebar.
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { Card, Tabs, type TabItem } from '@/components';
import { spacing, typography, colorTokens, borderRadius } from '@/utils/tokens';

export interface DetailLayoutProps {
  /** Entity title */
  title: ReactNode;
  /** Entity description/status */
  status?: ReactNode;
  /** Detail information */
  meta?: Array<{ label: string; value: ReactNode }>;
  /** Tab sections */
  tabs?: TabItem[];
  /** Active tab ID */
  activeTab?: string;
  /** Tab selection handler */
  onTabChange?: (tabId: string) => void;
  /** Sidebar content */
  sidebar?: ReactNode;
}

// Container
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Main content area
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

// Header
const Header = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

// Title
const Title = styled.h1`
  font-size: ${typography.heading2.fontSize};
  font-weight: ${typography.heading2.fontWeight};
  line-height: ${typography.heading2.lineHeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

// Status badge
const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colorTokens.background.tertiary};
  color: ${colorTokens.text.secondary};
  border-radius: ${borderRadius.md};
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 500;
  width: fit-content;
`;

// Meta information
const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid ${colorTokens.border.secondary};
`;

// Meta item
const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

// Meta label
const MetaLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  font-weight: 500;
`;

// Meta value
const MetaValue = styled.span`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  font-weight: 500;
`;

// Tabs section
const TabsSection = styled(Card)``;

// Sidebar
const SidebarArea = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};

  @media (max-width: 1024px) {
    display: none;
  }
`;

/**
 * DetailLayout Component
 *
 * Layout for entity detail pages with header, tabs, and sidebar.
 *
 * @example
 * <DetailLayout
 *   title="Project Name"
 *   status="Active"
 *   meta={[
 *     { label: 'Owner', value: 'John Doe' },
 *     { label: 'Start Date', value: '2024-01-01' },
 *   ]}
 *   tabs={[
 *     { id: 'overview', label: 'Overview', content: <Overview /> },
 *     { id: 'team', label: 'Team', content: <Team /> },
 *   ]}
 *   sidebar={<ProjectSidebar />}
 * />
 */
export const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  status,
  meta = [],
  tabs = [],
  activeTab,
  onTabChange,
  sidebar,
}) => {
  return (
    <Container>
      <MainContent>
        <Header bordered shadowed>
          <div>
            <Title>{title}</Title>
            {status && <Status>{status}</Status>}
          </div>

          {meta.length > 0 && (
            <MetaGrid>
              {meta.map((item, index) => (
                <MetaItem key={index}>
                  <MetaLabel>{item.label}</MetaLabel>
                  <MetaValue>{item.value}</MetaValue>
                </MetaItem>
              ))}
            </MetaGrid>
          )}
        </Header>

        {tabs.length > 0 && (
          <TabsSection bordered shadowed>
            <Tabs
              items={tabs}
              activeTabId={activeTab}
              onSelectTab={onTabChange}
              variant="default"
            />
          </TabsSection>
        )}
      </MainContent>

      {sidebar && (
        <SidebarArea>
          {sidebar}
        </SidebarArea>
      )}
    </Container>
  );
};

DetailLayout.displayName = 'DetailLayout';

export default DetailLayout;
