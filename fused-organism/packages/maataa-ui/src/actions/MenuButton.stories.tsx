import type { Meta, StoryObj } from "@storybook/react";
import { MenuButton, SplitButton, ShareMenu, FabMenu } from "./MenuButton";

const meta = { title: "Actions/MenuButton", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};
const items = [
  { id: "dup", label: "Duplicate", onSelect: noop, hint: "Ctrl+D" },
  { id: "move", label: "Move to day 2", onSelect: noop, disabled: true },
  { id: "del", label: "Delete", onSelect: noop, danger: true },
];

export const Default: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", minHeight: 260 }}
    >
      <MenuButton label="Shot actions" items={items} />
      <SplitButton
        label="Save"
        onClick={noop}
        items={[
          { id: "copy", label: "Save as copy", onSelect: noop },
          { id: "tpl", label: "Save as template", onSelect: noop },
        ]}
      />
      <ShareMenu url="https://maataa.in/p/monsoon" title="Monsoon Wedding" />
      <FabMenu
        label="Create"
        fixed={false}
        items={[
          { id: "scene", label: "New scene", icon: "🎬", onSelect: noop },
          { id: "shot", label: "New shot", icon: "📷", onSelect: noop },
          { id: "note", label: "New note", icon: "📝", onSelect: noop },
        ]}
      />
    </div>
  ),
};
