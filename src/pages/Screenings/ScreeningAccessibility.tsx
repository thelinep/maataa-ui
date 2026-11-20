/**
 * Accessibility deliverables for a screening: captions (SDH), audio
 * description and a sign language interpreter track, plus what the venue
 * offers. Shown on the screening page; summarised as badges on the list.
 */

import React, { useEffect, useId, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';
import type {
  AccessibilityDeliverable,
  DeliverableStatus,
  ScreeningAccessibility,
  ScreeningVenueAccess,
} from '@/core/film/types';

export const DELIVERABLE_STATUSES: { value: DeliverableStatus; label: string }[] = [
  { value: 'not-started', label: 'Not started' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'not-needed', label: 'Not needed' },
];

export const DELIVERABLES = [
  { key: 'captions', label: 'Captions (SDH)', short: 'CC', help: 'Subtitles for deaf and hard-of-hearing viewers.' },
  { key: 'audioDescription', label: 'Audio description', short: 'AD', help: 'Narrated track for blind and low-vision viewers.' },
  { key: 'signLanguage', label: 'Sign language track', short: 'ISL', help: 'Interpreter shown picture-in-picture.' },
] as const;

type DeliverableKey = (typeof DELIVERABLES)[number]['key'];

export const VENUE_OPTIONS: { key: keyof ScreeningVenueAccess; label: string }[] = [
  { key: 'openCaptions', label: 'Captions on screen' },
  { key: 'liveInterpreter', label: 'Sign language interpreter present' },
  { key: 'audioDescriptionHeadsets', label: 'Audio description headsets' },
  { key: 'wheelchairAccess', label: 'Wheelchair access' },
  { key: 'hearingLoop', label: 'Hearing loop' },
  { key: 'relaxedScreening', label: 'Relaxed screening (lights up, lower volume)' },
];

export function emptyAccessibility(): ScreeningAccessibility {
  return {
    captions: { status: 'not-started' },
    audioDescription: { status: 'not-started' },
    signLanguage: { status: 'not-started', signLanguage: 'ISL' },
    venue: {
      openCaptions: false,
      liveInterpreter: false,
      audioDescriptionHeadsets: false,
      wheelchairAccess: false,
      hearingLoop: false,
      relaxedScreening: false,
    },
  };
}

export function statusLabel(status: DeliverableStatus): string {
  return DELIVERABLE_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/** Badges for the screening list: one per deliverable that is not "not needed". */
export function accessibilityBadges(a11y?: ScreeningAccessibility) {
  if (!a11y) return [];
  return DELIVERABLES.filter((d) => a11y[d.key].status !== 'not-needed').map((d) => ({
    key: d.key,
    short: d.key === 'signLanguage' ? a11y.signLanguage.signLanguage || 'Sign' : d.short,
    status: a11y[d.key].status,
    text: `${d.label}: ${statusLabel(a11y[d.key].status)}`,
  }));
}

const STATUS_STYLE: Record<DeliverableStatus, { bg: string; fg: string; border: string }> = {
  'not-started': { bg: '#ffffff', fg: '#3d3d3d', border: '#6b6b6b' },
  'in-progress': { bg: '#fff4d6', fg: '#5c3d00', border: '#8a5a00' },
  delivered: { bg: '#e3f4e8', fg: '#14532d', border: '#1e7a3d' },
  'not-needed': { bg: '#f1f1f1', fg: '#3d3d3d', border: '#9a9a9a' },
};

export const DeliverableBadge = styled.span<{ $status: DeliverableStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid ${(p) => STATUS_STYLE[p.$status].border};
  border-radius: 999px;
  background: ${(p) => STATUS_STYLE[p.$status].bg};
  color: ${(p) => STATUS_STYLE[p.$status].fg};
  font-size: 0.8rem;
  font-weight: 600;
`;

const STATUS_MARK: Record<DeliverableStatus, string> = {
  'not-started': '○',
  'in-progress': '◐',
  delivered: '●',
  'not-needed': '–',
};

/** Compact badge row for list cards. The visible text is short; the full status is in sr text. */
export const AccessibilityBadges: React.FC<{ accessibility?: ScreeningAccessibility }> = ({ accessibility }) => {
  const badges = accessibilityBadges(accessibility);
  if (badges.length === 0) return null;
  return (
    <BadgeRow>
      {badges.map((b) => (
        <li key={b.key}>
          <DeliverableBadge $status={b.status} title={b.text}>
            <span aria-hidden="true">
              {STATUS_MARK[b.status]} {b.short}
            </span>
            <span className="a11y-sr-only">{b.text}</span>
          </DeliverableBadge>
        </li>
      ))}
    </BadgeRow>
  );
};

const BadgeRow = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs};
  list-style: none;
  margin: 0;
  padding: 0;
`;

// ---------------------------------------------------------------------------
// Editor section
// ---------------------------------------------------------------------------

const Section = styled.section`
  margin-top: ${spacing.xl};
  padding: ${spacing.lg};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  background: ${colorTokens.background.primary};

  h2 {
    margin: 0 0 ${spacing.xs};
    font-size: ${typography.heading3.fontSize};
  }
  fieldset {
    margin: ${spacing.md} 0 0;
    padding: ${spacing.md};
    border: 1px solid ${colorTokens.border.primary};
    border-radius: 6px;
  }
  legend {
    padding: 0 ${spacing.xs};
    font-weight: 600;
  }
  label {
    display: block;
    font-size: ${typography.bodySmall.fontSize};
    font-weight: 600;
    margin-bottom: 2px;
  }
  input[type='text'],
  select {
    min-height: 36px;
    width: 100%;
    max-width: 320px;
    padding: 4px 8px;
    border: 1px solid #6b6b6b;
    border-radius: 6px;
    font: inherit;
    background: ${colorTokens.background.primary};
    color: ${colorTokens.text.primary};
  }
  input:focus-visible,
  select:focus-visible,
  button:focus-visible {
    outline: 2px solid ${colorTokens.text.primary};
    outline-offset: 2px;
  }
`;

const Intro = styled.p`
  margin: 0;
  color: ${colorTokens.text.primary};
  font-size: ${typography.bodySmall.fontSize};
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};
`;

const Hint = styled.p`
  margin: 0 0 ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};
`;

const CheckList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing.sm};
  list-style: none;
  margin: 0;
  padding: 0;

  label {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    min-height: 32px;
    font-weight: 400;
    font-size: ${typography.body.fontSize};
  }
  input {
    width: 20px;
    height: 20px;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};

  button {
    min-height: 40px;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: ${colorTokens.primary.dark};
    color: #ffffff;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const listToText = (list?: string[]) => (list ?? []).join(', ');
const textToList = (text: string) =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export interface ScreeningAccessibilitySectionProps {
  accessibility?: ScreeningAccessibility;
  onSave: (next: ScreeningAccessibility) => Promise<unknown>;
}

export const ScreeningAccessibilitySection: React.FC<ScreeningAccessibilitySectionProps> = ({
  accessibility,
  onSave,
}) => {
  const id = useId();
  const [draft, setDraft] = useState<ScreeningAccessibility>(() => accessibility ?? emptyAccessibility());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setDraft(accessibility ?? emptyAccessibility());
  }, [accessibility]);

  const setDeliverable = (key: DeliverableKey, patch: Partial<AccessibilityDeliverable> & Record<string, unknown>) => {
    setDraft((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
    setMessage(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await onSave(draft);
      setMessage({ kind: 'ok', text: 'Accessibility details saved.' });
    } catch (err) {
      setMessage({ kind: 'error', text: `Could not save: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Accessibility</h2>
      <Intro>Track the film&apos;s accessible versions and what this venue offers.</Intro>
      <form onSubmit={save} noValidate>
        {DELIVERABLES.map((d) => {
          const value = draft[d.key];
          const fid = `${id}-${d.key}`;
          return (
            <fieldset key={d.key}>
              <legend>{d.label}</legend>
              <Hint id={`${fid}-hint`}>{d.help}</Hint>
              <Fields>
                <div>
                  <label htmlFor={`${fid}-status`}>Status</label>
                  <select
                    id={`${fid}-status`}
                    aria-describedby={`${fid}-hint`}
                    value={value.status}
                    onChange={(e) => setDeliverable(d.key, { status: e.target.value as DeliverableStatus })}
                  >
                    {DELIVERABLE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${fid}-owner`}>Owner or vendor</label>
                  <input
                    id={`${fid}-owner`}
                    type="text"
                    value={value.owner ?? ''}
                    onChange={(e) => setDeliverable(d.key, { owner: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor={`${fid}-langs`}>Languages (comma separated)</label>
                  <input
                    id={`${fid}-langs`}
                    type="text"
                    value={listToText(value.languages)}
                    onChange={(e) => setDeliverable(d.key, { languages: textToList(e.target.value) })}
                  />
                </div>
                {d.key === 'signLanguage' && (
                  <>
                    <div>
                      <label htmlFor={`${fid}-sl`}>Sign language</label>
                      <input
                        id={`${fid}-sl`}
                        type="text"
                        value={draft.signLanguage.signLanguage ?? ''}
                        onChange={(e) => setDeliverable('signLanguage', { signLanguage: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${fid}-interp`}>Interpreter</label>
                      <input
                        id={`${fid}-interp`}
                        type="text"
                        value={draft.signLanguage.interpreter ?? ''}
                        onChange={(e) => setDeliverable('signLanguage', { interpreter: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </Fields>
            </fieldset>
          );
        })}

        <fieldset>
          <legend>At the venue</legend>
          <CheckList>
            {VENUE_OPTIONS.map((o) => (
              <li key={o.key}>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.venue[o.key]}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setDraft((d) => ({ ...d, venue: { ...d.venue, [o.key]: checked } }));
                      setMessage(null);
                    }}
                  />
                  {o.label}
                </label>
              </li>
            ))}
          </CheckList>
        </fieldset>

        <Footer>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save accessibility details'}
          </button>
          <div role="status" aria-live="polite">
            {message?.kind === 'ok' ? message.text : ''}
          </div>
          <div role="alert">{message?.kind === 'error' ? message.text : ''}</div>
        </Footer>
      </form>
    </Section>
  );
};
