import type { Meta, StoryObj } from "@storybook/react-vite";
import { VisibilitySelector } from "./VisibilitySelector";

const meta = {
  title: "Forms/VisibilitySelector",
  component: VisibilitySelector,
  tags: ["autodocs"],
} satisfies Meta<typeof VisibilitySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "private", onChange: () => {}, subject: "this production" },
};
