import type { Meta, StoryObj } from "@storybook/react";
import { LockIndicator } from "./LockIndicator";

const meta = {
  title: "Status/LockIndicator",
  component: LockIndicator,
  tags: ["autodocs"],
} satisfies Meta<typeof LockIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subject: "Picture",
    locked: true,
    lockedBy: "PHKD",
    lockedAt: new Date(2026, 10, 20),
    onUnlock: () => {},
  },
};
export const Unlocked: Story = { args: { subject: "Script", locked: false, onLock: () => {} } };
