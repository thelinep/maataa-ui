/**
 * Phase 2: Entity Manager
 * Handles creation, retrieval, update, and deletion of entities
 * Supports entities like persons, organizations, events, and concepts,
 * plus namespaced film-production entities (`film.*`) used by Phase J.
 */

import { v4 as uuidv4 } from 'uuid';

export type CoreEntityType = 'person' | 'organization' | 'event' | 'concept' | 'location';

/**
 * Film production entity types (Phase J). Namespaced so they never collide
 * with the knowledge-graph `concept` type above.
 */
export type FilmEntityType =
  | 'film.concept'
  | 'film.script'
  | 'film.storyboard'
  | 'film.filming'
  | 'film.screening'
  | 'film.editing'
  | 'film.color'
  | 'film.sound';

export type EntityType = CoreEntityType | FilmEntityType;

export const CORE_ENTITY_TYPES: readonly CoreEntityType[] = ['person', 'organization', 'event', 'concept', 'location'];

export const FILM_ENTITY_TYPES: readonly FilmEntityType[] = [
  'film.concept',
  'film.script',
  'film.storyboard',
  'film.filming',
  'film.screening',
  'film.editing',
  'film.color',
  'film.sound',
];

export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  confidence?: number;
}

export interface Person extends BaseEntity {
  type: 'person';
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  roles?: string[];
  affiliations?: string[];
}

export interface Organization extends BaseEntity {
  type: 'organization';
  foundedDate?: Date;
  headquarters?: string;
  website?: string;
  employees?: string[];
  parentOrganization?: string;
}

export interface Event extends BaseEntity {
  type: 'event';
  startDate: Date;
  endDate?: Date;
  location?: string;
  participants?: string[];
}

export interface Concept extends BaseEntity {
  type: 'concept';
  category?: string;
  relatedConcepts?: string[];
}

export interface Location extends BaseEntity {
  type: 'location';
  latitude?: number;
  longitude?: number;
  country?: string;
  region?: string;
  city?: string;
}

/**
 * Generic film-production entity. The workflow-specific record lives in `data`;
 * see src/core/film/types.ts for the typed payloads.
 */
export interface FilmEntity<TData = Record<string, unknown>> extends BaseEntity {
  type: FilmEntityType;
  data: TData;
}

export type Entity = Person | Organization | Event | Concept | Location | FilmEntity;

export class EntityManager {
  private entities: Map<string, Entity> = new Map();
  private typeIndices: Map<string, Set<string>> = new Map();
  private tagIndices: Map<string, Set<string>> = new Map();

  constructor() {
    [...CORE_ENTITY_TYPES, ...FILM_ENTITY_TYPES].forEach(type => {
      this.typeIndices.set(type, new Set());
    });
  }

  createEntity(data: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>): Entity {
    const id = uuidv4();
    const now = new Date();

    const entity: Entity = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    } as Entity;

    this.entities.set(id, entity);

    const typeSet = this.typeIndices.get(entity.type) || new Set();
    typeSet.add(id);
    this.typeIndices.set(entity.type, typeSet);

    if (entity.tags) {
      entity.tags.forEach(tag => {
        const tagSet = this.tagIndices.get(tag) || new Set();
        tagSet.add(id);
        this.tagIndices.set(tag, tagSet);
      });
    }

    return entity;
  }

  getEntity(id: string): Entity | null {
    return this.entities.get(id) || null;
  }

  getEntitiesByType(type: EntityType): Entity[] {
    const ids = this.typeIndices.get(type) || new Set();
    return Array.from(ids).map(id => this.entities.get(id)!).filter(Boolean);
  }

  getEntitiesByTag(tag: string): Entity[] {
    const ids = this.tagIndices.get(tag) || new Set();
    return Array.from(ids).map(id => this.entities.get(id)!).filter(Boolean);
  }

  searchByName(query: string): Entity[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.entities.values()).filter(entity =>
      entity.name.toLowerCase().includes(lowerQuery)
    );
  }

  updateEntity(id: string, updates: Partial<Entity>): Entity | null {
    const entity = this.entities.get(id);
    if (!entity) return null;

    const updated: Entity = {
      ...entity,
      ...updates,
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: new Date(),
    } as Entity;

    if (updates.tags) {
      if (entity.tags) {
        entity.tags.forEach(tag => {
          const tagSet = this.tagIndices.get(tag);
          if (tagSet) {
            tagSet.delete(id);
          }
        });
      }

      updates.tags.forEach(tag => {
        const tagSet = this.tagIndices.get(tag) || new Set();
        tagSet.add(id);
        this.tagIndices.set(tag, tagSet);
      });
    }

    this.entities.set(id, updated);
    return updated;
  }

  deleteEntity(id: string): boolean {
    const entity = this.entities.get(id);
    if (!entity) return false;

    const typeSet = this.typeIndices.get(entity.type);
    if (typeSet) {
      typeSet.delete(id);
    }

    if (entity.tags) {
      entity.tags.forEach(tag => {
        const tagSet = this.tagIndices.get(tag);
        if (tagSet) {
          tagSet.delete(id);
        }
      });
    }

    this.entities.delete(id);
    return true;
  }

  getStats(): Record<string, number> {
    const stats: Record<string, number> = {
      total: this.entities.size,
    };

    CORE_ENTITY_TYPES.forEach(type => {
      stats[type] = this.typeIndices.get(type)?.size || 0;
    });

    // Film types are only reported once they hold entities, so existing
    // consumers of getStats() see the same keys as before.
    FILM_ENTITY_TYPES.forEach(type => {
      const size = this.typeIndices.get(type)?.size || 0;
      if (size > 0) stats[type] = size;
    });

    return stats;
  }

  exportEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  importEntities(entities: Entity[]): void {
    entities.forEach(entity => {
      this.entities.set(entity.id, entity);

      const typeSet = this.typeIndices.get(entity.type) || new Set();
      typeSet.add(entity.id);
      this.typeIndices.set(entity.type, typeSet);

      if (entity.tags) {
        entity.tags.forEach(tag => {
          const tagSet = this.tagIndices.get(tag) || new Set();
          tagSet.add(entity.id);
          this.tagIndices.set(tag, tagSet);
        });
      }
    });
  }

  clear(): void {
    this.entities.clear();
    this.typeIndices.forEach(set => set.clear());
    this.tagIndices.forEach(set => set.clear());
  }

  getEntityReferences(_entityId: string): { incoming: Set<string>; outgoing: Set<string> } {
    return {
      incoming: new Set(),
      outgoing: new Set(),
    };
  }
}

export default EntityManager;
