/**
 * CreateProject - Modal or page for creating a new project
 *
 * Wraps ProjectForm with submission logic and navigation.
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components';
import { useEntity } from '@/hooks';
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
  const { createEntity } = useEntity({ type: 'project' });

  const handleSubmit = async (data: ProjectFormData) => {
    void data; // TODO: Use this data to create entity via useEntity
    try {
      // TODO: Call useEntity.createEntity with form data
      // const newProject = await createEntity(data);
      // navigate(`/projects/${newProject.id}`);

      // For now, just navigate back to list
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  void createEntity; // Placeholder for future use

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
