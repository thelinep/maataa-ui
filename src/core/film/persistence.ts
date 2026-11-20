/**
 * Film data persistence (Phase 2 storage)
 *
 * Restores the FilmEntityService from a Phase 2 StorageBackend on startup and
 * writes a debounced snapshot after every change.
 */

import type { StorageBackend } from '../phase2-storage';
import { decodeFilmData, encodeFilmData } from './codec';
import type { FilmEntityService } from './FilmEntityService';
import { createFilmSeed, type FilmSeed } from './seed';
import { FILM_KINDS } from './types';

export const FILM_STORAGE_KEY = 'film-production';
const FORMAT_VERSION = 1;

interface StoredFilmSnapshot {
  version: number;
  savedAt: string;
  data: unknown;
}

export interface FilmPersistenceOptions {
  storage: StorageBackend;
  key?: string;
  /** Delay before writing after a change (ms). Default 300. */
  debounceMs?: number;
  /** Load sample data when storage is empty or unreadable. Default true. */
  seedIfEmpty?: boolean;
  onError?: (error: Error) => void;
}

export interface FilmPersistenceHandle {
  /** 'storage' when a saved snapshot was restored */
  source: 'storage' | 'seed' | 'empty';
  /** Write any pending change now */
  flush: () => Promise<void>;
  /** Stop saving (pending changes are flushed first) */
  detach: () => Promise<void>;
}

function isStoredSnapshot(value: unknown): value is StoredFilmSnapshot {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as StoredFilmSnapshot).version === FORMAT_VERSION &&
    'data' in (value as object)
  );
}

export async function attachFilmPersistence(
  service: FilmEntityService,
  options: FilmPersistenceOptions
): Promise<FilmPersistenceHandle> {
  const { storage, key = FILM_STORAGE_KEY, debounceMs = 300, seedIfEmpty = true } = options;
  const reportError = (err: unknown) => {
    const error = err instanceof Error ? err : new Error(String(err));
    if (options.onError) options.onError(error);
    else console.warn('[film persistence]', error);
  };

  let source: FilmPersistenceHandle['source'] = 'empty';
  let backfilled = false;
  try {
    const stored = await storage.load(key);
    if (isStoredSnapshot(stored)) {
      const restored = decodeFilmData<Partial<FilmSeed>>(stored.data);
      // Snapshots saved before a workflow existed have no key for it (an
      // emptied workflow is saved as []); give those workflows sample data.
      const samples = createFilmSeed();
      for (const kind of FILM_KINDS) {
        if (!(kind in restored)) {
          (restored as Record<string, unknown>)[kind] = samples[kind];
          backfilled = true;
        }
      }
      service.seed(restored);
      source = 'storage';
    } else if (stored !== undefined && stored !== null) {
      reportError(new Error(`Unrecognised film snapshot under "${key}"; starting fresh`));
    }
  } catch (err) {
    reportError(err);
  }
  if (source === 'empty' && seedIfEmpty && service.isEmpty()) {
    service.seed();
    source = 'seed';
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending = source === 'seed' || backfilled; // persist the initial seed / backfill too

  const write = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!pending) return;
    pending = false;
    const envelope: StoredFilmSnapshot = {
      version: FORMAT_VERSION,
      savedAt: new Date().toISOString(),
      data: encodeFilmData(service.snapshot()),
    };
    try {
      await storage.save(key, envelope);
    } catch (err) {
      pending = true;
      reportError(err);
    }
  };

  const schedule = () => {
    pending = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void write(), debounceMs);
  };

  const unsubscribe = service.subscribe(schedule);
  if (pending) schedule();

  return {
    source,
    flush: write,
    detach: async () => {
      unsubscribe();
      await write();
    },
  };
}
