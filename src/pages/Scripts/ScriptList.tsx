import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';

import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import type { ScriptRecord } from '@/core/film/types';
import { ErrorState, LoadingState } from '../shared/AsyncState';

const ListContainer = styled.div`
  padding: ${spacing.lg};
  background: ${colorTokens.background.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h1`
  font-family: ${typography.heading2.fontFamily};
  font-size: ${typography.heading2.fontSize};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const CreateButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  background: ${colorTokens.primary.main};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${colorTokens.primary.dark};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
    box-shadow: 0 0 0 3px ${colorTokens.primary.light}30;
  }
`;

const StatusFilter = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 6px;
  font-family: ${typography.body.fontFamily};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${spacing.lg};
`;

const ScriptCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: 8px;
  padding: ${spacing.lg};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${colorTokens.shadow}15;
    border-color: ${colorTokens.primary.main};
  }
`;

const ScriptTitle = styled.h3`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const ScriptMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const VersionBadge = styled.span`
  background: ${colorTokens.primary.light}30;
  color: ${colorTokens.primary.main};
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: ${typography.bodySmall.fontSize};
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

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  font-size: ${typography.bodySmall.fontSize};
`;

const CardValue = styled.span`
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: ${spacing.xl};
  text-align: center;
  color: ${colorTokens.text.secondary};
`;

export interface ScriptListProps {
  onSelect?: (scriptId: string) => void;
  /** Called after "+ New Script" persists a blank draft */
  onCreated?: (script: ScriptRecord) => void;
  /** Concept the new draft belongs to */
  conceptId?: string;
  currentUser?: string;
}

const sortByUpdatedDesc = (a: ScriptRecord, b: ScriptRecord) => b.updatedAt.getTime() - a.updatedAt.getTime();

const ScriptList: React.FC<ScriptListProps> = ({ onSelect, onCreated, conceptId = '', currentUser = 'You' }) => {
  const { items: scripts, loading, error, create } = useFilmEntities('script', { sort: sortByUpdatedDesc });
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');


  const filteredScripts = useMemo(() => {
    return scripts.filter((script) => {
      const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || script.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, scripts]);

  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const now = new Date();
      const script = await create({
        title: 'Untitled Script',
        conceptId,
        format: 'feature',
        pages: 0,
        currentVersion: 1,
        status: 'draft',
        createdBy: currentUser,
        lastEditedBy: currentUser,
        versions: [{ version: 1, content: '', changesSummary: 'New draft', createdAt: now, createdBy: currentUser }],
      });
      onCreated?.(script);
    } catch {
      // surfaced via `error`
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <ListContainer>
      <Header>
        <Title>📝 Scripts</Title>
        <CreateButton onClick={handleCreate} disabled={creating}>
          + New Script
        </CreateButton>
      </Header>

      <FilterContainer>
        <FilterInput
          type="text"
          placeholder="Search scripts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <StatusFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="locked">Locked</option>
          <option value="approved">Approved</option>
        </StatusFilter>
      </FilterContainer>

      {error ? (
        <ErrorState error={error} />
      ) : loading ? (
        <LoadingState label="Loading scripts…" />
      ) : filteredScripts.length > 0 ? (
        <Grid>
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(script.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelect?.(script.id);
              }}
            >
              <ScriptTitle>{script.title}</ScriptTitle>
              <ScriptMeta>
                <span>{script.pages} pages</span>
                <VersionBadge>v{script.currentVersion}</VersionBadge>
              </ScriptMeta>
              <CardRow>
                <span>Format</span>
                <CardValue>{script.format === 'feature' ? 'Feature' : 'Short'}</CardValue>
              </CardRow>
              <CardRow>
                <span>Status</span>
                <StatusBadge status={script.status}>
                  {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
                </StatusBadge>
              </CardRow>
              <CardRow>
                <span>Last Edit</span>
                <CardValue>{formatDate(script.updatedAt)}</CardValue>
              </CardRow>
              <CardRow style={{ marginBottom: 0 }}>
                <span>Editor</span>
                <CardValue>{script.lastEditedBy}</CardValue>
              </CardRow>
            </ScriptCard>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <p>No scripts found. Create your first script to get started!</p>
        </EmptyState>
      )}
    </ListContainer>
  );
};

export default ScriptList;
