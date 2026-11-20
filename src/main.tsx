import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { App } from './app/App';
import { appRoutes } from './app/routes';
import { bootstrapFilmServices } from './app/bootstrap';

/** Placeholder until authentication exists */
const CURRENT_USER = 'You';

async function start() {
  const container = document.getElementById('root');
  if (!container) throw new Error('#root element missing from index.html');

  const { service, persistence } = await bootstrapFilmServices({ currentUser: CURRENT_USER });
  window.addEventListener('pagehide', () => void persistence.flush());

  const router = createBrowserRouter(appRoutes);
  createRoot(container).render(
    <StrictMode>
      <App service={service} router={router} currentUser={CURRENT_USER} />
    </StrictMode>
  );
}

void start();
