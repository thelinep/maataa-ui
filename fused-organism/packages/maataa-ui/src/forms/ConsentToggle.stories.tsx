import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConsentToggle } from "./ConsentToggle";

const meta = {
  title: "Forms/ConsentToggle",
  component: ConsentToggle,
  tags: ["autodocs"],
} satisfies Meta<typeof ConsentToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Share my phone number with the crew",
    description: "Only people on this production see it.",
    granted: true,
    consentedAt: new Date("2026-11-01"),
    onChange: () => {},
  },
};
export const Locked: Story = {
  args: { label: "Contract terms", granted: true, locked: true, onChange: () => {} },
};
