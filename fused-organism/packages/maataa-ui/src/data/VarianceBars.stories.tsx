import type { Meta, StoryObj } from "@storybook/react-vite";
import { VarianceBars } from "./VarianceBars";

const meta = {
  title: "Data/VarianceBars",
  component: VarianceBars,
  tags: ["autodocs"],
} satisfies Meta<typeof VarianceBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: [
      { category: "Crew", budget: 1200000, actual: 1080000 },
      { category: "Catering", budget: 48000, actual: 61000 },
      { category: "Equipment", budget: 336000, actual: 336000 },
    ],
  },
};
