/**
 * Phase 2: Core Modules Test Suite
 * Tests for Entity Manager, Relationship Manager, Knowledge Base, and Storage
 */

import { describe, it, expect, beforeEach } from 'vitest';
import EntityManager, { Entity, Person, Organization } from '../../src/core/phase2-entity-manager';
import RelationshipManager from '../../src/core/phase2-relationship-manager';
import KnowledgeBase from '../../src/core/phase2-knowledge-base';
import { DataPersistence, MemoryStorage, LocalStorageBackend } from '../../src/core/phase2-storage';

describe('Phase 2: Core Implementation', () => {
  describe('EntityManager', () => {
    let manager: EntityManager;

    beforeEach(() => {
      manager = new EntityManager();
    });

    it('should create a person entity', () => {
      const person = manager.createEntity({
        type: 'person',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      } as Person);

      expect(person.id).toBeDefined();
      expect(person.type).toBe('person');
      expect(person.name).toBe('John Doe');
      expect(person.createdAt).toBeDefined();
    });

    it('should create an organization entity', () => {
      const org = manager.createEntity({
        type: 'organization',
        name: 'Acme Corp',
        website: 'https://acme.com',
      } as Organization);

      expect(org.id).toBeDefined();
      expect(org.type).toBe('organization');
      expect(org.name).toBe('Acme Corp');
    });

    it('should retrieve entity by ID', () => {
      const person = manager.createEntity({
        type: 'person',
        name: 'Jane Doe',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Person);

      const retrieved = manager.getEntity(person.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.name).toBe('Jane Doe');
    });

    it('should get entities by type', () => {
      manager.createEntity({
        type: 'person',
        name: 'Person 1',
        firstName: 'P1',
        lastName: 'One',
      } as Person);

      manager.createEntity({
        type: 'person',
        name: 'Person 2',
        firstName: 'P2',
        lastName: 'Two',
      } as Person);

      manager.createEntity({
        type: 'organization',
        name: 'Org 1',
      } as Organization);

      const people = manager.getEntitiesByType('person');
      expect(people.length).toBe(2);
      expect(people.every(p => p.type === 'person')).toBe(true);
    });

    it('should search entities by name', () => {
      manager.createEntity({
        type: 'person',
        name: 'John Smith',
        firstName: 'John',
        lastName: 'Smith',
      } as Person);

      manager.createEntity({
        type: 'person',
        name: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
      } as Person);

      const results = manager.searchByName('Smith');
      expect(results.length).toBe(2);
    });

    it('should update an entity', () => {
      const person = manager.createEntity({
        type: 'person',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
      } as Person);

      const updated = manager.updateEntity(person.id, { name: 'Jane Doe' });
      expect(updated?.name).toBe('Jane Doe');
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(person.createdAt.getTime());
    });

    it('should delete an entity', () => {
      const person = manager.createEntity({
        type: 'person',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
      } as Person);

      const deleted = manager.deleteEntity(person.id);
      expect(deleted).toBe(true);
      expect(manager.getEntity(person.id)).toBeNull();
    });

    it('should tag entities', () => {
      const person = manager.createEntity({
        type: 'person',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        tags: ['important', 'contact'],
      } as Person);

      const byTag = manager.getEntitiesByTag('important');
      expect(byTag.length).toBe(1);
      expect(byTag[0].id).toBe(person.id);
    });

    it('should provide statistics', () => {
      manager.createEntity({
        type: 'person',
        name: 'Person 1',
        firstName: 'P1',
        lastName: 'One',
      } as Person);

      manager.createEntity({
        type: 'organization',
        name: 'Org 1',
      } as Organization);

      const stats = manager.getStats();
      expect(stats.total).toBe(2);
      expect(stats.person).toBe(1);
      expect(stats.organization).toBe(1);
    });
  });

  describe('RelationshipManager', () => {
    let manager: RelationshipManager;
    let entityManager: EntityManager;
    let personId1: string;
    let personId2: string;

    beforeEach(() => {
      manager = new RelationshipManager();
      entityManager = new EntityManager();

      const p1 = entityManager.createEntity({
        type: 'person',
        name: 'John',
        firstName: 'John',
        lastName: 'Doe',
      } as Person);

      const p2 = entityManager.createEntity({
        type: 'person',
        name: 'Jane',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Person);

      personId1 = p1.id;
      personId2 = p2.id;
    });

    it('should create a relationship', () => {
      const rel = manager.createRelationship(personId1, personId2, 'knows', {
        strength: 0.8,
        confidence: 0.9,
      });

      expect(rel.id).toBeDefined();
      expect(rel.sourceId).toBe(personId1);
      expect(rel.targetId).toBe(personId2);
      expect(rel.type).toBe('knows');
      expect(rel.strength).toBe(0.8);
    });

    it('should get relationships by type', () => {
      manager.createRelationship(personId1, personId2, 'knows');
      manager.createRelationship(personId2, personId1, 'friend_of');

      const knows = manager.getRelationshipsByType('knows');
      expect(knows.length).toBe(1);
      expect(knows[0].type).toBe('knows');
    });

    it('should get relationships from a source', () => {
      manager.createRelationship(personId1, personId2, 'knows');

      const from = manager.getRelationshipsFrom(personId1);
      expect(from.length).toBe(1);
      expect(from[0].sourceId).toBe(personId1);
    });

    it('should get relationships to a target', () => {
      manager.createRelationship(personId1, personId2, 'knows');

      const to = manager.getRelationshipsTo(personId2);
      expect(to.length).toBe(1);
      expect(to[0].targetId).toBe(personId2);
    });

    it('should find direct relationship', () => {
      manager.createRelationship(personId1, personId2, 'knows');

      const rel = manager.getDirectRelationship(personId1, personId2);
      expect(rel).not.toBeNull();
      expect(rel?.type).toBe('knows');
    });

    it('should find path between entities (BFS)', () => {
      const p3 = entityManager.createEntity({
        type: 'person',
        name: 'Bob',
        firstName: 'Bob',
        lastName: 'Smith',
      } as Person);

      manager.createRelationship(personId1, personId2, 'knows');
      manager.createRelationship(personId2, p3.id, 'knows');

      const paths = manager.findPath(personId1, p3.id);
      expect(paths.length).toBeGreaterThan(0);
      expect(paths[0][0]).toBe(personId1);
      expect(paths[0][paths[0].length - 1]).toBe(p3.id);
    });

    it('should delete relationships', () => {
      const rel = manager.createRelationship(personId1, personId2, 'knows');

      const deleted = manager.deleteRelationship(rel.id);
      expect(deleted).toBe(true);

      const found = manager.getDirectRelationship(personId1, personId2);
      expect(found).toBeNull();
    });

    it('should get relationship statistics', () => {
      manager.createRelationship(personId1, personId2, 'knows');
      manager.createRelationship(personId2, personId1, 'friend_of');

      const stats = manager.getStats();
      expect(stats.total).toBe(2);
      expect(stats.knows).toBe(1);
      expect(stats.friend_of).toBe(1);
    });
  });

  describe('KnowledgeBase', () => {
    let kb: KnowledgeBase;

    beforeEach(() => {
      kb = new KnowledgeBase();
    });

    it('should add a fact', () => {
      const fact = kb.addFact('john', 'age', 30, {
        confidence: 0.95,
      });

      expect(fact.id).toBeDefined();
      expect(fact.subject).toBe('john');
      expect(fact.predicate).toBe('age');
      expect(fact.object).toBe(30);
    });

    it('should query facts by subject', () => {
      kb.addFact('john', 'age', 30);
      kb.addFact('john', 'name', 'John Doe');
      kb.addFact('jane', 'age', 28);

      const results = kb.query({ subject: 'john' });
      expect(results.length).toBe(2);
      expect(results.every(f => f.subject === 'john')).toBe(true);
    });

    it('should query facts by predicate', () => {
      kb.addFact('john', 'age', 30);
      kb.addFact('jane', 'age', 28);

      const results = kb.query({ predicate: 'age' });
      expect(results.length).toBe(2);
      expect(results.every(f => f.predicate === 'age')).toBe(true);
    });

    it('should query facts by object', () => {
      kb.addFact('john', 'role', 'manager');
      kb.addFact('jane', 'role', 'engineer');
      kb.addFact('bob', 'role', 'manager');

      const results = kb.query({ object: 'manager' });
      expect(results.length).toBe(2);
    });

    it('should filter by confidence', () => {
      kb.addFact('john', 'age', 30, { confidence: 0.95 });
      kb.addFact('jane', 'age', 28, { confidence: 0.5 });

      const results = kb.query({ confidence: 0.8 });
      expect(results.length).toBe(1);
      expect(results[0].subject).toBe('john');
    });

    it('should search facts by text', () => {
      kb.addFact('john', 'occupation', 'software engineer');
      kb.addFact('jane', 'occupation', 'product manager');

      const results = kb.search('engineer');
      expect(results.length).toBe(1);
      expect(results[0].subject).toBe('john');
    });

    it('should get facts about an entity', () => {
      kb.addFact('john', 'age', 30);
      kb.addFact('john', 'role', 'manager');
      kb.addFact('manager', 'manages', 'john'); // Incoming relationship

      const facts = kb.getFactsAbout('john');
      expect(facts.length).toBeGreaterThanOrEqual(2);
    });

    it('should update facts', () => {
      const fact = kb.addFact('john', 'age', 30);

      const updated = kb.updateFact(fact.id, { object: 31, confidence: 0.98 });
      expect(updated?.object).toBe(31);
      expect(updated?.confidence).toBe(0.98);
    });

    it('should delete facts', () => {
      const fact = kb.addFact('john', 'age', 30);

      const deleted = kb.deleteFact(fact.id);
      expect(deleted).toBe(true);

      const results = kb.query({ subject: 'john' });
      expect(results.length).toBe(0);
    });

    it('should provide statistics', () => {
      kb.addFact('john', 'age', 30, { confidence: 0.95 });
      kb.addFact('jane', 'age', 28, { confidence: 0.9 });

      const stats = kb.getStats();
      expect(stats.totalFacts).toBe(2);
      expect(stats.uniqueSubjects).toBe(2);
      expect(stats.uniquePredicates).toBe(1);
      expect(stats.averageConfidence).toBeGreaterThan(0.9);
    });
  });

  describe('DataPersistence', () => {
    let persistence: DataPersistence;

    beforeEach(() => {
      persistence = new DataPersistence(new MemoryStorage());
    });

    it('should save and load entities', async () => {
      const entities = [
        {
          id: '1',
          type: 'person' as const,
          name: 'John',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await persistence.saveEntities(entities);
      const loaded = await persistence.loadEntities();

      expect(loaded.length).toBe(1);
      expect(loaded[0].name).toBe('John');
    });

    it('should create and restore backups', async () => {
      const entities = [
        {
          id: '1',
          type: 'person' as const,
          name: 'John',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await persistence.saveEntities(entities);
      await persistence.createBackup('test-backup');

      const backups = await persistence.listBackups();
      expect(backups.length).toBeGreaterThan(0);
      expect(backups.some(b => b.includes('test-backup'))).toBe(true);
    });

    it('should export and import JSON', async () => {
      const entities = [
        {
          id: '1',
          type: 'person' as const,
          name: 'John',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await persistence.saveEntities(entities);
      const json = await persistence.exportJSON();
      expect(json).toContain('John');

      await persistence.clear();
      await persistence.importJSON(json);

      const loaded = await persistence.loadEntities();
      expect(loaded.length).toBe(1);
    });

    it('should provide storage statistics', async () => {
      const entities = [
        {
          id: '1',
          type: 'person' as const,
          name: 'John',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await persistence.saveEntities(entities);
      const stats = await persistence.getStats();

      expect(stats.entities).toBe(1);
      expect(stats.totalItems).toBeGreaterThanOrEqual(1);
    });
  });
});
