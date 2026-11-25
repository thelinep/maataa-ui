/**
 * @maataa/ui/maps/georeference
 * Places a floor plan on the earth: from two or more points known both on the
 * plan and on the map, works out the plan's scale, its rotation from north and
 * its position, then converts between plan coordinates and latitude/longitude.
 *
 * The fit is a similarity transform (move, turn, scale; no shear), solved by
 * least squares in a local metric frame, which is accurate for sites up to a
 * few kilometres across.
 */

import type { DxfPoint } from "./dxf";
import type { LatLng } from "./MapCanvas";

export type { LatLng };

export interface ControlPoint {
  /** The point on the plan, in drawing units */
  plan: DxfPoint;
  /** The same point on the map */
  geo: LatLng;
}

export interface Georeference {
  /** Plan point → latitude and longitude */
  toLatLng(p: DxfPoint): LatLng;
  /** Latitude and longitude → plan point */
  toPlan(g: LatLng): DxfPoint;
  /** Metres on the ground for one drawing unit */
  metresPerUnit: number;
  /** Degrees clockwise from true north to the plan's +y axis */
  bearingOfPlanUp: number;
  /** Root-mean-square misfit of the control points, in metres (0 for two points) */
  rmsErrorMetres: number;
}

const EARTH_RADIUS = 6_371_008.8;
const RAD = Math.PI / 180;

/**
 * georeference
 * Needs at least two control points that are apart on the plan.
 *
 * @example
 * ```ts
 * const geo = georeference([
 *   { plan: { x: 0, y: 0 }, geo: { lat: 19.0544, lng: 72.8402 } },
 *   { plan: { x: 24, y: 0 }, geo: { lat: 19.0545, lng: 72.8424 } },
 * ]);
 * geo.toLatLng({ x: 12, y: 7 }); // the middle of the stage
 * ```
 */
export function georeference(points: ControlPoint[]): Georeference {
  if (points.length < 2) throw new Error("Georeferencing needs at least two control points.");
  const origin = points[0]!.geo;
  const cosLat = Math.cos(origin.lat * RAD);
  const toMetres = (g: LatLng) => ({
    x: (g.lng - origin.lng) * RAD * EARTH_RADIUS * cosLat,
    y: (g.lat - origin.lat) * RAD * EARTH_RADIUS,
  });
  const fromMetres = (m: DxfPoint): LatLng => ({
    lat: origin.lat + m.y / EARTH_RADIUS / RAD,
    lng: origin.lng + m.x / (EARTH_RADIUS * cosLat) / RAD,
  });

  // Least-squares similarity: world = a·plan + t, with a = s·e^{iθ} as a complex number.
  const P = points.map((p) => p.plan);
  const W = points.map((p) => toMetres(p.geo));
  const n = points.length;
  const pc = { x: P.reduce((s, p) => s + p.x, 0) / n, y: P.reduce((s, p) => s + p.y, 0) / n };
  const wc = { x: W.reduce((s, p) => s + p.x, 0) / n, y: W.reduce((s, p) => s + p.y, 0) / n };
  let num_re = 0;
  let num_im = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const px = P[i]!.x - pc.x;
    const py = P[i]!.y - pc.y;
    const wx = W[i]!.x - wc.x;
    const wy = W[i]!.y - wc.y;
    // Σ w · conj(p)
    num_re += wx * px + wy * py;
    num_im += wy * px - wx * py;
    den += px * px + py * py;
  }
  if (den === 0) throw new Error("The control points are all at the same place on the plan.");
  const a = { re: num_re / den, im: num_im / den };
  const apply = (p: DxfPoint): DxfPoint => {
    const x = p.x - pc.x;
    const y = p.y - pc.y;
    return { x: wc.x + a.re * x - a.im * y, y: wc.y + a.im * x + a.re * y };
  };
  const scale = Math.hypot(a.re, a.im);
  const invert = (m: DxfPoint): DxfPoint => {
    const x = m.x - wc.x;
    const y = m.y - wc.y;
    const d = a.re * a.re + a.im * a.im;
    return { x: pc.x + (a.re * x + a.im * y) / d, y: pc.y + (a.re * y - a.im * x) / d };
  };

  let sq = 0;
  for (let i = 0; i < n; i++) {
    const m = apply(P[i]!);
    sq += (m.x - W[i]!.x) ** 2 + (m.y - W[i]!.y) ** 2;
  }

  // Plan +y is the direction a·(0,1) = (−a.im, a.re) in east/north metres.
  const bearing = (Math.atan2(-a.im, a.re) / RAD + 360) % 360;

  return {
    toLatLng: (p) => fromMetres(apply(p)),
    toPlan: (g) => invert(toMetres(g)),
    metresPerUnit: scale,
    bearingOfPlanUp: bearing,
    rmsErrorMetres: Math.sqrt(sq / n),
  };
}

/** Ground distance between two points, in metres (haversine). */
export function distanceMetres(a: LatLng, b: LatLng): number {
  const dLat = (b.lat - a.lat) * RAD;
  const dLng = (b.lng - a.lng) * RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}
