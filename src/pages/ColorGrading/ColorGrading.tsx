import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface ColorCorrection {
  sceneNumber: number;
  status: 'pending' | 'in-progress' | 'approved';
  colorist: string;
  lut: string;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.lg};
`;

const SceneCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  border: 1px solid ${colorTokens.border.primary};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px ${colorTokens.shadow}10;
  }
`;

const SceneLabel = styled.div`
  font-weight: 700;
  color: ${colorTokens.primary.main};
`;

const Preview = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colorTokens.text.disabled};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case 'approved':
        return '#d4edda';
      case 'in-progress':
        return '#cfe2ff';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'approved':
        return '#155724';
      case 'in-progress':
        return '#084298';
      default:
        return '#495057';
    }
  }};
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const ColorGrading: React.FC = () => {
  const [scenes] = useState<ColorCorrection[]>([
    { sceneNumber: 1, status: 'approved', colorist: 'Colorist A', lut: 'Cinematic Warm' },
    { sceneNumber: 2, status: 'in-progress', colorist: 'Colorist B', lut: 'Cool Tone' },
    { sceneNumber: 3, status: 'pending', colorist: '', lut: '' },
  ]);

  return (
    <Container>
      <Title>🎨 Color Grading</Title>
      <Grid>
        {scenes.map((scene) => (
          <SceneCard key={scene.sceneNumber}>
            <SceneLabel>Scene {scene.sceneNumber}</SceneLabel>
            <Preview>🎥</Preview>
            <StatusBadge status={scene.status}>
              {scene.status.replace('-', ' ').toUpperCase()}
            </StatusBadge>
            {scene.colorist && (
              <Info>
                <span>{scene.colorist}</span>
                <span>{scene.lut}</span>
              </Info>
            )}
          </SceneCard>
        ))}
      </Grid>
    </Container>
  );
};

export default ColorGrading;
