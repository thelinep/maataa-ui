import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductionListingGrid } from "./ProductionListing";

const meta = {
  title: "Data/ProductionListingGrid",
  component: ProductionListingGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductionListingGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Monsoon Diaries",
        type: "Feature film",
        genre: "Drama",
        location: "Mumbai",
        when: "Shooting Jan–Feb 2027",
        openRoles: ["Editor", "Gaffer"],
      },
      {
        id: "2",
        title: "Kabir Nagar Nights",
        type: "Web series",
        genre: "Thriller",
        location: "Delhi",
        openRoles: ["Sound recordist"],
      },
      { id: "3", title: "Dev's Song", type: "Music video", location: "Shahdara" },
    ],
  },
};
export const EmptyPrivacyFiltered: Story = {
  args: { items: [], hiddenCount: 3, onClearFilters: () => {} },
};
