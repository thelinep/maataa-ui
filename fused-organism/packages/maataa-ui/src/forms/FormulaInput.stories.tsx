import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormulaInput } from "./FormulaInput";

const meta = { title: "Forms/FormulaInput", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState("days * day_rate * (1 + gst)");
  return (
    <FormulaInput
      label="Camera package cost"
      value={v}
      onChange={(t) => setV(t)}
      variables={[
        { name: "days", value: 12, label: "Shoot days" },
        { name: "day_rate", value: 18500, label: "Rate per day" },
        { name: "gst", value: 0.18, label: "GST" },
      ]}
    />
  );
}
export const Default: Story = { render: () => <Demo /> };
