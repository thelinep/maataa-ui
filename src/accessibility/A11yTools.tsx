/**
 * Accessibility tools wired into the app shell: the toolbar buttons, the
 * settings, shortcuts and sign-language dialogs, global shortcuts, the
 * skip link, and the route announcer.
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Modal } from '@maataa/ui/surfaces';
import { colorTokens, spacing, typography } from '@/utils/tokens';
import { useA11y } from './preferences';
import { AccessibilityPanel } from './AccessibilityPanel';
import { SignLanguagePanel } from './sign-language/SignLanguagePanel';
import { RouteAnnouncer } from './RouteAnnouncer';
import { SHORTCUTS, useGlobalShortcuts } from './shortcuts';
import { pageText, speak, stopSpeaking } from './readAloud';

export const MAIN_ID = 'main-content';
export const NAV_ID = 'workflow-navigation';

// ---- skip link (WCAG 2.4.1) ------------------------------------------------

const SkipAnchor = styled.a`
  position: absolute;
  left: ${spacing.sm};
  top: -100px;
  z-index: 2000;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 6px;
  background: ${colorTokens.text.primary};
  color: ${colorTokens.text.inverse};
  font-weight: 600;
  text-decoration: none;

  &:focus {
    top: ${spacing.sm};
    outline: 3px solid ${colorTokens.interactive.info};
    outline-offset: 2px;
  }
`;

export const SkipLink: React.FC = () => (
  <SkipAnchor
    href={`#${MAIN_ID}`}
    onClick={(e) => {
      e.preventDefault();
      document.getElementById(MAIN_ID)?.focus();
    }}
  >
    Skip to main content
  </SkipAnchor>
);

// ---- toolbar ----------------------------------------------------------------

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  margin: 0 0 ${spacing.lg};
  padding: 0 ${spacing.sm};

  @media (max-width: 768px) {
    flex-direction: row;
    /* Own row above the workflow links */
    flex: 0 0 100%;
    margin: 0;
    padding: 0;
  }
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  min-height: 32px;
  padding: 4px ${spacing.sm};
  border: 1px solid ${colorTokens.text.secondary};
  border-radius: 6px;
  background: transparent;
  color: ${colorTokens.text.primary};
  font: inherit;
  font-size: ${typography.bodySmall.fontSize};
  text-align: left;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${colorTokens.background.secondary};
  }
  &:focus-visible {
    outline: 2px solid ${colorTokens.text.primary};
    outline-offset: 2px;
  }
`;

export const A11yToolbar: React.FC = () => {
  const { setPanelOpen, setSignLanguageOpen, setShortcutsOpen } = useA11y();
  return (
    <Group role="group" aria-label="Accessibility tools">
      <ToolButton type="button" onClick={() => setPanelOpen(true)} aria-haspopup="dialog">
        <span aria-hidden="true">♿</span> Accessibility
      </ToolButton>
      <ToolButton type="button" onClick={() => setSignLanguageOpen(true)}>
        <span aria-hidden="true">🤟</span> Sign language
      </ToolButton>
      <ToolButton type="button" onClick={() => setShortcutsOpen(true)} aria-haspopup="dialog">
        <span aria-hidden="true">⌨️</span> Shortcuts
      </ToolButton>
    </Group>
  );
};

// ---- shortcuts dialog --------------------------------------------------------

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: ${spacing.sm};
    border-bottom: 1px solid ${colorTokens.border.primary};
    text-align: left;
    color: ${colorTokens.text.primary};
  }
  kbd {
    display: inline-block;
    min-width: 1.6em;
    padding: 2px 6px;
    border: 1px solid ${colorTokens.text.secondary};
    border-bottom-width: 2px;
    border-radius: 4px;
    font-family: ui-monospace, monospace;
    font-size: 0.9em;
    text-align: center;
  }
`;

export const ShortcutsDialog: React.FC = () => {
  const { shortcutsOpen, setShortcutsOpen, prefs } = useA11y();
  return (
    <Modal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} title="Keyboard shortcuts">
      <Table>
        <caption className="a11y-sr-only">Keyboard shortcuts</caption>
        <thead>
          <tr>
            <th scope="col">Keys</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {SHORTCUTS.map((s) => (
            <tr key={s.action}>
              <td>
                {s.keys.map((k, i) => (
                  <React.Fragment key={k}>
                    {i > 0 && ' + '}
                    <kbd>{k}</kbd>
                  </React.Fragment>
                ))}
                {s.keys.length === 1 && !prefs.shortcutsEnabled && ' (turned off)'}
              </td>
              <td>{s.description}</td>
            </tr>
          ))}
          <tr>
            <td>
              <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>
            </td>
            <td>Move between controls</td>
          </tr>
          <tr>
            <td>
              <kbd>Esc</kbd>
            </td>
            <td>Close a dialog or dropdown</td>
          </tr>
          <tr>
            <td>
              <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd>
            </td>
            <td>Move within tabs, dropdowns and grids</td>
          </tr>
          <tr>
            <td>
              <kbd>Enter</kbd> / <kbd>Space</kbd>
            </td>
            <td>Open a table row, choose an option, press a button</td>
          </tr>
        </tbody>
      </Table>
      <p style={{ color: colorTokens.text.secondary, marginBottom: 0 }}>
        On a Mac, <kbd>Alt</kbd> is the <kbd>Option</kbd> key. Single-key shortcuts can be turned off in Accessibility
        settings.
      </p>
    </Modal>
  );
};

// ---- everything together -------------------------------------------------------

export const A11yTools: React.FC = () => {
  const navigate = useNavigate();
  const { prefs, setPanelOpen, setShortcutsOpen, setSignLanguageOpen } = useA11y();

  useGlobalShortcuts(
    {
      showShortcuts: () => setShortcutsOpen(true),
      openSettings: () => setPanelOpen(true),
      openSignLanguage: () => setSignLanguageOpen(true),
      goToMain: () => document.getElementById(MAIN_ID)?.focus(),
      goToNavigation: () => document.querySelector<HTMLElement>(`#${NAV_ID} a`)?.focus(),
      readPage: () => speak(pageText(), { lang: prefs.readAloudLang, rate: prefs.readAloudRate }),
      stopReading: () => stopSpeaking(),
      openGuide: () => navigate('/help/accessibility'),
    },
    prefs.shortcutsEnabled
  );

  return (
    <>
      <RouteAnnouncer />
      <AccessibilityPanel />
      <ShortcutsDialog />
      <SignLanguagePanel />
    </>
  );
};
