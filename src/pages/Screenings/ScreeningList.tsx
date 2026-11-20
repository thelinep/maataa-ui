import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import type { ScreeningFeedback, ScreeningRecord } from '@/core/film/types';
import { ErrorState, LoadingState } from '../shared/AsyncState';
import { AccessibilityBadges } from './ScreeningAccessibility';

/** Average rating rounded to 1 decimal, or null with no feedback */
export function averageRating(feedback: ScreeningFeedback[]): number | null {
  if (feedback.length === 0) return null;
  const avg = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
  return Math.round(avg * 10) / 10;
}

const ListContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const CreateButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  background: ${colorTokens.primary.main};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${colorTokens.primary.dark};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${spacing.lg};
`;

const ScreeningCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  padding: ${spacing.lg};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${colorTokens.shadow}15;
    border-color: ${colorTokens.primary.main};
  }
`;

const CardTitle = styled.h3`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.md} 0;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
`;

const CardLabel = styled.span`
  color: ${colorTokens.text.secondary};
`;

const CardValue = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.type) {
      case 'internal':
        return '#cfe2ff';
      case 'test':
        return '#fff3cd';
      case 'premiere':
        return '#d1ecf1';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'internal':
        return '#084298';
      case 'test':
        return '#856404';
      case 'premiere':
        return '#0c5460';
      default:
        return '#495057';
    }
  }};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case 'scheduled':
        return '#cfe2ff';
      case 'completed':
        return '#d4edda';
      case 'cancelled':
        return '#f8d7da';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'scheduled':
        return '#084298';
      case 'completed':
        return '#155724';
      case 'cancelled':
        return '#721c24';
      default:
        return '#495057';
    }
  }};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid ${colorTokens.border.primary};
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  font-size: 1.2em;
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const FeedbackLink = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.primary.main};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: ${spacing.xl};
  text-align: center;
  color: ${colorTokens.text.secondary};
`;

export interface ScreeningListProps {
  onSelect?: (screeningId: string) => void;
  onCreate?: () => void;
}

const sortByDateAsc = (a: ScreeningRecord, b: ScreeningRecord) => a.date.getTime() - b.date.getTime();

const ScreeningList: React.FC<ScreeningListProps> = ({ onSelect, onCreate }) => {
  const { items: screenings, loading, error } = useFilmEntities('screening', { sort: sortByDateAsc });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    }).format(date);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.round(rating) ? '⭐' : '☆');
    }
    return stars.join('');
  };

  return (
    <ListContainer>
      <Header>
        <Title>🎬 Screenings</Title>
        <CreateButton onClick={() => onCreate?.()}>
          + Schedule Screening
        </CreateButton>
      </Header>

      {error ? (
        <ErrorState error={error} />
      ) : loading ? (
        <LoadingState label="Loading screenings…" />
      ) : screenings.length > 0 ? (
        <Grid>
          {screenings.map((screening) => {
            const avgRating = averageRating(screening.feedback);
            return (
            <ScreeningCard
              key={screening.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(screening.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelect?.(screening.id);
              }}
            >
              <CardTitle>{screening.title}</CardTitle>
              
              <CardRow>
                <CardLabel>Type</CardLabel>
                <TypeBadge type={screening.type}>
                  {screening.type.charAt(0).toUpperCase() + screening.type.slice(1)}
                </TypeBadge>
              </CardRow>

              <CardRow>
                <CardLabel>Status</CardLabel>
                <StatusBadge status={screening.status}>
                  {screening.status.charAt(0).toUpperCase() + screening.status.slice(1)}
                </StatusBadge>
              </CardRow>

              <CardRow>
                <CardLabel>Date</CardLabel>
                <CardValue>{formatDate(screening.date)}</CardValue>
              </CardRow>

              <CardRow>
                <CardLabel>Location</CardLabel>
                <CardValue>{screening.location}</CardValue>
              </CardRow>

              <CardRow>
                <CardLabel>Audience</CardLabel>
                <CardValue>{screening.audienceSize} people</CardValue>
              </CardRow>

              {screening.accessibility && (
                <CardRow>
                  <CardLabel>Access</CardLabel>
                  <AccessibilityBadges accessibility={screening.accessibility} />
                </CardRow>
              )}

              {screening.status === 'completed' && avgRating !== null && (
                <RatingContainer>
                  <Stars>{renderStars(avgRating)}</Stars>
                  <RatingValue>{avgRating}/5</RatingValue>
                  <FeedbackLink>({screening.feedback.length} responses)</FeedbackLink>
                </RatingContainer>
              )}
            </ScreeningCard>
            );
          })}
        </Grid>
      ) : (
        <EmptyState>
          <p>No screenings scheduled. Create one to gather feedback!</p>
        </EmptyState>
      )}
    </ListContainer>
  );
};

export default ScreeningList;
