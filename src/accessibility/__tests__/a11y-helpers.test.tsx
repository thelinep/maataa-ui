/**
 * Vision and sign language helpers: preferences, read aloud, shortcuts,
 * route announcements, the settings panel, the ISL help panel and the
 * accessibility guide, tested through the real app shell.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { FilmEntityService } from '@/core/film';
import { App } from '@/app/App';
import { appRoutes } from '@/app/routes';
import {
  STORAGE_KEY,
  applyPreferences,
  defaultPreferences,
  loadPreferences,
} from '../preferences';
import { MAX_SPEECH_CHARS, errorText, pageText, pickVoice, speak, stopSpeaking } from '../readAloud';
import { isTypingTarget, matchShortcut } from '../shortcuts';
import { cleanHeading, titleFor } from '../RouteAnnouncer';
import { SIGN_LANGUAGE_TOPICS, loadManifest, topicForPath } from '../sign-language/topics';

// ---------------------------------------------------------------------------
// Fakes
// ---------------------------------------------------------------------------

class FakeUtterance {
  text: string;
  lang = '';
  rate = 1;
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function installSpeech(voices: Array<{ lang: string; name: string }> = [{ lang: 'en-IN', name: 'Rishi' }]) {
  const synth = {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(() => voices),
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true, writable: true });
  return synth;
}

function removeSpeech() {
  delete (window as unknown as Record<string, unknown>).speechSynthesis;
  delete (window as unknown as Record<string, unknown>).SpeechSynthesisUtterance;
}

function mockManifest(videos: unknown[] = []) {
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ language: 'ISL', videos }) }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function key(code: string, extra: Partial<KeyboardEventInit> = {}) {
  return new KeyboardEvent('keydown', { code, altKey: true, shiftKey: true, bubbles: true, cancelable: true, ...extra });
}

function renderApp(path: string) {
  const service = new FilmEntityService();
  service.seed();
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<App service={service} router={router} currentUser="Tester" />);
  return { router, service };
}

beforeEach(() => {
  window.localStorage.clear();
  mockManifest();
});

afterEach(() => {
  vi.unstubAllGlobals();
  removeSpeech();
  const root = document.documentElement;
  root.removeAttribute('style');
  Object.keys(root.dataset).forEach((k) => delete root.dataset[k]);
  document.title = '';
});

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

describe('preferences', () => {
  it('ignores malformed saved values and keeps valid ones', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ textScale: 150, contrast: 'neon', readAloudRate: 9, readAloudLang: 'hi-IN', strongFocus: 'yes' })
    );
    const prefs = loadPreferences();
    expect(prefs.textScale).toBe(150);
    expect(prefs.contrast).toBe('default');
    expect(prefs.readAloudRate).toBe(1);
    expect(prefs.readAloudLang).toBe('hi-IN');
    expect(prefs.strongFocus).toBe(false);
  });

  it('survives corrupt storage', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadPreferences()).toEqual(defaultPreferences());
  });

  it('mirrors preferences onto the root element', () => {
    const root = document.createElement('html');
    applyPreferences(
      { ...defaultPreferences(), textScale: 200, contrast: 'yellow-on-black', reduceMotion: true, strongFocus: true, textSpacing: true, underlineLinks: true },
      root
    );
    expect(root.dataset).toMatchObject({
      a11yContrast: 'yellow-on-black',
      a11yMotion: 'reduce',
      a11yFocus: 'strong',
      a11ySpacing: 'wide',
      a11yLinks: 'underline',
    });
    expect(root.style.getPropertyValue('zoom')).toBe('2');
    // zoom does not rescale vh, so viewport-sized parts divide by this
    expect(root.style.getPropertyValue('--a11y-zoom')).toBe('2');
    applyPreferences(defaultPreferences(), root);
    expect(root.style.getPropertyValue('zoom')).toBe('');
    expect(root.style.getPropertyValue('--a11y-zoom')).toBe('');
  });
});

describe('read aloud', () => {
  it('speaks cleaned, capped text with the chosen language, rate and voice', () => {
    const synth = installSpeech([{ lang: 'hi-IN', name: 'Lekha' }]);
    expect(speak(`  Namaste \n\n duniya ${'x'.repeat(MAX_SPEECH_CHARS)}`, { lang: 'hi-IN', rate: 5 })).toBe(true);
    expect(synth.cancel).toHaveBeenCalled();
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text.startsWith('Namaste duniya')).toBe(true);
    expect(utterance.text).toHaveLength(MAX_SPEECH_CHARS);
    expect(utterance.lang).toBe('hi-IN');
    expect(utterance.rate).toBe(2);
    expect(utterance.voice).toEqual({ lang: 'hi-IN', name: 'Lekha' });
  });

  it('falls back to any voice of the same language', () => {
    installSpeech([{ lang: 'hi_IN', name: 'A' }, { lang: 'en-GB', name: 'B' }]);
    expect(pickVoice('hi-IN')?.name).toBe('A');
    expect(pickVoice('en-IN')?.name).toBe('B');
  });

  it('does nothing without speech support or text', () => {
    expect(speak('hello', { lang: 'en-IN', rate: 1 })).toBe(false);
    const synth = installSpeech();
    expect(speak('   ', { lang: 'en-IN', rate: 1 })).toBe(false);
    stopSpeaking();
    expect(synth.speak).not.toHaveBeenCalled();
    expect(synth.cancel).toHaveBeenCalledTimes(1);
  });

  it('reads visible main content and error messages only', () => {
    const doc = document.implementation.createHTMLDocument('t');
    doc.body.innerHTML = `
      <nav>Menu</nav>
      <main><h1>Screenings</h1><span aria-hidden="true">🎬</span><p>Three screenings</p><div hidden>secret</div></main>
      <div role="alert">Title is required</div><div role="alert">Date is required</div>`;
    expect(pageText(doc)).toBe('Screenings . Three screenings .');
    expect(errorText(doc)).toBe('Title is required. Date is required');
  });
});

describe('shortcuts', () => {
  it('matches Alt+Shift shortcuts by physical key, whatever the layout', () => {
    expect(matchShortcut(key('KeyA', { key: 'Å' }), true)).toBe('openSettings');
    expect(matchShortcut(key('KeyL'), true)).toBe('openSignLanguage');
    expect(matchShortcut(key('KeyA', { ctrlKey: true }), true)).toBeNull();
    expect(matchShortcut(key('KeyZ'), true)).toBeNull();
  });

  it('only fires "?" outside text fields and when single-key shortcuts are on', () => {
    const q = (target?: HTMLElement) => {
      const e = new KeyboardEvent('keydown', { key: '?', shiftKey: true, bubbles: true });
      if (target) Object.defineProperty(e, 'target', { value: target });
      return e;
    };
    expect(matchShortcut(q(document.body), true)).toBe('showShortcuts');
    expect(matchShortcut(q(document.body), false)).toBeNull();
    expect(matchShortcut(q(document.createElement('input')), true)).toBeNull();
    const combo = document.createElement('div');
    combo.setAttribute('role', 'combobox');
    expect(isTypingTarget(combo)).toBe(true);
  });
});

describe('route titles and sign language topics', () => {
  it('strips emoji from headings for titles', () => {
    expect(cleanHeading('📊 Feedback Results: Premiere')).toBe('Feedback Results: Premiere');
    expect(titleFor('🎬 Screenings')).toBe('Screenings – MAATAA');
    expect(titleFor(null)).toBe('MAATAA Film Production');
  });

  it('picks the topic for a route, falling back to welcome', () => {
    expect(topicForPath('/screenings/screening-1').id).toBe('screenings');
    expect(topicForPath('/budgets/b1').id).toBe('projects');
    expect(topicForPath('/nowhere').id).toBe('welcome');
    for (const t of SIGN_LANGUAGE_TOPICS) {
      expect(t.script.length).toBeGreaterThan(20);
      expect(t.scriptHi.length).toBeGreaterThan(20);
    }
  });

  it('treats a missing or broken manifest as no videos', async () => {
    const notFound = vi.fn(async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
    expect(await loadManifest(notFound)).toEqual({ language: 'ISL', videos: [] });
    const broken = vi.fn(async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;
    expect((await loadManifest(broken)).videos).toEqual([]);
    const mixed = vi.fn(async () => ({ ok: true, json: async () => ({ videos: [{ id: 'concepts' }, null, { x: 1 }] }) })) as unknown as typeof fetch;
    expect((await loadManifest(mixed)).videos).toEqual([{ id: 'concepts' }]);
  });
});

// ---------------------------------------------------------------------------
// In the app
// ---------------------------------------------------------------------------

describe('app shell helpers', () => {
  it('offers a skip link, landmarks and the accessibility toolbar', async () => {
    renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    fireEvent.click(skip);
    expect(document.activeElement).toBe(screen.getByRole('main'));
    const tools = screen.getByRole('group', { name: 'Accessibility tools' });
    expect(within(tools).getAllByRole('button').map((b) => b.textContent?.trim())).toEqual([
      '♿ Accessibility',
      '🤟 Sign language',
      '⌨️ Shortcuts',
    ]);
  });

  it('sets a page title per route and moves focus to the new heading on navigation', async () => {
    const { router } = renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    await waitFor(() => expect(document.title).toMatch(/– MAATAA$/));
    expect(document.activeElement).not.toBe(screen.getByRole('heading', { level: 1 }));

    const nav = screen.getByRole('navigation', { name: 'Film production workflows' });
    fireEvent.click(within(nav).getByRole('link', { name: /Screenings/ }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/screenings'));
    await waitFor(() => {
      const h1 = screen.getByRole('main').querySelector('h1');
      expect(h1).not.toBeNull();
      expect(document.activeElement).toBe(h1);
      expect(document.title).toBe(`${cleanHeading(h1?.textContent ?? '')} – MAATAA`);
    });
  });

  it('applies and remembers settings from the panel, and resets them', async () => {
    renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    fireEvent.click(screen.getByRole('button', { name: /Accessibility$/ }));
    const dialog = await screen.findByRole('dialog', { name: /Accessibility settings/ });

    fireEvent.click(within(dialog).getByRole('radio', { name: '150%' }));
    fireEvent.click(within(dialog).getByRole('radio', { name: /Yellow on black/ }));
    fireEvent.click(within(dialog).getByRole('checkbox', { name: /Stronger focus outline/ }));
    fireEvent.click(within(dialog).getByRole('checkbox', { name: /Wider line and letter spacing/ }));

    const root = document.documentElement;
    expect(root.style.getPropertyValue('zoom')).toBe('1.5');
    expect(root.dataset.a11yContrast).toBe('yellow-on-black');
    expect(root.dataset.a11yFocus).toBe('strong');
    expect(root.dataset.a11ySpacing).toBe('wide');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ textScale: 150, contrast: 'yellow-on-black' });

    fireEvent.click(within(dialog).getByRole('button', { name: /Reset/ }));
    expect(root.dataset.a11yContrast).toBe('default');
    expect(root.style.getPropertyValue('zoom')).toBe('');
  });

  it('reads the page aloud from the panel and explains when no voice is installed', async () => {
    const synth = installSpeech();
    renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    fireEvent.click(screen.getByRole('button', { name: /Accessibility$/ }));
    const dialog = await screen.findByRole('dialog', { name: /Accessibility settings/ });
    fireEvent.change(within(dialog).getByLabelText('Language'), { target: { value: 'hi-IN' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Read this page' }));
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toContain('The Lost Highway');
    expect(utterance.lang).toBe('hi-IN');
    expect(within(dialog).getByText(/No voice for this language is installed/)).toBeInTheDocument();
  });

  it('opens each helper from its keyboard shortcut', async () => {
    const synth = installSpeech();
    const { router } = renderApp('/concepts');
    await screen.findByText('The Lost Highway');

    act(() => void document.dispatchEvent(key('KeyA')));
    expect(await screen.findByRole('dialog', { name: /Accessibility settings/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    act(() => void document.body.dispatchEvent(new KeyboardEvent('keydown', { key: '?', shiftKey: true, bubbles: true })));
    const shortcuts = await screen.findByRole('dialog', { name: /Keyboard shortcuts/ });
    expect(within(shortcuts).getByRole('table')).toBeInTheDocument();
    fireEvent.keyDown(shortcuts, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Keyboard shortcuts/ })).not.toBeInTheDocument());

    act(() => void document.dispatchEvent(key('KeyR')));
    expect(synth.speak).toHaveBeenCalledTimes(1);
    act(() => void document.dispatchEvent(key('KeyS')));
    expect(synth.cancel).toHaveBeenCalled();

    act(() => void document.dispatchEvent(key('KeyN')));
    expect(document.activeElement?.closest('nav')).toBe(screen.getByRole('navigation', { name: 'Film production workflows' }));

    act(() => void document.dispatchEvent(key('KeyH')));
    await waitFor(() => expect(router.state.location.pathname).toBe('/help/accessibility'));
    expect(await screen.findByRole('heading', { level: 1, name: 'Accessibility guide' })).toBeInTheDocument();
  });
});

describe('sign language panel', () => {
  it('shows the topic for the current page, with a transcript when no video is recorded', async () => {
    renderApp('/screenings');
    await screen.findByText('Film Festival Premiere');
    const opener = screen.getByRole('button', { name: 'Sign language' });
    opener.focus();
    fireEvent.click(opener);

    const panel = await screen.findByRole('dialog', { name: /Sign language/ });
    expect(panel).toHaveAttribute('aria-modal', 'false');
    await waitFor(() => expect(within(panel).getByText(/has not been recorded yet/)).toBeInTheDocument());
    const topic = within(panel).getByLabelText('Topic') as HTMLSelectElement;
    expect(topic.value).toBe('screenings');
    expect(within(panel).getByRole('option', { name: /Screenings.*\(transcript only\)/ })).toBeInTheDocument();

    const screeningsTopic = SIGN_LANGUAGE_TOPICS.find((t) => t.id === 'screenings')!;
    expect(within(panel).getByText(screeningsTopic.script)).toHaveAttribute('lang', 'en');
    fireEvent.click(within(panel).getByRole('button', { name: 'हिन्दी' }));
    expect(within(panel).getByText(screeningsTopic.scriptHi)).toHaveAttribute('lang', 'hi');

    // Non-modal: the page behind stays usable
    expect(screen.getByText('Film Festival Premiere')).toBeVisible();

    fireEvent.keyDown(panel, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Sign language/ })).not.toBeInTheDocument());
    expect(document.activeElement).toBe(opener);
  });

  it('plays a recorded video with captions and credits the signer', async () => {
    mockManifest([{ id: 'concepts', signer: 'R. Sharma', captions: ['en', 'hi'], poster: true }]);
    renderApp('/concepts');
    await screen.findByText('The Lost Highway');
    fireEvent.click(screen.getByRole('button', { name: 'Sign language' }));
    const panel = await screen.findByRole('dialog', { name: /Sign language/ });
    const video = await within(panel).findByLabelText(/Indian Sign Language video: /);
    expect(video).toHaveAttribute('src', '/isl/concepts.mp4');
    expect(video).toHaveAttribute('poster', '/isl/concepts.jpg');
    const tracks = video.querySelectorAll('track');
    expect([...tracks].map((t) => [t.getAttribute('srclang'), t.getAttribute('src')])).toEqual([
      ['en', '/isl/concepts.en.vtt'],
      ['hi', '/isl/concepts.hi.vtt'],
    ]);
    expect(within(panel).getByText('Signed by R. Sharma')).toBeInTheDocument();

    const larger = within(panel).getByRole('button', { name: 'Larger video' });
    expect(larger).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(larger);
    expect(larger).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('accessibility guide', () => {
  it('is reachable at /help and lists every shortcut', async () => {
    const { router } = renderApp('/help');
    expect(await screen.findByRole('heading', { level: 1, name: 'Accessibility guide' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/help/accessibility');
    const table = screen.getByRole('table', { name: 'Keyboard shortcuts' });
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 8);
    fireEvent.click(screen.getByRole('button', { name: 'Open sign language help' }));
    expect(await screen.findByRole('dialog', { name: /Sign language/ })).toBeInTheDocument();
  });
});
