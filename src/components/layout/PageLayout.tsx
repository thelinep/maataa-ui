/**
 * PageLayout - Full-page layout with header, sidebar, and content
 *
 * A complete page layout component combining TopBar, Sidebar, and content area.
 *
 * Features:
 * - Fixed header
 * - Collapsible sidebar
 * - Main content area
 * - Responsive design
 * - Design token integration
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { spacing } from '@/utils/tokens';

export interface PageLayoutProps {
  /** Header content */
  header?: ReactNode;
  /** Sidebar content */
  sidebar?: ReactNode;
  /** Main content */
  children: ReactNode;
  /** Whether sidebar is initially collapsed */
  sidebarCollapsed?: boolean;
  /** Custom className */
  className?: string;
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

// Header area
const HeaderArea = styled.div`
  flex-shrink: 0;
  z-index: 100;
`;

// Main content wrapper
const MainWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Sidebar area
const SidebarArea = styled.div`
  flex-shrink: 0;
  z-index: 90;
  overflow-y: auto;
  height: 100%;
`;

// Content area
const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
`;

/**
 * PageLayout Component
 *
 * A complete page layout with header, sidebar, and content area.
 *
 * @example
 * <PageLayout
 *   header={<TopBar logo={<Logo />} title="My App" />}
 *   sidebar={<Sidebar sections={navSections} />}
 * >
 *   <h1>Page Content</h1>
 *   <p>Your content here</p>
 * </PageLayout>
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  header,
  sidebar,
  children,
  className,
}) => {

  return (
    <Container className={className}>
      {header && <HeaderArea>{header}</HeaderArea>}

      <MainWrapper>
        {sidebar && <SidebarArea>{sidebar}</SidebarArea>}

        <ContentArea>{children}</ContentArea>
      </MainWrapper>
    </Container>
  );
};

PageLayout.displayName = 'PageLayout';

export default PageLayout;
