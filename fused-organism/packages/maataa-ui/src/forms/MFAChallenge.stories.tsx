import type { Meta, StoryObj } from "@storybook/react";
import { MFAChallenge } from "./MFAChallenge";

const meta = {
  title: "Forms/MFAChallenge",
  component: MFAChallenge,
  tags: ["autodocs"],
} satisfies Meta<typeof MFAChallenge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: () => {}, onCancel: () => {} } };
