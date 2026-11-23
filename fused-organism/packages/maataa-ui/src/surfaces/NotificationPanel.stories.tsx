import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationPanel } from "./NotificationPanel";

const meta = {
  title: "Surfaces/NotificationPanel",
  component: NotificationPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    typeLabels: { approval: "Approvals", schedule: "Schedule", mention: "Mentions" },
    onOpen: () => {},
    onMarkRead: () => {},
    onMarkAllRead: () => {},
    items: [
      {
        id: "1",
        type: "approval",
        title: "Budget v3 needs your approval",
        body: "Monsoon Diaries · ₹48 L",
        at: new Date(2026, 10, 21, 10, 30),
        read: false,
        actor: "Asha",
      },
      {
        id: "2",
        type: "schedule",
        title: "Day 4 call time moved to 6:30 am",
        at: new Date(2026, 10, 20, 18, 0),
        read: false,
        actor: "Ravi",
      },
      {
        id: "3",
        type: "mention",
        title: "You were mentioned in Scene 12 notes",
        at: new Date(2026, 10, 19, 9, 0),
        read: true,
        actor: "Meera",
      },
    ],
  },
};
