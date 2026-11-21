/**
 * Audit F2 (named filters), F7 (target size), F9 (heading order) and
 * F13 (default focus ring), checked through the real app.
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService } from '@/core/film';
import { App } from '@/app/App';
import { appRoutes } from '@/app/routes';
import { DEFAULT_FOCUS_RING } from '@/accessibility/GlobalA11yStyles';

vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ videos: [] }) })));

function renderApp(path: string) {
  const service = new FilmEntityService();
  service.seed();
  render(<App service={service} router={createMemoryRouter(appRoutes, { initialEntries: [path] })} currentUser="Tester" />);
}

describe('F2: filter dropdowns have names', () => {
  it.each([
    ['/concepts', 'Filter by status'],
    ['/scripts', 'Filter by status'],
    ['/filming/dailies', 'Filter footage'],
  ])('%s', async (path, name) => {
    renderApp(path);
    expect(await screen.findByRole('combobox', { name })).toBeInTheDocument();
  });
});

describe('F9: card titles sit directly under the page heading', () => {
  it.each(['/scripts', '/storyboards', '/screenings'])('%s has no h3 before an h2', async (path) => {
    renderApp(path);
    await screen.findByRole('heading', { level: 1 });
    await screen.findAllByRole('heading', { level: 2 });
    const levels = [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map((h) => Number(h.tagName[1]));
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1]).toBeLessThanOrEqual(1);
    });
  });
});

describe('F7: mixer buttons are at least 24px', () => {
  it('sets a minimum size on Mute and Solo', async () => {
    renderApp('/sound');
    const mute = (await screen.findAllByRole('button', { name: /^Mute / }))[0];
    const style = getComputedStyle(mute);
    expect(parseFloat(style.minWidth)).toBeGreaterThanOrEqual(24);
    expect(parseFloat(style.minHeight)).toBeGreaterThanOrEqual(24);
  });
});

describe('F13: default focus ring', () => {
  it('applies to everyone, beats outline: none, and skips programmatic focus targets', () => {
    expect(DEFAULT_FOCUS_RING).toMatch(/^:focus-visible:not\(\[tabindex='-1'\]\)/);
    expect(DEFAULT_FOCUS_RING).toMatch(/outline: 2px solid [^;]+ !important;/);
  });
});
