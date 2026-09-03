/**
 * Phase 2: Data Persistence Layer
 * Handles storage, retrieval, and synchronization of data
 * Supports in-memory and localStorage backends
 */

import { Entity } from './phase2-entity-manager';
import { Relationship } from './phase2-relationship-manager';
import { Fact } from './phase2-knowledge-base';

export interface StorageBackend {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

/**
 * In-memory storage backend
 */
export class MemoryStorage implements StorageBackend {
  private store: Map<string, any> = new Map();

  async save(key: string, data: any): Promise<void> {
    this.store.set(key, JSON.parse(JSON.stringify(data)));
  }

  async load(key: string): Promise<any> {
    return this.store.get(key);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

/**
 * LocalStorage backend
 */
export class LocalStorageBackend implements StorageBackend {
  private prefix = 'maataa:';

  async save(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw error;
    }
  }

  async load(key: string): Promise<any> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Failed to delete from localStorage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }
}

/**
 * Data persistence manager
 */
export class DataPersistence {
  private backend: StorageBackend;
  private isDirty = false;
  private autoSaveInterval: NodeJS.Timeout | null = null;

  constructor(backend: StorageBackend = new MemoryStorage()) {
    this.backend = backend;
  }

  /**
   * Set storage backend
   */
  setBackend(backend: StorageBackend): void {
    this.backend = backend;
  }

  /**
   * Enable auto-save
   */
  enableAutoSave(intervalMs: number = 5000): void {
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        // Trigger save event
        this.isDirty = false;
      }
    }, intervalMs);
  }

  /**
   * Disable auto-save
   */
  disableAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Save entities
   */
  async saveEntities(entities: Entity[]): Promise<void> {
    await this.backend.save('entities', entities);
    this.isDirty = true;
  }

  /**
   * Load entities
   */
  async loadEntities(): Promise<Entity[]> {
    const entities = await this.backend.load('entities');
    return entities || [];
  }

  /**
   * Save relationships
   */
  async saveRelationships(relationships: Relationship[]): Promise<void> {
    await this.backend.save('relationships', relationships);
    this.isDirty = true;
  }

  /**
   * Load relationships
   */
  async loadRelationships(): Promise<Relationship[]> {
    const relationships = await this.backend.load('relationships');
    return relationships || [];
  }

  /**
   * Save facts
   */
  async saveFacts(facts: Fact[]): Promise<void> {
    await this.backend.save('facts', facts);
    this.isDirty = true;
  }

  /**
   * Load facts
   */
  async loadFacts(): Promise<Fact[]> {
    const facts = await this.backend.load('facts');
    return facts || [];
  }

  /**
   * Save snapshot of entire state
   */
  async saveSnapshot(data: {
    entities: Entity[];
    relationships: Relationship[];
    facts: Fact[];
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.backend.save('snapshot', {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.isDirty = true;
  }

  /**
   * Load snapshot
   */
  async loadSnapshot(): Promise<any> {
    return await this.backend.load('snapshot');
  }

  /**
   * Create backup
   */
  async createBackup(name: string = 'backup'): Promise<void> {
    const entities = await this.backend.load('entities');
    const relationships = await this.backend.load('relationships');
    const facts = await this.backend.load('facts');

    const backup = {
      timestamp: new Date().toISOString(),
      entities,
      relationships,
      facts,
    };

    const backupName = `${name}-${Date.now()}`;
    await this.backend.save(backupName, backup);
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupName: string): Promise<void> {
    const backup = await this.backend.load(backupName);
    if (!backup) throw new Error(`Backup ${backupName} not found`);

    await this.backend.save('entities', backup.entities);
    await this.backend.save('relationships', backup.relationships);
    await this.backend.save('facts', backup.facts);
    this.isDirty = true;
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<string[]> {
    const keys = await this.backend.getAllKeys();
    return keys.filter(key => key.includes('backup-'));
  }

  /**
   * Export data as JSON
   */
  async exportJSON(): Promise<string> {
    const entities = await this.backend.load('entities');
    const relationships = await this.backend.load('relationships');
    const facts = await this.backend.load('facts');

    return JSON.stringify(
      {
        version: '2.0',
        exported: new Date().toISOString(),
        entities: entities || [],
        relationships: relationships || [],
        facts: facts || [],
      },
      null,
      2
    );
  }

  /**
   * Import data from JSON
   */
  async importJSON(json: string): Promise<void> {
    try {
      const data = JSON.parse(json);

      if (data.entities) {
        await this.backend.save('entities', data.entities);
      }
      if (data.relationships) {
        await this.backend.save('relationships', data.relationships);
      }
      if (data.facts) {
        await this.backend.save('facts', data.facts);
      }

      this.isDirty = true;
    } catch (error) {
      console.error('Failed to import JSON:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    await this.backend.clear();
    this.isDirty = true;
  }

  /**
   * Get storage stats
   */
  async getStats(): Promise<Record<string, number>> {
    const entities = await this.backend.load('entities') || [];
    const relationships = await this.backend.load('relationships') || [];
    const facts = await this.backend.load('facts') || [];

    return {
      entities: entities.length,
      relationships: relationships.length,
      facts: facts.length,
      totalItems: entities.length + relationships.length + facts.length,
    };
  }

  /**
   * Check if storage is dirty
   */
  isDirtyState(): boolean {
    return this.isDirty;
  }

  /**
   * Mark storage as clean
   */
  markClean(): void {
    this.isDirty = false;
  }
}

export default DataPersistence;
