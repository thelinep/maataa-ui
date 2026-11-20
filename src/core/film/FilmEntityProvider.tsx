/**
 * React binding for the FilmEntityService.
 *
 * Wrap the app (or a test) in <FilmEntityProvider service={...}> to choose the
 * backing store; without a provider the seeded default service is used.
 */

import React, { createContext, useContext } from 'react';
import { FilmEntityService, getDefaultFilmEntityService } from './FilmEntityService';

const FilmEntityContext = createContext<FilmEntityService | null>(null);

export interface FilmEntityProviderProps {
  service?: FilmEntityService;
  children: React.ReactNode;
}

export const FilmEntityProvider: React.FC<FilmEntityProviderProps> = ({ service, children }) => (
  <FilmEntityContext.Provider value={service ?? getDefaultFilmEntityService()}>{children}</FilmEntityContext.Provider>
);

export function useFilmEntityService(): FilmEntityService {
  return useContext(FilmEntityContext) ?? getDefaultFilmEntityService();
}

export default FilmEntityProvider;
