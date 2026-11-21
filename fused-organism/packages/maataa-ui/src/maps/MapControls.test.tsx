import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  MapLayerToggle,
  WeatherOverlayToggle,
  ZoomSlider,
  MapLegend,
  CompassRose,
  ScaleBar,
  niceScale,
  GeoSearchBox,
  LocationThumbnailCard,
} from "./MapControls";

describe("MapControls", () => {
  it("layer toggles and base map", async () => {
    function H() {
      const [v, setV] = useState<string[]>(["rain"]);
      const [base, setBase] = useState("streets");
      return (
        <>
          <MapLayerToggle
            layers={[{ id: "permits", label: "Permit zones" }]}
            value={[]}
            onChange={() => {}}
            baseLayers={[
              { id: "streets", label: "Streets" },
              { id: "sat", label: "Satellite" },
            ]}
            base={base}
            onBaseChange={setBase}
          />
          <WeatherOverlayToggle value={v} onChange={setV} />
        </>
      );
    }
    render(<H />);
    await userEvent.click(screen.getByRole("radio", { name: "Satellite" }));
    expect(screen.getByRole("radio", { name: "Satellite" })).toBeChecked();
    await userEvent.click(screen.getByRole("checkbox", { name: "Wind" }));
    expect(screen.getByRole("checkbox", { name: "Wind" })).toBeChecked();
    expect(screen.getByRole("group", { name: "Weather" })).toBeInTheDocument();
  });

  it("zoom names the scale", async () => {
    function H() {
      const [z, setZ] = useState(10);
      return <ZoomSlider value={z} onChange={setZ} />;
    }
    render(<H />);
    await userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByRole("slider", { name: "Zoom" })).toHaveAttribute(
      "aria-valuetext",
      "Zoom 11, city"
    );
  });

  it("legend, compass and scale", () => {
    const reset = vi.fn();
    render(
      <>
        <MapLegend
          entries={[
            { label: "Approved", color: "#2D6A3E" },
            { label: "Route", color: "#1E3A5F", shape: "line" },
          ]}
        />
        <CompassRose rotation={90} onReset={reset} />
        <ScaleBar pxPerKm={40} />
      </>
    );
    expect(screen.getByRole("region", { name: "Legend" })).toHaveTextContent("ApprovedRoute");
    expect(
      screen.getByRole("button", { name: /Reset to north. North points west on screen/ })
    ).toBeInTheDocument();
    expect(screen.getByText("2 km")).toBeInTheDocument();
    expect(niceScale(1000, 120).label).toBe("100 m");
  });

  it("geo search is a combobox", async () => {
    const user = userEvent.setup();
    const sel = vi.fn();
    const places = [
      { id: "1", name: "Chandni Chowk", context: "Old Delhi", lat: 28.6506, lng: 77.2303 },
      { id: "2", name: "Chanakyapuri", context: "New Delhi", lat: 28.5966, lng: 77.1851 },
    ];
    render(
      <GeoSearchBox
        search={(q) => places.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))}
        onSelect={sel}
      />
    );
    const box = screen.getByRole("combobox", { name: "Search places" });
    await user.type(box, "chan");
    expect(screen.getByRole("status")).toHaveTextContent("2 places found");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(sel).toHaveBeenCalledWith(places[1]);
  });

  it("location card offers show on map", async () => {
    const show = vi.fn();
    render(
      <LocationThumbnailCard
        name="Haveli courtyard"
        lat={28.65}
        lng={77.23}
        facts={["2.4 km from base"]}
        status="Approved"
        onShowOnMap={show}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Show Haveli courtyard on map" }));
    expect(show).toHaveBeenCalled();
  });
});
