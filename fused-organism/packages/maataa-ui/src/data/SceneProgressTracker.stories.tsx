import type { Meta, StoryObj } from "@storybook/react-vite";
import { SceneProgressTracker } from "./SceneProgressTracker";

const meta = {
  title: "Data/SceneProgressTracker",
  component: SceneProgressTracker,
  tags: ["autodocs"],
} satisfies Meta<typeof SceneProgressTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChangeState: () => {},
    scenes: [
      { id: "a", scene: "12", set: "Kitchen", eighths: 11, state: "done", takes: 6 },
      { id: "b", scene: "14", set: "Terrace", eighths: 16, state: "shooting", takes: 2 },
      { id: "c", scene: "15A", set: "Lane", eighths: 4, state: "todo" },
      { id: "d", scene: "16", set: "Lane", eighths: 3, state: "moved" },
    ],
  },
};
