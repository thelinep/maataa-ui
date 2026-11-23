/**
 * @maataa/ui/maps/SkyWidgets
 * SunPositionWidget (golden hour planning), MoonPositionWidget,
 * TerrainProfile and RocketLaunch
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useEffect, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { ChartFigure } from "../data/chartKit";
import { compassWord, moonIllumination, moonPosition, sunPosition, sunTimes } from "./skyMath";

const fmtTime = (d: Date | null, tz: string | undefined, locale: string) =>
  d ? d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: tz }) : "—";

function SkyDial({
  azimuth,
  altitude,
  color,
  label,
}: {
  azimuth: number;
  altitude: number;
  color: string;
  label: string;
}) {
  const R = 60;
  const r = R * (1 - Math.max(0, altitude) / 90);
  const a = ((azimuth - 90) * Math.PI) / 180;
  const below = altitude < 0;
  return (
    <svg width="150" height="150" viewBox="-75 -75 150 150" aria-hidden="true">
      <circle r={R} fill={colorTokens.background.secondary} stroke={colorTokens.border.primary} />
      <circle r={R / 2} fill="none" stroke={colorTokens.border.secondary} strokeDasharray="3 3" />
      {["N", "E", "S", "W"].map((t, i) => (
        <text
          key={t}
          x={Math.cos(((i * 90 - 90) * Math.PI) / 180) * (R + 9)}
          y={Math.sin(((i * 90 - 90) * Math.PI) / 180) * (R + 9) + 4}
          textAnchor="middle"
          style={{ fontSize: 10, fontWeight: 700, fill: colorTokens.text.secondary }}
        >
          {t}
        </text>
      ))}
      <line
        x1={0}
        y1={0}
        x2={Math.cos(a) * R}
        y2={Math.sin(a) * R}
        stroke={color}
        strokeDasharray="2 3"
      />
      <circle
        cx={Math.cos(a) * (below ? R : r)}
        cy={Math.sin(a) * (below ? R : r)}
        r={9}
        fill={below ? "none" : color}
        stroke={color}
        strokeWidth={2}
      />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        style={{ fontSize: 9, fill: colorTokens.text.tertiary }}
      >
        {label}
      </text>
    </svg>
  );
}

export interface SunPositionWidgetProps {
  lat: number;
  lng: number;
  /** Time to show (defaults to now) */
  date?: Date;
  /** IANA time zone for the displayed times, e.g. "Asia/Kolkata" */
  timeZone?: string;
  place?: string;
}

/**
 * SunPositionWidget
 * Where the sun is (bearing in words and degrees, elevation) and the day's
 * sunrise, golden hours, sunset and blue hour — all as text, with a sky
 * dial as a visual aid.
 */
export function SunPositionWidget({
  lat,
  lng,
  date = new Date(),
  timeZone,
  place,
}: SunPositionWidgetProps) {
  const locale = useLocale();
  const pos = sunPosition(date, lat, lng);
  const t = sunTimes(date, lat, lng);
  const up = pos.altitude > 0;
  const rows: [string, string][] = [
    ["Blue hour (dawn)", fmtTime(t.dawn, timeZone, locale)],
    ["Sunrise", fmtTime(t.sunrise, timeZone, locale)],
    ["Golden hour ends", fmtTime(t.goldenHourMorningEnd, timeZone, locale)],
    ["Solar noon", fmtTime(t.solarNoon, timeZone, locale)],
    ["Golden hour starts", fmtTime(t.goldenHourEveningStart, timeZone, locale)],
    ["Sunset", fmtTime(t.sunset, timeZone, locale)],
    ["Blue hour (dusk)", fmtTime(t.dusk, timeZone, locale)],
  ];
  return (
    <section
      aria-label={`Sun${place ? ` at ${place}` : ""}`}
      style={{
        display: "flex",
        gap: spacingTokens.md,
        flexWrap: "wrap",
        padding: spacingTokens.md,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 12,
        background: colorTokens.background.primary,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SkyDial azimuth={pos.azimuth} altitude={pos.altitude} color="#C9A100" label="sun" />
        <p
          style={{
            margin: 0,
            maxWidth: 170,
            textAlign: "center",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {up
            ? `Sun is ${Math.round(pos.altitude)}° up, in the ${compassWord(pos.azimuth)} (${Math.round(pos.azimuth)}°).`
            : `Sun is below the horizon (${Math.round(pos.altitude)}°).`}
        </p>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: typographyTokens.fontSize.md }}>
          {place ?? "Sun"} ·{" "}
          {date.toLocaleDateString(locale, { day: "numeric", month: "short", timeZone })}
        </h3>
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "4px 16px",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {rows.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt
                style={{
                  color: k.startsWith("Golden") ? "#7A6100" : colorTokens.text.secondary,
                  fontWeight: k.startsWith("Golden") ? 700 : 400,
                }}
              >
                {k}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontFamily: "ui-monospace, Menlo, monospace",
                  textAlign: "right",
                }}
              >
                {v}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}

export interface MoonPositionWidgetProps {
  lat: number;
  lng: number;
  date?: Date;
  place?: string;
}

/** Moon phase, % lit and position — for night shoots. */
export function MoonPositionWidget({
  lat,
  lng,
  date = new Date(),
  place,
}: MoonPositionWidgetProps) {
  const t = useT();
  const pos = moonPosition(date, lat, lng);
  const ill = moonIllumination(date);
  const lit = Math.round(ill.fraction * 100);
  const waxing = ill.phase < 0.5;
  const R = 26;
  const k = 1 - 2 * ill.fraction;
  return (
    <section
      aria-label={`Moon${place ? ` at ${place}` : ""}`}
      style={{
        display: "flex",
        gap: spacingTokens.md,
        flexWrap: "wrap",
        alignItems: "center",
        padding: spacingTokens.md,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 12,
        background: colorTokens.background.primary,
      }}
    >
      <svg width="64" height="64" viewBox="-32 -32 64 64" aria-hidden="true">
        <circle r={R} fill="#2B2B33" />
        <path
          d={`M0 ${-R} A${R} ${R} 0 0 ${waxing ? 1 : 0} 0 ${R} A${Math.abs(k) * R} ${R} 0 0 ${(waxing ? k > 0 : k < 0) ? 0 : 1} 0 ${-R} Z`}
          fill="#F3EEDC"
        />
      </svg>
      <SkyDial azimuth={pos.azimuth} altitude={pos.altitude} color="#5B4B8A" label="moon" />
      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: typographyTokens.fontSize.md }}>{ill.name}</h3>
        <p style={{ margin: 0, fontSize: typographyTokens.fontSize.sm }}>
          {t("{lit}% lit", { lit })}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
          }}
        >
          {pos.altitude > 0
            ? `${Math.round(pos.altitude)}° up in the ${compassWord(pos.azimuth)}`
            : "Below the horizon"}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── TerrainProfile ───────────────────────── */

export interface ElevationSample {
  /** Distance along the route, km */
  km: number;
  /** Metres above sea level */
  m: number;
  /** Optional waypoint name */
  label?: string;
}

/**
 * TerrainProfile
 * Elevation along a route (drive to location, drone path). Summary gives
 * total climb/descent and highest point; data table included.
 */
export function TerrainProfile({ title, samples }: { title: string; samples: ElevationSample[] }) {
  const W = 560;
  const H = 180;
  const pad = { l: 44, r: 10, t: 24, b: 24 };
  const maxKm = samples[samples.length - 1]?.km || 1;
  const lo = Math.min(...samples.map((s) => s.m));
  const hi = Math.max(...samples.map((s) => s.m));
  const span = hi - lo || 1;
  const x = (k: number) => pad.l + ((W - pad.l - pad.r) * k) / maxKm;
  const y = (m: number) => pad.t + (H - pad.t - pad.b) * (1 - (m - lo) / span);
  let up = 0;
  let down = 0;
  for (let i = 1; i < samples.length; i++) {
    const d = samples[i]!.m - samples[i - 1]!.m;
    if (d > 0) up += d;
    else down -= d;
  }
  const top = samples.reduce((a, b) => (b.m > a.m ? b : a), samples[0]!);
  const line = samples.map((s, i) => `${i ? "L" : "M"}${x(s.km)} ${y(s.m)}`).join(" ");
  return (
    <ChartFigure
      title={title}
      summary={`${maxKm.toFixed(1)} km, climbing ${Math.round(up)} m and descending ${Math.round(down)} m. Highest point ${Math.round(top.m)} m${top.label ? ` at ${top.label}` : ""} (${top.km.toFixed(1)} km).`}
      table={{
        columns: ["Distance (km)", "Elevation (m)", "Waypoint"],
        rows: samples.map((s) => [s.km.toFixed(1), Math.round(s.m), s.label ?? ""]),
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
        {[lo, lo + span / 2, hi].map((m) => (
          <g key={m}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(m)}
              y2={y(m)}
              stroke={colorTokens.border.secondary}
            />
            <text
              x={pad.l - 6}
              y={y(m) + 4}
              textAnchor="end"
              style={{ fontSize: 10, fill: colorTokens.text.secondary }}
            >
              {Math.round(m)} m
            </text>
          </g>
        ))}
        <path
          d={`${line} L${x(maxKm)} ${H - pad.b} L${pad.l} ${H - pad.b} Z`}
          fill="#2D6A3E"
          fillOpacity={0.18}
        />
        <path d={line} fill="none" stroke="#2D6A3E" strokeWidth={2.5} />
        {samples
          .filter((s) => s.label)
          .map((s) => (
            <g key={s.label}>
              <circle cx={x(s.km)} cy={y(s.m)} r={4} fill="#2D6A3E" />
              <text
                x={x(s.km)}
                y={y(s.m) - 8}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700, fill: colorTokens.text.primary }}
              >
                {s.label}
              </text>
            </g>
          ))}
        <text
          x={W - pad.r}
          y={H - 6}
          textAnchor="end"
          style={{ fontSize: 10, fill: colorTokens.text.secondary }}
        >
          {maxKm.toFixed(1)} km
        </text>
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── RocketLaunch ───────────────────────── */

export interface RocketLaunchProps {
  /** Launch time */
  at: Date;
  mission: string;
  /** Called at T-0 */
  onLaunch?: () => void;
  /** For tests/stories: override "now" */
  now?: () => number;
}

/**
 * RocketLaunch
 * T-minus countdown with a short lift-off animation at zero (static with
 * reduced motion). The countdown is announced only at 10, 5 and 0 seconds
 * plus each minute — not every second.
 */
export function RocketLaunch({ at, mission, onLaunch, now = Date.now }: RocketLaunchProps) {
  const t = useT();
  const locale = useLocale();
  const [left, setLeft] = useState(Math.ceil((at.getTime() - now()) / 1000));
  const [say, setSay] = useState("");
  const reduce =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.ceil((at.getTime() - now()) / 1000)), 250);
    return () => clearInterval(t);
  }, [at, now]);
  useEffect(() => {
    if (left === 0) {
      setSay(`${mission}: lift-off!`);
      onLaunch?.();
    } else if (left === 10 || left === 5 || (left > 0 && left % 60 === 0))
      setSay(
        `T minus ${left >= 60 ? `${left / 60} minute${left === 60 ? "" : "s"}` : `${left} seconds`}`
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);
  const launched = left <= 0;
  const abs = Math.max(0, left);
  const hh = String(Math.floor(abs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((abs % 3600) / 60)).padStart(2, "0");
  const ss = String(abs % 60).padStart(2, "0");
  return (
    <section
      aria-label={t("{mission} launch", { mission })}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: spacingTokens.md,
        borderRadius: 12,
        background: "linear-gradient(#141B2B, #3A2A1A)",
        color: "#FFFFFF",
        minHeight: 200,
      }}
    >
      <style>{`@keyframes maataa-liftoff { from { transform: translateY(0); } to { transform: translateY(-260px); } }`}</style>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{mission}</h3>
      <p
        style={{
          margin: "6px 0 0",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 34,
          fontWeight: 800,
          color: launched ? "#C7E9C0" : "#F5D547",
        }}
      >
        {launched ? "LIFT-OFF" : `T−${hh}:${mm}:${ss}`}
      </p>
      <p style={{ margin: 0, fontSize: typographyTokens.fontSize.sm, opacity: 0.85 }}>
        {t("Launch {value}", {
          value: at.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }),
        })}
      </p>
      <svg
        width="40"
        height="90"
        viewBox="0 0 40 90"
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 36,
          bottom: 16,
          animation: launched && !reduce ? "maataa-liftoff 2.5s ease-in forwards" : undefined,
        }}
      >
        <path d="M20 2 C30 14 30 40 28 60 H12 C10 40 10 14 20 2 Z" fill="#F3EEDC" />
        <circle cx="20" cy="28" r="5" fill="#1E3A5F" />
        <path d="M12 52 L4 68 L12 64 Z M28 52 L36 68 L28 64 Z" fill="#8B3A2B" />
        {launched && <path d="M14 62 Q20 92 26 62 Z" fill="#F5D547" />}
      </svg>
      <VisuallyHidden role="status">{say}</VisuallyHidden>
    </section>
  );
}
