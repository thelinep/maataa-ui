/**
 * Accessibility settings dialog: display, read aloud, keyboard and help.
 * Every control is a native radio, checkbox, select or range input, so it
 * works the same with every screen reader and with voice control.
 */

import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Modal } from '@maataa/ui/surfaces';
import { Button } from '@/components';
import { colorTokens, spacing, typography } from '@/utils/tokens';
import { TEXT_SCALES, useA11y, type ContrastMode, type ReadAloudLang } from './preferences';
import {
  READ_ALOUD_LANGS,
  errorText,
  hasVoiceFor,
  isReadAloudSupported,
  pageText,
  selectionText,
  speak,
  stopSpeaking,
} from './readAloud';

const Section = styled.fieldset`
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  padding: ${spacing.md};
  margin: 0 0 ${spacing.md};
  min-width: 0;

  legend {
    padding: 0 ${spacing.xs};
    font-weight: 600;
    font-size: ${typography.body.fontSize};
    color: ${colorTokens.text.primary};
  }
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
`;

/** A radio or checkbox with a large, label-wide hit area (24px+). */
const Choice = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  min-height: 32px;
  padding: 4px 10px;
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  cursor: pointer;
  color: ${colorTokens.text.primary};

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${colorTokens.text.primary};
  }
  &:has(input:checked) {
    border-color: ${colorTokens.text.primary};
    font-weight: 600;
  }
  &:has(input:focus-visible) {
    outline: 2px solid ${colorTokens.text.primary};
    outline-offset: 2px;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.sm};
`;

const Hint = styled.p`
  margin: ${spacing.xs} 0 0;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const FieldLabel = styled.label`
  font-weight: 500;
  color: ${colorTokens.text.primary};
`;

const NativeSelect = styled.select`
  min-height: 36px;
  padding: 4px 8px;
  border: 1px solid ${colorTokens.text.secondary};
  border-radius: 6px;
  background: ${colorTokens.background.primary};
  color: ${colorTokens.text.primary};
  font: inherit;
`;

const CONTRAST_LABELS: Record<ContrastMode, string> = {
  default: 'Standard',
  high: 'High contrast (black on white)',
  'yellow-on-black': 'Yellow on black',
};

export const AccessibilityPanel: React.FC = () => {
  const { prefs, setPref, reset, panelOpen, setPanelOpen, setShortcutsOpen, setSignLanguageOpen } = useA11y();
  const ids = useId();
  const supported = isReadAloudSupported();
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState('');
  // Keep whatever text was selected when the dialog opened.
  const selectionAtOpen = useRef('');

  useEffect(() => {
    if (panelOpen) selectionAtOpen.current = selectionText();
    else setStatus('');
  }, [panelOpen]);

  const read = (text: string, what: string) => {
    const ok = speak(text, { lang: prefs.readAloudLang, rate: prefs.readAloudRate, onEnd: () => setSpeaking(false) });
    setSpeaking(ok);
    setStatus(ok ? `Reading ${what}.` : `Nothing to read: no ${what} found.`);
  };

  const noVoice = supported && !hasVoiceFor(prefs.readAloudLang);

  return (
    <Modal isOpen={panelOpen} onClose={() => setPanelOpen(false)} title="Accessibility settings" size="md">
      <p style={{ marginTop: 0, color: colorTokens.text.secondary }}>
        Changes apply straight away and are remembered on this device.
      </p>

      <Section>
        <legend>Text size</legend>
        <Options>
          {TEXT_SCALES.map((scale) => (
            <Choice key={scale}>
              <input
                type="radio"
                name={`${ids}-scale`}
                checked={prefs.textScale === scale}
                onChange={() => setPref('textScale', scale)}
              />
              {scale}%
            </Choice>
          ))}
        </Options>
      </Section>

      <Section>
        <legend>Colours</legend>
        <Options>
          {(Object.keys(CONTRAST_LABELS) as ContrastMode[]).map((mode) => (
            <Choice key={mode}>
              <input
                type="radio"
                name={`${ids}-contrast`}
                checked={prefs.contrast === mode}
                onChange={() => setPref('contrast', mode)}
              />
              {CONTRAST_LABELS[mode]}
            </Choice>
          ))}
        </Options>
      </Section>

      <Section>
        <legend>Reading and movement</legend>
        <Stack>
          <Choice>
            <input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => setPref('reduceMotion', e.target.checked)} />
            Reduce motion (no animations)
          </Choice>
          <Choice>
            <input type="checkbox" checked={prefs.strongFocus} onChange={(e) => setPref('strongFocus', e.target.checked)} />
            Stronger focus outline
          </Choice>
          <Choice>
            <input type="checkbox" checked={prefs.textSpacing} onChange={(e) => setPref('textSpacing', e.target.checked)} />
            Wider line and letter spacing
          </Choice>
          <Choice>
            <input type="checkbox" checked={prefs.underlineLinks} onChange={(e) => setPref('underlineLinks', e.target.checked)} />
            Underline all links
          </Choice>
        </Stack>
      </Section>

      <Section>
        <legend>Read aloud</legend>
        {supported ? (
          <Stack>
            <Row>
              <FieldLabel htmlFor={`${ids}-lang`}>Language</FieldLabel>
              <NativeSelect
                id={`${ids}-lang`}
                value={prefs.readAloudLang}
                onChange={(e) => setPref('readAloudLang', e.target.value as ReadAloudLang)}
              >
                {READ_ALOUD_LANGS.map((l) => (
                  <option key={l.value} value={l.value} lang={l.value}>
                    {l.label}
                  </option>
                ))}
              </NativeSelect>
              <FieldLabel htmlFor={`${ids}-rate`}>Speed</FieldLabel>
              <input
                id={`${ids}-rate`}
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={prefs.readAloudRate}
                aria-valuetext={`${prefs.readAloudRate} times`}
                onChange={(e) => setPref('readAloudRate', Number(e.target.value))}
              />
              <output htmlFor={`${ids}-rate`}>{prefs.readAloudRate}×</output>
            </Row>
            {noVoice && (
              <Hint>
                No voice for this language is installed on this device, so the default voice will be used. Add one in
                your system&apos;s speech settings.
              </Hint>
            )}
            <Row>
              <Button size="sm" onClick={() => read(pageText(), 'this page')}>
                Read this page
              </Button>
              <Button size="sm" variant="tertiary" onClick={() => read(selectionAtOpen.current || selectionText(), 'selected text')}>
                Read selected text
              </Button>
              <Button size="sm" variant="tertiary" onClick={() => read(errorText(), 'error messages')}>
                Read error messages
              </Button>
              <Button
                size="sm"
                variant="tertiary"
                disabled={!speaking}
                onClick={() => {
                  stopSpeaking();
                  setSpeaking(false);
                  setStatus('Stopped reading.');
                }}
              >
                Stop
              </Button>
            </Row>
            <div role="status" className="a11y-sr-only">
              {status}
            </div>
          </Stack>
        ) : (
          <Hint>This browser has no built-in speech. Try a recent Chrome, Edge, Safari or Firefox.</Hint>
        )}
      </Section>

      <Section>
        <legend>Keyboard</legend>
        <Stack>
          <Choice>
            <input
              type="checkbox"
              checked={prefs.shortcutsEnabled}
              onChange={(e) => setPref('shortcutsEnabled', e.target.checked)}
            />
            Single-key shortcut: press ? for the shortcut list
          </Choice>
          <Row>
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => {
                setPanelOpen(false);
                setShortcutsOpen(true);
              }}
            >
              Show all keyboard shortcuts
            </Button>
          </Row>
        </Stack>
      </Section>

      <Section>
        <legend>More help</legend>
        <Row>
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => {
              setPanelOpen(false);
              setSignLanguageOpen(true);
            }}
          >
            Sign language help (ISL)
          </Button>
          <Link to="/help/accessibility" onClick={() => setPanelOpen(false)}>
            Screen reader and keyboard guide
          </Link>
        </Row>
      </Section>

      <Row style={{ justifyContent: 'space-between' }}>
        <Button variant="tertiary" onClick={reset}>
          Reset to defaults
        </Button>
        <Button onClick={() => setPanelOpen(false)}>Done</Button>
      </Row>
    </Modal>
  );
};
