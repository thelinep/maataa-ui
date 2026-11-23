import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonExplorer } from "./JsonExplorer";

const meta = { title: "Data/JsonExplorer", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <JsonExplorer
      label="Call sheet export"
      initialDepth={2}
      data={{
        production: "Monsoon Wedding",
        day: 4,
        date: "2026-12-03",
        crewCall: "05:30",
        scenes: [
          {
            number: "14C",
            setting: "INT. FLAT",
            time: "NIGHT",
            pages: 1.375,
            cast: ["Asha", "Arjun"],
          },
          { number: "15", setting: "EXT. ROOFTOP", time: "DUSK", pages: 0.5, cast: ["Asha"] },
        ],
        weather: { condition: "fog", tempC: 4, rainChance: 0.05 },
        published: true,
      }}
    />
  ),
};
