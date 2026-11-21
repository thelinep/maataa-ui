import type { Meta, StoryObj } from "@storybook/react";
import { DistributionListSelector } from "./DistributionListSelector";

const meta = {
  title: "Forms/DistributionListSelector",
  component: DistributionListSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof DistributionListSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: ["1", "4"],
    onChange: () => {},
    recipients: [
      { id: "1", name: "Asha Rao", role: "DOP", department: "Camera" },
      { id: "2", name: "Ravi Menon", role: "Focus puller", department: "Camera" },
      { id: "3", name: "Meera Iyer", role: "Gaffer", department: "Lighting", unreachable: true },
      { id: "4", name: "Dev Lohan", role: "Best boy", department: "Lighting" },
    ],
  },
};
