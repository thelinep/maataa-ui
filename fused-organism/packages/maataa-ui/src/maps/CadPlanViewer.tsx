/**
 * @maataa/ui/maps/CadPlanViewer
 * Shows a CAD floor plan (DXF) with layers, zoom and pan, and a measuring tool
 */

import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import { msg, useT } from "../i18n/LocaleProvider";
import { Button } from "../primitives/Button";
import { Checkbox } from "../forms/Checkbox";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import {
  metresPerUnit,
  parseDxf,
  type DxfDrawing,
  type DxfEntity,
  type DxfPoint,
  type DxfUnit,
} from "./dxf";

const UNIT_LABEL: Record<DxfUnit, string> = {
  unitless: msg("units"),
  in: "in",
  ft: "ft",
  yd: "yd",
  mi: "mi",
  mm: "mm",
  cm: "cm",
  m: "m",
  km: "km",
};

export interface CadPlanViewerProps {
  /** A parsed drawing (see `parseDxf`). Leave out to start empty with an Open button. */
  drawing?: DxfDrawing | null;
  /** Called with the new drawing when someone opens a DXF file. */
  onDrawingChange?: (drawing: DxfDrawing, fileName: string) => void;
  /** Accessible name and visible title. @default "Floor plan" */
  label?: string;
  /** Show the Open DXF button. @default true */
  allowOpen?: boolean;
  /** Drawing height in pixels. @default 420 */
  height?: number;
  /** Layers hidden at first, by name. Layers off in the file start hidden too. */
  initialHiddenLayers?: string[];
  /** Extra shapes drawn over the plan in drawing units, e.g. zones or marks. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

function fitView(d: DxfDrawing): View {
  const { minX, minY, maxX, maxY } = d.bounds;
  const pad = Math.max(maxX - minX, maxY - minY) * 0.05 || 1;
  // viewBox space has y flipped: y′ = −y
  return { x: minX - pad, y: -maxY - pad, w: maxX - minX + 2 * pad, h: maxY - minY + 2 * pad };
}

function vertices(d: DxfDrawing, hidden: Set<string>): DxfPoint[] {
  const out: DxfPoint[] = [];
  for (const e of d.entities) {
    if (hidden.has(e.layer)) continue;
    if (e.type === "line") out.push(e.a, e.b);
    else if (e.type === "polyline") out.push(...e.points);
    else if (e.type === "circle" || e.type === "arc") out.push(e.center);
    else out.push(e.at);
  }
  return out;
}

function arcPath(e: Extract<DxfEntity, { type: "arc" }>): string {
  let end = e.end;
  while (end <= e.start) end += 360;
  const r = (deg: number) => (deg * Math.PI) / 180;
  const p = (deg: number) =>
    `${e.center.x + e.radius * Math.cos(r(deg))} ${e.center.y + e.radius * Math.sin(r(deg))}`;
  const large = end - e.start > 180 ? 1 : 0;
  return `M ${p(e.start)} A ${e.radius} ${e.radius} 0 ${large} 1 ${p(end)}`;
}

/** A tidy length for a scale bar: 1, 2 or 5 × 10ⁿ, close to `target`. */
function niceLength(target: number): number {
  const p = 10 ** Math.floor(Math.log10(target));
  const m = target / p;
  return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * p;
}

/**
 * CadPlanViewer
 * Draws a DXF floor plan. Turn layers on and off, zoom with the buttons, the
 * mouse wheel or + and −, pan by dragging or with the arrow keys, and measure
 * between two points (it snaps to the nearest corner or end).
 *
 * @example
 * ```tsx
 * const [plan, setPlan] = useState<DxfDrawing | null>(null);
 * <CadPlanViewer drawing={plan} onDrawingChange={setPlan} label="Studio 4, ground floor" />
 * ```
 */
export function CadPlanViewer({
  drawing: drawingProp,
  onDrawingChange,
  label: labelProp,
  allowOpen = true,
  height = 420,
  initialHiddenLayers = [],
  children,
  className,
  style,
}: CadPlanViewerProps) {
  const t = useT();
  const label = labelProp ?? t("Floor plan");
  const titleId = useId();
  const fileId = useId();
  const [opened, setOpened] = useState<{ drawing: DxfDrawing; name: string } | null>(null);
  const drawing = drawingProp ?? opened?.drawing ?? null;
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(
    () =>
      new Set([
        ...initialHiddenLayers,
        ...(drawing?.layers.filter((l) => l.hidden).map((l) => l.name) ?? []),
      ])
  );
  const [view, setView] = useState<View | null>(() => (drawing ? fitView(drawing) : null));
  const [measuring, setMeasuring] = useState(false);
  const [points, setPoints] = useState<DxfPoint[]>([]);
  const [status, setStatus] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null);

  const lastDrawing = useRef(drawing);
  if (lastDrawing.current !== drawing) {
    lastDrawing.current = drawing;
    if (drawing) {
      setView(fitView(drawing));
      setHidden(new Set(drawing.layers.filter((l) => l.hidden).map((l) => l.name)));
      setPoints([]);
    }
  }

  const unitWord = drawing ? t(UNIT_LABEL[drawing.units]) : "";
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: n < 10 ? 2 : 1 });
  const layerColor = useMemo(
    () => new Map((drawing?.layers ?? []).map((l) => [l.name, l.color] as const)),
    [drawing]
  );
  const snaps = useMemo(() => (drawing ? vertices(drawing, hidden) : []), [drawing, hidden]);

  const open = async (file: File) => {
    setError(null);
    if (/\.dwg$/i.test(file.name)) {
      setError(t("DWG files can't be read in the browser. Save the drawing as DXF and open that."));
      return;
    }
    try {
      const d = parseDxf(await file.text());
      if (drawingProp === undefined) setOpened({ drawing: d, name: file.name });
      onDrawingChange?.(d, file.name);
      setStatus(t("{name} opened.", { name: file.name }));
    } catch (e) {
      setError(e instanceof Error ? t(e.message) : t("Couldn't read that file."));
    }
  };

  const zoom = useCallback((factor: number, at?: DxfPoint) => {
    setView((v) => {
      if (!v) return v;
      const cx = at ? at.x : v.x + v.w / 2;
      const cy = at ? -at.y : v.y + v.h / 2;
      const w = v.w * factor;
      const h = v.h * factor;
      return { x: cx - ((cx - v.x) * w) / v.w, y: cy - ((cy - v.y) * h) / v.h, w, h };
    });
  }, []);
  const pan = (dx: number, dy: number) =>
    setView((v) => (v ? { ...v, x: v.x + v.w * dx, y: v.y + v.h * dy } : v));

  /** Pointer position in drawing units, or null where layout isn't available (tests). */
  const toDrawing = (clientX: number, clientY: number): DxfPoint | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM?.();
    if (!svg || !ctm || !svg.createSVGPoint) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: -p.y };
  };

  const snap = (p: DxfPoint): DxfPoint => {
    if (!view) return p;
    const tolerance = view.w / 60;
    let best: DxfPoint | null = null;
    let bestD = tolerance;
    for (const s of snaps) {
      const d = Math.hypot(s.x - p.x, s.y - p.y);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    return best ?? p;
  };

  const addMeasurePoint = (p: DxfPoint) => {
    const next = points.length >= 2 ? [p] : [...points, p];
    setPoints(next);
    if (next.length === 2 && drawing) {
      const d = Math.hypot(next[1]!.x - next[0]!.x, next[1]!.y - next[0]!.y);
      const mpu = metresPerUnit(drawing.units);
      setStatus(
        mpu && drawing.units !== "m"
          ? t("Distance {value} {unit} ({metres} m)", {
              value: fmt(d),
              unit: unitWord,
              metres: fmt(d * mpu),
            })
          : t("Distance {value} {unit}", { value: fmt(d), unit: unitWord })
      );
    } else if (next.length === 1) setStatus(t("First point set. Choose the second point."));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 0.1;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => pan(-step, 0),
      ArrowRight: () => pan(step, 0),
      ArrowUp: () => pan(0, -step),
      ArrowDown: () => pan(0, step),
      "+": () => zoom(0.8),
      "=": () => zoom(0.8),
      "-": () => zoom(1.25),
      "0": () => drawing && setView(fitView(drawing)),
      Escape: () => {
        setMeasuring(false);
        setPoints([]);
      },
    };
    const run = keys[e.key];
    if (run) {
      e.preventDefault();
      run();
    }
  };

  const ink = colorTokens.text.primary;
  const stroke = (en: DxfEntity) => en.color ?? layerColor.get(en.layer) ?? ink;
  const shapes = drawing?.entities.map((en, i) => {
    if (hidden.has(en.layer)) return null;
    const common = {
      stroke: stroke(en),
      fill: "none",
      vectorEffect: "non-scaling-stroke" as const,
      strokeWidth: 1,
    };
    switch (en.type) {
      case "line":
        return <line key={i} x1={en.a.x} y1={en.a.y} x2={en.b.x} y2={en.b.y} {...common} />;
      case "polyline":
        return (
          <polyline
            key={i}
            points={
              en.points.map((p) => `${p.x},${p.y}`).join(" ") +
              (en.closed && en.points[0] ? ` ${en.points[0].x},${en.points[0].y}` : "")
            }
            {...common}
          />
        );
      case "circle":
        return <circle key={i} cx={en.center.x} cy={en.center.y} r={en.radius} {...common} />;
      case "arc":
        return <path key={i} d={arcPath(en)} {...common} />;
      case "point":
        return (
          <circle key={i} cx={en.at.x} cy={en.at.y} r={(view?.w ?? 1) / 300} fill={stroke(en)} />
        );
      case "text":
        return (
          <text
            key={i}
            transform={`translate(${en.at.x} ${en.at.y}) scale(1 -1) rotate(${-en.rotation})`}
            fontSize={en.height}
            fill={stroke(en)}
            fontFamily={typographyTokens.fontFamily.base}
          >
            {en.text}
          </text>
        );
      default:
        return null;
    }
  });

  const scaleLen = view ? niceLength(view.w / 5) : 0;
  const skipped = drawing ? Object.entries(drawing.skipped) : [];

  return (
    <section
      aria-labelledby={titleId}
      className={className}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: radiusTokens.lg,
        background: colorTokens.background.primary,
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: spacingTokens.sm,
          alignItems: "center",
          padding: spacingTokens.sm,
          borderBottom: `1px solid ${colorTokens.border.primary}`,
        }}
      >
        <h3
          id={titleId}
          style={{ margin: 0, fontSize: typographyTokens.fontSize.xl, flex: "1 1 auto" }}
        >
          {label}
          {drawing && " "}
          {drawing && (
            <span
              style={{
                fontWeight: 400,
                color: colorTokens.text.secondary,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {"· "}
              {t("{width} × {height} {unit}", {
                width: fmt(drawing.bounds.maxX - drawing.bounds.minX),
                height: fmt(drawing.bounds.maxY - drawing.bounds.minY),
                unit: unitWord,
              })}
            </span>
          )}
        </h3>
        {drawing && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => zoom(0.8)}
              aria-label={t("Zoom in")}
            >
              +
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => zoom(1.25)}
              aria-label={t("Zoom out")}
            >
              −
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setView(fitView(drawing))}>
              {t("Fit")}
            </Button>
            <Button
              size="sm"
              variant={measuring ? "primary" : "secondary"}
              aria-pressed={measuring}
              onClick={() => {
                setMeasuring((m) => !m);
                setPoints([]);
                setStatus(measuring ? "" : t("Measuring: choose the first point."));
              }}
            >
              {t("Measure")}
            </Button>
          </>
        )}
        {allowOpen && (
          <>
            <input
              id={fileId}
              type="file"
              accept=".dxf,.dwg"
              tabIndex={-1}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                opacity: 0,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void open(f);
                e.target.value = "";
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById(fileId)?.click()}
            >
              {t("Open DXF")}
            </Button>
          </>
        )}
      </header>

      {error && (
        <p
          role="alert"
          style={{ margin: spacingTokens.sm, color: colorTokens.semantic.error.text }}
        >
          {error}
        </p>
      )}

      {!drawing ? (
        <p
          style={{
            margin: 0,
            padding: spacingTokens.lg,
            color: colorTokens.text.secondary,
            textAlign: "center",
          }}
        >
          {t("Open a DXF floor plan to see it here.")}
        </p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <svg
            ref={svgRef}
            role="img"
            aria-label={label}
            tabIndex={0}
            onKeyDown={onKeyDown}
            viewBox={view ? `${view.x} ${view.y} ${view.w} ${view.h}` : undefined}
            preserveAspectRatio="xMidYMid meet"
            style={{
              flex: "1 1 320px",
              height,
              background: colorTokens.background.secondary,
              cursor: measuring ? "crosshair" : "grab",
              touchAction: "none",
              outlineOffset: -2,
            }}
            onWheel={(e) => {
              const at = toDrawing(e.clientX, e.clientY) ?? undefined;
              zoom(e.deltaY > 0 ? 1.15 : 0.87, at);
            }}
            onPointerDown={(e) => {
              if (!view) return;
              drag.current = { x: e.clientX, y: e.clientY, view, moved: false };
              e.currentTarget.setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              const svg = svgRef.current;
              if (!d || !svg) return;
              const rect = svg.getBoundingClientRect();
              if (!rect.width) return;
              const dx = e.clientX - d.x;
              const dy = e.clientY - d.y;
              if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
              if (!d.moved || measuring) return;
              const k = Math.max(d.view.w / rect.width, d.view.h / rect.height);
              setView({ ...d.view, x: d.view.x - dx * k, y: d.view.y - dy * k });
            }}
            onPointerUp={(e) => {
              const d = drag.current;
              drag.current = null;
              if (measuring && d && !d.moved) {
                const p = toDrawing(e.clientX, e.clientY);
                if (p) addMeasurePoint(snap(p));
              }
            }}
          >
            <g transform="scale(1 -1)">
              {shapes}
              {children}
              {points.length > 0 && (
                <g stroke={colorTokens.interactive.error} fill={colorTokens.interactive.error}>
                  {points.length === 2 && (
                    <line
                      x1={points[0]!.x}
                      y1={points[0]!.y}
                      x2={points[1]!.x}
                      y2={points[1]!.y}
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                      strokeDasharray="6 4"
                    />
                  )}
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={(view?.w ?? 1) / 200} stroke="none" />
                  ))}
                </g>
              )}
            </g>
            {view && (
              <g aria-hidden="true">
                <line
                  x1={view.x + view.w * 0.04}
                  y1={view.y + view.h * 0.95}
                  x2={view.x + view.w * 0.04 + scaleLen}
                  y2={view.y + view.h * 0.95}
                  stroke={ink}
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={view.x + view.w * 0.04}
                  y={view.y + view.h * 0.95 - view.h * 0.02}
                  fontSize={view.h * 0.035}
                  fill={ink}
                  fontFamily={typographyTokens.fontFamily.base}
                >
                  {`${fmt(scaleLen)} ${unitWord}`}
                </text>
              </g>
            )}
          </svg>

          <fieldset
            style={{
              flex: "0 1 200px",
              margin: 0,
              border: "none",
              borderLeft: `1px solid ${colorTokens.border.primary}`,
              padding: spacingTokens.sm,
              display: "grid",
              gap: spacingTokens.xs,
              alignContent: "start",
            }}
          >
            <legend style={{ fontWeight: 600, fontSize: typographyTokens.fontSize.md, padding: 0 }}>
              {t("Layers")}
            </legend>
            {drawing.layers.map((l) => (
              <span
                key={l.name}
                style={{ display: "flex", alignItems: "center", gap: spacingTokens.xs }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 12,
                    height: 12,
                    flex: "none",
                    borderRadius: radiusTokens.sm,
                    background: l.color ?? ink,
                  }}
                />
                <Checkbox
                  size="sm"
                  label={l.name}
                  checked={!hidden.has(l.name)}
                  onChange={(on) =>
                    setHidden((h) => {
                      const n = new Set(h);
                      if (on) n.delete(l.name);
                      else n.add(l.name);
                      return n;
                    })
                  }
                />
              </span>
            ))}
            {skipped.length > 0 && (
              <p
                style={{
                  margin: 0,
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {t("Not drawn: {list}", { list: skipped.map(([k, n]) => `${k} ×${n}`).join(", ") })}
              </p>
            )}
          </fieldset>
        </div>
      )}

      <p
        aria-live="polite"
        style={{
          margin: 0,
          padding: `${spacingTokens.xs} ${spacingTokens.sm}`,
          minHeight: "1.5em",
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        {status}
      </p>
    </section>
  );
}

CadPlanViewer.displayName = "CadPlanViewer";
