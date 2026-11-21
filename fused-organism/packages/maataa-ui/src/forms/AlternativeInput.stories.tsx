import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GazeSelectionGrid, ScanningSelector, YesNoButtons, DwellRing } from "./AlternativeInput";

const meta = { title: "Forms/AlternativeInput", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { id: "water", label: "Water", symbol: "💧" },
  { id: "break", label: "Break", symbol: "☕" },
  { id: "help", label: "Help", symbol: "🙋" },
  { id: "again", label: "Again", symbol: "🔁" },
  { id: "done", label: "Done", symbol: "✅" },
  { id: "toilet", label: "Toilet", symbol: "🚻" },
];

function Demo() {
  const [sel, setSel] = useState("break");
  const [run, setRun] = useState(false);
  const [yn, setYn] = useState<"yes" | "no" | "unsure" | null>("yes");
  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 640 }}>
      <GazeSelectionGrid label="Requests" items={items} onSelect={setSel} selectedId={sel} />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <DwellRing progress={0.65} /> Dwell ring at 65%
      </div>
      <ScanningSelector
        label="Quick replies"
        items={items.slice(0, 4)}
        onSelect={setSel}
        running={run}
        onRunningChange={setRun}
      />
      <YesNoButtons question="Ready for the next take?" value={yn} onChange={setYn} allowUnsure />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
