import React from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntity } from '@/hooks/data/useFilmEntities';
import { ErrorState, LoadingState, NotFoundState } from '../shared/AsyncState';

const LogContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Title = styled.h2`
  font-family: ${typography.heading2.fontFamily};
  font-size: 1.5rem;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.lg} 0;
`;

const VersionTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const VersionItem = styled.div`
  display: grid;
  grid-template-columns: 100px 150px 1fr 100px 100px;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colorTokens.background.secondary};
  border-left: 3px solid ${colorTokens.primary.main};
  border-bottom: 1px solid ${colorTokens.border.primary};
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const VersionNumber = styled.div`
  font-weight: 700;
  color: ${colorTokens.primary.main};
  font-size: ${typography.body.fontSize};
`;

const VersionDate = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const VersionChanges = styled.div`
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.secondary};
`;

const VersionDuration = styled.div`
  font-weight: 600;
  color: ${colorTokens.text.primary};
  text-align: right;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case 'draft':
        return '#cfe2ff';
      case 'review':
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
        return '#084298';
      case 'review':
        return '#856404';
      case 'approved':
        return '#155724';
      default:
        return '#495057';
    }
  }};
`;

export interface EditingLogProps {
  editId?: string;
}

const EditingLog: React.FC<EditingLogProps> = ({ editId }) => {
  const { item: edit, loading, error } = useFilmEntity('editing', editId);

  if (error) return <ErrorState error={error} />;
  if (loading) return <LoadingState label="Loading edit history…" />;
  if (!edit) return <NotFoundState label="Edit not found." />;

  const versions = edit.versions.slice().sort((a, b) => b.version - a.version);

  return (
    <LogContainer>
      <Title>📋 Editing Log</Title>
      <VersionTimeline>
        {versions.map((v) => (
          <VersionItem key={v.version}>
            <VersionNumber>v{v.version}</VersionNumber>
            <VersionDate>{v.date.toLocaleDateString()}</VersionDate>
            <VersionChanges>{v.changes}</VersionChanges>
            <VersionDuration>{v.duration}m</VersionDuration>
            <StatusBadge status={v.status}>{v.status}</StatusBadge>
          </VersionItem>
        ))}
      </VersionTimeline>
    </LogContainer>
  );
};

export default EditingLog;
