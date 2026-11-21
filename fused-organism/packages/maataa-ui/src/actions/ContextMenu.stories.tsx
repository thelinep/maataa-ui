import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./ContextMenu";

const meta = { title: "Actions/ContextMenu", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const Default: Story = {
  render: () => (
    <ContextMenu
      label="Scene 12"
      items={[
        { id: "rename", label: "Rename", onSelect: noop },
        { id: "split", label: "Split scene", onSelect: noop },
        { id: "del", label: "Delete", onSelect: noop, danger: true },
      ]}
      style={{ width: 320, minHeight: 200 }}
    >
      <div style={{ padding: 16, border: "1px solid #D4AF9F", borderRadius: 10, minHeight: 90 }}>
        <button
          style={{ font: "inherit", border: 0, background: "none", padding: 0, fontWeight: 600 }}
        >
          Scene 12 · Ext. Rooftop · Night
        </button>
        <p style={{ margin: "6px 0 0" }}>Right-click, press Shift+F10, or use the ⋯ button.</p>
      </div>
    </ContextMenu>
  ),
};
