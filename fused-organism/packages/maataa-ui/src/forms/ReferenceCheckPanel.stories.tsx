import type { Meta, StoryObj } from "@storybook/react";
import { ReferenceCheckPanel } from "./ReferenceCheckPanel";

const meta = {
  title: "Forms/ReferenceCheckPanel",
  component: ReferenceCheckPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof ReferenceCheckPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    applicantName: "Asha Rao",
    onUpdate: () => {},
    references: [
      {
        id: "1",
        refereeName: "Ravi Menon",
        relation: "Director, Kabir Nagar Nights",
        status: "positive",
      },
      { id: "2", refereeName: "Meera Iyer", relation: "Casting director", status: "contacted" },
      { id: "3", refereeName: "Dev Lohan", relation: "Lyricist", status: "toContact" },
    ],
  },
};
