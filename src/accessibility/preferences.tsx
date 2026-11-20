/**
 * Accessibility preferences: display adjustments a person can turn on for
 * themselves (text size, contrast, motion, focus, spacing), plus read-aloud
 * and keyboard-shortcut settings. Saved per browser and applied to <html>
 * as data attributes that GlobalA11yStyles reads.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type TextScale = 100 | 125 | 150 | 175 | 200;
export type ContrastMode = 'default' | 'high' | 'yellow-on-black';
export type ReadAloudLang = 'en-IN' | 'hi-IN' | 'en-US' | 'en-GB';

export interface A11yPreferences {
  textScale: TextScale;
  contrast: ContrastMode;
  reduceMotion: boolean;
  strongFocus: boolean;
  textSpacing: boolean;
  underlineLinks: boolean;
  readAloudLang: ReadAloudLang;
  /** Speech rate, 0.5–2 (1 = normal). */
  readAloudRate: number;
  /** Single-key shortcuts ("?") can be turned off (WCAG 2.1.4). */
  shortcutsEnabled: boolean;
}

export const TEXT_SCALES: TextScale[] = [100, 125, 150, 175, 200];

export const STORAGE_KEY = 'maataa.a11y.v1';

function systemPrefersReducedMotion(): boolean {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  } catch {
    return false;
  }
}

export function defaultPreferences(): A11yPreferences {
  return {
    textScale: 100,
    contrast: 'default',
    reduceMotion: systemPrefersReducedMotion(),
    strongFocus: false,
    textSpacing: false,
    underlineLinks: false,
    readAloudLang: 'en-IN',
    readAloudRate: 1,
    shortcutsEnabled: true,
  };
}

/** Reads saved preferences, ignoring anything malformed. */
export function loadPreferences(): A11yPreferences {
  const base = defaultPreferences();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<A11yPreferences>;
    return {
      ...base,
      ...(TEXT_SCALES.includes(saved.textScale as TextScale) ? { textScale: saved.textScale } : {}),
      ...(['default', 'high', 'yellow-on-black'].includes(saved.contrast as string)
        ? { contrast: saved.contrast }
        : {}),
      ...(typeof saved.reduceMotion === 'boolean' ? { reduceMotion: saved.reduceMotion } : {}),
      ...(typeof saved.strongFocus === 'boolean' ? { strongFocus: saved.strongFocus } : {}),
      ...(typeof saved.textSpacing === 'boolean' ? { textSpacing: saved.textSpacing } : {}),
      ...(typeof saved.underlineLinks === 'boolean' ? { underlineLinks: saved.underlineLinks } : {}),
      ...(['en-IN', 'hi-IN', 'en-US', 'en-GB'].includes(saved.readAloudLang as string)
        ? { readAloudLang: saved.readAloudLang }
        : {}),
      ...(typeof saved.readAloudRate === 'number' && saved.readAloudRate >= 0.5 && saved.readAloudRate <= 2
        ? { readAloudRate: saved.readAloudRate }
        : {}),
      ...(typeof saved.shortcutsEnabled === 'boolean' ? { shortcutsEnabled: saved.shortcutsEnabled } : {}),
    } as A11yPreferences;
  } catch {
    return base;
  }
}

function savePreferences(prefs: A11yPreferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Private mode or storage full: preferences still apply for this visit.
  }
}

/** Mirrors preferences onto <html> so global CSS can react to them. */
export function applyPreferences(prefs: A11yPreferences, root: HTMLElement = document.documentElement) {
  root.dataset.a11yContrast = prefs.contrast;
  root.dataset.a11yMotion = prefs.reduceMotion ? 'reduce' : 'full';
  root.dataset.a11yFocus = prefs.strongFocus ? 'strong' : 'default';
  root.dataset.a11ySpacing = prefs.textSpacing ? 'wide' : 'default';
  root.dataset.a11yLinks = prefs.underlineLinks ? 'underline' : 'default';
  // The design system sizes text in px, so a root font-size would not scale
  // it; zoom scales text and layout together, like browser zoom, and the
  // layout reflows (tested at 320 CSS px).
  root.style.setProperty('zoom', prefs.textScale === 100 ? '' : String(prefs.textScale / 100));
  // zoom does not rescale vh units, so anything sized to the viewport divides
  // by this (see GlobalA11yStyles and AppLayout).
  root.style.setProperty('--a11y-zoom', prefs.textScale === 100 ? '' : String(prefs.textScale / 100));
}

interface A11yContextValue {
  prefs: A11yPreferences;
  setPref: <K extends keyof A11yPreferences>(key: K, value: A11yPreferences[K]) => void;
  reset: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  signLanguageOpen: boolean;
  setSignLanguageOpen: (open: boolean) => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export const A11yPreferencesProvider: React.FC<{ children: React.ReactNode; initial?: A11yPreferences }> = ({
  children,
  initial,
}) => {
  const [prefs, setPrefs] = useState<A11yPreferences>(() => initial ?? loadPreferences());
  const [panelOpen, setPanelOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [signLanguageOpen, setSignLanguageOpen] = useState(false);

  useEffect(() => {
    applyPreferences(prefs);
    savePreferences(prefs);
  }, [prefs]);

  const setPref = useCallback(
    <K extends keyof A11yPreferences>(key: K, value: A11yPreferences[K]) =>
      setPrefs((current) => ({ ...current, [key]: value })),
    []
  );
  const reset = useCallback(() => setPrefs(defaultPreferences()), []);

  const value = useMemo(
    () => ({
      prefs,
      setPref,
      reset,
      panelOpen,
      setPanelOpen,
      shortcutsOpen,
      setShortcutsOpen,
      signLanguageOpen,
      setSignLanguageOpen,
    }),
    [prefs, setPref, reset, panelOpen, shortcutsOpen, signLanguageOpen]
  );
  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
};

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside A11yPreferencesProvider');
  return ctx;
}
