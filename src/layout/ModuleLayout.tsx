/**
 * ModuleLayout - Generic module page layout
 *
 * Layout for module pages with breadcrumb, title, and actions.
 */

import { ReactNode } from 'react';
import styled from 'styled-components';
import { Breadcrumb, type BreadcrumbItem } from '@/components';
import { spacing, typography, colorTokens } from '@/utils/tokens';

export interface ModuleLayoutProps {
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Page title */
  title: ReactNode;
  /** Page subtitle/description */
  subtitle?: ReactNode;
  /** Action buttons/controls */
  actions?: ReactNode;
  /** Main content */
  children: ReactNode;
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

// Breadcrumb section
const BreadcrumbSection = styled.div`
  display: flex;
  align-items: center;
`;

// Header section
const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${spacing.lg};
`;

// Title section
const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  flex: 1;
  min-width: 0;
`;

// Title
const Title = styled.h1`
  font-size: ${typography.heading2.fontSize};
  font-weight: ${typography.heading2.fontWeight};
  line-height: ${typography.heading2.lineHeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

// Subtitle
const Subtitle = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
`;

// Actions section
const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-shrink: 0;
`;

// Content
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  margin-top: ${spacing.md};
`;

/**
 * ModuleLayout Component
 *
 * Generic layout for module/page views.
 *
 * @example
 * <ModuleLayout
 *   breadcrumbs={[
 *     { label: 'Workspace', href: '/' },
 *     { label: 'Projects', href: '/projects' },
 *     { label: 'Project Name', isCurrent: true },
 *   ]}
 *   title="Project Name"
 *   subtitle="Main project workspace"
 *   actions={<Button>New Item</Button>}
 * >
 *   <ProjectContent />
 * </ModuleLayout>
 */
export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  breadcrumbs,
  title,
  subtitle,
  actions,
  children,
}) => {
  return (
    <Container>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbSection>
          <Breadcrumb items={breadcrumbs} />
        </BreadcrumbSection>
      )}

      <HeaderSection>
        <TitleSection>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleSection>

        {actions && <ActionsSection>{actions}</ActionsSection>}
      </HeaderSection>

      <Content>{children}</Content>
    </Container>
  );
};

ModuleLayout.displayName = 'ModuleLayout';

export default ModuleLayout;
