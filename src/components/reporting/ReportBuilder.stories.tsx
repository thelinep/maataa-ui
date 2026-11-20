import type { Meta, StoryObj } from '@storybook/react';
import { ReportBuilder } from './ReportBuilder';

const meta = {
  title: 'Reporting/ReportBuilder',
  component: ReportBuilder,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof ReportBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const WithCallback: Story = {
  args: {
    onGenerate: (config) => {
      console.log('Generating report:', config);
      alert(`Report "${config.title}" queued in format: ${config.format}`);
    }
  }
};
