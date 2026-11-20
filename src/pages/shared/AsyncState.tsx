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

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <StateBox role="status" aria-live="polite">
    {label}
  </StateBox>
);

export const ErrorState: React.FC<{ error: Error }> = ({ error }) => (
  <ErrorBox role="alert">Something went wrong: {error.message}</ErrorBox>
);

export const NotFoundState: React.FC<{ label: string }> = ({ label }) => <StateBox role="status">{label}</StateBox>;
