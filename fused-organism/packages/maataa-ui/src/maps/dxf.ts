/**
 * @maataa/ui/maps/dxf
 * Reads an ASCII DXF drawing (AutoCAD, LibreCAD, QCAD, FreeCAD, SketchUp
 * export) into plain shapes the plan viewer can draw.
 *
 * Supported: LINE, LWPOLYLINE (with arc bulges), POLYLINE/VERTEX, CIRCLE,
 * ARC, ELLIPSE (as a polyline), POINT, TEXT, MTEXT, and INSERT of blocks
 * (position, scale, rotation; nested blocks too). Layers, their colors and
 * the drawing units ($INSUNITS) are kept. Hatches, dimensions, splines and
 * 3D solids are skipped; `skipped` counts them by type.
 *
 * DWG is a closed binary format and is not read here: save or export the
 * drawing as DXF first.
 */

import { msg } from "../i18n/LocaleProvider";

export interface DxfPoint {
  x: number;
  y: number;
}

export type DxfEntity =
  | { type: "line"; layer: string; color?: string; a: DxfPoint; b: DxfPoint }
  | { type: "polyline"; layer: string; color?: string; points: DxfPoint[]; closed: boolean }
  | { type: "circle"; layer: string; color?: string; center: DxfPoint; radius: number }
  | {
      type: "arc";
      layer: string;
      color?: string;
      center: DxfPoint;
      radius: number;
      /** Degrees, counter-clockwise from +x */
      start: number;
      end: number;
    }
  | { type: "point"; layer: string; color?: string; at: DxfPoint }
  | {
      type: "text";
      layer: string;
      color?: string;
      at: DxfPoint;
      text: string;
      height: number;
      /** Degrees, counter-clockwise */
      rotation: number;
    };

export interface DxfLayer {
  name: string;
  color?: string;
  /** Off or frozen in the file */
  hidden: boolean;
}

export type DxfUnit = "unitless" | "in" | "ft" | "mm" | "cm" | "m" | "km" | "mi" | "yd";

export interface DxfDrawing {
  entities: DxfEntity[];
  layers: DxfLayer[];
  /** From $INSUNITS; "unitless" when the file doesn't say */
  units: DxfUnit;
  /** Extent of every entity, in drawing units */
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  /** Entity types that were in the file but aren't drawn, with counts */
  skipped: Record<string, number>;
}

/** Metres per drawing unit, or null when the drawing has no unit. */
export function metresPerUnit(units: DxfUnit): number | null {
  const m: Record<DxfUnit, number | null> = {
    unitless: null,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
  };
  return m[units];
}

const INSUNITS: Record<number, DxfUnit> = {
  1: "in",
  2: "ft",
  3: "mi",
  4: "mm",
  5: "cm",
  6: "m",
  7: "km",
  10: "yd",
};

/** The AutoCAD Color Index colors people actually use; others fall back to the layer or ink. */
const ACI: Record<number, string> = {
  1: "#E03C31",
  2: "#C9A400",
  3: "#2E9E44",
  4: "#1C9CA6",
  5: "#2F5FD0",
  6: "#B0359E",
  8: "#7A7A7A",
  9: "#A8A8A8",
};
const aciColor = (n: number | undefined) => (n === undefined ? undefined : ACI[Math.abs(n)]);

type Pair = [code: number, value: string];

function pairs(text: string): Pair[] {
  const lines = text.split(/\r\n|\r|\n/);
  const out: Pair[] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const code = Number.parseInt(lines[i]!.trim(), 10);
    if (Number.isNaN(code)) {
      i -= 1; // resync on a stray line
      continue;
    }
    out.push([code, lines[i + 1]!.replace(/\s+$/, "")]);
  }
  return out;
}

/** Splits a run of pairs into records, each starting at a code-0 pair. */
function records(list: Pair[]): Pair[][] {
  const out: Pair[][] = [];
  let cur: Pair[] | null = null;
  for (const p of list) {
    if (p[0] === 0) {
      cur = [p];
      out.push(cur);
    } else cur?.push(p);
  }
  return out;
}

const num = (rec: Pair[], code: number, fallback = 0) => {
  const p = rec.find((q) => q[0] === code);
  return p ? Number.parseFloat(p[1]) : fallback;
};
const str = (rec: Pair[], code: number, fallback = "") =>
  rec.find((q) => q[0] === code)?.[1] ?? fallback;
const has = (rec: Pair[], code: number) => rec.some((q) => q[0] === code);

/** Points along a bulged LWPOLYLINE segment (bulge = tan(angle/4)). */
function bulgePoints(a: DxfPoint, b: DxfPoint, bulge: number, steps = 12): DxfPoint[] {
  if (!bulge) return [];
  const theta = 4 * Math.atan(bulge);
  const chord = Math.hypot(b.x - a.x, b.y - a.y);
  if (chord === 0) return [];
  const r = chord / (2 * Math.sin(theta / 2));
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const d = Math.sqrt(Math.max(0, r * r - (chord / 2) ** 2)) * Math.sign(bulge) * Math.sign(r);
  const nx = -(b.y - a.y) / chord;
  const ny = (b.x - a.x) / chord;
  const c = { x: mid.x + nx * d, y: mid.y + ny * d };
  const a0 = Math.atan2(a.y - c.y, a.x - c.x);
  const out: DxfPoint[] = [];
  for (let i = 1; i < steps; i++) {
    const ang = a0 + (theta * i) / steps;
    out.push({ x: c.x + Math.abs(r) * Math.cos(ang), y: c.y + Math.abs(r) * Math.sin(ang) });
  }
  return out;
}

/** MTEXT keeps formatting codes inline; keep only the words. */
function cleanMText(s: string): string {
  return s
    .replace(/\\P/g, " ")
    .replace(/\\[ACcFfHhQqTtWw][^;]*;/g, "")
    .replace(/\\[LlOoKk]/g, "")
    .replace(/[{}]/g, "")
    .replace(/\\\\/g, "\\")
    .trim();
}

interface Transform {
  (p: DxfPoint): DxfPoint;
  scale: number;
  rotation: number;
}

const identity: Transform = Object.assign((p: DxfPoint) => p, { scale: 1, rotation: 0 });

function insertTransform(
  at: DxfPoint,
  sx: number,
  sy: number,
  rotDeg: number,
  base: DxfPoint,
  outer: Transform
): Transform {
  const r = (rotDeg * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  const f = (p: DxfPoint) => {
    const x = (p.x - base.x) * sx;
    const y = (p.y - base.y) * sy;
    return outer({ x: at.x + x * cos - y * sin, y: at.y + x * sin + y * cos });
  };
  return Object.assign(f, { scale: outer.scale * Math.abs(sx), rotation: outer.rotation + rotDeg });
}

/**
 * parseDxf
 * Reads ASCII DXF text. Throws a plain-language Error for DWG or binary DXF.
 *
 * @example
 * ```ts
 * const drawing = parseDxf(await file.text());
 * <CadPlanViewer drawing={drawing} />
 * ```
 */
export function parseDxf(text: string): DxfDrawing {
  if (text.startsWith("AC10") || /^AutoCAD Binary DXF/.test(text))
    throw new Error(
      msg("This is a DWG or binary DXF file. Save it as an ASCII DXF and open that.")
    );
  const all = pairs(text);
  if (!all.some((p) => p[0] === 0 && p[1] === "SECTION"))
    throw new Error(msg("This doesn't look like a DXF drawing."));

  // Sections by name.
  const sections = new Map<string, Pair[]>();
  for (let i = 0; i < all.length; i++) {
    if (all[i]![0] === 0 && all[i]![1] === "SECTION" && all[i + 1]?.[0] === 2) {
      const name = all[i + 1]![1];
      const start = i + 2;
      let end = start;
      while (end < all.length && !(all[end]![0] === 0 && all[end]![1] === "ENDSEC")) end++;
      sections.set(name, all.slice(start, end));
      i = end;
    }
  }

  // Units.
  let units: DxfUnit = "unitless";
  const header = sections.get("HEADER") ?? [];
  const u = header.findIndex((p) => p[0] === 9 && p[1] === "$INSUNITS");
  if (u >= 0 && header[u + 1])
    units = INSUNITS[Number.parseInt(header[u + 1]![1], 10)] ?? "unitless";

  // Layers.
  const layers = new Map<string, DxfLayer>();
  for (const rec of records(sections.get("TABLES") ?? [])) {
    if (rec[0]![1] !== "LAYER" || !has(rec, 2)) continue;
    const color = num(rec, 62, 7);
    const flags = num(rec, 70, 0);
    layers.set(str(rec, 2), {
      name: str(rec, 2),
      color: aciColor(color),
      hidden: color < 0 || (flags & 1) === 1,
    });
  }

  // Blocks: name → { base, records }.
  const blocks = new Map<string, { base: DxfPoint; recs: Pair[][] }>();
  {
    let current: { name: string; base: DxfPoint; recs: Pair[][] } | null = null;
    for (const rec of records(sections.get("BLOCKS") ?? [])) {
      const kind = rec[0]![1];
      if (kind === "BLOCK")
        current = { name: str(rec, 2), base: { x: num(rec, 10), y: num(rec, 20) }, recs: [] };
      else if (kind === "ENDBLK") {
        if (current) blocks.set(current.name, { base: current.base, recs: current.recs });
        current = null;
      } else current?.recs.push(rec);
    }
  }

  const entities: DxfEntity[] = [];
  const skipped: Record<string, number> = {};

  const walk = (recs: Pair[][], tf: Transform, depth: number, inheritLayer?: string) => {
    for (let i = 0; i < recs.length; i++) {
      const rec = recs[i]!;
      const kind = rec[0]![1];
      let layer = str(rec, 8, "0");
      if (layer === "0" && inheritLayer) layer = inheritLayer;
      const color = aciColor(has(rec, 62) ? num(rec, 62) : undefined);
      const base = { layer, ...(color ? { color } : {}) };
      const P = (xc: number, yc: number) => tf({ x: num(rec, xc), y: num(rec, yc) });
      if (!layers.has(layer)) layers.set(layer, { name: layer, hidden: false });

      switch (kind) {
        case "LINE":
          entities.push({ type: "line", ...base, a: P(10, 20), b: P(11, 21) });
          break;
        case "LWPOLYLINE": {
          const verts: { p: DxfPoint; bulge: number }[] = [];
          for (const [code, value] of rec) {
            if (code === 10) verts.push({ p: { x: Number.parseFloat(value), y: 0 }, bulge: 0 });
            else if (code === 20 && verts.length)
              verts[verts.length - 1]!.p.y = Number.parseFloat(value);
            else if (code === 42 && verts.length)
              verts[verts.length - 1]!.bulge = Number.parseFloat(value);
          }
          const closed = (num(rec, 70) & 1) === 1;
          const pts: DxfPoint[] = [];
          verts.forEach((v, k) => {
            pts.push(v.p);
            const next = verts[k + 1] ?? (closed ? verts[0] : undefined);
            if (next && v.bulge) pts.push(...bulgePoints(v.p, next.p, v.bulge));
          });
          entities.push({ type: "polyline", ...base, points: pts.map(tf), closed });
          break;
        }
        case "POLYLINE": {
          const closed = (num(rec, 70) & 1) === 1;
          const pts: DxfPoint[] = [];
          let j = i + 1;
          while (j < recs.length && recs[j]![0]![1] === "VERTEX") {
            pts.push(tf({ x: num(recs[j]!, 10), y: num(recs[j]!, 20) }));
            j++;
          }
          i = j; // skip VERTEX records and SEQEND
          entities.push({ type: "polyline", ...base, points: pts, closed });
          break;
        }
        case "CIRCLE":
          entities.push({
            type: "circle",
            ...base,
            center: P(10, 20),
            radius: num(rec, 40) * tf.scale,
          });
          break;
        case "ARC":
          entities.push({
            type: "arc",
            ...base,
            center: P(10, 20),
            radius: num(rec, 40) * tf.scale,
            start: num(rec, 50) + tf.rotation,
            end: num(rec, 51) + tf.rotation,
          });
          break;
        case "ELLIPSE": {
          const c = { x: num(rec, 10), y: num(rec, 20) };
          const major = { x: num(rec, 11), y: num(rec, 21) };
          const ratio = num(rec, 40, 1);
          const t0 = num(rec, 41, 0);
          let t1 = num(rec, 42, Math.PI * 2);
          if (t1 <= t0) t1 += Math.PI * 2;
          const pts: DxfPoint[] = [];
          for (let k = 0; k <= 48; k++) {
            const t = t0 + ((t1 - t0) * k) / 48;
            pts.push(
              tf({
                x: c.x + major.x * Math.cos(t) - major.y * ratio * Math.sin(t),
                y: c.y + major.y * Math.cos(t) + major.x * ratio * Math.sin(t),
              })
            );
          }
          entities.push({
            type: "polyline",
            ...base,
            points: pts,
            closed: Math.abs(t1 - t0 - Math.PI * 2) < 1e-6,
          });
          break;
        }
        case "POINT":
          entities.push({ type: "point", ...base, at: P(10, 20) });
          break;
        case "TEXT":
        case "MTEXT": {
          let words =
            kind === "MTEXT"
              ? rec
                  .filter((p) => p[0] === 3 || p[0] === 1)
                  .map((p) => p[1])
                  .join("")
              : str(rec, 1);
          if (kind === "MTEXT") words = cleanMText(words);
          if (!words) break;
          entities.push({
            type: "text",
            ...base,
            at: P(10, 20),
            text: words,
            height: num(rec, 40, 1) * tf.scale,
            rotation: num(rec, 50) + tf.rotation,
          });
          break;
        }
        case "INSERT": {
          const block = blocks.get(str(rec, 2));
          if (!block || depth > 8) break;
          walk(
            block.recs,
            insertTransform(
              { x: num(rec, 10), y: num(rec, 20) },
              num(rec, 41, 1),
              num(rec, 42, 1),
              num(rec, 50),
              block.base,
              tf
            ),
            depth + 1,
            layer
          );
          break;
        }
        case "SEQEND":
        case "VERTEX":
        case "ATTRIB":
        case "ATTDEF":
          break;
        default:
          skipped[kind] = (skipped[kind] ?? 0) + 1;
      }
    }
  };
  walk(records(sections.get("ENTITIES") ?? []), identity, 0);

  // Bounds.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const add = (p: DxfPoint, pad = 0) => {
    minX = Math.min(minX, p.x - pad);
    minY = Math.min(minY, p.y - pad);
    maxX = Math.max(maxX, p.x + pad);
    maxY = Math.max(maxY, p.y + pad);
  };
  for (const e of entities) {
    if (e.type === "line") {
      add(e.a);
      add(e.b);
    } else if (e.type === "polyline") e.points.forEach((p) => add(p));
    else if (e.type === "circle") add(e.center, e.radius);
    else if (e.type === "arc") {
      let end = e.end;
      while (end <= e.start) end += 360;
      for (let a = e.start; a <= end + 1e-9; a += Math.min(15, end - e.start || 15)) {
        const r = (a * Math.PI) / 180;
        add({ x: e.center.x + e.radius * Math.cos(r), y: e.center.y + e.radius * Math.sin(r) });
      }
    } else add(e.at);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 1;
    maxY = 1;
  }

  return {
    entities,
    layers: [...layers.values()].sort((a, b) => a.name.localeCompare(b.name)),
    units,
    bounds: { minX, minY, maxX, maxY },
    skipped,
  };
}
