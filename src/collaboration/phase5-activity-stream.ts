/**
 * Phase 5: Activity Stream
 * Comprehensive Activity Logging and Feed
 *
 * Tracks all entity and relationship changes, creates activity feeds,
 * supports filtering, subscriptions, and notifications.
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ActivityType =
  | 'entity:created'
  | 'entity:updated'
  | 'entity:deleted'
  | 'entity:archived'
  | 'relationship:created'
  | 'relationship:updated'
  | 'relationship:deleted'
  | 'relationship:archived'
  | 'permission:changed'
  | 'comment:added'
  | 'task:created'
  | 'task:completed'
  | 'workflow:triggered'
  | 'export:generated'
  | 'import:completed';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  username: string;
  userAvatar?: string;
  orgId: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  relationshipId?: string;
  changes?: Record<string, { before: any; after: any }>;
  description?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  visibility: 'private' | 'team' | 'organization' | 'public';
  relatedActivities?: string[];
}

export interface ActivityFilter {
  userId?: string;
  entityId?: string;
  entityType?: string;
  type?: ActivityType | ActivityType[];
  startTime?: number;
  endTime?: number;
  visibility?: 'private' | 'team' | 'organization' | 'public';
  limit?: number;
  offset?: number;
}

export interface ActivityFeedOptions {
  userId: string;
  orgId: string;
  maxSize?: number;
  filter?: ActivityFilter;
}

export interface ActivityAggregate {
  hour: number;
  day: string;
  activityCount: number;
  userCount: number;
  topActivity: ActivityType;
  topUsers: Array<{ userId: string; username: string; count: number }>;
}

// ============================================================================
// Activity Stream Manager
// ============================================================================

export class ActivityStreamManager extends EventEmitter {
  private activities: Activity[] = [];
  private activityIndex: Map<string, Activity[]> = new Map(); // by entityId
  private userFeeds: Map<string, Activity[]> = new Map(); // per-user activity feeds
  private subscriptions: Map<string, Set<string>> = new Map(); // entity/user subscriptions
  private maxActivities: number = 10000;

  constructor(maxActivities: number = 10000) {
    super();
    this.maxActivities = maxActivities;
  }

  /**
   * Log activity
   */
  public logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const fullActivity: Activity = {
      ...activity,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    // Add to main stream
    this.activities.push(fullActivity);

    // Index by entityId if applicable
    if (fullActivity.entityId) {
      const entityActivities = this.activityIndex.get(fullActivity.entityId) || [];
      entityActivities.push(fullActivity);
      this.activityIndex.set(fullActivity.entityId, entityActivities);
    }

    // Add to user feed
    const userFeed = this.userFeeds.get(fullActivity.userId) || [];
    userFeed.push(fullActivity);
    this.userFeeds.set(fullActivity.userId, userFeed);

    // Enforce size limits
    this.enforceStorageLimit();

    // Emit event for subscriptions
    this.emit('activity:created', fullActivity);

    // Notify subscribers
    this.notifySubscribers(fullActivity);

    return fullActivity;
  }

  /**
   * Get activities for entity
   */
  public getEntityActivities(entityId: string, limit: number = 50): Activity[] {
    const activities = this.activityIndex.get(entityId) || [];
    return activities.slice(-limit).reverse();
  }

  /**
   * Get user's activity feed
   */
  public getUserActivityFeed(userId: string, limit: number = 50): Activity[] {
    const activities = this.userFeeds.get(userId) || [];
    return activities.slice(-limit).reverse();
  }

  /**
   * Query activities with filters
   */
  public queryActivities(filter: ActivityFilter): Activity[] {
    let results = [...this.activities];

    if (filter.userId) {
      results = results.filter((a) => a.userId === filter.userId);
    }

    if (filter.entityId) {
      results = results.filter((a) => a.entityId === filter.entityId);
    }

    if (filter.entityType) {
      results = results.filter((a) => a.entityType === filter.entityType);
    }

    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type];
      results = results.filter((a) => types.includes(a.type));
    }

    if (filter.startTime) {
      results = results.filter((a) => a.timestamp >= filter.startTime!);
    }

    if (filter.endTime) {
      results = results.filter((a) => a.timestamp <= filter.endTime!);
    }

    if (filter.visibility) {
      results = results.filter((a) => a.visibility === filter.visibility);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = filter.offset || 0;
    const limit = filter.limit || 50;
    return results.slice(offset, offset + limit);
  }

  /**
   * Subscribe to entity activities
   */
  public subscribeToEntity(userId: string, entityId: string): boolean {
    const key = `entity:${entityId}`;
    let subscribers = this.subscriptions.get(key);
    if (!subscribers) {
      subscribers = new Set();
      this.subscriptions.set(key, subscribers);
    }

    subscribers.add(userId);

    this.emit('subscription:created', {
      userId,
      type: 'entity',
      target: entityId,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Unsubscribe from entity activities
   */
  public unsubscribeFromEntity(userId: string, entityId: string): boolean {
    const key = `entity:${entityId}`;
    const subscribers = this.subscriptions.get(key);
    if (!subscribers) return false;

    const removed = subscribers.delete(userId);

    if (subscribers.size === 0) {
      this.subscriptions.delete(key);
    }

    this.emit('subscription:removed', {
      userId,
      type: 'entity',
      target: entityId,
      timestamp: Date.now(),
    });

    return removed;
  }

  /**
   * Subscribe to user activities
   */
  public subscribeToUser(subscriberId: string, userId: string): boolean {
    const key = `user:${userId}`;
    let subscribers = this.subscriptions.get(key);
    if (!subscribers) {
      subscribers = new Set();
      this.subscriptions.set(key, subscribers);
    }

    subscribers.add(subscriberId);

    this.emit('subscription:created', {
      userId: subscriberId,
      type: 'user',
      target: userId,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Notify subscribers about activity
   */
  private notifySubscribers(activity: Activity): void {
    // Notify entity subscribers
    if (activity.entityId) {
      const entityKey = `entity:${activity.entityId}`;
      const entitySubscribers = this.subscriptions.get(entityKey);
      if (entitySubscribers) {
        for (const subscriberId of entitySubscribers) {
          if (subscriberId !== activity.userId) {
            this.emit('notification:send', {
              subscriberId,
              activity,
              notificationType: 'entity_activity',
              timestamp: Date.now(),
            });
          }
        }
      }
    }

    // Notify user activity subscribers
    const userKey = `user:${activity.userId}`;
    const userSubscribers = this.subscriptions.get(userKey);
    if (userSubscribers) {
      for (const subscriberId of userSubscribers) {
        this.emit('notification:send', {
          subscriberId,
          activity,
          notificationType: 'user_activity',
          timestamp: Date.now(),
        });
      }
    }
  }

  /**
   * Get activities with full user details
   */
  public getEnrichedActivities(filter: ActivityFilter, userCache?: Map<string, any>): Array<Activity & { userDetails?: any }> {
    const activities = this.queryActivities(filter);

    return activities.map((activity) => ({
      ...activity,
      userDetails: userCache?.get(activity.userId),
    }));
  }

  /**
   * Get activity aggregates (for analytics)
   */
  public getAggregates(startTime: number, endTime: number): ActivityAggregate[] {
    const activities = this.queryActivities({
      startTime,
      endTime,
    });

    const aggregatesByDay = new Map<string, ActivityAggregate>();

    for (const activity of activities) {
      const date = new Date(activity.timestamp);
      const dayKey = date.toISOString().split('T')[0];
      const hour = date.getHours();

      let aggregate = aggregatesByDay.get(dayKey);
      if (!aggregate) {
        aggregate = {
          hour,
          day: dayKey,
          activityCount: 0,
          userCount: 0,
          topActivity: activity.type,
          topUsers: [],
        };
        aggregatesByDay.set(dayKey, aggregate);
      }

      aggregate.activityCount++;

      if (aggregate.topActivity === activity.type) {
        // Track top activity type
      }
    }

    return Array.from(aggregatesByDay.values());
  }

  /**
   * Export activities for compliance/audit
   */
  public exportActivities(
    filter: ActivityFilter,
    format: 'json' | 'csv' = 'json'
  ): string {
    const activities = this.queryActivities({ ...filter, limit: 100000 });

    if (format === 'json') {
      return JSON.stringify(activities, null, 2);
    } else {
      // CSV format
      const headers = [
        'ID',
        'Type',
        'User',
        'Entity',
        'Timestamp',
        'Description',
      ];
      const rows = activities.map((a) => [
        a.id,
        a.type,
        a.username,
        a.entityId || '',
        new Date(a.timestamp).toISOString(),
        a.description || '',
      ]);

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

      return csv;
    }
  }

  /**
   * Get activity related to an entity change
   */
  public getRelatedActivities(activityId: string): Activity[] {
    const activity = this.activities.find((a) => a.id === activityId);
    if (!activity) return [];

    if (activity.relatedActivities) {
      return activity.relatedActivities
        .map((id) => this.activities.find((a) => a.id === id))
        .filter((a) => a !== undefined) as Activity[];
    }

    return [];
  }

  /**
   * Link related activities
   */
  public linkActivities(activityId1: string, activityId2: string): void {
    const activity1 = this.activities.find((a) => a.id === activityId1);
    const activity2 = this.activities.find((a) => a.id === activityId2);

    if (activity1 && activity2) {
      activity1.relatedActivities = activity1.relatedActivities || [];
      activity2.relatedActivities = activity2.relatedActivities || [];

      if (!activity1.relatedActivities.includes(activityId2)) {
        activity1.relatedActivities.push(activityId2);
      }

      if (!activity2.relatedActivities.includes(activityId1)) {
        activity2.relatedActivities.push(activityId1);
      }
    }
  }

  /**
   * Get activity statistics
   */
  public getStatistics(): {
    totalActivities: number;
    activitiesByType: Record<ActivityType, number>;
    activeUsers: number;
    averageActivitiesPerUser: number;
  } {
    const stats = {
      totalActivities: this.activities.length,
      activitiesByType: {} as Record<ActivityType, number>,
      activeUsers: this.userFeeds.size,
      averageActivitiesPerUser: 0,
    };

    let totalByUser = 0;
    for (const activity of this.activities) {
      stats.activitiesByType[activity.type] =
        (stats.activitiesByType[activity.type] || 0) + 1;
      totalByUser++;
    }

    if (stats.activeUsers > 0) {
      stats.averageActivitiesPerUser = totalByUser / stats.activeUsers;
    }

    return stats;
  }

  /**
   * Enforce storage limit
   */
  private enforceStorageLimit(): void {
    if (this.activities.length > this.maxActivities) {
      const excess = this.activities.length - this.maxActivities;
      const removed = this.activities.splice(0, excess);

      // Clean up indexes
      for (const activity of removed) {
        if (activity.entityId) {
          const entityActivities = this.activityIndex.get(activity.entityId) || [];
          const idx = entityActivities.indexOf(activity);
          if (idx >= 0) {
            entityActivities.splice(idx, 1);
          }
        }
      }
    }
  }

  /**
   * Clear all activities (for testing/reset)
   */
  public clear(): void {
    this.activities = [];
    this.activityIndex.clear();
    this.userFeeds.clear();
    this.subscriptions.clear();
  }

  /**
   * Get raw activities array (careful - for testing only)
   */
  public getActivities(limit?: number): Activity[] {
    if (!limit) {
      return [...this.activities];
    }
    return this.activities.slice(-limit).reverse();
  }
}

export default ActivityStreamManager;
