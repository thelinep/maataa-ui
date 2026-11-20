/**
 * Makes client-side navigation perceivable (WCAG 2.4.2, 2.4.3, 4.1.3):
 * - every page gets its own title from its h1 ("Screenings – MAATAA");
 * - after navigating, focus moves to the new page's h1, so screen readers
 *   read where you are and the next Tab starts in the content;
 * - without an h1, the title is announced through a polite live region.
 * Focus is left alone when it is already inside the page content or a
 * dialog, so in-page focus management (forms, dialogs) wins.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

export const APP_NAME = 'MAATAA';

/** Heading text without emoji, for titles and announcements. */
export function cleanHeading(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}️?/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function titleFor(heading: string | null | undefined): string {
  const h = heading ? cleanHeading(heading) : '';
  return h ? `${h} – ${APP_NAME}` : `${APP_NAME} Film Production`;
}

function findHeading(): HTMLElement | null {
  return document.querySelector<HTMLElement>('main h1');
}

function focusIsSettled(): boolean {
  const active = document.activeElement;
  if (!active || active === document.body) return false;
  if (active.closest('[role="dialog"]')) return true;
  return Boolean(active.closest('main'));
}

export const RouteAnnouncer: React.FC<{ waitMs?: number }> = ({ waitMs = 2000 }) => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const firstRender = useRef(true);

  useEffect(() => {
    const isFirst = firstRender.current;
    firstRender.current = false;
    let cancelled = false;
    const started = Date.now();

    // Pages load lazily, so wait for the new h1 to appear.
    const settle = () => {
      if (cancelled) return;
      const h1 = findHeading();
      if (!h1 && Date.now() - started < waitMs) {
        window.setTimeout(settle, 50);
        return;
      }
      const title = titleFor(h1?.textContent);
      document.title = title;
      if (isFirst) return; // never steal focus on the first page load
      if (h1 && !focusIsSettled()) {
        if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
        h1.focus({ preventScroll: false });
      } else if (!h1) {
        setMessage(`${title} loaded`);
      }
    };
    settle();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, waitMs]);

  return (
    <div className="a11y-sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
};
