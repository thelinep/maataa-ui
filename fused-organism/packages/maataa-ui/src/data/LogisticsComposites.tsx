/**
 * @maataa/ui/data/LogisticsComposites
 * WeatherWidget, LocationComparisonCard, PermitTimelineStrip,
 * VehicleCapacityCard, VehicleRateRow, CraftServiceMealCard, DietaryBadge,
 * CrewPositionRow, DepartmentCoverageGrid, SkillMeter and PackageSummaryBar
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { ScrollTable } from "./ScrollTable";

const card: React.CSSProperties = {
  border: `1px solid ${colorTokens.border.primary}`,
  borderRadius: 12,
  background: colorTokens.background.primary,
  padding: spacingTokens.md,
  display: "flex",
  flexDirection: "column",
  gap: spacingTokens.xs,
  minWidth: 0,
};
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ───────────────────────── WeatherWidget ───────────────────────── */

export interface WeatherHour {
  /** "06:00" */
  time: string;
  tempC: number;
  /** % chance */
  rain: number;
  windKmh: number;
  condition: "clear" | "partly" | "cloudy" | "rain" | "storm" | "fog";
}

const WX: Record<WeatherHour["condition"], { sym: string; word: string }> = {
  clear: { sym: "☀️", word: "Clear" },
  partly: { sym: "⛅", word: "Partly cloudy" },
  cloudy: { sym: "☁️", word: "Cloudy" },
  rain: { sym: "🌧", word: "Rain" },
  storm: { sym: "⛈", word: "Thunderstorm" },
  fog: { sym: "🌫", word: "Fog" },
};

export interface WeatherWidgetProps {
  place: string;
  date: string;
  hours: WeatherHour[];
  /** Flag hours with rain chance at or above this @default 40 */
  rainAlertAt?: number;
  /** Flag wind at or above this (drones, cranes) @default 30 */
  windAlertAt?: number;
  source?: string;
}

/**
 * WeatherWidget
 * Shoot-day forecast by hour as a table, with risk hours flagged in words
 * ("Rain risk", "High wind") — not only by icon or colour.
 */
export function WeatherWidget({
  place,
  date,
  hours,
  rainAlertAt = 40,
  windAlertAt = 30,
  source,
}: WeatherWidgetProps) {
  const risky = hours.filter((h) => h.rain >= rainAlertAt || h.windKmh >= windAlertAt);
  const th: React.CSSProperties = {
    padding: "6px 8px",
    fontSize: 12,
    color: colorTokens.text.secondary,
    textAlign: "center",
    fontWeight: 600,
  };
  const td: React.CSSProperties = {
    padding: "6px 8px",
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <section aria-label={`Weather for ${place}, ${date}`} style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        {place}{" "}
        <span
          style={{
            fontWeight: 400,
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          · {date}
        </span>
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: risky.length ? colorTokens.interactive.error : colorTokens.interactive.success,
          fontWeight: 600,
        }}
      >
        {risky.length
          ? `Watch: ${risky.map((h) => h.time).join(", ")}`
          : "No weather risk for the shoot hours"}
      </p>
      <ScrollTable label={`Hourly forecast, ${place}`}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <thead>
            <tr>
              <th scope="col" style={th}>
                Time
              </th>
              <th scope="col" style={th}>
                Sky
              </th>
              <th scope="col" style={th}>
                Temp
              </th>
              <th scope="col" style={th}>
                Rain
              </th>
              <th scope="col" style={th}>
                Wind
              </th>
              <th scope="col" style={th}>
                Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => {
              const rain = h.rain >= rainAlertAt;
              const wind = h.windKmh >= windAlertAt;
              return (
                <tr
                  key={h.time}
                  style={{
                    borderTop: `1px solid ${colorTokens.border.tertiary}`,
                    background: rain || wind ? colorTokens.semantic.warning.bg + "55" : undefined,
                  }}
                >
                  <th scope="row" style={{ ...td, fontFamily: "ui-monospace, Menlo, monospace" }}>
                    {h.time}
                  </th>
                  <td style={td}>
                    <span aria-hidden="true">{WX[h.condition].sym} </span>
                    {WX[h.condition].word}
                  </td>
                  <td style={td}>{h.tempC}°C</td>
                  <td style={{ ...td, fontWeight: rain ? 700 : 400 }}>{h.rain}%</td>
                  <td style={{ ...td, fontWeight: wind ? 700 : 400 }}>{h.windKmh} km/h</td>
                  <td style={{ ...td, color: colorTokens.interactive.error, fontWeight: 700 }}>
                    {[rain && "Rain risk", wind && "High wind"].filter(Boolean).join(", ") || (
                      <span style={{ color: colorTokens.text.tertiary, fontWeight: 400 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>
      {source && (
        <span style={{ fontSize: 11, color: colorTokens.text.tertiary }}>Source: {source}</span>
      )}
    </section>
  );
}

/* ───────────────────────── LocationComparisonCard ───────────────────────── */

export interface LocationOption {
  id: string;
  name: string;
  photoSrc?: string;
  /** Scored criteria 0–5 */
  scores: Record<string, number>;
  cost: number;
  notes?: string;
}

/**
 * LocationComparisonCard
 * Two to four candidate locations scored on the same criteria. The best
 * score per row is marked "best" in words; totals decide the suggestion.
 */
export function LocationComparisonCard({
  title,
  criteria,
  options,
  chosenId,
  onChoose,
}: {
  title: string;
  criteria: string[];
  options: LocationOption[];
  chosenId?: string;
  onChoose?: (id: string) => void;
}) {
  const total = (o: LocationOption) => criteria.reduce((s, c) => s + (o.scores[c] ?? 0), 0);
  const top = options.reduce((a, b) => (total(b) > total(a) ? b : a), options[0]!);
  const th: React.CSSProperties = {
    padding: "8px 10px",
    textAlign: "left",
    borderBottom: `2px solid ${colorTokens.border.primary}`,
  };
  const td: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
  };
  return (
    <section aria-label={title} style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{title}</h3>
      <p
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        Highest total: <strong style={{ color: colorTokens.text.primary }}>{top.name}</strong> (
        {total(top)} of {criteria.length * 5})
      </p>
      <ScrollTable label={`${title} scores`}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 160 + options.length * 130,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <thead>
            <tr>
              <td style={th} />
              {options.map((o) => (
                <th
                  key={o.id}
                  scope="col"
                  style={{
                    ...th,
                    background: o.id === chosenId ? colorTokens.background.tertiary : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "block",
                      height: 54,
                      borderRadius: 6,
                      marginBottom: 4,
                      background: o.photoSrc
                        ? `center / cover url(${o.photoSrc})`
                        : `linear-gradient(135deg, ${colorTokens.background.tertiary}, ${colorTokens.border.primary})`,
                    }}
                  />
                  {o.name}
                  {o.id === chosenId && (
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        color: colorTokens.interactive.primary,
                      }}
                    >
                      Chosen
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => {
              const best = Math.max(...options.map((o) => o.scores[c] ?? 0));
              return (
                <tr key={c}>
                  <th scope="row" style={{ ...td, fontWeight: 500 }}>
                    {c}
                  </th>
                  {options.map((o) => {
                    const v = o.scores[c] ?? 0;
                    return (
                      <td key={o.id} style={{ ...td, fontWeight: v === best ? 700 : 400 }}>
                        <span aria-hidden="true" style={{ letterSpacing: 1, color: "#C9A100" }}>
                          {"●".repeat(v)}
                          <span style={{ color: colorTokens.border.secondary }}>
                            {"●".repeat(5 - v)}
                          </span>
                        </span>{" "}
                        {v}/5
                        {v === best && (
                          <span style={{ fontSize: 11, color: colorTokens.interactive.success }}>
                            {" "}
                            best
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <th scope="row" style={{ ...td, fontWeight: 500 }}>
                Cost per day
              </th>
              {options.map((o) => (
                <td key={o.id} style={{ ...td, fontVariantNumeric: "tabular-nums" }}>
                  {inr(o.cost)}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" style={{ ...td, fontWeight: 700 }}>
                Total score
              </th>
              {options.map((o) => (
                <td key={o.id} style={{ ...td, fontWeight: 700 }}>
                  {total(o)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </ScrollTable>
      {onChoose && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={o.id === chosenId}
              onClick={() => onChoose(o.id)}
              style={{
                minHeight: 40,
                padding: "0 12px",
                borderRadius: 8,
                border: `1px solid ${colorTokens.border.control}`,
                background:
                  o.id === chosenId
                    ? colorTokens.interactive.primary
                    : colorTokens.background.primary,
                color: o.id === chosenId ? colorTokens.text.inverse : colorTokens.text.primary,
                font: "inherit",
                cursor: "pointer",
              }}
            >
              Choose {o.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── PermitTimelineStrip ───────────────────────── */

export interface PermitStep {
  label: string;
  /** Planned or actual date "12 Nov" */
  date: string;
  state: "done" | "current" | "upcoming" | "blocked";
}

/** Permit application steps across time; current and blocked steps in words. */
export function PermitTimelineStrip({
  permit,
  authority,
  steps,
}: {
  permit: string;
  authority?: string;
  steps: PermitStep[];
}) {
  const col = {
    done: colorTokens.interactive.success,
    current: colorTokens.interactive.primary,
    upcoming: colorTokens.border.control,
    blocked: colorTokens.interactive.error,
  };
  const word = {
    done: "Done",
    current: "In progress",
    upcoming: "Not started",
    blocked: "Blocked",
  };
  return (
    <section aria-label={`${permit} timeline`} style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
        {permit}
        {authority && (
          <span
            style={{
              fontWeight: 400,
              color: colorTokens.text.secondary,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {" "}
            · {authority}
          </span>
        )}
      </h3>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, minmax(90px, 1fr))`,
          overflowX: "auto",
        }}
      >
        {steps.map((s, i) => (
          <li
            key={s.label}
            aria-current={s.state === "current" ? "step" : undefined}
            style={{ position: "relative", padding: "22px 6px 0", textAlign: "center" }}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 9,
                  left: 0,
                  right: "50%",
                  height: 3,
                  background:
                    steps[i - 1]!.state === "done" ? col.done : colorTokens.border.secondary,
                }}
              />
            )}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 9,
                  left: "50%",
                  right: 0,
                  height: 3,
                  background: s.state === "done" ? col.done : colorTokens.border.secondary,
                }}
              />
            )}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 2,
                left: "50%",
                marginLeft: -9,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: s.state === "upcoming" ? colorTokens.background.primary : col[s.state],
                border: `3px solid ${col[s.state]}`,
                color: "#FFFFFF",
                fontSize: 11,
                lineHeight: "12px",
                fontWeight: 800,
              }}
            >
              {s.state === "done" ? "✓" : s.state === "blocked" ? "!" : ""}
            </span>
            <span style={{ display: "block", fontSize: 12, fontWeight: 600 }}>{s.label}</span>
            <span style={{ display: "block", fontSize: 11, color: colorTokens.text.secondary }}>
              {s.date}
            </span>
            <span
              style={{
                display: "block",
                fontSize: 11,
                color: s.state === "upcoming" ? colorTokens.text.secondary : col[s.state],
                fontWeight: 700,
              }}
            >
              {word[s.state]}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────── Vehicles ───────────────────────── */

export interface VehicleCapacityCardProps {
  name: string;
  /** e.g. "Tempo Traveller · DL 1C 4421" */
  detail?: string;
  seats: number;
  assigned: string[];
  driver?: string;
  departs?: string;
  from?: string;
  to?: string;
}

/** Seats used vs capacity, with the passenger list; over capacity is stated. */
export function VehicleCapacityCard({
  name,
  detail,
  seats,
  assigned,
  driver,
  departs,
  from,
  to,
}: VehicleCapacityCardProps) {
  const over = assigned.length > seats;
  const pct = Math.min(100, (assigned.length / seats) * 100);
  return (
    <article style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{name}</h3>
      {detail && <div style={{ fontSize: 12, color: colorTokens.text.secondary }}>{detail}</div>}
      {(from || departs) && (
        <div style={{ fontSize: typographyTokens.fontSize.sm }}>
          {departs && <strong>{departs}</strong>} {from && `${from} → ${to ?? ""}`}
        </div>
      )}
      <div
        role="meter"
        aria-label={`${name} seats`}
        aria-valuemin={0}
        aria-valuemax={seats}
        aria-valuenow={assigned.length}
        aria-valuetext={`${assigned.length} of ${seats} seats${over ? `, ${assigned.length - seats} over` : ""}`}
        style={{
          height: 8,
          borderRadius: 999,
          background: colorTokens.background.tertiary,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${pct}%`,
            background: over ? colorTokens.interactive.error : colorTokens.interactive.primary,
          }}
        />
      </div>
      <div
        style={{
          fontSize: typographyTokens.fontSize.sm,
          fontWeight: 600,
          color: over ? colorTokens.interactive.error : colorTokens.text.primary,
        }}
      >
        {assigned.length} of {seats} seats
        {over ? ` — ${assigned.length - seats} over capacity` : ""}
      </div>
      {driver && (
        <div style={{ fontSize: 12, color: colorTokens.text.secondary }}>Driver: {driver}</div>
      )}
      <details>
        <summary
          style={{
            cursor: "pointer",
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.interactive.primary,
          }}
        >
          Passengers ({assigned.length})
        </summary>
        <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontSize: typographyTokens.fontSize.sm }}>
          {assigned.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

export interface VehicleRate {
  id: string;
  vehicle: string;
  seats?: number;
  /** ₹ for 8 hours / 80 km */
  dayRate: number;
  extraHour?: number;
  extraKm?: number;
  vendor?: string;
}

/** Vehicle rate card rows as a table (8h/80km base + extras). */
export function VehicleRateRow({
  rates,
  label = "Vehicle rates",
}: {
  rates: VehicleRate[];
  label?: string;
}) {
  const th: React.CSSProperties = {
    padding: "8px 10px",
    textAlign: "right",
    borderBottom: `2px solid ${colorTokens.border.primary}`,
    background: colorTokens.background.secondary,
  };
  const td: React.CSSProperties = {
    padding: "8px 10px",
    textAlign: "right",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <ScrollTable label={label}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 520,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <thead>
          <tr>
            <th scope="col" style={{ ...th, textAlign: "left" }}>
              Vehicle
            </th>
            <th scope="col" style={th}>
              Seats
            </th>
            <th scope="col" style={th}>
              Day (8 h / 80 km)
            </th>
            <th scope="col" style={th}>
              Extra hour
            </th>
            <th scope="col" style={th}>
              Extra km
            </th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r) => (
            <tr key={r.id}>
              <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                {r.vehicle}
                {r.vendor && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 400,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {r.vendor}
                  </span>
                )}
              </th>
              <td style={td}>{r.seats ?? "—"}</td>
              <td style={{ ...td, fontWeight: 700 }}>{inr(r.dayRate)}</td>
              <td style={td}>{r.extraHour != null ? inr(r.extraHour) : "—"}</td>
              <td style={td}>{r.extraKm != null ? inr(r.extraKm) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

/* ───────────────────────── Food ───────────────────────── */

export type Diet = "veg" | "nonveg" | "egg" | "vegan" | "jain" | "glutenfree" | "nutfree" | "halal";

const DIET: Record<Diet, { label: string; sym: string; color: string }> = {
  veg: { label: "Vegetarian", sym: "●", color: "#2D6A3E" },
  nonveg: { label: "Non-vegetarian", sym: "▲", color: "#8B3A2B" },
  egg: { label: "Contains egg", sym: "◆", color: "#7A6100" },
  vegan: { label: "Vegan", sym: "V", color: "#2D6A3E" },
  jain: { label: "Jain", sym: "J", color: "#5B4B8A" },
  glutenfree: { label: "Gluten-free", sym: "GF", color: "#1E3A5F" },
  nutfree: { label: "Nut-free", sym: "NF", color: "#1E3A5F" },
  halal: { label: "Halal", sym: "H", color: "#2F6F73" },
};

/**
 * DietaryBadge
 * FSSAI-style veg/non-veg marks (square with dot/triangle) plus other diets
 * as lettered badges — always with the word.
 */
export function DietaryBadge({ diet, compact }: { diet: Diet; compact?: boolean }) {
  const d = DIET[diet];
  const fssai = diet === "veg" || diet === "nonveg";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: compact ? 0 : "1px 8px 1px 4px",
        borderRadius: 999,
        border: compact ? 0 : `1px solid ${d.color}`,
        fontSize: 12,
        fontWeight: 600,
        color: d.color,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-grid",
          placeItems: "center",
          minWidth: 14,
          height: 14,
          padding: fssai ? 0 : "0 2px",
          border: `1.5px solid ${d.color}`,
          borderRadius: fssai ? 2 : 4,
          fontSize: fssai ? 9 : 9,
          lineHeight: 1,
        }}
      >
        {d.sym}
      </span>
      {compact ? <VisuallyHidden>{d.label}</VisuallyHidden> : d.label}
    </span>
  );
}

export interface CraftServiceMealCardProps {
  meal: "Breakfast" | "Lunch" | "Dinner" | "Tea" | "Second meal";
  time: string;
  location: string;
  items: { name: string; diets: Diet[]; allergens?: string[] }[];
  /** Head counts per diet */
  counts?: Partial<Record<Diet, number>>;
  vendor?: string;
}

/** Meal service with menu, diet marks, allergens in words, and head counts. */
export function CraftServiceMealCard({
  meal,
  time,
  location,
  items,
  counts,
  vendor,
}: CraftServiceMealCardProps) {
  return (
    <article style={card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "baseline",
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{meal}</h3>
        <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700 }}>
          {time}
        </span>
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {location}
        {vendor && ` · ${vendor}`}
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {items.map((it) => (
          <li
            key={it.name}
            style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}
          >
            <span style={{ fontWeight: 500 }}>{it.name}</span>
            {it.diets.map((d) => (
              <DietaryBadge key={d} diet={d} compact />
            ))}
            {it.allergens && it.allergens.length > 0 && (
              <span style={{ fontSize: 12, color: colorTokens.interactive.error }}>
                Contains: {it.allergens.join(", ")}
              </span>
            )}
          </li>
        ))}
      </ul>
      {counts && (
        <dl
          style={{
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 14px",
            fontSize: typographyTokens.fontSize.sm,
            borderTop: `1px solid ${colorTokens.border.tertiary}`,
            paddingTop: 6,
          }}
        >
          {(Object.entries(counts) as [Diet, number][]).map(([d, n]) => (
            <div key={d} style={{ display: "flex", gap: 4 }}>
              <dt>{DIET[d].label}</dt>
              <dd style={{ margin: 0, fontWeight: 700 }}>{n}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

/* ───────────────────────── Crew ───────────────────────── */

export const DEPARTMENT_COLORS: Record<string, string> = {
  Direction: "#5B4B8A",
  Camera: "#1E3A5F",
  Lighting: "#7A6100",
  Grip: "#806641",
  Sound: "#2F6F73",
  Art: "#8B3A2B",
  Costume: "#9A4A6B",
  "Hair & make-up": "#9A4A6B",
  Production: "#2D6A3E",
  Transport: "#5C5C5C",
};

export interface CrewPosition {
  id: string;
  department: string;
  position: string;
  name?: string;
  rate?: number;
  /** "Confirmed" | "On hold" | "Open" */
  status: "confirmed" | "hold" | "open";
}

/** Crew positions as table rows with a department colour bar and status words. */
export function CrewPositionRow({
  positions,
  label = "Crew list",
}: {
  positions: CrewPosition[];
  label?: string;
}) {
  const word = { confirmed: "Confirmed", hold: "On hold", open: "Open — not filled" };
  const td: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
  };
  return (
    <ScrollTable label={label}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 520,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <thead>
          <tr style={{ background: colorTokens.background.secondary }}>
            {["Department", "Position", "Name", "Day rate", "Status"].map((h) => (
              <th
                key={h}
                scope="col"
                style={{
                  ...td,
                  borderBottom: `2px solid ${colorTokens.border.primary}`,
                  textAlign: h === "Day rate" ? "right" : "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr key={p.id}>
              <td
                style={{
                  ...td,
                  borderLeft: `5px solid ${DEPARTMENT_COLORS[p.department] ?? colorTokens.border.control}`,
                }}
              >
                {p.department}
              </td>
              <th scope="row" style={{ ...td, fontWeight: 500, textAlign: "left" }}>
                {p.position}
              </th>
              <td
                style={{
                  ...td,
                  color: p.name ? colorTokens.text.primary : colorTokens.text.tertiary,
                }}
              >
                {p.name ?? "—"}
              </td>
              <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {p.rate != null ? inr(p.rate) : "—"}
              </td>
              <td
                style={{
                  ...td,
                  fontWeight: 600,
                  color:
                    p.status === "open"
                      ? colorTokens.interactive.error
                      : p.status === "hold"
                        ? colorTokens.interactive.warning
                        : colorTokens.interactive.success,
                }}
              >
                {word[p.status]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

/**
 * DepartmentCoverageGrid
 * Departments × shoot days: number crewed vs needed. Short-staffed cells
 * say "2 of 4" and are marked "short".
 */
export function DepartmentCoverageGrid({
  days,
  departments,
  needed,
  crewed,
  label = "Department coverage",
}: {
  days: string[];
  departments: string[];
  needed: number[][];
  crewed: number[][];
  label?: string;
}) {
  const td: React.CSSProperties = {
    padding: "6px 8px",
    textAlign: "center",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <ScrollTable label={label}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 140 + days.length * 72,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <thead>
          <tr>
            <td style={td} />
            {days.map((d) => (
              <th
                key={d}
                scope="col"
                style={{ ...td, borderBottom: `2px solid ${colorTokens.border.primary}` }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departments.map((dep, r) => (
            <tr key={dep}>
              <th
                scope="row"
                style={{
                  ...td,
                  textAlign: "left",
                  fontWeight: 500,
                  borderLeft: `5px solid ${DEPARTMENT_COLORS[dep] ?? colorTokens.border.control}`,
                }}
              >
                {dep}
              </th>
              {days.map((d, c) => {
                const n = needed[r]?.[c] ?? 0;
                const h = crewed[r]?.[c] ?? 0;
                const short = h < n;
                return (
                  <td
                    key={d}
                    style={{
                      ...td,
                      background: short
                        ? colorTokens.semantic.error.bg
                        : n
                          ? colorTokens.semantic.success.bg + "88"
                          : undefined,
                      color: short ? colorTokens.semantic.error.text : colorTokens.text.primary,
                      fontWeight: short ? 700 : 400,
                    }}
                  >
                    {n ? `${h} of ${n}` : "—"}
                    {short && <span style={{ display: "block", fontSize: 10 }}>short</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

/** Skill level 1–5 as a meter with the level named. */
export function SkillMeter({
  skill,
  level,
  max = 5,
  levelNames = ["Beginner", "Working", "Skilled", "Expert", "Master"],
}: {
  skill: string;
  level: number;
  max?: number;
  levelNames?: string[];
}) {
  const name = levelNames[Math.max(0, Math.min(levelNames.length - 1, Math.round(level) - 1))];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(100px, 140px) auto 1fr",
        alignItems: "center",
        gap: 8,
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      <span>{skill}</span>
      <span
        role="meter"
        aria-label={skill}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={level}
        aria-valuetext={`${level} of ${max}, ${name}`}
        style={{ display: "inline-flex", gap: 3 }}
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              width: 16,
              height: 10,
              borderRadius: 2,
              background:
                i < level ? colorTokens.interactive.primary : colorTokens.border.secondary,
            }}
          />
        ))}
      </span>
      <span style={{ color: colorTokens.text.secondary, fontSize: 12 }}>{name}</span>
    </div>
  );
}

/* ───────────────────────── PackageSummaryBar ───────────────────────── */

export interface PackageLine {
  label: string;
  amount: number;
}

/**
 * PackageSummaryBar
 * Sticky summary for a package builder: items, subtotal, GST and total,
 * with the primary action. Total changes are announced.
 */
export function PackageSummaryBar({
  lines,
  gstRate = 0.18,
  actionLabel = "Request quote",
  onAction,
}: {
  lines: PackageLine[];
  gstRate?: number;
  actionLabel?: string;
  onAction: () => void;
}) {
  const sub = lines.reduce((s, l) => s + l.amount, 0);
  const gst = Math.round(sub * gstRate);
  return (
    <div
      role="region"
      aria-label="Package summary"
      style={{
        position: "sticky",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        gap: spacingTokens.md,
        flexWrap: "wrap",
        padding: `${spacingTokens.sm} ${spacingTokens.md}`,
        borderRadius: 12,
        background: colorTokens.background.inverse,
        color: colorTokens.text.inverse,
        boxShadow: colorTokens.shadow.lg,
      }}
    >
      <span style={{ fontSize: typographyTokens.fontSize.sm, opacity: 0.9 }}>
        {lines.length} {lines.length === 1 ? "item" : "items"}:{" "}
        {lines.map((l) => l.label).join(", ")}
      </span>
      <span style={{ flex: 1 }} />
      <dl
        style={{
          margin: 0,
          display: "flex",
          gap: 14,
          fontSize: typographyTokens.fontSize.sm,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <div>
          <dt style={{ opacity: 0.8, fontSize: 11 }}>Subtotal</dt>
          <dd style={{ margin: 0 }}>{inr(sub)}</dd>
        </div>
        <div>
          <dt style={{ opacity: 0.8, fontSize: 11 }}>GST {Math.round(gstRate * 100)}%</dt>
          <dd style={{ margin: 0 }}>{inr(gst)}</dd>
        </div>
        <div>
          <dt style={{ opacity: 0.8, fontSize: 11 }}>Total</dt>
          <dd
            aria-live="polite"
            style={{ margin: 0, fontSize: typographyTokens.fontSize.lg, fontWeight: 800 }}
          >
            {inr(sub + gst)}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onAction}
        disabled={!lines.length}
        style={{
          minHeight: 44,
          padding: "0 18px",
          borderRadius: 10,
          border: 0,
          background: "#F5D547",
          color: colorTokens.text.primary,
          font: "inherit",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
