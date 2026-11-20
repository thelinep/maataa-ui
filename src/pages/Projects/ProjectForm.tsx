/**
 * ProjectForm - Create or edit a project
 *
 * Form for creating/editing projects with Phase 2 validation.
 * Integrates with Phase 5 real-time sync.
 */

import React, { useState } from 'react';
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
const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['planning', 'active', 'paused', 'completed']),
  teamMembers: z.array(z.string()).optional(),
});

export type ProjectFormData = z.infer<typeof ProjectSchema>;

export interface ProjectFormProps {
  projectId?: string;
  /** Values to edit; omit when creating */
  initialValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
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



const STATUS_OPTIONS = [
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

/**
 * ProjectForm Component
 *
 * @example
 * <ProjectForm
 *   projectId="proj-123"
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({
  projectId,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  const { setTyping } = usePresence({ entityId: projectId });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      teamMembers: [],
      ...initialValues,
    },
  });


  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setTyping(true);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      reset(data);

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit form'
      );
    } finally {
      setIsSubmitting(false);
      setTyping(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Container>
        <div role="alert">{submitError && <ErrorMessage>{submitError}</ErrorMessage>}</div>
        <div role="status">{submitSuccess && <SuccessMessage>Project saved.</SuccessMessage>}</div>

        <FormGrid>
          {/* Project Name */}
          <FieldShell
            label="Project Name"
            error={errors.name?.message}
            required
          >
            <Input
              type="text"
              placeholder="Enter project name"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
          </FieldShell>

          {/* Status */}
          <FieldShell
            label="Status"
            error={errors.status?.message}
            required
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={STATUS_OPTIONS}
                  placeholder="Select status"
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
              <Input
                type="text"
                placeholder="Enter project description (optional)"
                {...register('description')}
              />
            </FieldShell>
          </FullWidth>

          {/* Team Members */}
          <FullWidth>
            <FieldShell
              label="Team Members"
              error={errors.teamMembers?.message}
            >
              <Controller
                name="teamMembers"
                control={control}
                render={({ field }) => (
                  <Select
                    multiSelect
                    selectedDisplay="chips"
                    {...field}
                    options={PEOPLE_OPTIONS}
                    placeholder="Select team members"
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
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
        </ButtonGroup>
      </Container>
    </form>
  );
};

ProjectForm.displayName = 'ProjectForm';

export default ProjectForm;
