import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CascadingSelect, FilterPills, SegmentedControl, NumberStepper } from "./SelectionControls";

const meta = { title: "Forms/SelectionControls", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [c, setC] = useState(["cam", "ac"]);
  const [p, setP] = useState(["night"]);
  const [s, setS] = useState("grid");
  const [n, setN] = useState(2);
  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 560 }}>
      <CascadingSelect
        legend="Crew role"
        levels={["Department", "Role"]}
        options={[
          {
            value: "cam",
            label: "Camera",
            children: [
              { value: "dop", label: "DOP" },
              { value: "ac", label: "Focus puller" },
            ],
          },
          { value: "snd", label: "Sound", children: [{ value: "mix", label: "Mixer" }] },
        ]}
        value={c}
        onChange={setC}
      />
      <FilterPills
        label="Time of day"
        pills={[
          { value: "day", label: "Day", count: 18 },
          { value: "night", label: "Night", count: 6 },
          { value: "dusk", label: "Dusk", count: 2 },
        ]}
        value={p}
        onChange={setP}
      />
      <SegmentedControl
        label="View"
        options={[
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
          { value: "map", label: "Map" },
        ]}
        value={s}
        onChange={setS}
      />
      <NumberStepper label="Crew vans" value={n} onChange={setN} min={1} max={6} unit="vans" />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
