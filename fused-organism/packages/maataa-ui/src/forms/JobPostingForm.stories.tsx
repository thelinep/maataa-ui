import type { Meta, StoryObj } from "@storybook/react";
import { JobPostingForm } from "./JobPostingForm";

const meta = {
  title: "Forms/JobPostingForm",
  component: JobPostingForm,
  tags: ["autodocs"],
} satisfies Meta<typeof JobPostingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: () => {}, onSaveDraft: () => {} } };
