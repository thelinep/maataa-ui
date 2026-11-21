import type { Meta, StoryObj } from "@storybook/react";
import { PeopleDirectory } from "./PeopleDirectory";

const meta = {
  title: "Data/PeopleDirectory",
  component: PeopleDirectory,
  tags: ["autodocs"],
} satisfies Meta<typeof PeopleDirectory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onOpen: () => {},
    people: [
      {
        id: "1",
        name: "Asha Rao",
        role: "Editor",
        department: "Post",
        city: "Mumbai",
        presence: "online",
        status: "Available",
      },
      { id: "2", name: "Ravi Menon", role: "Sound recordist", department: "Sound", city: "Delhi" },
      { id: "3", name: "Meera Iyer", role: "Costume designer", department: "Art", city: "Chennai" },
    ],
  },
};
