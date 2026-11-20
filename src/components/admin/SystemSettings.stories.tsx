import type { Meta, StoryObj } from '@storybook/react';
import { SystemSettings } from './SystemSettings';

const meta = {
  title: 'Admin/SystemSettings',
  component: SystemSettings,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof SystemSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSettings = [
  { id: '1', label: 'Maintenance Mode', value: false, type: 'toggle' as const },
  { id: '2', label: 'API Key', value: 'sk_live_abc123', type: 'text' as const },
  { id: '3', label: 'Environment', value: 'production', type: 'select' as const, options: [
    { label: 'Development', value: 'development' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' }
  ]}
];

export const Default: Story = {
  args: { settings: mockSettings }
};

export const MaintenanceEnabled: Story = {
  args: {
    settings: [{ ...mockSettings[0], value: true }]
  }
};
