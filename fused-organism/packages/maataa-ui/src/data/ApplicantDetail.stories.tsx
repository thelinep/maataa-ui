import type { Meta, StoryObj } from "@storybook/react";
import { ApplicantDetail } from "./ApplicantDetail";

const meta = {
  title: "Data/ApplicantDetail",
  component: ApplicantDetail,
  tags: ["autodocs"],
} satisfies Meta<typeof ApplicantDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    applicant: {
      id: "1",
      name: "Asha Rao",
      role: "Meera (lead)",
      stage: "Callbacks",
      city: "Mumbai",
      languages: ["Hindi", "Marathi", "English"],
      experience: "Two features, one web series",
      message:
        "I grew up near Shahdara and know this world. My showreel has the monsoon scene from Kabir Nagar Nights.",
      appliedAt: new Date(2026, 10, 2),
      portfolio: [
        { id: "p1", name: "showreel.mp4", kind: "video" },
        { id: "p2", name: "headshot.jpg", kind: "image" },
      ],
    },
  },
};
