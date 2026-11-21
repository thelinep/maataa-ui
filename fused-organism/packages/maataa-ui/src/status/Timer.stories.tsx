import type { Meta, StoryObj } from "@storybook/react";
import { Timer } from "./Timer";

const meta = {
  title: "Status/Timer",
  component: Timer,
  tags: ["autodocs"],
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Scene 12, take 3" } };
