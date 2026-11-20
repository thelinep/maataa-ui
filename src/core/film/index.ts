/**
 * Phase J film production data layer
 * Phase 2 EntityManager integration + persistence + Phase 5 real-time sync
 */

export * from './types';
export { createFilmSeed } from './seed';
export type { FilmSeed, FilmSeedRecord } from './seed';
export {
  FilmEntityService,
  FilmEntityNotFoundError,
  getDefaultFilmEntityService,
  splitRecord,
} from './FilmEntityService';
export type { FilmChange, FilmChangeOp, FilmChangeListener, GetEntitiesOptions } from './FilmEntityService';
export { FilmEntityProvider, useFilmEntityService } from './FilmEntityProvider';
export type { FilmEntityProviderProps } from './FilmEntityProvider';
export { encodeFilmData, decodeFilmData } from './codec';
export { attachFilmPersistence, FILM_STORAGE_KEY } from './persistence';
export type { FilmPersistenceHandle, FilmPersistenceOptions } from './persistence';
export {
  attachFilmSync,
  BroadcastChannelTransport,
  InMemorySyncHub,
  FILM_SYNC_MESSAGE_TYPES,
} from './sync';
export type { FilmSyncOptions, FilmSyncTransport } from './sync';
