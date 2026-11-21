import type { Meta, StoryObj } from "@storybook/react";
import { AssumptionEditor } from "./AssumptionEditor";

const meta = {
  title: "Forms/AssumptionEditor",
  component: AssumptionEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof AssumptionEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Theatrical revenue assumptions",
    onChange: () => {},
    assumptions: [
      {
        id: "s",
        label: "Screens in week 1",
        value: 650,
        unit: "screens",
        min: 200,
        max: 1200,
        source: "Distributor estimate",
      },
      {
        id: "o",
        label: "Average occupancy",
        value: 18,
        unit: "%",
        min: 10,
        max: 35,
        confidence: "low",
      },
      { id: "t", label: "Average ticket price", value: 210, unit: "₹", source: "FICCI-EY 2026" },
    ],
  },
};
