import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { VerticalTabs, SegmentedTabs } from "./TabVariants";

const meta = { title: "Navigation/TabVariants", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  { id: "profile", label: "Profile", content: <p>Name, credits and showreel.</p> },
  {
    id: "security",
    label: "Security",
    content: <p>Two-step sign-in and active sessions.</p>,
    badge: 2,
  },
  { id: "billing", label: "Billing", content: <p>Invoices.</p>, disabled: true },
];

function Demo() {
  const [a, setA] = useState("security");
  const [b, setB] = useState("week");
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <VerticalTabs label="Account settings" tabs={tabs} value={a} onChange={setA} />
      <SegmentedTabs
        label="Schedule view"
        tabs={[
          { id: "day", label: "Day", content: <p>Today’s call sheet.</p> },
          { id: "week", label: "Week", content: <p>Shoot days 4–9.</p> },
          { id: "month", label: "Month", content: <p>December.</p> },
        ]}
        value={b}
        onChange={setB}
      />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
