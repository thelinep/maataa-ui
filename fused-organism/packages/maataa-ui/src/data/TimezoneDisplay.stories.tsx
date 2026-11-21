import type { Meta, StoryObj } from "@storybook/react";
import { TimezoneDisplay } from "./TimezoneDisplay";

const meta = {
  title: "Data/TimezoneDisplay",
  component: TimezoneDisplay,
  tags: ["autodocs"],
} satisfies Meta<typeof TimezoneDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    at: new Date(Date.UTC(2026, 10, 21, 1, 0)),
    zones: ["Asia/Kolkata", "Europe/London", "America/Los_Angeles"],
    labels: { "Europe/London": "London (sound)", "America/Los_Angeles": "LA (VFX)" },
  },
};
