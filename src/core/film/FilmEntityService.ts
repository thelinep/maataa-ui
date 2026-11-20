/**
 * Phase J × Phase 2: Film Entity Service
 *
 * Typed, async CRUD for the 8 film-production workflows, backed by the Phase 2
 * EntityManager. The API is Promise-based so the in-memory EntityManager can
 * later be swapped for a remote store (or Phase 5 real-time sync) without
 * touching components.
 */

import EntityManager, { type FilmEntity } from '../phase2-entity-manager';
import { createFilmSeed, type FilmSeed } from './seed';
import {
  FILM_KINDS,
  toEntityType,
  type FilmDataMap,
  type FilmKind,
  type FilmRecord,
} from './types';

export class FilmEntityNotFoundError extends Error {
  constructor(public readonly kind: FilmKind, public readonly id: string) {
    super(`No ${kind} entity with id "${id}"`);
    this.name = 'FilmEntityNotFoundError';
  }
}

export type FilmChangeListener = (kind: FilmKind) => void;

export interface GetEntitiesOptions<K extends FilmKind> {
  filter?: (record: FilmRecord<K>) => boolean;
  sort?: (a: FilmRecord<K>, b: FilmRecord<K>) => number;
}

/** Human-readable `name` for the EntityManager's search index */
function deriveName<K extends FilmKind>(kind: K, data: FilmDataMap[K]): string {
  const record = data as unknown as Record<string, unknown>;
  if (typeof record.title === 'string' && record.title) return record.title;
  switch (kind) {
    case 'filming':
      return `Shoot day ${(data as FilmDataMap['filming']).date.toISOString().slice(0, 10)}`;
    case 'color':
      return `Scene ${(data as FilmDataMap['color']).sceneNumber} grade`;
    default:
      return kind;
  }
}

function toRecord<K extends FilmKind>(entity: FilmEntity): FilmRecord<K> {
  return {
    ...(entity.data as unknown as FilmDataMap[K]),
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  } as FilmRecord<K>;
}

function isFilmEntityOfKind(entity: unknown, kind: FilmKind): entity is FilmEntity {
  return !!entity && (entity as FilmEntity).type === toEntityType(kind);
}

export class FilmEntityService {
  private readonly listeners = new Set<FilmChangeListener>();

  constructor(private readonly manager: EntityManager = new EntityManager()) {}

  /** Read all records of a workflow, in insertion order unless `sort` is given */
  async getEntities<K extends FilmKind>(kind: K, options: GetEntitiesOptions<K> = {}): Promise<FilmRecord<K>[]> {
    let records = this.manager
      .getEntitiesByType(toEntityType(kind))
      .filter((e): e is FilmEntity => isFilmEntityOfKind(e, kind))
      .map((e) => toRecord<K>(e));
    if (options.filter) records = records.filter(options.filter);
    if (options.sort) records = records.slice().sort(options.sort);
    return records;
  }

  /** Read one record; resolves to null if missing or of a different kind */
  async getEntity<K extends FilmKind>(kind: K, id: string): Promise<FilmRecord<K> | null> {
    const entity = this.manager.getEntity(id);
    return isFilmEntityOfKind(entity, kind) ? toRecord<K>(entity) : null;
  }

  async createEntity<K extends FilmKind>(kind: K, data: FilmDataMap[K]): Promise<FilmRecord<K>> {
    const entity = this.manager.createEntity({
      type: toEntityType(kind),
      name: deriveName(kind, data),
      data: data as unknown as Record<string, unknown>,
    } as Omit<FilmEntity, 'id' | 'createdAt' | 'updatedAt'>) as FilmEntity;
    this.emit(kind);
    return toRecord<K>(entity);
  }

  /** Shallow-merge `patch` into the record's payload */
  async updateEntity<K extends FilmKind>(
    kind: K,
    id: string,
    patch: Partial<FilmDataMap[K]>
  ): Promise<FilmRecord<K>> {
    const existing = this.manager.getEntity(id);
    if (!isFilmEntityOfKind(existing, kind)) throw new FilmEntityNotFoundError(kind, id);

    const data = { ...(existing.data as unknown as FilmDataMap[K]), ...patch };
    const updated = this.manager.updateEntity(id, {
      name: deriveName(kind, data),
      data: data as unknown as Record<string, unknown>,
    } as Partial<FilmEntity>) as FilmEntity;
    this.emit(kind);
    return toRecord<K>(updated);
  }

  async deleteEntity(kind: FilmKind, id: string): Promise<void> {
    const existing = this.manager.getEntity(id);
    if (!isFilmEntityOfKind(existing, kind)) throw new FilmEntityNotFoundError(kind, id);
    this.manager.deleteEntity(id);
    this.emit(kind);
  }

  /** Notified after every create/update/delete with the affected workflow */
  subscribe(listener: FilmChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Load fixed-id records (sample data, fixtures, or a persisted snapshot) */
  seed(seed: Partial<FilmSeed> = createFilmSeed()): void {
    const entities: FilmEntity[] = [];
    for (const kind of FILM_KINDS) {
      for (const record of seed[kind] ?? []) {
        entities.push({
          id: record.id,
          type: toEntityType(kind),
          name: deriveName(kind, record.data as FilmDataMap[typeof kind]),
          data: record.data as unknown as Record<string, unknown>,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        });
      }
    }
    this.manager.importEntities(entities);
    FILM_KINDS.forEach((kind) => {
      if (seed[kind]?.length) this.emit(kind);
    });
  }

  private emit(kind: FilmKind): void {
    this.listeners.forEach((listener) => listener(kind));
  }
}

let defaultService: FilmEntityService | null = null;

/**
 * App-wide service used when no <FilmEntityProvider> is mounted.
 * Seeded with sample data until a persistent backend is wired in.
 */
export function getDefaultFilmEntityService(): FilmEntityService {
  if (!defaultService) {
    defaultService = new FilmEntityService();
    defaultService.seed();
  }
  return defaultService;
}

export default FilmEntityService;
