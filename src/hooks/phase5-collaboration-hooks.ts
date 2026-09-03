/**
 * Phase 5: React Hooks for Collaboration Features
 * Integration layer for using Phase 5 features in React components
 *
 * Provides: useCollaboration, usePresence, useActivity, usePermission, useWorkflow
 */

import { useState, useEffect, useCallback, useRef, useContext, createContext } from 'react';
import { WebSocketMessage } from './phase5-websocket-server';
import { PresenceIndicator } from './phase5-presence';
import { Activity } from './phase5-activity-stream';
import { PermissionCheck, Permission } from './phase5-rbac';


// ============================================================================
// Context Setup
// ============================================================================

interface CollaborationContextType {
  clientId: string;
  userId: string;
  orgId: string;
  connected: boolean;
}

export const CollaborationContext = createContext<CollaborationContextType | null>(null);

// ============================================================================
// Hooks
// ============================================================================

/**
 * Main collaboration hook - initialize connection and get methods
 */
export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }

  const [connected, setConnected] = useState(context.connected);
  const messageHandlers = useRef<Map<string, (msg: WebSocketMessage) => void>>(new Map());

  useEffect(() => {
    const handleConnectionChange = (newConnected: boolean) => {
      setConnected(newConnected);
    };

    // Subscribe to connection changes
    window.addEventListener('collaboration:connected', () => handleConnectionChange(true));
    window.addEventListener('collaboration:disconnected', () => handleConnectionChange(false));

    return () => {
      window.removeEventListener('collaboration:connected', () => handleConnectionChange(true));
      window.removeEventListener('collaboration:disconnected', () => handleConnectionChange(false));
    };
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    window.postMessage({ type: 'collaboration:message', message }, '*');
  }, []);

  const onMessage = useCallback((type: string, handler: (msg: WebSocketMessage) => void) => {
    messageHandlers.current.set(type, handler);

    const listener = (event: MessageEvent) => {
      if (event.data?.type === 'collaboration:message' && event.data?.message?.type === type) {
        handler(event.data.message);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return {
    clientId: context.clientId,
    userId: context.userId,
    orgId: context.orgId,
    connected,
    sendMessage,
    onMessage,
  };
}

/**
 * Hook for real-time presence indicators
 */
export function usePresence(entityId: string) {
  const { sendMessage, onMessage } = useCollaboration();
  const [participants, setParticipants] = useState<PresenceIndicator[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Join entity presence channel
  useEffect(() => {
    sendMessage({
      id: `presence-join-${Date.now()}`,
      type: 'presence:join',
      clientId: '',
      userId: '',
      entityId,
      timestamp: Date.now(),
      payload: { entityId },
    });

    return () => {
      sendMessage({
        id: `presence-leave-${Date.now()}`,
        type: 'presence:leave',
        clientId: '',
        userId: '',
        entityId,
        timestamp: Date.now(),
        payload: { entityId },
      });
    };
  }, [entityId, sendMessage]);

  // Listen for presence updates
  useEffect(() => {
    const unsubscribe = onMessage('presence:update', (msg) => {
      if (msg.entityId === entityId) {
        setParticipants((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((p) => p.userId === msg.payload.userId);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], ...msg.payload };
          } else {
            updated.push(msg.payload);
          }
          return updated;
        });
      }
    });

    return unsubscribe;
  }, [entityId, onMessage]);

  // Set typing status
  const setTyping = useCallback(
    (typing: boolean) => {
      setIsTyping(typing);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      sendMessage({
        id: `typing-${Date.now()}`,
        type: 'presence:typing',
        clientId: '',
        userId: '',
        entityId,
        timestamp: Date.now(),
        payload: { typing },
      });

      // Auto-expire typing after 5 seconds
      if (typing) {
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
        }, 5000);
      }
    },
    [sendMessage, entityId]
  );

  // Update cursor position
  const updateCursor = useCallback(
    (line: number, column: number) => {
      sendMessage({
        id: `cursor-${Date.now()}`,
        type: 'presence:cursor',
        clientId: '',
        userId: '',
        entityId,
        timestamp: Date.now(),
        payload: { line, column },
      });
    },
    [sendMessage, entityId]
  );

  return {
    participants,
    isTyping,
    setTyping,
    updateCursor,
    participantCount: participants.length,
  };
}

/**
 * Hook for activity stream
 */
export function useActivityFeed(options: { userId?: string; entityId?: string; limit?: number }) {
  const { onMessage } = useCollaboration();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial activities
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/activities', {
          method: 'POST',
          body: JSON.stringify(options),
        });
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [options.userId, options.entityId]);

  // Listen for new activities
  useEffect(() => {
    const unsubscribe = onMessage('activity:new', (msg) => {
      const newActivity: Activity = msg.payload;
      setActivities((prev) => [newActivity, ...prev].slice(0, options.limit || 50));
    });

    return unsubscribe;
  }, [onMessage, options.limit]);

  return {
    activities,
    loading,
  };
}

/**
 * Hook for permissions
 */
export function usePermission() {
  const { userId } = useCollaboration();
  const [permissions, setPermissions] = useState<Map<string, boolean>>(new Map());
  const cacheRef = useRef<Map<string, PermissionCheck>>(new Map());

  const checkPermission = useCallback(
    async (permission: Permission, resourceId?: string): Promise<boolean> => {
      const cacheKey = `${permission}:${resourceId || 'global'}`;

      if (cacheRef.current.has(cacheKey)) {
        return cacheRef.current.get(cacheKey)!.allowed;
      }

      try {
        const response = await fetch('/api/permissions/check', {
          method: 'POST',
          body: JSON.stringify({
            userId,
            permission,
            resourceId,
          }),
        });
        const check: PermissionCheck = await response.json();
        cacheRef.current.set(cacheKey, check);
        return check.allowed;
      } catch (error) {
        console.error('Failed to check permission:', error);
        return false;
      }
    },
    [userId]
  );

  const checkAllPermissions = useCallback(
    async (perms: Permission[], resourceId?: string): Promise<boolean> => {
      const results = await Promise.all(
        perms.map((p) => checkPermission(p, resourceId))
      );
      return results.every((r) => r);
    },
    [checkPermission]
  );

  const invalidateCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    checkPermission,
    checkAllPermissions,
    invalidateCache,
  };
}

/**
 * Hook for real-time entity editing with OT
 */
export function useEntityEdit(entityId: string) {
  const { sendMessage, onMessage } = useCollaboration();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(0);
  const pendingOperationsRef = useRef<any[]>([]);

  useEffect(() => {
    // Subscribe to entity updates
    const unsubscribe = onMessage('entity:update', (msg) => {
      if (msg.entityId === entityId) {
        setContent(msg.payload.content);
        setVersion(msg.version || 0);
      }
    });

    return unsubscribe;
  }, [entityId, onMessage]);

  const updateContent = useCallback(
    async (newContent: string, path: string = 'content') => {
      const change = {
        type: 'update',
        path,
        value: newContent,
        oldValue: content,
      };

      pendingOperationsRef.current.push(change);

      setSaving(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Debounce

        sendMessage({
          id: `update-${Date.now()}`,
          type: 'entity:update',
          clientId: '',
          userId: '',
          entityId,
          timestamp: Date.now(),
          payload: { changes: pendingOperationsRef.current, version },
          version: version + 1,
        });

        setContent(newContent);
        pendingOperationsRef.current = [];
      } finally {
        setSaving(false);
      }
    },
    [content, entityId, version, sendMessage]
  );

  return {
    content,
    setContent: updateContent,
    saving,
    version,
  };
}

/**
 * Hook for workflow automation
 */
export function useWorkflow(workflowId: string) {
  const { sendMessage, onMessage } = useCollaboration();
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const execute = useCallback(
    async (input?: any) => {
      setStatus('running');
      try {
        sendMessage({
          id: `workflow-${Date.now()}`,
          type: 'workflow:execute',
          clientId: '',
          userId: '',
          timestamp: Date.now(),
          payload: { workflowId, input },
        });
      } catch (error) {
        setStatus('error');
        console.error('Workflow execution failed:', error);
      }
    },
    [workflowId, sendMessage]
  );

  useEffect(() => {
    const unsubscribe = onMessage('workflow:result', (msg) => {
      if (msg.payload.workflowId === workflowId) {
        setResult(msg.payload.result);
        setStatus(msg.payload.success ? 'completed' : 'error');
      }
    });

    return unsubscribe;
  }, [workflowId, onMessage]);

  return {
    status,
    result,
    execute,
  };
}

/**
 * Hook for collaboration session management
 */
export function useCollaborationSession(entityId: string, onConflict?: (conflicts: any[]) => void) {
  const { sendMessage, onMessage } = useCollaboration();
  const [sessionInfo, setSessionInfo] = useState({
    participants: 0,
    lastSync: 0,
    syncStatus: 'synced' as 'syncing' | 'synced' | 'error',
  });

  useEffect(() => {
    const unsubscribe = onMessage('session:sync', (msg) => {
      if (msg.entityId === entityId) {
        setSessionInfo({
          participants: msg.payload.participantCount,
          lastSync: Date.now(),
          syncStatus: msg.payload.conflicts ? 'error' : 'synced',
        });

        if (msg.payload.conflicts && onConflict) {
          onConflict(msg.payload.conflicts);
        }
      }
    });

    return unsubscribe;
  }, [entityId, onMessage, onConflict]);

  const sync = useCallback(() => {
    setSessionInfo((prev) => ({ ...prev, syncStatus: 'syncing' }));
    sendMessage({
      id: `sync-${Date.now()}`,
      type: 'session:sync',
      clientId: '',
      userId: '',
      entityId,
      timestamp: Date.now(),
      payload: { entityId },
    });
  }, [entityId, sendMessage]);

  return {
    sessionInfo,
    sync,
  };
}

export default {};
