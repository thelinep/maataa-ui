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

/** A ```map block: places drawn offline, each linking to OpenStreetMap. */
export const MapBlock: Story = {
  args: {
    renderBlock: (b) => renderChatBlock(b),
    children:
      '```map\n{"title":"Recce, Old Delhi","places":[{"name":"Haveli","lat":28.6562,"lng":77.2301,"note":"Location"},{"name":"LNJP Hospital","lat":28.6386,"lng":77.2385,"note":"Nearest hospital"},{"name":"Parking","lat":28.6505,"lng":77.2334}]}\n```',
  },
};

/** HTML written straight into a reply becomes an html block (shown as code here; apps run it in a sandbox). */
export const RawHtml: Story = {
  args: {
    children:
      "Here is a counter:\n<!doctype html>\n<html><body><h1>0</h1></body></html>\nTap the button.",
  },
};
