import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface ChartData {
  label: string;
  value: number;
}

interface ChartWidgetProps {
  title: string;
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
}

const StyledContainer = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
`;

const StyledTitle = styled.h3`
  margin: 0 0 ${spacing.lg} 0;
  color: ${colorTokens.text.primary};
  font-size: 16px;
`;

const StyledBarChart = styled.div<{ $height: number }>`
  display: flex;
  align-items: flex-end;
  gap: ${spacing.md};
  height: ${props => props.$height}px;
`;

const StyledBar = styled.div<{ height: number; color: string }>`
  flex: 1;
  background: ${props => props.color};
  border-radius: ${borderRadius.md};
  position: relative;
  height: ${props => props.height}%;
  min-height: 20px;

  &:hover::after {
    content: attr(data-value);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${colorTokens.text.primary};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const StyledLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
  font-size: 12px;
`;

const StyledLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  color: ${colorTokens.text.secondary};

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
`;

const colors = [
  colorTokens.interactive.primary,
  colorTokens.interactive.success,
  colorTokens.interactive.warning,
  colorTokens.interactive.error,
  colorTokens.interactive.info,
];

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  data,
  type = 'bar',
  height = 200
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  if (type === 'bar') {
    return (
      <StyledContainer>
        <StyledTitle>{title}</StyledTitle>
        <StyledBarChart $height={height}>
          {data.map((item, index) => (
            <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <StyledBar
                height={(item.value / maxValue) * 100}
                color={colors[index % colors.length]}
                data-value={item.value}
              />
              <div style={{ fontSize: '11px', marginTop: spacing.sm, color: colorTokens.text.secondary }}>
                {item.label}
              </div>
            </div>
          ))}
        </StyledBarChart>
        <StyledLegend>
          {data.map((item, index) => (
            <StyledLegendItem key={item.label}>
              <div className="dot" style={{ background: colors[index % colors.length] }} />
              <span>{item.label}: {item.value}</span>
            </StyledLegendItem>
          ))}
        </StyledLegend>
      </StyledContainer>
    );
  }

  return <StyledContainer><StyledTitle>{title}</StyledTitle></StyledContainer>;
};
