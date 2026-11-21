import type { Meta, StoryObj } from "@storybook/react";
import { ScreeningFeedbackForm } from "./ScreeningFeedbackForm";

const meta = {
  title: "Forms/ScreeningFeedbackForm",
  component: ScreeningFeedbackForm,
  tags: ["autodocs"],
} satisfies Meta<typeof ScreeningFeedbackForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { film: "Monsoon Diaries", onSubmit: () => {} } };
