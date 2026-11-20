import type { Meta, StoryObj } from '@storybook/react';
import { MetricsOverview } from './MetricsOverview';

const meta = {
  title: 'Analytics/MetricsOverview',
  component: MetricsOverview,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof MetricsOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMetrics = [
  { id: '1', label: 'Total Revenue', value: '$125,432', trend: 'up' as const, trendPercent: 15 },
  { id: '2', label: 'Active Users', value: '8,432', trend: 'up' as const, trendPercent: 8 },
  { id: '3', label: 'Conversion Rate', value: '3.24%', trend: 'down' as const, trendPercent: 2 },
  { id: '4', label: 'Avg Order Value', value: '$145.50', trend: 'stable' as const, trendPercent: 0 }
];

export const Default: Story = {
  args: { metrics: mockMetrics, columns: 4 }
};

export const TwoColumns: Story = {
  args: { metrics: mockMetrics.slice(0, 2), columns: 2 }
};

export const SingleColumn: Story = {
  args: { metrics: [mockMetrics[0]], columns: 1 }
};
