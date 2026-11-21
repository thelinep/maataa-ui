import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConfirmDialog, TypedConfirmDialog } from "./ConfirmDialog";
import { Button } from "../primitives/Button";

const meta = {
  title: "Surfaces/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "Archive this project?",
    message: "It moves to Archived. You can restore it later.",
    confirmLabel: "Archive",
    onConfirm: () => {},
    onCancel: () => {},
  },
};

function TypedDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <TypedConfirmDialog
        isOpen={open}
        title="Delete Monsoon Diaries?"
        message="Every scene, budget and schedule is removed. This cannot be undone."
        confirmationText="Monsoon Diaries"
        confirmLabel="Delete forever"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

export const Typed: Story = { args: Default.args, render: () => <TypedDemo /> };
