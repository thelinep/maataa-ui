import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExportControl } from "./ExportControl";

const meta = {
  title: "Actions/ExportControl",
  component: ExportControl,
  tags: ["autodocs"],
} satisfies Meta<typeof ExportControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { subject: "budget", onExport: () => {}, allowRedaction: true },
};
