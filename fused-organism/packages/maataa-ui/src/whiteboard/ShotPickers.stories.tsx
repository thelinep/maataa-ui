import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShotTypeSelector, CameraAnglePicker } from "./ShotPickers";

const meta = {
  title: "Whiteboard/ShotTypeSelector",
  component: ShotTypeSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof ShotTypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: "MCU", onChange: () => {} } };
export const Angles: Story = {
  args: Default.args,
  render: () => <CameraAnglePicker value="low" onChange={() => {}} />,
};
