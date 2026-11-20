import type { Meta, StoryObj } from '@storybook/react';
import { ChartWidget } from './ChartWidget';

const meta = {
  title: 'Analytics/ChartWidget',
  component: ChartWidget,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof ChartWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const salesData = [
  { label: 'Jan', value: 4000 },
  { label: 'Feb', value: 3000 },
  { label: 'Mar', value: 2000 },
  { label: 'Apr', value: 2780 },
  { label: 'May', value: 1890 },
  { label: 'Jun', value: 2390 }
];

export const SalesChart: Story = {
  args: {
    title: 'Monthly Sales',
    data: salesData,
    type: 'bar',
    height: 300
  }
};

export const CompactChart: Story = {
  args: {
    title: 'Weekly Revenue',
    data: salesData.slice(0, 3),
    type: 'bar',
    height: 200
  }
};
