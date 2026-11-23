import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScriptEditor, FormatToolbar, SceneNavigator, CharacterTracker } from "./ScriptEditor";

const meta = {
  title: "Forms/ScriptEditor",
  component: ScriptEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof ScriptEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Monsoon Diaries",
    onChange: () => {},
    elements: [
      { id: "1", type: "scene", text: "INT. MEERA'S KITCHEN - NIGHT" },
      {
        id: "2",
        type: "action",
        text: "Rain hammers the tin roof. MEERA (30s) stirs a pot she isn't watching.",
      },
      { id: "3", type: "character", text: "MEERA" },
      { id: "4", type: "parenthetical", text: "(without turning)" },
      { id: "5", type: "dialogue", text: "You came back." },
      { id: "6", type: "transition", text: "CUT TO:" },
    ],
  },
};
export const WithPanels: Story = {
  args: Default.args,
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <FormatToolbar current="dialogue" onChange={() => {}} />
        <ScriptEditor {...args} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SceneNavigator elements={args.elements} onGo={() => {}} currentId="5" />
        <CharacterTracker elements={args.elements} />
      </div>
    </div>
  ),
};
