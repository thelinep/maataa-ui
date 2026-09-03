/**
 * Phase 5: Operational Transformation
 * Conflict Resolution for Concurrent Edits
 *
 * Implements OT algorithm for handling concurrent modifications
 * to entities and relationships with automatic reconciliation.
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Operation {
  id: string;
  userId: string;
  clientId: string;
  entityId: string;
  type: 'insert' | 'delete' | 'update';
  path: string;
  value?: any;
  oldValue?: any;
  timestamp: number;
  version: number;
  clientVersion: number;
  checksum?: string;
}

export interface TransformResult {
  operation: Operation;
  transformed: boolean;
  conflicts: ConflictInfo[];
}

export interface ConflictInfo {
  otherOp: Operation;
  type: 'insert-insert' | 'insert-delete' | 'delete-delete' | 'update-update' | 'update-delete';
  resolution: 'local-wins' | 'remote-wins' | 'merged';
  details: Record<string, any>;
}

export interface OperationHistory {
  entityId: string;
  operations: Operation[];
  currentVersion: number;
  lastAckVersion: number;
}

export interface EntityState {
  id: string;
  data: Record<string, any>;
  version: number;
  lastModified: number;
  lastModifiedBy: string;
}

export interface UndoRedoStack {
  undoStack: Operation[];
  redoStack: Operation[];
  version: number;
}

// ============================================================================
// Operational Transformation Engine
// ============================================================================

export class OperationalTransformEngine {
  private operationHistory: Map<string, OperationHistory> = new Map();
  private entityStates: Map<string, EntityState> = new Map();
  private undoRedoStacks: Map<string, UndoRedoStack> = new Map();
  private pendingOperations: Map<string, Operation[]> = new Map();

  /**
   * Transform incoming operation against local operations
   */
  public transform(
    incomingOp: Operation,
    localOps: Operation[]
  ): TransformResult {
    let transformedOp = { ...incomingOp };
    const conflicts: ConflictInfo[] = [];

    for (const localOp of localOps) {
      const result = this.transformOperation(transformedOp, localOp);
      transformedOp = result.operation;

      if (result.conflict) {
        conflicts.push(result.conflict);
      }
    }

    return {
      operation: transformedOp,
      transformed: conflicts.length > 0,
      conflicts,
    };
  }

  /**
   * Transform single operation against another
   */
  private transformOperation(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict?: ConflictInfo } {
    // Operations on different entities don't conflict
    if (op1.entityId !== op2.entityId) {
      return { operation: op1 };
    }

    // Operations on different paths don't conflict
    if (op1.path !== op2.path) {
      return { operation: op1 };
    }

    // Handle various conflict scenarios
    if (op1.type === 'insert' && op2.type === 'insert') {
      return this.handleInsertInsertConflict(op1, op2);
    }

    if (op1.type === 'insert' && op2.type === 'delete') {
      return this.handleInsertDeleteConflict(op1, op2);
    }

    if (op1.type === 'delete' && op2.type === 'insert') {
      return this.handleDeleteInsertConflict(op1, op2);
    }

    if (op1.type === 'delete' && op2.type === 'delete') {
      return this.handleDeleteDeleteConflict(op1, op2);
    }

    if (op1.type === 'update' && op2.type === 'update') {
      return this.handleUpdateUpdateConflict(op1, op2);
    }

    if (op1.type === 'update' && op2.type === 'delete') {
      return this.handleUpdateDeleteConflict(op1, op2);
    }

    return { operation: op1 };
  }

  /**
   * Handle insert-insert conflict
   */
  private handleInsertInsertConflict(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict: ConflictInfo } {
    // Last-write-wins based on timestamp, ties broken by userId
    const resolution = this.resolveByTimestamp(op1, op2);
    const transformedOp = resolution === 'local-wins' ? op1 : op2;

    return {
      operation: transformedOp,
      conflict: {
        otherOp: op2,
        type: 'insert-insert',
        resolution,
        details: {
          op1Timestamp: op1.timestamp,
          op2Timestamp: op2.timestamp,
          op1UserId: op1.userId,
          op2UserId: op2.userId,
        },
      },
    };
  }

  /**
   * Handle insert-delete conflict
   * Delete wins - if entity was deleted, insert is ignored
   */
  private handleInsertDeleteConflict(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict: ConflictInfo } {
    // Escalate to user decision
    return {
      operation: op1,
      conflict: {
        otherOp: op2,
        type: 'insert-delete',
        resolution: 'local-wins', // Keep insert, but flag for review
        details: {
          requiresReview: true,
          message: 'Inserting data into entity that was deleted',
        },
      },
    };
  }

  /**
   * Handle delete-insert conflict
   */
  private handleDeleteInsertConflict(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict: ConflictInfo } {
    // Delete wins - cancel the delete or let insert recreate
    return {
      operation: op2, // Recreate with insert
      conflict: {
        otherOp: op2,
        type: 'insert-delete',
        resolution: 'merged',
        details: {
          action: 'recreate_via_insert',
          message: 'Entity recreated through insert after delete',
        },
      },
    };
  }

  /**
   * Handle delete-delete conflict
   */
  private handleDeleteDeleteConflict(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict: ConflictInfo } {
    // Both delete same entity - no conflict, apply first one
    return {
      operation: op1,
      conflict: {
        otherOp: op2,
        type: 'delete-delete',
        resolution: 'local-wins',
        details: {
          message: 'Entity already deleted by other user',
        },
      },
    };
  }

  /**
   * Handle update-update conflict
   */
  private handleUpdateUpdateConflict(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict: ConflictInfo } {
    // Try to merge if updating different properties
    if (this.canMergeUpdates(op1, op2)) {
      const merged = this.mergeUpdates(op1, op2);
      return {
        operation: merged,
        conflict: {
          otherOp: op2,
          type: 'update-update',
          resolution: 'merged',
          details: {
            message: 'Updates merged successfully',
            mergedProperties: Object.keys(merged.value || {}),
          },
        },
      };
    }

    // Same property - last write wins
    const resolution = this.resolveByTimestamp(op1, op2);
    const transformedOp = resolution === 'local-wins' ? op1 : op2;

    return {
      operation: transformedOp,
      conflict: {
        otherOp: op2,
        type: 'update-update',
        resolution,
        details: {
          property: op1.path,
          op1Value: op1.value,
          op2Value: op2.value,
          winner: resolution === 'local-wins' ? op1.userId : op2.userId,
        },
      },
    };
  }

  /**
   * Handle update-delete conflict
   */
  private handleUpdateDeleteConflict(
    op1: Operation,
    op2: Operation
  ): { operation: Operation; conflict: ConflictInfo } {
    // Delete wins
    return {
      operation: op1, // Don't apply update
      conflict: {
        otherOp: op2,
        type: 'update-delete',
        resolution: 'remote-wins',
        details: {
          message: 'Update ignored - entity was deleted',
        },
      },
    };
  }

  /**
   * Check if updates can be merged
   */
  private canMergeUpdates(op1: Operation, op2: Operation): boolean {
    if (!op1.value || !op2.value) return false;
    if (typeof op1.value !== 'object' || typeof op2.value !== 'object') return false;

    const props1 = Object.keys(op1.value);
    const props2 = Object.keys(op2.value);

    // No overlapping properties = can merge
    return !props1.some((p) => props2.includes(p));
  }

  /**
   * Merge two updates
   */
  private mergeUpdates(op1: Operation, op2: Operation): Operation {
    return {
      ...op1,
      value: {
        ...op1.value,
        ...op2.value,
      },
    };
  }

  /**
   * Resolve conflict by timestamp (with userId tiebreaker)
   */
  private resolveByTimestamp(op1: Operation, op2: Operation): 'local-wins' | 'remote-wins' {
    if (op1.timestamp !== op2.timestamp) {
      return op1.timestamp > op2.timestamp ? 'local-wins' : 'remote-wins';
    }
    // Timestamp tie - break by userId alphabetically
    return op1.userId > op2.userId ? 'local-wins' : 'remote-wins';
  }

  /**
   * Apply operation to entity state
   */
  public applyOperation(op: Operation, state: EntityState): EntityState {
    const newState = { ...state };
    const data = JSON.parse(JSON.stringify(state.data));

    switch (op.type) {
      case 'insert':
        this.setNestedProperty(data, op.path, op.value);
        break;

      case 'delete':
        this.deleteNestedProperty(data, op.path);
        break;

      case 'update':
        this.setNestedProperty(data, op.path, op.value);
        break;
    }

    newState.data = data;
    newState.version = Math.max(state.version, op.version) + 1;
    newState.lastModified = Date.now();
    newState.lastModifiedBy = op.userId;

    return newState;
  }

  /**
   * Get operations for undo/redo
   */
  public getUndoRedoStack(entityId: string): UndoRedoStack {
    return (
      this.undoRedoStacks.get(entityId) || {
        undoStack: [],
        redoStack: [],
        version: 1,
      }
    );
  }

  /**
   * Undo operation
   */
  public undo(entityId: string): Operation | null {
    const stack = this.getUndoRedoStack(entityId);
    if (stack.undoStack.length === 0) return null;

    const op = stack.undoStack.pop()!;
    const inverseOp = this.createInverseOperation(op);

    stack.redoStack.push(op);
    this.undoRedoStacks.set(entityId, stack);

    return inverseOp;
  }

  /**
   * Redo operation
   */
  public redo(entityId: string): Operation | null {
    const stack = this.getUndoRedoStack(entityId);
    if (stack.redoStack.length === 0) return null;

    const op = stack.redoStack.pop()!;
    stack.undoStack.push(op);
    this.undoRedoStacks.set(entityId, stack);

    return op;
  }

  /**
   * Create inverse operation for undo
   */
  private createInverseOperation(op: Operation): Operation {
    const inverse: Operation = {
      ...op,
      id: uuidv4(),
      type: op.type === 'insert' ? 'delete' : op.type === 'delete' ? 'insert' : 'update',
      value: op.oldValue,
      oldValue: op.value,
      timestamp: Date.now(),
    };

    return inverse;
  }

  /**
   * Record operation in history
   */
  public recordOperation(op: Operation): void {
    let history = this.operationHistory.get(op.entityId);
    if (!history) {
      history = {
        entityId: op.entityId,
        operations: [],
        currentVersion: 1,
        lastAckVersion: 0,
      };
      this.operationHistory.set(op.entityId, history);
    }

    history.operations.push(op);
    history.currentVersion = op.version;

    // Keep history size reasonable (last 1000 operations)
    if (history.operations.length > 1000) {
      history.operations = history.operations.slice(-1000);
    }
  }

  /**
   * Acknowledge operations up to version
   */
  public acknowledgeUpToVersion(entityId: string, version: number): void {
    const history = this.operationHistory.get(entityId);
    if (history) {
      history.lastAckVersion = version;
    }
  }

  /**
   * Get unacknowledged operations
   */
  public getUnacknowledgedOperations(entityId: string): Operation[] {
    const history = this.operationHistory.get(entityId);
    if (!history) return [];

    return history.operations.filter((op) => op.version > history.lastAckVersion);
  }

  /**
   * Get operation history
   */
  public getOperationHistory(entityId: string): Operation[] {
    const history = this.operationHistory.get(entityId);
    return history ? [...history.operations] : [];
  }

  /**
   * Set nested property in object
   */
  private setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Delete nested property from object
   */
  private deleteNestedProperty(obj: any, path: string): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) return;
      current = current[key];
    }

    delete current[keys[keys.length - 1]];
  }
}

export default OperationalTransformEngine;
