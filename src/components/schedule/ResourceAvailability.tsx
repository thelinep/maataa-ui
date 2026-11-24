/**
 * ResourceAvailability - Check resource and attendee availability
 *
 * Find available time slots for scheduling
 * Visualize availability across attendees and resources
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface TimeSlotAvailability {
  startTime: string;
  endTime: string;
  availableAttendees: string[];
  availableResources: string[];
  score: number; // 0-100, higher = better (more people/resources available)
}

export interface ResourceAvailabilityProps {
  attendees: Array<{ id: string; name: string }>;
  resources: Array<{ id: string; name: string }>;
  busyTimes: Array<{ startTime: string; endTime: string }>;
  dateRange: { startDate: string; endDate: string };
  onSelectSlot?: (slot: TimeSlotAvailability) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const AvailabilityGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const TimeSlotCard = styled.div<{ $score: number }>`
  display: grid;
  grid-template-columns: 150px 1fr 150px;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 2px solid ${(props) => {
    const score = props.$score;
    if (score >= 80) return colorTokens.interactive.success;
    if (score >= 50) return colorTokens.interactive.warning;
    return colorTokens.interactive.error;
  }};
  border-radius: ${borderRadius.md};
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${spacing.sm};
  }
`;

const TimeSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
`;

const TimeLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const TimeValue = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const AvailabilityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background: ${({ color }: { color?: string }) => color};
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const ScoreBar = styled.div<{ $score: number }>`
  width: 120px;
  height: 8px;
  background: ${colorTokens.border.primary};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => `${props.$score}%`};
    background: ${(props) => {
      const score = props.$score;
      if (score >= 80) return colorTokens.interactive.success;
      if (score >= 50) return colorTokens.interactive.warning;
      return colorTokens.interactive.error;
    }};
  }
`;

const ScoreLabel = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.bodySmall.fontSize};
`;

const SelectButton = styled(Button)`
  padding: ${spacing.sm} ${spacing.md};
`;

const EmptyState = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${colorTokens.text.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

const Legend = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colorTokens.border.primary};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background: ${({ color }: { color?: string }) => color};
`;

/**
 * Generate available time slots (simplified)
 */
function generateAvailableSlots(
  attendeeCount: number,
  resourceCount: number
): TimeSlotAvailability[] {
  const slots: TimeSlotAvailability[] = [];
  const baseHour = 9; // 9 AM start
  const workingHours = 8;

  for (let i = 0; i < workingHours; i++) {
    const startHour = baseHour + i;
    const startTime = `2026-11-21T${String(startHour).padStart(2, '0')}:00`;
    const endTime = `2026-11-21T${String(startHour + 1).padStart(2, '0')}:00`;

    // Simulate availability variation
    const attendeeScore = Math.max(50, Math.floor(Math.random() * 100));
    const resourceScore = Math.max(60, Math.floor(Math.random() * 100));
    const score = Math.min(100, Math.floor((attendeeScore + resourceScore) / 2));

    slots.push({
      startTime,
      endTime,
      availableAttendees: Array.from(
        { length: Math.floor((attendeeCount * score) / 100) },
        (_, i) => `attendee-${i}`
      ),
      availableResources: Array.from(
        { length: Math.floor((resourceCount * score) / 100) },
        (_, i) => `resource-${i}`
      ),
      score,
    });
  }

  return slots.sort((a, b) => b.score - a.score);
}

/**
 * ResourceAvailability Component
 *
 * @example
 * <ResourceAvailability
 *   attendees={attendees}
 *   resources={resources}
 *   busyTimes={busyTimes}
 *   dateRange={{ startDate: "2026-11-21", endDate: "2026-11-25" }}
 *   onSelectSlot={handleSelect}
 * />
 */
export const ResourceAvailability: React.FC<ResourceAvailabilityProps> = ({
  attendees,
  resources,
  onSelectSlot,
}) => {
  const availableSlots = useMemo(() => {
    return generateAvailableSlots(attendees.length, resources.length);
  }, [attendees.length, resources.length]);

  const topSlots = availableSlots.slice(0, 5); // Show top 5

  return (
    <Container>
      <Title><span aria-hidden="true">🕐 </span>Resource Availability Finder</Title>

      <Legend>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.success} />
          <span>High availability (80%+)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.warning} />
          <span>Medium availability (50-79%)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color={colorTokens.interactive.error} />
          <span>Low availability (&lt;50%)</span>
        </LegendItem>
      </Legend>

      {topSlots.length === 0 ? (
        <EmptyState>
          <p>No available time slots found</p>
        </EmptyState>
      ) : (
        <AvailabilityGrid>
          {topSlots.map((slot, idx) => (
            <TimeSlotCard key={idx} $score={slot.score}>
              <TimeSlot>
                <TimeLabel>Time Slot</TimeLabel>
                <TimeValue>
                  {new Date(slot.startTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TimeValue>
              </TimeSlot>

              <AvailabilityInfo>
                <InfoRow>
                  <Badge color={colorTokens.interactive.info}>
                    👥 {slot.availableAttendees.length}/{attendees.length}
                  </Badge>
                  <span>attendees available</span>
                </InfoRow>

                <InfoRow>
                  <Badge color={colorTokens.interactive.success}>
                    🔧 {slot.availableResources.length}/{resources.length}
                  </Badge>
                  <span>resources available</span>
                </InfoRow>
              </AvailabilityInfo>

              <ScoreSection>
                <ScoreBar $score={slot.score} />
                <ScoreLabel>{slot.score}% match</ScoreLabel>
                <SelectButton
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectSlot?.(slot)}
                >
                  Select
                </SelectButton>
              </ScoreSection>
            </TimeSlotCard>
          ))}
        </AvailabilityGrid>
      )}
    </Container>
  );
};

export default ResourceAvailability;
