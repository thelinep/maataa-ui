/**
 * BudgetForecast - Spending forecast & projection
 *
 * Shows projected spending trends and budget depletion timeline
 * Uses historical spending patterns to predict future costs
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface SpendingTrend {
  date: string;
  amount: number;
  category?: string;
}

export interface BudgetForecastProps {
  budgetName: string;
  allocated: number;
  spent: number;
  trends: SpendingTrend[];
  currency?: string;
  daysInBudgetPeriod?: number;
  currentDayOfPeriod?: number;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border-radius: ${borderRadius.sm};
  border: 1px solid ${colorTokens.border.primary};
`;

const MetricLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const MetricValue = styled.span`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: 600;
  color: ${(props: any) => props.color || colorTokens.text.primary};
`;

const Timeline = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border-radius: ${borderRadius.sm};
`;

const TimelineBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${colorTokens.border.primary};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props: any) => `${props.progress}%`};
    background: linear-gradient(
      to right,
      ${colorTokens.interactive.success} 0%,
      ${colorTokens.interactive.warning} 50%,
      ${colorTokens.interactive.error} 100%
    );
  }
`;

const TimelineLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  min-width: 60px;
  text-align: right;
`;

const Alert = styled.div`
  padding: ${spacing.md};
  border-left: 4px solid ${(props: any) => props.color || colorTokens.interactive.warning};
  background: ${(props: any) => `${props.color || colorTokens.interactive.warning}20`};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};
`;

/**
 * Calculate average daily spending rate
 */
function calculateDailySpendRate(trends: SpendingTrend[], daysToConsider: number = 30): number {
  if (trends.length === 0) return 0;
  
  const recentTrends = trends.slice(-daysToConsider);
  const totalSpent = recentTrends.reduce((sum, t) => sum + t.amount, 0);
  return totalSpent / Math.max(recentTrends.length, 1);
}

/**
 * Estimate days until budget depleted
 */
function estimateDaysUntilDepletion(
  allocated: number,
  spent: number,
  dailyRate: number
): number | null {
  if (dailyRate === 0) return null;
  const remaining = allocated - spent;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / dailyRate);
}

/**
 * Project spending at end of period
 */
function projectEndOfPeriodSpending(
  allocated: number,
  spent: number,
  dailyRate: number,
  daysRemaining: number
): number {
  return spent + dailyRate * daysRemaining;
}

/**
 * BudgetForecast Component
 *
 * @example
 * <BudgetForecast
 *   budgetName="Q4 Marketing"
 *   allocated={50000}
 *   spent={12500}
 *   trends={historicalTrends}
 *   daysInBudgetPeriod={90}
 *   currentDayOfPeriod={30}
 * />
 */
export const BudgetForecast: React.FC<BudgetForecastProps> = ({
  budgetName,
  allocated,
  spent,
  trends,
  currency = 'USD',
  daysInBudgetPeriod = 90,
  currentDayOfPeriod = Math.floor(Math.random() * daysInBudgetPeriod),
}) => {
  const metrics = useMemo(() => {
    const dailyRate = calculateDailySpendRate(trends);
    const daysRemaining = daysInBudgetPeriod - currentDayOfPeriod;
    const projectedEndSpending = projectEndOfPeriodSpending(
      allocated,
      spent,
      dailyRate,
      daysRemaining
    );
    const daysUntilDepletion = estimateDaysUntilDepletion(allocated, spent, dailyRate);
    const variance = projectedEndSpending - allocated;
    const willOverBudget = variance > 0;

    return {
      dailyRate,
      daysRemaining,
      projectedEndSpending,
      daysUntilDepletion,
      variance,
      willOverBudget,
      percentageUsed: (spent / allocated) * 100,
      progressTimeline: (currentDayOfPeriod / daysInBudgetPeriod) * 100,
    };
  }, [trends, allocated, spent, daysInBudgetPeriod, currentDayOfPeriod]);

  return (
    <Container>
      <Title>📊 Budget Forecast: {budgetName}</Title>

      <Timeline>
        <span style={{ fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
          Day {currentDayOfPeriod}/{daysInBudgetPeriod}
        </span>
        <TimelineBar progress={metrics.progressTimeline} />
        <TimelineLabel>{metrics.progressTimeline.toFixed(0)}%</TimelineLabel>
      </Timeline>

      <ForecastGrid>
        <MetricCard>
          <MetricLabel>Daily Average Spend</MetricLabel>
          <MetricValue>
            {currency} {metrics.dailyRate.toFixed(2)}
          </MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Projected End-of-Period Spend</MetricLabel>
          <MetricValue
            color={
              metrics.willOverBudget
                ? colorTokens.interactive.error
                : colorTokens.interactive.success
            }
          >
            {currency} {metrics.projectedEndSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Budget Variance</MetricLabel>
          <MetricValue
            color={
              metrics.willOverBudget
                ? colorTokens.interactive.error
                : colorTokens.interactive.success
            }
          >
            {metrics.willOverBudget ? '+' : ''}{currency} {metrics.variance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Days Until Budget Depleted</MetricLabel>
          <MetricValue
            color={
              metrics.daysUntilDepletion && metrics.daysUntilDepletion < 10
                ? colorTokens.interactive.error
                : colorTokens.text.primary
            }
          >
            {metrics.daysUntilDepletion !== null
              ? `${metrics.daysUntilDepletion} days`
              : 'N/A'}
          </MetricValue>
        </MetricCard>
      </ForecastGrid>

      {metrics.willOverBudget && (
        <Alert color={colorTokens.interactive.error}>
          ⚠️ <strong>Budget Alert:</strong> Current spending pace will exceed budget by{' '}
          <strong>
            {currency} {Math.abs(metrics.variance).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </strong>
          . Consider reducing daily spend or increasing allocation.
        </Alert>
      )}

      {metrics.percentageUsed > 75 && !metrics.willOverBudget && (
        <Alert color={colorTokens.interactive.warning}>
          ⚠️ <strong>Budget Warning:</strong> {metrics.percentageUsed.toFixed(0)}% of budget used.
          Remaining: {currency} {(allocated - spent).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Alert>
      )}

      {metrics.daysUntilDepletion && metrics.daysUntilDepletion < 5 && (
        <Alert color={colorTokens.interactive.error}>
          🚨 <strong>Critical:</strong> Budget will be depleted in {metrics.daysUntilDepletion} days at current pace.
        </Alert>
      )}
    </Container>
  );
};

export default BudgetForecast;
