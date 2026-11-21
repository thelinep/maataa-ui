/**
 * ScheduleList - Display and manage scheduled events
 *
 * List view of all scheduled events with filtering and search
 * Integrates with Phase 1 design tokens and Phase 2 entities
 */

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime: string;
  location?: string;
  attendees: string[];
  eventType: 'meeting' | 'deadline' | 'milestone' | 'review' | 'other';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  resourcesRequired?: string[];
  createdBy: string;
  createdAt: number;
}

export interface ScheduleListProps {
  events: ScheduledEvent[];
  currentUserId: string;
  onCreateEvent?: () => void;
  onViewEvent?: (eventId: string) => void;
  onEditEvent?: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
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
  flex-wrap: wrap;
  gap: ${spacing.md};
`;

const Title = styled.h2`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.sm};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
  min-width: 200px;

  &::placeholder {
    color: ${colorTokens.text.secondary};
  }
`;

const FilterSelect = styled.select`
  padding: ${spacing.sm};
  border: 1px solid ${colorTokens.border.control};
  border-radius: ${borderRadius.sm};
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.primary};
`;

const EventTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const EventRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 100px;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${spacing.sm};
  }
`;

const EventTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
`;

const EventName = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const EventDesc = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const EventType = styled.span<{ $type?: string }>`
  display: inline-block;
  padding: 2px 8px;
  background: ${(props) => {
    switch (props.$type) {
      case 'meeting': return colorTokens.interactive.info;
      case 'deadline': return colorTokens.interactive.error;
      case 'milestone': return colorTokens.interactive.success;
      case 'review': return colorTokens.interactive.warning;
      default: return colorTokens.interactive.secondary;
    }
  }};
  color: white;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
`;

const EventTime = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs || `4px`};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const TimeValue = styled.span`
  font-weight: 500;
  color: ${colorTokens.text.primary};
`;

const AttendeeCount = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${colorTokens.interactive.info}20;
  color: ${colorTokens.interactive.info};
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 4px 8px;
  background: ${(props) => {
    switch (props.$status) {
      case 'completed': return colorTokens.interactive.success;
      case 'in-progress': return colorTokens.interactive.info;
      case 'cancelled': return colorTokens.interactive.error;
      default: return colorTokens.border.primary;
    }
  }};
  color: white;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.xs || `4px`};
`;

const EmptyState = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${colorTokens.text.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

/**
 * Format date and time
 */
function formatDateTime(isoString: string): { date: string; time: string } {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Calculate duration in hours
 */
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

/**
 * ScheduleList Component
 *
 * @example
 * <ScheduleList
 *   events={events}
 *   currentUserId="user-123"
 *   onCreateEvent={handleCreate}
 *   onViewEvent={handleView}
 * />
 */
export const ScheduleList: React.FC<ScheduleListProps> = ({
  events,
  onCreateEvent,
  onViewEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesType = filterType === 'all' || event.eventType === filterType;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchTerm, filterType, filterStatus]);

  // Sort by start time
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <Container>
      <Header>
        <Title>📅 Schedule</Title>
        <Button variant="primary" onClick={onCreateEvent}>
          + New Event
        </Button>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FilterSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="milestone">Milestone</option>
          <option value="review">Review</option>
          <option value="other">Other</option>
        </FilterSelect>

        <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </FilterSelect>
      </Controls>

      {sortedEvents.length === 0 ? (
        <EmptyState>
          <p>No events match your search. {events.length === 0 && 'Create one to get started!'}</p>
        </EmptyState>
      ) : (
        <EventTable>
          {sortedEvents.map((event) => {
            const { date, time } = formatDateTime(event.startTime);
            const duration = calculateDuration(event.startTime, event.endTime);

            return (
              <EventRow key={event.id}>
                <EventTitle>
                  <EventName>{event.title}</EventName>
                  <EventDesc>{event.description || event.location || 'No description'}</EventDesc>
                </EventTitle>

                <div>
                  <EventType $type={event.eventType}>
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </EventType>
                </div>

                <EventTime>
                  <TimeValue>{date}</TimeValue>
                  <span>{time} ({duration.toFixed(1)}h)</span>
                </EventTime>

                <div>
                  <AttendeeCount>👥 {event.attendees.length}</AttendeeCount>
                  <div style={{ marginTop: spacing.sm }}>
                    <StatusBadge $status={event.status}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </StatusBadge>
                  </div>
                </div>

                <ActionButtons>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => onViewEvent?.(event.id)}
                  >
                    View
                  </Button>
                </ActionButtons>
              </EventRow>
            );
          })}
        </EventTable>
      )}
    </Container>
  );
};

export default ScheduleList;
