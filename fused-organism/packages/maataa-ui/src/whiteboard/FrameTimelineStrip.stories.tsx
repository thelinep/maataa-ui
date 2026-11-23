import type { Meta, StoryObj } from "@storybook/react-vite";
import { FrameTimelineStrip } from "./FrameTimelineStrip";

const meta = {
  title: "Whiteboard/FrameTimelineStrip",
  component: FrameTimelineStrip,
  tags: ["autodocs"],
} satisfies Meta<typeof FrameTimelineStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedId: "b",
    onSelect: () => {},
    onReorder: () => {},
    onAdd: () => {},
    frames: [
      { id: "a", number: "12", description: "Wide: lane in the rain", duration: 4, shot: "WS" },
      { id: "b", number: "12A", description: "Meera at the window", duration: 3, shot: "MCU" },
      { id: "c", number: "12B", description: "", duration: 2, shot: "CU" },
    ],
  },
};
