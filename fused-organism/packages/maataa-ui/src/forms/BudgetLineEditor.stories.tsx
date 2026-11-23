import type { Meta, StoryObj } from "@storybook/react-vite";
import { BudgetLineEditor } from "./BudgetLineEditor";

const meta = {
  title: "Forms/BudgetLineEditor",
  component: BudgetLineEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof BudgetLineEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {},
    categories: ["Crew", "Catering", "Equipment", "Locations"],
    lines: [
      { id: "1", category: "Crew", item: "Gaffer", quantity: 12, unit: "days", rate: 6500 },
      {
        id: "2",
        category: "Catering",
        item: "Lunch for 18",
        quantity: 12,
        unit: "days",
        rate: 4000,
      },
      {
        id: "3",
        category: "Equipment",
        item: "ARRI Alexa Mini kit",
        quantity: 12,
        unit: "days",
        rate: 28000,
      },
    ],
  },
};
