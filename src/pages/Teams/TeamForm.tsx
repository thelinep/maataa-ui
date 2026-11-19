/**
 * TeamForm - Create or edit a team
 *
 * Form for creating/editing teams with Phase 2 validation.
 * Integrates with Phase 5 real-time sync.
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormInput,
  FormFieldWrapper,
  Select,
  MultiSelect,
  Button,
} from '@/components';
import { useEntity, usePresence } from '@/hooks';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

// Zod schema for validation
const TeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  description: z.string().max(500).optional(),
  lead: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export type TeamFormData = z.infer<typeof TeamSchema>;

export interface TeamFormProps {
  teamId?: string;
  onSubmit: (data: TeamFormData) => Promise<void>;
  onCancel?: () => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: flex-end;
  margin-top: ${spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const ErrorMessage = styled.div`
  padding: ${spacing.md};
  background-color: ${colorTokens.interactive.error}20;
  border: 1px solid ${colorTokens.interactive.error};
  border-radius: ${borderRadius.md};
  color: ${colorTokens.interactive.error};
  font-size: ${typography.bodySmall.fontSize};
`;

const SuccessMessage = styled.div`
  padding: ${spacing.md};
  background-color: ${colorTokens.interactive.success}20;
  border: 1px solid ${colorTokens.interactive.success};
  border-radius: ${borderRadius.md};
  color: ${colorTokens.interactive.success};
  font-size: ${typography.bodySmall.fontSize};
`;

const LoadingText = styled.span`
  opacity: 0.6;
  font-size: ${typography.bodySmall.fontSize};
`;

// Mock team members - TODO: Replace with Phase 2 EntityManager.getEntitiesByType('person')
const TEAM_MEMBERS = [
  { label: 'Alice Johnson', value: 'user-001' },
  { label: 'Bob Smith', value: 'user-002' },
  { label: 'Carol Williams', value: 'user-003' },
  { label: 'David Brown', value: 'user-004' },
  { label: 'Eve Davis', value: 'user-005' },
];

/**
 * TeamForm Component
 *
 * @example
 * <TeamForm
 *   teamId="team-123"
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export const TeamForm: React.FC<TeamFormProps> = ({
  teamId,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { entity: team, loading: entityLoading } = useEntity({
    entityId: teamId,
    type: 'team',
    autoFetch: !!teamId,
  });

  const { setTyping } = usePresence({ entityId: teamId });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      name: '',
      description: '',
      lead: '',
      members: [],
    },
  });

  // Load existing team data
  useEffect(() => {
    if (team?.data) {
      reset({
        name: team.data.name || '',
        description: team.data.description || '',
        lead: team.data.lead || '',
        members: team.data.members || [],
      });
    }
  }, [team, reset]);

  // Handle field changes with debounced typing indicator
  const handleFieldChange = () => {
    setTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to clear typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleFormSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      setTyping(false);
      reset();

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit form'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (entityLoading) {
    return (
      <Container>
        <LoadingText>Loading team...</LoadingText>
      </Container>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Container>
        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
        {submitSuccess && <SuccessMessage>Team saved successfully!</SuccessMessage>}

        <FormGrid>
          {/* Team Name */}
          <FormFieldWrapper
            label="Team Name"
            error={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="text"
                  placeholder="Enter team name"
                  {...field}
                  onChange={(e) => {
                    handleFieldChange();
                    field.onChange(e);
                  }}
                  aria-invalid={!!errors.name}
                />
              )}
            />
          </FormFieldWrapper>

          {/* Team Lead */}
          <FormFieldWrapper
            label="Team Lead"
            error={errors.lead?.message}
          >
            <Controller
              name="lead"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={TEAM_MEMBERS}
                  placeholder="Select team lead"
                  onChange={(e) => {
                    handleFieldChange();
                    field.onChange(e);
                  }}
                />
              )}
            />
          </FormFieldWrapper>

          {/* Description */}
          <FullWidth>
            <FormFieldWrapper
              label="Description"
              error={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <FormInput
                    type="text"
                    placeholder="Enter team description (optional)"
                    {...field}
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </FormFieldWrapper>
          </FullWidth>

          {/* Team Members */}
          <FullWidth>
            <FormFieldWrapper
              label="Team Members"
              error={errors.members?.message}
            >
              <Controller
                name="members"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={TEAM_MEMBERS}
                    placeholder="Select team members"
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </FormFieldWrapper>
          </FullWidth>
        </FormGrid>

        {/* Action Buttons */}
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? 'Saving...' : 'Save Team'}
          </Button>
        </ButtonGroup>
      </Container>
    </form>
  );
};

TeamForm.displayName = 'TeamForm';

export default TeamForm;
