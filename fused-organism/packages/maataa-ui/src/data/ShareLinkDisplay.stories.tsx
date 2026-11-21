import type { Meta, StoryObj } from "@storybook/react";
import { ShareLinkDisplay } from "./ShareLinkDisplay";

const meta = {
  title: "Data/ShareLinkDisplay",
  component: ShareLinkDisplay,
  tags: ["autodocs"],
} satisfies Meta<typeof ShareLinkDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "https://maataa.in/cs/day4-v2-8f3k",
    what: "call sheet",
    audience: "Cast and crew on this call sheet",
    expiresAt: new Date(2026, 10, 25, 23, 59),
    onRevoke: () => {},
  },
};
