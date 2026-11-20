/**
 * Name recorded as author/editor on new script versions, drafts, etc.
 * Placeholder until authentication exists.
 */

import React, { createContext, useContext } from 'react';

const CurrentUserContext = createContext<string>('You');

export const CurrentUserProvider: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => (
  <CurrentUserContext.Provider value={name}>{children}</CurrentUserContext.Provider>
);

export function useCurrentUser(): string {
  return useContext(CurrentUserContext);
}
