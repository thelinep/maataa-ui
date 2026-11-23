import type { Meta, StoryObj } from "@storybook/react-vite";
import { SyncStatus } from "./SyncStatus";

const meta = {
  title: "Status/SyncStatus",
  component: SyncStatus,
  tags: ["autodocs"],
} satisfies Meta<typeof SyncStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { state: "synced", lastSyncedAt: new Date() } };
export const Failed: Story = { args: { state: "error", onRetry: () => {} } };
export const Pending: Story = { args: { state: "pending", pendingCount: 4 } };
