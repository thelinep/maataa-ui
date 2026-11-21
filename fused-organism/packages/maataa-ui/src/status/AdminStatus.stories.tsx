import type { Meta, StoryObj } from "@storybook/react";
import { SyncOpsDashboard, LastOwnerWarning, ScreenReaderModeIndicator } from "./AdminStatus";

const meta = {
  title: "Status/SyncOpsDashboard",
  component: SyncOpsDashboard,
  tags: ["autodocs"],
} satisfies Meta<typeof SyncOpsDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    now: new Date(2026, 10, 21, 12),
    conflicts: 2,
    onRetryFailed: () => {},
    onOpenConflicts: () => {},
    devices: [
      {
        id: "a",
        name: "Hemant’s MacBook",
        lastSync: new Date(2026, 10, 21, 11, 58),
        pending: 0,
        failed: 0,
        online: true,
      },
      {
        id: "b",
        name: "Set iPad (Day 4)",
        lastSync: new Date(2026, 10, 21, 6, 10),
        pending: 14,
        failed: 2,
        online: false,
      },
    ],
  },
};
export const LastOwner: Story = {
  args: Default.args,
  render: () => (
    <LastOwnerWarning
      workspace="Vesahe Film Solutions"
      action="leave the organisation"
      onAddOwner={() => {}}
    />
  ),
};
export const ScreenReaderMode: Story = {
  args: Default.args,
  render: () => <ScreenReaderModeIndicator on onToggle={() => {}} />,
};
