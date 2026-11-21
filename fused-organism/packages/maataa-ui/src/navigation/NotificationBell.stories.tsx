import type { Meta, StoryObj } from "@storybook/react";
import { NotificationBell } from "./NotificationBell";

const meta = {
  title: "Navigation/NotificationBell",
  component: NotificationBell,
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationBell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { unread: 3, expanded: false } };
export const Many: Story = { args: { unread: 140 } };
