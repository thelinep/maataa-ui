import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MapCanvas,
  OrbPin,
  ClusteredMarkers,
  clusterPoints,
  RoutePolyline,
  pathLengthKm,
  RadiusCircle,
  Graticule,
  QuadtreeGrid,
  CameraAngleAnnotation,
  WindLayer,
  CloudLayer,
  SatelliteOrbitPath,
  orbitGroundTrack,
  TrackerLayer,
  AreaPolygon,
  AreaLabel,
  MapFeatureList,
  MapPopup,
  boundsAround,
} from "./MapCanvas";

const b = boundsAround({ lat: 28.65, lng: 77.23 }, 0.2);

describe("MapCanvas", () => {
  it("is one named image with hidden layers, plus a text list", async () => {
    const pick = vi.fn();
    render(
      <>
        <MapCanvas
          bounds={b}
          summary="3 shoot locations in Old Delhi"
          overlays={<MapPopup at={{ lat: 28.65, lng: 77.23 }} title="Jama Masjid" onClose={pick} />}
        >
          <Graticule step={0.05} />
          <QuadtreeGrid focus={{ lat: 28.65, lng: 77.23 }} />
          <AreaPolygon
            ring={[
              { lat: 28.66, lng: 77.22 },
              { lat: 28.66, lng: 77.24 },
              { lat: 28.64, lng: 77.24 },
            ]}
            label="Permit zone"
            hatch
          />
          <AreaLabel at={{ lat: 28.7, lng: 77.2 }} text="Civil Lines" />
          <RoutePolyline
            path={[
              { lat: 28.6, lng: 77.2 },
              { lat: 28.65, lng: 77.23 },
            ]}
          />
          <RadiusCircle center={{ lat: 28.65, lng: 77.23 }} radiusKm={2} />
          <CameraAngleAnnotation at={{ lat: 28.65, lng: 77.23 }} bearing={90} label="Cam A" />
          <WindLayer samples={[{ lat: 28.62, lng: 77.2, fromDeg: 270, speedKmh: 18 }]} />
          <CloudLayer cells={[{ lat: 28.7, lng: 77.3, cover: 0.6, radiusKm: 3 }]} />
          <OrbPin
            point={{
              id: "j",
              label: "Jama Masjid",
              nativeLabel: "जामा मस्जिद",
              lat: 28.6507,
              lng: 77.2334,
            }}
            lang="hi"
          />
          <ClusteredMarkers
            points={[
              { id: "a", label: "A", lat: 28.651, lng: 77.231 },
              { id: "b", label: "B", lat: 28.6511, lng: 77.2311 },
            ]}
          />
          <TrackerLayer
            vehicles={[
              { id: "d", label: "Drone 1", kind: "drone", headingDeg: 45, lat: 28.64, lng: 77.22 },
            ]}
          />
          <SatelliteOrbitPath inclination={51.6} nodeLng={20} />
        </MapCanvas>
        <MapFeatureList
          label="Locations"
          items={[{ id: "j", name: "Jama Masjid", detail: "Permit approved" }]}
          onSelect={pick}
        />
      </>
    );
    expect(screen.getByRole("img", { name: "3 shoot locations in Old Delhi" })).toBeInTheDocument();
    expect(screen.getByText("जामा मस्जिद")).toHaveAttribute("lang", "hi");
    expect(screen.getByRole("dialog", { name: "Jama Masjid" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(pick).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Jama Masjid — Permit approved" }));
    expect(pick).toHaveBeenLastCalledWith("j");
  });

  it("helpers", () => {
    const proj = (p: { lat: number; lng: number }) => ({ x: p.lng * 100, y: p.lat * 100 });
    expect(
      clusterPoints(
        [
          { id: "a", label: "a", lat: 0, lng: 0 },
          { id: "b", label: "b", lat: 0.01, lng: 0.01 },
          { id: "c", label: "c", lat: 5, lng: 5 },
        ],
        proj
      )
    ).toHaveLength(2);
    expect(
      Math.round(
        pathLengthKm([
          { lat: 0, lng: 0 },
          { lat: 0, lng: 1 },
        ])
      )
    ).toBe(111);
    const segs = orbitGroundTrack(51.6, 0, 1);
    const lats = segs.flat().map((p) => p.lat);
    expect(Math.max(...lats)).toBeCloseTo(51.6, 0);
  });
});
