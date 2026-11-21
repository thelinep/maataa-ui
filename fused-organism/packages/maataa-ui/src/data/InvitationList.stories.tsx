import type { Meta, StoryObj } from "@storybook/react";
import { InvitationList } from "./InvitationList";

const meta = {
  title: "Data/InvitationList",
  component: InvitationList,
  tags: ["autodocs"],
} satisfies Meta<typeof InvitationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onResend: () => {},
    onRevoke: () => {},
    invitations: [
      {
        id: "1",
        email: "ravi@vesahe.in",
        role: "Editor",
        sentAt: new Date(Date.now() - 2 * 86_400_000),
        expiresAt: new Date(Date.now() + 5 * 86_400_000),
        invitedBy: "Hemant",
      },
      {
        id: "2",
        email: "meera@vesahe.in",
        role: "Viewer",
        sentAt: new Date(Date.now() - 10 * 86_400_000),
        expiresAt: new Date(Date.now() - 3 * 86_400_000),
      },
    ],
  },
};
