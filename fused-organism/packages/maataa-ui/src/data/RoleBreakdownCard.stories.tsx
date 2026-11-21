import type { Meta, StoryObj } from "@storybook/react";
import { RoleBreakdownCard } from "./RoleBreakdownCard";

const meta = {
  title: "Data/RoleBreakdownCard",
  component: RoleBreakdownCard,
  tags: ["autodocs"],
} satisfies Meta<typeof RoleBreakdownCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    role: {
      id: "1",
      title: "Meera (lead)",
      kind: "cast",
      stage: "Callbacks",
      description: "Schoolteacher who returns to Shahdara after ten years.",
      requirements: [
        "Female, 25–35",
        "Hindi and Marathi",
        "Comfortable with monsoon night exteriors",
      ],
      scenes: 32,
      shootDays: 14,
      applicants: 14,
    },
  },
};
