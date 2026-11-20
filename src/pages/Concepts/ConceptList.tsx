import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography } from '@/design-system/theme-colors';
import { useTranslation } from '@/hooks/useTranslation';

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
}

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
  font-size: ${typography.body.fontSize};
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
  font-size: ${typography.body.fontSize};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colorTokens.primary.main};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${colorTokens.background.secondary};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px ${colorTokens.shadow}10;
`;

const TableHeader = styled.thead`
  background: ${colorTokens.neutral.light};
  border-bottom: 2px solid ${colorTokens.border.primary};
`;

const TableHeaderCell = styled.th`
  padding: ${spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${colorTokens.text.primary};
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.bodySmall.fontSize};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colorTokens.border.primary};
  transition: background 0.2s;

  &:hover {
    background: ${colorTokens.neutral.lighter};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${spacing.md};
  color: ${colorTokens.text.secondary};
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
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

const GenreTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin-right: ${spacing.xs};
  background: ${colorTokens.neutral.lighter};
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.secondary};
`;

const FormatBadge = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  background: ${colorTokens.primary.light}30;
  color: ${colorTokens.primary.main};
  border-radius: 4px;
  font-size: ${typography.bodySmall.fontSize};
  font-weight: 600;
`;

const BudgetCell = styled(TableCell)`
  text-align: right;
  font-weight: 600;
  color: ${colorTokens.text.primary};
`;

const EmptyState = styled.div`
  padding: ${spacing.xl};
  text-align: center;
  color: ${colorTokens.text.secondary};
`;

const ConceptList: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - replace with Phase 2 EntityManager
  const [concepts] = useState<Concept[]>([
    {
      id: 'concept-1',
      title: 'The Lost Highway',
      vision: 'A noir thriller about a jazz musician searching for his past',
      genre: ['Thriller', 'Drama'],
      format: 'feature',
      duration: 120,
      status: 'approved',
      budgetEstimate: 2500000,
      createdAt: new Date('2026-11-01'),
      updatedAt: new Date('2026-11-15'),
    },
    {
      id: 'concept-2',
      title: 'Street Voices',
      vision: 'Documentary exploring street musicians in urban centers',
      genre: ['Documentary'],
      format: 'short',
      duration: 45,
      status: 'pitch',
      budgetEstimate: 150000,
      createdAt: new Date('2026-11-05'),
      updatedAt: new Date('2026-11-18'),
    },
    {
      id: 'concept-3',
      title: 'Neon Dreams',
      vision: 'Experimental short on virtual reality and identity',
      genre: ['Sci-Fi', 'Experimental'],
      format: 'short',
      duration: 15,
      status: 'ideation',
      budgetEstimate: 75000,
      createdAt: new Date('2026-11-10'),
      updatedAt: new Date('2026-11-20'),
    },
  ]);

  const filteredConcepts = useMemo(() => {
    return concepts.filter((concept) => {
      const matchesSearch =
        concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.vision.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || concept.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, concepts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <ListContainer>
      <Header>
        <Title>🎬 Concepts</Title>
        <CreateButton onClick={() => alert('Navigate to create concept')}>
          + New Concept
        </CreateButton>
      </Header>

      <FilterContainer>
        <FilterInput
          type="text"
          placeholder="Search concepts by title or vision..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <StatusFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="ideation">Ideation</option>
          <option value="pitch">Pitch</option>
          <option value="approved">Approved</option>
        </StatusFilter>
      </FilterContainer>

      {filteredConcepts.length > 0 ? (
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Genre</TableHeaderCell>
              <TableHeaderCell>Format</TableHeaderCell>
              <TableHeaderCell>Duration</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Budget</TableHeaderCell>
              <TableHeaderCell>Updated</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredConcepts.map((concept) => (
              <TableRow key={concept.id} onClick={() => alert(`View concept: ${concept.id}`)}>
                <TableCell style={{ fontWeight: 600, color: colorTokens.text.primary }}>
                  {concept.title}
                </TableCell>
                <TableCell>
                  {concept.genre.map((g) => (
                    <GenreTag key={g}>{g}</GenreTag>
                  ))}
                </TableCell>
                <TableCell>
                  <FormatBadge>{concept.format.toUpperCase()}</FormatBadge>
                </TableCell>
                <TableCell>{concept.duration} min</TableCell>
                <TableCell>
                  <StatusBadge status={concept.status}>
                    {concept.status.charAt(0).toUpperCase() + concept.status.slice(1)}
                  </StatusBadge>
                </TableCell>
                <BudgetCell>{formatCurrency(concept.budgetEstimate)}</BudgetCell>
                <TableCell>{formatDate(concept.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState>
          <p>No concepts found. Create your first concept to get started!</p>
        </EmptyState>
      )}
    </ListContainer>
  );
};

export default ConceptList;
