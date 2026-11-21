import type { Meta, StoryObj } from "@storybook/react";
import { DrawingToolPalette } from "./DrawingToolPalette";

const meta = {
  title: "Whiteboard/DrawingToolPalette",
  component: DrawingToolPalette,
  tags: ["autodocs"],
} satisfies Meta<typeof DrawingToolPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "pen",
    onChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    canUndo: true,
    canRedo: false,
  },
};
export const Horizontal: Story = { args: { ...Default.args, orientation: "horizontal" } };
