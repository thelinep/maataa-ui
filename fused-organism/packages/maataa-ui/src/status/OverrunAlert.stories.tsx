import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverrunAlert } from "./OverrunAlert";

const meta = {
  title: "Status/OverrunAlert",
  component: OverrunAlert,
  tags: ["autodocs"],
} satisfies Meta<typeof OverrunAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { subject: "Catering", budget: 48000, actual: 61000 } };
export const Nearing: Story = {
  args: { subject: "Monsoon Diaries", budget: 4800000, actual: 4500000 },
};
