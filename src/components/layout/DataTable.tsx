/**
 * DataTable - Data table component
 *
 * A table component for displaying data with sorting and styling.
 *
 * Features:
 * - Column definitions
 * - Sortable columns
 * - Striped rows
 * - Hover effects
 * - Design token integration
 * - Responsive scrolling
 */

import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';

export interface DataTableColumn<T = any> {
  id: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T = any> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Row data */
  data: T[];
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Whether rows are striped */
  striped?: boolean;
  /** Whether to show hover effect */
  hoverable?: boolean;
  /** Custom row key function */
  getRowKey?: (row: T, index: number) => string | number;
  /** Maximum height with scroll */
  maxHeight?: string;
}

// Container
const Container = styled.div<{ $maxHeight?: string }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  overflow: hidden;
`;

// Wrapper for scrolling
const ScrollWrapper = styled.div<{ $maxHeight?: string }>`
  overflow-x: auto;
  overflow-y: ${(props) => (props.$maxHeight ? 'auto' : 'visible')};
  ${(props) => props.$maxHeight && `max-height: ${props.$maxHeight};`}
`;

// Table
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${typography.body.fontSize};
`;

// Header cell
const HeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: ${spacing.md};
  text-align: left;
  background-color: ${colorTokens.background.secondary};
  border-bottom: 1px solid ${colorTokens.border.primary};
  font-weight: ${typography.heading3.fontWeight};
  color: ${colorTokens.text.primary};
  user-select: none;
  ${(props) => props.$sortable && `cursor: pointer;`}
  transition: all ${transitions.fast};

  ${(props) =>
    props.$sortable &&
    `
    &:hover {
      background-color: ${colorTokens.background.tertiary};
    }
  `}
`;

// Body cell
const BodyCell = styled.td`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colorTokens.border.secondary};
  color: ${colorTokens.text.primary};
`;

// Body row
const BodyRow = styled.tr<{ $striped?: boolean; $hoverable?: boolean; $isStriped?: boolean }>`
  background-color: ${(props) =>
    props.$isStriped ? colorTokens.background.secondary : colorTokens.background.primary};
  transition: all ${transitions.fast};

  ${(props) =>
    props.$hoverable &&
    `
    &:hover {
      background-color: ${colorTokens.background.tertiary};
      cursor: pointer;
    }
  `}

  &:last-child ${BodyCell} {
    border-bottom: none;
  }
`;

// Empty state
const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xxxl};
  color: ${colorTokens.text.secondary};
  text-align: center;
`;

/**
 * DataTable Component
 *
 * A table component for displaying data with columns and rows.
 *
 * @example
 * <DataTable
 *   columns={[
 *     { id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
 *     { id: 'email', header: 'Email', accessor: (row) => row.email },
 *     { id: 'status', header: 'Status', accessor: (row) => row.status },
 *   ]}
 *   data={users}
 *   striped
 *   hoverable
 *   onRowClick={(row) => console.log(row)}
 * />
 */
export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onRowClick,
  striped = true,
  hoverable = true,
  getRowKey,
  maxHeight,
}) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleHeaderClick = (columnId: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (columnId: string) => {
    if (sortBy !== columnId) return '';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  if (data.length === 0) {
    return (
      <Container>
        <EmptyState>No data available</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollWrapper $maxHeight={maxHeight}>
        <Table>
          <thead>
            <tr>
              {columns.map((column) => (
                <HeaderCell
                  key={column.id}
                  $sortable={column.sortable}
                  onClick={() => handleHeaderClick(column.id, column.sortable)}
                  style={{ width: column.width }}
                >
                  {column.header}
                  {sortBy === column.id && getSortIndicator(column.id)}
                </HeaderCell>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <BodyRow
                key={getRowKey ? getRowKey(row, index) : index}
                $striped={striped}
                $isStriped={striped && index % 2 === 1}
                $hoverable={hoverable}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((column) => (
                  <BodyCell key={column.id}>
                    {column.accessor(row)}
                  </BodyCell>
                ))}
              </BodyRow>
            ))}
          </tbody>
        </Table>
      </ScrollWrapper>
    </Container>
  );
};

DataTable.displayName = 'DataTable';

export default DataTable;
