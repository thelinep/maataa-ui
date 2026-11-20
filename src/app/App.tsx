/**
 * Root component: accessibility preferences + data layer + current user + router.
 */

import React from 'react';
import { RouterProvider, type createBrowserRouter } from 'react-router';
import { FilmEntityProvider, type FilmEntityService } from '@/core/film';
import { A11yPreferencesProvider } from '@/accessibility/preferences';
import { GlobalA11yStyles } from '@/accessibility/GlobalA11yStyles';
import { CurrentUserProvider } from './CurrentUser';

export interface AppProps {
  service: FilmEntityService;
  router: ReturnType<typeof createBrowserRouter>;
  currentUser?: string;
}

export const App: React.FC<AppProps> = ({ service, router, currentUser = 'You' }) => (
  <A11yPreferencesProvider>
    <GlobalA11yStyles />
    <FilmEntityProvider service={service}>
      <CurrentUserProvider name={currentUser}>
        <RouterProvider router={router} />
      </CurrentUserProvider>
    </FilmEntityProvider>
  </A11yPreferencesProvider>
);

export default App;
