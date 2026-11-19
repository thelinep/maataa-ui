/**
 * Navigation Links
 *
 * Sidebar navigation structure with icons and organization.
 */

import { SidebarSection } from '@/components';
import { getMainNavSections, getSecondaryNavSections, ROUTES } from './routes';

/**
 * Icons for navigation items (using simple text placeholders)
 * In production, these would be SVG icon components
 */
const NAV_ICONS: Record<string, string> = {
  workspace: '🏢',
  projects: '📋',
  team: '👥',
  budget: '💰',
  schedule: '📅',
  settings: '⚙️',
};

/**
 * Generate sidebar navigation sections
 */
export function getSidebarSections(): SidebarSection[] {
  const mainSections = getMainNavSections();
  const secondarySections = getSecondaryNavSections();

  const sections: SidebarSection[] = [];

  // Main navigation section
  if (mainSections.length > 0) {
    sections.push({
      id: 'main-nav',
      title: 'Workspace',
      links: mainSections.map((route) => ({
        id: route.id,
        label: route.label,
        href: route.path,
        icon: NAV_ICONS[route.id] || '◆',
        isActive: false,
      })),
    });
  }

  // Secondary navigation section
  if (secondarySections.length > 0) {
    sections.push({
      id: 'secondary-nav',
      title: 'Settings',
      links: secondarySections.map((route) => ({
        id: route.id,
        label: route.label,
        href: route.path,
        icon: NAV_ICONS[route.id] || '◆',
        isActive: false,
      })),
    });
  }

  return sections;
}

/**
 * Update active link in navigation sections
 */
export function getNavSectionsWithActive(currentPath: string): SidebarSection[] {
  const sections = getSidebarSections();

  return sections.map((section) => ({
    ...section,
    links: section.links.map((link) => ({
      ...link,
      isActive: link.href === currentPath,
    })),
  }));
}

/**
 * Get breadcrumb items from route hierarchy
 */
export function getBreadcrumbItems(currentRouteId: string): Array<{ label: string; href: string }> {
  const route = Object.values(ROUTES).find((r) => r.id === currentRouteId);
  if (!route) return [];

  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];

  // Add parent route if exists
  if (route.parent) {
    const parentRoute = Object.values(ROUTES).find((r) => r.id === route.parent);
    if (parentRoute) {
      breadcrumbs.push({
        label: parentRoute.label,
        href: parentRoute.path,
      });
    }
  }

  // Add current route (if not home)
  if (currentRouteId !== 'home') {
    breadcrumbs.push({
      label: route.label,
      href: route.path,
    });
  }

  return breadcrumbs;
}
