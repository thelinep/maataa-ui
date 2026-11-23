import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimesheetEntryForm } from "./TimesheetEntryForm";

const meta = {
  title: "Forms/TimesheetEntryForm",
  component: TimesheetEntryForm,
  tags: ["autodocs"],
} satisfies Meta<typeof TimesheetEntryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: { date: "2026-11-24", callTime: "06:00", wrapTime: "20:15", breakMinutes: 60 },
    onChange: () => {},
  },
};
