import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HorizontalBarChart,
  GroupedBarChart,
  ThresholdBarChart,
  PieChart,
  FunnelChart,
  WaterfallChart,
  RadarChart,
  Heatmap,
} from "./MoreCharts";

const meta = { title: "Data/MoreCharts", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bars: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <HorizontalBarChart
        title="Spend by department"
        unit="₹ lakh"
        sort
        data={[
          { label: "Camera", value: 18.5 },
          { label: "Art", value: 31 },
          { label: "Costume", value: 9.2 },
          { label: "Sound", value: 6.4 },
        ]}
      />
      <GroupedBarChart
        title="Budget vs actual by week"
        unit="₹ lakh"
        categories={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]}
        series={[
          { name: "Budget", values: [12, 14, 14, 10] },
          { name: "Actual", values: [11, 16, 13, 12] },
        ]}
      />
    </div>
  ),
};

export const Threshold: Story = {
  render: () => (
    <ThresholdBarChart
      title="Daily spend vs cap"
      threshold={4}
      thresholdLabel="Daily cap"
      unit="₹ lakh"
      data={["D1", "D2", "D3", "D4", "D5", "D6"].map((label, i) => ({
        label,
        value: [3.2, 4.6, 3.8, 5.1, 2.9, 3.9][i]!,
      }))}
    />
  ),
};

export const Parts: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <PieChart
        title="Where the money goes"
        hole={0.55}
        data={[
          { label: "Above the line", value: 35 },
          { label: "Production", value: 45 },
          { label: "Post", value: 15 },
          { label: "Contingency", value: 5 },
        ]}
      />
      <FunnelChart
        title="Casting funnel"
        stages={[
          { label: "Applied", value: 420 },
          { label: "Shortlisted", value: 96 },
          { label: "Auditioned", value: 40 },
          { label: "Callback", value: 12 },
          { label: "Cast", value: 6 },
        ]}
      />
    </div>
  ),
};

export const Flow: Story = {
  render: () => (
    <WaterfallChart
      title="Cash position this month"
      unit="₹ lakh"
      start={{ label: "Opening", value: 80 }}
      steps={[
        { label: "Grant", value: 25 },
        { label: "Equity", value: 40 },
        { label: "Shoot", value: -95 },
        { label: "Post", value: -18 },
      ]}
      endLabel="Closing"
    />
  ),
};

export const Radar: Story = {
  render: () => (
    <RadarChart
      title="Concept strength"
      axes={["Story", "Characters", "Market", "Budget fit", "Cast appeal", "Originality"]}
      series={[
        { name: "Draft 2", values: [8, 7, 5, 6, 4, 9] },
        { name: "Draft 3", values: [9, 8, 6, 7, 6, 8] },
      ]}
    />
  ),
};

export const HeatmapStory: Story = {
  name: "Heatmap",
  render: () => (
    <Heatmap
      title="Crew availability (people free)"
      rows={["Camera", "Lighting", "Sound", "Art"]}
      columns={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      values={[
        [6, 5, 2, 6, 6, 3],
        [8, 8, 7, 3, 2, 8],
        [3, 3, 3, 1, 3, 3],
        [10, 9, 4, 4, 8, 10],
      ]}
    />
  ),
};
