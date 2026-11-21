import type { Meta, StoryObj } from "@storybook/react";
import { ScheduleConflictBadge } from "./ScheduleConflictBadge";

const meta = {
  title: "Status/ScheduleConflictBadge",
  component: ScheduleConflictBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof ScheduleConflictBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subject: "Day 4",
    conflicts: [
      { id: "1", description: "Asha Rao is booked on Kabir Nagar Nights" },
      { id: "2", description: "Location permit ends at 6 pm" },
    ],
  },
};
