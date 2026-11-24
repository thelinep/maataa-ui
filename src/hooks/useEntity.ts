/**
 * useEntity - Hook for managing Phase 2 entities
 *
 * Provides access to entity CRUD operations via Phase 2 EntityManager.
 * Integrates with Phase 5 for real-time sync.
 */

import { useState, useCallback, useEffect } from 'react';
import { getEntityManager } from '@/core/entity-manager-singleton';
import type { EntityType, Organization } from '@/core/phase2-entity-manager';

export interface Entity {
  id: string;
  type: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  relationships?: Record<string, string[]>;
}

/** Fields a project can be created or updated with. */
export interface ProjectInput {
  name?: string;
  description?: string;
  status?: string;
  teamSize?: number;
}

export interface EntitySchema {
  id: string;
  type: string;
  fields: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'relationship';
    required?: boolean;
    validation?: Record<string, unknown>;
  }>;
}

export interface UseEntityOptions {
  /** Entity ID to load */
  entityId?: string;
  /** Entity type */
  type?: string;
  /** Whether to auto-fetch on mount */
  autoFetch?: boolean;
}

export interface UseEntityReturn {
  /** Current entity */
  entity: Entity | null;
  /** Entity schema */
  schema: EntitySchema | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Fetch entity by ID */
  fetchEntity: (id: string) => Promise<Entity>;
  /** Create new entity */
  createEntity: (data: Record<string, unknown>) => Promise<Entity>;
  /** Update entity */
  updateEntity: (id: string, data: Partial<Entity['data']>) => Promise<Entity>;
  /** Delete entity */
  deleteEntity: (id: string) => Promise<void>;
  /** Get schema for entity type */
  fetchSchema: (type: string) => Promise<EntitySchema>;
  /** Validate entity data against schema */
  validateEntity: (data: Record<string, unknown>) => { valid: boolean; errors?: Record<string, string> };
  /** Get all entities of a type */
  getEntitiesByType: (type: string) => Promise<Entity[]>;
}

/**
 * Convert Phase 2 Organization to Entity format
 */
function organizationToEntity(org: Organization): Entity {
  return {
    id: org.id,
    type: 'project',
    data: {
      name: org.name,
      description: org.description,
      status: org.metadata?.status || 'planning',
      teamSize: org.metadata?.teamSize || 0,
    },
    created_at: org.createdAt.toISOString(),
    updated_at: org.updatedAt.toISOString(),
  };
}

/**
 * Hook for managing Phase 2 entities
 *
 * @example
 * const { entity, schema, updateEntity } = useEntity({ type: 'project' });
 *
 * @example
 * const { entity, loading } = useEntity({ entityId: 'proj-123', autoFetch: true });
 */
export function useEntity(options: UseEntityOptions = {}): UseEntityReturn {
  const { entityId, type = 'project', autoFetch = false } = options;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [schema, setSchema] = useState<EntitySchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const manager = getEntityManager();

  /**
   * Fetch entity by ID from Phase 2 EntityManager
   */
  const fetchEntity = useCallback(
    async (id: string): Promise<Entity> => {
      setLoading(true);
      setError(null);
      try {
        const phase2Entity = manager.getEntity(id);
        if (!phase2Entity) {
          throw new Error(`Entity not found: ${id}`);
        }

        // Convert Phase 2 entity to our format
        const convertedEntity = organizationToEntity(phase2Entity as Organization);
        setEntity(convertedEntity);

        // TODO: Sync with Phase 5
        // await phase5.syncEntity(convertedEntity);

        return convertedEntity;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [manager]
  );

  /**
   * Get all entities of a type from Phase 2
   */
  const getEntitiesByType = useCallback(
    async (queryType: string): Promise<Entity[]> => {
      try {
        // Projects are stored as organizations with 'project' tag
        const phase2Entities = queryType === 'project'
          ? manager.getEntitiesByTag('project')
          : manager.getEntitiesByType(queryType as EntityType);

        return phase2Entities
          .filter((e): e is Organization => e.type === 'organization')
          .map(organizationToEntity);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch entities');
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  /**
   * Create new entity via Phase 2
   */
  const createEntity = useCallback(
    async (data: ProjectInput): Promise<Entity> => {
      setLoading(true);
      setError(null);
      try {
        // Create as organization with 'project' tag
        const phase2Entity = manager.createEntity({
          type: 'organization',
          name: data.name || 'Untitled',
          description: data.description,
          tags: ['project'],
          metadata: {
            status: data.status || 'planning',
            teamSize: data.teamSize || 0,
          },
        });

        const convertedEntity = organizationToEntity(phase2Entity as Organization);
        setEntity(convertedEntity);

        // TODO: Broadcast via Phase 5
        // await phase5.broadcastEntityCreated(convertedEntity);

        return convertedEntity;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [manager]
  );

  /**
   * Update entity via Phase 2
   */
  const updateEntity = useCallback(
    async (id: string, data: ProjectInput): Promise<Entity> => {
      setLoading(true);
      setError(null);
      try {
        const updated = manager.updateEntity(id, {
          name: data.name,
          description: data.description,
          metadata: {
            status: data.status,
            teamSize: data.teamSize,
          },
        });

        if (!updated) {
          throw new Error(`Entity not found: ${id}`);
        }

        const convertedEntity = organizationToEntity(updated as Organization);
        setEntity(convertedEntity);

        // TODO: Broadcast via Phase 5
        // await phase5.broadcastEntityUpdated(convertedEntity);

        return convertedEntity;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [manager]
  );

  /**
   * Delete entity via Phase 2
   */
  const deleteEntity = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        manager.deleteEntity(id);
        setEntity(null);

        // TODO: Broadcast via Phase 5
        // await phase5.broadcastEntityDeleted(id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [manager]
  );

  /**
   * Fetch entity schema (mock for now)
   */
  const fetchSchema = useCallback(
    async (schemaType: string): Promise<EntitySchema> => {
      const mockSchema: EntitySchema = {
        id: schemaType,
        type: schemaType,
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'description', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'teamSize', type: 'number' },
        ],
      };

      setSchema(mockSchema);
      return mockSchema;
    },
    []
  );

  /**
   * Validate entity data against schema
   */
  const validateEntity = useCallback(
    (data: Record<string, unknown>): { valid: boolean; errors?: Record<string, string> } => {
      if (!schema) {
        return { valid: false, errors: { schema: 'Schema not loaded' } };
      }

      const errors: Record<string, string> = {};

      schema.fields.forEach((field) => {
        if (field.required && !data[field.name]) {
          errors[field.name] = `${field.name} is required`;
        }
      });

      return {
        valid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
      };
    },
    [schema]
  );

  // Auto-fetch entity if ID provided
  useEffect(() => {
    if (autoFetch && entityId && !entity && !loading) {
      fetchEntity(entityId).catch(console.error);
    }
  }, [autoFetch, entityId, entity, loading, fetchEntity]);

  // Auto-fetch schema if type provided
  useEffect(() => {
    if (autoFetch && type && !schema && !loading) {
      fetchSchema(type).catch(console.error);
    }
  }, [autoFetch, type, schema, loading, fetchSchema]);

  return {
    entity,
    schema,
    loading,
    error,
    fetchEntity,
    createEntity,
    updateEntity,
    deleteEntity,
    fetchSchema,
    validateEntity,
    getEntitiesByType,
  };
}

export default useEntity;
