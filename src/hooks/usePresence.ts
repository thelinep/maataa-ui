/**
 * Lightweight presence hook for components that may render outside a
 * collaboration session.
 *
 * Inside a Phase 5 CollaborationContext it reports typing state on the same
 * channel as `usePresence` in ./phase5-collaboration-hooks; without one it is
 * a no-op, so components stay usable standalone (tests, Storybook, offline).
 */

import { useCallback, useContext } from 'react';
import { CollaborationContext } from './phase5-collaboration-hooks';

export interface UsePresenceOptions {
  entityId: string;
}

export function usePresence({ entityId }: UsePresenceOptions) {
  const session = useContext(CollaborationContext);

  const setTyping = useCallback(
    (typing: boolean) => {
      if (!session) return;
      window.postMessage(
        {
          type: 'collaboration:message',
          message: {
            id: `typing-${Date.now()}`,
            type: 'presence:typing',
            clientId: session.clientId,
            userId: session.userId,
            entityId,
            timestamp: Date.now(),
            payload: { typing },
          },
        },
        '*'
      );
    },
    [session, entityId]
  );

  return { setTyping, connected: !!session?.connected };
}

export default usePresence;
