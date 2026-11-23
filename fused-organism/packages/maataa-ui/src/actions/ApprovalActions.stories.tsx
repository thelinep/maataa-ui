import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApprovalActions } from "./ApprovalActions";

const meta = {
  title: "Actions/ApprovalActions",
  component: ApprovalActions,
  tags: ["autodocs"],
} satisfies Meta<typeof ApprovalActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { subject: "Ravi’s timesheet, week 47", onApprove: () => {}, onReject: () => {} },
};
