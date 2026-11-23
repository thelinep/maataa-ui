import type { Meta, StoryObj } from "@storybook/react-vite";
import { SunPositionWidget, MoonPositionWidget, TerrainProfile, RocketLaunch } from "./SkyWidgets";

const meta = { title: "Maps/SkyWidgets", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sky: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <SunPositionWidget
        lat={28.6139}
        lng={77.209}
        date={new Date("2026-11-21T10:30:00Z")}
        timeZone="Asia/Kolkata"
        place="Delhi"
      />
      <MoonPositionWidget
        lat={28.6139}
        lng={77.209}
        date={new Date("2026-11-24T16:00:00Z")}
        place="Delhi"
      />
    </div>
  ),
};

export const Terrain: Story = {
  render: () => (
    <TerrainProfile
      title="Unit move: Shimla to Narkanda"
      samples={[
        { km: 0, m: 2205, label: "Shimla" },
        { km: 10, m: 2400 },
        { km: 16, m: 2510, label: "Kufri" },
        { km: 30, m: 2350 },
        { km: 45, m: 2500 },
        { km: 60, m: 2708, label: "Narkanda" },
      ]}
    />
  ),
};

export const Launch: Story = {
  render: () => (
    <RocketLaunch at={new Date(Date.now() + 3 * 3600 * 1000 + 125000)} mission="GSLV-F20 · NISAR" />
  ),
};
