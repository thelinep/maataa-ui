import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeStyle } from "./ThemeStyle";
import { paperTheme, tlpsV2Theme } from "../tokens";
import { Badge, Button, Card, Input } from "../primitives";
import { Checkbox } from "../forms/Checkbox";
import { Toggle } from "../forms/Toggle";
import { ValidationMessage } from "../forms/ValidationMessage";
import { MetricCard } from "../data/MetricCard";
import { BarChart } from "../data/BarChart";
import { SegmentedTabs } from "../navigation/TabVariants";
import { CountBadge, PriorityBadge } from "../status/Indicators";

const meta = {
  title: "Themes/ThemeStyle",
  component: ThemeStyle,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeStyle>;

export default meta;
type Story = StoryObj<typeof meta>;

function Sample({ title }: { title: string }) {
  const [agree, setAgree] = useState(true);
  const [notify, setNotify] = useState(false);
  const [tab, setTab] = useState("crew");
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        padding: 20,
        background: "var(--maataa-color-background-secondary, #FAF6F1)",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "var(--maataa-font-base)" }}>{title}</h3>
      <SegmentedTabs
        label="Project sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "crew", label: "Crew", content: null },
          { id: "budget", label: "Budget", content: null },
          { id: "schedule", label: "Schedule", content: null },
        ]}
      />
      <Card title="Next shoot day" subtitle="Sat 22 Nov · Kabir Nagar">
        <div style={{ display: "grid", gap: 12 }}>
          <Input label="Call time" defaultValue="06:30" />
          <Checkbox checked={agree} onChange={setAgree} label="Send call sheet to crew" />
          <Toggle checked={notify} onChange={setNotify} label="Notify by SMS" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Badge variant="success">Confirmed</Badge>
            <Badge variant="warning">Draft</Badge>
            <Badge variant="error">Blocked</Badge>
            <PriorityBadge priority="high" />
            <span>
              Messages <CountBadge count={3} noun="unread messages" />
            </span>
          </div>
          <ValidationMessage type="error">Location permit is missing.</ValidationMessage>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button>Publish call sheet</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="tertiary">Preview</Button>
            <Button variant="danger">Withdraw</Button>
          </div>
        </div>
      </Card>
      <MetricCard
        label="Budget spent"
        value={412000}
        valuePrefix="₹"
        delta={-4.2}
        deltaPeriod="vs plan"
      />
      <BarChart
        title="Spend by department"
        categories={["Camera", "Art", "Sound", "Locations"]}
        series={[{ label: "Spend", data: [120, 180, 90, 150] }]}
      />
    </div>
  );
}

export const PaperDefault: Story = {
  args: { theme: paperTheme },
  render: () => <Sample title="Default (paper)" />,
};

export const TlpsV2: Story = {
  args: { theme: tlpsV2Theme },
  render: () => (
    <>
      <ThemeStyle theme={tlpsV2Theme} selector=".tlps-v2-sample" />
      <div className="tlps-v2-sample">
        <Sample title="TLPS v2 theme" />
      </div>
    </>
  ),
};

export const SideBySide: Story = {
  args: { theme: tlpsV2Theme },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Sample title="Default (paper)" />
      <>
        <ThemeStyle theme={tlpsV2Theme} selector=".tlps-v2-side" />
        <div className="tlps-v2-side">
          <Sample title="TLPS v2 theme" />
        </div>
      </>
    </div>
  ),
};
