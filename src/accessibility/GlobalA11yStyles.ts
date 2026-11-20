/**
 * Global CSS driven by the data attributes that applyPreferences() sets on
 * <html>. Inline styles from the design system lose to `!important` rules,
 * so these overrides reach every component without touching them.
 */

import { createGlobalStyle } from 'styled-components';

const HC = `html[data-a11y-contrast='high'], html[data-a11y-contrast='yellow-on-black']`;

export const GlobalA11yStyles = createGlobalStyle`
  /* ---- text size ---------------------------------------------------------
     Text size uses zoom on <html>, which does not rescale vh units. The
     design system's Modal caps itself at 90vh inline, so at 200% it would
     run off the screen with its buttons out of reach; divide by the zoom. */
  html[style*='--a11y-zoom'] [role='dialog'][aria-modal='true'] {
    max-height: calc(90vh / var(--a11y-zoom, 1)) !important;
  }

  /* ---- high contrast ---------------------------------------------------- */
  html[data-a11y-contrast='high'] {
    --a11y-fg: #000000;
    --a11y-bg: #ffffff;
    --a11y-link: #0000c8;      /* 11.7:1 on white */
    --a11y-sel-fg: #ffffff;
    --a11y-sel-bg: #000000;
    --a11y-focus: #0000c8;
  }
  html[data-a11y-contrast='yellow-on-black'] {
    --a11y-fg: #ffff00;        /* 19.6:1 on black */
    --a11y-bg: #000000;
    --a11y-link: #00ffff;      /* 16.7:1 on black */
    --a11y-sel-fg: #000000;
    --a11y-sel-bg: #ffff00;
    --a11y-focus: #00ffff;
  }
  :is(${HC}) body,
  :is(${HC}) body *:not(svg, svg *, img, video, canvas) {
    color: var(--a11y-fg) !important;
    background-color: var(--a11y-bg) !important;
    background-image: none !important;
    border-color: var(--a11y-fg) !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }
  :is(${HC}) a, :is(${HC}) a * {
    color: var(--a11y-link) !important;
    text-decoration: underline !important;
  }
  /* Selected / current items keep a visible state by inverting. */
  :is(${HC}) :is([aria-selected='true'], [aria-current='page'], [aria-pressed='true'], [aria-checked='true'], .active),
  :is(${HC}) :is([aria-selected='true'], [aria-current='page'], [aria-pressed='true'], [aria-checked='true'], .active) * {
    color: var(--a11y-sel-fg) !important;
    background-color: var(--a11y-sel-bg) !important;
  }
  :is(${HC}) :is(button, [role='button'], [role='combobox'], [role='tab'], input, select, textarea) {
    border: 2px solid var(--a11y-fg) !important;
  }
  :is(${HC}) ::placeholder { color: var(--a11y-fg) !important; opacity: 0.85; }
  :is(${HC}) :is([disabled], [aria-disabled='true']) { opacity: 0.7 !important; }
  :is(${HC}) svg :is(text) { fill: var(--a11y-fg) !important; }

  /* ---- motion ----------------------------------------------------------- */
  html[data-a11y-motion='reduce'] *,
  html[data-a11y-motion='reduce'] *::before,
  html[data-a11y-motion='reduce'] *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* ---- focus ------------------------------------------------------------ */
  html[data-a11y-focus='strong'] :focus-visible {
    outline: 3px solid var(--a11y-focus, #1e3a5f) !important;   /* 11.5:1 on the paper background */
    outline-offset: 2px !important;
    box-shadow: 0 0 0 6px var(--a11y-bg, #ffffff) !important;
  }

  /* ---- text spacing (WCAG 1.4.12 values) ---------------------------------- */
  html[data-a11y-spacing='wide'] body * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  html[data-a11y-spacing='wide'] p { margin-bottom: 2em !important; }

  /* ---- links ------------------------------------------------------------ */
  html[data-a11y-links='underline'] a { text-decoration: underline !important; }

  /* ---- utilities ---------------------------------------------------------- */
  .a11y-sr-only {
    position: absolute !important;
    width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }
`;
