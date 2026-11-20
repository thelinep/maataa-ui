/**
 * Phase J film production data layer (Phase 2 EntityManager integration)
 */

export * from './types';
export { createFilmSeed } from './seed';
export type { FilmSeed, FilmSeedRecord } from './seed';
export {
  FilmEntityService,
  FilmEntityNotFoundError,
  getDefaultFilmEntityService,
} from './FilmEntityService';
export type { FilmChangeListener, GetEntitiesOptions } from './FilmEntityService';
export { FilmEntityProvider, useFilmEntityService } from './FilmEntityProvider';
export type { FilmEntityProviderProps } from './FilmEntityProvider';
