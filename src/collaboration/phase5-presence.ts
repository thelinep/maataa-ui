/**
 * Phase 5: Live Presence Indicators
 * Real-time User Presence and Activity Status
 *
 * Tracks user presence in entities, relationships, and shows
 * activity status like typing, viewing, and idle states.
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type PresenceStatus = 'active' | 'typing' | 'idle' | 'offline';

export interface PresenceIndicator {
  userId: string;
  username: string;
  avatar?: string;
  color: string;
  status: PresenceStatus;
  entityId?: string;
  relationshipId?: string;
  cursorPosition?: CursorPosition;
  lastActive: number;
  joinedAt: number;
}

export interface CursorPosition {
  line: number;
  column: number;
  selection?: {
    start: number;
    end: number;
  };
}

export interface PresenceChannel {
  id: string;
  type: 'entity' | 'relationship' | 'workspace';
  participants: Map<string, PresenceIndicator>;
  createdAt: number;
}

export interface PresenceUpdate {
  userId: string;
  status: PresenceStatus;
  entityId?: string;
  relationshipId?: string;
  cursorPosition?: CursorPosition;
  timestamp: number;
}

export interface UserPresenceData {
  userId: string;
  currentChannel?: string;
  allPresences: Map<string, PresenceIndicator>;
  statusHistory: PresenceUpdate[];
}

// ============================================================================
// Presence Manager
// ============================================================================

export class PresenceManager extends EventEmitter {
  private channels: Map<string, PresenceChannel> = new Map();
  private userPresence: Map<string, UserPresenceData> = new Map();
  private statusTimeouts: Map<string, NodeJS.Timer> = new Map();
  private idleTimeout: number = 300000; // 5 minutes
  private typingTimeout: number = 5000; // 5 seconds

  constructor(idleTimeout: number = 300000) {
    super();
    this.idleTimeout = idleTimeout;
  }

  /**
   * User joins a channel (entity/relationship/workspace)
   */
  public join(
    userId: string,
    username: string,
    channelId: string,
    channelType: 'entity' | 'relationship' | 'workspace',
    avatar?: string
  ): PresenceIndicator {
    // Get or create channel
    let channel = this.channels.get(channelId);
    if (!channel) {
      channel = {
        id: channelId,
        type: channelType,
        participants: new Map(),
        createdAt: Date.now(),
      };
      this.channels.set(channelId, channel);
    }

    // Create presence indicator
    const color = this.generateUserColor(userId);
    const indicator: PresenceIndicator = {
      userId,
      username,
      avatar,
      color,
      status: 'active',
      entityId: channelType === 'entity' ? channelId : undefined,
      relationshipId: channelType === 'relationship' ? channelId : undefined,
      lastActive: Date.now(),
      joinedAt: Date.now(),
    };

    // Add to channel
    channel.participants.set(userId, indicator);

    // Update user presence data
    this.updateUserPresence(userId, channelId, indicator);

    // Set idle timeout
    this.setIdleTimeout(userId, channelId);

    this.emit('presence:joined', {
      userId,
      username,
      channelId,
      channelType,
      timestamp: Date.now(),
    });

    return indicator;
  }

  /**
   * User leaves a channel
   */
  public leave(userId: string, channelId: string): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;

    const removed = channel.participants.delete(userId);
    if (removed) {
      // Clear timeout
      const timeoutKey = `${userId}:${channelId}`;
      const timeout = this.statusTimeouts.get(timeoutKey);
      if (timeout) {
        clearTimeout(timeout);
        this.statusTimeouts.delete(timeoutKey);
      }

      // Update user presence
      const userData = this.userPresence.get(userId);
      if (userData) {
        userData.allPresences.delete(channelId);
        if (userData.currentChannel === channelId) {
          userData.currentChannel = undefined;
        }
      }

      // Remove empty channel
      if (channel.participants.size === 0) {
        this.channels.delete(channelId);
      }

      this.emit('presence:left', {
        userId,
        channelId,
        timestamp: Date.now(),
      });
    }

    return removed;
  }

  /**
   * Update user typing status
   */
  public setTyping(userId: string, channelId: string, typing: boolean = true): void {
    const channel = this.channels.get(channelId);
    if (!channel) return;

    const indicator = channel.participants.get(userId);
    if (!indicator) return;

    const previousStatus = indicator.status;
    indicator.status = typing ? 'typing' : 'active';
    indicator.lastActive = Date.now();

    // Clear existing typing timeout
    const timeoutKey = `${userId}:${channelId}:typing`;
    const existingTimeout = this.statusTimeouts.get(timeoutKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Auto-expire typing status
    if (typing) {
      const timeout = setTimeout(() => {
        if (indicator.status === 'typing') {
          indicator.status = 'active';
          this.emit('presence:updated', {
            userId,
            channelId,
            status: 'active',
            reason: 'typing_timeout',
            timestamp: Date.now(),
          });
        }
      }, this.typingTimeout);

      this.statusTimeouts.set(timeoutKey, timeout);
    } else {
      this.statusTimeouts.delete(timeoutKey);
    }

    // Record in history
    this.recordPresenceUpdate(userId, {
      userId,
      status: indicator.status,
      entityId: indicator.entityId,
      relationshipId: indicator.relationshipId,
      timestamp: Date.now(),
    });

    if (previousStatus !== indicator.status) {
      this.emit('presence:updated', {
        userId,
        channelId,
        status: indicator.status,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update cursor position for real-time collaboration
   */
  public updateCursorPosition(
    userId: string,
    channelId: string,
    cursorPosition: CursorPosition
  ): void {
    const channel = this.channels.get(channelId);
    if (!channel) return;

    const indicator = channel.participants.get(userId);
    if (!indicator) return;

    indicator.cursorPosition = cursorPosition;
    indicator.lastActive = Date.now();

    this.emit('presence:cursor_updated', {
      userId,
      channelId,
      cursorPosition,
      timestamp: Date.now(),
    });
  }

  /**
   * Record presence for activity stream
   */
  private recordPresenceUpdate(userId: string, update: PresenceUpdate): void {
    let userData = this.userPresence.get(userId);
    if (!userData) {
      userData = {
        userId,
        allPresences: new Map(),
        statusHistory: [],
      };
      this.userPresence.set(userId, userData);
    }

    userData.statusHistory.push(update);

    // Keep reasonable history size (last 500 updates)
    if (userData.statusHistory.length > 500) {
      userData.statusHistory = userData.statusHistory.slice(-500);
    }
  }

  /**
   * Get all participants in channel
   */
  public getChannelParticipants(channelId: string): PresenceIndicator[] {
    const channel = this.channels.get(channelId);
    if (!channel) return [];

    return Array.from(channel.participants.values());
  }

  /**
   * Get participant count for channel
   */
  public getParticipantCount(channelId: string): number {
    const channel = this.channels.get(channelId);
    return channel ? channel.participants.size : 0;
  }

  /**
   * Get active users in channel (excluding offline)
   */
  public getActiveParticipants(channelId: string): PresenceIndicator[] {
    return this.getChannelParticipants(channelId).filter((p) => p.status !== 'offline');
  }

  /**
   * Get user's presence across all channels
   */
  public getUserPresences(userId: string): PresenceIndicator[] {
    const userData = this.userPresence.get(userId);
    if (!userData) return [];

    return Array.from(userData.allPresences.values());
  }

  /**
   * Get participant details
   */
  public getParticipant(userId: string, channelId: string): PresenceIndicator | undefined {
    const channel = this.channels.get(channelId);
    if (!channel) return undefined;

    return channel.participants.get(userId);
  }

  /**
   * Check if user is present in channel
   */
  public isPresent(userId: string, channelId: string): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;

    return channel.participants.has(userId);
  }

  /**
   * Set idle timeout for user
   */
  private setIdleTimeout(userId: string, channelId: string): void {
    const timeoutKey = `${userId}:${channelId}:idle`;

    // Clear existing timeout
    const existingTimeout = this.statusTimeouts.get(timeoutKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      const channel = this.channels.get(channelId);
      if (!channel) return;

      const indicator = channel.participants.get(userId);
      if (indicator) {
        const previousStatus = indicator.status;
        indicator.status = 'idle';

        if (previousStatus !== 'idle') {
          this.emit('presence:updated', {
            userId,
            channelId,
            status: 'idle',
            reason: 'idle_timeout',
            timestamp: Date.now(),
          });
        }
      }
    }, this.idleTimeout);

    this.statusTimeouts.set(timeoutKey, timeout);
  }

  /**
   * Update user presence data
   */
  private updateUserPresence(
    userId: string,
    channelId: string,
    indicator: PresenceIndicator
  ): void {
    let userData = this.userPresence.get(userId);
    if (!userData) {
      userData = {
        userId,
        allPresences: new Map(),
        statusHistory: [],
      };
      this.userPresence.set(userId, userData);
    }

    userData.currentChannel = channelId;
    userData.allPresences.set(channelId, indicator);
  }

  /**
   * Generate consistent color for user
   */
  private generateUserColor(userId: string): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
      '#F8B88B',
      '#A8E6CF',
    ];

    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  }

  /**
   * Get presence statistics
   */
  public getPresenceStats(): {
    totalChannels: number;
    totalParticipants: number;
    participantsByStatus: Record<PresenceStatus, number>;
    channelStats: Array<{
      channelId: string;
      participantCount: number;
      type: string;
    }>;
  } {
    const stats = {
      totalChannels: this.channels.size,
      totalParticipants: 0,
      participantsByStatus: {
        active: 0,
        typing: 0,
        idle: 0,
        offline: 0,
      } as Record<PresenceStatus, number>,
      channelStats: [] as Array<{
        channelId: string;
        participantCount: number;
        type: string;
      }>,
    };

    for (const [channelId, channel] of this.channels.entries()) {
      const participantCount = channel.participants.size;
      stats.totalParticipants += participantCount;

      for (const indicator of channel.participants.values()) {
        stats.participantsByStatus[indicator.status]++;
      }

      stats.channelStats.push({
        channelId,
        participantCount,
        type: channel.type,
      });
    }

    return stats;
  }

  /**
   * Get presence history for user
   */
  public getPresenceHistory(userId: string): PresenceUpdate[] {
    const userData = this.userPresence.get(userId);
    return userData ? [...userData.statusHistory] : [];
  }

  /**
   * Cleanup disconnected users
   */
  public cleanupDisconnected(userIds: string[]): void {
    for (const userId of userIds) {
      const userData = this.userPresence.get(userId);
      if (!userData) continue;

      // Remove from all channels
      const channelIds = Array.from(userData.allPresences.keys());
      for (const channelId of channelIds) {
        this.leave(userId, channelId);
      }
    }
  }

  /**
   * Clear all presence data (for testing/reset)
   */
  public clear(): void {
    for (const timeout of this.statusTimeouts.values()) {
      clearTimeout(timeout);
    }

    this.channels.clear();
    this.userPresence.clear();
    this.statusTimeouts.clear();
  }
}

export default PresenceManager;
