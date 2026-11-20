import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface Storyboard {
  id: string;
  title: string;
  scriptId: string;
  sceneCount: number;
  shotCount: number;
  status: 'in-progress' | 'review' | 'approved';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
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

const StoryboardList: React.FC = () => {
  const [storyboards] = useState<Storyboard[]>([
    {
      id: 'storyboard-1',
      title: 'The Lost Highway - Full',
      scriptId: 'script-1',
      sceneCount: 12,
      shotCount: 47,
      status: 'approved',
      createdAt: new Date('2026-11-10'),
      updatedAt: new Date('2026-11-18'),
      createdBy: 'Storyboard Artist',
    },
    {
      id: 'storyboard-2',
      title: 'Street Voices - Rough Pass',
      scriptId: 'script-2',
      sceneCount: 8,
      shotCount: 24,
      status: 'in-progress',
      createdAt: new Date('2026-11-15'),
      updatedAt: new Date('2026-11-20'),
      createdBy: 'Visual Director',
    },
  ]);

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
        <CreateButton onClick={() => alert('Create storyboard')}>
          + New Storyboard
        </CreateButton>
      </Header>

      {storyboards.length > 0 ? (
        <Grid>
          {storyboards.map((storyboard) => (
            <StoryboardCard key={storyboard.id} onClick={() => alert(`View: ${storyboard.id}`)}>
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
                    <StatValue>{storyboard.sceneCount}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Shots</StatLabel>
                    <StatValue>{storyboard.shotCount}</StatValue>
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
