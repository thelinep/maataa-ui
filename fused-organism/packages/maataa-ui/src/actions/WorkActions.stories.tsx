import type { Meta, StoryObj } from "@storybook/react";
import { SaveDraftButton, BulkActionBar } from "./WorkActions";

const meta = { title: "Actions/WorkActions", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20, maxWidth: 720 }}>
      <SaveDraftButton
        onSave={async () => {}}
        dirty={false}
        savedAt={new Date(Date.now() - 120000)}
      />
      <SaveDraftButton onSave={async () => {}} dirty autosaveMs={60000} />
      <BulkActionBar
        count={3}
        noun="shots"
        total={42}
        onSelectAll={noop}
        actions={[
          { id: "move", label: "Move to day…", onClick: noop },
          { id: "export", label: "Export", onClick: noop },
          { id: "del", label: "Delete", onClick: noop, danger: true },
        ]}
        onClearSelection={noop}
      />
    </div>
  ),
};
