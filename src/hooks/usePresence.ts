/**
 * usePresence - Hook for Phase 5 real-time presence tracking
 *
 * Tracks who's currently viewing/editing an entity and their status.
 */

import { useState, useCallback, useEffect } from 'react';

export interface Presence {
  userId: string;
  userName: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
  currentPage?: string;
  isTyping?: boolean;
  cursorPosition?: { line: number; column: number };
}

export interface UsePresenceOptions {
  /** Entity ID to track presence for */
  entityId?: string;
  /** Current user ID */
  userId?: string;
  /** Auto-connect on mount */
  autoConnect?: boolean;
}

export interface UsePresenceReturn {
  /** Current user's presence */
  myPresence: Presence | null;
  /** Other participants' presence */
  participants: Presence[];
  /** Connected state */
  connected: boolean;
  /** Set typing indicator */
  setTyping: (isTyping: boolean) => void;
  /** Update cursor position */
  setCursorPosition: (position: { line: number; column: number }) => void;
  /** Update status */
  setStatus: (status: 'online' | 'away' | 'offline') => void;
  /** Broadcast presence to others */
  broadcastPresence: () => Promise<void>;
}

/**
 * Hook for tracking real-time presence via Phase 5
 *
 * @example
 * const { participants, setTyping } = usePresence({ entityId: 'proj-123', autoConnect: true });
 *
 * @example
 * const { myPresence, participants } = usePresence({ entityId, userId });
 * // Show who's editing, who's online, etc.
 */
export function usePresence(options: UsePresenceOptions = {}): UsePresenceReturn {
  const { entityId, userId } = options;
  // Note: autoConnect is reserved for future use with auto-subscription

  const [myPresence, setMyPresence] = useState<Presence | null>(null);
  const [participants, setParticipants] = useState<Presence[]>([]);
  const [connected, setConnected] = useState(false);

  // Placeholder to satisfy linter - setParticipants will be used by Phase 5 WebSocket
  void setParticipants;

  /**
   * Initialize presence for current user
   */
  useEffect(() => {
    if (!userId || !entityId) return;

    // TODO: Connect to Phase 5 WebSocket
    // const ws = await phase5.connectPresence(entityId);

    const initialPresence: Presence = {
      userId,
      userName: userId, // In production, get from auth
      status: 'online',
      lastSeen: new Date().toISOString(),
      currentPage: entityId,
    };

    setMyPresence(initialPresence);
    setConnected(true);

    // TODO: Set up listeners for other participants
    // ws.on('presence-update', (presence) => {
    //   setParticipants(prev => {
    //     const updated = prev.filter(p => p.userId !== presence.userId);
    //     return [...updated, presence];
    //   });
    // });
    // For now, setParticipants is reserved for Phase 5 WebSocket updates

    return () => {
      // TODO: Cleanup WebSocket connection
      // ws.disconnect();
      setConnected(false);
    };
  }, [userId, entityId]);

  /**
   * Set typing indicator
   */
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!myPresence) return;

      const updated: Presence = {
        ...myPresence,
        isTyping,
        lastSeen: new Date().toISOString(),
      };

      setMyPresence(updated);

      // TODO: Broadcast to Phase 5
      // phase5.updatePresence(updated);
    },
    [myPresence]
  );

  /**
   * Update cursor position
   */
  const setCursorPosition = useCallback(
    (position: { line: number; column: number }) => {
      if (!myPresence) return;

      const updated: Presence = {
        ...myPresence,
        cursorPosition: position,
        lastSeen: new Date().toISOString(),
      };

      setMyPresence(updated);

      // TODO: Broadcast to Phase 5
      // phase5.updatePresence(updated);
    },
    [myPresence]
  );

  /**
   * Update user status
   */
  const setStatus = useCallback(
    (status: 'online' | 'away' | 'offline') => {
      if (!myPresence) return;

      const updated: Presence = {
        ...myPresence,
        status,
        lastSeen: new Date().toISOString(),
      };

      setMyPresence(updated);

      // TODO: Broadcast to Phase 5
      // phase5.updatePresence(updated);
    },
    [myPresence]
  );

  /**
   * Broadcast presence to all participants
   */
  const broadcastPresence = useCallback(async () => {
    if (!myPresence) return;

    try {
      // TODO: Send to Phase 5
      // await phase5.broadcastPresence(myPresence);
    } catch (error) {
      console.error('Failed to broadcast presence:', error);
    }
  }, [myPresence]);

  return {
    myPresence,
    participants,
    connected,
    setTyping,
    setCursorPosition,
    setStatus,
    broadcastPresence,
  };
}

export default usePresence;
