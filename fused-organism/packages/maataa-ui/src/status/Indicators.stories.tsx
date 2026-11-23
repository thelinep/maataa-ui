import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CountBadge,
  PriorityBadge,
  IndeterminateProgress,
  BufferingIndicator,
  LoadingOverlay,
  SkeletonTable,
} from "./Indicators";

const meta = { title: "Status/Indicators", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Badges: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <span>
        Messages <CountBadge count={7} noun="unread messages" />
      </span>
      <span>
        Alerts <CountBadge count={140} noun="alerts" />
      </span>
      <PriorityBadge priority="urgent" />
      <PriorityBadge priority="high" />
      <PriorityBadge priority="medium" />
      <PriorityBadge priority="low" />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <IndeterminateProgress label="Rendering proxies" />
      <SkeletonTable label="Loading crew" rows={3} columns={4} />
      <div style={{ position: "relative", height: 150, borderRadius: 8, background: "#2B1F14" }}>
        <BufferingIndicator buffering percent={38} />
      </div>
      <div
        style={{ position: "relative", height: 170, border: "1px dashed #D4AF9F", borderRadius: 8 }}
      >
        <p style={{ padding: 12, margin: 0 }}>Call sheet content…</p>
        <LoadingOverlay loading label="Exporting the call sheet" onCancel={() => {}} />
      </div>
    </div>
  ),
};
