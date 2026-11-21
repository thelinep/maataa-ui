import type { Meta, StoryObj } from "@storybook/react";
import { FrameCanvas } from "./FrameCanvas";

const meta = {
  title: "Whiteboard/FrameCanvas",
  component: FrameCanvas,
  tags: ["autodocs"],
} satisfies Meta<typeof FrameCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    frame: "12A",
    tool: "pen",
    color: "#111111",
    size: 4,
    description: "MCU Meera at the window, rain on glass; she turns as the door opens",
    onDescriptionChange: () => {},
    width: 400,
  },
};
