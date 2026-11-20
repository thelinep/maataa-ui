import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface TimelineClip {
  id: string;
  startTime: number;
  endTime: number;
  shotNumber: number;
  notes: string;
  status: 'locked' | 'draft' | 'approved';
}

interface EditingTrack {
  trackId: string;
  trackName: string;
  clips: TimelineClip[];
  type: 'video' | 'audio';
}

const TimelineContainer = styled.div`
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

const ControlBar = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin: ${spacing.lg} 0;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
`;

const Button = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  background: ${colorTokens.primary.main};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${typography.body.fontFamily};

  &:hover {
    background: ${colorTokens.primary.dark};
  }
`;

const TimelineWrapper = styled.div`
  overflow-x: auto;
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  border: 1px solid ${colorTokens.border.primary};
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineRuler = styled.div`
  display: flex;
  background: ${colorTokens.neutral.light};
  border-bottom: 1px solid ${colorTokens.border.primary};
  position: sticky;
  top: 0;
  min-width: 100%;
`;

const TimelineMarker = styled.div`
  flex: 0 0 50px;
  padding: ${spacing.sm};
  text-align: center;
  font-size: 11px;
  color: ${colorTokens.text.secondary};
  border-right: 1px solid ${colorTokens.border.primary};
`;

const TrackRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${colorTokens.border.primary};
  min-width: 100%;

  &:last-child {
    border-bottom: none;
  }
`;

const TrackLabel = styled.div`
  flex: 0 0 120px;
  padding: ${spacing.md};
  background: ${colorTokens.background.primary};
  border-right: 2px solid ${colorTokens.border.primary};
  font-weight: 600;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};
  display: flex;
  align-items: center;
`;

const TrackTimeline = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  background: ${colorTokens.background.primary};
  align-items: center;
  min-height: 60px;
`;

const TimelineClipElement = styled.div<{ status: string }>`
  position: absolute;
  height: 90%;
  background: linear-gradient(135deg, ${colorTokens.primary.main}, ${colorTokens.primary.dark});
  border: 1px solid ${(props) => {
    switch (props.status) {
      case 'locked':
        return '#28a745';
      case 'approved':
        return '#0056b3';
      default:
        return '#ffc107';
    }
  }};
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  padding: 0 ${spacing.sm};
  font-size: 11px;
  color: white;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 4px 12px ${colorTokens.shadow}30;
    transform: scaleY(1.1);
  }

  &:active {
    cursor: grabbing;
  }
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const StatLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 1.3em;
  font-weight: 700;
  color: ${colorTokens.text.primary};
`;

const EditingTimeline: React.FC = () => {
  const [tracks] = useState<EditingTrack[]>([
    {
      trackId: 'v1',
      trackName: 'Video 1',
      type: 'video',
      clips: [
        { id: 'c1', startTime: 0, endTime: 3.2, shotNumber: 1, notes: 'Wide shot', status: 'locked' },
        { id: 'c2', startTime: 3.2, endTime: 5.8, shotNumber: 2, notes: 'Close-up', status: 'locked' },
        { id: 'c3', startTime: 5.8, endTime: 9.0, shotNumber: 3, notes: 'POV', status: 'approved' },
      ],
    },
    {
      trackId: 'a1',
      trackName: 'Audio 1',
      type: 'audio',
      clips: [
        { id: 'a1', startTime: 0, endTime: 9.0, shotNumber: 0, notes: 'Dialogue', status: 'locked' },
      ],
    },
  ]);

  const totalDuration = 120; // seconds
  const usedDuration = tracks.reduce((max, track) => {
    const trackMax = track.clips.reduce((m, clip) => Math.max(m, clip.endTime), 0);
    return Math.max(max, trackMax);
  }, 0);

  const getClipPosition = (startTime: number, totalDuration: number): string => {
    return `${(startTime / totalDuration) * 100}%`;
  };

  const getClipWidth = (startTime: number, endTime: number, totalDuration: number): string => {
    return `${((endTime - startTime) / totalDuration) * 100}%`;
  };

  return (
    <TimelineContainer>
      <Header>
        <Title>✂️ Editing Timeline</Title>
        <ControlBar>
          <Button>⏮ Start</Button>
          <Button>⏯ Play</Button>
          <Button>⏭ End</Button>
          <Button>🔄 Undo</Button>
          <Button>➡️ Redo</Button>
        </ControlBar>
      </Header>

      <TimelineWrapper>
        <TimelineContent>
          <TimelineRuler>
            {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((time) => (
              <TimelineMarker key={time}>{time}s</TimelineMarker>
            ))}
          </TimelineRuler>

          {tracks.map((track) => (
            <TrackRow key={track.trackId}>
              <TrackLabel>{track.trackName}</TrackLabel>
              <TrackTimeline>
                {track.clips.map((clip) => (
                  <TimelineClipElement
                    key={clip.id}
                    status={clip.status}
                    style={{
                      left: getClipPosition(clip.startTime, totalDuration),
                      width: getClipWidth(clip.startTime, clip.endTime, totalDuration),
                    }}
                    title={clip.notes}
                  >
                    Shot {clip.shotNumber}
                  </TimelineClipElement>
                ))}
              </TrackTimeline>
            </TrackRow>
          ))}
        </TimelineContent>
      </TimelineWrapper>

      <StatsPanel>
        <StatItem>
          <StatLabel>Total Duration</StatLabel>
          <StatValue>{usedDuration.toFixed(1)}s</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Video Clips</StatLabel>
          <StatValue>{tracks.find((t) => t.type === 'video')?.clips.length || 0}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Audio Tracks</StatLabel>
          <StatValue>{tracks.filter((t) => t.type === 'audio').length}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Status</StatLabel>
          <StatValue>Draft</StatValue>
        </StatItem>
      </StatsPanel>
    </TimelineContainer>
  );
};

export default EditingTimeline;
