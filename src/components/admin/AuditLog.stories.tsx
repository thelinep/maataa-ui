import type { Meta, StoryObj } from '@storybook/react';
import { AuditLog } from './AuditLog';

const meta = {
  title: 'Admin/AuditLog',
  component: AuditLog,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof AuditLog>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEntries = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Report',
    details: 'Monthly sales report',
    status: 'success' as const
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: 'user@example.com',
    action: 'Deleted',
    resource: 'Draft',
    details: 'Unauthorized attempt',
    status: 'error' as const
  }
];

export const Default: Story = {
  args: { entries: mockEntries }
};

export const EmptyLog: Story = {
  args: { entries: [] }
};
