import type { Meta, StoryObj } from "@storybook/react";
import { ArchiveButton } from "./ArchiveButton";

const meta = {
  title: "Actions/ArchiveButton",
  component: ArchiveButton,
  tags: ["autodocs"],
} satisfies Meta<typeof ArchiveButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { itemName: "Monsoon Diaries", archived: false, onChange: () => {} },
};
