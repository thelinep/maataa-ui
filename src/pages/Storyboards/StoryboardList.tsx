import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import type { StoryboardRecord } from '@/core/film/types';
import { ErrorState, LoadingState } from '../shared/AsyncState';

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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.lg};
`;

const StoryboardCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${colorTokens.shadow}15;
    border-color: ${colorTokens.primary.main};
  }
`;

const CardThumbnail = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, ${colorTokens.primary.light}30, ${colorTokens.secondary.light}30);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  color: ${colorTokens.text.disabled};
`;

const CardContent = styled.div`
  padding: ${spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const CardStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid ${colorTokens.border.primary};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.bodySmall.fontSize};
`;

const StatLabel = styled.span`
  color: ${colorTokens.text.secondary};
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 20px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case 'in-progress':
        return '#cfe2ff';
      case 'review':
        return '#fff3cd';
      case 'approved':
        return '#d4edda';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'in-progress':
        return '#084298';
      case 'review':
        return '#856404';
      case 'approved':
        return '#155724';
      default:
        return '#495057';
    }
  }};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: ${spacing.xl};
  text-align: center;
  color: ${colorTokens.text.secondary};
`;

export interface StoryboardListProps {
  onSelect?: (storyboardId: string) => void;
  onCreate?: () => void;
}

const sortByUpdatedDesc = (a: StoryboardRecord, b: StoryboardRecord) => b.updatedAt.getTime() - a.updatedAt.getTime();

/** Scene/shot totals are derived from the storyboard's scenes */
export const countShots = (storyboard: Pick<StoryboardRecord, 'scenes'>) =>
  storyboard.scenes.reduce((sum, scene) => sum + scene.shots.length, 0);

const StoryboardList: React.FC<StoryboardListProps> = ({ onSelect, onCreate }) => {
  const { items: storyboards, loading, error } = useFilmEntities('storyboard', { sort: sortByUpdatedDesc });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <ListContainer>
      <Header>
        <Title>🎞️ Storyboards</Title>
        <CreateButton onClick={() => onCreate?.()}>
          + New Storyboard
        </CreateButton>
      </Header>

      {error ? (
        <ErrorState error={error} />
      ) : loading ? (
        <LoadingState label="Loading storyboards…" />
      ) : storyboards.length > 0 ? (
        <Grid>
          {storyboards.map((storyboard) => (
            <StoryboardCard
              key={storyboard.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(storyboard.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelect?.(storyboard.id);
              }}
            >
              <CardThumbnail>🎬</CardThumbnail>
              <CardContent>
                <CardTitle>{storyboard.title}</CardTitle>
                <CardMeta>
                  <span>{formatDate(storyboard.updatedAt)}</span>
                  <span>{storyboard.createdBy}</span>
                </CardMeta>
                <CardStats>
                  <StatItem>
                    <StatLabel>Scenes</StatLabel>
                    <StatValue>{storyboard.scenes.length}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Shots</StatLabel>
                    <StatValue>{countShots(storyboard)}</StatValue>
                  </StatItem>
                </CardStats>
                <StatusBadge status={storyboard.status}>
                  {storyboard.status.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                </StatusBadge>
              </CardContent>
            </StoryboardCard>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <p>No storyboards yet. Create one to start visual planning!</p>
        </EmptyState>
      )}
    </ListContainer>
  );
};

export default StoryboardList;
