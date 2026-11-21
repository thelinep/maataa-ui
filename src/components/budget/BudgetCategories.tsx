/**
 * BudgetCategories - Spending category breakdown
 * 
 * Shows budget allocation by category with visual breakdown
 * Integrates with Phase 1 design tokens
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components';
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color?: string;
  description?: string;
}

export interface BudgetCategoriesProps {
  categories: BudgetCategory[];
  currency?: string;
  onAddCategory?: (category: BudgetCategory) => void;
  onUpdateCategory?: (category: BudgetCategory) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const Title = styled.h3`
  font-size: ${typography.heading.sm.fontSize};
  font-weight: ${typography.heading.sm.fontWeight};
  color: ${colorTokens.text.primary};
  margin: 0;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.md};
`;

const CategoryCard = styled.div`
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const CategoryName = styled.div`
  font-size: ${typography.body.fontSize};
  font-weight: 600;
  color: ${colorTokens.text.primary};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props: any) => props.color || colorTokens.interactive.primary};
  }
`;

const ProgressBar = styled.div<{ $spent: number; $allocated: number }>`
  width: 100%;
  height: 8px;
  background-color: ${colorTokens.border.primary};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    /* Scale instead of animating width, so the bar animates without layout work */
    transform: scaleX(${(props) => Math.max(0, Math.min(props.$spent / props.$allocated, 1)) || 0});
    transform-origin: left center;
    background-color: ${(props) =>
      props.$spent > props.$allocated
        ? colorTokens.interactive.error
        : colorTokens.interactive.success};
    transition: transform 0.3s ease;
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${typography.bodySmall.fontSize};
`;

const StatValue = styled.span`
  color: ${(props: any) => props.color || colorTokens.text.secondary};
`;

const EmptyState = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${colorTokens.text.secondary};
  border: 2px dashed ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
`;

// Predefined colors for categories
const CATEGORY_COLORS = [
  '#E8C5B5', // warm tan
  '#D4A574', // deeper tan
  '#C89968', // warm brown
  '#B8956A', // earthy brown
  '#9E8B7E', // muted brown
  '#8B7E6B', // darker earth
];

/**
 * BudgetCategories Component
 * 
 * @example
 * <BudgetCategories
 *   categories={categories}
 *   currency="USD"
 *   onAddCategory={handleAdd}
 * />
 */
export const BudgetCategories: React.FC<BudgetCategoriesProps> = ({
  categories,
  currency = 'USD',
  onAddCategory,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({});

  const handleAddClick = () => {
    if (newCategory.name && newCategory.allocated) {
      const category: BudgetCategory = {
        id: `cat-${Date.now()}`,
        name: newCategory.name,
        allocated: newCategory.allocated,
        spent: 0,
        color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
        description: newCategory.description,
      };
      onAddCategory?.(category);
      setNewCategory({});
      setIsAddingCategory(false);
    }
  };

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const percentAllocated = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : '0.0';

  return (
    <Container>
      <Header>
        <Title>Spending Categories</Title>
        {!isAddingCategory && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddingCategory(true)}
          >
            + Add Category
          </Button>
        )}
      </Header>

      {categories.length === 0 ? (
        <EmptyState>
          <p>No categories yet. Create one to organize your budget.</p>
        </EmptyState>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.bodySmall.fontSize }}>
            <span>Total Allocated: {currency} {totalAllocated.toLocaleString()}</span>
            <span>Total Spent: {currency} {totalSpent.toLocaleString()} ({percentAllocated}%)</span>
          </div>
          <CategoriesGrid>
            {categories.map((category) => (
              <CategoryCard key={category.id}>
                <CategoryName color={category.color}>
                  {category.name}
                </CategoryName>
                {category.description && (
                  <span style={{ fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
                    {category.description}
                  </span>
                )}
                <ProgressBar
                  $spent={category.spent}
                  $allocated={category.allocated}
                  role="progressbar"
                  aria-label={`${category.name} budget used`}
                  aria-valuemin={0}
                  aria-valuemax={category.allocated}
                  aria-valuenow={Math.min(category.spent, category.allocated)}
                />
                <Stats>
                  <StatValue>{currency} {category.spent.toLocaleString()}</StatValue>
                  <StatValue color={category.spent > category.allocated ? colorTokens.interactive.error : colorTokens.text.secondary}>
                    of {currency} {category.allocated.toLocaleString()}
                  </StatValue>
                </Stats>
              </CategoryCard>
            ))}
          </CategoriesGrid>
        </>
      )}

      {isAddingCategory && (
        <div style={{ padding: spacing.md, border: `1px solid ${colorTokens.border.primary}`, borderRadius: borderRadius.md }}>
          <input
            type="text"
            aria-label="Category name"
            placeholder="Category name"
            value={newCategory.name || ''}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            style={{ width: '100%', padding: spacing.sm, marginBottom: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colorTokens.border.primary}` }}
          />
          <input
            type="number"
            aria-label="Allocated amount"
            placeholder="Allocated amount"
            value={newCategory.allocated || ''}
            onChange={(e) => setNewCategory({ ...newCategory, allocated: parseFloat(e.target.value) })}
            style={{ width: '100%', padding: spacing.sm, marginBottom: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colorTokens.border.primary}` }}
          />
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <Button variant="primary" size="sm" onClick={handleAddClick}>
              Save
            </Button>
            <Button variant="tertiary" size="sm" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default BudgetCategories;
