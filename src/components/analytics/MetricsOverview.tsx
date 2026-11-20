import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface Metric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercent?: number;
  color?: string;
}

interface MetricsOverviewProps {
  metrics: Metric[];
  columns?: number;
}

const StyledContainer = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${spacing.lg};
`;

const StyledCard = styled.div<{ color?: string }>`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  border-top: 3px solid ${props => props.color || colorTokens.interactive.primary};
`;

const StyledLabel = styled.div`
  color: ${colorTokens.text.secondary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: ${spacing.sm};
`;

const StyledValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${colorTokens.text.primary};
  line-height: 1;
`;

const StyledTrend = styled.div<{ trend?: string }>`
  margin-top: ${spacing.md};
  font-size: 12px;
  color: ${props => {
    switch (props.trend) {
      case 'up': return colorTokens.interactive.success;
      case 'down': return colorTokens.interactive.error;
      default: return colorTokens.text.secondary;
    }
  }};
`;

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  columns = 4
}) => {
  return (
    <StyledContainer columns={columns}>
      {metrics.map(metric => (
        <StyledCard key={metric.id} color={metric.color}>
          <StyledLabel>{metric.label}</StyledLabel>
          <StyledValue>
            {metric.value}
            {metric.unit && <span style={{ fontSize: '14px', marginLeft: '4px' }}>{metric.unit}</span>}
          </StyledValue>
          {metric.trend && metric.trendPercent !== undefined && (
            <StyledTrend trend={metric.trend}>
              {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.trendPercent)}%
            </StyledTrend>
          )}
        </StyledCard>
      ))}
    </StyledContainer>
  );
};
