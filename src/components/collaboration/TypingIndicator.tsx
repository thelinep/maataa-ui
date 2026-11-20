/**
 * TypingIndicator - Shows who is typing in a real-time collaboration session.
 *
 * Renders nothing when nobody is typing. Announced politely to screen readers.
 */

import styled, { keyframes } from 'styled-components';
import { colorTokens, spacing, typography } from '@/utils/tokens';

export interface TypingIndicatorProps {
  /** Names of the people currently typing */
  typists: string[];
  /** compact: dots + short label; full: dots + every name */
  variant?: 'compact' | 'full';
}

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-3px); opacity: 1; }
`;

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm};
  font-family: ${typography.bodySmall.fontFamily};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const Dots = styled.span`
  display: inline-flex;
  gap: 3px;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${colorTokens.interactive.primary};
    animation: ${bounce} 1.2s infinite ease-in-out;
  }

  span:nth-child(2) {
    animation-delay: 0.15s;
  }

  span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @media (prefers-reduced-motion: reduce) {
    span {
      animation: none;
      opacity: 0.8;
    }
  }
`;

/** "Alice is typing", "Alice and Bob are typing", "Alice and 2 others are typing" */
export function describeTypists(typists: string[], variant: 'compact' | 'full' = 'compact'): string {
  if (typists.length === 0) return '';
  if (typists.length === 1) return `${typists[0]} is typing`;
  if (variant === 'full') {
    const names = typists.slice(0, -1).join(', ') + ' and ' + typists[typists.length - 1];
    return `${names} are typing`;
  }
  if (typists.length === 2) return `${typists[0]} and ${typists[1]} are typing`;
  return `${typists[0]} and ${typists.length - 1} others are typing`;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typists, variant = 'compact' }) => {
  if (typists.length === 0) return null;
  const label = describeTypists(typists, variant);

  return (
    <Container role="status" aria-live="polite">
      <Dots aria-hidden="true">
        <span />
        <span />
        <span />
      </Dots>
      <span>{label}…</span>
    </Container>
  );
};

export default TypingIndicator;
