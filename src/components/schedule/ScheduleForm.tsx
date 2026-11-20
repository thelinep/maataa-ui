/**
 * ScheduleForm - Create and edit scheduled events
 *
 * Form for scheduling new events with attendee management
 * Integrates with Phase 1 design tokens and Phase 5 collaboration
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, MultiSelect, Button, TypingIndicator } from '@/components';
import { Input } from '@maataa/primitives';
import { FieldShell } from '@maataa/ui/forms';
import { usePresence } from '@/hooks';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

// Zod schema for validation
const ScheduleSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(200),
  description: z.string().max(500).optional(),
  eventType: z.enum(['meeting', 'deadline', 'milestone', 'review', 'other']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().max(200).optional(),
  attendees: z.array(z.string()).min(1, 'At least one attendee is required'),
  resourcesRequired: z.array(z.string()).optional(),
});

export type ScheduleFormData = z.infer<typeof ScheduleSchema>;

export interface ScheduleFormProps {
  eventId?: string;
  initialData?: Partial<ScheduleFormData>;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  onCancel?: () => void;
  availableAttendees?: Array<{ label: string; value: string }>;
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
  background: ${colorTokens.interactive.error}20;
  border: 1px solid ${colorTokens.interactive.error};
  border-radius: ${borderRadius.md};
  color: ${colorTokens.interactive.error};
  font-size: ${typography.bodySmall.fontSize};
`;

const SuccessMessage = styled.div`
  padding: ${spacing.md};
  background: ${colorTokens.interactive.success}20;
  border: 1px solid ${colorTokens.interactive.success};
  border-radius: ${borderRadius.md};
  color: ${colorTokens.interactive.success};
  font-size: ${typography.bodySmall.fontSize};
`;

const TimeInputWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${spacing.md};
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DurationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm};
  background: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

// Mock attendees
const ATTENDEES = [
  { label: 'Alice Johnson', value: 'user-001' },
  { label: 'Bob Smith', value: 'user-002' },
  { label: 'Carol Williams', value: 'user-003' },
  { label: 'David Brown', value: 'user-004' },
  { label: 'Eve Davis', value: 'user-005' },
];

const EVENT_TYPES = [
  { label: 'Meeting', value: 'meeting' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Milestone', value: 'milestone' },
  { label: 'Review', value: 'review' },
  { label: 'Other', value: 'other' },
];

/**
 * Calculate duration between times
 */
function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';
  try {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? `${hours.toFixed(1)} hours` : 'Invalid duration';
  } catch {
    return '';
  }
}

/**
 * ScheduleForm Component
 *
 * @example
 * <ScheduleForm
 *   eventId="event-123"
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  eventId,
  initialData,
  onSubmit,
  onCancel,
  availableAttendees = ATTENDEES,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Focused field, reserved for field-level presence (who is editing what)
  const [, setCurrentField] = useState<string | null>(null);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { setTyping, participants } = usePresence({ entityId: eventId || 'new-event' });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      title: '',
      description: '',
      eventType: 'meeting',
      startTime: '',
      endTime: '',
      location: '',
      attendees: [],
      resourcesRequired: [],
      ...initialData,
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const duration = calculateDuration(startTime, endTime);

  // Handle field changes with debounced typing indicator
  const handleFieldChange = () => {
    setTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleFormSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setTyping(true);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
      setTyping(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Container>
        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
        {submitSuccess && <SuccessMessage>Event scheduled successfully!</SuccessMessage>}

        <FormGrid>
          {/* Title */}
          <FullWidth>
            <FieldShell
              label="Event Title"
              error={errors.title?.message}
              required
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter event title"
                    {...field}
                    onFocus={() => setCurrentField('title')}
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                    aria-invalid={!!errors.title}
                  />
                )}
              />
            </FieldShell>
          </FullWidth>

          {/* Event Type */}
          <FieldShell label="Event Type" error={errors.eventType?.message} required>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={EVENT_TYPES}
                  placeholder="Select type"
                  onChange={(e) => {
                    handleFieldChange();
                    field.onChange(e);
                  }}
                />
              )}
            />
          </FieldShell>

          {/* Location */}
          <FieldShell label="Location" error={errors.location?.message}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter location"
                  {...field}
                  onFocus={() => setCurrentField('location')}
                  onChange={(e) => {
                    handleFieldChange();
                    field.onChange(e);
                  }}
                />
              )}
            />
          </FieldShell>

          {/* Time Inputs */}
          <TimeInputWrapper>
            <FieldShell
              label="Start Time"
              error={errors.startTime?.message}
              required
            >
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="datetime-local"
                    {...field}
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                    aria-invalid={!!errors.startTime}
                  />
                )}
              />
            </FieldShell>

            <FieldShell
              label="End Time"
              error={errors.endTime?.message}
              required
            >
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="datetime-local"
                    {...field}
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                    aria-invalid={!!errors.endTime}
                  />
                )}
              />
            </FieldShell>
          </TimeInputWrapper>

          {/* Duration Display */}
          {duration && (
            <DurationInfo style={{ gridColumn: '1 / -1' }}>
              ⏱️ Duration: {duration}
            </DurationInfo>
          )}

          {/* Description */}
          <FullWidth>
            <FieldShell label="Description" error={errors.description?.message}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Event description (optional)"
                    {...field}
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </FieldShell>
          </FullWidth>

          {/* Attendees */}
          <FullWidth>
            <FieldShell
              label="Attendees"
              error={errors.attendees?.message}
              required
            >
              <Controller
                name="attendees"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={availableAttendees}
                    placeholder="Select attendees"
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </FieldShell>
          </FullWidth>

          {/* Resources */}
          <FullWidth>
            <FieldShell label="Resources Required" error={errors.resourcesRequired?.message}>
              <Controller
                name="resourcesRequired"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={[
                      { label: 'Conference Room', value: 'room-1' },
                      { label: 'Projector', value: 'projector' },
                      { label: 'Whiteboard', value: 'whiteboard' },
                      { label: 'Video Equipment', value: 'video' },
                    ]}
                    placeholder="Select resources"
                    onChange={(e) => {
                      handleFieldChange();
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </FieldShell>
          </FullWidth>

          {/* Typing Indicator */}
          <FullWidth>
            {participants.length > 0 && (
              <TypingIndicator
                typists={participants
                  .filter((p) => p.isTyping)
                  .map((p) => p.userName)}
                variant="compact"
              />
            )}
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
            {isSubmitting ? 'Scheduling...' : eventId ? 'Update Event' : 'Schedule Event'}
          </Button>
        </ButtonGroup>
      </Container>
    </form>
  );
};

export default ScheduleForm;
