import type { Meta, StoryObj } from "@storybook/react";
import { ReceiptDisplay } from "./ReceiptDisplay";

const meta = {
  title: "Data/ReceiptDisplay",
  component: ReceiptDisplay,
  tags: ["autodocs"],
} satisfies Meta<typeof ReceiptDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reference: "RCPT-0042",
    issuedAt: new Date("2026-11-01"),
    party: "Vesahe Film Solutions",
    status: "paid",
    lines: [
      { label: "Screening fee", amount: 15000 },
      { label: "GST 18%", amount: 2700 },
    ],
  },
};
