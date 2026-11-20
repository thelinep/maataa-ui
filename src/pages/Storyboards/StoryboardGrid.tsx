import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntity } from '@/hooks/data/useFilmEntities';
import type { StoryboardShot as Shot } from '@/core/film/types';
import { ErrorState, LoadingState, NotFoundState } from '../shared/AsyncState';

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

export interface StoryboardGridProps {
  storyboardId?: string;
  onImport?: (storyboardId: string) => void;
  onExport?: (storyboardId: string) => void;
}

const StoryboardGrid: React.FC<StoryboardGridProps> = ({ storyboardId, onImport, onExport }) => {
  const { item: storyboard, loading, error, update } = useFilmEntity('storyboard', storyboardId);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  if (error) return <ErrorState error={error} />;
  if (loading) return <LoadingState label="Loading storyboard…" />;
  if (!storyboard) return <NotFoundState label="Storyboard not found." />;

  const scenes = storyboard.scenes;

  const handleAddScene = async () => {
    const nextNumber = Math.max(0, ...scenes.map((s) => s.sceneNumber)) + 1;
    try {
      await update({ scenes: [...scenes, { sceneNumber: nextNumber, title: `Scene ${nextNumber}`, shots: [] }] });
    } catch {
      // surfaced via `error`
    }
  };

  return (
    <GridContainer>
      <Header>
        <Title>🎬 Storyboard: {storyboard.title}</Title>
        <ActionBar>
          <Button variant="secondary" onClick={() => onImport?.(storyboard.id)}>
            📥 Import
          </Button>
          <Button variant="secondary" onClick={() => onExport?.(storyboard.id)}>
            📤 Export
          </Button>
          <Button onClick={handleAddScene}>Add Scene</Button>
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
                <ShotCell
                  key={shot.shotNumber}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedShot?.shotNumber === shot.shotNumber}
                  onClick={() => setSelectedShot(shot)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSelectedShot(shot);
                  }}
                >
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
