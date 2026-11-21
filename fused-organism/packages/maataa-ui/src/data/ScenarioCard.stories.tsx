import type { Meta, StoryObj } from "@storybook/react";
import { ScenarioCard } from "./ScenarioCard";

const meta = {
  title: "Data/ScenarioCard",
  component: ScenarioCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ScenarioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Lean shoot",
    summary: "Twelve days with a compact crew",
    assumptions: ["12 shoot days", "Crew of 18", "Two locations"],
    results: [
      { label: "Total", value: "₹48 L" },
      { label: "Per day", value: "₹4 L" },
    ],
    onSelect: () => {},
  },
};
