/**
 * Root component: data layer + current user + router.
 */

import React from 'react';
import { RouterProvider, type createBrowserRouter } from 'react-router';
import { FilmEntityProvider, type FilmEntityService } from '@/core/film';
import { CurrentUserProvider } from './CurrentUser';

export interface AppProps {
  service: FilmEntityService;
  router: ReturnType<typeof createBrowserRouter>;
  currentUser?: string;
}

export const App: React.FC<AppProps> = ({ service, router, currentUser = 'You' }) => (
  <FilmEntityProvider service={service}>
    <CurrentUserProvider name={currentUser}>
      <RouterProvider router={router} />
    </CurrentUserProvider>
  </FilmEntityProvider>
);

export default App;
