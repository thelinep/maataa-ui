import type { Meta, StoryObj } from "@storybook/react";
import { ReviewerSelector } from "./ReviewerSelector";

const meta = {
  title: "Forms/ReviewerSelector",
  component: ReviewerSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewerSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roles: [
      { id: "lp", label: "Line producer" },
      { id: "acc", label: "Accountant" },
      { id: "adv", label: "Advisor", required: false },
    ],
    people: [
      { id: "me", name: "Hemant" },
      { id: "a", name: "Asha Rao" },
      { id: "r", name: "Ravi Menon" },
    ],
    value: { lp: "a", acc: "a" },
    authorId: "me",
    showErrors: true,
    onChange: () => {},
  },
};
