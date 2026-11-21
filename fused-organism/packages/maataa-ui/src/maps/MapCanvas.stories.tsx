import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  MapCanvas,
  OrbPin,
  ClusteredMarkers,
  RoutePolyline,
  AreaPolygon,
  RadiusCircle,
  AreaLabel,
  Graticule,
  QuadtreeGrid,
  CameraAngleAnnotation,
  WindLayer,
  CloudLayer,
  SatelliteOrbitPath,
  TrackerLayer,
  MapFeatureList,
  MapPopup,
  boundsAround,
  type MapPoint,
} from "./MapCanvas";
import { WORLD_BOUNDS } from "./mapUtils";

const meta = { title: "Maps/MapCanvas", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const centre = { lat: 28.6507, lng: 77.2334 };
const b = boundsAround(centre, 0.045);
const spots: MapPoint[] = [
  { id: "jm", label: "Jama Masjid", nativeLabel: "जामा मस्जिद", lat: 28.6507, lng: 77.2334 },
  {
    id: "rf",
    label: "Red Fort",
    nativeLabel: "लाल क़िला",
    lat: 28.6562,
    lng: 77.241,
    color: "#8B3A2B",
  },
];
const crowd: MapPoint[] = Array.from({ length: 14 }, (_, i) => ({
  id: `c${i}`,
  label: `Stall ${i}`,
  lat: 28.639 + (i % 4) * 0.0012,
  lng: 77.215 + Math.floor(i / 4) * 0.0013,
}));

function LocationsDemo() {
  const [sel, setSel] = useState<string | null>("jm");
  const p = spots.find((s) => s.id === sel);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <MapCanvas
        bounds={b}
        summary="Old Delhi recce: Jama Masjid and Red Fort, a permit zone, the unit route from base and a 1 km noise radius."
        overlays={
          p && (
            <MapPopup at={p} title={p.label} onClose={() => setSel(null)}>
              Permit approved · 06:00–10:00
            </MapPopup>
          )
        }
      >
        <Graticule step={0.01} />
        <AreaLabel at={{ lat: 28.672, lng: 77.215 }} text="Chandni Chowk" />
        <AreaPolygon
          ring={[
            { lat: 28.661, lng: 77.226 },
            { lat: 28.661, lng: 77.248 },
            { lat: 28.648, lng: 77.248 },
            { lat: 28.645, lng: 77.23 },
          ]}
          label="Permit zone"
        />
        <RadiusCircle center={centre} radiusKm={1} label="1 km noise radius" />
        <RoutePolyline
          path={[
            { lat: 28.628, lng: 77.205 },
            { lat: 28.638, lng: 77.215 },
            { lat: 28.645, lng: 77.228 },
            centre,
          ]}
        />
        <ClusteredMarkers points={crowd} />
        <CameraAngleAnnotation
          at={{ lat: 28.6535, lng: 77.236 }}
          bearing={210}
          fov={45}
          reachKm={0.35}
          label="Cam A"
        />
        {spots.map((s) => (
          <OrbPin key={s.id} point={s} lang="hi" />
        ))}
      </MapCanvas>
      <MapFeatureList
        label="Locations"
        items={spots.map((s) => ({ id: s.id, name: s.label, detail: "Permit approved" }))}
        onSelect={setSel}
        selectedId={sel ?? undefined}
      />
    </div>
  );
}
export const Locations: Story = { render: () => <LocationsDemo /> };

export const Weather: Story = {
  render: () => (
    <MapCanvas
      bounds={boundsAround({ lat: 31.1, lng: 77.17 }, 1)}
      summary="Shimla: wind from the west at 10–30 km/h and cloud building to the north-east."
      background="#E6EFE6"
    >
      <CloudLayer
        cells={[
          { lat: 31.4, lng: 77.6, cover: 0.8, radiusKm: 18 },
          { lat: 31.2, lng: 77.4, cover: 0.4, radiusKm: 12 },
        ]}
      />
      <WindLayer
        samples={Array.from({ length: 20 }, (_, i) => ({
          lat: 30.7 + (i % 4) * 0.25,
          lng: 76.5 + Math.floor(i / 4) * 0.3,
          fromDeg: 260 + (i % 3) * 10,
          speedKmh: 10 + (i % 5) * 5,
        }))}
      />
      <OrbPin
        point={{ id: "s", label: "Shimla", nativeLabel: "शिमला", lat: 31.1048, lng: 77.1734 }}
        lang="hi"
      />
    </MapCanvas>
  ),
};

export const Tracking: Story = {
  render: () => (
    <MapCanvas
      bounds={WORLD_BOUNDS}
      summary="ISS ground track and two tracked flights between Delhi and Dubai."
      width={720}
      height={360}
      background="#E9EEF3"
    >
      <Graticule step={30} />
      <SatelliteOrbitPath
        inclination={51.6}
        nodeLng={-40}
        orbits={2}
        position={{ lat: 20, lng: 60 }}
        label="ISS"
      />
      <TrackerLayer
        vehicles={[
          {
            id: "a",
            label: "AI 995",
            kind: "plane",
            headingDeg: 250,
            lat: 26,
            lng: 66,
            trail: [
              { lat: 28.5, lng: 77.1 },
              { lat: 27, lng: 70 },
              { lat: 26, lng: 66 },
            ],
          },
          { id: "b", label: "MV Sagar", kind: "ship", headingDeg: 200, lat: 15, lng: 68 },
        ]}
      />
    </MapCanvas>
  ),
};

export const Tiles: Story = {
  render: () => (
    <MapCanvas
      bounds={b}
      summary="Data tiles: detail increases towards Jama Masjid."
      width={480}
      height={300}
    >
      <QuadtreeGrid focus={centre} maxDepth={5} />
      <OrbPin point={spots[0]!} glow={false} />
    </MapCanvas>
  ),
};
