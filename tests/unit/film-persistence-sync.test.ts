/**
 * Film data persistence (Phase 2 storage) + real-time sync (Phase 5 bridge)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryStorage } from '../../src/core/phase2-storage';
import {
  FilmEntityService,
  attachFilmPersistence,
  attachFilmSync,
  BroadcastChannelTransport,
  InMemorySyncHub,
  createFilmSeed,
  decodeFilmData,
  encodeFilmData,
  FILM_STORAGE_KEY,
  type FilmChange,
} from '../../src/core/film';

afterEach(() => {
  vi.useRealTimers();
});

const concept = {
  title: 'Monsoon Letters',
  vision: 'Pen pals in a flooded city',
  genre: ['Drama'],
  format: 'feature' as const,
  duration: 100,
  status: 'ideation' as const,
  budgetEstimate: 900000,
};

describe('codec', () => {
  it('round-trips nested dates through JSON', () => {
    const seed = createFilmSeed();
    const decoded = decodeFilmData<typeof seed>(JSON.parse(JSON.stringify(encodeFilmData(seed))));

    expect(decoded.filming[1].data.shots[0].takes[0].timestamp).toBeInstanceOf(Date);
    expect(decoded.filming[1].data.shots[0].takes[0].timestamp.getTime()).toBe(
      seed.filming[1].data.shots[0].takes[0].timestamp.getTime()
    );
    expect(decoded).toEqual(seed);
  });

  it('leaves look-alike objects alone and rejects invalid dates', () => {
    expect(decodeFilmData({ $date: 'x', other: 1 })).toEqual({ $date: 'x', other: 1 });
    expect(() => decodeFilmData({ $date: 'not-a-date' })).toThrow(/Invalid date/);
  });

  it('drops undefined fields', () => {
    expect(encodeFilmData({ a: 1, b: undefined })).toEqual({ a: 1 });
  });
});

describe('FilmEntityService snapshot / remote changes', () => {
  it('snapshot() is the inverse of seed()', () => {
    const a = new FilmEntityService();
    a.seed();
    const b = new FilmEntityService();
    b.seed(a.snapshot());
    expect(b.snapshot()).toEqual(a.snapshot());
  });

  it('emits detailed change events', async () => {
    const service = new FilmEntityService();
    const changes: FilmChange[] = [];
    service.subscribe((_kind, change) => changes.push(change));

    const created = await service.createEntity('concept', concept);
    await service.deleteEntity('concept', created.id);

    expect(changes.map((c) => [c.op, c.origin])).toEqual([
      ['create', 'local'],
      ['delete', 'local'],
    ]);
    expect(changes[0].record).toMatchObject({ title: 'Monsoon Letters' });
  });

  it('applies remote upserts and deletes, ignoring stale or mismatched ones', async () => {
    const service = new FilmEntityService();
    service.seed();
    const original = (await service.getEntity('concept', 'concept-1'))!;

    service.applyRemoteChange({ kind: 'concept', op: 'update', id: 'concept-1', record: { ...original, title: 'Remote', updatedAt: new Date('2030-01-01') } });
    expect((await service.getEntity('concept', 'concept-1'))?.title).toBe('Remote');

    service.applyRemoteChange({ kind: 'concept', op: 'update', id: 'concept-1', record: { ...original, title: 'Stale', updatedAt: new Date('2000-01-01') } });
    expect((await service.getEntity('concept', 'concept-1'))?.title).toBe('Remote');

    service.applyRemoteChange({ kind: 'color', op: 'delete', id: 'concept-1' });
    expect(await service.getEntity('concept', 'concept-1')).not.toBeNull();

    service.applyRemoteChange({ kind: 'concept', op: 'delete', id: 'concept-1' });
    expect(await service.getEntity('concept', 'concept-1')).toBeNull();
  });
});

describe('attachFilmPersistence', () => {
  it('seeds and saves when storage is empty', async () => {
    const storage = new MemoryStorage();
    const service = new FilmEntityService();
    const handle = await attachFilmPersistence(service, { storage, debounceMs: 0 });

    expect(handle.source).toBe('seed');
    await handle.flush();
    const stored = await storage.load(FILM_STORAGE_KEY);
    expect(stored).toMatchObject({ version: 1 });
  });

  it('restores a saved snapshot with dates intact', async () => {
    const storage = new MemoryStorage();
    const first = new FilmEntityService();
    const h1 = await attachFilmPersistence(first, { storage, debounceMs: 0 });
    const created = await first.createEntity('concept', concept);
    await h1.detach();

    const second = new FilmEntityService();
    const h2 = await attachFilmPersistence(second, { storage });
    expect(h2.source).toBe('storage');
    const restored = await second.getEntity('concept', created.id);
    expect(restored).toMatchObject({ title: 'Monsoon Letters' });
    expect(restored?.createdAt).toBeInstanceOf(Date);
    expect((await second.getEntity('filming', 'filming-2026-11-20'))?.date).toBeInstanceOf(Date);
  });

  it('debounces writes after changes', async () => {
    vi.useFakeTimers();
    const storage = new MemoryStorage();
    const save = vi.spyOn(storage, 'save');
    const service = new FilmEntityService();
    await attachFilmPersistence(service, { storage, debounceMs: 100, seedIfEmpty: false });

    await service.createEntity('concept', concept);
    await service.createEntity('concept', { ...concept, title: 'Second' });
    expect(save).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('reports unreadable data and falls back to sample data', async () => {
    const storage = new MemoryStorage();
    await storage.save(FILM_STORAGE_KEY, { version: 99 });
    const onError = vi.fn();
    const service = new FilmEntityService();

    const handle = await attachFilmPersistence(service, { storage, onError });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/Unrecognised/) }));
    expect(handle.source).toBe('seed');
  });

  it('keeps changes pending and reports when saving fails', async () => {
    const storage = new MemoryStorage();
    const onError = vi.fn();
    vi.spyOn(storage, 'save').mockRejectedValueOnce(new Error('quota exceeded'));
    const service = new FilmEntityService();
    const handle = await attachFilmPersistence(service, { storage, onError, seedIfEmpty: false });

    await service.createEntity('concept', concept);
    await handle.flush();
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'quota exceeded' }));

    await handle.flush();
    expect(await storage.load(FILM_STORAGE_KEY)).toBeDefined();
  });
});

describe('attachFilmSync', () => {
  function linkedPair() {
    const hub = new InMemorySyncHub();
    const a = new FilmEntityService();
    const b = new FilmEntityService();
    a.seed();
    b.seed();
    const onRemoteChange = vi.fn();
    const detachA = attachFilmSync(a, hub.createTransport(), { clientId: 'client-a', userId: 'Hemant' });
    const detachB = attachFilmSync(b, hub.createTransport(), { clientId: 'client-b', userId: 'Dev', onRemoteChange });
    return { hub, a, b, detachA, detachB, onRemoteChange };
  }

  it('propagates creates, updates and deletes as Phase 5 entity messages', async () => {
    const { hub, a, b, onRemoteChange } = linkedPair();

    const created = await a.createEntity('concept', concept);
    expect(await b.getEntity('concept', created.id)).toMatchObject({ title: 'Monsoon Letters' });

    await a.updateEntity('concept', created.id, { status: 'pitch' });
    expect((await b.getEntity('concept', created.id))?.status).toBe('pitch');

    await a.deleteEntity('concept', created.id);
    expect(await b.getEntity('concept', created.id)).toBeNull();

    expect(hub.log.map((m) => m.type)).toEqual(['entity:create', 'entity:update', 'entity:delete']);
    expect(hub.log[0]).toMatchObject({ clientId: 'client-a', userId: 'Hemant', entityId: created.id, payload: { kind: 'concept' } });
    expect(onRemoteChange).toHaveBeenCalledTimes(3);
  });

  it('keeps nested dates as Dates on the receiving side', async () => {
    const { a, b } = linkedPair();
    const day = (await a.getEntity('filming', 'filming-2026-11-20'))!;
    await a.updateEntity('filming', day.id, { location: 'Moved' });

    const received = (await b.getEntity('filming', day.id))!;
    expect(received.location).toBe('Moved');
    expect(received.shots[0].takes[0].timestamp).toBeInstanceOf(Date);
  });

  it('does not echo remote changes back', async () => {
    const { hub, a } = linkedPair();
    await a.updateEntity('color', 'color-scene-3', { status: 'approved' });
    expect(hub.log).toHaveLength(1);
  });

  it('ignores foreign or malformed messages', async () => {
    const hub = new InMemorySyncHub();
    const service = new FilmEntityService();
    attachFilmSync(service, hub.createTransport(), { clientId: 'me', userId: 'u' });
    const other = hub.createTransport();

    other.send({ id: '1', type: 'presence:join', clientId: 'x', userId: 'x', timestamp: 0, payload: {} });
    other.send({ id: '2', type: 'entity:create', clientId: 'x', userId: 'x', timestamp: 0, payload: { kind: 'nope' } });
    other.send({ id: '3', type: 'entity:create', clientId: 'x', userId: 'x', timestamp: 0, payload: undefined });
    expect(service.isEmpty()).toBe(true);
  });

  it('stops syncing after detach', async () => {
    const { a, b, detachA } = linkedPair();
    detachA();
    const created = await a.createEntity('concept', concept);
    expect(await b.getEntity('concept', created.id)).toBeNull();
  });

  it('BroadcastChannelTransport delivers between channels with the same name', async () => {
    expect(BroadcastChannelTransport.isSupported()).toBe(true);
    const t1 = new BroadcastChannelTransport('test-film-sync');
    const t2 = new BroadcastChannelTransport('test-film-sync');
    const received = new Promise((resolve) => t2.subscribe(resolve));

    t1.send({ id: '1', type: 'entity:update', clientId: 'a', userId: 'u', timestamp: 1, payload: { kind: 'concept' } });
    await expect(received).resolves.toMatchObject({ id: '1' });
    t1.close();
    t2.close();
  });
});
