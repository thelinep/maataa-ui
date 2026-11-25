import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseDxf } from "./dxf";
import { LocationSite } from "./LocationSite";
import { STUDIO_PLAN_DXF } from "./studioPlan.fixture";

const origin = { lat: 19.1623, lng: 72.8465 };
const east24 = {
  lat: 19.1623,
  lng: 72.8465 + 24 / (111_195 * Math.cos((19.1623 * Math.PI) / 180)),
};

describe("LocationSite", () => {
  it("puts the pin, the plan's corners, zones, measurements and permits together", () => {
    render(
      <LocationSite
        name="Studio 4"
        address="Goregaon West, Mumbai"
        position={{ lat: 19.16237, lng: 72.84662 }}
        points={[{ id: "base", label: "Unit base", lat: 19.1631, lng: 72.8471 }]}
        drawing={parseDxf(STUDIO_PLAN_DXF)}
        controlPoints={[
          { plan: { x: 0, y: 0 }, geo: origin },
          { plan: { x: 24, y: 0 }, geo: east24 },
        ]}
        zones={[
          {
            id: "a",
            label: "Stage A",
            outline: [
              { x: 1, y: 1 },
              { x: 15, y: 1 },
              { x: 15, y: 13 },
              { x: 1, y: 13 },
            ],
            status: "reserved",
          },
        ]}
        measurements={[{ label: "Ceiling height", value: "9 m" }]}
        permits={[{ id: "p", title: "Shoot permit", authority: "BMC", status: "approved" }]}
      />
    );
    expect(screen.getByRole("heading", { name: "Studio 4" })).toBeInTheDocument();
    expect(screen.getByText(/Goregaon West, Mumbai · 19.16237, 72.84662/)).toBeInTheDocument();
    expect(screen.getByLabelText("Plan corner, north-east")).toBeInTheDocument();
    expect(screen.getByLabelText("Unit base")).toBeInTheDocument();
    expect(
      screen.getByText(/1 drawing unit = 1 m on the ground; plan up faces 0° from north/)
    ).toBeInTheDocument();
    expect(screen.getByText("Stage A: reserved")).toBeInTheDocument();
    expect(screen.getByText("Ceiling height")).toBeInTheDocument();
    expect(screen.getByText("Shoot permit")).toBeInTheDocument();
  });
});
