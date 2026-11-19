/**
 * Route Definitions
 *
 * Centralized route definitions for the application.
 * Each route maps to a workflow or page in the system.
 */

export interface RouteConfig {
  id: string;
  path: string;
  label: string;
  icon?: string;
  parent?: string;
  children?: string[];
  section?: string;
  entity_type?: string;
}

// Define all application routes
export const ROUTES: Record<string, RouteConfig> = {
  // Root
  HOME: {
    id: 'home',
    path: '/',
    label: 'Home',
  },

  // Workspace
  WORKSPACE: {
    id: 'workspace',
    path: '/workspace',
    label: 'Workspace',
    section: 'main',
  },

  // Projects
  PROJECTS: {
    id: 'projects',
    path: '/projects',
    label: 'Projects',
    section: 'main',
    entity_type: 'project',
  },
  PROJECT_LIST: {
    id: 'projects-list',
    path: '/projects',
    label: 'All Projects',
    parent: 'projects',
  },
  PROJECT_CREATE: {
    id: 'projects-create',
    path: '/projects/new',
    label: 'New Project',
    parent: 'projects',
  },
  PROJECT_DETAIL: {
    id: 'project-detail',
    path: '/projects/:projectId',
    label: 'Project Details',
    parent: 'projects',
  },

  // Team
  TEAM: {
    id: 'team',
    path: '/team',
    label: 'Team',
    section: 'main',
    entity_type: 'person',
  },
  TEAM_LIST: {
    id: 'team-list',
    path: '/team',
    label: 'Team Members',
    parent: 'team',
  },
  TEAM_MEMBER: {
    id: 'team-member',
    path: '/team/:memberId',
    label: 'Team Member',
    parent: 'team',
  },

  // Budget
  BUDGET: {
    id: 'budget',
    path: '/budget',
    label: 'Budget',
    section: 'main',
  },
  BUDGET_OVERVIEW: {
    id: 'budget-overview',
    path: '/budget',
    label: 'Budget Overview',
    parent: 'budget',
  },

  // Schedule
  SCHEDULE: {
    id: 'schedule',
    path: '/schedule',
    label: 'Schedule',
    section: 'main',
  },
  SCHEDULE_CALENDAR: {
    id: 'schedule-calendar',
    path: '/schedule',
    label: 'Calendar',
    parent: 'schedule',
  },

  // Settings
  SETTINGS: {
    id: 'settings',
    path: '/settings',
    label: 'Settings',
    section: 'secondary',
  },
  SETTINGS_PROFILE: {
    id: 'settings-profile',
    path: '/settings/profile',
    label: 'Profile',
    parent: 'settings',
  },
  SETTINGS_WORKSPACE: {
    id: 'settings-workspace',
    path: '/settings/workspace',
    label: 'Workspace Settings',
    parent: 'settings',
  },

  // Not Found
  NOT_FOUND: {
    id: 'not-found',
    path: '/404',
    label: 'Not Found',
  },
};

/**
 * Get route configuration by ID
 */
export function getRoute(routeId: keyof typeof ROUTES): RouteConfig {
  return ROUTES[routeId];
}

/**
 * Get route path with parameters
 */
export function getRoutePath(routeId: keyof typeof ROUTES, params?: Record<string, string>): string {
  const route = getRoute(routeId);
  let path = route.path;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }

  return path;
}

/**
 * Get main navigation sections
 */
export function getMainNavSections(): RouteConfig[] {
  return Object.values(ROUTES).filter((route) => route.section === 'main' && !route.parent);
}

/**
 * Get secondary navigation sections
 */
export function getSecondaryNavSections(): RouteConfig[] {
  return Object.values(ROUTES).filter((route) => route.section === 'secondary' && !route.parent);
}

/**
 * Get children routes for a parent
 */
export function getChildRoutes(parentId: string): RouteConfig[] {
  return Object.values(ROUTES).filter((route) => route.parent === parentId);
}
