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

  // Teams
  TEAMS: {
    id: 'teams',
    path: '/teams',
    label: 'Teams',
    section: 'main',
    entity_type: 'team',
  },
  TEAM_LIST: {
    id: 'teams-list',
    path: '/teams',
    label: 'All Teams',
    parent: 'teams',
  },
  TEAM_CREATE: {
    id: 'teams-create',
    path: '/teams/new',
    label: 'New Team',
    parent: 'teams',
  },
  TEAM_DETAIL: {
    id: 'team-detail',
    path: '/teams/:teamId',
    label: 'Team Details',
    parent: 'teams',
  },

  // Budgets
  BUDGETS: {
    id: 'budgets',
    path: '/budgets',
    label: 'Budgets',
    section: 'main',
    entity_type: 'budget',
  },
  BUDGET_LIST: {
    id: 'budgets-list',
    path: '/budgets',
    label: 'All Budgets',
    parent: 'budgets',
  },
  BUDGET_CREATE: {
    id: 'budgets-create',
    path: '/budgets/new',
    label: 'New Budget',
    parent: 'budgets',
  },
  BUDGET_DETAIL: {
    id: 'budget-detail',
    path: '/budgets/:budgetId',
    label: 'Budget Details',
    parent: 'budgets',
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
