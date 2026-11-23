import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttachmentUploader } from "./AttachmentUploader";

const meta = {
  title: "Forms/AttachmentUploader",
  component: AttachmentUploader,
  tags: ["autodocs"],
} satisfies Meta<typeof AttachmentUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Attach files",
    onAdd: () => {},
    onRemove: () => {},
    attachments: [
      { id: "1", name: "call-sheet-day-4.pdf", size: 240_000, state: "uploading", progress: 60 },
      { id: "2", name: "location-map.png", size: 1_200_000, state: "done", scan: "clean" },
      { id: "3", name: "rushes.mov", size: 2_000_000_000, state: "error", error: "over 500 MB" },
    ],
  },
};
