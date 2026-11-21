import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, borderRadius } from '@/utils/tokens';

export interface SystemSetting {
  id: string;
  label: string;
  value: string | boolean;
  type: 'text' | 'toggle' | 'select';
  options?: { label: string; value: string }[];
}

interface SystemSettingsProps {
  settings: SystemSetting[];
  onSave?: (settings: SystemSetting[]) => void;
}

const StyledContainer = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
`;

const StyledSetting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colorTokens.border.primary};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledLabel = styled.label`
  color: ${colorTokens.text.primary};
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.md};
`;

const StyledSelect = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.md};
`;

const StyledButton = styled.button`
  background: ${colorTokens.interactive.primary};
  color: white;
  border: none;
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  margin-top: ${spacing.lg};
  font-weight: 600;
`;

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings: initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState(initialSettings);

  const handleChange = (id: string, value: any) => {
    setSettings(settings.map(s => s.id === id ? { ...s, value } : s));
  };

  return (
    <StyledContainer>
      <h2 style={{ marginTop: 0, color: colorTokens.text.primary }}>System Settings</h2>
      
      {settings.map(setting => (
        <StyledSetting key={setting.id}>
          <StyledLabel>{setting.label}</StyledLabel>
          
          {setting.type === 'toggle' && (
            <input
              type="checkbox"
              checked={typeof setting.value === 'boolean' ? setting.value : false}
              onChange={e => handleChange(setting.id, e.target.checked)}
            />
          )}
          
          {setting.type === 'text' && (
            <StyledInput
              type="text"
              value={typeof setting.value === 'string' ? setting.value : ''}
              onChange={e => handleChange(setting.id, e.target.value)}
            />
          )}
          
          {setting.type === 'select' && (
            <StyledSelect
              value={typeof setting.value === 'string' ? setting.value : ''}
              onChange={e => handleChange(setting.id, e.target.value)}
            >
              {setting.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </StyledSelect>
          )}
        </StyledSetting>
      ))}

      <StyledButton onClick={() => onSave?.(settings)}>
        Save Settings
      </StyledButton>
    </StyledContainer>
  );
};
