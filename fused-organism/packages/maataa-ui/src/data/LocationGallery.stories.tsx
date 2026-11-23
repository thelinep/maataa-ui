import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocationGallery, LocationDetail } from "./LocationGallery";

const meta = {
  title: "Data/LocationGallery",
  component: LocationGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof LocationGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onOpen: () => {},
    locations: [
      {
        id: "1",
        name: "Bandra bungalow",
        area: "Mumbai",
        setting: "Both",
        dayRate: "₹60,000",
        permit: "needed",
      },
      {
        id: "2",
        name: "Shahdara rooftop",
        area: "Delhi",
        setting: "Exterior",
        dayRate: "₹12,000",
        permit: "held",
      },
      {
        id: "3",
        name: "Juhu beach stretch",
        area: "Mumbai",
        setting: "Exterior",
        permit: "notNeeded",
      },
    ],
  },
};
export const Detail: Story = {
  args: Default.args,
  render: () => (
    <LocationDetail
      location={{
        id: "1",
        name: "Bandra bungalow",
        area: "Mumbai",
        setting: "Both",
        dayRate: "₹60,000",
        permit: "needed",
        power: "3-phase, 40 kVA",
        parking: "4 vans in the lane",
        contact: "Mr. Fernandes",
        accessNotes: "Lift to the first floor; one step at the entrance. No shooting after 10 pm.",
        lat: 19.0596,
        lng: 72.8295,
      }}
    />
  ),
};
