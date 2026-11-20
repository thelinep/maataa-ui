/**
 * CreateTeam - Page for creating a new team
 *
 * Wraps TeamForm with submission logic and navigation.
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Card } from '@/components';
import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import { spacing, typography, colorTokens } from '@/utils/tokens';
import TeamForm, { TeamFormData } from './TeamForm';

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
 * CreateTeam Component
 *
 * @example
 * <CreateTeam />
 */
export const CreateTeam: React.FC = () => {
  const navigate = useNavigate();
  const { create } = useFilmEntities('team');

  // Errors propagate to the form, which shows them in its alert region.
  const handleSubmit = async (data: TeamFormData) => {
    const created = await create({
      name: data.name,
      description: data.description || undefined,
      lead: data.lead || undefined,
      members: data.members ?? [],
    });
    navigate(`/teams/${created.id}`);
  };

  const handleCancel = () => {
    navigate('/teams');
  };

  return (
    <Container>
      <Card>
        <Header style={{ padding: spacing.lg }}>
          <Title>Create New Team</Title>
          <Subtitle>
            Add a new team to your workspace and start collaborating with team members.
          </Subtitle>
        </Header>
      </Card>

      <Card style={{ padding: spacing.lg }}>
        <TeamForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </Container>
  );
};

CreateTeam.displayName = 'CreateTeam';

export default CreateTeam;
