import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileDropzone } from "./FileDropzone";

const meta = {
  title: "Forms/FileDropzone",
  component: FileDropzone,
  tags: ["autodocs"],
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Upload script",
    accept: ".pdf,.fdx",
    maxSizeBytes: 20 * 1024 * 1024,
    hint: "PDF or Final Draft, up to 20 MB",
    onFiles: () => {},
  },
};
