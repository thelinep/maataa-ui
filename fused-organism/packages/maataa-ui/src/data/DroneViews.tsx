/**
 * @maataa/ui/data/DroneViews
 * Drone flight log, altitude readout and operator choice
 */

import { useLocale, useT, msg } from "../i18n/LocaleProvider";
import React from "react";
import { StateBadge, clearanceStates } from "../status/StateBadge";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface DroneFlight {
  id: string;
  takeoff: Date;
  landing?: Date;
  pilot: string;
  /** e.g. "DJI Inspire 3 · UIN UA-xxxx" */
  aircraft: string;
  maxAltitudeM: number;
  location: string;
  /** Digital Sky / airspace zone */
  zone: "green" | "yellow" | "red";
  clearance: keyof typeof clearanceStates;
  notes?: string;
}

const zoneText = {
  green: msg("Green zone"),
  yellow: msg("Yellow zone (permission needed)"),
  red: msg("Red zone (no-fly)"),
};

export interface DroneFlightLogProps {
  flights: DroneFlight[];
  /** Legal ceiling in metres @default 120 */
  ceilingM?: number;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * DroneFlightLog
 * A table of flights. Zone and clearance are words; flights above the
 * ceiling or in a red zone are flagged in text.
 */
export function DroneFlightLog({
  flights,
  ceilingM = 120,
  locale: localeProp,
}: DroneFlightLogProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const t = (d: Date) => d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    verticalAlign: "top",
  };
  return (
    <ScrollTable label={tx("Drone flight log")}>
      <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {tx("Drone flight log · {count} flights", { count: flights.length })}
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {tx("Time")}
            </th>
            <th scope="col" style={td}>
              {tx("Pilot and aircraft")}
            </th>
            <th scope="col" style={td}>
              {tx("Location and zone")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {tx("Max height")}
            </th>
            <th scope="col" style={td}>
              {tx("Clearance")}
            </th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => {
            const over = f.maxAltitudeM > ceilingM;
            return (
              <tr key={f.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  {f.takeoff.toLocaleDateString(locale, { day: "numeric", month: "short" })}{" "}
                  {t(f.takeoff)}
                  {f.landing ? `–${t(f.landing)}` : " (in the air)"}
                </th>
                <td style={td}>
                  {f.pilot}
                  <span
                    style={{
                      display: "block",
                      color: colorTokens.text.secondary,
                      fontSize: typographyTokens.fontSize.xs,
                    }}
                  >
                    {f.aircraft}
                  </span>
                </td>
                <td style={td}>
                  {f.location}
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.xs,
                      color:
                        f.zone === "red"
                          ? colorTokens.interactive.error
                          : f.zone === "yellow"
                            ? colorTokens.interactive.warning
                            : colorTokens.interactive.success,
                      fontWeight: 600,
                    }}
                  >
                    {tx(zoneText[f.zone])}
                  </span>
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    color: over ? colorTokens.interactive.error : undefined,
                    fontWeight: over ? 700 : 400,
                  }}
                >
                  {f.maxAltitudeM} m{over ? ` (above ${ceilingM} m limit)` : ""}
                </td>
                <td style={td}>
                  <StateBadge state={f.clearance} states={clearanceStates} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
DroneFlightLog.displayName = "DroneFlightLog";

export interface AltitudeDisplayProps {
  /** Current height above ground, metres */
  metres: number;
  /** @default 120 (India, DGCA) */
  ceilingM?: number;
  /** Warn this close to the ceiling @default 10 */
  marginM?: number;
}

/**
 * AltitudeDisplay
 * Big number plus a vertical gauge. Crossing into the warning band or
 * above the ceiling is announced once (status/alert), not every update.
 */
export function AltitudeDisplay({ metres, ceilingM = 120, marginM = 10 }: AltitudeDisplayProps) {
  const tx = useT();
  const state = metres > ceilingM ? "over" : metres >= ceilingM - marginM ? "near" : "ok";
  const color =
    state === "over"
      ? colorTokens.interactive.error
      : state === "near"
        ? colorTokens.interactive.warning
        : colorTokens.interactive.success;
  const pct = Math.min(100, (metres / (ceilingM * 1.2)) * 100);
  return (
    <div style={{ display: "flex", gap: spacingTokens.md, alignItems: "flex-end" }}>
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: 18,
          height: 120,
          background: colorTokens.background.tertiary,
          borderRadius: 9,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${pct}%`,
            background: color,
            borderRadius: 9,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -4,
            right: -4,
            bottom: `${(1 / 1.2) * 100}%`,
            height: 2,
            background: colorTokens.interactive.error,
          }}
        />
      </div>
      <div>
        <div
          style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: "tabular-nums", color }}
          aria-hidden="true"
        >
          {Math.round(metres)} m
        </div>
        <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
          {tx("Height above ground · limit {ceilingM} m", { ceilingM })}
        </div>
        <div role={state === "over" ? "alert" : "status"} style={{ fontWeight: 600, color }}>
          {state === "over"
            ? `Above the ${ceilingM} m limit. Descend now.`
            : state === "near"
              ? `Close to the ${ceilingM} m limit`
              : `${Math.round(metres)} m, within limit`}
        </div>
      </div>
    </div>
  );
}
AltitudeDisplay.displayName = "AltitudeDisplay";

export interface DroneOperator {
  id: string;
  name: string;
  /** Remote pilot certificate number */
  rpc?: string;
  rpcExpires?: Date;
}

export interface OperatorSelectorProps {
  operators: DroneOperator[];
  value: string | undefined;
  onChange: (id: string) => void;
  flightDate: Date;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * OperatorSelector
 * Only pilots with a remote pilot certificate valid on the flight date can
 * be chosen; others are listed with the reason.
 */
export function OperatorSelector({
  operators,
  value,
  onChange,
  flightDate,
  locale: localeProp,
}: OperatorSelectorProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const valid = (o: DroneOperator) =>
    Boolean(o.rpc) && (!o.rpcExpires || o.rpcExpires >= flightDate);
  return (
    <fieldset
      style={{
        border: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <legend style={{ fontWeight: 600, padding: 0, marginBottom: spacingTokens.xs }}>
        {tx("Drone pilot for {value}", {
          value: flightDate.toLocaleDateString(locale, { day: "numeric", month: "short" }),
        })}
      </legend>
      {operators.map((o) => {
        const ok = valid(o);
        const reason = !o.rpc
          ? "No remote pilot certificate"
          : `Certificate expired ${o.rpcExpires?.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}`;
        return (
          <label
            key={o.id}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "flex-start",
              color: ok ? colorTokens.text.primary : colorTokens.text.secondary,
            }}
          >
            <input
              type="radio"
              name="drone-operator"
              disabled={!ok}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
            />
            <span>
              {o.name}
              <span style={{ display: "block", fontSize: typographyTokens.fontSize.xs }}>
                {ok ? `RPC ${o.rpc}` : reason}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
OperatorSelector.displayName = "OperatorSelector";
