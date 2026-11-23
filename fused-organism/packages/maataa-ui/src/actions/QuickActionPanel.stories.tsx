import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickActionPanel } from "./QuickActionPanel";

const meta = {
  title: "Actions/QuickActionPanel",
  component: QuickActionPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof QuickActionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [
      {
        id: "cs",
        label: "New call sheet",
        description: "For tomorrow's shoot",
        icon: "📋",
        onSelect: () => {},
      },
      { id: "b", label: "Log expenses", icon: "₹", onSelect: () => {} },
      { id: "i", label: "Invite crew", icon: "✉️", onSelect: () => {} },
      {
        id: "a",
        label: "Approve budget",
        icon: "✅",
        onSelect: () => {},
        disabled: true,
        disabledReason: "Nothing waiting for you",
      },
    ],
  },
};
