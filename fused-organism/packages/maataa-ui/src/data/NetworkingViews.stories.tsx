import type { Meta, StoryObj } from "@storybook/react";
import { NetworkingContactList, PrivateNotes } from "./NetworkingViews";

const meta = {
  title: "Data/NetworkingContactList",
  component: NetworkingContactList,
  tags: ["autodocs"],
} satisfies Meta<typeof NetworkingContactList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onOpen: () => {},
    contacts: [
      {
        id: "1",
        name: "Asha Rao",
        role: "Editor",
        company: "Cutroom",
        howWeMet: "Met at MAMI 2026",
        lastContact: new Date(2026, 9, 12),
        tags: ["post", "features"],
        consent: "given",
      },
      { id: "2", name: "Ravi Menon", role: "Sound designer", consent: "pending" },
      { id: "3", name: "Zoya", role: "Producer", consent: "withdrawn" },
    ],
  },
};
export const Notes: Story = {
  args: Default.args,
  render: () => (
    <PrivateNotes
      about="Asha Rao"
      onAdd={() => {}}
      onDelete={() => {}}
      notes={[
        {
          id: "1",
          text: "Prefers WhatsApp to email. Free from February.",
          at: new Date(2026, 10, 12),
          author: "Hemant",
        },
      ]}
    />
  ),
};
