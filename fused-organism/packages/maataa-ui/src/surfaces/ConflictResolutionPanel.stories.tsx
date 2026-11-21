import type { Meta, StoryObj } from "@storybook/react";
import { ConflictResolutionPanel } from "./ConflictResolutionPanel";

const meta = {
  title: "Surfaces/ConflictResolutionPanel",
  component: ConflictResolutionPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof ConflictResolutionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recordName: "Budget line: Catering",
    theirAuthor: "Ravi",
    theirTime: new Date(2026, 10, 21, 11, 5),
    fields: [
      { key: "amount", label: "Amount (₹)", mine: "40,000", theirs: "45,000" },
      { key: "note", label: "Note", mine: "Lunch for 18", theirs: "Lunch and evening tea for 18" },
    ],
    onResolve: () => {},
  },
};
