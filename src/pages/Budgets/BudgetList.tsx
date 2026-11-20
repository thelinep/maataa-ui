/**
 * BudgetList - Display all budgets from Phase 2
 *
 * Shows budgets in a data table with financial metrics.
 * Integrates with Phase 2 EntityManager for CRUD operations.
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
export interface Budget {
  id: string;
  name: string;
  description?: string;
  allocated: number; // Total allocated amount
  spent: number; // Amount spent so far
  remaining: number; // Allocated - Spent
  currency: string; // USD, EUR, etc.
  owner?: string;
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

const ProgressBar = styled.div<{ percentage: number }>`
  height: 8px;
  background-color: ${colorTokens.border.primary};
  border-radius: 4px;
  overflow: hidden;
  flex: 1;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => `${Math.min(props.percentage, 100)}%`};
    background-color: ${(props) =>
      props.percentage > 100 ? colorTokens.interactive.error : colorTokens.interactive.success};
  }
`;

const BudgetMetric = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm};
`;

const MetricValue = styled.span`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
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
 * BudgetList Component
 *
 * @example
 * <BudgetList />
 */
export const BudgetList: React.FC = () => {
  const navigate = useNavigate();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig] = useState<{
    key: keyof Budget;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const { loading, error, getEntitiesByType } = useEntity({ type: 'budget' });

  // Fetch budgets from Phase 2 EntityManager
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const entities = await getEntitiesByType('budget');
        const budgets: Budget[] = entities.map(entity => ({
          id: entity.id,
          name: entity.data.name,
          description: entity.data.description,
          allocated: entity.data.allocated || 0,
          spent: entity.data.spent || 0,
          remaining: (entity.data.allocated || 0) - (entity.data.spent || 0),
          currency: entity.data.currency || 'USD',
          owner: entity.data.owner,
          created_at: entity.created_at,
          updated_at: entity.updated_at,
        }));

        setBudgets(budgets);
        setFilteredBudgets(budgets);
      } catch (err) {
        console.error('Failed to load budgets:', err);
      }
    };

    loadBudgets();
  }, [getEntitiesByType]);

  // Handle search and filtering
  useEffect(() => {
    const filtered = budgets.filter((budget) =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredBudgets(sorted);
  }, [searchTerm, budgets, sortConfig]);

  // TODO: Implement sorting in DataTable component
  void sortConfig;

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading budgets...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ padding: spacing.md, color: colorTokens.interactive.error }}>
            Error loading budgets: {error.message}
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Budgets</Title>
        <Controls>
          <SearchInput
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Button onClick={() => navigate(getRoutePath('BUDGET_CREATE'))}>
            + Create Budget
          </Button>
        </Controls>
      </Header>

      {filteredBudgets.length === 0 ? (
        <EmptyState>
          <h3>No budgets yet</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first budget to get started'}
          </p>
          <Button onClick={() => navigate(getRoutePath('BUDGET_CREATE'))}>
            Create Budget
          </Button>
        </EmptyState>
      ) : (
        <Card>
          <DataTable<Budget>
            columns={[
              {
                key: 'name',
                header: 'Budget Name',
                render: (_value, row) => row.name,
              },
              {
                key: 'allocated',
                header: 'Allocated',
                render: (_value, row) => `${row.currency} ${row.allocated.toLocaleString()}`,
              },
              {
                key: 'spent',
                header: 'Spent',
                render: (_value, row) => `${row.currency} ${row.spent.toLocaleString()}`,
              },
              {
                key: 'progress',
                header: 'Progress',
                render: (_value, row) => (
                  <BudgetMetric>
                    <ProgressBar percentage={(row.spent / row.allocated) * 100} />
                    <MetricValue>{((row.spent / row.allocated) * 100).toFixed(0)}%</MetricValue>
                  </BudgetMetric>
                ),
              },
              {
                key: 'updated_at',
                header: 'Last Updated',
                render: (_value, row) => new Date(row.updated_at).toLocaleDateString(),
              },
            ]}
            getRowKey={(row) => row.id}
            data={filteredBudgets}
            onRowClick={(row) => {
              navigate(getRoutePath('BUDGET_DETAIL', { budgetId: row.id }));
            }}
          />
        </Card>
      )}
    </Container>
  );
};

BudgetList.displayName = 'BudgetList';

export default BudgetList;
