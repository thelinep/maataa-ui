/**
 * RouteErrorBoundary: a crashing page shows a recoverable message, the rest
 * of the shell stays usable, and navigating away clears the error.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, Link, Outlet, RouterProvider } from 'react-router';
import { RouteErrorBoundary } from '../RouteErrorBoundary';

function Broken(): never {
  throw new Error('Budget data was malformed');
}

function Shell() {
  return (
    <>
      <nav>
        <Link to="/ok">Go to OK page</Link>
      </nav>
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    </>
  );
}

afterEach(() => {
  delete window.__analyticsQueue;
  vi.restoreAllMocks();
});

describe('RouteErrorBoundary', () => {
  it('contains a crashing page, reports it, and resets on navigation', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.__analyticsQueue = [];
    const router = createMemoryRouter(
      [{ path: '/', element: <Shell />, children: [{ path: 'broken', element: <Broken /> }, { path: 'ok', element: <p>All good</p> }] }],
      { initialEntries: ['/broken'] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('alert')).toHaveTextContent("This page couldn't be shown.");
    expect(screen.getByRole('alert')).toHaveTextContent('The rest of the page still works');
    expect(window.__analyticsQueue).toEqual([
      { event: 'render_error', message: 'Budget data was malformed', path: '/broken' },
    ]);

    fireEvent.click(screen.getByRole('link', { name: 'Go to OK page' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
