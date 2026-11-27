/**
 * @maataa/ui/data/TimezoneDisplay
 * One moment shown in several time zones (call times for remote crew)
 */

import { useLocale } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TimezoneDisplayProps {
  at: Date;
  /** IANA zones, first is primary, e.g. ["Asia/Kolkata", "Europe/London"] */
  zones: string[];
  /** Friendly names, e.g. { "Europe/London": "London (VFX)" } */
  labels?: Record<string, string>;
  /** @default 'en-IN' */
  locale?: string;
}

/** Short zone name like "IST" or "GMT+1" */
export function zoneAbbr(at: Date, zone: string, locale = "en-IN"): string {
  try {
    return (
      new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: "short" })
        .formatToParts(at)
        .find((p) => p.type === "timeZoneName")?.value ?? zone
    );
  } catch {
    return zone;
  }
}

/**
 * TimezoneDisplay
 * Primary time large, others listed below with "next day" / "previous day"
 * spelled out when the date differs.
 */
export function TimezoneDisplay({
  at,
  zones,
  labels = {},
  locale: localeProp,
}: TimezoneDisplayProps) {
  const locale = useLocale(localeProp);
  const fmt = (zone: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { timeZone: zone, ...opts }).format(at);
  const dayKey = (zone: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(at);
  const [primary, ...others] = zones;
  const pKey = dayKey(primary);
  const name = (z: string) => labels[z] ?? z.split("/").pop()!.replace(/_/g, " ");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <div>
        <span style={{ fontSize: typographyTokens.fontSize["3xl"], fontWeight: 700 }}>
          {fmt(primary, { hour: "numeric", minute: "2-digit" })}
        </span>{" "}
        <span style={{ color: colorTokens.text.secondary }}>
          {zoneAbbr(at, primary, locale)} · {name(primary)} ·{" "}
          {fmt(primary, { weekday: "short", day: "numeric", month: "short" })}
        </span>
      </div>
      {others.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {others.map((z) => {
            const k = dayKey(z);
            const rel = k === pKey ? "" : k > pKey ? " (next day)" : " (previous day)";
            return (
              <li key={z}>
                <strong>{fmt(z, { hour: "numeric", minute: "2-digit" })}</strong>{" "}
                {zoneAbbr(at, z, locale)} · {name(z)}
                <span
                  style={{
                    color: rel ? colorTokens.interactive.warning : undefined,
                    fontWeight: rel ? 600 : 400,
                  }}
                >
                  {rel}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
TimezoneDisplay.displayName = "TimezoneDisplay";
