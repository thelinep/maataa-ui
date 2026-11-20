import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';
import ConceptForm from './ConceptForm';

const CreateContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const ContextHeader = styled.div`
  margin-bottom: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border-left: 4px solid ${colorTokens.primary.main};
  border-radius: 8px;
`;

const ContextTitle = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: 1.5rem;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const ContextDescription = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const CreateConcept: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Creating concept:', data);
    // TODO: Call Phase 2 EntityManager to create entity
    // Then navigate back to ConceptList
    alert('Concept created! (Navigation would happen here)');
  };

  return (
    <CreateContainer>
      <ContextHeader>
        <ContextTitle>Create New Concept</ContextTitle>
        <ContextDescription>
          Start your creative journey by defining your film concept. What story do you want to tell?
        </ContextDescription>
      </ContextHeader>
      <ConceptForm onSubmit={handleSubmit} />
    </CreateContainer>
  );
};

export default CreateConcept;
