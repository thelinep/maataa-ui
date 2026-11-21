/**
 * @maataa/ui/maps/MapControls
 * MapLayerToggle, WeatherOverlayToggle, ZoomSlider, MapLegend, CompassRose,
 * ScaleBar, GeoSearchBox and LocationThumbnailCard
 */

import React, { useId, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { compassWord } from "./skyMath";

const panel: React.CSSProperties = {
  background: "rgba(255, 250, 240, 0.95)",
  border: `1px solid ${colorTokens.border.primary}`,
  borderRadius: 10,
  boxShadow: colorTokens.shadow.md,
  padding: "8px 10px",
  color: colorTokens.text.primary,
  fontSize: typographyTokens.fontSize.sm,
};

/* ───────────────────────── Layer toggles ───────────────────────── */

export interface MapLayerOption {
  id: string;
  label: string;
  /** Swatch colour shown next to the label */
  color?: string;
  icon?: React.ReactNode;
}

export interface MapLayerToggleProps {
  legend?: string;
  layers: MapLayerOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  /** Base map choice (radio), e.g. Streets / Satellite / Terrain */
  baseLayers?: MapLayerOption[];
  base?: string;
  onBaseChange?: (id: string) => void;
}

/** Checkbox list of overlays plus an optional base-map radio group. */
export function MapLayerToggle({
  legend = "Map layers",
  layers,
  value,
  onChange,
  baseLayers,
  base,
  onBaseChange,
}: MapLayerToggleProps) {
  const id = useId();
  return (
    <fieldset style={{ ...panel, margin: 0, minWidth: 180 }}>
      <legend style={{ fontWeight: 700, padding: "0 4px" }}>{legend}</legend>
      {baseLayers && (
        <div
          role="radiogroup"
          aria-label="Base map"
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 6,
            paddingBottom: 6,
            borderBottom: `1px solid ${colorTokens.border.secondary}`,
          }}
        >
          {baseLayers.map((b) => (
            <label
              key={b.id}
              style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32 }}
            >
              <input
                type="radio"
                name={`${id}-base`}
                checked={base === b.id}
                onChange={() => onBaseChange?.(b.id)}
                style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
              />
              {b.label}
            </label>
          ))}
        </div>
      )}
      {layers.map((l) => (
        <label key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32 }}>
          <input
            type="checkbox"
            checked={value.includes(l.id)}
            onChange={(e) =>
              onChange(e.target.checked ? [...value, l.id] : value.filter((v) => v !== l.id))
            }
            style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
          />
          {l.color && (
            <span
              aria-hidden="true"
              style={{ width: 12, height: 12, borderRadius: 3, background: l.color }}
            />
          )}
          {l.icon && <span aria-hidden="true">{l.icon}</span>}
          {l.label}
        </label>
      ))}
    </fieldset>
  );
}

export const weatherLayers: MapLayerOption[] = [
  { id: "rain", label: "Rain", icon: "🌧" },
  { id: "cloud", label: "Cloud cover", icon: "☁️" },
  { id: "wind", label: "Wind", icon: "💨" },
  { id: "temp", label: "Temperature", icon: "🌡" },
];

export function WeatherOverlayToggle({
  layers = weatherLayers,
  ...rest
}: Omit<MapLayerToggleProps, "layers" | "legend"> & { layers?: MapLayerOption[] }) {
  return <MapLayerToggle legend="Weather" layers={layers} {...rest} />;
}

/* ───────────────────────── ZoomSlider ───────────────────────── */

export interface ZoomSliderProps {
  value: number;
  onChange: (zoom: number) => void;
  min?: number;
  max?: number;
  /** Word per level, e.g. {3: "Country", 10: "City", 16: "Street"} */
  levelNames?: Record<number, string>;
}

const defaultLevels: Record<number, string> = {
  2: "World",
  5: "Country",
  8: "State",
  11: "City",
  14: "Neighbourhood",
  17: "Street",
  19: "Building",
};

/**
 * ZoomSlider
 * Zoom in / out buttons around a vertical native slider; value text names
 * the scale ("Zoom 11, city").
 */
export function ZoomSlider({
  value,
  onChange,
  min = 2,
  max = 19,
  levelNames = defaultLevels,
}: ZoomSliderProps) {
  const name = Object.entries(levelNames)
    .map(([k, v]) => [Number(k), v] as const)
    .filter(([k]) => k <= value)
    .pop()?.[1];
  const b: React.CSSProperties = {
    width: 36,
    height: 36,
    border: 0,
    background: "transparent",
    color: colorTokens.text.primary,
    fontSize: 20,
    cursor: "pointer",
    font: "inherit",
  };
  return (
    <div
      style={{
        ...panel,
        padding: 2,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        aria-label="Zoom in"
        style={b}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <span aria-hidden="true">+</span>
      </button>
      <input
        type="range"
        aria-label="Zoom"
        aria-orientation="vertical"
        min={min}
        max={max}
        value={value}
        aria-valuetext={`Zoom ${value}${name ? `, ${name.toLowerCase()}` : ""}`}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          writingMode: "vertical-lr",
          direction: "rtl",
          height: 120,
          width: 24,
          accentColor: colorTokens.interactive.primary,
        }}
      />
      <button
        type="button"
        aria-label="Zoom out"
        style={b}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <span aria-hidden="true">−</span>
      </button>
    </div>
  );
}

/* ───────────────────────── MapLegend ───────────────────────── */

export interface LegendEntry {
  label: string;
  color: string;
  shape?: "circle" | "square" | "line" | "dashed" | "area";
}

export function MapLegend({
  title = "Legend",
  entries,
}: {
  title?: string;
  entries: LegendEntry[];
}) {
  return (
    <section aria-label={title} style={{ ...panel, display: "inline-block" }}>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: typographyTokens.fontSize.xs,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </h3>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {entries.map((e) => (
          <li key={e.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="22" height="14" aria-hidden="true">
              {e.shape === "line" || e.shape === "dashed" ? (
                <line
                  x1="1"
                  y1="7"
                  x2="21"
                  y2="7"
                  stroke={e.color}
                  strokeWidth="3"
                  strokeDasharray={e.shape === "dashed" ? "5 3" : undefined}
                />
              ) : e.shape === "square" ? (
                <rect x="5" y="1" width="12" height="12" fill={e.color} />
              ) : e.shape === "area" ? (
                <rect
                  x="1"
                  y="1"
                  width="20"
                  height="12"
                  fill={e.color}
                  fillOpacity="0.3"
                  stroke={e.color}
                  strokeWidth="2"
                />
              ) : (
                <circle cx="11" cy="7" r="6" fill={e.color} stroke="#FFFFFF" strokeWidth="1.5" />
              )}
            </svg>
            {e.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────── CompassRose ───────────────────────── */

/**
 * CompassRose
 * North arrow. When the map is rotated (`rotation` degrees), it turns too and
 * says "North is up-right" etc.; with onReset it becomes a "Reset to north"
 * button.
 */
export function CompassRose({
  rotation = 0,
  onReset,
  size = 48,
}: {
  rotation?: number;
  onReset?: () => void;
  size?: number;
}) {
  const r = ((rotation % 360) + 360) % 360;
  const dir =
    r === 0 ? "North is up" : `North points ${compassWord(360 - r).replace(/-/g, " ")} on screen`;
  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="-24 -24 48 48"
      aria-hidden="true"
      style={{ transform: `rotate(${-r}deg)` }}
    >
      <circle r="22" fill="rgba(255,250,240,0.95)" stroke={colorTokens.border.primary} />
      <path d="M0 -18 L6 0 L0 -3 L-6 0 Z" fill={colorTokens.interactive.error} />
      <path d="M0 18 L6 0 L0 3 L-6 0 Z" fill={colorTokens.text.tertiary} />
      <text
        x="0"
        y="-12"
        textAnchor="middle"
        style={{ fontSize: 9, fontWeight: 800, fill: "#FFFFFF" }}
      >
        N
      </text>
    </svg>
  );
  return onReset ? (
    <button
      type="button"
      onClick={onReset}
      aria-label={`Reset to north. ${dir}.`}
      style={{
        border: 0,
        padding: 0,
        background: "transparent",
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      {svg}
    </button>
  ) : (
    <span role="img" aria-label={dir} style={{ display: "inline-block", lineHeight: 0 }}>
      {svg}
    </span>
  );
}

/* ───────────────────────── ScaleBar ───────────────────────── */

/** Pick a round distance that fits in maxPx */
export function niceScale(pxPerKm: number, maxPx = 120): { km: number; px: number; label: string } {
  const steps = [
    0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000,
  ];
  let best = steps[0]!;
  for (const s of steps) if (s * pxPerKm <= maxPx) best = s;
  return {
    km: best,
    px: best * pxPerKm,
    label: best < 1 ? `${Math.round(best * 1000)} m` : `${best} km`,
  };
}

export function ScaleBar({ pxPerKm, maxPx = 120 }: { pxPerKm: number; maxPx?: number }) {
  const s = niceScale(pxPerKm, maxPx);
  return (
    <div
      style={{
        ...panel,
        display: "inline-flex",
        flexDirection: "column",
        gap: 2,
        padding: "4px 8px",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700 }}>
        <VisuallyHidden>Scale: </VisuallyHidden>
        {s.label}
      </span>
      <span
        aria-hidden="true"
        style={{
          width: s.px,
          height: 6,
          borderLeft: `2px solid ${colorTokens.text.primary}`,
          borderRight: `2px solid ${colorTokens.text.primary}`,
          borderBottom: `2px solid ${colorTokens.text.primary}`,
        }}
      />
    </div>
  );
}

/* ───────────────────────── GeoSearchBox ───────────────────────── */

export interface GeoResult {
  id: string;
  name: string;
  /** e.g. "Old Delhi, Delhi" */
  context?: string;
  lat: number;
  lng: number;
}

export interface GeoSearchBoxProps {
  /** Return matches (sync filter or async geocoder) */
  search: (q: string) => GeoResult[] | Promise<GeoResult[]>;
  onSelect: (r: GeoResult) => void;
  label?: string;
  placeholder?: string;
}

/**
 * GeoSearchBox
 * APG combobox with listbox of places. Arrows move, Enter picks, Escape
 * clears. Count of results is announced.
 */
export function GeoSearchBox({
  search,
  onSelect,
  label = "Search places",
  placeholder = "Place, address or lat, lng",
}: GeoSearchBoxProps) {
  const id = useId();
  const [q, setQ] = useState("");
  const [res, setRes] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const [msg, setMsg] = useState("");
  const run = async (v: string) => {
    setQ(v);
    if (v.trim().length < 2) {
      setRes([]);
      setOpen(false);
      setMsg("");
      return;
    }
    const r = await search(v);
    setRes(r);
    setOpen(true);
    setAct(0);
    setMsg(
      r.length ? `${r.length} ${r.length === 1 ? "place" : "places"} found` : "No places found"
    );
  };
  const pick = (r: GeoResult) => {
    onSelect(r);
    setQ(r.name);
    setOpen(false);
    setMsg(`${r.name} selected`);
  };
  return (
    <div style={{ position: "relative", minWidth: 240 }}>
      <label
        htmlFor={`${id}-i`}
        style={{
          display: "block",
          fontSize: typographyTokens.fontSize.sm,
          fontWeight: 600,
          marginBottom: 2,
        }}
      >
        {label}
      </label>
      <input
        id={`${id}-i`}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && res.length > 0}
        aria-controls={`${id}-l`}
        aria-activedescendant={open && res.length ? `${id}-o${act}` : undefined}
        value={q}
        placeholder={placeholder}
        onChange={(e) => void run(e.target.value)}
        onKeyDown={(e) => {
          if (!open || !res.length) return;
          if (e.key === "ArrowDown") setAct((a) => (a + 1) % res.length);
          else if (e.key === "ArrowUp") setAct((a) => (a - 1 + res.length) % res.length);
          else if (e.key === "Enter") pick(res[act]!);
          else if (e.key === "Escape") setOpen(false);
          else return;
          e.preventDefault();
        }}
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 44,
          padding: "0 12px",
          border: `2px solid ${colorTokens.border.control}`,
          borderRadius: 8,
          font: "inherit",
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
        }}
      />
      <ul
        id={`${id}-l`}
        role="listbox"
        aria-label={label}
        hidden={!open || !res.length}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 20,
          listStyle: "none",
          margin: "4px 0 0",
          padding: 4,
          background: colorTokens.background.primary,
          border: `1px solid ${colorTokens.border.control}`,
          borderRadius: 8,
          boxShadow: colorTokens.shadow.md,
        }}
      >
        {res.map((r, i) => (
          <li
            key={r.id}
            id={`${id}-o${i}`}
            role="option"
            aria-selected={i === act}
            onMouseDown={(e) => {
              e.preventDefault();
              pick(r);
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: i === act ? colorTokens.background.tertiary : undefined,
            }}
          >
            <span style={{ fontWeight: 600 }}>{r.name}</span>
            {r.context && (
              <>
                {" "}
                <span
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {r.context}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── LocationThumbnailCard ───────────────────────── */

export interface LocationThumbnailCardProps {
  name: string;
  photoSrc?: string;
  /** Short facts: "2.4 km from base", "Permit needed" */
  facts?: string[];
  lat: number;
  lng: number;
  /** e.g. "Approved", "Pending recce" */
  status?: string;
  href?: string;
  onShowOnMap?: () => void;
}

/** Compact location card for lists beside a map; coordinates are copyable text. */
export function LocationThumbnailCard({
  name,
  photoSrc,
  facts,
  lat,
  lng,
  status,
  href,
  onShowOnMap,
}: LocationThumbnailCardProps) {
  return (
    <article
      style={{
        display: "flex",
        gap: spacingTokens.sm,
        padding: 8,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        background: colorTokens.background.primary,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 88,
          minHeight: 72,
          borderRadius: 8,
          flexShrink: 0,
          background: photoSrc
            ? `center / cover url(${photoSrc})`
            : `linear-gradient(135deg, ${colorTokens.background.tertiary}, ${colorTokens.border.primary})`,
        }}
      />
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
          {href ? (
            <a href={href} style={{ color: colorTokens.text.primary }}>
              {name}
            </a>
          ) : (
            name
          )}
        </h3>
        {status && (
          <span
            style={{
              alignSelf: "flex-start",
              fontSize: 11,
              fontWeight: 700,
              padding: "1px 8px",
              borderRadius: 999,
              background: colorTokens.background.tertiary,
            }}
          >
            {status}
          </span>
        )}
        {facts && (
          <span
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
          >
            {facts.join(" · ")}
          </span>
        )}
        <span
          style={{
            fontSize: 11,
            fontFamily: "ui-monospace, Menlo, monospace",
            color: colorTokens.text.secondary,
          }}
        >
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
        {onShowOnMap && (
          <button
            type="button"
            onClick={onShowOnMap}
            style={{
              alignSelf: "flex-start",
              minHeight: 32,
              padding: "0 10px",
              marginTop: 2,
              borderRadius: 6,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
              fontSize: typographyTokens.fontSize.xs,
              cursor: "pointer",
            }}
          >
            Show {name} on map
          </button>
        )}
      </div>
    </article>
  );
}
