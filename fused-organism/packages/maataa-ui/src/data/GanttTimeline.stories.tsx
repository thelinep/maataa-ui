import type { Meta, StoryObj } from "@storybook/react";
import { GanttTimeline } from "./GanttTimeline";

const meta = {
  title: "Data/GanttTimeline",
  component: GanttTimeline,
  tags: ["autodocs"],
} satisfies Meta<typeof GanttTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    today: new Date(2026, 10, 21),
    tasks: [
      {
        id: "a",
        name: "Pre-production",
        phase: "Prep",
        start: new Date(2026, 9, 15),
        end: new Date(2026, 10, 15),
        progress: 1,
      },
      {
        id: "b",
        name: "Principal photography",
        phase: "Shoot",
        start: new Date(2026, 10, 16),
        end: new Date(2026, 11, 5),
        progress: 0.4,
        conflict: "Camera team booked 1–2 Dec",
      },
      {
        id: "c",
        name: "Edit",
        phase: "Post",
        start: new Date(2026, 11, 6),
        end: new Date(2027, 0, 20),
        progress: 0,
      },
    ],
    milestones: [{ id: "m", name: "Picture lock", date: new Date(2027, 0, 20) }],
  },
};
