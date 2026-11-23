import type { Meta, StoryObj } from "@storybook/react-vite";
import { PermitStatusCard } from "./PermitStatusCard";

const meta = {
  title: "Data/PermitStatusCard",
  component: PermitStatusCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PermitStatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    now: new Date(2026, 10, 21),
    permit: {
      id: "1",
      title: "Shoot permit – BMC",
      authority: "Brihanmumbai Municipal Corporation",
      reference: "FP/2026/1182",
      status: "approved",
      validFrom: new Date(2026, 10, 1),
      validTo: new Date(2026, 10, 24),
      conditions: ["No shooting after 10 pm", "Keep one lane open", "Two traffic wardens on site"],
    },
  },
};
export const DronePermit: Story = {
  args: {
    permit: {
      id: "2",
      title: "DGCA drone permission",
      authority: "Digital Sky",
      status: "applied",
    },
  },
};
