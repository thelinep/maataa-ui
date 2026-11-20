/**
 * People who can be assigned to projects, teams and budgets.
 * Sample directory until a people workflow exists.
 */

import { withAvatars } from '@/components/people/InitialsAvatar';

export const PEOPLE = [
  { label: 'Alice Johnson', value: 'user-001' },
  { label: 'Bob Smith', value: 'user-002' },
  { label: 'Carol Williams', value: 'user-003' },
  { label: 'David Brown', value: 'user-004' },
  { label: 'Eve Davis', value: 'user-005' },
];

export const PEOPLE_OPTIONS = withAvatars(PEOPLE);

/** Display name for a person id; unknown ids are shown as given. */
export function personName(id: string | undefined): string {
  if (!id) return '';
  return PEOPLE.find((p) => p.value === id)?.label ?? id;
}

export function peopleNames(ids: string[] | undefined): string {
  return (ids ?? []).map(personName).join(', ');
}
