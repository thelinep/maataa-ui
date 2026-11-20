/**
 * useActivityStream - Hook for Phase 5 activity stream integration
 *
 * Tracks and streams all changes to entities for audit and collaboration.
 */

import { useState, useCallback, useEffect } from 'react';

export interface Activity {
  id: string;
  entityId: string;
  entityType: string;
  userId: string;
  userName: string;
  action: 'created' | 'updated' | 'deleted' | 'commented';
  changes?: Record<string, { old: any; new: any }>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface UseActivityStreamOptions {
  /** Entity ID to track activity for */
  entityId?: string;
  /** Auto-subscribe on mount */
  autoSubscribe?: boolean;
  /** Filter activities by action */
  actions?: Activity['action'][];
  /** Max number of activities to keep */
  maxActivities?: number;
}

export interface UseActivityStreamReturn {
  /** Activity history */
  activities: Activity[];
  /** Loading state */
  loading: boolean;
  /** Subscribe to updates */
  subscribe: (entityId: string) => Promise<void>;
  /** Unsubscribe from updates */
  unsubscribe: () => void;
  /** Fetch activity history */
  fetchHistory: (entityId: string, limit?: number) => Promise<Activity[]>;
  /** Create activity entry */
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<Activity>;
}

/**
 * Hook for tracking and streaming entity activities via Phase 5
 *
 * @example
 * const { activities } = useActivityStream({ entityId: 'proj-123', autoSubscribe: true });
 *
 * @example
 * const { activities, logActivity } = useActivityStream({ entityId });
 * // Show audit trail of all changes to entity
 */
export function useActivityStream(options: UseActivityStreamOptions = {}): UseActivityStreamReturn {
  const { entityId, autoSubscribe = false, actions, maxActivities = 100 } = options;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEntityId, setCurrentEntityId] = useState<string | null>(null);

  /**
   * Fetch activity history
   */
  const fetchHistory = useCallback(
    async (id: string, limit: number = 50): Promise<Activity[]> => {
      setLoading(true);
      try {
        // TODO: Fetch from Phase 5 Activity Stream
        // const history = await phase5.getActivityStream(id, { limit });

        const mockActivities: Activity[] = [
          {
            id: '1',
            entityId: id,
            entityType: 'project',
            userId: 'user-1',
            userName: 'John Doe',
            action: 'created',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            entityId: id,
            entityType: 'project',
            userId: 'user-2',
            userName: 'Jane Smith',
            action: 'updated',
            changes: {
              status: { old: 'draft', new: 'active' },
            },
            timestamp: new Date(Date.now() - 1800000).toISOString(),
          },
        ];

        const filtered = actions
          ? mockActivities.filter((a) => actions.includes(a.action))
          : mockActivities;

        setActivities(filtered.slice(0, limit));
        return filtered;
      } catch (error) {
        console.error('Failed to fetch activity history:', error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [actions]
  );

  /**
   * Subscribe to activity updates
   */
  const subscribe = useCallback(
    async (id: string) => {
      setCurrentEntityId(id);

      // TODO: Subscribe to Phase 5 activity stream
      // const stream = await phase5.subscribeActivityStream(id);
      // stream.on('activity', (activity) => {
      //   setActivities(prev => {
      //     const updated = [activity, ...prev];
      //     return updated.slice(0, maxActivities);
      //   });
      // });

      // Fetch initial history
      await fetchHistory(id);
    },
    [fetchHistory, maxActivities]
  );

  /**
   * Unsubscribe from updates
   */
  const unsubscribe = useCallback(() => {
    // TODO: Unsubscribe from Phase 5
    // phase5.unsubscribeActivityStream(currentEntityId);
    setCurrentEntityId(null);
    setActivities([]);
  }, [currentEntityId]);

  /**
   * Log new activity
   */
  const logActivity = useCallback(
    async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> => {
      try {
        const newActivity: Activity = {
          ...activity,
          id: `activity-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        // TODO: Send to Phase 5 Activity Stream
        // await phase5.logActivity(newActivity);

        setActivities((prev) => [newActivity, ...prev].slice(0, maxActivities));
        return newActivity;
      } catch (error) {
        console.error('Failed to log activity:', error);
        throw error;
      }
    },
    [maxActivities]
  );

  // Auto-subscribe on mount
  useEffect(() => {
    if (autoSubscribe && entityId) {
      subscribe(entityId).catch(console.error);
    }

    return () => {
      if (currentEntityId) {
        unsubscribe();
      }
    };
  }, [autoSubscribe, entityId, subscribe, currentEntityId, unsubscribe]);

  return {
    activities,
    loading,
    subscribe,
    unsubscribe,
    fetchHistory,
    logActivity,
  };
}

export default useActivityStream;
