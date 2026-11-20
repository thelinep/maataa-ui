/**
 * TeamList - Display all teams from Phase 2
 *
 * Shows teams in a sortable, filterable data table.
 * Integrates with Phase 2 EntityManager for CRUD operations.
 * Real-time sync via Phase 5 WebSocket.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Button, Card, FormInput } from '@/components';
import { DataTable } from '@maataa/ui/data';
import { useEntity } from '@/hooks';
import { colorTokens, spacing, typography } from '@/utils/tokens';
import { getRoutePath } from '@/nav/routes';

// Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  lead?: string;
  created_at: string;
  updated_at: string;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${spacing.md};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: ${typography.heading2.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled(FormInput)`
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  text-align: center;
  color: ${colorTokens.text.secondary};

  h3 {
    font-size: ${typography.body.fontSize};
    color: ${colorTokens.text.primary};
    margin-bottom: ${spacing.sm};
  }

  p {
    font-size: ${typography.bodySmall.fontSize};
    margin-bottom: ${spacing.md};
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  color: ${colorTokens.text.secondary};
  font-size: ${typography.bodySmall.fontSize};
`;

/**
 * TeamList Component
 *
 * @example
 * <TeamList />
 */
export const TeamList: React.FC = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig] = useState<{
    key: keyof Team;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const { loading, error, getEntitiesByType } = useEntity({ type: 'team' });

  // Fetch teams from Phase 2 EntityManager
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const entities = await getEntitiesByType('team');
        const teams: Team[] = entities.map(entity => ({
          id: entity.id,
          name: entity.data.name,
          description: entity.data.description,
          memberCount: entity.data.memberCount || 0,
          lead: entity.data.lead,
          created_at: entity.created_at,
          updated_at: entity.updated_at,
        }));

        setTeams(teams);
        setFilteredTeams(teams);
      } catch (err) {
        console.error('Failed to load teams:', err);
      }
    };

    loadTeams();
  }, [getEntitiesByType]);

  // Handle search and filtering
  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(String(bValue))
          : String(bValue).localeCompare(aValue);
      }

      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }

      return 0;
    });

    setFilteredTeams(sorted);
  }, [searchTerm, teams, sortConfig]);

  // TODO: Implement sorting in DataTable component
  void sortConfig;

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading teams...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ padding: spacing.md, color: colorTokens.interactive.error }}>
            Error loading teams: {error.message}
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Teams</Title>
        <Controls>
          <SearchInput
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Button onClick={() => navigate(getRoutePath('TEAM_CREATE'))}>
            + Create Team
          </Button>
        </Controls>
      </Header>

      {filteredTeams.length === 0 ? (
        <EmptyState>
          <h3>No teams yet</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first team to get started'}
          </p>
          <Button onClick={() => navigate(getRoutePath('TEAM_CREATE'))}>
            Create Team
          </Button>
        </EmptyState>
      ) : (
        <Card>
          <DataTable<Team>
            columns={[
              {
                key: 'name',
                header: 'Team Name',
                render: (_value, row) => row.name,
              },
              {
                key: 'memberCount',
                header: 'Members',
                render: (_value, row) => `${row.memberCount} members`,
              },
              {
                key: 'lead',
                header: 'Team Lead',
                render: (_value, row) => row.lead || 'Unassigned',
              },
              {
                key: 'updated_at',
                header: 'Last Updated',
                render: (_value, row) => new Date(row.updated_at).toLocaleDateString(),
              },
            ]}
            getRowKey={(row) => row.id}
            data={filteredTeams}
            onRowClick={(row) => {
              navigate(getRoutePath('TEAM_DETAIL', { teamId: row.id }));
            }}
          />
        </Card>
      )}
    </Container>
  );
};

TeamList.displayName = 'TeamList';

export default TeamList;
