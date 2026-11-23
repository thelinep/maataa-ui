import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  MapLayerToggle,
  WeatherOverlayToggle,
  ZoomSlider,
  MapLegend,
  CompassRose,
  ScaleBar,
  GeoSearchBox,
  LocationThumbnailCard,
} from "./MapControls";

const meta = { title: "Maps/MapControls", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const places = [
  { id: "1", name: "Chandni Chowk", context: "Old Delhi", lat: 28.6506, lng: 77.2303 },
  { id: "2", name: "Chanakyapuri", context: "New Delhi", lat: 28.5966, lng: 77.1851 },
  { id: "3", name: "Chattarpur", context: "South Delhi", lat: 28.5, lng: 77.18 },
];

function Demo() {
  const [layers, setLayers] = useState(["permits", "routes"]);
  const [base, setBase] = useState("streets");
  const [wx, setWx] = useState(["rain"]);
  const [z, setZ] = useState(12);
  const [rot, setRot] = useState(30);
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
      <MapLayerToggle
        layers={[
          { id: "permits", label: "Permit zones", color: "#2D6A3E" },
          { id: "routes", label: "Unit routes", color: "#1E3A5F" },
          { id: "parking", label: "Parking", color: "#806641" },
        ]}
        value={layers}
        onChange={setLayers}
        baseLayers={[
          { id: "streets", label: "Streets" },
          { id: "sat", label: "Satellite" },
          { id: "terrain", label: "Terrain" },
        ]}
        base={base}
        onBaseChange={setBase}
      />
      <WeatherOverlayToggle value={wx} onChange={setWx} />
      <ZoomSlider value={z} onChange={setZ} />
      <div style={{ display: "grid", gap: 10 }}>
        <CompassRose rotation={rot} onReset={() => setRot(0)} />
        <ScaleBar pxPerKm={42} />
        <MapLegend
          entries={[
            { label: "Approved location", color: "#2D6A3E" },
            { label: "Pending", color: "#7A6100" },
            { label: "Unit route", color: "#1E3A5F", shape: "line" },
            { label: "Permit zone", color: "#2D6A3E", shape: "area" },
          ]}
        />
      </div>
      <div style={{ display: "grid", gap: 10, width: 320 }}>
        <GeoSearchBox
          search={(q) => places.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))}
          onSelect={() => {}}
        />
        <LocationThumbnailCard
          name="Haveli courtyard"
          lat={28.6501}
          lng={77.2311}
          facts={["2.4 km from base", "Generator allowed"]}
          status="Approved"
          onShowOnMap={() => {}}
        />
      </div>
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
