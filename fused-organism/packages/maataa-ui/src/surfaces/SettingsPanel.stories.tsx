import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsPanel } from "./SettingsPanel";

const meta = {
  title: "Surfaces/SettingsPanel",
  component: SettingsPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Project settings",
    dirty: true,
    onSave: () => {},
    onDiscard: () => {},
    sections: [
      {
        id: "g",
        title: "General",
        description: "Name and language",
        content: <input aria-label="Project name" defaultValue="Monsoon Diaries" />,
      },
      {
        id: "d",
        title: "Danger zone",
        description: "Archive or transfer this project",
        danger: true,
        content: <button>Archive project</button>,
      },
    ],
  },
};
