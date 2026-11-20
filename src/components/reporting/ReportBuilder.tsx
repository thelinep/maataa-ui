import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface ReportConfig {
  title: string;
  template: string;
  dateRange: { start: string; end: string };
  metrics: string[];
  format: 'pdf' | 'csv' | 'excel';
}

interface ReportBuilderProps {
  onGenerate?: (config: ReportConfig) => void;
}

const StyledContainer = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  max-width: 600px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const StyledLabel = styled.label`
  color: ${colorTokens.text.primary};
  font-weight: 600;
  font-size: 14px;
`;

const StyledInput = styled.input`
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};

  &:focus {
    outline: none;
    border-color: ${colorTokens.interactive.primary};
  }
`;

const StyledSelect = styled.select`
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};

  &:focus {
    outline: none;
    border-color: ${colorTokens.interactive.primary};
  }
`;

const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const StyledButton = styled.button`
  background: ${colorTokens.interactive.primary};
  color: white;
  border: none;
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  margin-top: ${spacing.lg};
`;

const templates = [
  { value: 'sales', label: 'Sales Summary' },
  { value: 'budget', label: 'Budget Report' },
  { value: 'team', label: 'Team Performance' },
  { value: 'custom', label: 'Custom Report' },
];

const metrics = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'users', label: 'User Count' },
  { value: 'orders', label: 'Orders' },
  { value: 'growth', label: 'Growth Rate' },
];

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ onGenerate }) => {
  const [config, setConfig] = useState<Partial<ReportConfig>>({
    format: 'pdf',
    metrics: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.title && config.template && config.dateRange && config.format) {
      onGenerate?.(config as ReportConfig);
    }
  };

  return (
    <StyledContainer>
      <h2 style={{ marginTop: 0, color: colorTokens.text.primary }}>Generate Report</h2>
      
      <StyledForm onSubmit={handleSubmit}>
        <StyledField>
          <StyledLabel>Report Title</StyledLabel>
          <StyledInput
            type="text"
            value={config.title || ''}
            onChange={e => setConfig({ ...config, title: e.target.value })}
            placeholder="Enter report title"
            required
          />
        </StyledField>

        <StyledField>
          <StyledLabel>Template</StyledLabel>
          <StyledSelect
            value={config.template || ''}
            onChange={e => setConfig({ ...config, template: e.target.value })}
            required
          >
            <option value="">Select a template</option>
            {templates.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </StyledSelect>
        </StyledField>

        <StyledField>
          <StyledLabel>Metrics to Include</StyledLabel>
          <StyledCheckboxGroup>
            {metrics.map(m => (
              <label key={m.value} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <input
                  type="checkbox"
                  checked={(config.metrics || []).includes(m.value)}
                  onChange={e => {
                    const newMetrics = e.target.checked
                      ? [...(config.metrics || []), m.value]
                      : (config.metrics || []).filter(x => x !== m.value);
                    setConfig({ ...config, metrics: newMetrics });
                  }}
                />
                {m.label}
              </label>
            ))}
          </StyledCheckboxGroup>
        </StyledField>

        <StyledField>
          <StyledLabel>Format</StyledLabel>
          <StyledSelect
            value={config.format || 'pdf'}
            onChange={e => setConfig({ ...config, format: e.target.value as any })}
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </StyledSelect>
        </StyledField>

        <StyledButton type="submit">Generate Report</StyledButton>
      </StyledForm>
    </StyledContainer>
  );
};
