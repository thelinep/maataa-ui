import type { Meta, StoryObj } from "@storybook/react";
import {
  StateBadge,
  qcStates,
  clearanceStates,
  renderStates,
  signatureStates,
  deliveryStates,
  publicationStates,
  approvalStates,
  permitStates,
} from "./StateBadge";

const meta = {
  title: "Status/StateBadge",
  component: StateBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof StateBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { state: "passed", states: qcStates, prefix: "QC" } };
export const AllStates: Story = {
  args: Default.args,
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[
        clearanceStates,
        renderStates,
        signatureStates,
        deliveryStates,
        publicationStates,
        approvalStates,
        permitStates,
      ].map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(m).map((k) => (
            <StateBadge key={k} state={k} states={m} />
          ))}
        </div>
      ))}
    </div>
  ),
};
