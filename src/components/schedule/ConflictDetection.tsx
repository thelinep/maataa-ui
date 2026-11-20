/**
 * ConflictDetection - Schedule conflict analysis and resolution
 *
 * Detect, visualize, and help resolve scheduling conflicts
 * Resource availability checking
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface ResourceConflict {
  id: string;
  resourceId: string;
  resourceName: string;
  eventIds: string[];
  conflictingEvents: Array<{ id: string; title: string; startTime: string; endTime: string }>;
  severity: 'low' | 'medium' | 'high';
  suggestedResolution?: string;
}

export interface ConflictDetectionProps {
  conflicts: ResourceConflict[];
  totalEvents: number;
  onResolve?: (conflictId: string, resolution: string) => void;
  onShowAlternatives?: (conflictId: string) => void;
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
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const SummaryCard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};
`;

const StatCard = styled.div<{ $severity?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 2px solid ${(props) => {
    switch (props.$severity) {
      case 'high': return colorTokens.interactive.error;
      case 'medium': return colorTokens.interactive.warning;
      default: return colorTokens.interactive.success;
    }
  }};
  border-radius: ${borderRadius.md};
`;

const StatLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const StatValue = styled.span`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const ConflictsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const ConflictItem = styled.div<{ $severity?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 2px solid ${(props) => {
    switch (props.$severity) {
      case 'high': return colorTokens.interactive.error;
      case 'medium': return colorTokens.interactive.warning;
      default: return colorTokens.interactive.info;
    }
  }};
  border-radius: ${borderRadius.md};
`;

const ConflictHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.md};
`;

const ResourceName = styled.span`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const SeverityBadge = styled.span<{ $severity?: string }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${(props) => {
    switch (props.$severity) {
      case 'high': return colorTokens.interactive.error;
      case 'medium': return colorTokens.interactive.warning;
      default: return colorTokens.interactive.info;
    }
  }};
  color: white;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const EventInConflict = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm};
  background: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.sm};
`;

const EventIndicator = styled.div`
  width: 4px;
  height: 32px;
  background: ${colorTokens.interactive.warning};
  border-radius: 2px;
  flex-shrink: 0;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `2px`};
  flex: 1;
`;

const EventTitle = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const EventTime = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const ResolutionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border-radius: ${borderRadius.sm};
  border: 1px solid ${colorTokens.border.primary};
`;

const ResolutionLabel = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.bodySmall.fontSize};
`;

const ResolutionText = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${colorTokens.text.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  background: ${colorTokens.background.primary};
`;

/**
 * ConflictDetection Component
 *
 * @example
 * <ConflictDetection
 *   conflicts={conflicts}
 *   totalEvents={45}
 *   onResolve={handleResolve}
 * />
 */
export const ConflictDetection: React.FC<ConflictDetectionProps> = ({
  conflicts,
  totalEvents,
  onResolve,
  onShowAlternatives,
}) => {
  const conflictStats = useMemo(() => {
    const high = conflicts.filter((c) => c.severity === 'high').length;
    const medium = conflicts.filter((c) => c.severity === 'medium').length;
    const low = conflicts.filter((c) => c.severity === 'low').length;
    const totalConflictingEvents = conflicts.reduce((sum, c) => sum + c.eventIds.length, 0);
    const conflictPercentage = totalEvents > 0 ? ((totalConflictingEvents / totalEvents) * 100).toFixed(1) : '0';

    return { high, medium, low, totalConflictingEvents, conflictPercentage };
  }, [conflicts, totalEvents]);

  return (
    <Container>
      <Header>
        <Title>⚠️ Conflict Detection</Title>
      </Header>

      <SummaryCard>
        <StatCard $severity="high">
          <StatLabel>High Severity</StatLabel>
          <StatValue style={{ color: colorTokens.interactive.error }}>
            {conflictStats.high}
          </StatValue>
        </StatCard>

        <StatCard $severity="medium">
          <StatLabel>Medium Severity</StatLabel>
          <StatValue style={{ color: colorTokens.interactive.warning }}>
            {conflictStats.medium}
          </StatValue>
        </StatCard>

        <StatCard $severity="low">
          <StatLabel>Low Severity</StatLabel>
          <StatValue style={{ color: colorTokens.interactive.info }}>
            {conflictStats.low}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Conflict Rate</StatLabel>
          <StatValue>
            {conflictStats.conflictPercentage}%
          </StatValue>
        </StatCard>
      </SummaryCard>

      {conflicts.length === 0 ? (
        <EmptyState>
          <p>✓ No scheduling conflicts detected! Your schedule is clean.</p>
        </EmptyState>
      ) : (
        <ConflictsList>
          {conflicts.map((conflict) => (
            <ConflictItem key={conflict.id} $severity={conflict.severity}>
              <ConflictHeader>
                <ResourceName>📌 {conflict.resourceName}</ResourceName>
                <SeverityBadge $severity={conflict.severity}>
                  {conflict.severity} Severity
                </SeverityBadge>
              </ConflictHeader>

              <div>
                <span style={{ fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
                  {conflict.conflictingEvents.length} conflicting event{conflict.conflictingEvents.length !== 1 ? 's' : ''}
                </span>
              </div>

              <EventsList>
                {conflict.conflictingEvents.map((event) => (
                  <EventInConflict key={event.id}>
                    <EventIndicator />
                    <EventInfo>
                      <EventTitle>{event.title}</EventTitle>
                      <EventTime>
                        {new Date(event.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(event.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </EventTime>
                    </EventInfo>
                  </EventInConflict>
                ))}
              </EventsList>

              {conflict.suggestedResolution && (
                <ResolutionSection>
                  <ResolutionLabel>💡 Suggested Resolution</ResolutionLabel>
                  <ResolutionText>{conflict.suggestedResolution}</ResolutionText>
                </ResolutionSection>
              )}

              <ActionButtons>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    onResolve?.(
                      conflict.id,
                      conflict.suggestedResolution || 'Resolve manually'
                    )
                  }
                >
                  Resolve
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => onShowAlternatives?.(conflict.id)}
                >
                  Show Alternatives
                </Button>
              </ActionButtons>
            </ConflictItem>
          ))}
        </ConflictsList>
      )}
    </Container>
  );
};

export default ConflictDetection;
