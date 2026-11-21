import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MonthPicker, WeekPicker } from "./PeriodPickers";

const meta = { title: "Forms/PeriodPickers", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [m, setM] = useState("2026-12");
  const [w, setW] = useState("2026-W47");
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <MonthPicker label="Release month" value={m} onChange={setM} />
      <WeekPicker label="Shoot week" value={w} onChange={setW} />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
