import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import type { FilmingRecord } from '@/core/film/types';
import { ErrorState, LoadingState } from '../shared/AsyncState';

interface DailyFootage {
  shotNumber: number;
  sceneNumber: number;
  takeNumber: number;
  duration: number;
  status: 'kept' | 'review';
  fileSize: number; // MB
  timestamp: Date;
}

interface DailyGroup {
  date: Date;
  footage: DailyFootage[];
}

/** Dailies = kept/review takes from each shooting day, newest day first */
export function buildDailies(days: FilmingRecord[]): DailyGroup[] {
  return days
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((day) => ({
      date: day.date,
      footage: day.shots.flatMap((shot) =>
        shot.takes
          .filter((take): take is typeof take & { status: 'kept' | 'review' } => take.status !== 'retake')
          .map((take) => ({
            shotNumber: shot.shotNumber,
            sceneNumber: shot.sceneNumber,
            takeNumber: take.takeNumber,
            duration: take.duration,
            status: take.status,
            fileSize: take.fileSize ?? 0,
            timestamp: take.timestamp,
          }))
      ),
    }))
    .filter((group) => group.footage.length > 0);
}

const ViewContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Header = styled.div`
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin: ${spacing.lg} 0;
`;

const FilterSelect = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colorTokens.border.control};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
  }
`;

const DailySection = styled.div`
  margin-bottom: ${spacing.xl};
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colorTokens.border.primary};
`;

const DailyHeader = styled.div`
  padding: ${spacing.lg};
  background: linear-gradient(135deg, ${colorTokens.primary.main}, ${colorTokens.primary.dark});
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DailyDate = styled.h2`
  font-family: ${typography.heading2.fontFamily};
  font-size: 1.3rem;
  margin: 0;
`;

const DailyStats = styled.div`
  display: flex;
  gap: ${spacing.lg};
  font-size: ${typography.bodySmall.fontSize};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FootageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.md};
  padding: ${spacing.lg};
`;

const FootageCard = styled.div<{ status: string }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border: 2px solid ${colorTokens.border.primary};
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  border-left-color: ${(props) => (props.status === 'kept' ? '#28a745' : '#ffc107')};
  border-left-width: 4px;

  &:hover {
    box-shadow: 0 4px 12px ${colorTokens.shadow}10;
    transform: translateY(-2px);
  }
`;

const FootageThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, ${colorTokens.primary.light}30, ${colorTokens.secondary.light}30);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5em;
`;

const FootageLabel = styled.div`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.bodySmall.fontSize};
`;

const FootageDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
`;

const DurationBadge = styled.span`
  background: ${colorTokens.primary.light}30;
  color: ${colorTokens.primary.main};
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${(props) => (props.status === 'kept' ? '#d4edda' : '#fff3cd')};
  color: ${(props) => (props.status === 'kept' ? '#155724' : '#856404')};
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
`;

const DailiesView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { items: days, loading, error } = useFilmEntities('filming');
  const dailies = useMemo(() => buildDailies(days), [days]);

  const filteredDailies = dailies
    .map((daily) => ({
      ...daily,
      footage: daily.footage.filter((f) => statusFilter === 'all' || f.status === statusFilter),
    }))
    .filter((daily) => daily.footage.length > 0);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date);
  };

  const totalFootage = filteredDailies.reduce((sum, daily) => sum + daily.footage.length, 0);
  const totalSize = filteredDailies.reduce((sum, daily) => sum + daily.footage.reduce((s, f) => s + f.fileSize, 0), 0);

  if (error) return <ErrorState error={error} />;
  if (loading) return <LoadingState label="Loading dailies…" />;

  return (
    <ViewContainer>
      <Header>
        <Title><span aria-hidden="true">📹 </span>Dailies Review</Title>
        <FilterBar>
          <FilterSelect
            aria-label="Filter footage"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Footage ({totalFootage} clips)</option>
            <option value="kept">Kept ({filteredDailies.reduce((sum, d) => sum + d.footage.filter((f) => f.status === 'kept').length, 0)} clips)</option>
            <option value="review">Review ({filteredDailies.reduce((sum, d) => sum + d.footage.filter((f) => f.status === 'review').length, 0)} clips)</option>
          </FilterSelect>
          <span style={{ color: colorTokens.text.secondary, alignSelf: 'center' }}>
            {(totalSize / 1024).toFixed(1)} GB total
          </span>
        </FilterBar>
      </Header>

      {filteredDailies.map((daily) => (
        <DailySection key={daily.date.toISOString()}>
          <DailyHeader>
            <DailyDate>{formatDate(daily.date)}</DailyDate>
            <DailyStats>
              <StatItem>
                <span>Clips</span>
                <span>{daily.footage.length}</span>
              </StatItem>
              <StatItem>
                <span>Duration</span>
                <span>{(daily.footage.reduce((sum, f) => sum + f.duration, 0) / 60).toFixed(1)} min</span>
              </StatItem>
              <StatItem>
                <span>Size</span>
                <span>{(daily.footage.reduce((sum, f) => sum + f.fileSize, 0) / 1024).toFixed(1)} GB</span>
              </StatItem>
            </DailyStats>
          </DailyHeader>
          <FootageGrid>
            {daily.footage.map((footage) => (
              <FootageCard key={`${footage.shotNumber}-${footage.takeNumber}`} status={footage.status}>
                <FootageThumbnail>🎬</FootageThumbnail>
                <FootageLabel>S{footage.sceneNumber} Sh{footage.shotNumber} T{footage.takeNumber}</FootageLabel>
                <FootageDetails>
                  <DurationBadge>{footage.duration}s</DurationBadge>
                  <StatusBadge status={footage.status}>{footage.status.toUpperCase()}</StatusBadge>
                </FootageDetails>
              </FootageCard>
            ))}
          </FootageGrid>
        </DailySection>
      ))}
    </ViewContainer>
  );
};

export default DailiesView;
