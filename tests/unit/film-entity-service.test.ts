/**
 * Phase J × Phase 2: FilmEntityService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import EntityManager, { type Person } from '../../src/core/phase2-entity-manager';
import {
  FilmEntityService,
  FilmEntityNotFoundError,
  FILM_KINDS,
  createFilmSeed,
  type ConceptData,
} from '../../src/core/film';

const newConcept = (overrides: Partial<ConceptData> = {}): ConceptData => ({
  title: 'Monsoon Letters',
  vision: 'Two pen pals across a flooded city',
  genre: ['Drama'],
  format: 'feature',
  duration: 110,
  status: 'ideation',
  budgetEstimate: 1200000,
  ...overrides,
});

describe('FilmEntityService', () => {
  let manager: EntityManager;
  let service: FilmEntityService;

  beforeEach(() => {
    manager = new EntityManager();
    service = new FilmEntityService(manager);
  });

  describe('create / read', () => {
    it('creates a record with generated id and timestamps', async () => {
      const created = await service.createEntity('concept', newConcept());

      expect(created.id).toEqual(expect.any(String));
      expect(created.createdAt).toBeInstanceOf(Date);
      expect(created.updatedAt).toBeInstanceOf(Date);
      expect(created.title).toBe('Monsoon Letters');
      expect(await service.getEntity('concept', created.id)).toEqual(created);
    });

    it('stores records in EntityManager under a namespaced film type', async () => {
      const created = await service.createEntity('concept', newConcept());
      const raw = manager.getEntity(created.id);

      expect(raw?.type).toBe('film.concept');
      expect(raw?.name).toBe('Monsoon Letters');
      expect(manager.searchByName('monsoon')).toHaveLength(1);
    });

    it('lists only records of the requested kind', async () => {
      await service.createEntity('concept', newConcept());
      await service.createEntity('color', { sceneNumber: 1, status: 'pending', colorist: '', lut: '' });

      expect(await service.getEntities('concept')).toHaveLength(1);
      expect(await service.getEntities('color')).toHaveLength(1);
      expect(await service.getEntities('script')).toHaveLength(0);
    });

    it('applies filter and sort options', async () => {
      await service.createEntity('concept', newConcept({ title: 'B', status: 'pitch' }));
      await service.createEntity('concept', newConcept({ title: 'A', status: 'pitch' }));
      await service.createEntity('concept', newConcept({ title: 'C', status: 'approved' }));

      const pitches = await service.getEntities('concept', {
        filter: (c) => c.status === 'pitch',
        sort: (a, b) => a.title.localeCompare(b.title),
      });

      expect(pitches.map((c) => c.title)).toEqual(['A', 'B']);
    });

    it('returns null for unknown ids and for ids of another kind', async () => {
      const color = await service.createEntity('color', { sceneNumber: 1, status: 'pending', colorist: '', lut: '' });

      expect(await service.getEntity('concept', 'nope')).toBeNull();
      expect(await service.getEntity('concept', color.id)).toBeNull();
    });

    it('does not expose knowledge-graph entities as film records', async () => {
      manager.createEntity({ type: 'concept', name: 'Knowledge concept' } as never);
      expect(await service.getEntities('concept')).toHaveLength(0);
    });

    it('derives a name for records without a title', async () => {
      const day = await service.createEntity('filming', {
        date: new Date('2026-11-21'),
        location: 'Stage 1',
        camera: 'ARRI',
        operator: 'B-cam',
        shots: [],
      });
      const grade = await service.createEntity('color', { sceneNumber: 4, status: 'pending', colorist: '', lut: '' });

      expect(manager.getEntity(day.id)?.name).toBe('Shoot day 2026-11-21');
      expect(manager.getEntity(grade.id)?.name).toBe('Scene 4 grade');
    });
  });

  describe('update', () => {
    it('merges the patch and bumps updatedAt', async () => {
      const created = await service.createEntity('concept', newConcept());
      await new Promise((r) => setTimeout(r, 2));

      const updated = await service.updateEntity('concept', created.id, { status: 'pitch', title: 'Renamed' });

      expect(updated.status).toBe('pitch');
      expect(updated.title).toBe('Renamed');
      expect(updated.vision).toBe(created.vision);
      expect(updated.createdAt).toEqual(created.createdAt);
      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
      expect(manager.getEntity(created.id)?.name).toBe('Renamed');
    });

    it('throws FilmEntityNotFoundError for a missing record', async () => {
      await expect(service.updateEntity('concept', 'missing', { title: 'x' })).rejects.toBeInstanceOf(
        FilmEntityNotFoundError
      );
    });

    it('refuses to update a record through the wrong kind', async () => {
      const color = await service.createEntity('color', { sceneNumber: 1, status: 'pending', colorist: '', lut: '' });
      await expect(service.updateEntity('concept', color.id, { title: 'x' })).rejects.toThrow(/No concept entity/);
    });
  });

  describe('delete', () => {
    it('removes the record from the store', async () => {
      const created = await service.createEntity('concept', newConcept());
      await service.deleteEntity('concept', created.id);

      expect(await service.getEntity('concept', created.id)).toBeNull();
      expect(manager.getEntity(created.id)).toBeNull();
    });

    it('throws for a missing record', async () => {
      await expect(service.deleteEntity('concept', 'missing')).rejects.toBeInstanceOf(FilmEntityNotFoundError);
    });
  });

  describe('subscribe', () => {
    it('notifies listeners with the changed kind on create, update and delete', async () => {
      const listener = vi.fn();
      service.subscribe(listener);

      const created = await service.createEntity('concept', newConcept());
      await service.updateEntity('concept', created.id, { status: 'pitch' });
      await service.deleteEntity('concept', created.id);

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, 'concept');
    });

    it('stops notifying after unsubscribe', async () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);
      unsubscribe();

      await service.createEntity('concept', newConcept());
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('seed', () => {
    it('loads sample data for all 8 workflows with stable ids', async () => {
      service.seed();

      for (const kind of FILM_KINDS) {
        expect((await service.getEntities(kind)).length).toBeGreaterThan(0);
      }
      const script = await service.getEntity('script', 'script-1');
      expect(script?.conceptId).toBe('concept-1');
      expect(await service.getEntity('concept', script!.conceptId)).not.toBeNull();
    });

    it('keeps seed timestamps', async () => {
      service.seed();
      const concept = await service.getEntity('concept', 'concept-1');
      expect(concept?.createdAt).toEqual(new Date('2026-11-01'));
    });

    it('accepts a partial seed', async () => {
      service.seed({ color: createFilmSeed().color });
      expect(await service.getEntities('color')).toHaveLength(3);
      expect(await service.getEntities('concept')).toHaveLength(0);
    });
  });

  describe('EntityManager compatibility', () => {
    it('keeps getStats keys unchanged until film entities exist', () => {
      manager.createEntity({ type: 'person', name: 'A', firstName: 'A', lastName: 'B' } as Person);
      expect(Object.keys(manager.getStats()).sort()).toEqual(
        ['concept', 'event', 'location', 'organization', 'person', 'total'].sort()
      );
    });

    it('reports film types in getStats once populated', async () => {
      await service.createEntity('concept', newConcept());
      expect(manager.getStats()['film.concept']).toBe(1);
      expect(manager.getStats().concept).toBe(0);
    });
  });
});
