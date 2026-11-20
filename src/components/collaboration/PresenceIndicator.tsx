/**
 * PresenceIndicator - Shows active users and their status
 *
 * Visual indicator of who's currently viewing/editing an entity.
 */

import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';
import type { Presence } from '@/hooks/usePresence';

export interface PresenceIndicatorProps {
  /** Current participants */
  participants: Presence[];
  /** Max avatars to show before +N indicator */
  maxAvatars?: number;
}

// Container
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

// Avatar list
const AvatarList = styled.div`
  display: flex;
  align-items: center;
  margin-left: -8px;
`;

// Avatar
const Avatar = styled.div<{ status?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${colorTokens.interactive.primary};
  color: ${colorTokens.background.primary};
  font-weight: 600;
  font-size: 12px;
  margin-left: -8px;
  border: 2px solid ${colorTokens.background.primary};
  position: relative;
  transition: all ${transitions.fast};

  &:hover {
    margin-left: 0;
    z-index: 10;
  }

  /* Status indicator dot */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid ${colorTokens.background.primary};
    background-color: ${(props) => {
      switch (props.status) {
        case 'online':
          return colorTokens.interactive.success;
        case 'away':
          return colorTokens.interactive.warning;
        case 'offline':
          return colorTokens.border.secondary;
        default:
          return colorTokens.interactive.success;
      }
    }};
  }
`;

// More indicator
const MoreIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${colorTokens.background.tertiary};
  color: ${colorTokens.text.secondary};
  font-weight: 600;
  font-size: 12px;
  margin-left: -8px;
  border: 2px solid ${colorTokens.background.primary};
`;

// Tooltip
const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${colorTokens.background.inverse};
  color: ${colorTokens.text.inverse};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${typography.bodySmall.fontSize};
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${transitions.fast};

  ${Avatar}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${colorTokens.background.inverse};
  }
`;

/**
 * PresenceIndicator Component
 *
 * Shows active participants with their status.
 *
 * @example
 * <PresenceIndicator
 *   participants={[
 *     { userId: 'user-1', userName: 'Alice', status: 'online' },
 *     { userId: 'user-2', userName: 'Bob', status: 'away' },
 *   ]}
 *   maxAvatars={3}
 * />
 */
export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  participants,
  maxAvatars = 3,
}) => {
  if (participants.length === 0) {
    return null;
  }

  const displayParticipants = participants.slice(0, maxAvatars);
  const remaining = participants.length - maxAvatars;

  return (
    <Container>
      <AvatarList>
        {displayParticipants.map((participant) => (
          <Avatar key={participant.userId} status={participant.status} title={participant.userName}>
            <Tooltip>{participant.userName}</Tooltip>
            {participant.userName.charAt(0).toUpperCase()}
          </Avatar>
        ))}

        {remaining > 0 && (
          <MoreIndicator title={`+${remaining} more`}>
            +{remaining}
          </MoreIndicator>
        )}
      </AvatarList>
    </Container>
  );
};

PresenceIndicator.displayName = 'PresenceIndicator';

export default PresenceIndicator;
