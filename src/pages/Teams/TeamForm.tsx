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
import { Button } from '@/components';
import { Input } from '@maataa/primitives';
import { FieldShell, Select } from '@maataa/ui/forms';
import { usePresence } from '@/hooks';
import { PEOPLE_OPTIONS } from '../shared/people';
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
  /** Values to edit; omit when creating */
  initialValues?: Partial<TeamFormData>;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


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
      ...initialValues,
    },
  });


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
      reset(data);

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


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Container>
        <div role="alert">{submitError && <ErrorMessage>{submitError}</ErrorMessage>}</div>
        <div role="status">{submitSuccess && <SuccessMessage>Team saved.</SuccessMessage>}</div>

        <FormGrid>
          {/* Team Name */}
          <FieldShell
            label="Team Name"
            error={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter team name"
                  {...field}
                  onChange={(value) => {
                    handleFieldChange();
                    field.onChange(value);
                  }}
                  aria-invalid={!!errors.name}
                />
              )}
            />
          </FieldShell>

          {/* Team Lead */}
          <FieldShell
            label="Team Lead"
            error={errors.lead?.message}
          >
            <Controller
              name="lead"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={PEOPLE_OPTIONS}
                  placeholder="Select team lead"
                  onChange={(value) => {
                    handleFieldChange();
                    field.onChange(value);
                  }}
                />
              )}
            />
          </FieldShell>

          {/* Description */}
          <FullWidth>
            <FieldShell
              label="Description"
              error={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter team description (optional)"
                    {...field}
                    onChange={(value) => {
                      handleFieldChange();
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </FieldShell>
          </FullWidth>

          {/* Team Members */}
          <FullWidth>
            <FieldShell
              label="Team Members"
              error={errors.members?.message}
            >
              <Controller
                name="members"
                control={control}
                render={({ field }) => (
                  <Select
                    multiSelect
                    selectedDisplay="chips"
                    {...field}
                    options={PEOPLE_OPTIONS}
                    placeholder="Select team members"
                    onChange={(value) => {
                      handleFieldChange();
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </FieldShell>
          </FullWidth>
        </FormGrid>

        {/* Action Buttons */}
        <ButtonGroup>
          <Button
            variant="tertiary"
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
