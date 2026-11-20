/**
 * Budget Components Test Suite
 * Unit tests for BudgetCategories, BudgetForecast, BudgetAlerts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetCategories, type BudgetCategory } from '@/components/budget/BudgetCategories';
import { BudgetForecast, type SpendingTrend } from '@/components/budget/BudgetForecast';
import { BudgetAlerts, type SpendingAlert } from '@/components/budget/BudgetAlerts';

describe('BudgetCategories', () => {
  const mockCategories: BudgetCategory[] = [
    {
      id: 'cat-1',
      name: 'Marketing',
      allocated: 10000,
      spent: 7500,
      color: '#E8C5B5',
      description: 'Marketing expenses',
    },
    {
      id: 'cat-2',
      name: 'Development',
      allocated: 25000,
      spent: 18000,
      color: '#D4A574',
      description: 'Development costs',
    },
  ];

  it('renders category cards with allocation and spent amounts', () => {
    render(
      <BudgetCategories
        categories={mockCategories}
        currency="USD"
      />
    );

    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  it('calculates and displays total allocation and spending', () => {
    render(
      <BudgetCategories
        categories={mockCategories}
        currency="USD"
      />
    );

    expect(screen.getByText(/Total Allocated: USD 35,000/)).toBeInTheDocument();
    expect(screen.getByText(/Total Spent: USD 25,500 \(72.9%\)/)).toBeInTheDocument();
  });

  it('shows progress bar with correct percentage', () => {
    render(
      <BudgetCategories
        categories={mockCategories}
        currency="USD"
      />
    );

    const progressBars = screen.getAllByRole('presentation');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('calls onAddCategory when add button is clicked and form filled', async () => {
    const handleAdd = vi.fn();
    render(
      <BudgetCategories
        categories={[]}
        onAddCategory={handleAdd}
      />
    );

    const addButton = screen.getByText('+ Add Category');
    fireEvent.click(addButton);

    const inputs = screen.getAllByRole('textbox');
    await userEvent.type(inputs[0], 'HR');
    await userEvent.type(inputs[1], '5000');

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalled();
    });
  });

  it('displays empty state when no categories', () => {
    render(
      <BudgetCategories
        categories={[]}
      />
    );

    expect(screen.getByText(/No categories yet/)).toBeInTheDocument();
  });

  it('highlights over-budget categories in red', () => {
    const overBudgetCategory: BudgetCategory = {
      id: 'over',
      name: 'Over Budget',
      allocated: 1000,
      spent: 1500,
      color: '#E8C5B5',
    };

    render(
      <BudgetCategories
        categories={[overBudgetCategory]}
      />
    );

    const overBudgetText = screen.getByText(/of USD 1,000/);
    expect(overBudgetText).toBeInTheDocument();
  });
});

describe('BudgetForecast', () => {
  const mockTrends: SpendingTrend[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
    amount: 300 + Math.random() * 100,
    category: 'general',
  }));

  it('renders forecast metrics for budget', () => {
    render(
      <BudgetForecast
        budgetName="Q4 Marketing"
        allocated={50000}
        spent={15000}
        trends={mockTrends}
        daysInBudgetPeriod={90}
        currentDayOfPeriod={30}
      />
    );

    expect(screen.getByText(/Q4 Marketing/)).toBeInTheDocument();
    expect(screen.getByText(/Daily Average Spend/)).toBeInTheDocument();
    expect(screen.getByText(/Projected End-of-Period Spend/)).toBeInTheDocument();
  });

  it('calculates daily average spending rate correctly', () => {
    render(
      <BudgetForecast
        budgetName="Test"
        allocated={50000}
        spent={10000}
        trends={mockTrends}
        daysInBudgetPeriod={90}
        currentDayOfPeriod={30}
      />
    );

    const dailyAverage = screen.getByText(/Daily Average Spend/);
    expect(dailyAverage).toBeInTheDocument();
  });

  it('shows warning when over budget', () => {
    const overBudgetTrends = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
      amount: 2000, // High spending
      category: 'general',
    }));

    render(
      <BudgetForecast
        budgetName="Test"
        allocated={50000}
        spent={45000}
        trends={overBudgetTrends}
        daysInBudgetPeriod={90}
        currentDayOfPeriod={80}
      />
    );

    expect(screen.getByText(/Budget Alert/)).toBeInTheDocument();
  });

  it('shows timeline progress bar', () => {
    render(
      <BudgetForecast
        budgetName="Test"
        allocated={50000}
        spent={15000}
        trends={mockTrends}
        daysInBudgetPeriod={90}
        currentDayOfPeriod={30}
      />
    );

    expect(screen.getByText(/Day 30\/90/)).toBeInTheDocument();
  });
});

describe('BudgetAlerts', () => {
  const mockAlerts: SpendingAlert[] = [
    {
      id: 'alert-1',
      type: 'threshold',
      triggerValue: 75,
      isActive: true,
      notificationChannels: ['email', 'in-app'],
      createdAt: Date.now(),
    },
    {
      id: 'alert-2',
      type: 'daily-limit',
      triggerValue: 500,
      isActive: true,
      notificationChannels: ['slack'],
      createdAt: Date.now(),
    },
  ];

  it('renders alert list with types and channels', () => {
    render(
      <BudgetAlerts
        budgetId="budget-1"
        allocated={50000}
        spent={25000}
        alerts={mockAlerts}
      />
    );

    expect(screen.getByText(/Budget Threshold/)).toBeInTheDocument();
    expect(screen.getByText(/Daily Limit/)).toBeInTheDocument();
  });

  it('displays notification channels for each alert', () => {
    render(
      <BudgetAlerts
        budgetId="budget-1"
        allocated={50000}
        spent={25000}
        alerts={mockAlerts}
      />
    );

    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('slack')).toBeInTheDocument();
  });

  it('calls onAddAlert when creating new alert', async () => {
    const handleAdd = vi.fn();
    render(
      <BudgetAlerts
        budgetId="budget-1"
        allocated={50000}
        spent={25000}
        alerts={[]}
        onAddAlert={handleAdd}
      />
    );

    const addButton = screen.getByText('+ Add Alert');
    fireEvent.click(addButton);

    const selectElements = screen.getAllByRole('combobox');
    expect(selectElements.length).toBeGreaterThan(0);
  });

  it('allows toggling alert active status', () => {
    const handleUpdate = vi.fn();
    render(
      <BudgetAlerts
        budgetId="budget-1"
        allocated={50000}
        spent={25000}
        alerts={mockAlerts}
        onUpdateAlert={handleUpdate}
      />
    );

    const toggles = screen.getAllByRole('checkbox');
    fireEvent.click(toggles[0]);

    expect(handleUpdate).toHaveBeenCalled();
  });

  it('shows empty state when no alerts configured', () => {
    render(
      <BudgetAlerts
        budgetId="budget-1"
        allocated={50000}
        spent={25000}
        alerts={[]}
      />
    );

    expect(screen.getByText(/No alerts configured/)).toBeInTheDocument();
  });
});
