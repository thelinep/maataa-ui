import React, { useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

interface Concept {
  id: string;
  title: string;
  vision: string;
  genre: string[];
  format: 'feature' | 'short' | 'series';
  duration: number;
  status: 'ideation' | 'pitch' | 'approved';
  budgetEstimate: number;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Array<{ url: string; type: string; name: string }>;
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

const Subtitle = styled.p`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.md};
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

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  background: ${colorTokens.background.secondary};
  padding: ${spacing.lg};
  border-radius: 8px;
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const MetadataLabel = styled.span`
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetadataValue = styled.span`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 20px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case 'ideation':
        return '#fff3cd';
      case 'pitch':
        return '#ffe5cc';
      case 'approved':
        return '#d4edda';
      default:
        return '#e9ecef';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'ideation':
        return '#856404';
      case 'pitch':
        return '#994700';
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
  margin: 0 0 ${spacing.md} 0;
  padding-bottom: ${spacing.md};
  border-bottom: 2px solid ${colorTokens.border.primary};
`;

const VisionText = styled.p`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
  line-height: 1.6;
  margin: 0;
  background: ${colorTokens.background.secondary};
  padding: ${spacing.lg};
  border-radius: 8px;
`;

const GenreTag = styled.span`
  display: inline-block;
  padding: 6px 12px;
  margin-right: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  background: ${colorTokens.primary.light}30;
  color: ${colorTokens.primary.main};
  border-radius: 20px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
`;

const AttachmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${spacing.md};
  margin-top: ${spacing.md};
`;

const AttachmentItem = styled.div`
  aspect-ratio: 4 / 3;
  background: ${colorTokens.background.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: 8px;
  padding: ${spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${colorTokens.primary.main};
    background: ${colorTokens.primary.light}10;
  }
`;

const ConceptDetail: React.FC<{ conceptId?: string }> = ({ conceptId }) => {
  // Mock data - replace with Phase 2 EntityManager
  const [concept] = useState<Concept>({
    id: conceptId || 'concept-1',
    title: 'The Lost Highway',
    vision: 'A noir thriller following a jazz musician who discovers a mysterious past life.',
    genre: ['Thriller', 'Drama', 'Neo-Noir'],
    format: 'feature',
    duration: 120,
    status: 'approved',
    budgetEstimate: 2500000,
    createdAt: new Date('2026-11-01'),
    updatedAt: new Date('2026-11-15'),
    attachments: [],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          <Title>{concept.title}</Title>
          <Subtitle>{concept.format.toUpperCase()} • {concept.duration} min</Subtitle>
        </TitleSection>
        <ActionButtons>
          <Button variant="secondary">Share</Button>
          <Button>Edit Concept</Button>
        </ActionButtons>
      </Header>

      <MetadataGrid>
        <MetadataItem>
          <MetadataLabel>Status</MetadataLabel>
          <StatusBadge status={concept.status}>
            {concept.status.charAt(0).toUpperCase() + concept.status.slice(1)}
          </StatusBadge>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Budget</MetadataLabel>
          <MetadataValue>{formatCurrency(concept.budgetEstimate)}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Duration</MetadataLabel>
          <MetadataValue>{concept.duration} minutes</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Format</MetadataLabel>
          <MetadataValue>{concept.format.charAt(0).toUpperCase() + concept.format.slice(1)}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Created</MetadataLabel>
          <MetadataValue>{formatDate(concept.createdAt)}</MetadataValue>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Updated</MetadataLabel>
          <MetadataValue>{formatDate(concept.updatedAt)}</MetadataValue>
        </MetadataItem>
      </MetadataGrid>

      <Section>
        <SectionTitle>Vision & Concept</SectionTitle>
        <VisionText>{concept.vision}</VisionText>
      </Section>

      <Section>
        <SectionTitle>Genres</SectionTitle>
        <div>
          {concept.genre.map((g) => (
            <GenreTag key={g}>{g}</GenreTag>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle>Vision Board & Attachments</SectionTitle>
        <AttachmentsGrid>
          {[1, 2, 3, 4].map((i) => (
            <AttachmentItem key={i}>
              <div style={{ textAlign: 'center', color: colorTokens.text.disabled }}>
                <div style={{ fontSize: '2em' }}>📷</div>
                <p>Upload image</p>
              </div>
            </AttachmentItem>
          ))}
        </AttachmentsGrid>
      </Section>
    </DetailContainer>
  );
};

export default ConceptDetail;
