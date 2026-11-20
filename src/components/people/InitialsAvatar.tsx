/**
 * InitialsAvatar: a small circle with a person's initials, for pickers and
 * lists that have no profile photo. Decorative: always pair it with the
 * person's name (as Select options and chips do).
 */
import type { ReactElement } from 'react';
import { colorTokens } from '@/utils/tokens';

// Dark fills that all keep white initials well above 4.5:1 contrast.
const FILLS = [
  colorTokens.interactive.info,
  colorTokens.interactive.success,
  colorTokens.interactive.error,
  colorTokens.text.primary,
];

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function fillFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return FILLS[hash % FILLS.length];
}

export interface InitialsAvatarProps {
  name: string;
}

/** Fills the box it is placed in (Select sizes the icon box per view). */
export function InitialsAvatar({ name }: InitialsAvatarProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: fillFor(name),
        color: '#FFFFFF',
        fontSize: '0.6em',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1,
      }}
    >
      {initialsOf(name)}
    </span>
  );
}

/** Adds an InitialsAvatar icon to each { label, value } person option. */
export function withAvatars<T extends { label: string; value: string }>(
  people: T[]
): Array<T & { icon: ReactElement }> {
  return people.map((person) => ({ ...person, icon: <InitialsAvatar name={person.label} /> }));
}
