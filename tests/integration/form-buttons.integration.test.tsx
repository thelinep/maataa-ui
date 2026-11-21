/**
 * Regression: a Cancel button inside a form must not submit the form.
 * The shared Button (@maataa/primitives) defaults to type="button".
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetForm } from '@/pages/Budgets/BudgetForm';

describe('Form buttons', () => {
  it('Cancel calls onCancel without submitting the budget form', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();
    render(<BudgetForm onSubmit={onSubmit} onCancel={onCancel} />);

    const cancel = await screen.findByRole('button', { name: 'Cancel' });
    expect(cancel).toHaveAttribute('type', 'button');
    await userEvent.click(cancel);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    // Submitting would have run validation and rendered error messages.
    // (The form keeps an empty alert region mounted so errors are announced.)
    expect(screen.queryAllByRole('alert').filter((a) => a.textContent?.trim())).toHaveLength(0);
  });

  it('Save is still a submit button', async () => {
    render(<BudgetForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(await screen.findByRole('button', { name: /save budget/i })).toHaveAttribute('type', 'submit');
  });
});
