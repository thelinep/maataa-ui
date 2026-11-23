import type { Meta, StoryObj } from "@storybook/react-vite";
import { Waveform, SpectrumAnalyzer, VUMeter } from "./AudioViz";

const meta = { title: "Data/AudioViz", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const peaks = Array.from({ length: 160 }, (_, i) =>
  Math.min(
    1,
    Math.abs(Math.sin(i / 7)) * 0.7 + Math.abs(Math.sin(i / 2.3)) * 0.25 + (i === 96 ? 0.4 : 0)
  )
);
const bands = Array.from({ length: 32 }, (_, i) =>
  Math.max(0.05, Math.exp(-((i - 9) ** 2) / 40) * 0.95 + (i > 24 ? 0.1 : 0))
);

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <Waveform label="Take 3, boom" peaks={peaks} progress={0.4} />
      <SpectrumAnalyzer bands={bands} label="Dialogue bus" />
      <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
        <VUMeter level={-18} peak={-9} label="Boom" />
        <VUMeter level={-0.2} label="Lav 2" orientation="vertical" length={140} />
      </div>
    </div>
  ),
};
