/**
 * BudgetForm - Create or edit a budget
 *
 * Form for creating/editing budgets with financial fields.
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
const BudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required').max(100),
  description: z.string().max(500).optional(),
  allocated: z.number().min(0, 'Allocated amount must be positive'),
  spent: z.number().min(0, 'Spent amount must be positive'),
  currency: z.string().min(1, 'Currency required'),
  owner: z.string().optional(),
});

export type BudgetFormData = z.infer<typeof BudgetSchema>;

export interface BudgetFormProps {
  budgetId?: string;
  /** Values to edit; omit when creating */
  initialValues?: Partial<BudgetFormData>;
  onSubmit: (data: BudgetFormData) => Promise<void>;
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


const BudgetSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${spacing.md};
  padding: ${spacing.md};
  background-color: ${colorTokens.background.secondary};
  border-radius: ${borderRadius.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const SummaryLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  font-weight: 500;
`;

const SummaryValue = styled.span<{ color?: string }>`
  font-size: ${typography.heading2.fontSize};
  font-weight: 700;
  color: ${(props) => props.color || colorTokens.text.primary};
`;

const CURRENCY_OPTIONS = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'JPY - Japanese Yen', value: 'JPY' },
  { label: 'INR - Indian Rupee', value: 'INR' },
];


/**
 * BudgetForm Component
 *
 * @example
 * <BudgetForm
 *   budgetId="budget-123"
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export const BudgetForm: React.FC<BudgetFormProps> = ({
  budgetId,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const { setTyping } = usePresence({ entityId: budgetId });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      name: '',
      description: '',
      allocated: 0,
      spent: 0,
      currency: 'USD',
      owner: '',
      ...initialValues,
    },
  });

  // Watch for form value changes to update summary
  const allocated = watch('allocated');
  const spent = watch('spent');
  const currency = watch('currency');


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

  const handleFormSubmit = async (data: BudgetFormData) => {
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


  const remaining = allocated - spent;
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Container>
        <div role="alert">{submitError && <ErrorMessage>{submitError}</ErrorMessage>}</div>
        <div role="status">{submitSuccess && <SuccessMessage>Budget saved.</SuccessMessage>}</div>

        {/* Budget Summary */}
        <BudgetSummary>
          <SummaryItem>
            <SummaryLabel>Allocated</SummaryLabel>
            <SummaryValue>
              {currency} {allocated.toLocaleString()}
            </SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Spent</SummaryLabel>
            <SummaryValue
              color={
                percentage > 100
                  ? colorTokens.interactive.error
                  : colorTokens.interactive.success
              }
            >
              {currency} {spent.toLocaleString()}
            </SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Remaining</SummaryLabel>
            <SummaryValue
              color={
                remaining < 0
                  ? colorTokens.interactive.error
                  : colorTokens.interactive.success
              }
            >
              {currency} {remaining.toLocaleString()}
            </SummaryValue>
          </SummaryItem>
        </BudgetSummary>

        <FormGrid>
          {/* Budget Name */}
          <FieldShell
            label="Budget Name"
            error={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter budget name"
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

          {/* Currency */}
          <FieldShell
            label="Currency"
            error={errors.currency?.message}
            required
          >
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={CURRENCY_OPTIONS}
                  placeholder="Select currency"
                  onChange={(value) => {
                    handleFieldChange();
                    field.onChange(value);
                  }}
                />
              )}
            />
          </FieldShell>

          {/* Allocated Amount */}
          <FieldShell
            label="Allocated Amount"
            error={errors.allocated?.message}
            required
          >
            <Controller
              name="allocated"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => {
                    handleFieldChange();
                    field.onChange(parseFloat(e.currentTarget.value) || 0);
                  }}
                  aria-invalid={!!errors.allocated}
                />
              )}
            />
          </FieldShell>

          {/* Spent Amount */}
          <FieldShell
            label="Spent Amount"
            error={errors.spent?.message}
            required
          >
            <Controller
              name="spent"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => {
                    handleFieldChange();
                    field.onChange(parseFloat(e.currentTarget.value) || 0);
                  }}
                  aria-invalid={!!errors.spent}
                />
              )}
            />
          </FieldShell>

          {/* Budget Owner */}
          <FieldShell
            label="Budget Owner"
            error={errors.owner?.message}
          >
            <Controller
              name="owner"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={PEOPLE_OPTIONS}
                  placeholder="Select owner"
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
                    placeholder="Enter budget description (optional)"
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
            {isSubmitting ? 'Saving...' : 'Save Budget'}
          </Button>
        </ButtonGroup>
      </Container>
    </form>
  );
};

BudgetForm.displayName = 'BudgetForm';

export default BudgetForm;
