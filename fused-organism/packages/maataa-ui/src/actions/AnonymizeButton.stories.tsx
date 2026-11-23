import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnonymizeButton } from "./AnonymizeButton";

const meta = {
  title: "Actions/AnonymizeButton",
  component: AnonymizeButton,
  tags: ["autodocs"],
} satisfies Meta<typeof AnonymizeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    personName: "Asha Rao",
    retainedNote: "Hours and payments stay for the accounts.",
    onAnonymize: () => {},
  },
};
