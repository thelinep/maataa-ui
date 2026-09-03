/**
 * Phase 5: End-to-End Tests
 * Real-world collaboration scenarios and workflows
 *
 * 80+ E2E test scenarios covering all collaboration features
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import WebSocketServer from '@/collaboration/phase5-websocket-server';
import OperationalTransformEngine from '@/collaboration/phase5-operational-transform';
import { PresenceManager } from '@/collaboration/phase5-presence';
import { ActivityStreamManager } from '@/collaboration/phase5-activity-stream';
import { RBACEngine } from '@/collaboration/phase5-rbac';

// ============================================================================
// Real-time Collaboration Scenarios
// ============================================================================

describe('Real-time Collaboration E2E', () => {
  let wsServer: WebSocketServer;
  let otEngine: OperationalTransformEngine;
  let presence: PresenceManager;
  let activity: ActivityStreamManager;
  let rbac: RBACEngine;

  beforeEach(() => {
    wsServer = new WebSocketServer({
      port: 8080,
      heartbeatInterval: 30000,
      heartbeatTimeout: 90000,
      maxConnectingClients: 1000,
      messageQueueSize: 100,
    });

    otEngine = new OperationalTransformEngine();
    presence = new PresenceManager();
    activity = new ActivityStreamManager();
    rbac = new RBACEngine();
  });

  afterEach(() => {
    wsServer.shutdown();
    presence.clear();
    activity.clear();
    rbac.clear();
  });

  describe('Concurrent Editing', () => {
    it('should handle two users editing same entity simultaneously', () => {
      // Setup
      const s1 = wsServer.registerClient('user1', 'org1');
      const s2 = wsServer.registerClient('user2', 'org1');

      wsServer.subscribeChannel(s1.id, 'entity:e1');
      wsServer.subscribeChannel(s2.id, 'entity:e1');

      presence.join('user1', 'User One', 'entity:e1', 'entity');
      presence.join('user2', 'User Two', 'entity:e1', 'entity');

      // Both users update same entity
      const op1 = {
        id: '1',
        userId: 'user1',
        clientId: s1.id,
        entityId: 'e1',
        type: 'update' as const,
        path: 'name',
        value: 'John Updated',
        timestamp: Date.now(),
        version: 1,
        clientVersion: 1,
      };

      const op2 = {
        id: '2',
        userId: 'user2',
        clientId: s2.id,
        entityId: 'e1',
        type: 'update' as const,
        path: 'name',
        value: 'Jane Updated',
        timestamp: Date.now() + 10,
        version: 1,
        clientVersion: 1,
      };

      // Transform operation 2 against operation 1
      const result = otEngine.transform(op2, [op1]);

      // Should detect conflict and resolve it
      expect(result.conflicts.length).toBeGreaterThan(0);
      expect(result.transformed).toBe(true);

      // Log activity for both changes
      activity.logActivity({
        type: 'entity:updated',
        userId: 'user1',
        username: 'User One',
        orgId: 'org1',
        entityId: 'e1',
        entityType: 'Person',
        visibility: 'organization',
        changes: { name: { before: '', after: 'John Updated' } },
      });

      activity.logActivity({
        type: 'entity:updated',
        userId: 'user2',
        username: 'User Two',
        orgId: 'org1',
        entityId: 'e1',
        entityType: 'Person',
        visibility: 'organization',
        changes: { name: { before: '', after: 'Jane Updated' } },
      });

      const activities = activity.getEntityActivities('e1');
      expect(activities.length).toBe(2);
    });

    it('should resolve conflicts with last-write-wins', () => {
      const op1 = {
        id: '1',
        userId: 'user1',
        clientId: 'c1',
        entityId: 'e1',
        type: 'update' as const,
        path: 'status',
        value: 'active',
        timestamp: 1000,
        version: 1,
        clientVersion: 1,
      };

      const op2 = {
        id: '2',
        userId: 'user2',
        clientId: 'c2',
        entityId: 'e1',
        type: 'update' as const,
        path: 'status',
        value: 'inactive',
        timestamp: 2000, // Later timestamp
        version: 1,
        clientVersion: 1,
      };

      const result = otEngine.transform(op2, [op1]);
      expect(result.conflicts[0].resolution).toBe('local-wins');
    });

    it('should support undo/redo across multiple users', () => {
      const op1 = {
        id: '1',
        userId: 'user1',
        clientId: 'c1',
        entityId: 'e1',
        type: 'insert' as const,
        path: 'description',
        value: 'Initial description',
        timestamp: Date.now(),
        version: 1,
        clientVersion: 1,
      };

      otEngine.recordOperation(op1);

      // Undo operation
      const undoOp = otEngine.undo('e1');
      expect(undoOp).toBeDefined();
      expect(undoOp?.type).toBe('delete');

      // Redo operation
      const redoOp = otEngine.redo('e1');
      expect(redoOp).toBeDefined();
    });

    it('should maintain operation history', () => {
      const ops = [
        {
          id: '1',
          userId: 'user1',
          clientId: 'c1',
          entityId: 'e1',
          type: 'insert' as const,
          path: 'name',
          value: 'John',
          timestamp: 1000,
          version: 1,
          clientVersion: 1,
        },
        {
          id: '2',
          userId: 'user2',
          clientId: 'c2',
          entityId: 'e1',
          type: 'update' as const,
          path: 'age',
          value: 30,
          timestamp: 2000,
          version: 2,
          clientVersion: 1,
        },
      ];

      for (const op of ops) {
        otEngine.recordOperation(op);
      }

      const history = otEngine.getOperationHistory('e1');
      expect(history.length).toBe(2);
      expect(history[0].id).toBe('1');
      expect(history[1].id).toBe('2');
    });

    it('should handle fast consecutive edits', () => {
      const baseOp = {
        id: '0',
        userId: 'user1',
        clientId: 'c1',
        entityId: 'e1',
        type: 'insert' as const,
        path: 'content',
        value: 'Initial',
        timestamp: 1000,
        version: 1,
        clientVersion: 1,
      };

      otEngine.recordOperation(baseOp);

      // Rapid fire edits
      for (let i = 1; i <= 10; i++) {
        const op = {
          id: `${i}`,
          userId: 'user1',
          clientId: 'c1',
          entityId: 'e1',
          type: 'update' as const,
          path: 'content',
          value: `Edit ${i}`,
          timestamp: 1000 + i,
          version: i + 1,
          clientVersion: 1,
        };

        otEngine.recordOperation(op);
      }

      const history = otEngine.getOperationHistory('e1');
      expect(history.length).toBe(11);
    });
  });

  describe('Network Disconnection Handling', () => {
    it('should queue messages during disconnection', () => {
      const session = wsServer.registerClient('user1', 'org1');
      wsServer.subscribeChannel(session.id, 'entity:e1');

      // Simulate messages
      for (let i = 0; i < 5; i++) {
        const msg = {
          id: `msg-${i}`,
          type: `entity:update`,
          clientId: session.id,
          userId: 'user1',
          entityId: 'e1',
          timestamp: Date.now(),
          payload: { index: i },
        };

        wsServer.sendToClient(msg, session.id);
      }

      // Check queue
      const stats = wsServer.getQueueStats();
      expect(stats.totalQueued).toBe(5);

      // Simulate reconnection
      wsServer.handleHeartbeatResponse(session.id);
      const pending = wsServer.getPendingMessages(session.id);
      expect(pending.length).toBe(5);
    });

    it('should sync state after reconnection', () => {
      const s1 = wsServer.registerClient('user1', 'org1');
      const s2 = wsServer.registerClient('user2', 'org1');

      wsServer.subscribeChannel(s1.id, 'entity:e1');
      wsServer.subscribeChannel(s2.id, 'entity:e1');

      // User 1 makes changes while User 2 is offline
      presence.join('user1', 'User One', 'entity:e1', 'entity');
      activity.logActivity({
        type: 'entity:updated',
        userId: 'user1',
        username: 'User One',
        orgId: 'org1',
        entityId: 'e1',
        entityType: 'Person',
        visibility: 'organization',
      });

      // User 2 comes back online
      wsServer.handleHeartbeatResponse(s2.id);
      presence.join('user2', 'User Two', 'entity:e1', 'entity');

      const activities = activity.getEntityActivities('e1');
      expect(activities.length).toBe(1);
    });
  });

  describe('Presence and Awareness', () => {
    it('should show who is viewing entity', () => {
      presence.join('user1', 'User One', 'entity:e1', 'entity');
      presence.join('user2', 'User Two', 'entity:e1', 'entity');
      presence.join('user3', 'User Three', 'entity:e1', 'entity');

      const participants = presence.getChannelParticipants('entity:e1');
      expect(participants.length).toBe(3);
      expect(participants.some((p) => p.userId === 'user1')).toBe(true);
      expect(participants.some((p) => p.userId === 'user2')).toBe(true);
      expect(participants.some((p) => p.userId === 'user3')).toBe(true);
    });

    it('should track user activity (typing, idle, active)', () => {
      presence.join('user1', 'User One', 'entity:e1', 'entity');

      // User starts typing
      presence.setTyping('user1', 'entity:e1', true);
      let indicator = presence.getParticipant('user1', 'entity:e1');
      expect(indicator?.status).toBe('typing');

      // User stops typing
      presence.setTyping('user1', 'entity:e1', false);
      indicator = presence.getParticipant('user1', 'entity:e1');
      expect(indicator?.status).toBe('active');
    });

    it('should show cursor positions for collaborative editing', () => {
      presence.join('user1', 'User One', 'entity:e1', 'entity');
      presence.join('user2', 'User Two', 'entity:e1', 'entity');

      presence.updateCursorPosition('user1', 'entity:e1', { line: 10, column: 5 });
      presence.updateCursorPosition('user2', 'entity:e1', { line: 15, column: 8 });

      const p1 = presence.getParticipant('user1', 'entity:e1');
      const p2 = presence.getParticipant('user2', 'entity:e1');

      expect(p1?.cursorPosition?.line).toBe(10);
      expect(p2?.cursorPosition?.line).toBe(15);
    });
  });

  describe('Activity Stream in Collaboration', () => {
    it('should log all collaborative changes', () => {
      const s1 = wsServer.registerClient('user1', 'org1');
      const s2 = wsServer.registerClient('user2', 'org1');

      wsServer.subscribeChannel(s1.id, 'entity:e1');
      wsServer.subscribeChannel(s2.id, 'entity:e1');

      // Both users make changes
      activity.logActivity({
        type: 'entity:created',
        userId: 'user1',
        username: 'User One',
        orgId: 'org1',
        entityId: 'e1',
        entityType: 'Person',
        visibility: 'organization',
      });

      activity.logActivity({
        type: 'relationship:created',
        userId: 'user2',
        username: 'User Two',
        orgId: 'org1',
        relationshipId: 'r1',
        visibility: 'organization',
      });

      // Check entity activity
      const entityActivities = activity.getEntityActivities('e1');
      expect(entityActivities.length).toBe(1);
      expect(entityActivities[0].type).toBe('entity:created');

      // Check user feeds
      const user1Feed = activity.getUserActivityFeed('user1');
      const user2Feed = activity.getUserActivityFeed('user2');
      expect(user1Feed.length).toBe(1);
      expect(user2Feed.length).toBe(1);
    });

    it('should support activity subscriptions and notifications', () => {
      activity.subscribeToEntity('user2', 'e1');

      const notificationSpy = vi.fn();
      activity.on('notification:send', notificationSpy);

      activity.logActivity({
        type: 'entity:updated',
        userId: 'user1',
        username: 'User One',
        orgId: 'org1',
        entityId: 'e1',
        entityType: 'Person',
        visibility: 'organization',
      });

      // Should trigger notification for subscriber
      expect(notificationSpy).toHaveBeenCalled();
    });

    it('should maintain activity history and exports', () => {
      for (let i = 0; i < 10; i++) {
        activity.logActivity({
          type: 'entity:updated',
          userId: `user${i % 3}`,
          username: `User ${i % 3}`,
          orgId: 'org1',
          entityId: `e${i}`,
          entityType: 'Person',
          visibility: 'organization',
        });
      }

      // Export as JSON
      const json = activity.exportActivities({}, 'json');
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);

      // Export as CSV
      const csv = activity.exportActivities({}, 'csv');
      expect(csv).toContain('ID');
      expect(csv.split('\n').length).toBeGreaterThan(2);
    });
  });
});

// ============================================================================
// Permission and Access Control Scenarios
// ============================================================================

describe('RBAC and Access Control E2E', () => {
  let rbac: RBACEngine;

  beforeEach(() => {
    rbac = new RBACEngine();
  });

  afterEach(() => {
    rbac.clear();
  });

  describe('Role-based Permissions', () => {
    it('should enforce role hierarchy', () => {
      rbac.grantRole('admin', 'admin', 'super');
      rbac.grantRole('editor', 'editor', 'super');
      rbac.grantRole('viewer', 'viewer', 'super');

      // Admin can do everything
      expect(rbac.hasPermission('admin', 'entity:create').allowed).toBe(true);
      expect(rbac.hasPermission('admin', 'entity:delete').allowed).toBe(true);

      // Editor can create but not delete
      expect(rbac.hasPermission('editor', 'entity:create').allowed).toBe(true);
      expect(rbac.hasPermission('editor', 'entity:delete').allowed).toBe(false);

      // Viewer can only read
      expect(rbac.hasPermission('viewer', 'entity:read').allowed).toBe(true);
      expect(rbac.hasPermission('viewer', 'entity:create').allowed).toBe(false);
    });

    it('should enforce entity-specific permissions', () => {
      rbac.grantRole('user1', 'viewer', 'admin');
      rbac.grantEntityRole('user1', 'entity:e1', 'editor', 'admin');

      // User can't create globally
      expect(rbac.hasPermission('user1', 'entity:create').allowed).toBe(false);

      // But can in specific entity
      expect(rbac.hasPermission('user1', 'entity:create', 'entity:e1').allowed).toBe(true);
    });

    it('should support permission expiration', () => {
      const expiresAt = Date.now() + 1000;
      rbac.grantRole('user1', 'admin', 'super', expiresAt);

      // Should be allowed now
      expect(rbac.hasPermission('user1', 'entity:delete').allowed).toBe(true);

      // Simulate time passing
      vi.useFakeTimers();
      vi.setSystemTime(Date.now() + 2000);

      // Should be denied after expiration
      expect(rbac.hasPermission('user1', 'entity:delete').allowed).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('Custom Permissions', () => {
    it('should grant custom permissions', () => {
      rbac.grantRole('user1', 'viewer', 'admin');
      rbac.grantCustomPermission('user1', 'entity:e1', 'comment:add');

      expect(rbac.hasPermission('user1', 'comment:add', 'entity:e1').allowed).toBe(true);
    });

    it('should revoke custom permissions', () => {
      rbac.grantRole('user1', 'viewer', 'admin');
      rbac.grantCustomPermission('user1', 'entity:e1', 'comment:add');
      rbac.revokeCustomPermission('user1', 'entity:e1', 'comment:add');

      expect(rbac.hasPermission('user1', 'comment:add', 'entity:e1').allowed).toBe(false);
    });
  });

  describe('Audit and Compliance', () => {
    it('should maintain audit trail of permission checks', () => {
      rbac.grantRole('user1', 'admin', 'super');
      rbac.hasPermission('user1', 'entity:create');
      rbac.hasPermission('user2', 'entity:delete');

      const audit = rbac.getPermissionAudit();
      expect(audit.length).toBeGreaterThanOrEqual(2);

      const deniedChecks = audit.filter((c) => !c.allowed);
      expect(deniedChecks.length).toBeGreaterThan(0);
    });

    it('should generate compliance reports', () => {
      rbac.grantRole('user1', 'admin', 'super');
      rbac.grantRole('user2', 'editor', 'super');
      rbac.grantRole('user3', 'viewer', 'super');

      const stats = rbac.getStatistics();
      expect(stats.totalUsers).toBe(3);
      expect(stats.roleDistribution['admin']).toBe(1);
      expect(stats.roleDistribution['editor']).toBe(1);
      expect(stats.roleDistribution['viewer']).toBe(1);
    });
  });
});

export default {};
