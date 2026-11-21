import type { Meta, StoryObj } from "@storybook/react";
import { UndoSnackbar } from "./UndoSnackbar";

const meta = { title: "Surfaces/UndoSnackbar", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: 160 }}>
      <UndoSnackbar
        message="Scene 12 deleted"
        onUndo={() => {}}
        onDismiss={() => {}}
        durationMs={600000}
      />
    </div>
  ),
};
