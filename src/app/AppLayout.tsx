/**
 * App shell: sidebar navigation + routed content.
 */

import React, { Suspense } from 'react';
import styled from 'styled-components';
import { NavLink, Outlet } from 'react-router';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';
import { LoadingState } from '@/pages/shared/AsyncState';
import { A11yToolbar, A11yTools, MAIN_ID, NAV_ID, SkipLink } from '@/accessibility/A11yTools';
import { NAV_SECTIONS } from './navigation';

const Shell = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  /* Divide by the text-size zoom: zoom does not rescale vh */
  min-height: calc(100vh / var(--a11y-zoom, 1));
  background: ${colorTokens.background.primary};
  font-family: ${typography.body.fontFamily};
  color: ${colorTokens.text.primary};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const Sidebar = styled.nav`
  position: sticky;
  top: 0;
  height: calc(100vh / var(--a11y-zoom, 1));
  overflow-y: auto;
  padding: ${spacing.lg} ${spacing.md};
  background: ${colorTokens.neutral.lighter};
  border-right: 1px solid ${colorTokens.border.primary};

  @media (max-width: 768px) {
    position: static;
    height: auto;
    display: flex;
    /* Wrap rather than scroll sideways, so every workflow link is visible */
    flex-wrap: wrap;
    gap: ${spacing.xs} ${spacing.md};
    padding: ${spacing.sm} ${spacing.md};
    border-right: none;
    border-bottom: 1px solid ${colorTokens.border.primary};
  }
`;

const Brand = styled.div`
  font-family: ${typography.heading3.fontFamily};
  font-size: ${typography.heading3.fontSize};
  font-weight: 700;
  margin-bottom: ${spacing.lg};
  padding: 0 ${spacing.sm};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Section = styled.div`
  margin-bottom: ${spacing.lg};

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing.xs};
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${spacing.xs} 0;
  padding: 0 ${spacing.sm};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colorTokens.text.secondary};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
    gap: ${spacing.xs};
  }
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm};
  border-radius: 6px;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: ${colorTokens.secondary.light};
  }

  &:focus-visible {
    outline: 2px solid ${colorTokens.primary.main};
    outline-offset: 2px;
  }

  &.active {
    background: ${colorTokens.primary.main};
    color: ${colorTokens.text.inverse};
    font-weight: 600;
  }
`;

const Main = styled.main`
  min-width: 0;
  outline: none;
  /* Wide tables scroll inside the content area instead of the whole page */
  overflow-x: auto;
`;

export const AppLayout: React.FC = () => (
  <Shell>
    <SkipLink />
    <Sidebar id={NAV_ID} aria-label="Film production workflows">
      <Brand>🎬 MAATAA Film</Brand>
      <A11yToolbar />
      {NAV_SECTIONS.map((section) => (
        <Section key={section.title}>
          <SectionTitle>{section.title}</SectionTitle>
          <NavList>
            {section.items.map((item) => (
              <li key={item.to}>
                <NavItemLink to={item.to}>
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </NavItemLink>
              </li>
            ))}
          </NavList>
        </Section>
      ))}
    </Sidebar>
    <Main id={MAIN_ID} tabIndex={-1}>
      <Suspense fallback={<LoadingState announce={false} />}>
        <Outlet />
      </Suspense>
    </Main>
    <A11yTools />
  </Shell>
);

// ---------------------------------------------------------------------------
// Sub-navigation for workflows with more than one view
// ---------------------------------------------------------------------------

const TabBar = styled.nav`
  display: flex;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.lg} 0;
  border-bottom: 1px solid ${colorTokens.border.primary};
`;

const TabLink = styled(NavLink)`
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 2px solid transparent;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  text-decoration: none;

  &.active {
    color: ${colorTokens.text.primary};
    border-bottom-color: ${colorTokens.primary.main};
    font-weight: 600;
  }
`;

export const WorkflowTabs: React.FC<{ label: string; tabs: { label: string; to: string; end?: boolean }[] }> = ({
  label,
  tabs,
}) => (
  <>
    <TabBar aria-label={label}>
      {tabs.map((tab) => (
        <TabLink key={tab.to} to={tab.to} end={tab.end}>
          {tab.label}
        </TabLink>
      ))}
    </TabBar>
    <Suspense fallback={<LoadingState announce={false} />}>
      <Outlet />
    </Suspense>
  </>
);
