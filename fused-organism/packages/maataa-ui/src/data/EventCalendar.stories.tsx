import type { Meta, StoryObj } from "@storybook/react";
import { EventCalendar } from "./EventCalendar";

const meta = {
  title: "Data/EventCalendar",
  component: EventCalendar,
  tags: ["autodocs"],
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    view: "month",
    onViewChange: () => {},
    date: new Date(2026, 10, 1),
    onDateChange: () => {},
    today: new Date(2026, 10, 21),
    events: [
      { id: "1", title: "Shoot day 4", start: new Date(2026, 10, 21, 6, 30), kind: "shoot" },
      {
        id: "2",
        title: "Audition: lead",
        start: new Date(2026, 10, 21, 15),
        kind: "audition",
        color: "#1E3A5F",
      },
      {
        id: "3",
        title: "Location recce",
        start: new Date(2026, 10, 18, 9),
        kind: "recce",
        color: "#2D6A3E",
      },
      {
        id: "4",
        title: "Permit deadline",
        start: new Date(2026, 10, 25),
        allDay: true,
        kind: "deadline",
        color: "#8B3A2B",
      },
    ],
  },
};
export const Week: Story = {
  args: { ...Default.args, view: "week", date: new Date(2026, 10, 18) },
};
