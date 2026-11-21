/**
 * @maataa/ui/maps/MapCanvas
 * A small, dependency-free map surface (equirectangular) with composable
 * layers. The SVG is a visual aid: MapCanvas is named by a summary, and
 * MapFeatureList gives the same features as a list.
 */

import React, { createContext, useContext, useMemo } from "react";
import { colorTokens, typographyTokens } from "../tokens";
import { type GeoBounds, projectLatLng } from "./mapUtils";
import { haversineKm } from "./skyMath";

export interface LatLng {
  lat: number;
  lng: number;
}

interface MapCtx {
  bounds: GeoBounds;
  width: number;
  height: number;
  project: (p: LatLng) => { x: number; y: number };
  /** Pixels per km at the map centre (horizontal) */
  pxPerKm: number;
}

const Ctx = createContext<MapCtx | null>(null);

export function useMap(): MapCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("Map layers must be inside <MapCanvas>");
  return c;
}

export interface MapCanvasProps {
  bounds: GeoBounds;
  /** One sentence describing what the map shows */
  summary: string;
  width?: number;
  height?: number;
  /** SVG layers */
  children?: React.ReactNode;
  /** HTML overlays (popups, controls) positioned over the map */
  overlays?: React.ReactNode;
  background?: string;
  style?: React.CSSProperties;
}

/** Bounds around a centre with a span in degrees */
export function boundsAround(c: LatLng, latSpan: number, lngSpan = latSpan * 1.6): GeoBounds {
  return {
    minLat: c.lat - latSpan / 2,
    maxLat: c.lat + latSpan / 2,
    minLng: c.lng - lngSpan / 2,
    maxLng: c.lng + lngSpan / 2,
  };
}

/**
 * MapCanvas
 * Provides projection to its layers. role=img named by `summary`; layers are
 * aria-hidden. Put interactive controls in `overlays`, not inside the SVG.
 */
export function MapCanvas({
  bounds,
  summary,
  width = 640,
  height = 400,
  children,
  overlays,
  background = "#E8EEF0",
  style,
}: MapCanvasProps) {
  const ctx = useMemo<MapCtx>(() => {
    const midLat = (bounds.minLat + bounds.maxLat) / 2;
    const km =
      haversineKm({ lat: midLat, lng: bounds.minLng }, { lat: midLat, lng: bounds.maxLng }) || 1;
    return {
      bounds,
      width,
      height,
      project: (p) => projectLatLng(p.lat, p.lng, bounds, width, height),
      pxPerKm: width / km,
    };
  }, [bounds, width, height]);
  return (
    <Ctx.Provider value={ctx}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          aspectRatio: `${width} / ${height}`,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${colorTokens.border.primary}`,
          ...style,
        }}
      >
        <svg
          role="img"
          aria-label={summary}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          style={{ display: "block", background }}
        >
          <g aria-hidden="true">{children}</g>
        </svg>
        {overlays}
      </div>
    </Ctx.Provider>
  );
}

/** Convert projected SVG coords to % for HTML overlays */
export function usePercent() {
  const { project, width, height } = useMap();
  return (p: LatLng) => {
    const { x, y } = project(p);
    return { left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%` };
  };
}

/* ───────────────────────── Points ───────────────────────── */

export interface MapPoint extends LatLng {
  id: string;
  label: string;
  /** Native-script label shown under the English one, e.g. "दिल्ली" */
  nativeLabel?: string;
  color?: string;
}

/**
 * OrbPin
 * Glowing orb marker with an optional native-script label (rendered with
 * lang so it is pronounced correctly where it is read out).
 */
export function OrbPin({
  point,
  lang,
  size = 10,
  glow = true,
}: {
  point: MapPoint;
  lang?: string;
  size?: number;
  glow?: boolean;
}) {
  const { project } = useMap();
  const { x, y } = project(point);
  const c = point.color ?? colorTokens.interactive.primary;
  const id = `orb-${point.id}`;
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={c} stopOpacity={0.55} />
          <stop offset="100%" stopColor={c} stopOpacity={0} />
        </radialGradient>
      </defs>
      {glow && <circle cx={x} cy={y} r={size * 2.6} fill={`url(#${id})`} />}
      <circle cx={x} cy={y} r={size} fill={c} stroke="#FFFFFF" strokeWidth={2.5} />
      <circle cx={x - size * 0.3} cy={y - size * 0.3} r={size * 0.3} fill="#FFFFFF" opacity={0.6} />
      <text
        x={x}
        y={y + size + 14}
        textAnchor="middle"
        style={{
          fontSize: 12,
          fontWeight: 700,
          fill: colorTokens.text.primary,
          paintOrder: "stroke",
          stroke: "#FFFFFF",
          strokeWidth: 3,
        }}
      >
        {point.label}
      </text>
      {point.nativeLabel && (
        <text
          lang={lang}
          x={x}
          y={y + size + 28}
          textAnchor="middle"
          style={{
            fontSize: 12,
            fill: colorTokens.text.secondary,
            paintOrder: "stroke",
            stroke: "#FFFFFF",
            strokeWidth: 3,
          }}
        >
          {point.nativeLabel}
        </text>
      )}
    </g>
  );
}

export interface Cluster {
  lat: number;
  lng: number;
  points: MapPoint[];
}

/** Grid-based clustering in projected pixels */
export function clusterPoints(
  points: MapPoint[],
  project: (p: LatLng) => { x: number; y: number },
  cellPx = 48
): Cluster[] {
  const cells = new Map<string, MapPoint[]>();
  for (const p of points) {
    const { x, y } = project(p);
    const k = `${Math.floor(x / cellPx)}:${Math.floor(y / cellPx)}`;
    cells.set(k, [...(cells.get(k) ?? []), p]);
  }
  return [...cells.values()].map((ps) => ({
    lat: ps.reduce((s, p) => s + p.lat, 0) / ps.length,
    lng: ps.reduce((s, p) => s + p.lng, 0) / ps.length,
    points: ps,
  }));
}

/** Clustered markers: a count bubble where points crowd together. */
export function ClusteredMarkers({ points, cellPx = 48 }: { points: MapPoint[]; cellPx?: number }) {
  const { project } = useMap();
  const clusters = clusterPoints(points, project, cellPx);
  return (
    <g>
      {clusters.map((c, i) => {
        const { x, y } = project(c);
        if (c.points.length === 1) {
          const p = c.points[0]!;
          return (
            <circle
              key={p.id}
              cx={x}
              cy={y}
              r={6}
              fill={p.color ?? colorTokens.interactive.primary}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          );
        }
        const r = 12 + Math.min(14, Math.sqrt(c.points.length) * 3);
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={colorTokens.interactive.info}
              fillOpacity={0.9}
              stroke="#FFFFFF"
              strokeWidth={3}
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              style={{ fontSize: 12, fontWeight: 700, fill: "#FFFFFF" }}
            >
              {c.points.length}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ───────────────────────── Lines & areas ───────────────────────── */

export function RoutePolyline({
  path,
  color = colorTokens.interactive.info,
  dashed,
  width = 4,
}: {
  path: LatLng[];
  color?: string;
  dashed?: boolean;
  width?: number;
}) {
  const { project } = useMap();
  const d = path.map((p, i) => `${i ? "L" : "M"}${project(p).x} ${project(p).y}`).join(" ");
  const a = path[0];
  const b = path[path.length - 1];
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={width + 3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "8 6" : undefined}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {a && (
        <circle
          cx={project(a).x}
          cy={project(a).y}
          r={6}
          fill="#FFFFFF"
          stroke={color}
          strokeWidth={3}
        />
      )}
      {b && (
        <rect
          x={project(b).x - 6}
          y={project(b).y - 6}
          width={12}
          height={12}
          fill={color}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      )}
    </g>
  );
}

/** Route length along a path, km */
export function pathLengthKm(path: LatLng[]): number {
  let s = 0;
  for (let i = 1; i < path.length; i++) s += haversineKm(path[i - 1]!, path[i]!);
  return s;
}

export function AreaPolygon({
  ring,
  color = colorTokens.interactive.success,
  label,
  hatch,
}: {
  ring: LatLng[];
  color?: string;
  label?: string;
  hatch?: boolean;
}) {
  const { project } = useMap();
  const pts = ring.map((p) => project(p));
  const cx = pts.reduce((s, p) => s + p.x, 0) / (pts.length || 1);
  const cy = pts.reduce((s, p) => s + p.y, 0) / (pts.length || 1);
  const hid = `hatch-${Math.round(cx)}-${Math.round(cy)}`;
  return (
    <g>
      {hatch && (
        <defs>
          <pattern
            id={hid}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke={color} strokeWidth="3" />
          </pattern>
        </defs>
      )}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={hatch ? `url(#${hid})` : color}
        fillOpacity={hatch ? 0.6 : 0.22}
        stroke={color}
        strokeWidth={2.5}
      />
      {label && <AreaLabelText x={cx} y={cy} text={label} />}
    </g>
  );
}

export function RadiusCircle({
  center,
  radiusKm,
  color = colorTokens.interactive.primary,
  label,
}: {
  center: LatLng;
  radiusKm: number;
  color?: string;
  label?: string;
}) {
  const { project, pxPerKm } = useMap();
  const { x, y } = project(center);
  const r = radiusKm * pxPerKm;
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={color}
        fillOpacity={0.1}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <circle cx={x} cy={y} r={4} fill={color} />
      <line x1={x} y1={y} x2={x + r} y2={y} stroke={color} strokeWidth={1.5} />
      <text
        x={x + r / 2}
        y={y - 6}
        textAnchor="middle"
        style={{
          fontSize: 11,
          fontWeight: 700,
          fill: colorTokens.text.primary,
          paintOrder: "stroke",
          stroke: "#FFFFFF",
          strokeWidth: 3,
        }}
      >
        {label ?? `${radiusKm} km`}
      </text>
    </g>
  );
}

function AreaLabelText({
  x,
  y,
  text,
  size = 13,
}: {
  x: number;
  y: number;
  text: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      style={{
        fontSize: size,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        fill: colorTokens.text.secondary,
        paintOrder: "stroke",
        stroke: "#FFFFFF",
        strokeWidth: 4,
      }}
    >
      {text}
    </text>
  );
}

/** Region / neighbourhood label placed at a point */
export function AreaLabel({ at, text, size }: { at: LatLng; text: string; size?: number }) {
  const { project } = useMap();
  const { x, y } = project(at);
  return <AreaLabelText x={x} y={y} text={text} size={size} />;
}

/* ───────────────────────── Grids ───────────────────────── */

/** Latitude/longitude grid with degree labels */
export function Graticule({
  step = 1,
  color = "#B9C7CC",
  labels = true,
}: {
  step?: number;
  color?: string;
  labels?: boolean;
}) {
  const { bounds, project, width, height } = useMap();
  const lats: number[] = [];
  const lngs: number[] = [];
  for (let v = Math.ceil(bounds.minLat / step) * step; v <= bounds.maxLat; v += step)
    lats.push(+v.toFixed(6));
  for (let v = Math.ceil(bounds.minLng / step) * step; v <= bounds.maxLng; v += step)
    lngs.push(+v.toFixed(6));
  const fmt = (v: number, pos: string, neg: string) => `${Math.abs(v)}°${v >= 0 ? pos : neg}`;
  return (
    <g>
      {lats.map((v) => {
        const y = project({ lat: v, lng: bounds.minLng }).y;
        return (
          <g key={`a${v}`}>
            <line x1={0} x2={width} y1={y} y2={y} stroke={color} strokeWidth={1} />
            {labels && (
              <text x={4} y={y - 3} style={{ fontSize: 10, fill: colorTokens.text.secondary }}>
                {fmt(v, "N", "S")}
              </text>
            )}
          </g>
        );
      })}
      {lngs.map((v) => {
        const x = project({ lat: bounds.minLat, lng: v }).x;
        return (
          <g key={`o${v}`}>
            <line y1={0} y2={height} x1={x} x2={x} stroke={color} strokeWidth={1} />
            {labels && (
              <text
                x={x + 3}
                y={height - 4}
                style={{ fontSize: 10, fill: colorTokens.text.secondary }}
              >
                {fmt(v, "E", "W")}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * QuadtreeGrid
 * Level-of-detail tiles: cells near `focus` subdivide down to `maxDepth`.
 * Useful to show tile loading / data density.
 */
export function QuadtreeGrid({
  focus,
  maxDepth = 5,
  color = colorTokens.interactive.info,
}: {
  focus: LatLng;
  maxDepth?: number;
  color?: string;
}) {
  const { width, height, project } = useMap();
  const f = project(focus);
  const cells: { x: number; y: number; w: number; h: number; d: number }[] = [];
  const split = (x: number, y: number, w: number, h: number, d: number) => {
    const inside = f.x >= x && f.x < x + w && f.y >= y && f.y < y + h;
    if (d < maxDepth && inside) {
      split(x, y, w / 2, h / 2, d + 1);
      split(x + w / 2, y, w / 2, h / 2, d + 1);
      split(x, y + h / 2, w / 2, h / 2, d + 1);
      split(x + w / 2, y + h / 2, w / 2, h / 2, d + 1);
    } else cells.push({ x, y, w, h, d });
  };
  split(0, 0, width, height, 0);
  return (
    <g>
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          fill={color}
          fillOpacity={0.03 * c.d}
          stroke={color}
          strokeOpacity={0.5}
          strokeWidth={Math.max(0.5, 2 - c.d * 0.3)}
        />
      ))}
    </g>
  );
}

/* ───────────────────────── Camera annotation ───────────────────────── */

/**
 * CameraAngleAnnotation
 * A camera position with a field-of-view wedge pointing along `bearing`
 * (0 = north). Lens field of view in degrees; reach in km.
 */
export function CameraAngleAnnotation({
  at,
  bearing,
  fov = 50,
  reachKm = 0.3,
  label,
}: {
  at: LatLng;
  bearing: number;
  fov?: number;
  reachKm?: number;
  label?: string;
}) {
  const { project, pxPerKm } = useMap();
  const { x, y } = project(at);
  const r = Math.max(24, reachKm * pxPerKm);
  const a = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const p1 = {
    x: x + r * Math.cos(a(bearing - fov / 2)),
    y: y + r * Math.sin(a(bearing - fov / 2)),
  };
  const p2 = {
    x: x + r * Math.cos(a(bearing + fov / 2)),
    y: y + r * Math.sin(a(bearing + fov / 2)),
  };
  return (
    <g>
      <path
        d={`M${x} ${y} L${p1.x} ${p1.y} A${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`}
        fill="#F5D547"
        fillOpacity={0.35}
        stroke="#7A6100"
        strokeWidth={2}
      />
      <rect x={x - 9} y={y - 6} width={18} height={12} rx={2} fill={colorTokens.text.primary} />
      <circle cx={x + 4} cy={y} r={3} fill="#F5D547" />
      {label && (
        <text
          x={x}
          y={y + 22}
          textAnchor="middle"
          style={{
            fontSize: 11,
            fontWeight: 700,
            fill: colorTokens.text.primary,
            paintOrder: "stroke",
            stroke: "#FFFFFF",
            strokeWidth: 3,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ───────────────────────── Weather layers ───────────────────────── */

export interface WindSample extends LatLng {
  /** Direction the wind blows FROM, degrees */
  fromDeg: number;
  speedKmh: number;
}

/** Arrows point where the wind is going; length and weight grow with speed. */
export function WindLayer({ samples }: { samples: WindSample[] }) {
  const { project } = useMap();
  return (
    <g>
      {samples.map((s, i) => {
        const { x, y } = project(s);
        const to = ((s.fromDeg + 180 - 90) * Math.PI) / 180;
        const L = 10 + Math.min(30, s.speedKmh * 0.8);
        const x2 = x + L * Math.cos(to);
        const y2 = y + L * Math.sin(to);
        const h = 6;
        return (
          <g
            key={i}
            stroke={colorTokens.interactive.info}
            strokeWidth={1 + Math.min(3, s.speedKmh / 15)}
            strokeLinecap="round"
          >
            <line x1={x} y1={y} x2={x2} y2={y2} />
            <line
              x1={x2}
              y1={y2}
              x2={x2 - h * Math.cos(to - 0.5)}
              y2={y2 - h * Math.sin(to - 0.5)}
            />
            <line
              x1={x2}
              y1={y2}
              x2={x2 - h * Math.cos(to + 0.5)}
              y2={y2 - h * Math.sin(to + 0.5)}
            />
          </g>
        );
      })}
    </g>
  );
}

export interface CloudCell extends LatLng {
  /** 0–1 cover */
  cover: number;
  radiusKm: number;
}

export function CloudLayer({ cells }: { cells: CloudCell[] }) {
  const { project, pxPerKm } = useMap();
  return (
    <g>
      <defs>
        <filter id="maataa-cloud-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {cells.map((c, i) => {
        const { x, y } = project(c);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={Math.max(10, c.radiusKm * pxPerKm)}
            fill="#7D8A90"
            fillOpacity={0.15 + c.cover * 0.5}
            filter="url(#maataa-cloud-blur)"
          />
        );
      })}
    </g>
  );
}

/* ───────────────────────── Orbits & trackers ───────────────────────── */

/**
 * Ground track of a circular orbit (simple model): inclination in degrees,
 * ascending-node longitude, and the westward drift per orbit.
 */
export function orbitGroundTrack(
  inclinationDeg: number,
  nodeLng: number,
  orbits = 1,
  driftDegPerOrbit = -22.5,
  steps = 180
): LatLng[][] {
  const segs: LatLng[][] = [[]];
  const inc = (inclinationDeg * Math.PI) / 180;
  for (let k = 0; k <= steps * orbits; k++) {
    const u = (k / steps) * 2 * Math.PI;
    const lat = (Math.asin(Math.sin(inc) * Math.sin(u)) * 180) / Math.PI;
    let lng =
      nodeLng +
      (Math.atan2(Math.cos(inc) * Math.sin(u), Math.cos(u)) * 180) / Math.PI +
      (driftDegPerOrbit * k) / steps;
    lng = ((((lng + 180) % 360) + 360) % 360) - 180;
    const cur = segs[segs.length - 1]!;
    const prev = cur[cur.length - 1];
    if (prev && Math.abs(prev.lng - lng) > 180) segs.push([]);
    segs[segs.length - 1]!.push({ lat, lng });
  }
  return segs;
}

export function SatelliteOrbitPath({
  inclination,
  nodeLng,
  orbits = 2,
  position,
  color = "#5B4B8A",
  label,
}: {
  inclination: number;
  nodeLng: number;
  orbits?: number;
  position?: LatLng;
  color?: string;
  label?: string;
}) {
  const { project } = useMap();
  const segs = orbitGroundTrack(inclination, nodeLng, orbits);
  return (
    <g>
      {segs.map((s, i) => (
        <path
          key={i}
          d={s.map((p, j) => `${j ? "L" : "M"}${project(p).x} ${project(p).y}`).join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
      ))}
      {position && (
        <g>
          <rect
            x={project(position).x - 5}
            y={project(position).y - 5}
            width={10}
            height={10}
            fill={color}
            transform={`rotate(45 ${project(position).x} ${project(position).y})`}
          />
          {label && (
            <text
              x={project(position).x + 10}
              y={project(position).y - 8}
              style={{
                fontSize: 11,
                fontWeight: 700,
                fill: color,
                paintOrder: "stroke",
                stroke: "#FFFFFF",
                strokeWidth: 3,
              }}
            >
              {label}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

export interface TrackedVehicle extends LatLng {
  id: string;
  /** Call sign / vessel name */
  label: string;
  kind: "plane" | "ship" | "drone" | "vehicle";
  headingDeg: number;
  /** km/h */
  speed?: number;
  /** metres, for aircraft and drones */
  altitudeM?: number;
  trail?: LatLng[];
}

const GLYPH: Record<TrackedVehicle["kind"], string> = {
  plane:
    "M0 -9 L2 -2 L9 2 L9 4 L2 2 L1 7 L3 9 L3 10 L0 9 L-3 10 L-3 9 L-1 7 L-2 2 L-9 4 L-9 2 L-2 -2 Z",
  ship: "M0 -9 L4 -3 L4 8 L-4 8 L-4 -3 Z",
  drone:
    "M-7 -7 L7 7 M7 -7 L-7 7 M-9 -7 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M5 -7 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M-9 7 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M5 7 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0",
  vehicle: "M-4 -8 H4 V8 H-4 Z",
};

/** Flight / ship / drone tracker layer: heading-rotated glyphs with trails. */
export function TrackerLayer({ vehicles }: { vehicles: TrackedVehicle[] }) {
  const { project } = useMap();
  return (
    <g>
      {vehicles.map((v) => {
        const { x, y } = project(v);
        const col =
          v.kind === "ship"
            ? colorTokens.interactive.info
            : v.kind === "plane"
              ? colorTokens.interactive.primary
              : colorTokens.interactive.error;
        return (
          <g key={v.id}>
            {v.trail && v.trail.length > 1 && (
              <path
                d={v.trail
                  .map((p, i) => `${i ? "L" : "M"}${project(p).x} ${project(p).y}`)
                  .join(" ")}
                fill="none"
                stroke={col}
                strokeOpacity={0.5}
                strokeWidth={2}
                strokeDasharray="2 4"
              />
            )}
            <g transform={`translate(${x} ${y}) rotate(${v.headingDeg})`}>
              <path
                d={GLYPH[v.kind]}
                fill={v.kind === "drone" ? "none" : col}
                stroke={v.kind === "drone" ? col : "#FFFFFF"}
                strokeWidth={v.kind === "drone" ? 2 : 1.2}
              />
            </g>
            <text
              x={x + 12}
              y={y - 10}
              style={{
                fontSize: 11,
                fontWeight: 700,
                fill: colorTokens.text.primary,
                paintOrder: "stroke",
                stroke: "#FFFFFF",
                strokeWidth: 3,
              }}
            >
              {v.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ───────────────────────── Feature list (text alternative) ───────────────────────── */

export interface MapFeatureListProps {
  label: string;
  items: { id: string; name: string; detail?: React.ReactNode }[];
  /** Make items buttons (e.g. open the popup) */
  onSelect?: (id: string) => void;
  selectedId?: string;
}

/** The text alternative that every map in this kit should sit next to. */
export function MapFeatureList({ label, items, onSelect, selectedId }: MapFeatureListProps) {
  return (
    <section aria-label={label}>
      <h3 style={{ margin: "0 0 6px", fontSize: typographyTokens.fontSize.sm }}>{label}</h3>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {items.map((it) => {
          const body = (
            <>
              <strong>{it.name}</strong>
              {it.detail && (
                <>
                  {" "}
                  <span
                    style={{
                      color: colorTokens.text.secondary,
                      fontSize: typographyTokens.fontSize.sm,
                    }}
                  >
                    — {it.detail}
                  </span>
                </>
              )}
            </>
          );
          return (
            <li key={it.id}>
              {onSelect ? (
                <button
                  type="button"
                  aria-pressed={it.id === selectedId}
                  onClick={() => onSelect(it.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    minHeight: 36,
                    padding: "4px 8px",
                    border: 0,
                    borderRadius: 6,
                    background:
                      it.id === selectedId ? colorTokens.background.tertiary : "transparent",
                    font: "inherit",
                    color: colorTokens.text.primary,
                    cursor: "pointer",
                  }}
                >
                  {body}
                </button>
              ) : (
                <div style={{ padding: "4px 8px" }}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ───────────────────────── Popup ───────────────────────── */

export interface MapPopupProps {
  at: LatLng;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
}

/**
 * MapPopup
 * A callout anchored to a point (rendered in MapCanvas `overlays`). It is a
 * non-modal dialog named by its title; Escape and the Close button close it.
 */
export function MapPopup({ at, title, children, onClose }: MapPopupProps) {
  const pct = usePercent();
  const pos = pct(at);
  const id = React.useId();
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, [at.lat, at.lng]);
  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={id}
      tabIndex={-1}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        transform: "translate(-50%, calc(-100% - 14px))",
        minWidth: 180,
        maxWidth: 260,
        padding: "10px 12px",
        borderRadius: 10,
        background: colorTokens.background.primary,
        boxShadow: colorTokens.shadow.lg,
        border: `1px solid ${colorTokens.border.primary}`,
        outline: "none",
        zIndex: 5,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <strong id={id} style={{ flex: 1 }}>
          {title}
        </strong>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            border: 0,
            borderRadius: 6,
            background: "transparent",
            color: colorTokens.text.secondary,
            cursor: "pointer",
            font: "inherit",
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {children && (
        <div
          style={{
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
            marginTop: 4,
          }}
        >
          {children}
        </div>
      )}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: -7,
          width: 14,
          height: 14,
          background: colorTokens.background.primary,
          borderRight: `1px solid ${colorTokens.border.primary}`,
          borderBottom: `1px solid ${colorTokens.border.primary}`,
          transform: "translateX(-50%) rotate(45deg)",
        }}
      />
    </div>
  );
}
