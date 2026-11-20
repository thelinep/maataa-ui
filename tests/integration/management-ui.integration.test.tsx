/**
 * Management pages on the fused design system (@maataa/ui): list rows are
 * keyboard-operable, the edit dialog is a real modal, tabs are controlled.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService } from '@/core/film';
import { App } from '@/app/App';
import { appRoutes } from '@/app/routes';

function renderApp(path: string) {
  const service = new FilmEntityService();
  service.seed();
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<App service={service} router={router} currentUser="Tester" />);
  return router;
}

async function openFirstProject() {
  const router = renderApp('/projects');
  const table = await screen.findByRole('table');
  const firstRow = within(table).getAllByRole('row')[1];
  firstRow.focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/projects\/[^/]+$/));
  return router;
}

describe('Management pages on @maataa/ui', () => {
  it('opens a project from the list with the keyboard', async () => {
    await openFirstProject();
    expect(await screen.findByRole('tab', { name: 'Overview' })).toBeInTheDocument();
  });

  it('switches detail tabs with arrow keys', async () => {
    await openFirstProject();
    const overview = await screen.findByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    overview.focus();
    await userEvent.keyboard('{ArrowRight}');
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveAttribute('aria-selected', 'true');
    expect(activity).toHaveFocus();
  });

  it('edit dialog is modal, closes on Escape and returns focus to Edit', async () => {
    await openFirstProject();
    const edit = await screen.findByRole('button', { name: 'Edit' });
    await userEvent.click(edit);
    const dialog = await screen.findByRole('dialog', { name: 'Edit Project' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(edit).toHaveFocus();
  });

  it('has a named search box that filters the list', async () => {
    renderApp('/projects');
    const search = await screen.findByRole('searchbox', { name: 'Search projects' });
    const table = await screen.findByRole('table');
    const before = within(table).getAllByRole('row').length;
    await userEvent.type(search, 'zzzz-no-match');
    await waitFor(() => expect(screen.queryByRole('table')?.querySelectorAll('tbody tr').length ?? 0).toBeLessThan(before - 1));
  });
});
