import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface ScheduledReport {
  id: string;
  name: string;
  schedule: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'pdf' | 'csv' | 'excel';
  lastRun?: string;
  nextRun: string;
  enabled: boolean;
}

interface ScheduledReportsProps {
  reports: ScheduledReport[];
  onToggle?: (reportId: string, enabled: boolean) => void;
  onDelete?: (reportId: string) => void;
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const StyledCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled.h4`
  margin: 0;
  color: ${colorTokens.text.primary};
  font-size: 16px;
`;

const StyledBadge = styled.span<{ schedule: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.schedule) {
      case 'daily': return colorTokens.interactive.primary;
      case 'weekly': return colorTokens.interactive.info;
      case 'monthly': return colorTokens.interactive.warning;
      default: return colorTokens.text.secondary;
    }
  }};
  color: white;
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid ${colorTokens.border.primary};
  font-size: 12px;
  color: ${colorTokens.text.secondary};
`;

export const ScheduledReports: React.FC<ScheduledReportsProps> = ({
  reports,
  onToggle,
  onDelete
}) => {
  if (reports.length === 0) {
    return (
      <div style={{ color: colorTokens.text.secondary, textAlign: 'center', padding: spacing.lg }}>
        No scheduled reports
      </div>
    );
  }

  return (
    <StyledContainer>
      {reports.map(report => (
        <StyledCard key={report.id}>
          <StyledHeader>
            <div>
              <StyledTitle>{report.name}</StyledTitle>
              <div style={{ fontSize: '12px', color: colorTokens.text.secondary }}>
                Recipients: {report.recipients.join(', ')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
              <StyledBadge schedule={report.schedule}>
                {report.schedule.charAt(0).toUpperCase() + report.schedule.slice(1)}
              </StyledBadge>
              <input
                type="checkbox"
                checked={report.enabled}
                onChange={e => onToggle?.(report.id, e.target.checked)}
              />
            </div>
          </StyledHeader>

          <StyledFooter>
            <div>
              Next run: {new Date(report.nextRun).toLocaleDateString()}
            </div>
            <button
              onClick={() => onDelete?.(report.id)}
              style={{
                background: 'none',
                border: 'none',
                color: colorTokens.interactive.error,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Delete
            </button>
          </StyledFooter>
        </StyledCard>
      ))}
    </StyledContainer>
  );
};
