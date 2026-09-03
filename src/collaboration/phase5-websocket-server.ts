/**
 * Phase 5: WebSocket Server Implementation
 * Real-time Collaboration Infrastructure
 *
 * Handles WebSocket connections, message routing, session management,
 * and reliable delivery for collaborative features.
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface WebSocketConfig {
  port: number;
  heartbeatInterval: number;
  heartbeatTimeout: number;
  maxConnectingClients: number;
  messageQueueSize: number;
}

export interface ClientSession {
  id: string;
  userId: string;
  orgId: string;
  connected: boolean;
  lastHeartbeat: number;
  messageQueue: WebSocketMessage[];
  subscriptions: Set<string>;
  metadata: Record<string, any>;
}

export interface WebSocketMessage {
  id: string;
  type: string;
  clientId: string;
  userId: string;
  entityId?: string;
  relationshipId?: string;
  timestamp: number;
  payload: any;
  ack?: boolean;
  version?: number;
}

export interface MessageQueueEntry {
  message: WebSocketMessage;
  recipient: ClientSession;
  attempts: number;
  createdAt: number;
}

export interface SubscriptionChannel {
  channelId: string;
  subscribers: Set<string>;
  entityId?: string;
  type: 'entity' | 'relationship' | 'workspace' | 'global';
}

// ============================================================================
// WebSocket Server
// ============================================================================

export class WebSocketServer extends EventEmitter {
  private config: WebSocketConfig;
  private sessions: Map<string, ClientSession> = new Map();
  private subscriptions: Map<string, SubscriptionChannel> = new Map();
  private messageQueue: Map<string, MessageQueueEntry[]> = new Map();
  private heartbeatIntervals: Map<string, NodeJS.Timer> = new Map();

  constructor(config: WebSocketConfig) {
    super();
    this.config = config;
    this.initializeHeartbeat();
  }

  /**
   * Register new client connection
   */
  public registerClient(userId: string, orgId: string): ClientSession {
    const clientId = uuidv4();
    const session: ClientSession = {
      id: clientId,
      userId,
      orgId,
      connected: true,
      lastHeartbeat: Date.now(),
      messageQueue: [],
      subscriptions: new Set(),
      metadata: {},
    };

    this.sessions.set(clientId, session);
    this.emit('client:connected', { clientId, userId, orgId, timestamp: Date.now() });

    return session;
  }

  /**
   * Disconnect client and cleanup
   */
  public disconnectClient(clientId: string): void {
    const session = this.sessions.get(clientId);
    if (!session) return;

    session.connected = false;

    // Unsubscribe from all channels
    for (const channelId of session.subscriptions) {
      this.unsubscribeChannel(clientId, channelId);
    }

    // Clear queued messages for this client
    for (const [queueKey, queue] of this.messageQueue.entries()) {
      const filtered = queue.filter((entry) => entry.recipient.id !== clientId);
      if (filtered.length === 0) {
        this.messageQueue.delete(queueKey);
      } else {
        this.messageQueue.set(queueKey, filtered);
      }
    }

    this.sessions.delete(clientId);
    this.emit('client:disconnected', {
      clientId,
      userId: session.userId,
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe client to channel
   */
  public subscribeChannel(clientId: string, channelId: string): boolean {
    const session = this.sessions.get(clientId);
    if (!session) return false;

    let subscription = this.subscriptions.get(channelId);
    if (!subscription) {
      subscription = {
        channelId,
        subscribers: new Set(),
        type: this.inferChannelType(channelId),
      };
      this.subscriptions.set(channelId, subscription);
    }

    subscription.subscribers.add(clientId);
    session.subscriptions.add(channelId);

    this.emit('subscription:created', {
      clientId,
      channelId,
      type: subscription.type,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Unsubscribe client from channel
   */
  public unsubscribeChannel(clientId: string, channelId: string): boolean {
    const session = this.sessions.get(clientId);
    if (!session) return false;

    const subscription = this.subscriptions.get(channelId);
    if (!subscription) return false;

    subscription.subscribers.delete(clientId);
    session.subscriptions.delete(channelId);

    if (subscription.subscribers.size === 0) {
      this.subscriptions.delete(channelId);
    }

    this.emit('subscription:removed', { clientId, channelId, timestamp: Date.now() });
    return true;
  }

  /**
   * Broadcast message to channel subscribers
   */
  public broadcastToChannel(
    message: WebSocketMessage,
    channelId: string,
    excludeClientId?: string
  ): number {
    const subscription = this.subscriptions.get(channelId);
    if (!subscription) return 0;

    let broadcastCount = 0;
    for (const clientId of subscription.subscribers) {
      if (excludeClientId && clientId === excludeClientId) continue;

      const session = this.sessions.get(clientId);
      if (!session) continue;

      this.queueMessage(message, session);
      broadcastCount++;
    }

    this.emit('broadcast:sent', {
      channelId,
      messageId: message.id,
      recipientCount: broadcastCount,
      timestamp: Date.now(),
    });

    return broadcastCount;
  }

  /**
   * Send direct message to client
   */
  public sendToClient(message: WebSocketMessage, clientId: string): boolean {
    const session = this.sessions.get(clientId);
    if (!session) return false;

    this.queueMessage(message, session);
    return true;
  }

  /**
   * Queue message for delivery with retry logic
   */
  private queueMessage(message: WebSocketMessage, session: ClientSession): void {
    const queueKey = `${session.id}`;
    const queue = this.messageQueue.get(queueKey) || [];

    // Enforce queue size limit
    if (queue.length >= this.config.messageQueueSize) {
      queue.shift(); // Remove oldest message
    }

    const entry: MessageQueueEntry = {
      message,
      recipient: session,
      attempts: 0,
      createdAt: Date.now(),
    };

    queue.push(entry);
    this.messageQueue.set(queueKey, queue);

    // Attempt immediate delivery if connected
    if (session.connected) {
      this.attemptMessageDelivery(entry);
    }
  }

  /**
   * Attempt to deliver queued message
   */
  private attemptMessageDelivery(entry: MessageQueueEntry): void {
    entry.attempts++;

    // Simulate delivery (in real implementation, would send over WebSocket)
    if (entry.recipient.connected) {
      entry.recipient.messageQueue.push(entry.message);
      this.emit('message:delivered', {
        messageId: entry.message.id,
        clientId: entry.recipient.id,
        attempt: entry.attempts,
        timestamp: Date.now(),
      });
    } else if (entry.attempts < 3) {
      // Retry with exponential backoff
      const backoffMs = Math.pow(2, entry.attempts - 1) * 1000;
      setTimeout(() => this.attemptMessageDelivery(entry), backoffMs);
    } else {
      this.emit('message:failed', {
        messageId: entry.message.id,
        clientId: entry.recipient.id,
        reason: 'max_retries_exceeded',
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Get pending messages for client
   */
  public getPendingMessages(clientId: string): WebSocketMessage[] {
    const session = this.sessions.get(clientId);
    if (!session) return [];

    const messages = [...session.messageQueue];
    session.messageQueue = [];
    return messages;
  }

  /**
   * Process acknowledgment for message
   */
  public acknowledgeMessage(clientId: string, messageId: string): boolean {
    const queueKey = clientId;
    const queue = this.messageQueue.get(queueKey);
    if (!queue) return false;

    const index = queue.findIndex((entry) => entry.message.id === messageId);
    if (index === -1) return false;

    queue.splice(index, 1);
    this.emit('message:acknowledged', {
      messageId,
      clientId,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Heartbeat mechanism for connection health
   */
  private initializeHeartbeat(): void {
    const interval = setInterval(() => {
      const now = Date.now();
      const sessionIds = Array.from(this.sessions.keys());

      for (const clientId of sessionIds) {
        const session = this.sessions.get(clientId);
        if (!session) continue;

        const timeSinceHeartbeat = now - session.lastHeartbeat;

        if (timeSinceHeartbeat > this.config.heartbeatTimeout) {
          // Connection dead, disconnect
          this.disconnectClient(clientId);
        } else if (session.connected) {
          // Send heartbeat ping
          const heartbeatMsg: WebSocketMessage = {
            id: uuidv4(),
            type: 'heartbeat:ping',
            clientId,
            userId: session.userId,
            timestamp: now,
            payload: { sequence: Math.floor(now / this.config.heartbeatInterval) },
          };

          this.sendToClient(heartbeatMsg, clientId);
        }
      }
    }, this.config.heartbeatInterval);

    this.heartbeatIntervals.set('main', interval);
  }

  /**
   * Handle heartbeat response
   */
  public handleHeartbeatResponse(clientId: string): void {
    const session = this.sessions.get(clientId);
    if (session) {
      session.lastHeartbeat = Date.now();
      session.connected = true;
    }
  }

  /**
   * Get session information
   */
  public getSession(clientId: string): ClientSession | undefined {
    return this.sessions.get(clientId);
  }

  /**
   * Get all active sessions for user
   */
  public getUserSessions(userId: string): ClientSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.userId === userId);
  }

  /**
   * Get all active sessions for organization
   */
  public getOrgSessions(orgId: string): ClientSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.orgId === orgId);
  }

  /**
   * Get channel subscription info
   */
  public getChannelInfo(channelId: string): SubscriptionChannel | undefined {
    return this.subscriptions.get(channelId);
  }

  /**
   * Get queue statistics
   */
  public getQueueStats(): {
    totalQueued: number;
    queuesByClient: Record<string, number>;
    oldestMessageAge: number;
  } {
    let totalQueued = 0;
    let oldestMessageAge = 0;
    const queuesByClient: Record<string, number> = {};

    const now = Date.now();
    for (const [clientId, queue] of this.messageQueue.entries()) {
      queuesByClient[clientId] = queue.length;
      totalQueued += queue.length;

      for (const entry of queue) {
        const age = now - entry.createdAt;
        if (age > oldestMessageAge) {
          oldestMessageAge = age;
        }
      }
    }

    return { totalQueued, queuesByClient, oldestMessageAge };
  }

  /**
   * Get connection statistics
   */
  public getConnectionStats(): {
    totalConnected: number;
    totalDisconnected: number;
    byOrg: Record<string, number>;
    byUser: Record<string, number>;
  } {
    const stats = {
      totalConnected: 0,
      totalDisconnected: 0,
      byOrg: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
    };

    for (const session of this.sessions.values()) {
      if (session.connected) {
        stats.totalConnected++;
      } else {
        stats.totalDisconnected++;
      }

      stats.byOrg[session.orgId] = (stats.byOrg[session.orgId] || 0) + 1;
      stats.byUser[session.userId] = (stats.byUser[session.userId] || 0) + 1;
    }

    return stats;
  }

  /**
   * Infer channel type from ID pattern
   */
  private inferChannelType(
    channelId: string
  ): 'entity' | 'relationship' | 'workspace' | 'global' {
    if (channelId.startsWith('entity:')) return 'entity';
    if (channelId.startsWith('relationship:')) return 'relationship';
    if (channelId.startsWith('workspace:')) return 'workspace';
    return 'global';
  }

  /**
   * Shutdown server
   */
  public shutdown(): void {
    for (const interval of this.heartbeatIntervals.values()) {
      clearInterval(interval);
    }

    for (const clientId of Array.from(this.sessions.keys())) {
      this.disconnectClient(clientId);
    }

    this.sessions.clear();
    this.subscriptions.clear();
    this.messageQueue.clear();
    this.heartbeatIntervals.clear();

    this.emit('server:shutdown', { timestamp: Date.now() });
  }
}

// ============================================================================
// Message Factory
// ============================================================================

export class WebSocketMessageFactory {
  static createEntityMessage(
    type: string,
    clientId: string,
    userId: string,
    entityId: string,
    payload: any
  ): WebSocketMessage {
    return {
      id: uuidv4(),
      type: `entity:${type}`,
      clientId,
      userId,
      entityId,
      timestamp: Date.now(),
      payload,
      ack: true,
      version: 1,
    };
  }

  static createRelationshipMessage(
    type: string,
    clientId: string,
    userId: string,
    relationshipId: string,
    payload: any
  ): WebSocketMessage {
    return {
      id: uuidv4(),
      type: `relationship:${type}`,
      clientId,
      userId,
      relationshipId,
      timestamp: Date.now(),
      payload,
      ack: true,
      version: 1,
    };
  }

  static createPresenceMessage(
    clientId: string,
    userId: string,
    action: 'join' | 'leave' | 'typing' | 'idle',
    entityId: string,
    metadata: any = {}
  ): WebSocketMessage {
    return {
      id: uuidv4(),
      type: `presence:${action}`,
      clientId,
      userId,
      entityId,
      timestamp: Date.now(),
      payload: { action, metadata },
      ack: false,
    };
  }

  static createActivityMessage(
    clientId: string,
    userId: string,
    action: string,
    entityId: string,
    changes: Record<string, any>
  ): WebSocketMessage {
    return {
      id: uuidv4(),
      type: 'activity:log',
      clientId,
      userId,
      entityId,
      timestamp: Date.now(),
      payload: { action, changes },
      ack: true,
    };
  }
}

export default WebSocketServer;
