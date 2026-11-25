import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatMarkdown } from "./ChatMarkdown";
import { renderChatBlock } from "./ChatBlocks";

const meta = {
  title: "AI/ChatMarkdown",
  component: ChatMarkdown,
  tags: ["autodocs"],
} satisfies Meta<typeof ChatMarkdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A model's reply as formatted text. HTML in a reply stays text and never runs. */
export const Formatting: Story = {
  args: {
    children:
      '### Shoot notes\n\nUse **ShotList** for shots and `CallSheetPrintView` for the day.\n\n1. Load the van\n2. Drive to the haveli\n\n> Golden hour starts at 5:40 pm.\n\n```tsx\nimport { ShotList } from "@maataa/ui/data";\n```',
  },
};

/** MAATAA blocks: the model writes JSON in a fenced block, the chat draws the component. */
export const MaataaBlocks: Story = {
  args: {
    renderBlock: (b) => renderChatBlock(b),
    children:
      '```shotlist\n{"title":"Dhoop","scenes":[{"scene":"1","heading":"INT. KITCHEN - DAY","shots":[{"shot":"1A","size":"WS","angle":"Eye level","movement":"Static","description":"Steam rises from the pot"},{"shot":"1B","size":"CU","angle":"Low","movement":"Push in","description":"Amma’s hands"}]}]}\n```\n\n```date\n{"date":"2026-11-25"}\n```',
  },
};
