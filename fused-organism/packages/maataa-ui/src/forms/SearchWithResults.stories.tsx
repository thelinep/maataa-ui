import type { Meta, StoryObj } from "@storybook/react";
import { SearchWithResults } from "./SearchWithResults";

const meta = {
  title: "Forms/SearchWithResults",
  component: SearchWithResults,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchWithResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Search people and projects",
    query: "as",
    onQueryChange: () => {},
    onSelect: () => {},
    results: [
      { id: "1", label: "Asha Rao", description: "Editor", group: "People" },
      { id: "2", label: "Kabir Nagar Nights", description: "Filming", group: "Projects" },
    ],
  },
};
