/**
 * ProjectDetail - View and edit a single project
 *
 * Shows project details with tabs for different sections.
 * Supports real-time collaborative editing via Phase 5.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import {
  Card,
  Tabs,
  Button,
  Modal,
  ActivityFeed,
  PresenceIndicator,
} from '@/components';
import { useEntity, useActivityStream, usePresence } from '@/hooks';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';
import ProjectForm, { ProjectFormData } from './ProjectForm';
import type { Activity } from '@/hooks/useActivityStream';

export interface ProjectDetailProps {
  projectId: string;
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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px ${spacing.sm};
  border-radius: ${borderRadius.md};
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case 'active':
        return colorTokens.interactive.success;
      case 'planning':
        return colorTokens.interactive.info;
      case 'paused':
        return colorTokens.interactive.warning;
      case 'completed':
        return colorTokens.interactive.secondary;
      default:
        return colorTokens.border.primary;
    }
  }};
  color: ${colorTokens.background.primary};
  width: fit-content;
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

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  color: ${colorTokens.text.secondary};
  font-size: ${typography.bodySmall.fontSize};
`;

/**
 * ProjectDetail Component
 *
 * @example
 * <ProjectDetail
 *   projectId="proj-123"
 *   onNavigateBack={() => navigate('/projects')}
 * />
 */
export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  projectId,
  onNavigateBack: propNavigateBack,
}) => {
  const navigate = useNavigate();
  const onNavigateBack = propNavigateBack || (() => navigate('/projects'));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { entity: project, loading: entityLoading, error: entityError } = useEntity({
    entityId: projectId,
    type: 'project',
    autoFetch: true,
  });

  const { activities, loading: activitiesLoading } = useActivityStream({
    entityId: projectId,
    maxActivities: 20,
  });

  const { participants } = usePresence({
    entityId: projectId,
    userId: 'current-user', // TODO: Get from auth context
  });

  const handleEditSubmit = async (data: ProjectFormData) => {
    void data; // TODO: Use this data to update entity via useEntity
    try {
      // TODO: Call useEntity.updateEntity with the form data
      // await updateEntity(projectId, data);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  if (entityLoading) {
    return (
      <Container>
        <LoadingState>Loading project...</LoadingState>
      </Container>
    );
  }

  if (entityError || !project) {
    return (
      <Container>
        <Card>
          <div
            style={{
              padding: spacing.md,
              color: colorTokens.interactive.error,
            }}
          >
            Error loading project: {entityError?.message || 'Project not found'}
          </div>
        </Card>
      </Container>
    );
  }

  const projectData = project.data || {};

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <TitleSection>
          <Title>{projectData.name || 'Untitled Project'}</Title>
          <Subtitle>{projectData.description}</Subtitle>
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
            <MetadataLabel>Status</MetadataLabel>
            <StatusBadge status={projectData.status || 'planning'}>
              {projectData.status || 'planning'}
            </StatusBadge>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Team Size</MetadataLabel>
            <MetadataValue>{projectData.teamSize || 0} members</MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Created</MetadataLabel>
            <MetadataValue>
              {projectData.created_at
                ? new Date(projectData.created_at).toLocaleDateString()
                : 'N/A'}
            </MetadataValue>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Last Updated</MetadataLabel>
            <MetadataValue>
              {projectData.updated_at
                ? new Date(projectData.updated_at).toLocaleDateString()
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
                      {projectData.description || 'No description provided'}
                    </MetadataValue>
                  </MetadataItem>
                  {projectData.teamMembers && projectData.teamMembers.length > 0 && (
                    <MetadataItem>
                      <MetadataLabel>Team Members</MetadataLabel>
                      <MetadataValue>
                        {projectData.teamMembers.join(', ')}
                      </MetadataValue>
                    </MetadataItem>
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
            {
              id: 'team',
              label: 'Team',
              content: (
                <TabContent>
                  <MetadataItem>
                    <MetadataLabel>Assigned Members</MetadataLabel>
                    <MetadataValue>
                      {projectData.teamMembers?.length || 0} members
                    </MetadataValue>
                  </MetadataItem>
                  {participants.length > 0 && (
                    <MetadataItem>
                      <MetadataLabel>Currently Online</MetadataLabel>
                      <div style={{ marginTop: spacing.sm }}>
                        <PresenceIndicator
                          participants={participants}
                        />
                      </div>
                    </MetadataItem>
                  )}
                </TabContent>
              ),
            },
          ]}
          activeTabId={['overview', 'activity', 'team'][activeTabIndex]}
          onSelectTab={(id: string) => {
            const index = ['overview', 'activity', 'team'].indexOf(id);
            setActiveTabIndex(index >= 0 ? index : 0);
          }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <div style={{ padding: spacing.lg }}>
          <ProjectForm
            projectId={projectId}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </div>
      </Modal>
    </Container>
  );
};

ProjectDetail.displayName = 'ProjectDetail';

export default ProjectDetail;
