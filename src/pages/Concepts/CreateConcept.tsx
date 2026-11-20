import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';
import ConceptForm, { type ConceptFormData } from './ConceptForm';
import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import type { ConceptRecord } from '@/core/film/types';
import { ErrorState } from '../shared/AsyncState';

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

export interface CreateConceptProps {
  /** Called with the persisted concept, e.g. to navigate to its detail view */
  onCreated?: (concept: ConceptRecord) => void;
  onCancel?: () => void;
}

const CreateConcept: React.FC<CreateConceptProps> = ({ onCreated, onCancel }) => {
  const { create, error } = useFilmEntities('concept');

  const handleSubmit = async (data: ConceptFormData) => {
    const concept = await create({ ...data, status: 'ideation', attachments: [] });
    onCreated?.(concept);
  };

  return (
    <CreateContainer>
      <ContextHeader>
        <ContextTitle>Create New Concept</ContextTitle>
        <ContextDescription>
          Start your creative journey by defining your film concept. What story do you want to tell?
        </ContextDescription>
      </ContextHeader>
      {error && <ErrorState error={error} />}
      <ConceptForm onSubmit={handleSubmit} onCancel={onCancel} />
    </CreateContainer>
  );
};

export default CreateConcept;
