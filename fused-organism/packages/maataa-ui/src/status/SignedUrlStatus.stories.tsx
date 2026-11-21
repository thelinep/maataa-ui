import type { Meta, StoryObj } from "@storybook/react";
import { SignedUrlStatus } from "./SignedUrlStatus";

const meta = {
  title: "Status/SignedUrlStatus",
  component: SignedUrlStatus,
  tags: ["autodocs"],
} satisfies Meta<typeof SignedUrlStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { expiresAt: new Date(Date.now() + 45_000), onRefresh: () => {} },
};
