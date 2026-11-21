import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AppliedFilterChips,
  SortSelector,
  type AppliedFilter,
  type SortValue,
} from "./ListControls";

const meta = { title: "Forms/ListControls", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [f, setF] = useState<AppliedFilter[]>([
    { id: "d", field: "Department", value: "Camera" },
    { id: "s", field: "Status", value: "Booked" },
    { id: "w", field: "Week", value: "47" },
  ]);
  const [sort, setSort] = useState<SortValue>({ field: "date", direction: "desc" });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <SortSelector
        fields={[
          { value: "date", label: "Date added", directions: ["Oldest first", "Newest first"] },
          { value: "name", label: "Name" },
          { value: "rate", label: "Day rate", directions: ["Lowest first", "Highest first"] },
        ]}
        value={sort}
        onChange={setSort}
      />
      <AppliedFilterChips
        filters={f}
        resultCount={14}
        noun="crew"
        onRemove={(id) => setF((x) => x.filter((y) => y.id !== id))}
        onClearAll={() => setF([])}
      />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
