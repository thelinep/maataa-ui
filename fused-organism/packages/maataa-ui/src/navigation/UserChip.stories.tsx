import type { Meta, StoryObj } from "@storybook/react";
import { UserChip } from "./UserChip";

const meta = {
  title: "Navigation/UserChip",
  component: UserChip,
  tags: ["autodocs"],
} satisfies Meta<typeof UserChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: "Hemant", subtitle: "Producer", expanded: false } };
