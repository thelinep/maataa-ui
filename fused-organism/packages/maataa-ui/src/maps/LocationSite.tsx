/**
 * @maataa/ui/maps/LocationSite
 * One shoot location in one place: where it is on the map, its CAD floor
 * plan with zones, what was measured there, and its permits
 */

import React, { useMemo } from "react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { PermitStatusCard, type Permit } from "../data/PermitStatusCard";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { CadPlanViewer } from "./CadPlanViewer";
import type { DxfDrawing, DxfPoint } from "./dxf";
import { GeoMap, type GeoMapPin } from "./GeoMap";
import { georeference, type ControlPoint } from "./georeference";
import type { LatLng } from "./MapCanvas";
import type { GeoBounds } from "./mapUtils";

export interface SiteZone {
  id: string;
  label: string;
  /** Corners on the plan, in drawing units */
  outline: DxfPoint[];
  /** @default "available" */
  status?: "available" | "reserved" | "blocked";
}

export interface SitePoint extends LatLng {
  id: string;
  /** e.g. "Unit base", "Parking", "Nearest hospital" */
  label: string;
}

export interface SiteMeasurement {
  /** e.g. "Ceiling height" */
  label: string;
  /** e.g. "6.2 m" */
  value: string;
}

export interface LocationSiteProps {
  name: string;
  address?: string;
  /** The location's own pin */
  position: LatLng;
  /** Other places around it: base camp, parking, hospital */
  points?: SitePoint[];
  /** The floor plan (see `parseDxf`) */
  drawing?: DxfDrawing | null;
  onDrawingChange?: (drawing: DxfDrawing, fileName: string) => void;
  /**
   * Two or more points known on both the plan and the map. With them the
   * plan's corners appear on the map and its scale and heading are shown.
   */
  controlPoints?: ControlPoint[];
  /** Areas drawn over the plan */
  zones?: SiteZone[];
  measurements?: SiteMeasurement[];
  permits?: Permit[];
  /** A map image covering `mapBounds`, as GeoMap's `backgroundImage` */
  mapImage?: string;
  /** @default fitted around every pin */
  mapBounds?: GeoBounds;
  className?: string;
  style?: React.CSSProperties;
}

const ZONE_FILL = {
  available: colorTokens.semantic.success,
  reserved: colorTokens.semantic.warning,
  blocked: colorTokens.semantic.error,
} as const;

function fitBounds(points: LatLng[]): GeoBounds {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const pad = Math.max(maxLat - minLat, maxLng - minLng, 0.002) * 0.25;
  return { minLat: minLat - pad, maxLat: maxLat + pad, minLng: minLng - pad, maxLng: maxLng + pad };
}

/**
 * LocationSite
 *
 * @example
 * ```tsx
 * <LocationSite
 *   name="Filmistan Studio 4"
 *   address="Goregaon West, Mumbai"
 *   position={{ lat: 19.1624, lng: 72.8467 }}
 *   drawing={parseDxf(dxfText)}
 *   controlPoints={[
 *     { plan: { x: 0, y: 0 }, geo: { lat: 19.16232, lng: 72.84655 } },
 *     { plan: { x: 24, y: 0 }, geo: { lat: 19.16236, lng: 72.84678 } },
 *   ]}
 *   zones={[{ id: "a", label: "Stage A", outline: [...] }]}
 * />
 * ```
 */
export function LocationSite({
  name,
  address,
  position,
  points = [],
  drawing,
  onDrawingChange,
  controlPoints,
  zones = [],
  measurements = [],
  permits = [],
  mapImage,
  mapBounds,
  className,
  style,
}: LocationSiteProps) {
  const t = useT();
  const locale = useLocale();
  const geo = useMemo(() => {
    if (!controlPoints || controlPoints.length < 2) return null;
    try {
      return georeference(controlPoints);
    } catch {
      return null;
    }
  }, [controlPoints]);

  const corners: GeoMapPin[] = useMemo(() => {
    if (!geo || !drawing) return [];
    const { minX, minY, maxX, maxY } = drawing.bounds;
    const names = [
      t("Plan corner, south-west"),
      t("Plan corner, south-east"),
      t("Plan corner, north-east"),
      t("Plan corner, north-west"),
    ];
    return [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ].map((p, i) => ({
      id: `corner-${i}`,
      label: names[i]!,
      ...geo.toLatLng(p),
      color: colorTokens.text.tertiary,
    }));
  }, [geo, drawing, t]);

  const pins: GeoMapPin[] = [
    { id: "site", label: name, ...position, status: "active" },
    ...points.map((p) => ({ id: p.id, label: p.label, lat: p.lat, lng: p.lng })),
    ...corners,
  ];
  const bounds = mapBounds ?? fitBounds(pins);
  const num = (n: number, digits = 1) =>
    n.toLocaleString(locale, { maximumFractionDigits: digits });

  const heading: React.CSSProperties = {
    margin: `0 0 ${spacingTokens.sm}`,
    fontSize: typographyTokens.fontSize["2xl"],
  };

  return (
    <article
      className={className}
      style={{
        display: "grid",
        gap: spacingTokens.lg,
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      <header>
        <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize["4xl"] }}>{name}</h2>
        <p style={{ margin: `${spacingTokens.xs} 0 0`, color: colorTokens.text.secondary }}>
          {address ? `${address} · ` : ""}
          {`${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: spacingTokens.lg,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        }}
      >
        <section aria-label={t("Map")}>
          <h3 style={heading}>{t("Map")}</h3>
          <GeoMap
            pins={pins}
            bounds={bounds}
            backgroundImage={mapImage}
            width={420}
            height={300}
            style={{ maxWidth: "100%" }}
          />
          {geo && (
            <p
              style={{
                margin: `${spacingTokens.sm} 0 0`,
                fontSize: typographyTokens.fontSize.sm,
                color: colorTokens.text.secondary,
              }}
            >
              {t(
                "Plan placed on the map: 1 drawing unit = {scale} m on the ground; plan up faces {bearing}° from north; fit error {error} m.",
                {
                  scale: num(geo.metresPerUnit, 3),
                  bearing: num(geo.bearingOfPlanUp, 0),
                  error: num(geo.rmsErrorMetres, 1),
                }
              )}
            </p>
          )}
        </section>

        <CadPlanViewer
          drawing={drawing ?? null}
          onDrawingChange={onDrawingChange}
          label={t("Floor plan")}
          height={300}
        >
          {zones.map((z) => {
            const fill = ZONE_FILL[z.status ?? "available"];
            const c = z.outline.reduce(
              (s, p) => ({ x: s.x + p.x / z.outline.length, y: s.y + p.y / z.outline.length }),
              { x: 0, y: 0 }
            );
            const size = drawing
              ? Math.max(drawing.bounds.maxX - drawing.bounds.minX, 1) / 45
              : 0.5;
            return (
              <g key={z.id}>
                <polygon
                  points={z.outline.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill={fill.bg}
                  fillOpacity={0.55}
                  stroke={fill.text}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  transform={`translate(${c.x} ${c.y}) scale(1 -1)`}
                  textAnchor="middle"
                  fontSize={size}
                  fill={fill.text}
                  fontWeight={600}
                  fontFamily={typographyTokens.fontFamily.base}
                >
                  {z.label}
                </text>
              </g>
            );
          })}
        </CadPlanViewer>
      </div>

      {zones.length > 0 && (
        <section aria-label={t("Zones")}>
          <h3 style={heading}>{t("Zones")}</h3>
          <ul style={{ margin: 0, paddingLeft: spacingTokens.lg }}>
            {zones.map((z) => (
              <li key={z.id}>
                {z.label}:{" "}
                {z.status === "blocked"
                  ? t("blocked")
                  : z.status === "reserved"
                    ? t("reserved")
                    : t("available")}
              </li>
            ))}
          </ul>
        </section>
      )}

      {measurements.length > 0 && (
        <section aria-label={t("Measurements")}>
          <h3 style={heading}>{t("Measurements")}</h3>
          <dl
            style={{
              margin: 0,
              display: "grid",
              gridTemplateColumns: "max-content 1fr",
              gap: `${spacingTokens.xs} ${spacingTokens.lg}`,
              padding: spacingTokens.md,
              border: `1px solid ${colorTokens.border.primary}`,
              borderRadius: radiusTokens.lg,
            }}
          >
            {measurements.map((m) => (
              <React.Fragment key={m.label}>
                <dt style={{ color: colorTokens.text.secondary }}>{m.label}</dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>{m.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      )}

      {permits.length > 0 && (
        <section aria-label={t("Permits")}>
          <h3 style={heading}>{t("Permits")}</h3>
          <div style={{ display: "grid", gap: spacingTokens.md }}>
            {permits.map((p) => (
              <PermitStatusCard key={p.id} permit={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

LocationSite.displayName = "LocationSite";
