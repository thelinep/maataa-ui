/**
 * Creates the app's FilmEntityService with persistence and cross-tab sync.
 */

import { v4 as uuidv4 } from 'uuid';
import { LocalStorageBackend, MemoryStorage, type StorageBackend } from '@/core/phase2-storage';
import {
  attachFilmPersistence,
  attachFilmSync,
  BroadcastChannelTransport,
  FilmEntityService,
  type FilmPersistenceHandle,
  type FilmSyncTransport,
} from '@/core/film';

export interface FilmAppServices {
  service: FilmEntityService;
  persistence: FilmPersistenceHandle;
  /** Null when no sync transport is available */
  disconnectSync: (() => void) | null;
}

export interface BootstrapOptions {
  currentUser: string;
  storage?: StorageBackend;
  transport?: FilmSyncTransport | null;
}

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export async function bootstrapFilmServices({ currentUser, storage, transport }: BootstrapOptions): Promise<FilmAppServices> {
  const service = new FilmEntityService();
  const persistence = await attachFilmPersistence(service, {
    storage: storage ?? (hasLocalStorage() ? new LocalStorageBackend() : new MemoryStorage()),
  });

  const syncTransport =
    transport !== undefined ? transport : BroadcastChannelTransport.isSupported() ? new BroadcastChannelTransport() : null;
  const disconnectSync = syncTransport
    ? attachFilmSync(service, syncTransport, { clientId: uuidv4(), userId: currentUser })
    : null;

  return { service, persistence, disconnectSync };
}
