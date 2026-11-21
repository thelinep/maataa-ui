import type { Meta, StoryObj } from "@storybook/react";
import { PricingWorksheet, PricingSourceTable } from "./Pricing";

const meta = {
  title: "Forms/PricingWorksheet",
  component: PricingWorksheet,
  tags: ["autodocs"],
} satisfies Meta<typeof PricingWorksheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Screening fee · festival tour",
    base: 120000,
    onChange: () => {},
    approval: { state: "approved", version: "2" },
    lines: [
      { id: "m", label: "Margin", kind: "percent", value: 15 },
      { id: "t", label: "Travel and DCP", kind: "amount", value: 18000 },
      { id: "g", label: "GST", kind: "percent", value: 18 },
    ],
  },
};
export const Sources: Story = {
  args: Default.args,
  render: () => (
    <PricingSourceTable
      now={new Date(2026, 10, 21)}
      sources={[
        {
          id: "1",
          item: "ARRI Alexa Mini kit",
          price: 28000,
          unit: "per day",
          source: "Prime Focus rate card",
          checkedOn: new Date(2026, 9, 1),
        },
        {
          id: "2",
          item: "Gaffer",
          price: 6500,
          unit: "per day",
          source: "FWICE schedule",
          checkedOn: new Date(2026, 3, 1),
        },
      ]}
    />
  ),
};
