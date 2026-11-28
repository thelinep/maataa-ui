import { describe, expect, it } from "vitest";
import { distanceMetres, georeference } from "./georeference";

describe("georeference", () => {
  // A plan whose x axis points due east and whose units are metres.
  const origin = { lat: 19.1623, lng: 72.8465 };
  const east24 = {
    lat: 19.1623,
    lng: 72.8465 + 24 / (111_195 * Math.cos((19.1623 * Math.PI) / 180)),
  };

  it("finds scale and heading from two points, and converts both ways", () => {
    const g = georeference([
      { plan: { x: 0, y: 0 }, geo: origin },
      { plan: { x: 24, y: 0 }, geo: east24 },
    ]);
    expect(g.metresPerUnit).toBeCloseTo(1, 2);
    expect(g.bearingOfPlanUp).toBeCloseTo(0, 0);
    const mid = g.toLatLng({ x: 12, y: 14 });
    expect(distanceMetres(origin, mid)).toBeCloseTo(Math.hypot(12, 14), 0);
    const back = g.toPlan(mid);
    expect(back.x).toBeCloseTo(12, 6);
    expect(back.y).toBeCloseTo(14, 6);
    expect(g.rmsErrorMetres).toBeLessThan(1e-6);
  });

  it("handles a plan drawn in millimetres and turned 90°", () => {
    // plan +x = north, so plan +y = west: plan up faces 270°.
    const north24 = { lat: origin.lat + 24 / 111_195, lng: origin.lng };
    const g = georeference([
      { plan: { x: 0, y: 0 }, geo: origin },
      { plan: { x: 24_000, y: 0 }, geo: north24 },
    ]);
    expect(g.metresPerUnit).toBeCloseTo(0.001, 5);
    expect(g.bearingOfPlanUp).toBeCloseTo(270, 0);
  });

  it("needs two separate points", () => {
    expect(() => georeference([{ plan: { x: 0, y: 0 }, geo: origin }])).toThrow();
    expect(() =>
      georeference([
        { plan: { x: 1, y: 1 }, geo: origin },
        { plan: { x: 1, y: 1 }, geo: east24 },
      ])
    ).toThrow();
  });
});
