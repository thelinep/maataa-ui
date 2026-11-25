import type { Meta, StoryObj } from "@storybook/react-vite";
import { parseDxf } from "./dxf";
import { LocationSite } from "./LocationSite";
import { STUDIO_PLAN_DXF } from "./studioPlan.fixture";

const origin = { lat: 19.1623, lng: 72.8465 };
const east24 = { lat: 19.1623, lng: 72.846728 };

const meta = {
  title: "Maps/LocationSite",
  component: LocationSite,
  tags: ["autodocs"],
  args: {
    name: "Studio 4, Film City",
    address: "Goregaon East, Mumbai",
    position: { lat: 19.16237, lng: 72.84662 },
    points: [
      { id: "base", label: "Unit base", lat: 19.1631, lng: 72.8476 },
      { id: "parking", label: "Parking", lat: 19.1617, lng: 72.8454 },
    ],
    drawing: parseDxf(STUDIO_PLAN_DXF),
    controlPoints: [
      { plan: { x: 0, y: 0 }, geo: origin },
      { plan: { x: 24, y: 0 }, geo: east24 },
    ],
    zones: [
      {
        id: "a",
        label: "Stage A",
        outline: [
          { x: 0.5, y: 0.5 },
          { x: 15.5, y: 0.5 },
          { x: 15.5, y: 13.5 },
          { x: 0.5, y: 13.5 },
        ],
        status: "reserved",
      },
      {
        id: "g",
        label: "Green room",
        outline: [
          { x: 16.5, y: 6.5 },
          { x: 23.5, y: 6.5 },
          { x: 23.5, y: 13.5 },
          { x: 16.5, y: 13.5 },
        ],
      },
    ],
    measurements: [
      { label: "Ceiling height", value: "9 m" },
      { label: "Power", value: "3-phase, 250 A" },
      { label: "Loading door", value: "4 × 4.5 m" },
    ],
    permits: [
      {
        id: "p1",
        title: "Shoot permit",
        authority: "Film City, MFSCDCL",
        status: "approved",
        reference: "FC/2026/1142",
      },
    ],
  },
} satisfies Meta<typeof LocationSite>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Map pin with the plan's corners placed by two control points, the CAD plan with zones, measurements and the permit. */
export const Default: Story = {};
