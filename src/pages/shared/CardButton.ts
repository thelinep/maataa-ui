import styled from 'styled-components';
import { colorTokens } from '@/design-system/theme-colors';

/**
 * The title of a clickable card, as a real button that covers the whole
 * card (via ::after). Its accessible name is exactly the visible title, so
 * screen readers announce "<title>, button" with the card's details as the
 * description, and voice control ("click <title>") works (WCAG 2.5.3).
 * The card needs `position: relative`.
 */
export const CardButton = styled.button`
  all: unset;
  cursor: pointer;
  color: inherit;
  font: inherit;
  text-align: left;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  /* Draw the focus ring around the whole card, not just the title */
  &&:focus-visible {
    outline: none !important;
  }
  &&:focus-visible::after {
    outline: 2px solid var(--a11y-focus, #1e3a5f);
    outline-offset: 2px;
  }
  html[data-a11y-focus='strong'] &&:focus-visible::after {
    outline-width: 3px;
  }
`;

/** Shared extra card styles: position for the stretched button, focus highlight. */
export const clickableCard = `
  position: relative;
  &:focus-within {
    border-color: ${colorTokens.primary.main};
  }
`;
