import type { Meta, StoryObj } from "@storybook/react";
import { CueList } from "./CueList";

const meta = {
  title: "Data/CueList",
  component: CueList,
  tags: ["autodocs"],
} satisfies Meta<typeof CueList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSeek: () => {},
    cues: [
      {
        id: "1",
        code: "1M3",
        kind: "music",
        in: "01:02:10:00",
        out: "01:04:40:12",
        description: "Rain theme (PHKD)",
        status: "delivered",
        cleared: true,
      },
      {
        id: "2",
        code: "1M4",
        kind: "music",
        in: "01:08:00:00",
        out: "01:08:45:00",
        description: "Radio song in the kitchen",
        status: "spotted",
      },
      {
        id: "3",
        code: "SFX 12",
        kind: "sfx",
        in: "01:09:12:00",
        out: "01:09:14:00",
        description: "Door slam",
        status: "approved",
      },
    ],
  },
};
