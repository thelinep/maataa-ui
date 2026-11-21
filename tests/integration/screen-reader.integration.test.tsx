/**
 * Screen-reader walkthrough findings S1–S6 (21 Nov 2026).
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService } from '@/core/film';
import { App } from '@/app/App';
import { appRoutes } from '@/app/routes';
import { LoadingState } from '@/pages/shared/AsyncState';

vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ videos: [] }) })));

function renderApp(path: string) {
  const service = new FilmEntityService();
  service.seed();
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<App service={service} router={router} currentUser="Tester" />);
  return { router, service };
}

describe('S1: an empty form explains what is missing', () => {
  it.each([
    ['/projects/new', 'Project Name', /Save Project/],
    ['/teams/new', 'Team Name', /Save Team/],
    ['/budgets/new', 'Budget Name', /Save Budget/],
  ])('%s: Save is reachable, and submitting empty shows and announces the error', async (path, field, save) => {
    const user = userEvent.setup();
    const { router } = renderApp(path);
    const button = await screen.findByRole('button', { name: save });
    expect(button).toBeEnabled();

    await user.click(button);
    const input = screen.getByRole('textbox', { name: new RegExp(field) });
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(input).toHaveAccessibleDescription(/.+/);
    expect(input).toHaveFocus();
    expect(router.state.location.pathname).toBe(path);
  });
});

describe('S2: cards are named by their title, details read as description', () => {
  it.each([
    ['/scripts', 'The Lost Highway - Revised', /Format/],
    ['/storyboards', 'The Lost Highway - Full', /Scenes/],
    ['/screenings', 'Film Festival Premiere', /Type/],
  ])('%s', async (path, title, details) => {
    renderApp(path);
    const card = await screen.findByRole('button', { name: title });
    expect(card).toHaveAccessibleDescription(details);
  });

  it('opens a card with Space as well as Enter', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/screenings');
    const card = await screen.findByRole('button', { name: 'Film Festival Premiere' });
    card.focus();
    await user.keyboard(' ');
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/screenings\/screening-/));
  });
});

describe('S3: table rows are named', () => {
  it.each([
    ['/projects', 'The Lost Highway'],
    ['/teams', 'Camera Department'],
    ['/budgets', 'Principal Photography'],
  ])('%s', async (path, name) => {
    renderApp(path);
    expect(await screen.findByRole('row', { name })).toHaveAttribute('tabindex', '0');
  });
});

describe('S4: heading emoji are not read out', () => {
  it('names the page heading without its emoji, which stays visible', async () => {
    renderApp('/screenings');
    const h1 = await screen.findByRole('heading', { level: 1, name: 'Screenings' });
    expect(h1.textContent).toContain('🎬');
  });
});

describe('S5: loading is announced once', () => {
  it('the route fallback is shown but not a live region', () => {
    const { container } = render(<LoadingState announce={false} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(within(container).queryByRole('status')).toBeNull();
  });
});
