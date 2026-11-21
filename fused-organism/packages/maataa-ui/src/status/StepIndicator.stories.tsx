import type { Meta, StoryObj } from "@storybook/react";
import { StepIndicator } from "./StepIndicator";

const meta = {
  title: "Status/StepIndicator",
  component: StepIndicator,
  tags: ["autodocs"],
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Pre-production",
    steps: [
      { id: "s", label: "Script lock", state: "done" },
      { id: "b", label: "Budget", state: "current", description: "Waiting on line producer" },
      { id: "c", label: "Casting", state: "upcoming" },
      { id: "l", label: "Locations", state: "error", description: "Permit refused" },
    ],
  },
};
