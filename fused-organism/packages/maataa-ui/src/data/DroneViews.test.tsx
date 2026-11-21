import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DroneFlightLog, AltitudeDisplay, OperatorSelector } from "./DroneViews";

describe("DroneFlightLog", () => {
  it("flags height and zone in words", () => {
    render(
      <DroneFlightLog
        flights={[
          {
            id: "1",
            takeoff: new Date(2026, 10, 24, 7),
            landing: new Date(2026, 10, 24, 7, 20),
            pilot: "Ravi",
            aircraft: "Inspire 3",
            maxAltitudeM: 130,
            location: "Juhu",
            zone: "yellow",
            clearance: "granted",
          },
        ]}
      />
    );
    expect(screen.getByText("130 m (above 120 m limit)")).toBeInTheDocument();
    expect(screen.getByText("Yellow zone (permission needed)")).toBeInTheDocument();
    expect(screen.getByText(/Cleared/)).toBeInTheDocument();
  });
});

describe("AltitudeDisplay", () => {
  it("escalates near and over the limit", () => {
    const { rerender } = render(<AltitudeDisplay metres={60} />);
    expect(screen.getByRole("status")).toHaveTextContent("60 m, within limit");
    rerender(<AltitudeDisplay metres={115} />);
    expect(screen.getByRole("status")).toHaveTextContent("Close to the 120 m limit");
    rerender(<AltitudeDisplay metres={125} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Descend now");
  });
});

describe("OperatorSelector", () => {
  it("only allows certified pilots", () => {
    render(
      <OperatorSelector
        flightDate={new Date(2026, 10, 24)}
        value={undefined}
        onChange={() => {}}
        operators={[
          { id: "a", name: "Ravi", rpc: "RPC-123", rpcExpires: new Date(2027, 0, 1) },
          { id: "b", name: "Meera", rpc: "RPC-9", rpcExpires: new Date(2026, 9, 1) },
          { id: "c", name: "Dev" },
        ]}
      />
    );
    expect(screen.getByRole("radio", { name: /Ravi/ })).toBeEnabled();
    expect(screen.getByRole("radio", { name: /Meera.*expired/ })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /Dev.*No remote pilot certificate/ })).toBeDisabled();
  });
});
