/**
 * Data hooks for Phase J film production workflows.
 *
 * Both hooks read through the FilmEntityService (Phase 2 EntityManager) and
 * re-fetch automatically when any component mutates the same workflow.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFilmEntityService } from '@/core/film/FilmEntityProvider';
import type { FilmDataMap, FilmKind, FilmRecord } from '@/core/film/types';

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

export interface UseFilmEntitiesOptions<K extends FilmKind> {
  sort?: (a: FilmRecord<K>, b: FilmRecord<K>) => number;
}

export interface UseFilmEntitiesResult<K extends FilmKind> {
  items: FilmRecord<K>[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  create: (data: FilmDataMap[K]) => Promise<FilmRecord<K>>;
  update: (id: string, patch: Partial<FilmDataMap[K]>) => Promise<FilmRecord<K>>;
  remove: (id: string) => Promise<void>;
}

/** All records of one workflow, kept in sync with the store */
export function useFilmEntities<K extends FilmKind>(
  kind: K,
  options: UseFilmEntitiesOptions<K> = {}
): UseFilmEntitiesResult<K> {
  const service = useFilmEntityService();
  const [items, setItems] = useState<FilmRecord<K>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const sortRef = useRef(options.sort);
  sortRef.current = options.sort;
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const next = await service.getEntities(kind, { sort: sortRef.current });
      if (!mountedRef.current) return;
      setItems(next);
      setError(null);
    } catch (err) {
      if (mountedRef.current) setError(toError(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [service, kind]);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    void refresh();
    const unsubscribe = service.subscribe((changed) => {
      if (changed === kind) void refresh();
    });
    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [service, kind, refresh]);

  const run = useCallback(async <T,>(op: () => Promise<T>): Promise<T> => {
    try {
      return await op();
    } catch (err) {
      const e = toError(err);
      if (mountedRef.current) setError(e);
      throw e;
    }
  }, []);

  const create = useCallback((data: FilmDataMap[K]) => run(() => service.createEntity(kind, data)), [run, service, kind]);
  const update = useCallback(
    (id: string, patch: Partial<FilmDataMap[K]>) => run(() => service.updateEntity(kind, id, patch)),
    [run, service, kind]
  );
  const remove = useCallback((id: string) => run(() => service.deleteEntity(kind, id)), [run, service, kind]);

  return { items, loading, error, refresh, create, update, remove };
}

export interface UseFilmEntityResult<K extends FilmKind> {
  item: FilmRecord<K> | null;
  loading: boolean;
  error: Error | null;
  update: (patch: Partial<FilmDataMap[K]>) => Promise<FilmRecord<K>>;
  remove: () => Promise<void>;
}

/**
 * One record of a workflow. When `id` is omitted the first record of that
 * workflow is used, so detail views still render standalone (e.g. in Storybook).
 */
export function useFilmEntity<K extends FilmKind>(kind: K, id?: string): UseFilmEntityResult<K> {
  const service = useFilmEntityService();
  const [item, setItem] = useState<FilmRecord<K> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = id ? await service.getEntity(kind, id) : (await service.getEntities(kind))[0] ?? null;
      if (!mountedRef.current) return;
      setItem(next);
      setError(null);
    } catch (err) {
      if (mountedRef.current) setError(toError(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [service, kind, id]);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    void load();
    const unsubscribe = service.subscribe((changed) => {
      if (changed === kind) void load();
    });
    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [service, kind, load]);

  const itemId = item?.id;

  const update = useCallback(
    async (patch: Partial<FilmDataMap[K]>) => {
      if (!itemId) throw new Error(`Cannot update: ${kind} not loaded`);
      try {
        return await service.updateEntity(kind, itemId, patch);
      } catch (err) {
        const e = toError(err);
        if (mountedRef.current) setError(e);
        throw e;
      }
    },
    [service, kind, itemId]
  );

  const remove = useCallback(async () => {
    if (!itemId) throw new Error(`Cannot delete: ${kind} not loaded`);
    try {
      await service.deleteEntity(kind, itemId);
    } catch (err) {
      const e = toError(err);
      if (mountedRef.current) setError(e);
      throw e;
    }
  }, [service, kind, itemId]);

  return { item, loading, error, update, remove };
}
