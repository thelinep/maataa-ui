import type { Meta, StoryObj } from "@storybook/react-vite";
import { WrapForm, WrapSummary } from "./WrapForm";

const meta = {
  title: "Forms/WrapForm",
  component: WrapForm,
  tags: ["autodocs"],
} satisfies Meta<typeof WrapForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    shootDay: 4,
    onSubmit: () => {},
    initial: { wrapTime: "19:30", scenesCompleted: "12, 14", pagesShot: "3 3/8", setups: 18 },
  },
};
export const Summary: Story = {
  args: Default.args,
  render: () => (
    <WrapSummary
      shootDay={4}
      submittedBy="Ravi (2nd AD)"
      wrap={{
        wrapTime: "19:30",
        scenesCompleted: "12, 14",
        scenesMoved: "15A to Day 6",
        pagesShot: "3 3/8",
        setups: 18,
        cardsBackedUp: true,
        backupBy: "Meera (DIT)",
        incidents: false,
        notes: "Start with 15A tomorrow at golden hour.",
      }}
    />
  ),
};
