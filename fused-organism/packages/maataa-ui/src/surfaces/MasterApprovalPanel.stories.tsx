import type { Meta, StoryObj } from "@storybook/react-vite";
import { MasterApprovalPanel } from "./MasterApprovalPanel";

const meta = {
  title: "Surfaces/MasterApprovalPanel",
  component: MasterApprovalPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof MasterApprovalPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Monsoon Diaries · final master",
    onApprove: () => {},
    onReject: () => {},
    deliverables: [
      { id: "1", name: "DCP 2K Flat", qc: "passed" },
      { id: "2", name: "ProRes 4444 master", qc: "passed" },
      { id: "3", name: "Subtitles (Hindi, English)", qc: "inReview" },
      { id: "4", name: "Audio description track", qc: "notStarted" },
    ],
  },
};
export const Ready: Story = {
  args: {
    ...Default.args,
    deliverables: [
      { id: "1", name: "DCP 2K Flat", qc: "passed" },
      { id: "2", name: "Subtitles", qc: "waived" },
    ],
  },
};
