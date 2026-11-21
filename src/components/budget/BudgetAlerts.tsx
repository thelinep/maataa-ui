/**
 * BudgetAlerts - Spending threshold alerts
 * 
 * Configure and display spending alerts based on budget thresholds
 * Integrates with Phase 5 activity stream for real-time notifications
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface SpendingAlert {
  id: string;
  type: 'threshold' | 'daily-limit' | 'category-limit';
  triggerValue: number; // percentage or amount
  isActive: boolean;
  notificationChannels: ('email' | 'in-app' | 'slack')[];
  createdAt: number;
}

export interface BudgetAlertsProps {
  budgetId: string;
  allocated: number;
  spent: number;
  alerts: SpendingAlert[];
  currency?: string;
  onAddAlert?: (alert: SpendingAlert) => void;
  onUpdateAlert?: (alert: SpendingAlert) => void;
  onDeleteAlert?: (alertId: string) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const AlertItem = styled.div<{ $type?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  border-left: 4px solid ${(props) => {
    switch (props.$type) {
      case 'threshold':
        return colorTokens.interactive.warning;
      case 'daily-limit':
        return colorTokens.interactive.info;
      case 'category-limit':
        return colorTokens.interactive.secondary;
      default:
        return colorTokens.border.primary;
    }
  }};
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || spacing.sm};
  flex: 1;
`;

const AlertTitle = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const AlertDescription = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const AlertChannels = styled.div`
  display: flex;
  gap: ${spacing.xs || `${spacing.sm}`.replace('16px', '8px')};
  margin-top: ${spacing.sm};
`;

const Channel = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${(props: any) => `${props.color}20`};
  color: ${(props: any) => props.color};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const AlertActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const Toggle = styled.input`
  width: 40px;
  height: 24px;
  cursor: pointer;
`;

const EmptyState = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${colorTokens.text.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Label = styled.label`
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const Select = styled.select`
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.sm};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
`;

const Input = styled.input`
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.sm};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

const Checkbox = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
  font-size: ${typography.bodySmall.fontSize};
`;

/**
 * Alert type descriptions
 */
const ALERT_TYPES = {
  threshold: {
    label: 'Budget Threshold',
    description: 'Alert when spending reaches % of budget',
    icon: '📊',
  },
  'daily-limit': {
    label: 'Daily Limit',
    description: 'Alert when daily spending exceeds amount',
    icon: '📅',
  },
  'category-limit': {
    label: 'Category Limit',
    description: 'Alert when category spending exceeds limit',
    icon: '🏷️',
  },
};

const CHANNEL_COLORS = {
  'email': colorTokens.interactive.info,
  'in-app': colorTokens.interactive.success,
  'slack': colorTokens.interactive.warning,
};

/**
 * BudgetAlerts Component
 * 
 * @example
 * <BudgetAlerts
 *   budgetId="budget-123"
 *   allocated={50000}
 *   spent={12500}
 *   alerts={alerts}
 *   onAddAlert={handleAdd}
 * />
 */
export const BudgetAlerts: React.FC<BudgetAlertsProps> = ({
  alerts,
  currency = 'USD',
  onAddAlert,
  onUpdateAlert,
  onDeleteAlert,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SpendingAlert>>({
    type: 'threshold',
    triggerValue: 75,
    notificationChannels: ['in-app', 'email'],
  });

  const handleAddAlert = useCallback(() => {
    if (formData.type && formData.triggerValue !== undefined) {
      const newAlert: SpendingAlert = {
        id: `alert-${Date.now()}`,
        type: formData.type as any,
        triggerValue: formData.triggerValue,
        isActive: true,
        notificationChannels: formData.notificationChannels || ['in-app'],
        createdAt: Date.now(),
      };
      onAddAlert?.(newAlert);
      setFormData({ type: 'threshold', triggerValue: 75, notificationChannels: ['in-app', 'email'] });
      setShowForm(false);
    }
  }, [formData, onAddAlert]);

  const handleToggleAlert = (alert: SpendingAlert) => {
    onUpdateAlert?.({ ...alert, isActive: !alert.isActive });
  };

  return (
    <Container>
      <Header>
        <Title><span aria-hidden="true">🔔 </span>Spending Alerts</Title>
        {!showForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            + Add Alert
          </Button>
        )}
      </Header>

      {showForm && (
        <Form>
          <FormControl style={{ gridColumn: '1 / -1' }}>
            <Label>Alert Type</Label>
            <Select
              value={formData.type || 'threshold'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              {Object.entries(ALERT_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Label>Trigger Value</Label>
            <Input
              type="number"
              placeholder="e.g., 75 for 75%"
              value={formData.triggerValue || ''}
              onChange={(e) => setFormData({ ...formData, triggerValue: parseFloat(e.target.value) })}
            />
          </FormControl>

          <FormControl style={{ gridColumn: '1 / -1' }}>
            <Label>Notify via</Label>
            <CheckboxGroup>
              {(['email', 'in-app', 'slack'] as const).map((channel) => (
                <CheckboxLabel key={channel}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.notificationChannels?.includes(channel) || false}
                    onChange={(e) => {
                      const channels = formData.notificationChannels || [];
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          notificationChannels: [...channels, channel],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          notificationChannels: channels.filter((c) => c !== channel),
                        });
                      }
                    }}
                  />
                  {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </FormControl>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: spacing.sm }}>
            <Button variant="primary" size="sm" onClick={handleAddAlert}>
              Create Alert
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setFormData({ type: 'threshold', triggerValue: 75, notificationChannels: ['in-app', 'email'] });
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}

      {alerts.length === 0 ? (
        <EmptyState>
          <p>No alerts configured. Create one to stay informed about your spending.</p>
        </EmptyState>
      ) : (
        <AlertsList>
          {alerts.map((alert) => {
            const typeInfo = ALERT_TYPES[alert.type as keyof typeof ALERT_TYPES];
            return (
              <AlertItem key={alert.id} $type={alert.type}>
                <AlertContent>
                  <AlertTitle>
                    {typeInfo.icon} {typeInfo.label} - {alert.triggerValue}
                    {alert.type === 'threshold' ? '%' : ` ${currency}`}
                  </AlertTitle>
                  <AlertDescription>{typeInfo.description}</AlertDescription>
                  <AlertChannels>
                    {alert.notificationChannels.map((channel) => (
                      <Channel
                        key={channel}
                        color={CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]}
                      >
                        {channel}
                      </Channel>
                    ))}
                  </AlertChannels>
                </AlertContent>
                <AlertActions>
                  <Toggle
                    type="checkbox"
                    checked={alert.isActive}
                    onChange={() => handleToggleAlert(alert)}
                    title={alert.isActive ? 'Disable' : 'Enable'}
                  />
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => onDeleteAlert?.(alert.id)}
                  >
                    ✕
                  </Button>
                </AlertActions>
              </AlertItem>
            );
          })}
        </AlertsList>
      )}
    </Container>
  );
};

export default BudgetAlerts;
