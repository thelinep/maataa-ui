/**
 * TeamDetail - View and edit a single team
 *
 * Shows team details with tabs for different sections.
 * Supports real-time collaborative editing via Phase 5.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Button,
  Modal,
  ActivityFeed,
  PresenceIndicator,
  TypingIndicator,
} from '@/components';
import { useEntity, useActivityStream, usePresence } from '@/hooks';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';
import TeamForm, { TeamFormData } from './TeamForm';
import type { Activity } from '@/hooks/useActivityStream';

export interface TeamDetailProps {
  teamId: string;
  onNavigateBack?: () => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Title = styled.h1`
  font-size: ${typography.heading2.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};
  padding: ${spacing.md};
  background-color: ${colorTokens.background.secondary};
  border-radius: ${borderRadius.md};
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const MetadataLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  font-weight: 500;
`;

const MetadataValue = styled.span`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  font-weight: 600;
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
`;

const PresenceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colorTokens.background.secondary};
  border-radius: ${borderRadius.md};
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const MemberName = styled.span`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
`;

const MemberRole = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  color: ${colorTokens.text.secondary};
  font-size: ${typography.bodySmall.fontSize};
`;

/**
 * TeamDetail Component
 *
 * @example
 * <TeamDetail
 *   teamId="team-123"
 *   onNavigateBack={() => navigate('/teams')}
 * />
 */
export const TeamDetail: React.FC<TeamDetailProps> = ({
  teamId,
  onNavigateBack: propNavigateBack,
}) => {
  const navigate = useNavigate();
  const onNavigateBack = propNavigateBack || (() => navigate('/teams'));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { entity: team, loading: entityLoading, error: entityError } = useEntity({
    entityId: teamId,
    type: 'team',
    autoFetch: true,
  });

  const { activities, loading: activitiesLoading } = useActivityStream({
    entityId: teamId,
    maxActivities: 20,
  });

  const { participants, setStatus, setTyping } = usePresence({
    entityId: teamId,
    userId: 'current-user', // TODO: Get from auth context
  });

  const { subscribe: subscribeActivity, unsubscribe: unsubscribeActivity } = useActivityStream({
    entityId: teamId,
    maxActivities: 20,
  });

  // Get list of typing participants for the modal
  const typingParticipants = participants
    .filter((p) => p.isTyping)
    .map((p) => p.userName);

  // Subscribe to real-time updates when component mounts
  useEffect(() => {
    if (!teamId) return;

    // Subscribe to activity stream for this team
    subscribeActivity(teamId).catch(console.error);

    // Set user to online
    setStatus('online');

    // Cleanup on unmount
    return () => {
      unsubscribeActivity();
      setStatus('offline');
    };
  }, [teamId, subscribeActivity, unsubscribeActivity, setStatus]);

  const handleEditSubmit = async (data: TeamFormData) => {
    void data; // TODO: Use this data to update entity via useEntity
    try {
      // Track typing status during edit
      setTyping(true);

      // TODO: Call useEntity.updateEntity with the form data
      // const updated = await updateEntity(teamId, data);
      // Phase 5 will broadcast the change automatically

      setTyping(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update team:', error);
      setTyping(false);
      throw error;
    }
  };

  if (entityLoading) {
    return (
      <Container>
        <LoadingState>Loading team...</LoadingState>
      </Container>
    );
  }

  if (entityError || !team) {
    return (
      <Container>
        <Card>
          <div
            style={{
              padding: spacing.md,
              color: colorTokens.interactive.error,
            }}
          >
            Error loading team: {entityError?.message || 'Team not found'}
          </div>
        </Card>
      </Container>
    );
  }

  const teamData = team.data || {};
  const memberCount = teamData.members?.length || 0;

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <TitleSection>
          <Title>{teamData.name || 'Untitled Team'}</Title>
          <Subtitle>{teamData.description}</Subtitle>
        </TitleSection>
        <Actions>
          {participants.length > 0 && (
            <PresenceContainer>
              <PresenceIndicator
                participants={participants}
              />
            </PresenceContainer>
          )}
          <Button onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
          {onNavigateBack && (
            <Button variant="outline" onClick={onNavigateBack}>
              Back
            </Button>
          )}
        </Actions>
      </Header>

      {/* Metadata */}
      <Card>
        <MetadataGrid>
          <MetadataItem>
            <MetadataLabel>Team Size</MetadataLabel>
            <MetadataValue>{memberCount} members</MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Team Lead</MetadataLabel>
            <MetadataValue>{teamData.lead || 'Unassigned'}</MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Created</MetadataLabel>
            <MetadataValue>
              {teamData.created_at
                ? new Date(teamData.created_at).toLocaleDateString()
                : 'N/A'}
            </MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Last Updated</MetadataLabel>
            <MetadataValue>
              {teamData.updated_at
                ? new Date(teamData.updated_at).toLocaleDateString()
                : 'N/A'}
            </MetadataValue>
          </MetadataItem>
        </MetadataGrid>
      </Card>

      {/* Content Tabs */}
      <Card>
        <Tabs
          items={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <TabContent>
                  <MetadataItem>
                    <MetadataLabel>Description</MetadataLabel>
                    <MetadataValue>
                      {teamData.description || 'No description provided'}
                    </MetadataValue>
                  </MetadataItem>
                </TabContent>
              ),
            },
            {
              id: 'members',
              label: 'Members',
              content: (
                <TabContent>
                  <MetadataItem>
                    <MetadataLabel>Team Members ({memberCount})</MetadataLabel>
                  </MetadataItem>
                  {teamData.members && teamData.members.length > 0 ? (
                    <MemberList>
                      {teamData.members.map((member: string, idx: number) => (
                        <MemberItem key={idx}>
                          <div>
                            <MemberName>{member}</MemberName>
                            {teamData.lead === member && (
                              <MemberRole>Team Lead</MemberRole>
                            )}
                          </div>
                        </MemberItem>
                      ))}
                    </MemberList>
                  ) : (
                    <MetadataValue>No members assigned yet</MetadataValue>
                  )}
                </TabContent>
              ),
            },
            {
              id: 'activity',
              label: 'Activity',
              content: (
                <TabContent>
                  {activitiesLoading ? (
                    <LoadingState>Loading activity...</LoadingState>
                  ) : (
                    <ActivityFeed
                      activities={activities as Activity[]}
                      maxItems={15}
                    />
                  )}
                </TabContent>
              ),
            },
          ]}
          activeTabId={['overview', 'members', 'activity'][activeTabIndex]}
          onSelectTab={(id: string) => {
            const index = ['overview', 'members', 'activity'].indexOf(id);
            setActiveTabIndex(index >= 0 ? index : 0);
          }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team"
      >
        <div style={{ padding: spacing.lg }}>
          {typingParticipants.length > 0 && (
            <div style={{ marginBottom: spacing.md }}>
              <TypingIndicator
                typists={typingParticipants}
                variant="compact"
              />
            </div>
          )}
          <TeamForm
            teamId={teamId}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </div>
      </Modal>
    </Container>
  );
};

TeamDetail.displayName = 'TeamDetail';

export default TeamDetail;
