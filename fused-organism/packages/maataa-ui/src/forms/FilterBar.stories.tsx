import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./FilterBar";

const meta = {
  title: "Forms/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Filter productions",
    values: { genre: "drama", type: "" },
    onChange: () => {},
    resultCount: 12,
    resultNoun: "productions",
    filters: [
      {
        id: "genre",
        label: "Genre",
        options: [
          { value: "drama", label: "Drama" },
          { value: "comedy", label: "Comedy" },
        ],
      },
      {
        id: "type",
        label: "Type",
        options: [
          { value: "feature", label: "Feature" },
          { value: "short", label: "Short" },
        ],
      },
    ],
  },
};
