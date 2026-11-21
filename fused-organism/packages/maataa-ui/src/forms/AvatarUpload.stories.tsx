import type { Meta, StoryObj } from "@storybook/react";
import { AvatarUpload } from "./AvatarUpload";

const meta = {
  title: "Forms/AvatarUpload",
  component: AvatarUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "Asha Rao", onSelect: () => {}, onRemove: () => {} },
};
