import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrushColorPicker } from "./BrushColorPicker";

const meta = {
  title: "Whiteboard/BrushColorPicker",
  component: BrushColorPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof BrushColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { color: "#C0392B", onColorChange: () => {}, size: 8, onSizeChange: () => {} },
};
