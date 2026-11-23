import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorSummary } from "./ErrorSummary";

const meta = {
  title: "Forms/ErrorSummary",
  component: ErrorSummary,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: [
      { fieldId: "email", message: "Enter your email address" },
      { fieldId: "pw", message: "Enter your password" },
    ],
    focusOnShow: false,
  },
};
