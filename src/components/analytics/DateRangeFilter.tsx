import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

interface DateRangeFilterProps {
  onFilterChange?: (startDate: string, endDate: string) => void;
}

const StyledContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
`;

const StyledInput = styled.input`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${colorTokens.interactive.primary};
  }
`;

const StyledLabel = styled.label`
  color: ${colorTokens.text.secondary};
  font-size: 12px;
  font-weight: 600;
`;

const StyledButton = styled.button`
  background: ${colorTokens.interactive.primary};
  color: white;
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  font-weight: 600;
`;

const presets = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    onFilterChange?.(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
        {presets.map(preset => (
          <StyledButton key={preset.label} onClick={() => handlePreset(preset.days)}>
            {preset.label}
          </StyledButton>
        ))}
      </div>
      
      <StyledContainer>
        <div>
          <StyledLabel>From</StyledLabel>
          <StyledInput
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <StyledLabel>To</StyledLabel>
          <StyledInput
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <StyledButton onClick={() => onFilterChange?.(startDate, endDate)}>
          Apply
        </StyledButton>
      </StyledContainer>
    </div>
  );
};
