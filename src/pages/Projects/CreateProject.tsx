/**
 * CreateProject - Modal or page for creating a new project
 *
 * Wraps ProjectForm with submission logic and navigation.
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Card } from '@/components';
import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import { spacing, typography, colorTokens } from '@/utils/tokens';
import ProjectForm, { ProjectFormData } from './ProjectForm';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
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

/**
 * CreateProject Component
 *
 * @example
 * <CreateProject />
 */
export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { create } = useFilmEntities('project');

  // Errors propagate to the form, which shows them in its alert region.
  const handleSubmit = async (data: ProjectFormData) => {
    const created = await create({
      name: data.name,
      description: data.description || undefined,
      status: data.status,
      teamMembers: data.teamMembers ?? [],
    });
    navigate(`/projects/${created.id}`);
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <Container>
      <Card>
        <Header style={{ padding: spacing.lg }}>
          <Title>Create New Project</Title>
          <Subtitle>
            Add a new project to your workspace and start collaborating with your team.
          </Subtitle>
        </Header>
      </Card>

      <Card style={{ padding: spacing.lg }}>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </Container>
  );
};

CreateProject.displayName = 'CreateProject';

export default CreateProject;
