import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput, defaultPasswordRules } from "./PasswordInput";

const meta = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Create a password",
    value: "monsoon",
    onChange: () => {},
    rules: defaultPasswordRules,
    autoComplete: "new-password",
  },
};
