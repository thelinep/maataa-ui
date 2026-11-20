import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  status: 'success' | 'error';
}

interface AuditLogProps {
  entries: AuditEntry[];
}

const StyledContainer = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
`;

const StyledHeader = styled.div`
  padding: ${spacing.lg};
  border-bottom: 2px solid ${colorTokens.border.primary};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const StyledRow = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid ${colorTokens.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

const StyledStatusBadge = styled.span<{ status: 'success' | 'error' }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  background: ${props => props.status === 'success' ? colorTokens.interactive.success : colorTokens.interactive.error};
  color: white;
`;

export const AuditLog: React.FC<AuditLogProps> = ({ entries }) => {
  return (
    <StyledContainer>
      <StyledHeader>Audit Log</StyledHeader>
      {entries.map(entry => (
        <StyledRow key={entry.id}>
          <div style={{ flex: 1 }}>
            <div style={{ color: colorTokens.text.primary, fontWeight: 500 }}>
              {entry.action} - {entry.resource}
            </div>
            <div style={{ color: colorTokens.text.secondary, fontSize: '11px' }}>
              {entry.user} • {new Date(entry.timestamp).toLocaleString()}
            </div>
          </div>
          <StyledStatusBadge status={entry.status}>
            {entry.status.toUpperCase()}
          </StyledStatusBadge>
        </StyledRow>
      ))}
    </StyledContainer>
  );
};
