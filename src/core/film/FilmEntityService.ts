/**
 * Phase J × Phase 2: Film Entity Service
 *
 * Typed, async CRUD for the 8 film-production workflows, backed by the Phase 2
 * EntityManager. The API is Promise-based so the in-memory EntityManager can
 * be backed by persistence (./persistence) and real-time sync (./sync) without
 * touching components.
 */

import EntityManager, { type FilmEntity } from '../phase2-entity-manager';
import { createFilmSeed, type FilmSeed, type FilmSeedRecord } from './seed';
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

export type FilmChangeOp = 'create' | 'update' | 'delete' | 'seed';

/**
 * Describes one change. `origin: 'remote'` marks changes applied from another
 * client via applyRemoteChange, so sync bridges don't echo them back.
 */
export type FilmChange = {
  [K in FilmKind]: {
    kind: K;
    op: FilmChangeOp;
    /** Absent for `seed` */
    id?: string;
    /** Present for create/update */
    record?: FilmRecord<K>;
    origin: 'local' | 'remote';
  };
}[FilmKind];

export type FilmChangeListener = (kind: FilmKind, change: FilmChange) => void;

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

function toEntity<K extends FilmKind>(kind: K, record: FilmSeedRecord<K>): FilmEntity {
  return {
    id: record.id,
    type: toEntityType(kind),
    name: deriveName(kind, record.data),
    data: record.data as unknown as Record<string, unknown>,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/** Split a flattened record back into entity metadata + payload */
export function splitRecord<K extends FilmKind>(record: FilmRecord<K>): FilmSeedRecord<K> {
  const { id, createdAt, updatedAt, ...data } = record as FilmRecord<K> & Record<string, unknown>;
  return { id, createdAt, updatedAt, data: data as unknown as FilmDataMap[K] };
}

function isFilmEntityOfKind(entity: unknown, kind: FilmKind): entity is FilmEntity {
  return !!entity && (entity as FilmEntity).type === toEntityType(kind);
}

export class FilmEntityService {
  private readonly listeners = new Set<FilmChangeListener>();

  constructor(private readonly manager: EntityManager = new EntityManager()) {}

  /** Read all records of a workflow, in insertion order unless `sort` is given */
  async getEntities<K extends FilmKind>(kind: K, options: GetEntitiesOptions<K> = {}): Promise<FilmRecord<K>[]> {
    return this.list(kind, options);
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
    const record = toRecord<K>(entity);
    this.emit({ kind, op: 'create', id: record.id, record, origin: 'local' } as FilmChange);
    return record;
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
    const record = toRecord<K>(updated);
    this.emit({ kind, op: 'update', id, record, origin: 'local' } as FilmChange);
    return record;
  }

  async deleteEntity(kind: FilmKind, id: string): Promise<void> {
    const existing = this.manager.getEntity(id);
    if (!isFilmEntityOfKind(existing, kind)) throw new FilmEntityNotFoundError(kind, id);
    this.manager.deleteEntity(id);
    this.emit({ kind, op: 'delete', id, origin: 'local' } as FilmChange);
  }

  /** Notified after every change with the affected workflow and details */
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
      for (const record of (seed[kind] ?? []) as FilmSeedRecord<typeof kind>[]) {
        entities.push(toEntity(kind, record));
      }
    }
    this.manager.importEntities(entities);
    FILM_KINDS.forEach((kind) => {
      if (seed[kind]?.length) this.emit({ kind, op: 'seed', origin: 'local' } as FilmChange);
    });
  }

  /** Every film record, grouped by workflow — the inverse of seed() */
  snapshot(): FilmSeed {
    const out = {} as Record<FilmKind, FilmSeedRecord<FilmKind>[]>;
    for (const kind of FILM_KINDS) {
      out[kind] = this.list(kind).map((record) => splitRecord(record));
    }
    return out as FilmSeed;
  }

  /** True when no film records are loaded */
  isEmpty(): boolean {
    return FILM_KINDS.every((kind) => this.manager.getEntitiesByType(toEntityType(kind)).length === 0);
  }

  /**
   * Apply a change that happened on another client. Last write wins; the
   * resulting event is emitted with origin 'remote'.
   */
  applyRemoteChange(change: Pick<FilmChange, 'kind' | 'op' | 'id' | 'record'>): void {
    const { kind, op } = change;
    if (op === 'delete') {
      if (!change.id || !isFilmEntityOfKind(this.manager.getEntity(change.id), kind)) return;
      this.manager.deleteEntity(change.id);
      this.emit({ kind, op, id: change.id, origin: 'remote' } as FilmChange);
      return;
    }
    if ((op === 'create' || op === 'update') && change.record) {
      const existing = this.manager.getEntity(change.record.id);
      if (existing && !isFilmEntityOfKind(existing, kind)) return; // id collision across kinds
      if (existing && existing.updatedAt.getTime() > change.record.updatedAt.getTime()) return; // stale
      this.manager.importEntities([toEntity(kind, splitRecord(change.record as FilmRecord<typeof kind>))]);
      this.emit({ kind, op, id: change.record.id, record: change.record, origin: 'remote' } as FilmChange);
    }
  }

  private list<K extends FilmKind>(kind: K, options: GetEntitiesOptions<K> = {}): FilmRecord<K>[] {
    let records = this.manager
      .getEntitiesByType(toEntityType(kind))
      .filter((e): e is FilmEntity => isFilmEntityOfKind(e, kind))
      .map((e) => toRecord<K>(e));
    if (options.filter) records = records.filter(options.filter);
    if (options.sort) records = records.slice().sort(options.sort);
    return records;
  }

  private emit(change: FilmChange): void {
    this.listeners.forEach((listener) => listener(change.kind, change));
  }
}

let defaultService: FilmEntityService | null = null;

/**
 * Fallback service used when no <FilmEntityProvider> is mounted (e.g. a
 * component rendered standalone in Storybook). Seeded with sample data.
 */
export function getDefaultFilmEntityService(): FilmEntityService {
  if (!defaultService) {
    defaultService = new FilmEntityService();
    defaultService.seed();
  }
  return defaultService;
}

export default FilmEntityService;
