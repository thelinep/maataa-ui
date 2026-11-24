/**
 * Catches render errors (and lazy-route chunks that fail to load) for one
 * routed page, so the rest of the app keeps working. Uses @maataa/ui's
 * ErrorBoundary; the boundary resets when the route changes.
 */
import React from 'react';
import { useLocation } from 'react-router';
import { ErrorBoundary } from '@maataa/ui/surfaces';

export function reportRenderError(error: Error, path: string): void {
  if (typeof window !== 'undefined' && window.__analyticsQueue) {
    window.__analyticsQueue.push({ event: 'render_error', message: error.message, path });
  }
}

export const RouteErrorBoundary: React.FC<{ region?: string; children: React.ReactNode }> = ({
  region = 'This page',
  children,
}) => {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary key={pathname} region={region} onError={(error) => reportRenderError(error, pathname)}>
      {children}
    </ErrorBoundary>
  );
};
