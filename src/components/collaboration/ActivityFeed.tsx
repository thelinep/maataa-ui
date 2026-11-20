/**
 * ActivityFeed - Displays entity activity stream
 *
 * Shows all changes, updates, and interactions with an entity.
 */

import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';
import type { Activity } from '@/hooks/useActivityStream';

export interface ActivityFeedProps {
  /** Activities to display */
  activities: Activity[];
  /** Loading state */
  loading?: boolean;
  /** Max activities to show */
  maxItems?: number;
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  overflow: hidden;
`;

// Header
const Header = styled.div`
  padding: ${spacing.md};
  background-color: ${colorTokens.background.secondary};
  border-bottom: 1px solid ${colorTokens.border.primary};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

// Activity list
const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
`;

// Activity item
const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};
  padding: ${spacing.md};
  border-bottom: 1px solid ${colorTokens.border.secondary};
  transition: background-color ${transitions.fast};

  &:hover {
    background-color: ${colorTokens.background.secondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

// Avatar
const Avatar = styled.div`
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
  flex-shrink: 0;
`;

// Content
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  flex: 1;
  min-width: 0;
`;

// Activity text
const ActivityText = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0;
  word-break: break-word;
`;

// User name
const UserName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

// Action badge
const ActionBadge = styled.span<{ action: Activity['action'] }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${spacing.sm};
  border-radius: ${borderRadius.md};
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.action) {
      case 'created':
        return colorTokens.interactive.success;
      case 'updated':
        return colorTokens.interactive.info;
      case 'deleted':
        return colorTokens.interactive.error;
      case 'commented':
        return colorTokens.interactive.secondary;
      default:
        return colorTokens.border.primary;
    }
  }};
  color: ${colorTokens.background.primary};
  margin: 0 ${spacing.xs};
`;

// Timestamp
const Timestamp = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

// Changes
const Changes = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  margin-top: ${spacing.sm};
  padding: ${spacing.sm};
  background-color: ${colorTokens.background.secondary};
  border-radius: ${borderRadius.sm};
`;

// Change item
const ChangeItem = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

// Empty state
const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  color: ${colorTokens.text.secondary};
  text-align: center;
`;

/**
 * Format relative time
 */
function formatTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

/**
 * ActivityFeed Component
 *
 * Displays a feed of entity activities.
 *
 * @example
 * <ActivityFeed
 *   activities={activities}
 *   loading={loading}
 *   maxItems={10}
 * />
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  maxItems = 10,
}) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Container>
      <Header>Activity</Header>

      <ActivityList>
        {loading && activities.length === 0 ? (
          <EmptyState>Loading activity...</EmptyState>
        ) : displayActivities.length === 0 ? (
          <EmptyState>No activity yet</EmptyState>
        ) : (
          displayActivities.map((activity) => (
            <ActivityItem key={activity.id}>
              <Avatar title={activity.userName}>
                {activity.userName.charAt(0).toUpperCase()}
              </Avatar>

              <Content>
                <ActivityText>
                  <UserName>{activity.userName}</UserName>
                  <ActionBadge action={activity.action}>
                    {activity.action}
                  </ActionBadge>
                  <Timestamp>{formatTime(activity.timestamp)}</Timestamp>
                </ActivityText>

                {activity.changes && Object.keys(activity.changes).length > 0 && (
                  <Changes>
                    {Object.entries(activity.changes).map(([field, change]) => (
                      <ChangeItem key={field}>
                        <strong>{field}:</strong> {String(change.old)} → {String(change.new)}
                      </ChangeItem>
                    ))}
                  </Changes>
                )}
              </Content>
            </ActivityItem>
          ))
        )}
      </ActivityList>
    </Container>
  );
};

ActivityFeed.displayName = 'ActivityFeed';

export default ActivityFeed;
