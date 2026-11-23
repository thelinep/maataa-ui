import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandPalette } from "./CommandPalette";

const meta = {
  title: "Surfaces/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    commands: [
      { id: "p", label: "Projects", group: "Go to", shortcut: "G P", run: () => {} },
      {
        id: "b",
        label: "Budgets",
        group: "Go to",
        shortcut: "G B",
        keywords: ["money"],
        run: () => {},
      },
      { id: "n", label: "New project", group: "Create", run: () => {} },
      { id: "c", label: "New call sheet", group: "Create", run: () => {} },
    ],
  },
};
