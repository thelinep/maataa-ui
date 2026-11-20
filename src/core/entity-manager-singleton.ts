/**
 * Entity Manager Singleton
 *
 * Provides a single instance of EntityManager throughout the app
 * Pre-populated with mock project data for initial UI testing
 */

import { EntityManager } from './phase2-entity-manager';

let instance: EntityManager | null = null;

/**
 * Get or create the EntityManager singleton
 */
export function getEntityManager(): EntityManager {
  if (!instance) {
    instance = new EntityManager();
    initializeMockData(instance);
  }
  return instance;
}

/**
 * Initialize with mock project data for UI testing
 * TODO: Replace with real data from backend
 */
function initializeMockData(manager: EntityManager): void {
  // Mock projects stored as organizations with "project" tag
  const projects = [
    {
      type: 'organization' as const,
      name: 'Website Redesign',
      description: 'Complete redesign of marketing website',
      tags: ['project'],
      metadata: {
        status: 'active',
        teamSize: 5,
      },
    },
    {
      type: 'organization' as const,
      name: 'Mobile App Beta',
      description: 'iOS and Android native apps',
      tags: ['project'],
      metadata: {
        status: 'planning',
        teamSize: 8,
      },
    },
    {
      type: 'organization' as const,
      name: 'Data Analytics Dashboard',
      description: 'Real-time analytics and reporting',
      tags: ['project'],
      metadata: {
        status: 'active',
        teamSize: 3,
      },
    },
    {
      type: 'organization' as const,
      name: 'Legacy System Migration',
      description: 'Migrate from old infrastructure',
      tags: ['project'],
      metadata: {
        status: 'paused',
        teamSize: 6,
      },
    },
  ];

  projects.forEach(project => {
    manager.createEntity(project as any);
  });
}

export default getEntityManager;
