import type { Meta, StoryObj } from "@storybook/react";
import { CallSheetPublishBar } from "./CallSheetPublishBar";

const meta = {
  title: "Actions/CallSheetPublishBar",
  component: CallSheetPublishBar,
  tags: ["autodocs"],
} satisfies Meta<typeof CallSheetPublishBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: "published",
    version: 2,
    recipientCount: 42,
    publishedAt: new Date(2026, 10, 23, 20, 15),
    onPublish: () => {},
    onWithdraw: () => {},
    onReissue: () => {},
  },
};
export const Blocked: Story = {
  args: {
    ...Default.args,
    state: "draft",
    version: 1,
    blockers: ["Nearest hospital is missing", "Scene 15A has no cast"],
  },
};
