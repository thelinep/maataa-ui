import type { Meta, StoryObj } from "@storybook/react";
import { ReviewThread } from "./ReviewThread";

const meta = {
  title: "Data/ReviewThread",
  component: ReviewThread,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewThread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentTimecode: "00:14:22:05",
    onSeek: () => {},
    onReply: () => {},
    onToggleResolved: () => {},
    onAdd: () => {},
    notes: [
      {
        id: "1",
        timecode: "00:12:04:10",
        author: "PHKD",
        text: "Hold on Meera a beat longer before the cut to the door.",
        at: new Date(2026, 10, 20, 21),
        replies: [
          {
            id: "r",
            author: "Asha Rao",
            text: "Extended by 18 frames in v8.",
            at: new Date(2026, 10, 21, 10),
          },
        ],
      },
      {
        id: "2",
        timecode: "00:03:00:00",
        author: "Ravi Menon",
        text: "Dialogue dips under the rain bed.",
        at: new Date(2026, 10, 19),
        resolved: true,
      },
    ],
  },
};
