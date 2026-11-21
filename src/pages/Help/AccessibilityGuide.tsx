/**
 * Accessibility guide: how to use MAATAA with a screen reader, the keyboard,
 * read aloud and sign language help, plus known issues (accessibility
 * statement). Linked from the Accessibility settings and Alt+Shift+H.
 */

import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/utils/tokens';
import { useA11y } from '@/accessibility/preferences';
import { SHORTCUTS } from '@/accessibility/shortcuts';

const Page = styled.article`
  max-width: 820px;
  padding: ${spacing.lg};
  color: ${colorTokens.text.primary};
  line-height: 1.6;

  h1 {
    margin-top: 0;
  }
  h2 {
    margin-top: ${spacing.xl};
  }
  h3 {
    margin-top: ${spacing.lg};
    font-size: ${typography.body.fontSize};
  }
  li {
    margin-bottom: ${spacing.xs};
  }
  kbd {
    padding: 1px 6px;
    border: 1px solid ${colorTokens.text.secondary};
    border-bottom-width: 2px;
    border-radius: 4px;
    font-family: ui-monospace, monospace;
    font-size: 0.9em;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    padding: ${spacing.sm};
    border-bottom: 1px solid ${colorTokens.border.primary};
    text-align: left;
    vertical-align: top;
  }
`;

const Lead = styled.p`
  font-size: 1.05rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin: ${spacing.md} 0;

  button {
    min-height: 36px;
    padding: 6px 12px;
    border: 1px solid ${colorTokens.text.primary};
    border-radius: 6px;
    background: ${colorTokens.background.primary};
    color: ${colorTokens.text.primary};
    font: inherit;
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid ${colorTokens.text.primary};
    outline-offset: 2px;
  }
`;

const Keys: React.FC<{ keys: string[] }> = ({ keys }) => (
  <>
    {keys.map((k, i) => (
      <React.Fragment key={k}>
        {i > 0 && ' + '}
        <kbd>{k}</kbd>
      </React.Fragment>
    ))}
  </>
);

const AccessibilityGuide: React.FC = () => {
  const { setPanelOpen, setShortcutsOpen, setSignLanguageOpen } = useA11y();
  return (
    <Page aria-labelledby="a11y-guide-title">
      <h1 id="a11y-guide-title">Accessibility guide</h1>
      <Lead>
        MAATAA can be used with a screen reader, with only a keyboard, with large text or high contrast, with read
        aloud, and with Indian Sign Language (ISL) help. This page explains each, workflow by workflow.
      </Lead>
      <Actions>
        <button type="button" onClick={() => setPanelOpen(true)}>
          Open accessibility settings
        </button>
        <button type="button" onClick={() => setShortcutsOpen(true)}>
          Show keyboard shortcuts
        </button>
        <button type="button" onClick={() => setSignLanguageOpen(true)}>
          Open sign language help
        </button>
      </Actions>

      <h2>Accessibility settings</h2>
      <p>
        Choose <strong>Accessibility</strong> at the top of the menu, or press <Keys keys={['Alt', 'Shift', 'A']} />. Your
        choices are remembered on this device.
      </p>
      <ul>
        <li>
          <strong>Text size</strong> from 100% to 200%. The layout reflows, so nothing scrolls sideways.
        </li>
        <li>
          <strong>Colours:</strong> standard, high contrast (black on white), or yellow on black.
        </li>
        <li>
          <strong>Reduce motion</strong> turns off animations. It is on automatically if your device asks for reduced
          motion.
        </li>
        <li>
          <strong>Stronger focus outline</strong> draws a thick ring around whatever the keyboard is on.
        </li>
        <li>
          <strong>Wider spacing</strong> increases line, letter and word spacing for easier reading.
        </li>
        <li>
          <strong>Underline all links.</strong>
        </li>
      </ul>

      <h2>Using MAATAA with a screen reader</h2>
      <p>
        Tested patterns follow the WAI-ARIA Authoring Practices. Recommended: NVDA or JAWS with Chrome, Edge or Firefox
        on Windows; VoiceOver with Safari or Chrome on a Mac; TalkBack with Chrome on Android; VoiceOver on iPhone.
      </p>

      <h3>Finding your way</h3>
      <ul>
        <li>
          The first item on every page is <strong>Skip to main content</strong>.
        </li>
        <li>
          Landmarks: the workflow menu is a navigation landmark named &quot;Film production workflows&quot;; the page
          content is the main landmark. In NVDA and JAWS press <kbd>D</kbd>; in VoiceOver use the rotor.
        </li>
        <li>
          Every page has one level-1 heading. Press <kbd>H</kbd> (NVDA, JAWS) or use the VoiceOver rotor to move by
          heading.
        </li>
        <li>
          After you choose a menu item, focus moves to the new page&apos;s heading and the page title changes (for
          example &quot;Screenings – MAATAA&quot;), so you hear where you are.
        </li>
      </ul>

      <h3>Lists and tables (Concepts, Projects, Teams, Budgets)</h3>
      <ul>
        <li>Each row of a table can be reached with Tab. Press Enter or Space on a row to open it.</li>
        <li>Script, storyboard and screening lists are cards: Tab to a card and press Enter.</li>
        <li>Search boxes filter as you type; the table updates below.</li>
      </ul>

      <h3>Dropdowns</h3>
      <ul>
        <li>
          Dropdowns are announced as a &quot;combo box&quot; with their label. Press <kbd>↓</kbd> or <kbd>Enter</kbd> to
          open, <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to choose, <kbd>Esc</kbd> to close. Type the first
          letters of an option to jump to it.
        </li>
        <li>
          In a dropdown where you can pick several (team members, attendees), each choice stays selected until you press
          Enter on it again. Your choices are listed under the field as chips; each has a <strong>Remove</strong>{' '}
          button, and <kbd>Backspace</kbd> in the dropdown removes the last one.
        </li>
        <li>NVDA and JAWS switch to focus mode in a dropdown automatically.</li>
      </ul>

      <h3>Dialogs and tabs</h3>
      <ul>
        <li>
          <strong>Edit</strong> on a project opens a dialog. Focus moves inside it and stays there until you close it
          with <kbd>Esc</kbd> or the Close button; focus then returns to Edit.
        </li>
        <li>
          Detail pages use tabs (Overview, Activity, Team). Use <kbd>←</kbd> <kbd>→</kbd> to switch.
        </li>
      </ul>

      <h3>Forms</h3>
      <ul>
        <li>Every field is announced with its label; required fields are announced as required.</li>
        <li>
          If saving fails, each problem is shown under its field and announced. Focus moves to the first field to fix.
        </li>
        <li>&quot;Saved&quot; and error messages after saving are announced without moving focus.</li>
      </ul>

      <h2>Keyboard only</h2>
      <table>
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
                <Keys keys={s.keys} />
              </td>
              <td>{s.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        On a Mac, <kbd>Alt</kbd> is <kbd>Option</kbd>. The single-key <kbd>?</kbd> shortcut never fires while you type and
        can be turned off in the settings.
      </p>

      <h2>Read aloud</h2>
      <p>
        For low vision or reading difficulty without a screen reader: open the settings and choose{' '}
        <strong>Read this page</strong>, <strong>Read selected text</strong> or <strong>Read error messages</strong>, or
        press <Keys keys={['Alt', 'Shift', 'R']} /> (stop with <Keys keys={['Alt', 'Shift', 'S']} />). It speaks English
        or Hindi with your device&apos;s own voices; to add a Hindi voice, install one in your system&apos;s speech or
        language settings.
      </p>

      <h2>Sign language (ISL)</h2>
      <p>
        <strong>Sign language</strong> at the top of the menu, or <Keys keys={['Alt', 'Shift', 'L']} />, opens a help
        panel for the page you are on. Videos are signed in Indian Sign Language by human signers, with captions, and can
        be enlarged or played picture-in-picture. Every topic also has a written transcript in English and Hindi; topics
        without a video yet show the transcript only. The panel does not block the page, so you can follow along.
      </p>
      <p>
        For productions, each screening&apos;s <strong>Accessibility</strong> section tracks the film&apos;s captions,
        audio description and ISL interpreter track, and what the venue offers.
      </p>

      <h2>Known issues</h2>
      <p>
        MAATAA aims for WCAG 2.2 level AA and is partly conformant. Known problems, found in the November 2026 audit and
        being fixed:
      </p>
      <ul>
        <li>A few buttons are smaller than 24 × 24 pixels (sound mixer Mute and Solo).</li>
        <li>Some pages skip a heading level.</li>
        <li>Creating a project, team or budget does not save yet; this affects everyone, not only assistive technology.</li>
      </ul>
      <p>If something else gets in your way, tell your MAATAA administrator, with the page and what you were trying to do.</p>
    </Page>
  );
};

export default AccessibilityGuide;
