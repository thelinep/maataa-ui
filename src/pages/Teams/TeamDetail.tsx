/**
 * TeamDetail - View and edit a single team
 *
 * Shows team details with tabs for different sections.
 * Supports real-time collaborative editing via Phase 5.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import {
  Card,
  Button,
  ActivityFeed,
  PresenceIndicator,
  TypingIndicator,
} from '@/components';
import { Modal } from '@maataa/ui/surfaces';
import { Tabs } from '@maataa/ui/navigation';
import { useActivityStream, usePresence } from '@/hooks';
import { useFilmEntity } from '@/hooks/data/useFilmEntities';
import { personName } from '../shared/people';
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

  const { item: team, loading: entityLoading, error: entityError, update } = useFilmEntity('team', teamId);
  const [savedMessage, setSavedMessage] = useState('');

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

  // Errors propagate to the form, which shows them in its alert region.
  const handleEditSubmit = async (data: TeamFormData) => {
    setTyping(true);
    try {
      await update({
        name: data.name,
        description: data.description || undefined,
        lead: data.lead || undefined,
        members: data.members ?? [],
      });
    } finally {
      setTyping(false);
    }
    setSavedMessage('Team saved.');
    setIsEditModalOpen(false);
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

  const teamData = team;
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
            <Button variant="tertiary" onClick={onNavigateBack}>
              Back
            </Button>
          )}
        </Actions>
      </Header>

      {/* Announced after saving an edit; visible so sighted users see it too */}
      <div role="status" style={{ minHeight: '1.2em', color: colorTokens.text.primary }}>
        {savedMessage}
      </div>

      {/* Metadata */}
      <Card>
        <MetadataGrid>
          <MetadataItem>
            <MetadataLabel>Team Size</MetadataLabel>
            <MetadataValue>{memberCount} members</MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Team Lead</MetadataLabel>
            <MetadataValue>{personName(teamData.lead) || 'Unassigned'}</MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Created</MetadataLabel>
            <MetadataValue>
              {teamData.createdAt
                ? new Date(teamData.createdAt).toLocaleDateString()
                : 'N/A'}
            </MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Last Updated</MetadataLabel>
            <MetadataValue>
              {teamData.updatedAt
                ? new Date(teamData.updatedAt).toLocaleDateString()
                : 'N/A'}
            </MetadataValue>
          </MetadataItem>
        </MetadataGrid>
      </Card>

      {/* Content Tabs */}
      <Card>
        <Tabs
          tabs={[
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
                            <MemberName>{personName(member)}</MemberName>
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
          activeTab={['overview', 'members', 'activity'][activeTabIndex]}
          onChange={(id) => {
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
            initialValues={{
              name: team.name,
              description: team.description ?? '',
              lead: team.lead ?? '',
              members: team.members,
            }}
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
