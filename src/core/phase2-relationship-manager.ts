/**
 * Phase 2: Relationship Manager
 * Manages connections and relationships between entities
 */

import { v4 as uuidv4 } from 'uuid';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  direction: 'directed' | 'undirected';
  strength: number;
  confidence: number;
  metadata?: Record<string, any>;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  evidence?: string[];
  notes?: string;
}

export interface RelationshipType {
  name: string;
  description?: string;
  directed: boolean;
  color?: string;
  category?: string;
}

export class RelationshipManager {
  private relationships: Map<string, Relationship> = new Map();
  private typeIndices: Map<string, Set<string>> = new Map();
  private sourceIndices: Map<string, Set<string>> = new Map();
  private targetIndices: Map<string, Set<string>> = new Map();
  private relationshipTypes: Map<string, RelationshipType> = new Map();

  constructor() {
    this.registerCommonTypes();
  }

  private registerCommonTypes(): void {
    const commonTypes: Record<string, RelationshipType> = {
      'knows': { name: 'knows', description: 'Personal acquaintance', directed: false, color: '#3498db' },
      'works_for': { name: 'works_for', description: 'Employment', directed: true, color: '#2ecc71' },
      'friend_of': { name: 'friend_of', description: 'Friendship', directed: false, color: '#e74c3c' },
      'parent_of': { name: 'parent_of', description: 'Parental', directed: true, color: '#f39c12' },
      'sibling_of': { name: 'sibling_of', description: 'Sibling', directed: false, color: '#9b59b6' },
      'based_in': { name: 'based_in', description: 'Location', directed: true, color: '#34495e' },
      'affiliated_with': { name: 'affiliated_with', description: 'Affiliation', directed: false, color: '#16a085' },
      'collaborated_with': { name: 'collaborated_with', description: 'Collaboration', directed: false, color: '#c0392b' },
      'participated_in': { name: 'participated_in', description: 'Event participation', directed: true, color: '#2980b9' },
      'founded': { name: 'founded', description: 'Founding', directed: true, color: '#27ae60' },
    };
    Object.entries(commonTypes).forEach(([, type]) => this.registerRelationshipType(type));
  }

  registerRelationshipType(type: RelationshipType): void {
    this.relationshipTypes.set(type.name, type);
  }

  createRelationship(
    sourceId: string,
    targetId: string,
    type: string,
    options: {
      direction?: 'directed' | 'undirected';
      strength?: number;
      confidence?: number;
      metadata?: Record<string, any>;
      tags?: string[];
      evidence?: string[];
      notes?: string;
    } = {}
  ): Relationship {
    const id = uuidv4();
    const now = new Date();
    const relationshipType = this.relationshipTypes.get(type);

    const relationship: Relationship = {
      id,
      sourceId,
      targetId,
      type,
      direction: options.direction || (relationshipType?.directed ? 'directed' : 'undirected'),
      strength: options.strength ?? 1,
      confidence: options.confidence ?? 1,
      metadata: options.metadata,
      tags: options.tags,
      evidence: options.evidence,
      notes: options.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.relationships.set(id, relationship);

    const typeSet = this.typeIndices.get(type) || new Set();
    typeSet.add(id);
    this.typeIndices.set(type, typeSet);

    const sourceSet = this.sourceIndices.get(sourceId) || new Set();
    sourceSet.add(id);
    this.sourceIndices.set(sourceId, sourceSet);

    const targetSet = this.targetIndices.get(targetId) || new Set();
    targetSet.add(id);
    this.targetIndices.set(targetId, targetSet);

    if (relationship.direction === 'undirected') {
      const reverseSourceSet = this.sourceIndices.get(targetId) || new Set();
      reverseSourceSet.add(id);
      this.sourceIndices.set(targetId, reverseSourceSet);

      const reverseTargetSet = this.targetIndices.get(sourceId) || new Set();
      reverseTargetSet.add(id);
      this.targetIndices.set(sourceId, reverseTargetSet);
    }

    return relationship;
  }

  getRelationship(id: string): Relationship | null {
    return this.relationships.get(id) || null;
  }

  getRelationshipsByType(type: string): Relationship[] {
    const ids = this.typeIndices.get(type) || new Set();
    return Array.from(ids).map(id => this.relationships.get(id)!).filter(Boolean);
  }

  getRelationshipsFrom(sourceId: string): Relationship[] {
    const ids = this.sourceIndices.get(sourceId) || new Set();
    return Array.from(ids).map(id => this.relationships.get(id)!).filter(Boolean);
  }

  getRelationshipsTo(targetId: string): Relationship[] {
    const ids = this.targetIndices.get(targetId) || new Set();
    return Array.from(ids).map(id => this.relationships.get(id)!).filter(Boolean);
  }

  getRelationshipsForEntity(entityId: string): Relationship[] {
    const relationships = new Set<Relationship>();
    const from = this.getRelationshipsFrom(entityId);
    from.forEach(r => relationships.add(r));
    const to = this.getRelationshipsTo(entityId);
    to.forEach(r => relationships.add(r));
    return Array.from(relationships);
  }

  getDirectRelationship(sourceId: string, targetId: string): Relationship | null {
    const relationships = this.getRelationshipsFrom(sourceId);
    return relationships.find(r => r.targetId === targetId) || null;
  }

  findPath(startId: string, endId: string, maxDepth: number = 5): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();
    const queue: Array<{ id: string; path: string[]; depth: number }> = [
      { id: startId, path: [startId], depth: 0 }
    ];

    while (queue.length > 0) {
      const { id, path, depth } = queue.shift()!;

      if (id === endId) {
        paths.push(path);
        continue;
      }

      if (depth >= maxDepth) continue;
      if (visited.has(id)) continue;
      visited.add(id);

      const neighbors = this.getRelationshipsFrom(id);
      for (const relationship of neighbors) {
        if (!visited.has(relationship.targetId)) {
          queue.push({
            id: relationship.targetId,
            path: [...path, relationship.targetId],
            depth: depth + 1,
          });
        }
      }
    }

    return paths;
  }

  updateRelationship(id: string, updates: Partial<Relationship>): Relationship | null {
    const relationship = this.relationships.get(id);
    if (!relationship) return null;

    const updated: Relationship = {
      ...relationship,
      ...updates,
      id: relationship.id,
      createdAt: relationship.createdAt,
      updatedAt: new Date(),
    };

    this.relationships.set(id, updated);
    return updated;
  }

  deleteRelationship(id: string): boolean {
    const relationship = this.relationships.get(id);
    if (!relationship) return false;

    const typeSet = this.typeIndices.get(relationship.type);
    if (typeSet) typeSet.delete(id);

    const sourceSet = this.sourceIndices.get(relationship.sourceId);
    if (sourceSet) sourceSet.delete(id);

    const targetSet = this.targetIndices.get(relationship.targetId);
    if (targetSet) targetSet.delete(id);

    if (relationship.direction === 'undirected') {
      const reverseSourceSet = this.sourceIndices.get(relationship.targetId);
      if (reverseSourceSet) reverseSourceSet.delete(id);

      const reverseTargetSet = this.targetIndices.get(relationship.sourceId);
      if (reverseTargetSet) reverseTargetSet.delete(id);
    }

    this.relationships.delete(id);
    return true;
  }

  getStats(): Record<string, number> {
    const stats: Record<string, number> = { total: this.relationships.size };
    this.typeIndices.forEach((set, type) => { stats[type] = set.size; });
    return stats;
  }

  getRelationshipType(name: string): RelationshipType | null {
    return this.relationshipTypes.get(name) || null;
  }

  getAllRelationshipTypes(): RelationshipType[] {
    return Array.from(this.relationshipTypes.values());
  }

  exportRelationships(): Relationship[] {
    return Array.from(this.relationships.values());
  }

  importRelationships(relationships: Relationship[]): void {
    relationships.forEach(relationship => {
      this.relationships.set(relationship.id, relationship);
      const typeSet = this.typeIndices.get(relationship.type) || new Set();
      typeSet.add(relationship.id);
      this.typeIndices.set(relationship.type, typeSet);
    });
  }

  clear(): void {
    this.relationships.clear();
    this.typeIndices.forEach(set => set.clear());
    this.sourceIndices.forEach(set => set.clear());
    this.targetIndices.forEach(set => set.clear());
  }
}

export default RelationshipManager;
