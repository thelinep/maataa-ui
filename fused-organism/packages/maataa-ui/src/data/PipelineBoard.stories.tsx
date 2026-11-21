import type { Meta, StoryObj } from "@storybook/react";
import { PipelineBoard } from "./PipelineBoard";

const meta = {
  title: "Data/PipelineBoard",
  component: PipelineBoard,
  tags: ["autodocs"],
} satisfies Meta<typeof PipelineBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onMove: () => {},
    stages: [
      { id: "new", label: "New" },
      { id: "short", label: "Shortlist" },
      { id: "cb", label: "Callbacks" },
      { id: "offer", label: "Offer" },
    ],
    cards: [
      { id: "a", title: "Asha Rao", subtitle: "Meera (lead)", stage: "cb", person: true },
      { id: "b", title: "Ravi Menon", subtitle: "Arjun", stage: "short", person: true },
      { id: "c", title: "Meera Iyer", subtitle: "Meera (lead)", stage: "new", person: true },
      { id: "d", title: "Dev Lohan", subtitle: "Lyricist cameo", stage: "offer", person: true },
    ],
  },
};
