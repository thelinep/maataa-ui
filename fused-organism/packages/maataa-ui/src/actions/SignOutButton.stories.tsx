import type { Meta, StoryObj } from "@storybook/react";
import { SignOutButton } from "./SignOutButton";

const meta = {
  title: "Actions/SignOutButton",
  component: SignOutButton,
  tags: ["autodocs"],
} satisfies Meta<typeof SignOutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSignOut: () => {}, unsyncedCount: 2 } };
