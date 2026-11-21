import type { Meta, StoryObj } from "@storybook/react";
import { InvitationAcceptance, InvitationRecoveryPanel } from "./Invitation";

const meta = {
  title: "Forms/InvitationAcceptance",
  component: InvitationAcceptance,
  tags: ["autodocs"],
} satisfies Meta<typeof InvitationAcceptance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    invitation: {
      inviterName: "Hemant",
      workspaceName: "Monsoon Diaries",
      role: "Editor",
      email: "asha@vesahe.in",
      expiresAt: new Date(Date.now() + 2 * 86_400_000),
    },
    onAccept: () => {},
    onDecline: () => {},
  },
};
export const Recovery: Story = {
  args: Default.args,
  render: () => (
    <InvitationRecoveryPanel
      problem="expired"
      inviterName="Hemant"
      workspaceName="Monsoon Diaries"
      onRequestNew={() => {}}
      onGoHome={() => {}}
    />
  ),
};
