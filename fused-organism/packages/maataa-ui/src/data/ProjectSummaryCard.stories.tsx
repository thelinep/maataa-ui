import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectSummaryCard } from "./ProjectSummaryCard";

const meta = {
  title: "Data/ProjectSummaryCard",
  component: ProjectSummaryCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project: {
      id: "1",
      title: "Monsoon Diaries",
      stage: "Filming",
      budgetUsed: 0.72,
      budgetLabel: "₹48 L",
      nextMilestone: "Picture lock · 20 Dec",
      team: ["Asha Rao", "Ravi Menon", "Meera Iyer", "PHKD", "Dev Lohan"],
    },
  },
};
export const OverBudget: Story = {
  args: {
    project: {
      id: "2",
      title: "Kabir Nagar Nights",
      stage: "Post",
      budgetUsed: 1.08,
      budgetLabel: "₹21.5 L",
    },
  },
};
