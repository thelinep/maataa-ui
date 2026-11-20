import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface ScriptVersion {
  version: number;
  createdAt: Date;
  createdBy: string;
  changesSummary: string;
}

interface ScriptData {
  id: string;
  title: string;
  format: 'feature' | 'short';
  pages: number;
  currentVersion: number;
  status: 'draft' | 'locked' | 'approved';
  versions: ScriptVersion[];
}

const DetailContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.lg};
  gap: ${spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${typography.body.fontFamily};
  transition: all 0.2s;

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

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  padding: ${spacing.lg};
  border-radius: 8px;
`;

const MetadataItem = styled.div``;

const MetadataLabel = styled.span`
  display: block;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${spacing.xs};
`;

const MetadataValue = styled.span`
  display: block;
  font-size: ${typography.body.fontSize};
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
      case 'draft':
        return '#e9ecef';
      case 'locked':
        return '#fff3cd';
      case 'approved':
        return '#d4edda';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'draft':
        return '#495057';
      case 'locked':
        return '#856404';
      case 'approved':
        return '#155724';
      default:
        return '#495057';
    }
  }};
`;

const Section = styled.div`
  margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${typography.heading2.fontFamily};
  font-size: 1.3rem;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.lg} 0;
  padding-bottom: ${spacing.md};
  border-bottom: 2px solid ${colorTokens.border.primary};
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  border-left: 2px solid ${colorTokens.border.primary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 24px;
    width: 10px;
    height: 10px;
    background: ${colorTokens.primary.main};
    border-radius: 50%;
  }

  &:last-child {
    border-left-color: transparent;
  }
`;

const TimelineDate = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  font-weight: 600;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const TimelineVersion = styled.div`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};
`;

const TimelineAuthor = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const ChangesSummary = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  background: ${colorTokens.background.secondary};
  padding: ${spacing.md};
  border-radius: 6px;
  margin-top: ${spacing.sm};
`;

const ScriptDetail: React.FC<{ scriptId?: string }> = ({ scriptId }) => {
  // Mock data
  const [scriptData] = useState<ScriptData>({
    id: scriptId || 'script-1',
    title: 'The Lost Highway - Revised',
    format: 'feature',
    pages: 127,
    currentVersion: 5,
    status: 'locked',
    versions: [
      {
        version: 1,
        createdAt: new Date('2026-11-01'),
        createdBy: 'Hemant',
        changesSummary: 'Initial draft - full screenplay written',
      },
      {
        version: 2,
        createdAt: new Date('2026-11-05'),
        createdBy: 'Dev',
        changesSummary: 'Scene revisions - improved pacing in Act 2',
      },
      {
        version: 3,
        createdAt: new Date('2026-11-10'),
        createdBy: 'Hemant',
        changesSummary: 'Character development - deepened protagonist backstory',
      },
      {
        version: 4,
        createdAt: new Date('2026-11-15'),
        createdBy: 'Hemant',
        changesSummary: 'Dialogue polish - refined key conversations',
      },
      {
        version: 5,
        createdAt: new Date('2026-11-18'),
        createdBy: 'Hemant',
        changesSummary: 'Final revision - locked for pre-production',
      },
    ],
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <DetailContainer>
      <Header>
        <TitleSection>
          <Title>{scriptData.title}</Title>
        </TitleSection>
        <ActionButtons>
          <Button variant="secondary">Share</Button>
          <Button variant="secondary">Download PDF</Button>
          <Button>Open Editor</Button>
        </ActionButtons>
      </Header>

      <MetadataGrid>
        <MetadataItem>
          <MetadataLabel>Format</MetadataLabel>
          <MetadataValue>{scriptData.format === 'feature' ? 'Feature Film' : 'Short Film'}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Pages</MetadataLabel>
          <MetadataValue>{scriptData.pages}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Current Version</MetadataLabel>
          <MetadataValue>v{scriptData.currentVersion}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Status</MetadataLabel>
          <StatusBadge status={scriptData.status}>
            {scriptData.status.charAt(0).toUpperCase() + scriptData.status.slice(1)}
          </StatusBadge>
        </MetadataItem>
      </MetadataGrid>

      <Section>
        <SectionTitle>Version History</SectionTitle>
        <Timeline>
          {scriptData.versions
            .slice()
            .reverse()
            .map((version) => (
              <TimelineItem key={version.version}>
                <TimelineDate>{formatDate(version.createdAt)}</TimelineDate>
                <TimelineContent>
                  <TimelineVersion>Version {version.version}</TimelineVersion>
                  <TimelineAuthor>by {version.createdBy}</TimelineAuthor>
                  <ChangesSummary>{version.changesSummary}</ChangesSummary>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </Section>
    </DetailContainer>
  );
};

export default ScriptDetail;
