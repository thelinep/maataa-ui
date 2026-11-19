/**
 * useEntity - Hook for managing Phase 2 entities
 *
 * Provides access to entity CRUD operations, validation, and schema information.
 * Integrates with Phase 5 for real-time sync.
 */

import { useState, useCallback } from 'react';

export interface Entity {
  id: string;
  type: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  relationships?: Record<string, string[]>;
}

export interface EntitySchema {
  id: string;
  type: string;
  fields: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'relationship';
    required?: boolean;
    validation?: Record<string, any>;
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
  createEntity: (data: Record<string, any>) => Promise<Entity>;
  /** Update entity */
  updateEntity: (id: string, data: Partial<Entity['data']>) => Promise<Entity>;
  /** Delete entity */
  deleteEntity: (id: string) => Promise<void>;
  /** Get schema for entity type */
  fetchSchema: (type: string) => Promise<EntitySchema>;
  /** Validate entity data against schema */
  validateEntity: (data: Record<string, any>) => { valid: boolean; errors?: Record<string, string> };
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
  const { entityId, type, autoFetch = false } = options;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [schema, setSchema] = useState<EntitySchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch entity by ID
   * In production, this would call the Phase 2 EntityManager
   */
  const fetchEntity = useCallback(
    async (id: string): Promise<Entity> => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call Phase 2 EntityManager
        // const data = await entityManager.getEntity(id);
        // Then sync with Phase 5
        // await phase5.syncEntity(data);

        const mockEntity: Entity = {
          id,
          type: type || 'unknown',
          data: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setEntity(mockEntity);
        return mockEntity;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  /**
   * Create new entity
   */
  const createEntity = useCallback(
    async (data: Record<string, any>): Promise<Entity> => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call Phase 2 EntityManager
        // const newEntity = await entityManager.createEntity(type, data);
        // await phase5.broadcastEntityCreated(newEntity);

        const newEntity: Entity = {
          id: `${type}-${Date.now()}`,
          type: type || 'unknown',
          data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setEntity(newEntity);
        return newEntity;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  /**
   * Update entity
   */
  const updateEntity = useCallback(
    async (id: string, data: Partial<Entity['data']>): Promise<Entity> => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call Phase 2 EntityManager with OT conflict resolution
        // const updated = await entityManager.updateEntity(id, data);
        // await phase5.broadcastEntityUpdated(updated);

        const updated: Entity = entity
          ? {
              ...entity,
              data: { ...entity.data, ...data },
              updated_at: new Date().toISOString(),
            }
          : {
              id,
              type: type || 'unknown',
              data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

        setEntity(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [entity, type]
  );

  /**
   * Delete entity
   */
  const deleteEntity = useCallback(
    async (entityId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call Phase 2 EntityManager with entityId parameter
        // await entityManager.deleteEntity(entityId);
        // await phase5.broadcastEntityDeleted(entityId);
        void entityId; // Placeholder for future implementation

        setEntity(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete entity');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch entity schema
   */
  const fetchSchema = useCallback(
    async (entityType: string): Promise<EntitySchema> => {
      try {
        // TODO: Call Phase 2 to get schema
        // const schema = await entityManager.getEntitySchema(entityType);

        const mockSchema: EntitySchema = {
          id: entityType,
          type: entityType,
          fields: [
            { name: 'name', type: 'string', required: true },
            { name: 'description', type: 'string' },
            { name: 'created_at', type: 'date', required: true },
          ],
        };

        setSchema(mockSchema);
        return mockSchema;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch schema');
        setError(error);
        throw error;
      }
    },
    []
  );

  /**
   * Validate entity data against schema
   */
  const validateEntity = useCallback(
    (data: Record<string, any>): { valid: boolean; errors?: Record<string, string> } => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  if (autoFetch && entityId && !entity && !loading) {
    fetchEntity(entityId).catch(console.error);
  }

  // Auto-fetch schema if type provided
  if (autoFetch && type && !schema && !loading) {
    fetchSchema(type).catch(console.error);
  }

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
  };
}

export default useEntity;
