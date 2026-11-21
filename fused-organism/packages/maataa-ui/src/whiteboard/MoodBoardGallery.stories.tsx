import type { Meta, StoryObj } from "@storybook/react";
import { MoodBoardGallery } from "./MoodBoardGallery";

const meta = {
  title: "Whiteboard/MoodBoardGallery",
  component: MoodBoardGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof MoodBoardGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Monsoon evenings",
    onChange: () => {},
    onAddFiles: () => {},
    images: [
      {
        id: "1",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='300' height='200' fill='%232F3E46'/><circle cx='220' cy='60' r='30' fill='%23E3A72F'/></svg>",
        alt: "Slate sky with a low amber streetlight",
        caption: "Night exteriors palette",
      },
      {
        id: "2",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='380'><rect width='300' height='380' fill='%23806641'/></svg>",
        alt: "",
        caption: "Kitchen wood tones",
      },
    ],
  },
};
