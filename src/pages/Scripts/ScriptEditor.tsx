import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntity } from '@/hooks/data/useFilmEntities';
import { ErrorState, LoadingState, NotFoundState } from '../shared/AsyncState';

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
  min-height: calc(100vh / var(--a11y-zoom, 1));

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EditorPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md};
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  border-left: 4px solid ${colorTokens.primary.main};
`;

const EditorTitle = styled.h2`
  font-family: ${typography.heading2.fontFamily};
  font-size: 1.3rem;
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.sm} ${spacing.md};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.bodySmall.fontSize};
  transition: all 0.2s;

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background: ${colorTokens.background.primary};
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

const TextEditor = styled.textarea`
  flex: 1;
  padding: ${spacing.md};
  border: 1px solid ${colorTokens.border.control};
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: ${colorTokens.text.primary};
  background: ${colorTokens.background.secondary};
  resize: none;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
    box-shadow: 0 0 0 3px ${colorTokens.primary.light}30;
  }

  &::placeholder {
    color: ${colorTokens.text.disabled};
  }
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const PanelCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  padding: ${spacing.md};
`;

const PanelTitle = styled.h3`
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.md} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VersionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const VersionItem = styled.button<{ $active?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  background: ${(props) => (props.$active ? colorTokens.primary.main : 'transparent')};
  color: ${(props) => (props.$active ? 'white' : colorTokens.text.secondary)};
  border: 1px solid ${(props) => (props.$active ? colorTokens.primary.main : colorTokens.border.primary)};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.bodySmall.fontSize};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${colorTokens.primary.main};
    background: ${(props) => (props.$active ? colorTokens.primary.dark : colorTokens.primary.light)}20;
  }
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  padding: ${spacing.sm} 0;
  border-bottom: 1px solid ${colorTokens.border.primary};

  &:last-child {
    border-bottom: none;
  }
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

export interface ScriptEditorProps {
  scriptId?: string;
  /** Recorded as the author of new versions */
  currentUser?: string;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ scriptId, currentUser = 'You' }) => {
  const { item: scriptData, loading, error, update } = useFilmEntity('script', scriptId);
  const [activeVersion, setActiveVersion] = useState<number | null>(null);
  const [scriptContent, setScriptContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Load the current version into the editor whenever a different script opens
  const loadedId = scriptData?.id;
  useEffect(() => {
    if (!scriptData) return;
    const current =
      scriptData.versions.find((v) => v.version === scriptData.currentVersion) ??
      scriptData.versions[scriptData.versions.length - 1];
    setActiveVersion(current?.version ?? null);
    setScriptContent(current?.content ?? '');
    // Runs only when a different script is loaded; scriptData is read from that load.
  }, [loadedId]);

  if (error) return <ErrorState error={error} />;
  if (loading) return <LoadingState label="Loading script…" />;
  if (!scriptData) return <NotFoundState label="Script not found." />;

  const currentVersionData = scriptData.versions.find((v) => v.version === activeVersion);
  const isLocked = scriptData.status === 'locked';
  const isDirty = scriptContent !== (currentVersionData?.content ?? '');
  const pageCount = scriptContent.split('\n').length / 3; // Rough estimate
  const wordCount = scriptContent.trim() ? scriptContent.trim().split(/\s+/).length : 0;

  /** Saving never overwrites history: each save appends a new version */
  const handleSave = async () => {
    if (!isDirty || isLocked || saving) return;
    setSaving(true);
    try {
      const nextVersion = Math.max(0, ...scriptData.versions.map((v) => v.version)) + 1;
      await update({
        versions: [
          ...scriptData.versions,
          {
            version: nextVersion,
            content: scriptContent,
            changesSummary: `Edited from v${activeVersion ?? scriptData.currentVersion}`,
            createdAt: new Date(),
            createdBy: currentUser,
          },
        ],
        currentVersion: nextVersion,
        lastEditedBy: currentUser,
      });
      setActiveVersion(nextVersion);
    } catch {
      // surfaced via `error`
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLock = async () => {
    try {
      await update({ status: isLocked ? 'draft' : 'locked', lastEditedBy: currentUser });
    } catch {
      // surfaced via `error`
    }
  };

  return (
    <EditorContainer>
      <EditorPanel>
        <EditorHeader>
          <EditorTitle>{scriptData.title}</EditorTitle>
          <ActionButtons>
            <Button variant="secondary" onClick={handleSave} disabled={!isDirty || isLocked || saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button onClick={handleToggleLock}>{isLocked ? 'Unlock' : 'Lock Version'}</Button>
          </ActionButtons>
        </EditorHeader>

        <TextEditor
          value={scriptContent}
          onChange={(e) => setScriptContent(e.target.value)}
          placeholder="Start typing your script..."
          readOnly={isLocked}
          aria-label="Script content"
        />
      </EditorPanel>

      <SidePanel>
        <PanelCard>
          <PanelTitle>Versions</PanelTitle>
          <VersionList>
            {scriptData.versions.map((v) => (
              <VersionItem
                key={v.version}
                $active={activeVersion === v.version}
                aria-current={activeVersion === v.version ? "true" : undefined}
                onClick={() => {
                  setActiveVersion(v.version);
                  setScriptContent(v.content);
                }}
              >
                <div style={{ fontSize: typography.bodySmall.fontSize, fontWeight: 600 }}>v{v.version}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{v.createdBy}</div>
              </VersionItem>
            ))}
          </VersionList>
        </PanelCard>

        <PanelCard>
          <PanelTitle>Statistics</PanelTitle>
          <StatsList>
            <StatItem>
              <span>Pages</span>
              <StatValue>{Math.ceil(pageCount)}</StatValue>
            </StatItem>
            <StatItem>
              <span>Words</span>
              <StatValue>{wordCount}</StatValue>
            </StatItem>
            <StatItem>
              <span>Format</span>
              <StatValue>{scriptData.format === 'feature' ? 'Feature' : 'Short'}</StatValue>
            </StatItem>
            <StatItem>
              <span>Status</span>
              <StatValue>{scriptData.status}</StatValue>
            </StatItem>
          </StatsList>
        </PanelCard>

        <PanelCard>
          <PanelTitle>Current Version</PanelTitle>
          {currentVersionData ? (
            <StatsList>
              <StatItem>
                <span>Version</span>
                <StatValue>{currentVersionData.version}</StatValue>
              </StatItem>
              <StatItem style={{ flexDirection: 'column', borderBottom: 'none' }}>
                <span>By {currentVersionData.createdBy}</span>
                <span style={{ fontSize: '11px', marginTop: spacing.xs }}>
                  {new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(currentVersionData.createdAt)}
                </span>
              </StatItem>
            </StatsList>
          ) : (
            <StatsList>
              <StatItem>No versions yet</StatItem>
            </StatsList>
          )}
        </PanelCard>
      </SidePanel>
    </EditorContainer>
  );
};

export default ScriptEditor;
