/**
 * BudgetDetail - View and analyze a single budget
 *
 * Shows budget details with financial analytics and spending breakdown.
 * Supports real-time collaborative editing via Phase 5.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import {
  Card,
  Button,
  ActivityFeed,
  PresenceIndicator,
  TypingIndicator,
} from '@/components';
import { Modal } from '@maataa/ui/surfaces';
import { useActivityStream, usePresence } from '@/hooks';
import { useFilmEntity } from '@/hooks/data/useFilmEntities';
import { personName } from '../shared/people';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';
import BudgetForm, { BudgetFormData } from './BudgetForm';
import type { Activity } from '@/hooks/useActivityStream';

export interface BudgetDetailProps {
  budgetId: string;
  onNavigateBack?: () => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Title = styled.h1`
  font-size: ${typography.heading2.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const PresenceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colorTokens.background.secondary};
  border-radius: ${borderRadius.md};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background-color: ${colorTokens.background.secondary};
  border-radius: ${borderRadius.md};
`;

const MetricLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  font-weight: 500;
`;

const MetricValue = styled.span<{ color?: string }>`
  font-size: ${typography.heading2.fontSize};
  font-weight: 700;
  color: ${(props) => props.color || colorTokens.text.primary};
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const ProgressLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const ProgressBar = styled.div`
  height: 12px;
  background-color: ${colorTokens.border.primary};
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${(props) => `${Math.min(props.percentage, 100)}%`};
  background-color: ${(props) => props.color};
  transition: width 0.3s ease-in-out;
`;

const ProgressPercent = styled.span<{ color: string }>`
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${(props) => props.color};
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  color: ${colorTokens.text.secondary};
  font-size: ${typography.bodySmall.fontSize};
`;

/**
 * BudgetDetail Component
 *
 * @example
 * <BudgetDetail
 *   budgetId="budget-123"
 *   onNavigateBack={() => navigate('/budgets')}
 * />
 */
export const BudgetDetail: React.FC<BudgetDetailProps> = ({
  budgetId,
  onNavigateBack: propNavigateBack,
}) => {
  const navigate = useNavigate();
  const onNavigateBack = propNavigateBack || (() => navigate('/budgets'));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { item: budget, loading: entityLoading, error: entityError, update } = useFilmEntity('budget', budgetId);
  const [savedMessage, setSavedMessage] = useState('');

  const { activities, loading: activitiesLoading } = useActivityStream({
    entityId: budgetId,
    maxActivities: 20,
  });

  const { participants, setStatus, setTyping } = usePresence({
    entityId: budgetId,
    userId: 'current-user', // TODO: Get from auth context
  });

  const { subscribe: subscribeActivity, unsubscribe: unsubscribeActivity } = useActivityStream({
    entityId: budgetId,
    maxActivities: 20,
  });

  // Get list of typing participants for the modal
  const typingParticipants = participants
    .filter((p) => p.isTyping)
    .map((p) => p.userName);

  // Subscribe to real-time updates when component mounts
  useEffect(() => {
    if (!budgetId) return;

    // Subscribe to activity stream for this budget
    subscribeActivity(budgetId).catch(console.error);

    // Set user to online
    setStatus('online');

    // Cleanup on unmount
    return () => {
      unsubscribeActivity();
      setStatus('offline');
    };
  }, [budgetId, subscribeActivity, unsubscribeActivity, setStatus]);

  // Errors propagate to the form, which shows them in its alert region.
  const handleEditSubmit = async (data: BudgetFormData) => {
    setTyping(true);
    try {
      await update({
        name: data.name,
        description: data.description || undefined,
        allocated: data.allocated,
        spent: data.spent,
        currency: data.currency,
        owner: data.owner || undefined,
      });
    } finally {
      setTyping(false);
    }
    setSavedMessage('Budget saved.');
    setIsEditModalOpen(false);
  };

  if (entityLoading) {
    return (
      <Container>
        <LoadingState>Loading budget...</LoadingState>
      </Container>
    );
  }

  if (entityError || !budget) {
    return (
      <Container>
        <Card>
          <div
            style={{
              padding: spacing.md,
              color: colorTokens.interactive.error,
            }}
          >
            Error loading budget: {entityError?.message || 'Budget not found'}
          </div>
        </Card>
      </Container>
    );
  }

  const budgetData = budget;
  const allocated = budgetData.allocated || 0;
  const spent = budgetData.spent || 0;
  const remaining = allocated - spent;
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
  const isOverBudget = spent > allocated;
  const statusColor = isOverBudget ? colorTokens.interactive.error : colorTokens.interactive.success;

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <TitleSection>
          <Title>{budgetData.name || 'Untitled Budget'}</Title>
          <Subtitle>{budgetData.description}</Subtitle>
        </TitleSection>
        <Actions>
          {participants.length > 0 && (
            <PresenceContainer>
              <PresenceIndicator
                participants={participants}
              />
            </PresenceContainer>
          )}
          <Button onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
          {onNavigateBack && (
            <Button variant="tertiary" onClick={onNavigateBack}>
              Back
            </Button>
          )}
        </Actions>
      </Header>

      {/* Announced after saving an edit; visible so sighted users see it too */}
      <div role="status" style={{ minHeight: '1.2em', color: colorTokens.text.primary }}>
        {savedMessage}
      </div>

      {/* Financial Metrics */}
      <Card>
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Allocated</MetricLabel>
            <MetricValue>
              {budgetData.currency || 'USD'} {allocated.toLocaleString()}
            </MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Spent</MetricLabel>
            <MetricValue color={statusColor}>
              {budgetData.currency || 'USD'} {spent.toLocaleString()}
            </MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Remaining</MetricLabel>
            <MetricValue color={statusColor}>
              {budgetData.currency || 'USD'} {remaining.toLocaleString()}
            </MetricValue>
          </MetricCard>
        </MetricsGrid>
      </Card>

      {/* Budget Progress */}
      <Card>
        <TabContent>
          <div>
            <ProgressLabel>Budget Usage</ProgressLabel>
            <ProgressContainer style={{ marginTop: spacing.md }}>
              <ProgressBar>
                <ProgressFill
                  percentage={percentage}
                  color={isOverBudget ? colorTokens.interactive.error : colorTokens.interactive.success}
                />
              </ProgressBar>
              <ProgressPercent color={statusColor}>
                {percentage.toFixed(1)}% {isOverBudget ? 'OVER BUDGET' : 'used'}
              </ProgressPercent>
            </ProgressContainer>
          </div>
        </TabContent>
      </Card>

      {/* Budget Owner and Details */}
      <Card>
        <TabContent>
          <div>
            <span style={{ fontWeight: 600 }}>Budget Owner</span>
            <span style={{ color: colorTokens.text.secondary, marginTop: spacing.sm, display: 'block' }}>
              {personName(budgetData.owner) || 'Not assigned'}
            </span>
          </div>
          <div style={{ marginTop: spacing.md }}>
            <span style={{ fontWeight: 600 }}>Created</span>
            <span style={{ color: colorTokens.text.secondary, marginTop: spacing.sm, display: 'block' }}>
              {budgetData.createdAt
                ? new Date(budgetData.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </TabContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <TabContent>
          <span style={{ fontWeight: 600, marginBottom: spacing.md }}>Activity History</span>
          {activitiesLoading ? (
            <LoadingState>Loading activity...</LoadingState>
          ) : (
            <ActivityFeed
              activities={activities as Activity[]}
              maxItems={10}
            />
          )}
        </TabContent>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Budget"
      >
        <div style={{ padding: spacing.lg }}>
          {typingParticipants.length > 0 && (
            <div style={{ marginBottom: spacing.md }}>
              <TypingIndicator
                typists={typingParticipants}
                variant="compact"
              />
            </div>
          )}
          <BudgetForm
            budgetId={budgetId}
            initialValues={{
              name: budget.name,
              description: budget.description ?? '',
              allocated: budget.allocated,
              spent: budget.spent,
              currency: budget.currency,
              owner: budget.owner ?? '',
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </div>
      </Modal>
    </Container>
  );
};

BudgetDetail.displayName = 'BudgetDetail';

export default BudgetDetail;
