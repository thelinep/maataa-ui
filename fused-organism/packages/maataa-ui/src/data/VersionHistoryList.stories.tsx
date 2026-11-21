import type { Meta, StoryObj } from "@storybook/react";
import { VersionHistoryList } from "./VersionHistoryList";

const meta = {
  title: "Data/VersionHistoryList",
  component: VersionHistoryList,
  tags: ["autodocs"],
} satisfies Meta<typeof VersionHistoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Edit versions",
    currentId: "v8",
    onOpen: () => {},
    onCompare: () => {},
    onRestore: () => {},
    onDownload: () => {},
    versions: [
      {
        id: "v8",
        label: "Cut v8",
        createdAt: new Date(2026, 10, 20, 18),
        author: "Asha",
        status: "Picture locked",
        statusVariant: "success",
        meta: "1:52:10",
      },
      {
        id: "v7",
        label: "Cut v7",
        createdAt: new Date(2026, 10, 14, 11),
        author: "Asha",
        meta: "1:58:40",
        note: "Director’s notes from the 12 Nov screening",
      },
      {
        id: "v6",
        label: "Cut v6",
        createdAt: new Date(2026, 10, 2),
        author: "Asha",
        meta: "2:06:05",
      },
    ],
  },
};
