/**
 * ProjectList - Display all projects from Phase 2
 *
 * Shows projects in a sortable, filterable data table.
 * Integrates with Phase 2 EntityManager for CRUD operations.
 * Real-time sync via Phase 5 WebSocket.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Button, Card } from '@/components';
import { SearchInput } from '@maataa/ui/forms';
import { DataTable } from '@maataa/ui/data';
import { useFilmEntities } from '@/hooks/data/useFilmEntities';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';
import { getRoutePath } from '@/nav/routes';

// Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  teamSize: number;
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

const SearchBox = styled.div`
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StatusBadge = styled.span<{ status: Project['status'] }>`
  display: inline-flex;
  align-items: center;
  padding: 4px ${spacing.sm};
  border-radius: ${borderRadius.md};
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case 'active':
        return colorTokens.interactive.success;
      case 'planning':
        return colorTokens.interactive.info;
      case 'paused':
        return colorTokens.interactive.warning;
      case 'completed':
        return colorTokens.interactive.secondary;
      default:
        return colorTokens.border.primary;
    }
  }};
  color: ${colorTokens.background.primary};
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
 * ProjectList Component
 *
 * @example
 * <ProjectList />
 */
export const ProjectList: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig] = useState<{
    key: keyof Project;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const { items, loading, error } = useFilmEntities('project');

  // Rows for the table, kept in step with the store
  useEffect(() => {
    const rows: Project[] = items.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          status: r.status,
          teamSize: r.teamMembers.length,
          created_at: r.createdAt.toISOString(),
          updated_at: r.updatedAt.toISOString(),
    }));
    setProjects(rows);
    setFilteredProjects(rows);
  }, [items]);

  // Handle search and filtering
  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredProjects(sorted);
  }, [searchTerm, projects, sortConfig]);

  // TODO: Implement sorting in DataTable component
  void sortConfig;

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading projects...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ padding: spacing.md, color: colorTokens.interactive.error }}>
            Error loading projects: {error.message}
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Projects</Title>
        <Controls>
          <SearchBox>
            <SearchInput
              aria-label="Search projects"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </SearchBox>
          <Button onClick={() => navigate(getRoutePath('PROJECT_CREATE'))}>
            + Create Project
          </Button>
        </Controls>
      </Header>

      {filteredProjects.length === 0 ? (
        <EmptyState>
          <h3>No projects yet</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first project to get started'}
          </p>
          <Button onClick={() => navigate(getRoutePath('PROJECT_CREATE'))}>
            Create Project
          </Button>
        </EmptyState>
      ) : (
        <Card>
          <DataTable<Project>
            columns={[
              {
                key: 'name',
                header: 'Project Name',
                render: (_value, row) => row.name,
              },
              {
                key: 'status',
                header: 'Status',
                render: (_value, row) => (
                  <StatusBadge status={row.status}>{row.status}</StatusBadge>
                ),
              },
              {
                key: 'teamSize',
                header: 'Team Size',
                render: (_value, row) => `${row.teamSize} members`,
              },
              {
                key: 'updated_at',
                header: 'Last Updated',
                render: (_value, row) => new Date(row.updated_at).toLocaleDateString(),
              },
            ]}
            getRowKey={(row) => row.id}
            data={filteredProjects}
            onRowClick={(row) => {
              navigate(getRoutePath('PROJECT_DETAIL', { projectId: row.id }));
            }}
          />
        </Card>
      )}

    </Container>
  );
};

ProjectList.displayName = 'ProjectList';

export default ProjectList;
