/**
 * Screening accessibility deliverables: captions, audio description, sign
 * language track and venue access, saved on the screening and summarised on
 * the list.
 */

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService } from '@/core/film';
import { App } from '@/app/App';
import { appRoutes } from '@/app/routes';
import { accessibilityBadges, emptyAccessibility, ScreeningAccessibilitySection } from '../ScreeningAccessibility';

vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ videos: [] }) })));

function renderApp(path: string) {
  const service = new FilmEntityService();
  service.seed();
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<App service={service} router={router} currentUser="Tester" />);
  return { service };
}

describe('accessibilityBadges', () => {
  it('lists deliverables that are needed, with their status', () => {
    const a11y = emptyAccessibility();
    a11y.captions.status = 'delivered';
    a11y.audioDescription.status = 'not-needed';
    a11y.signLanguage.status = 'in-progress';
    expect(accessibilityBadges(a11y).map((b) => [b.short, b.text])).toEqual([
      ['CC', 'Captions (SDH): Delivered'],
      ['ISL', 'Sign language track: In progress'],
    ]);
    expect(accessibilityBadges(undefined)).toEqual([]);
  });
});

describe('ScreeningAccessibilitySection', () => {
  it('saves edits and announces the result', async () => {
    const onSave = vi.fn(async () => undefined);
    render(<ScreeningAccessibilitySection onSave={onSave} />);
    const section = screen.getByRole('region', { name: 'Accessibility' });

    const sign = within(section).getByRole('group', { name: 'Sign language track' });
    fireEvent.change(within(sign).getByLabelText('Status'), { target: { value: 'delivered' } });
    fireEvent.change(within(sign).getByLabelText('Interpreter'), { target: { value: 'R. Sharma' } });
    fireEvent.change(within(sign).getByLabelText(/Languages/), { target: { value: 'Hindi, English ,' } });
    expect(within(sign).getByLabelText('Status')).toHaveAccessibleDescription('Interpreter shown picture-in-picture.');

    fireEvent.click(within(section).getByRole('checkbox', { name: 'Hearing loop' }));
    fireEvent.click(within(section).getByRole('button', { name: 'Save accessibility details' }));

    expect(await within(section).findByRole('status')).toHaveTextContent('Accessibility details saved.');
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        signLanguage: expect.objectContaining({ status: 'delivered', interpreter: 'R. Sharma', languages: ['Hindi', 'English'], signLanguage: 'ISL' }),
        venue: expect.objectContaining({ hearingLoop: true, wheelchairAccess: false }),
      })
    );
  });

  it('reports a failed save as an alert', async () => {
    render(<ScreeningAccessibilitySection onSave={async () => Promise.reject(new Error('offline'))} />);
    fireEvent.click(screen.getByRole('button', { name: 'Save accessibility details' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save: offline');
  });
});

describe('in the Screenings workflow', () => {
  it('shows deliverable badges on the list', async () => {
    renderApp('/screenings');
    // The card's details are the title button's description
    const title = await screen.findByRole('button', { name: 'Film Festival Premiere' });
    const card = document.getElementById(title.getAttribute('aria-describedby')!) as HTMLElement;
    expect(within(card).getByText('Captions (SDH): Delivered')).toBeInTheDocument();
    expect(within(card).getByText('Audio description: In progress')).toBeInTheDocument();
    expect(within(card).getByText('Sign language track: Not started')).toBeInTheDocument();
  });

  it('persists changes on the screening page', async () => {
    const { service } = renderApp('/screenings/screening-3');
    const section = await screen.findByRole('region', { name: 'Accessibility' });
    const ad = within(section).getByRole('group', { name: 'Audio description' });
    expect(within(ad).getByLabelText('Owner or vendor')).toHaveValue('Describer: N. Rao');
    fireEvent.change(within(ad).getByLabelText('Status'), { target: { value: 'delivered' } });
    fireEvent.click(within(section).getByRole('button', { name: 'Save accessibility details' }));
    await within(section).findByText('Accessibility details saved.');
    await waitFor(async () => {
      const saved = await service.getEntity('screening', 'screening-3');
      expect(saved?.accessibility?.audioDescription.status).toBe('delivered');
    });
  });
});
