import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checklist } from "./Checklist";

const meta = {
  title: "Data/Checklist",
  component: Checklist,
  tags: ["autodocs"],
} satisfies Meta<typeof Checklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Before day one",
    items: [
      { id: "p", label: "Shoot permits", checked: true },
      {
        id: "i",
        label: "Insurance certificate",
        checked: false,
        description: "Upload the signed copy",
      },
      { id: "c", label: "Call sheet sent", checked: false },
    ],
    onChange: () => {},
  },
};
