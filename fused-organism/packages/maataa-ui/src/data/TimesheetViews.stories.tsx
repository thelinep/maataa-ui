import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimesheetList, TimesheetWeekSummary } from "./TimesheetViews";

const meta = {
  title: "Data/TimesheetList",
  component: TimesheetList,
  tags: ["autodocs"],
} satisfies Meta<typeof TimesheetList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onOpen: () => {},
    sheets: [
      {
        id: "1",
        person: "Ravi Menon",
        role: "Gaffer",
        period: "Week 47 · 16–22 Nov",
        minutes: 4560,
        overtimeMinutes: 240,
        status: "submitted",
      },
      {
        id: "2",
        person: "Asha Rao",
        role: "DOP",
        period: "Week 47 · 16–22 Nov",
        minutes: 4200,
        overtimeMinutes: 0,
        status: "approved",
      },
      {
        id: "3",
        person: "Dev Lohan",
        role: "Best boy",
        period: "Week 46",
        minutes: 3900,
        overtimeMinutes: 60,
        status: "rejected",
      },
    ],
  },
};
export const WeekSummary: Story = {
  args: Default.args,
  render: () => (
    <TimesheetWeekSummary
      week="Week 47"
      days={[16, 17, 18, 19, 20, 21, 22].map((d, i) => ({
        date: new Date(2026, 10, d),
        minutes: [780, 720, 810, 0, 690, 840, 0][i],
      }))}
    />
  ),
};
