/**
 * App shell: routing, sidebar navigation and route wiring for the 8 workflows.
 */

import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService } from '@/core/film';
import { MemoryStorage } from '@/core/phase2-storage';
import { App } from '../App';
import { appRoutes } from '../routes';
import { NAV_SECTIONS } from '../navigation';
import { bootstrapFilmServices } from '../bootstrap';

function renderApp(path: string, service = (() => { const s = new FilmEntityService(); s.seed(); return s; })()) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<App service={service} router={router} currentUser="Tester" />);
  return { router, service };
}

describe('App routing', () => {
  it('redirects / to Concepts', async () => {
    const { router } = renderApp('/');
    expect(await screen.findByText('The Lost Highway')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/concepts');
  });

  it('shows all 8 workflows in the sidebar, grouped by phase', async () => {
    renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    const nav = screen.getByRole('navigation', { name: 'Film production workflows' });
    const labels = within(nav).getAllByRole('link').map((l) => l.textContent?.replace(/^\W+/u, ''));
    expect(labels).toEqual(NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.label)));
    expect(labels).toHaveLength(8);
    expect(within(nav).getByText('Post-production')).toBeInTheDocument();
  });

  it('marks the active workflow and navigates from the sidebar', async () => {
    const { router } = renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    const nav = screen.getByRole('navigation', { name: 'Film production workflows' });

    expect(within(nav).getByRole('link', { name: /Concepts/ })).toHaveClass('active');
    fireEvent.click(within(nav).getByRole('link', { name: /Sound/ }));

    expect(await screen.findByLabelText('Dialogue level')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/sound');
    expect(within(nav).getByRole('link', { name: /Sound/ })).toHaveClass('active');
  });

  it.each([
    ['/concepts', 'Neon Dreams'],
    ['/scripts', 'Street Voices - Final Draft'],
    ['/storyboards', 'Street Voices - Rough Pass'],
    ['/filming', 'Highway overpass - Mile 23'],
    ['/filming/dailies', 'S2 Sh3 T2'],
    ['/screenings', 'Film Festival Premiere'],
    ['/editing', 'Video 1'],
    ['/editing/log', 'Final color pass & sound mix'],
    ['/color', 'Cinematic Warm'],
    ['/sound', 'Foley'],
  ])('renders %s', async (path, text) => {
    renderApp(path);
    expect(await screen.findByText(text)).toBeInTheDocument();
  });

  it('shows a not-found page for unknown paths', async () => {
    renderApp('/nowhere');
    expect(await screen.findByText('Page not found.')).toBeInTheDocument();
  });
});

describe('Concept flow', () => {
  it('list → detail → edit → saved', async () => {
    const { router, service } = renderApp('/concepts');

    fireEvent.click(await screen.findByText('Street Voices'));
    expect(await screen.findByRole('heading', { name: 'Street Voices' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/concepts/concept-2');

    fireEvent.click(screen.getByRole('button', { name: 'Edit Concept' }));
    const title = await screen.findByLabelText('Concept Title');
    expect(title).toHaveValue('Street Voices');

    fireEvent.change(title, { target: { name: 'title', value: 'Street Voices (Director’s Cut)' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Concept' }));

    expect(await screen.findByRole('heading', { name: 'Street Voices (Director’s Cut)' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/concepts/concept-2');
    expect((await service.getEntity('concept', 'concept-2'))?.title).toBe('Street Voices (Director’s Cut)');
  });

  it('new concept → detail page', async () => {
    const { router } = renderApp('/concepts');
    fireEvent.click(await screen.findByRole('button', { name: /new concept/i }));

    fireEvent.change(await screen.findByLabelText('Concept Title'), { target: { name: 'title', value: 'Monsoon Letters' } });
    fireEvent.change(screen.getByLabelText('Vision & Concept'), { target: { name: 'vision', value: 'Pen pals' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Concept' }));

    expect(await screen.findByRole('heading', { name: 'Monsoon Letters' })).toBeInTheDocument();
    expect(router.state.location.pathname).toMatch(/^\/concepts\/[0-9a-f-]{36}$/);
  });

  it('cancel on the edit form returns to the detail page', async () => {
    const { router } = renderApp('/concepts/concept-1/edit');
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/concepts/concept-1'));
  });

  it('edit route handles an unknown concept', async () => {
    renderApp('/concepts/missing/edit');
    expect(await screen.findByText('Concept not found.')).toBeInTheDocument();
  });
});

describe('Script flow', () => {
  it('list → detail → editor', async () => {
    const { router } = renderApp('/scripts');
    fireEvent.click(await screen.findByText('Neon Dreams - WIP'));
    fireEvent.click(await screen.findByRole('button', { name: 'Open Editor' }));

    expect(await screen.findByLabelText('Script content')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/scripts/script-3/edit');
  });

  it('new script opens the editor and records the current user', async () => {
    const { router, service } = renderApp('/scripts');
    fireEvent.click(await screen.findByRole('button', { name: /new script/i }));

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/scripts\/.+\/edit$/));
    const id = router.state.location.pathname.split('/')[2];
    expect((await service.getEntity('script', id))?.createdBy).toBe('Tester');
  });
});

describe('Other workflow routes', () => {
  it('opens a storyboard and creates new ones', async () => {
    const { router, service } = renderApp('/storyboards');
    fireEvent.click(await screen.findByText('The Lost Highway - Full'));
    expect(await screen.findByText('Driver POV through windshield')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /All storyboards/ }));
    fireEvent.click(await screen.findByRole('button', { name: /new storyboard/i }));
    await waitFor(() => expect(router.state.location.pathname).not.toBe('/storyboards'));
    expect(await service.getEntities('storyboard')).toHaveLength(3);
    expect(await screen.findByText(/Storyboard: Untitled Storyboard/)).toBeInTheDocument();
  });

  it('switches filming and editing sub-views via tabs', async () => {
    renderApp('/filming');
    await screen.findByText('Highway overpass - Mile 23');
    fireEvent.click(screen.getByRole('link', { name: 'Dailies' }));
    expect(await screen.findByText(/Dailies Review/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dailies' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Filming Log' })).not.toHaveClass('active');
  });

  it('opens screening feedback and schedules new screenings', async () => {
    const { service } = renderApp('/screenings');
    fireEvent.click(await screen.findByRole('button', { name: /schedule screening/i }));
    expect(await screen.findByText('New Screening')).toBeInTheDocument();
    expect(await service.getEntities('screening')).toHaveLength(4);

    fireEvent.click(screen.getByText('Internal Team Screening'));
    expect(await screen.findByText('4.2/5 ⭐')).toBeInTheDocument();
  });
});

describe('bootstrapFilmServices', () => {
  it('restores persisted edits across app restarts', async () => {
    const storage = new MemoryStorage();
    const first = await bootstrapFilmServices({ currentUser: 'Tester', storage, transport: null });
    expect(first.persistence.source).toBe('seed');
    expect(first.disconnectSync).toBeNull();
    await first.service.updateEntity('concept', 'concept-1', { title: 'Persisted Title' });
    await first.persistence.flush();

    const second = await bootstrapFilmServices({ currentUser: 'Tester', storage, transport: null });
    expect(second.persistence.source).toBe('storage');
    expect((await second.service.getEntity('concept', 'concept-1'))?.title).toBe('Persisted Title');
  });

  it('connects cross-tab sync by default', async () => {
    const services = await bootstrapFilmServices({ currentUser: 'Tester', storage: new MemoryStorage() });
    expect(services.disconnectSync).toEqual(expect.any(Function));
    services.disconnectSync?.();
  });
});
