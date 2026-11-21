/**
 * Shared loading / error / not-found states for Phase J pages.
 */

import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

const StateBox = styled.div`
  padding: ${spacing.xl};
  text-align: center;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
`;

const ErrorBox = styled(StateBox)`
  color: ${colorTokens.semantic.error};
  background: ${colorTokens.semantic.errorBg};
  border-radius: 8px;
`;

/**
 * `announce={false}` shows the text without a live region: for the brief
 * route-chunk fallback, which would otherwise be announced just before the
 * page's own "Loading …" message.
 */
export const LoadingState: React.FC<{ label?: string; announce?: boolean }> = ({
  label = 'Loading…',
  announce = true,
}) =>
  announce ? (
    <StateBox role="status" aria-live="polite">
      {label}
    </StateBox>
  ) : (
    <StateBox>{label}</StateBox>
  );

export const ErrorState: React.FC<{ error: Error }> = ({ error }) => (
  <ErrorBox role="alert">Something went wrong: {error.message}</ErrorBox>
);

export const NotFoundState: React.FC<{ label: string }> = ({ label }) => <StateBox role="status">{label}</StateBox>;
