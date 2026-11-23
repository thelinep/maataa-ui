import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerritoryMatrix, WindowEditor } from "./DistributionEditors";

const meta = {
  title: "Forms/TerritoryMatrix",
  component: TerritoryMatrix,
  tags: ["autodocs"],
} satisfies Meta<typeof TerritoryMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    territories: ["India", "UAE", "UK", "USA"],
    rights: ["Theatrical", "SVOD", "TV", "Airline"],
    value: {
      India: { Theatrical: "sold", SVOD: "sold" },
      UAE: { SVOD: "negotiating" },
      USA: { TV: "excluded" },
    },
    buyers: { India: { Theatrical: "PVR Inox", SVOD: "Netflix" } },
    onChange: () => {},
  },
};
export const Windows: Story = {
  args: Default.args,
  render: () => (
    <WindowEditor
      territories={["India", "UAE"]}
      onChange={() => {}}
      windows={[
        {
          id: "a",
          platform: "Theatrical",
          territory: "India",
          start: "2027-01-10",
          end: "2027-03-10",
          exclusive: true,
        },
        {
          id: "b",
          platform: "Netflix",
          territory: "India",
          start: "2027-03-01",
          end: "",
          exclusive: true,
        },
        {
          id: "c",
          platform: "OSN+",
          territory: "UAE",
          start: "2027-04-01",
          end: "",
          exclusive: false,
        },
      ]}
    />
  ),
};
