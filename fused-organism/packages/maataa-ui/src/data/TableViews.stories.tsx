import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AgendaView, InlineEditGrid, ComparisonTable, DiffView } from "./TableViews";

const meta = { title: "Data/TableViews", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date(2026, 10, 21);
const at = (d: number, h: number, m = 0) => new Date(2026, 10, d, h, m);

export const Agenda: Story = {
  render: () => (
    <AgendaView
      from={today}
      today={today}
      days={7}
      onSelect={() => {}}
      events={[
        {
          id: "1",
          title: "Recce — Chandni Chowk",
          start: at(21, 7, 30),
          end: at(21, 11),
          kind: "Locations",
        },
        {
          id: "2",
          title: "Costume fittings",
          start: at(21, 14),
          end: at(21, 17),
          kind: "Wardrobe",
        },
        { id: "3", title: "Table read", start: at(23, 10), end: at(23, 13), kind: "Rehearsal" },
        { id: "4", title: "Day 1 — Ext. Rooftop", start: at(26, 5, 30), kind: "Shoot" },
      ]}
    />
  ),
};

type Row = { id: string; role: string; name: string; rate: number; days: number };
function GridDemo() {
  const [rows, setRows] = useState<Row[]>([
    { id: "a", role: "DOP", name: "Arjun Rao", rate: 25000, days: 24 },
    { id: "b", role: "Gaffer", name: "Imran Sheikh", rate: 9000, days: 24 },
    { id: "c", role: "Sound mixer", name: "Meera Iyer", rate: 12000, days: 22 },
  ]);
  return (
    <InlineEditGrid<Row>
      label="Crew rates"
      rowHeaderKey="role"
      rows={rows}
      columns={[
        { key: "role", header: "Role" },
        { key: "name", header: "Name" },
        { key: "rate", header: "Day rate (₹)", editable: true, type: "number", align: "right" },
        { key: "days", header: "Days", editable: true, type: "number", align: "right", width: 90 },
      ]}
      onChange={(id, k, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)))}
    />
  );
}
export const Grid: Story = { render: () => <GridDemo /> };

export const Compare: Story = {
  render: () => (
    <ComparisonTable
      label="Camera packages"
      highlightDifferences
      options={[
        { id: "a", name: "Alexa 35" },
        { id: "b", name: "Sony FX9", recommended: true },
        { id: "c", name: "RED Komodo" },
      ]}
      rows={[
        { feature: "Day rate", values: { a: "₹45,000", b: "₹18,000", c: "₹22,000" } },
        { feature: "Lenses included", values: { a: true, b: true, c: false } },
        { feature: "Raw recording", values: { a: true, b: false, c: true } },
        { feature: "Operator available", values: { a: true, b: true, c: true } },
        { feature: "Weight (kg)", values: { a: 2.9, b: 2.0, c: 1.0 } },
      ]}
    />
  ),
};

export const Diff: Story = {
  render: () => (
    <DiffView
      label="Scene 4 changes"
      beforeLabel="v2"
      afterLabel="v3"
      before={
        "INT. FLAT — NIGHT\nRain hammers the window.\nASHA\nYou said you'd call.\nARJUN\nI did."
      }
      after={
        "INT. FLAT — NIGHT\nThe power is out. Rain hammers the window.\nASHA\nYou said you'd call.\nARJUN\nI tried. Twice."
      }
    />
  ),
};
