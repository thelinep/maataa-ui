import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface Take {
  takeNumber: number;
  duration: number;
  status: 'kept' | 'retake' | 'review';
  notes: string;
  timestamp: Date;
}

interface DailyShot {
  shotNumber: number;
  sceneNumber: number;
  takes: Take[];
  totalTakes: number;
}

interface FilmingDay {
  date: Date;
  location: string;
  camera: string;
  operator: string;
  shots: DailyShot[];
}

const LogContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border-left: 4px solid ${colorTokens.primary.main};
  border-radius: 8px;
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const DayInfo = styled.div`
  display: flex;
  gap: ${spacing.xl};
  font-size: ${typography.bodySmall.fontSize};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const InfoLabel = styled.span`
  color: ${colorTokens.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: ${colorTokens.text.primary};
  font-weight: 600;
`;

const ShotsAccordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const ShotAccordionItem = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  overflow: hidden;
`;

const ShotHeader = styled.button`
  width: 100%;
  padding: ${spacing.md} ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid ${colorTokens.border.primary};
  transition: background 0.2s;

  &:hover {
    background: ${colorTokens.neutral.light};
  }
`;

const ShotTitle = styled.div`
  display: flex;
  gap: ${spacing.lg};
  align-items: center;
  flex: 1;
`;

const ShotNumber = styled.span`
  font-weight: 700;
  color: ${colorTokens.primary.main};
  min-width: 60px;
  font-size: ${typography.bodySmall.fontSize};
  text-transform: uppercase;
`;

const ShotInfo = styled.span`
  color: ${colorTokens.text.secondary};
  font-size: ${typography.bodySmall.fontSize};
`;

const TakeCount = styled.span`
  background: ${colorTokens.primary.light}30;
  color: ${colorTokens.primary.main};
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: ${typography.bodySmall.fontSize};
`;

const TakesContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const TakeItem = styled.div`
  display: grid;
  grid-template-columns: 60px 100px 100px 1fr 80px;
  gap: ${spacing.md};
  align-items: center;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border-radius: 6px;
  border-left: 3px solid ${colorTokens.primary.main};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TakeNumber = styled.span`
  font-weight: 700;
  color: ${colorTokens.text.primary};
`;

const Duration = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const TakeNotes = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case 'kept':
        return '#d4edda';
      case 'retake':
        return '#f8d7da';
      case 'review':
        return '#fff3cd';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'kept':
        return '#155724';
      case 'retake':
        return '#721c24';
      case 'review':
        return '#856404';
      default:
        return '#495057';
    }
  }};
`;

const AddButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  background: ${colorTokens.primary.main};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;

  &:hover {
    background: ${colorTokens.primary.dark};
  }
`;

const FilmingLog: React.FC = () => {
  const [expandedShot, setExpandedShot] = useState<number | null>(0);

  // Mock data
  const filmingDay: FilmingDay = {
    date: new Date('2026-11-20'),
    location: 'Highway overpass - Mile 23',
    camera: 'RED Monstro 8K',
    operator: 'Cinematographer Team',
    shots: [
      {
        shotNumber: 1,
        sceneNumber: 1,
        totalTakes: 7,
        takes: [
          { takeNumber: 1, duration: 3.2, status: 'retake', notes: 'Focus missed on car entrance', timestamp: new Date('2026-11-20 06:30') },
          { takeNumber: 2, duration: 3.1, status: 'retake', notes: 'Lighting not ready', timestamp: new Date('2026-11-20 06:45') },
          { takeNumber: 3, duration: 3.0, status: 'review', notes: 'Good lighting, check focus', timestamp: new Date('2026-11-20 07:00') },
          { takeNumber: 4, duration: 2.9, status: 'retake', notes: 'Wind mic picked up', timestamp: new Date('2026-11-20 07:15') },
          { takeNumber: 5, duration: 3.2, status: 'kept', notes: 'Perfect - all elements aligned', timestamp: new Date('2026-11-20 07:30') },
          { takeNumber: 6, duration: 3.1, status: 'kept', notes: 'Alternate angle', timestamp: new Date('2026-11-20 07:45') },
          { takeNumber: 7, duration: 3.0, status: 'kept', notes: 'Wide shot backup', timestamp: new Date('2026-11-20 08:00') },
        ],
      },
      {
        shotNumber: 2,
        sceneNumber: 1,
        totalTakes: 4,
        takes: [
          { takeNumber: 1, duration: 2.5, status: 'retake', notes: 'Boom shadow visible', timestamp: new Date('2026-11-20 08:30') },
          { takeNumber: 2, duration: 2.4, status: 'review', notes: 'Good but slightly soft', timestamp: new Date('2026-11-20 08:45') },
          { takeNumber: 3, duration: 2.6, status: 'kept', notes: 'Strong detail', timestamp: new Date('2026-11-20 09:00') },
          { takeNumber: 4, duration: 2.5, status: 'kept', notes: 'Alt version', timestamp: new Date('2026-11-20 09:15') },
        ],
      },
    ],
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const keptCount = filmingDay.shots.reduce((sum, shot) => sum + shot.takes.filter((t) => t.status === 'kept').length, 0);
  const totalTakes = filmingDay.shots.reduce((sum, shot) => sum + shot.takes.length, 0);

  return (
    <LogContainer>
      <Header>
        <Title>🎥 Filming Log</Title>
        <DayInfo>
          <InfoItem>
            <InfoLabel>Date</InfoLabel>
            <InfoValue>{formatDate(filmingDay.date)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>{filmingDay.location}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Takes</InfoLabel>
            <InfoValue>{keptCount} kept / {totalTakes} total</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Camera</InfoLabel>
            <InfoValue>{filmingDay.camera}</InfoValue>
          </InfoItem>
        </DayInfo>
      </Header>

      <ShotsAccordion>
        {filmingDay.shots.map((shot, index) => (
          <ShotAccordionItem key={shot.shotNumber}>
            <ShotHeader onClick={() => setExpandedShot(expandedShot === index ? null : index)}>
              <ShotTitle>
                <ShotNumber>Shot {shot.shotNumber}</ShotNumber>
                <ShotInfo>Scene {shot.sceneNumber}</ShotInfo>
              </ShotTitle>
              <TakeCount>{shot.totalTakes} takes</TakeCount>
            </ShotHeader>
            {expandedShot === index && (
              <TakesContainer>
                <AddButton onClick={() => alert('Add new take')}>+ Log New Take</AddButton>
                {shot.takes.map((take) => (
                  <TakeItem key={take.takeNumber}>
                    <TakeNumber>T{take.takeNumber}</TakeNumber>
                    <Duration>{take.duration}s</Duration>
                    <span style={{ fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
                      {formatTime(take.timestamp)}
                    </span>
                    <TakeNotes>{take.notes}</TakeNotes>
                    <StatusBadge status={take.status}>
                      {take.status.charAt(0).toUpperCase() + take.status.slice(1)}
                    </StatusBadge>
                  </TakeItem>
                ))}
              </TakesContainer>
            )}
          </ShotAccordionItem>
        ))}
      </ShotsAccordion>
    </LogContainer>
  );
};

export default FilmingLog;
