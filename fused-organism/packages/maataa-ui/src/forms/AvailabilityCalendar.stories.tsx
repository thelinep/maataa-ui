import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

const meta = {
  title: "Forms/AvailabilityCalendar",
  component: AvailabilityCalendar,
  tags: ["autodocs"],
} satisfies Meta<typeof AvailabilityCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subject: "Bandra bungalow",
    month: new Date(2026, 11, 1),
    onMonthChange: () => {},
    booked: [new Date(2026, 11, 4), new Date(2026, 11, 5), new Date(2026, 11, 12)],
    value: { start: new Date(2026, 11, 8), end: new Date(2026, 11, 10) },
    onChange: () => {},
  },
};
