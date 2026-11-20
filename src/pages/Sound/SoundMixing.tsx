import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface AudioTrack {
  name: string;
  level: number;
  muted: boolean;
  solo: boolean;
}

const Container = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.lg} 0;
`;

const MixerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
`;

const TrackFader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  align-items: center;
`;

const TrackName = styled.div`
  font-weight: 600;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};
  text-align: center;
`;

const Fader = styled.input`
  width: 60px;
  height: 120px;
  -webkit-appearance: slider-vertical;
  writing-mode: bt-lr;
  cursor: pointer;
  accent-color: ${colorTokens.primary.main};
`;

const ControlButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-direction: column;
`;

const Button = styled.button`
  padding: 4px 8px;
  border: 1px solid ${colorTokens.border.primary};
  background: ${colorTokens.background.primary};
  color: ${colorTokens.text.primary};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${colorTokens.neutral.light};
  }

  &[data-active='true'] {
    background: ${colorTokens.primary.main};
    color: white;
    border-color: ${colorTokens.primary.main};
  }
`;

const SoundMixing: React.FC = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([
    { name: 'Dialogue', level: -3, muted: false, solo: false },
    { name: 'Music', level: -6, muted: false, solo: false },
    { name: 'Foley', level: -9, muted: false, solo: false },
    { name: 'Ambient', level: -12, muted: false, solo: false },
  ]);

  const handleLevelChange = (index: number, newLevel: number) => {
    const updated = [...tracks];
    updated[index].level = newLevel;
    setTracks(updated);
  };

  const handleMute = (index: number) => {
    const updated = [...tracks];
    updated[index].muted = !updated[index].muted;
    setTracks(updated);
  };

  const handleSolo = (index: number) => {
    const updated = tracks.map((t, i) => ({
      ...t,
      solo: i === index ? !t.solo : false,
    }));
    setTracks(updated);
  };

  return (
    <Container>
      <Title>🔊 Sound Mixing</Title>
      <MixerGrid>
        {tracks.map((track, index) => (
          <TrackFader key={index}>
            <TrackName>{track.name}</TrackName>
            <Fader
              type="range"
              min="-24"
              max="0"
              value={track.level}
              onChange={(e) => handleLevelChange(index, parseInt(e.target.value))}
            />
            <div style={{ fontSize: '11px', color: colorTokens.text.secondary }}>
              {track.level}dB
            </div>
            <ControlButtons>
              <Button data-active={track.muted} onClick={() => handleMute(index)}>
                M
              </Button>
              <Button data-active={track.solo} onClick={() => handleSolo(index)}>
                S
              </Button>
            </ControlButtons>
          </TrackFader>
        ))}
      </MixerGrid>
    </Container>
  );
};

export default SoundMixing;
