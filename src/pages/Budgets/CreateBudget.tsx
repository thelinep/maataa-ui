/**
 * CreateBudget - Page for creating a new budget
 *
 * Wraps BudgetForm with submission logic and navigation.
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Card } from '@/components';
import { useEntity } from '@/hooks';
import { spacing, typography, colorTokens } from '@/utils/tokens';
import BudgetForm, { BudgetFormData } from './BudgetForm';

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
 * CreateBudget Component
 *
 * @example
 * <CreateBudget />
 */
export const CreateBudget: React.FC = () => {
  const navigate = useNavigate();
  const { createEntity } = useEntity({ type: 'budget' });

  const handleSubmit = async (data: BudgetFormData) => {
    void data; // TODO: Use this data to create entity via useEntity
    try {
      // TODO: Call useEntity.createEntity with form data
      // const newBudget = await createEntity(data);
      // navigate(`/budgets/${newBudget.id}`);

      // For now, just navigate back to list
      navigate('/budgets');
    } catch (error) {
      console.error('Failed to create budget:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/budgets');
  };

  void createEntity; // Placeholder for future use

  return (
    <Container>
      <Card>
        <Header style={{ padding: spacing.lg }}>
          <Title>Create New Budget</Title>
          <Subtitle>
            Set up a new budget to track spending and allocations for your projects or departments.
          </Subtitle>
        </Header>
      </Card>

      <Card style={{ padding: spacing.lg }}>
        <BudgetForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </Container>
  );
};

CreateBudget.displayName = 'CreateBudget';

export default CreateBudget;
