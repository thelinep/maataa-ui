import { describe, expect, it } from "vitest";
import { metresPerUnit, parseDxf } from "./dxf";
import { STUDIO_PLAN_DXF } from "./studioPlan.fixture";

describe("parseDxf", () => {
  const d = parseDxf(STUDIO_PLAN_DXF);

  it("reads units, layers with colors, and the extent", () => {
    expect(d.units).toBe("m");
    expect(metresPerUnit(d.units)).toBe(1);
    expect(d.layers.map((l) => l.name)).toEqual([
      "DOORS",
      "FURNITURE",
      "LABELS",
      "RIGGING",
      "WALLS",
    ]);
    expect(d.layers.find((l) => l.name === "RIGGING")?.color).toBe("#E03C31");
    expect(d.bounds).toMatchObject({ minX: 0, minY: 0, maxX: 24, maxY: 14 });
  });

  it("expands blocks with position, rotation and scale", () => {
    const doors = d.entities.filter((e) => e.layer === "DOORS");
    expect(doors).toHaveLength(4);
    const rotated = doors[0];
    expect(rotated).toMatchObject({ type: "line", a: { x: 16, y: 9 } });
    if (rotated?.type === "line") expect(rotated.b.y).toBeCloseTo(9.9);
    expect(doors[3]).toMatchObject({ type: "arc", radius: 1.35 });
  });

  it("turns bulges into curve points and cleans MTEXT", () => {
    const counter = d.entities.find((e) => e.type === "polyline" && e.layer === "FURNITURE");
    expect(counter?.type === "polyline" && counter.points.length).toBeGreaterThan(4);
    expect(d.entities.some((e) => e.type === "text" && e.text === "Stage A")).toBe(true);
  });

  it("counts what it doesn't draw", () => {
    expect(d.skipped).toEqual({ HATCH: 1 });
  });

  it("explains DWG and non-DXF input", () => {
    expect(() => parseDxf("AC1032 binary…")).toThrow(/DWG/);
    expect(() => parseDxf("hello")).toThrow(/doesn't look like a DXF/);
  });
});
