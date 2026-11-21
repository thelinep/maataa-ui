import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline";

const meta = {
  title: "Data/Timeline",
  component: Timeline,
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Activity",
    events: [
      { id: "1", title: "Budget approved", actor: "Asha", at: new Date("2026-11-20T10:30:00") },
      {
        id: "2",
        title: "Line items edited",
        actor: "Ravi",
        at: new Date("2026-11-19T16:05:00"),
        detail: "Catering +₹40,000",
      },
      { id: "3", title: "Draft created", actor: "Hemant", at: new Date("2026-11-18T09:00:00") },
    ],
  },
};
