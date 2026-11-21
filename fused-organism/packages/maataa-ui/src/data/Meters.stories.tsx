import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCounter, StackedProgressBar, ProgressRing, Gauge } from "./Meters";

const meta = { title: "Data/Meters", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <AnimatedCounter value={1240} label="Applicants" durationMs={0} />
        <AnimatedCounter value={86.5} label="Budget used" suffix="%" durationMs={0} />
      </div>
      <StackedProgressBar
        label="Production budget"
        unit="₹"
        total={5000000}
        segments={[
          { label: "Spent", value: 2100000 },
          { label: "Committed", value: 1350000 },
        ]}
      />
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
        <ProgressRing value={18} max={24} label="Scenes shot" centre="18/24" />
        <ProgressRing value={62} label="Edit" size={72} color="#1E3A5F" />
        <Gauge
          value={72}
          label="Investor readiness"
          bands={[
            { upTo: 40, label: "Not ready", color: "#F5B5A6" },
            { upTo: 70, label: "Nearly", color: "#F5D547" },
            { upTo: 100, label: "Ready", color: "#C7E9C0" },
          ]}
        />
      </div>
    </div>
  ),
};
