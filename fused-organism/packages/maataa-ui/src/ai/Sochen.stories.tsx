import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModelResponse, ThoughtInput, ModelConfiguredCheck, ThoughtHistory } from "./Sochen";

const meta = {
  title: "AI/ModelResponse",
  component: ModelResponse,
  tags: ["autodocs"],
} satisfies Meta<typeof ModelResponse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prompt: "Is the second act too slow?",
    model: "Claude",
    at: new Date(),
    text: "Partly. Scenes 17–19 repeat the same beat: Meera hesitates, then doesn’t call.\n\nTry cutting 18 and moving the phone call into 19, so the hesitation lands once.",
  },
};
export const Streaming: Story = {
  args: { ...Default.args, text: "Partly. Scenes 17–19 repeat", streaming: true, onStop: () => {} },
};
export const Input: Story = {
  args: Default.args,
  render: () => <ThoughtInput onSubmit={() => {}} />,
};
export const NotConfigured: Story = {
  args: Default.args,
  render: () => (
    <ModelConfiguredCheck
      configured={false}
      reason="No model connected"
      canConfigure
      onConfigure={() => {}}
    >
      <p>hidden</p>
    </ModelConfiguredCheck>
  ),
};
export const History: Story = {
  args: Default.args,
  render: () => (
    <ThoughtHistory
      onOpen={() => {}}
      onDelete={() => {}}
      activeId="1"
      thoughts={[
        {
          id: "1",
          text: "Is the second act too slow?",
          at: new Date(2026, 10, 21, 11),
          preview: "Partly. Scenes 17–19…",
        },
        { id: "2", text: "Title ideas for the film", at: new Date(2026, 10, 2), pinned: true },
      ]}
    />
  ),
};
