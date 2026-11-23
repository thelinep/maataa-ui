import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCropUpload } from "./ImageCropUpload";

const meta = { title: "Forms/ImageCropUpload", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ImageCropUpload
      label="Headshot"
      shape="circle"
      hint="PNG, JPEG or WebP. You can zoom and move the picture before saving."
      onCrop={() => {}}
    />
  ),
};
