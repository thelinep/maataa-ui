/**
 * Phase 2: Knowledge Base
 * Stores and manages knowledge assertions, facts, and information
 */

import { v4 as uuidv4 } from 'uuid';

export interface Fact {
  id: string;
  subject: string;
  predicate: string;
  object: string | number | boolean;
  sourceId?: string;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
  evidence?: string[];
  notes?: string;
  tags?: string[];
}

export interface Query {
  subject?: string;
  predicate?: string;
  object?: string | number | boolean;
  confidence?: number;
  limit?: number;
}

export class KnowledgeBase {
  private facts: Map<string, Fact> = new Map();
  private subjectIndex: Map<string, Set<string>> = new Map();
  private predicateIndex: Map<string, Set<string>> = new Map();
  private objectIndex: Map<string | number | boolean, Set<string>> = new Map();
  private fullTextIndex: Map<string, Set<string>> = new Map();

  addFact(
    subject: string,
    predicate: string,
    object: string | number | boolean,
    options: {
      sourceId?: string;
      confidence?: number;
      evidence?: string[];
      notes?: string;
      tags?: string[];
    } = {}
  ): Fact {
    const id = uuidv4();
    const now = new Date();

    const fact: Fact = {
      id,
      subject,
      predicate,
      object,
      sourceId: options.sourceId,
      confidence: options.confidence ?? 1,
      evidence: options.evidence,
      notes: options.notes,
      tags: options.tags,
      createdAt: now,
      updatedAt: now,
    };

    this.facts.set(id, fact);

    const subjectSet = this.subjectIndex.get(subject) || new Set();
    subjectSet.add(id);
    this.subjectIndex.set(subject, subjectSet);

    const predicateSet = this.predicateIndex.get(predicate) || new Set();
    predicateSet.add(id);
    this.predicateIndex.set(predicate, predicateSet);

    const objectSet = this.objectIndex.get(object) || new Set();
    objectSet.add(id);
    this.objectIndex.set(object, objectSet);

    this.indexFullText(id, `${subject} ${predicate} ${object}`);
    return fact;
  }

  query(query: Query): Fact[] {
    let results: Set<string>;

    if (query.subject) {
      results = new Set(this.subjectIndex.get(query.subject) || []);
    } else if (query.predicate) {
      results = new Set(this.predicateIndex.get(query.predicate) || []);
    } else if (query.object !== undefined) {
      results = new Set(this.objectIndex.get(query.object) || []);
    } else {
      results = new Set(this.facts.keys());
    }

    let facts = Array.from(results)
      .map(id => this.facts.get(id)!)
      .filter(Boolean);

    if (query.subject) facts = facts.filter(f => f.subject === query.subject);
    if (query.predicate) facts = facts.filter(f => f.predicate === query.predicate);
    if (query.object !== undefined) facts = facts.filter(f => f.object === query.object);
    if (query.confidence !== undefined) facts = facts.filter(f => f.confidence >= query.confidence!);

    if (query.limit) facts = facts.slice(0, query.limit);
    return facts;
  }

  search(text: string): Fact[] {
    const terms = text.toLowerCase().split(/\s+/);
    const resultSets = terms.map(term => this.fullTextIndex.get(term) || new Set());

    if (resultSets.length === 0) return [];
    if (resultSets.length === 1) {
      return Array.from(resultSets[0])
        .map(id => this.facts.get(id)!)
        .filter(Boolean);
    }

    const intersection = new Set(
      Array.from(resultSets[0]).filter(id =>
        resultSets.every(set => set.has(id))
      )
    );

    return Array.from(intersection)
      .map(id => this.facts.get(id)!)
      .filter(Boolean);
  }

  getFactsAbout(entityId: string): Fact[] {
    const outgoing = this.query({ subject: entityId });
    const incoming = this.query({ object: entityId });
    const facts = new Map<string, Fact>();
    [...outgoing, ...incoming].forEach(fact => {
      facts.set(fact.id, fact);
    });
    return Array.from(facts.values());
  }

  updateFact(id: string, updates: Partial<Fact>): Fact | null {
    const fact = this.facts.get(id);
    if (!fact) return null;

    const updated: Fact = {
      ...fact,
      ...updates,
      id: fact.id,
      createdAt: fact.createdAt,
      updatedAt: new Date(),
    };

    this.facts.set(id, updated);
    this.fullTextIndex.delete(id);
    this.indexFullText(id, `${updated.subject} ${updated.predicate} ${updated.object}`);
    return updated;
  }

  deleteFact(id: string): boolean {
    const fact = this.facts.get(id);
    if (!fact) return false;

    const subjectSet = this.subjectIndex.get(fact.subject);
    if (subjectSet) subjectSet.delete(id);

    const predicateSet = this.predicateIndex.get(fact.predicate);
    if (predicateSet) predicateSet.delete(id);

    const objectSet = this.objectIndex.get(fact.object);
    if (objectSet) objectSet.delete(id);

    this.fullTextIndex.forEach(set => set.delete(id));
    this.facts.delete(id);
    return true;
  }

  getStats(): Record<string, number> {
    const stats: Record<string, number> = {
      totalFacts: this.facts.size,
      uniqueSubjects: this.subjectIndex.size,
      uniquePredicates: this.predicateIndex.size,
      uniqueObjects: this.objectIndex.size,
      averageConfidence: this.getAverageConfidence(),
    };
    return stats;
  }

  private getAverageConfidence(): number {
    if (this.facts.size === 0) return 0;
    const total = Array.from(this.facts.values()).reduce(
      (sum, fact) => sum + fact.confidence,
      0
    );
    return total / this.facts.size;
  }

  private indexFullText(factId: string, text: string): void {
    const terms = text.toLowerCase().split(/\s+/);
    terms.forEach(term => {
      const set = this.fullTextIndex.get(term) || new Set();
      set.add(factId);
      this.fullTextIndex.set(term, set);
    });
  }

  exportFacts(): Fact[] {
    return Array.from(this.facts.values());
  }

  importFacts(facts: Fact[]): void {
    facts.forEach(fact => {
      this.facts.set(fact.id, fact);
      const subjectSet = this.subjectIndex.get(fact.subject) || new Set();
      subjectSet.add(fact.id);
      this.subjectIndex.set(fact.subject, subjectSet);
    });
  }

  clear(): void {
    this.facts.clear();
    this.subjectIndex.clear();
    this.predicateIndex.clear();
    this.objectIndex.clear();
    this.fullTextIndex.clear();
  }
}

export default KnowledgeBase;
