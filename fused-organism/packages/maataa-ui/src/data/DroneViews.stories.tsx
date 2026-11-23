import type { Meta, StoryObj } from "@storybook/react-vite";
import { DroneFlightLog, AltitudeDisplay, OperatorSelector } from "./DroneViews";

const meta = {
  title: "Data/DroneFlightLog",
  component: DroneFlightLog,
  tags: ["autodocs"],
} satisfies Meta<typeof DroneFlightLog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    flights: [
      {
        id: "1",
        takeoff: new Date(2026, 10, 24, 6, 40),
        landing: new Date(2026, 10, 24, 6, 58),
        pilot: "Ravi Menon",
        aircraft: "DJI Inspire 3 · UA-0042",
        maxAltitudeM: 95,
        location: "Juhu beach",
        zone: "green",
        clearance: "granted",
      },
      {
        id: "2",
        takeoff: new Date(2026, 10, 24, 17, 30),
        landing: new Date(2026, 10, 24, 17, 44),
        pilot: "Ravi Menon",
        aircraft: "DJI Inspire 3 · UA-0042",
        maxAltitudeM: 128,
        location: "Bandra Reclamation",
        zone: "yellow",
        clearance: "conditional",
      },
    ],
  },
};
export const Altitude: Story = {
  args: Default.args,
  render: () => <AltitudeDisplay metres={114} />,
};
export const Operator: Story = {
  args: Default.args,
  render: () => (
    <OperatorSelector
      flightDate={new Date(2026, 10, 24)}
      value="a"
      onChange={() => {}}
      operators={[
        { id: "a", name: "Ravi Menon", rpc: "RPC-1182", rpcExpires: new Date(2027, 5, 1) },
        { id: "b", name: "Meera Iyer", rpc: "RPC-0991", rpcExpires: new Date(2026, 9, 1) },
        { id: "c", name: "Dev Lohan" },
      ]}
    />
  ),
};
