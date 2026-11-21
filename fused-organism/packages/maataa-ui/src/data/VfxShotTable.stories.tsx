import type { Meta, StoryObj } from "@storybook/react";
import { VfxShotTable } from "./VfxShotTable";

const meta = {
  title: "Data/VfxShotTable",
  component: VfxShotTable,
  tags: ["autodocs"],
} satisfies Meta<typeof VfxShotTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    now: new Date(2026, 10, 21),
    onAssign: () => {},
    artists: [
      { id: "a", name: "Asha (comp)" },
      { id: "m", name: "Meera (paint)" },
    ],
    shots: [
      {
        id: "1",
        code: "MD_042_010",
        scene: "42",
        description: "Window, night",
        work: "Rain comp",
        frames: 120,
        artistId: "a",
        due: new Date(2026, 10, 18),
        render: "rendering",
      },
      {
        id: "2",
        code: "MD_042_020",
        scene: "42",
        description: "Reverse",
        work: "Rain comp",
        frames: 86,
        due: new Date(2026, 10, 28),
        render: "queued",
      },
      {
        id: "3",
        code: "MD_051_005",
        scene: "51",
        description: "Skyline",
        work: "Sky replacement",
        frames: 240,
        artistId: "m",
        render: "done",
      },
    ],
  },
};
