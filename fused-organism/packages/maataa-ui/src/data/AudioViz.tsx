/**
 * @maataa/ui/data/AudioViz
 * Waveform, SpectrumAnalyzer (32-band) and VUMeter — visual aids that also
 * state their meaning in text/ARIA
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, typographyTokens } from "../tokens";

/* ───────────────────────── Waveform ───────────────────────── */

export interface WaveformProps {
  /** Peak values 0–1, one per column */
  peaks: number[];
  label: string;
  /** 0–1 portion already played */
  progress?: number;
  height?: number;
  /** Mark peaks at or above this as clipping @default 0.98 */
  clipAt?: number;
}

/**
 * Waveform
 * Mirrored peak bars; played part darker. Clipping peaks are marked and
 * counted in the accessible name.
 */
export function Waveform({
  peaks,
  label,
  progress = 0,
  height = 72,
  clipAt = 0.98,
}: WaveformProps) {
  const t = useT();
  const n = peaks.length || 1;
  const clips = peaks.filter((p) => p >= clipAt).length;
  const mid = height / 2;
  return (
    <svg
      role="img"
      aria-label={`${label}. ${clips ? t.plural(clips, "{count} clipping peak.", "{count} clipping peaks.") : t("No clipping.")}`}
      viewBox={`0 0 ${n * 3} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      style={{ display: "block", background: colorTokens.background.secondary, borderRadius: 6 }}
    >
      {peaks.map((p, i) => {
        const h = Math.max(1, p * (height - 4));
        const played = i / n < progress;
        return (
          <rect
            key={i}
            x={i * 3}
            y={mid - h / 2}
            width={2}
            height={h}
            fill={
              p >= clipAt
                ? colorTokens.interactive.error
                : played
                  ? colorTokens.interactive.primary
                  : colorTokens.border.primary
            }
          />
        );
      })}
    </svg>
  );
}

/** Downsample raw samples (-1…1) to `columns` peaks */
export function peaksFrom(samples: ArrayLike<number>, columns = 200): number[] {
  const out: number[] = [];
  const size = Math.max(1, Math.floor(samples.length / columns));
  for (let c = 0; c < columns; c++) {
    let m = 0;
    for (let i = c * size; i < Math.min(samples.length, (c + 1) * size); i++)
      m = Math.max(m, Math.abs(samples[i]!));
    out.push(m);
  }
  return out;
}

/* ───────────────────────── SpectrumAnalyzer ───────────────────────── */

export interface SpectrumAnalyzerProps {
  /** 0–1 per band (default 32 bands, low → high) */
  bands: number[];
  label?: string;
  height?: number;
  /** Show Hz labels under low/mid/high @default true */
  showScale?: boolean;
}

/** Band centre frequencies for 32 log-spaced bands, 20 Hz–20 kHz */
export const spectrumBandHz = Array.from({ length: 32 }, (_, i) =>
  Math.round(20 * 1000 ** (i / 31))
);

/**
 * SpectrumAnalyzer
 * A live visual: decorative bars plus one summary sentence (dominant range),
 * updated at most as often as the data changes. Not a live region.
 */
export function SpectrumAnalyzer({
  bands,
  label: labelProp,
  height = 96,
  showScale = true,
}: SpectrumAnalyzerProps) {
  const t = useT();
  const label = labelProp ?? t("Spectrum");
  const n = bands.length || 1;
  const peakIdx = bands.indexOf(Math.max(...bands));
  const hz = spectrumBandHz[Math.round((peakIdx / Math.max(1, n - 1)) * 31)] ?? 0;
  const range = hz < 250 ? "low" : hz < 4000 ? "mid" : "high";
  return (
    <figure style={{ margin: 0 }}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${n * 10} ${height}`}
        preserveAspectRatio="none"
        width="100%"
        height={height}
        style={{ display: "block", background: colorTokens.background.inverse, borderRadius: 6 }}
      >
        {bands.map((b, i) => {
          const h = Math.max(2, b * (height - 4));
          const hot = b > 0.85;
          return (
            <rect
              key={i}
              x={i * 10 + 1}
              y={height - h}
              width={8}
              height={h}
              rx={1}
              fill={hot ? "#F5B5A6" : b > 0.6 ? "#F5D547" : "#C7E9C0"}
            />
          );
        })}
      </svg>
      {showScale && (
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: colorTokens.text.secondary,
            marginTop: 2,
          }}
        >
          <span>{t("20 Hz")}</span>
          <span>{t("1 kHz")}</span>
          <span>{t("20 kHz")}</span>
        </div>
      )}
      <figcaption
        style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
      >
        {label}: strongest in the {range} range (about{" "}
        {hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${hz} Hz`}).
      </figcaption>
    </figure>
  );
}

/* ───────────────────────── VUMeter ───────────────────────── */

export interface VUMeterProps {
  /** Level in dBFS (e.g. -60…0) */
  level: number;
  /** Peak-hold level in dBFS */
  peak?: number;
  label: string;
  min?: number;
  orientation?: "horizontal" | "vertical";
  length?: number;
}

/** dBFS → "safe" / "loud" / "clipping" */
export function levelZone(db: number): "safe" | "loud" | "clipping" {
  return db >= -0.5 ? "clipping" : db >= -12 ? "loud" : "safe";
}

/**
 * VUMeter
 * role=meter with dB value text and zone ("-8 dB, loud"). Segments are
 * green / amber / red AND the zone is written beside the meter.
 */
export function VUMeter({
  level,
  peak,
  label,
  min = -60,
  orientation = "horizontal",
  length = 220,
}: VUMeterProps) {
  const t = useT();
  const segs = 24;
  const frac = (db: number) => Math.min(1, Math.max(0, (db - min) / -min));
  const lit = Math.round(frac(level) * segs);
  const pk = peak != null ? Math.min(segs - 1, Math.round(frac(peak) * segs) - 1) : -1;
  const zone = levelZone(peak ?? level);
  const vert = orientation === "vertical";
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: vert ? "column-reverse" : "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={0}
        aria-valuenow={Math.round(level)}
        aria-valuetext={t("{value} dB, {zone}", { value: Math.round(level), zone })}
        style={{
          display: "flex",
          flexDirection: vert ? "column-reverse" : "row",
          gap: 2,
          width: vert ? 14 : length,
          height: vert ? length : 14,
        }}
      >
        {Array.from({ length: segs }, (_, i) => {
          const db = min + ((i + 1) / segs) * -min;
          const col =
            db > -0.5
              ? colorTokens.interactive.error
              : db > -12
                ? "#C9A100"
                : colorTokens.interactive.success;
          const on = i < lit || i === pk;
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                flex: 1,
                borderRadius: 1,
                background: on ? col : colorTokens.border.secondary,
              }}
            />
          );
        })}
      </div>
      <span
        style={{
          fontSize: typographyTokens.fontSize.xs,
          fontFamily: "ui-monospace, Menlo, monospace",
          color: zone === "clipping" ? colorTokens.interactive.error : colorTokens.text.secondary,
          minWidth: 70,
        }}
        aria-hidden="true"
      >
        {Math.round(level)} dB{zone !== "safe" ? ` · ${zone}` : ""}
      </span>
    </div>
  );
}
