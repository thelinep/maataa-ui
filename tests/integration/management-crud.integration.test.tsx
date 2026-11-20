/**
 * F4: Projects, Teams and Budgets are saved in the film store. Creating one
 * keeps what was typed and opens it; editing saves; the lists show the store;
 * snapshots saved before these workflows existed get sample data.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService, attachFilmPersistence, FILM_STORAGE_KEY } from '@/core/film';
import { encodeFilmData } from '@/core/film/codec';
import { createFilmSeed } from '@/core/film/seed';
import { MemoryStorage } from '@/core/phase2-storage';
import { App } from '@/app/App';
import { appRoutes } from '@/app/routes';

vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ videos: [] }) })));

function renderApp(path: string) {
  const service = new FilmEntityService();
  service.seed();
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<App service={service} router={router} currentUser="Tester" />);
  return { router, service };
}

async function choose(user: ReturnType<typeof userEvent.setup>, name: RegExp, option: string) {
  await user.click(screen.getByRole('combobox', { name }));
  await user.click(await screen.findByRole('option', { name: new RegExp(option) }));
}

describe('Projects', () => {
  it('lists projects from the store', async () => {
    renderApp('/projects');
    expect(await screen.findByText('Festival Trailer')).toBeInTheDocument();
    expect(screen.getByText('The Lost Highway')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(1 + 4);
  });

  it('creates a project with everything typed and opens it', async () => {
    const user = userEvent.setup();
    const { router, service } = renderApp('/projects/new');
    await user.type(await screen.findByRole('textbox', { name: /Project Name/ }), 'Monsoon Letters');
    await user.type(screen.getByRole('textbox', { name: /Description/ }), 'Short film, Hindi');
    await choose(user, /Status/, 'Active');
    await choose(user, /Team Members/, 'Bob Smith');
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: /Save Project/ }));

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/projects\/(?!new)/));
    const id = router.state.location.pathname.split('/').pop()!;
    expect(await service.getEntity('project', id)).toMatchObject({
      name: 'Monsoon Letters',
      description: 'Short film, Hindi',
      status: 'active',
      teamMembers: ['user-002'],
    });
    expect(await screen.findByRole('heading', { level: 1, name: 'Monsoon Letters' })).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('keeps the form and reports the problem when saving fails', async () => {
    const user = userEvent.setup();
    const { router, service } = renderApp('/projects/new');
    vi.spyOn(service, 'createEntity').mockRejectedValueOnce(new Error('Storage is full'));
    const name = await screen.findByRole('textbox', { name: /Project Name/ });
    await user.type(name, 'Kept');
    await user.click(screen.getByRole('button', { name: /Save Project/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Storage is full');
    expect(router.state.location.pathname).toBe('/projects/new');
    expect(name).toHaveValue('Kept');
  });

  it('edits and saves a project, and announces it', async () => {
    const user = userEvent.setup();
    const { service } = renderApp('/projects/project-2');
    await screen.findByRole('heading', { level: 1, name: 'Festival Trailer' });
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const dialog = await screen.findByRole('dialog');
    const name = within(dialog).getByRole('textbox', { name: /Project Name/ });
    expect(name).toHaveValue('Festival Trailer');
    await user.clear(name);
    await user.type(name, 'Festival Trailer v2');
    await user.click(within(dialog).getByRole('button', { name: /Save Project/ }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { level: 1, name: 'Festival Trailer v2' })).toBeInTheDocument();
    expect(screen.getAllByRole('status').some((s) => s.textContent === 'Project saved.')).toBe(true);
    expect(await service.getEntity('project', 'project-2')).toMatchObject({ name: 'Festival Trailer v2', status: 'planning' });
  });
});

describe('Teams', () => {
  it('creates a team with a lead and members', async () => {
    const user = userEvent.setup();
    const { router, service } = renderApp('/teams/new');
    await user.type(await screen.findByRole('textbox', { name: /Team Name/ }), 'Sound Department');
    await choose(user, /Team Lead/, 'Carol Williams');
    await choose(user, /Team Members/, 'Carol Williams');
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: /Save Team/ }));

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/teams\/(?!new)/));
    const id = router.state.location.pathname.split('/').pop()!;
    expect(await service.getEntity('team', id)).toMatchObject({ name: 'Sound Department', lead: 'user-003', members: ['user-003'] });
    expect(await screen.findByRole('heading', { level: 1, name: 'Sound Department' })).toBeInTheDocument();
  });

  it('shows lead names in the list', async () => {
    renderApp('/teams');
    const row = (await screen.findByText('Camera Department')).closest('tr') as HTMLElement;
    expect(within(row).getByText('Alice Johnson')).toBeInTheDocument();
  });
});

describe('Budgets', () => {
  it('creates a budget with amounts and opens it', async () => {
    const user = userEvent.setup();
    const { router, service } = renderApp('/budgets/new');
    await user.type(await screen.findByRole('textbox', { name: /Budget Name/ }), 'Dubbing');
    await choose(user, /Currency/, 'INR');
    const allocated = screen.getByRole('spinbutton', { name: /Allocated Amount/ });
    await user.clear(allocated);
    await user.type(allocated, '250000');
    const spent = screen.getByRole('spinbutton', { name: /Spent Amount/ });
    await user.clear(spent);
    await user.type(spent, '1000');
    await user.click(screen.getByRole('button', { name: /Save Budget/ }));

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/budgets\/(?!new)/));
    const id = router.state.location.pathname.split('/').pop()!;
    expect(await service.getEntity('budget', id)).toMatchObject({ name: 'Dubbing', currency: 'INR', allocated: 250000, spent: 1000 });
  });
});

describe('older saved data', () => {
  it('gives workflows missing from an old snapshot sample data, and keeps emptied ones empty', async () => {
    const storage = new MemoryStorage();
    const old = createFilmSeed() as Partial<ReturnType<typeof createFilmSeed>>;
    delete old.project;
    delete old.team;
    old.budget = [];
    await storage.save(FILM_STORAGE_KEY, { version: 1, savedAt: new Date().toISOString(), data: encodeFilmData(old) });

    const service = new FilmEntityService();
    const handle = await attachFilmPersistence(service, { storage, debounceMs: 0 });
    expect(handle.source).toBe('storage');
    expect((await service.getEntities('project')).length).toBe(4);
    expect((await service.getEntities('team')).length).toBe(3);
    expect(await service.getEntities('budget')).toEqual([]);
  });
});
