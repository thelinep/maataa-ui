import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntity } from '@/hooks/data/useFilmEntities';
import type { AudioTrack } from '@/core/film/types';
import { ErrorState, LoadingState, NotFoundState } from '../shared/AsyncState';

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
  /* Standard vertical range input: bottom = min, top = max */
  writing-mode: vertical-lr;
  direction: rtl;
  cursor: pointer;
  accent-color: ${colorTokens.primary.main};
`;

const ControlButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-direction: column;
`;

const Button = styled.button`
  /* WCAG 2.5.8: at least 24 x 24 CSS px */
  min-width: 28px;
  min-height: 28px;
  padding: 4px 8px;
  border: 1px solid ${colorTokens.border.control};
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

export interface SoundMixingProps {
  mixId?: string;
}

const SoundMixing: React.FC<SoundMixingProps> = ({ mixId }) => {
  const { item: mix, loading, error, update } = useFilmEntity('sound', mixId);

  if (error) return <ErrorState error={error} />;
  if (loading) return <LoadingState label="Loading mix…" />;
  if (!mix) return <NotFoundState label="Mix session not found." />;

  const tracks = mix.tracks;
  const setTracks = (next: AudioTrack[]) => {
    update({ tracks: next }).catch(() => {
      // surfaced via `error`
    });
  };

  const handleLevelChange = (index: number, newLevel: number) => {
    setTracks(tracks.map((t, i) => (i === index ? { ...t, level: newLevel } : t)));
  };

  const handleMute = (index: number) => {
    setTracks(tracks.map((t, i) => (i === index ? { ...t, muted: !t.muted } : t)));
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
          <TrackFader key={track.name}>
            <TrackName>{track.name}</TrackName>
            <Fader
              type="range"
              min="-24"
              max="0"
              value={track.level}
              aria-label={`${track.name} level`}
              onChange={(e) => handleLevelChange(index, parseInt(e.target.value, 10))}
            />
            <div style={{ fontSize: '11px', color: colorTokens.text.secondary }}>
              {track.level}dB
            </div>
            <ControlButtons>
              <Button data-active={track.muted} aria-pressed={track.muted} aria-label={`Mute ${track.name}`} onClick={() => handleMute(index)}>
                M
              </Button>
              <Button data-active={track.solo} aria-pressed={track.solo} aria-label={`Solo ${track.name}`} onClick={() => handleSolo(index)}>
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
