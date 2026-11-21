import type { Meta, StoryObj } from "@storybook/react";
import { DocumentList } from "./DocumentList";

const meta = {
  title: "Data/DocumentList",
  component: DocumentList,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onDownload: () => {},
    onOpenIssue: () => {},
    documents: [
      {
        id: "1",
        name: "shoot-permit.pdf",
        size: 240000,
        uploadedAt: new Date(2026, 10, 20),
        uploadedBy: "Asha",
        scan: "clean",
      },
      {
        id: "2",
        name: "vendor-invoice.pdf",
        size: 120000,
        uploadedAt: new Date(2026, 10, 20),
        scan: "quarantined",
      },
      {
        id: "3",
        name: "call-sheet.docx",
        size: 80000,
        uploadedAt: new Date(2026, 10, 21),
        scan: "scanning",
      },
    ],
  },
};
