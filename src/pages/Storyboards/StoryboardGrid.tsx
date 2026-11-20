import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface Shot {
  shotNumber: number;
  sceneNumber: number;
  description: string;
  duration: number;
  cameraMove: string;
  imageUrl?: string;
}

interface Scene {
  sceneNumber: number;
  title: string;
  shots: Shot[];
}

const GridContainer = styled.div`
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
  margin: 0 0 ${spacing.sm} 0;
`;

const ActionBar = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${typography.body.fontFamily};

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background: ${colorTokens.background.secondary};
    color: ${colorTokens.text.primary};
    border: 1px solid ${colorTokens.border.primary};

    &:hover {
      background: ${colorTokens.neutral.light};
    }
  `
      : `
    background: ${colorTokens.primary.main};
    color: white;

    &:hover {
      background: ${colorTokens.primary.dark};
    }
  `}
`;

const ScenesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

const SceneSection = styled.div`
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colorTokens.border.primary};
`;

const SceneHeader = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  background: linear-gradient(135deg, ${colorTokens.primary.main}, ${colorTokens.primary.dark});
  color: white;
`;

const SceneTitle = styled.h2`
  font-family: ${typography.heading2.fontFamily};
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
`;

const ShotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.md};
  padding: ${spacing.lg};
`;

const ShotCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  background: ${colorTokens.background.primary};
  border: 2px solid ${colorTokens.border.primary};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${colorTokens.primary.main};
    box-shadow: 0 4px 12px ${colorTokens.shadow}10;
  }
`;

const ShotThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, ${colorTokens.primary.light}30, ${colorTokens.secondary.light}30);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5em;
  color: ${colorTokens.text.disabled};
`;

const ShotContent = styled.div`
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const ShotNumber = styled.div`
  font-weight: 700;
  color: ${colorTokens.primary.main};
  font-size: ${typography.bodySmall.fontSize};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ShotDescription = styled.p`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
  line-height: 1.4;
  min-height: 2.8em;
`;

const ShotFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${colorTokens.text.disabled};
  padding-top: ${spacing.sm};
  border-top: 1px solid ${colorTokens.border.primary};
`;

const StoryboardGrid: React.FC<{ storyboardId?: string }> = ({ storyboardId }) => {
  // Mock data
  const [scenes] = useState<Scene[]>([
    {
      sceneNumber: 1,
      title: 'EXT. HIGHWAY - NIGHT',
      shots: [
        {
          shotNumber: 1,
          sceneNumber: 1,
          description: 'Wide establishing shot of empty highway',
          duration: 3,
          cameraMove: 'Static',
        },
        {
          shotNumber: 2,
          sceneNumber: 1,
          description: 'Close-up of road markings',
          duration: 2,
          cameraMove: 'Push in',
        },
      ],
    },
    {
      sceneNumber: 2,
      title: 'INT. CAR - CONTINUOUS',
      shots: [
        {
          shotNumber: 3,
          sceneNumber: 2,
          description: 'Driver POV through windshield',
          duration: 4,
          cameraMove: 'Steady cam',
        },
        {
          shotNumber: 4,
          sceneNumber: 2,
          description: 'Profile of driver in dim light',
          duration: 3,
          cameraMove: 'Pan right',
        },
      ],
    },
  ]);

  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  return (
    <GridContainer>
      <Header>
        <Title>🎬 Storyboard: {storyboardId}</Title>
        <ActionBar>
          <Button variant="secondary">📥 Import</Button>
          <Button variant="secondary">📤 Export</Button>
          <Button>Add Scene</Button>
        </ActionBar>
      </Header>

      <ScenesContainer>
        {scenes.map((scene) => (
          <SceneSection key={scene.sceneNumber}>
            <SceneHeader>
              <SceneTitle>
                Scene {scene.sceneNumber}: {scene.title}
              </SceneTitle>
            </SceneHeader>
            <ShotsGrid>
              {scene.shots.map((shot) => (
                <ShotCell key={shot.shotNumber} onClick={() => setSelectedShot(shot)}>
                  <ShotThumbnail>🎥</ShotThumbnail>
                  <ShotContent>
                    <ShotNumber>Shot {shot.shotNumber}</ShotNumber>
                    <ShotDescription>{shot.description}</ShotDescription>
                    <ShotFooter>
                      <span>{shot.duration}s</span>
                      <span>{shot.cameraMove}</span>
                    </ShotFooter>
                  </ShotContent>
                </ShotCell>
              ))}
            </ShotsGrid>
          </SceneSection>
        ))}
      </ScenesContainer>
    </GridContainer>
  );
};

export default StoryboardGrid;
