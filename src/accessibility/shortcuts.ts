/**
 * App-wide keyboard shortcuts.
 *
 * Alt+Shift combinations are matched by physical key (event.code), because
 * on macOS Alt+Shift+A types "Å". The single-character "?" shortcut never
 * fires while typing and can be turned off in the accessibility settings
 * (WCAG 2.1.4 Character Key Shortcuts).
 */

import { useEffect, useRef } from 'react';

export type ShortcutAction =
  | 'showShortcuts'
  | 'openSettings'
  | 'openSignLanguage'
  | 'goToMain'
  | 'goToNavigation'
  | 'readPage'
  | 'stopReading'
  | 'openGuide';

export interface ShortcutDef {
  action: ShortcutAction;
  /** Human-readable keys, e.g. ["Alt", "Shift", "A"]. */
  keys: string[];
  description: string;
  /** event.code for Alt+Shift shortcuts; undefined for the "?" key. */
  code?: string;
}

export const SHORTCUTS: ShortcutDef[] = [
  { action: 'showShortcuts', keys: ['?'], description: 'Show keyboard shortcuts' },
  { action: 'openSettings', keys: ['Alt', 'Shift', 'A'], code: 'KeyA', description: 'Open accessibility settings' },
  { action: 'openSignLanguage', keys: ['Alt', 'Shift', 'L'], code: 'KeyL', description: 'Open sign language help' },
  { action: 'goToMain', keys: ['Alt', 'Shift', 'M'], code: 'KeyM', description: 'Jump to the main content' },
  { action: 'goToNavigation', keys: ['Alt', 'Shift', 'N'], code: 'KeyN', description: 'Jump to the workflow menu' },
  { action: 'readPage', keys: ['Alt', 'Shift', 'R'], code: 'KeyR', description: 'Read this page aloud' },
  { action: 'stopReading', keys: ['Alt', 'Shift', 'S'], code: 'KeyS', description: 'Stop reading aloud' },
  { action: 'openGuide', keys: ['Alt', 'Shift', 'H'], code: 'KeyH', description: 'Open the accessibility guide' },
];

/** True while focus is somewhere the person types text or picks options. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true;
  const role = target.getAttribute('role');
  return role === 'combobox' || role === 'textbox' || role === 'searchbox' || role === 'listbox';
}

/** Which shortcut, if any, a keydown event triggers. */
export function matchShortcut(event: KeyboardEvent, singleKeyEnabled: boolean): ShortcutAction | null {
  if (event.defaultPrevented) return null;
  if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey) {
    return SHORTCUTS.find((s) => s.code && s.code === event.code)?.action ?? null;
  }
  if (
    singleKeyEnabled &&
    event.key === '?' &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !isTypingTarget(event.target)
  ) {
    return 'showShortcuts';
  }
  return null;
}

/** Listens on the document and calls the handler for matched shortcuts. */
export function useGlobalShortcuts(
  handlers: Partial<Record<ShortcutAction, () => void>>,
  singleKeyEnabled: boolean
) {
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const action = matchShortcut(event, singleKeyEnabled);
      const handler = action ? ref.current[action] : undefined;
      if (handler) {
        event.preventDefault();
        handler();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [singleKeyEnabled]);
}
