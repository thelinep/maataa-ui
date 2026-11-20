/**
 * Form fields on @maataa/primitives Input + @maataa/ui FieldShell:
 * labels name their controls, required is announced, and validation errors
 * from react-hook-form + zod are linked to the field they belong to.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetForm } from '@/pages/Budgets/BudgetForm';
import { ProjectForm } from '@/pages/Projects/ProjectForm';

describe('Form fields', () => {
  it('names every budget field by its visible label', async () => {
    render(<BudgetForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(await screen.findByRole('textbox', { name: /Budget Name/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Currency/ })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Allocated Amount/ })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Spent Amount/ })).toBeInTheDocument();
  });

  it('announces required fields without native browser validation', async () => {
    render(<BudgetForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const name = await screen.findByRole('textbox', { name: /Budget Name/ });
    expect(name).toHaveAttribute('aria-required', 'true');
    expect(name).not.toHaveAttribute('required');
    expect(screen.getByRole('combobox', { name: /Currency/ })).toHaveAttribute('aria-required', 'true');
  });

  it('shows the zod message and links it to the invalid field', async () => {
    const onSubmit = vi.fn();
    render(<BudgetForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    // Make the form dirty without filling the required name.
    await userEvent.type(await screen.findByRole('textbox', { name: /Description/ }), 'x');
    await userEvent.click(screen.getByRole('button', { name: /save budget/i }));

    const name = screen.getByRole('textbox', { name: /Budget Name/ });
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'));
    expect(name).toHaveAccessibleDescription('Budget name is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('names the custom multi-select trigger from the field label', async () => {
    render(<ProjectForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(await screen.findByRole('button', { name: /Team Members/ })).toHaveAttribute('aria-haspopup', 'listbox');
  });
});
