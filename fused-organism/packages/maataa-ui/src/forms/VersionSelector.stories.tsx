import type { Meta, StoryObj } from "@storybook/react";
import { VersionSelector } from "./VersionSelector";

const meta = {
  title: "Forms/VersionSelector",
  component: VersionSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof VersionSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subject: "Budget",
    value: "v2",
    currentId: "v3",
    onChange: () => {},
    onCompareChange: () => {},
    versions: [
      { id: "v1", label: "v1", createdAt: new Date(2026, 9, 2), author: "Hemant", status: "Draft" },
      {
        id: "v2",
        label: "v2",
        createdAt: new Date(2026, 10, 10),
        author: "Asha",
        status: "Superseded",
        note: "Before the catering change",
      },
      {
        id: "v3",
        label: "v3",
        createdAt: new Date(2026, 10, 18),
        author: "Asha",
        status: "Approved",
      },
    ],
  },
};
