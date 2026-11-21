/**
 * @maataa/ui/forms/SliderBanks
 * SliderBank (any set of labelled parameters) and presets: EqFaders,
 * ColorCorrectionSliders, EffectSliderBank
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SliderParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  /** Neutral value (Reset goes here; a centre tick is drawn) */
  neutral?: number;
  unit?: string;
  /** Format for display and aria-valuetext */
  format?: (v: number) => string;
}

export interface SliderBankProps {
  legend: string;
  params: SliderParam[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  orientation?: "horizontal" | "vertical";
  /** Show "Reset all" @default true */
  resettable?: boolean;
  /** Show a Bypass switch (effect on/off) */
  bypassed?: boolean;
  onBypassChange?: (bypassed: boolean) => void;
}

const signed = (v: number, unit = "") =>
  `${v > 0 ? "+" : ""}${Number.isInteger(v) ? v : v.toFixed(1)}${unit ? ` ${unit}` : ""}`;

/**
 * SliderBank
 * A fieldset of native range inputs. Each has a visible value, a valuetext
 * with its unit, and double-click / Reset to return to neutral. Vertical
 * banks use writing-mode so arrow keys still work as expected.
 */
export function SliderBank({
  legend,
  params,
  values,
  onChange,
  orientation = "horizontal",
  resettable = true,
  bypassed,
  onBypassChange,
}: SliderBankProps) {
  const id = useId();
  const vert = orientation === "vertical";
  const fmt = (p: SliderParam, v: number) =>
    p.format
      ? p.format(v)
      : p.neutral === 0
        ? signed(v, p.unit)
        : `${v}${p.unit ? ` ${p.unit}` : ""}`;
  return (
    <fieldset
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        padding: spacingTokens.md,
        margin: 0,
        opacity: bypassed ? 0.6 : 1,
      }}
    >
      <legend style={{ fontWeight: 600, padding: "0 6px" }}>{legend}</legend>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: spacingTokens.sm,
          marginBottom: spacingTokens.xs,
        }}
      >
        {onBypassChange && (
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            <input
              type="checkbox"
              checked={!!bypassed}
              onChange={(e) => onBypassChange(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
            />
            Bypass
          </label>
        )}
        {resettable && (
          <button
            type="button"
            onClick={() => params.forEach((p) => onChange(p.id, p.neutral ?? p.min))}
            style={{
              minHeight: 32,
              padding: "0 10px",
              borderRadius: 6,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
              fontSize: typographyTokens.fontSize.sm,
              cursor: "pointer",
            }}
          >
            Reset all
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: vert ? "row" : "column",
          gap: vert ? spacingTokens.sm : spacingTokens.xs,
          flexWrap: vert ? "wrap" : undefined,
        }}
      >
        {params.map((p) => {
          const v = values[p.id] ?? p.neutral ?? p.min;
          const inputId = `${id}-${p.id}`;
          const off = p.neutral != null && v !== p.neutral;
          return (
            <div
              key={p.id}
              style={
                vert
                  ? {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      width: 48,
                    }
                  : {
                      display: "grid",
                      gridTemplateColumns: "minmax(90px, 140px) 1fr 70px",
                      alignItems: "center",
                      gap: 8,
                    }
              }
            >
              {vert && (
                <output
                  htmlFor={inputId}
                  style={{
                    fontSize: 11,
                    fontFamily: "ui-monospace, Menlo, monospace",
                    color: off ? colorTokens.text.primary : colorTokens.text.secondary,
                  }}
                >
                  {fmt(p, v)}
                </output>
              )}
              {!vert && (
                <label htmlFor={inputId} style={{ fontSize: typographyTokens.fontSize.sm }}>
                  {p.label}
                </label>
              )}
              <input
                id={inputId}
                type="range"
                min={p.min}
                max={p.max}
                step={p.step ?? 1}
                value={v}
                disabled={bypassed}
                aria-label={vert ? p.label : undefined}
                aria-valuetext={fmt(p, v)}
                aria-orientation={vert ? "vertical" : undefined}
                onChange={(e) => onChange(p.id, Number(e.target.value))}
                onDoubleClick={() => onChange(p.id, p.neutral ?? p.min)}
                style={
                  vert
                    ? {
                        writingMode: "vertical-lr",
                        direction: "rtl",
                        width: 28,
                        height: 140,
                        accentColor: colorTokens.interactive.primary,
                      }
                    : { width: "100%", accentColor: colorTokens.interactive.primary, minHeight: 28 }
                }
              />
              {vert ? (
                <label
                  htmlFor={inputId}
                  aria-hidden="true"
                  style={{ fontSize: 11, textAlign: "center", color: colorTokens.text.secondary }}
                >
                  {p.label}
                </label>
              ) : (
                <output
                  htmlFor={inputId}
                  style={{
                    fontSize: typographyTokens.fontSize.sm,
                    fontFamily: "ui-monospace, Menlo, monospace",
                    textAlign: "right",
                    color: off ? colorTokens.text.primary : colorTokens.text.secondary,
                  }}
                >
                  {fmt(p, v)}
                </output>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ───────────────────────── EqFaders ───────────────────────── */

export const eqBandsHz = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

const hzLabel = (hz: number) => (hz >= 1000 ? `${hz / 1000}k` : String(hz));

export interface EqFadersProps {
  /** dB per band, keyed by Hz */
  gains: Record<string, number>;
  onChange: (hz: string, db: number) => void;
  bands?: number[];
  /** ± dB range @default 12 */
  range?: number;
  legend?: string;
  bypassed?: boolean;
  onBypassChange?: (b: boolean) => void;
}

/** Graphic EQ: one vertical fader per band, named "125 Hz", value "+3 dB". */
export function EqFaders({
  gains,
  onChange,
  bands = eqBandsHz,
  range = 12,
  legend = "Equaliser",
  bypassed,
  onBypassChange,
}: EqFadersProps) {
  return (
    <SliderBank
      legend={legend}
      orientation="vertical"
      bypassed={bypassed}
      onBypassChange={onBypassChange}
      params={bands.map((hz) => ({
        id: String(hz),
        label: `${hzLabel(hz)} Hz`,
        min: -range,
        max: range,
        step: 0.5,
        neutral: 0,
        unit: "dB",
      }))}
      values={gains}
      onChange={onChange}
    />
  );
}

/* ───────────────────────── ColorCorrectionSliders ───────────────────────── */

export const colorCorrectionParams: SliderParam[] = [
  { id: "exposure", label: "Exposure", min: -3, max: 3, step: 0.1, neutral: 0, unit: "stops" },
  { id: "contrast", label: "Contrast", min: -100, max: 100, neutral: 0 },
  { id: "saturation", label: "Saturation", min: 0, max: 200, neutral: 100, unit: "%" },
  {
    id: "temperature",
    label: "Temperature",
    min: 2500,
    max: 10000,
    step: 50,
    neutral: 5600,
    unit: "K",
  },
  {
    id: "tint",
    label: "Tint",
    min: -50,
    max: 50,
    neutral: 0,
    format: (v) => (v === 0 ? "Neutral" : v > 0 ? `${v} magenta` : `${-v} green`),
  },
  { id: "lift", label: "Shadows (lift)", min: -50, max: 50, neutral: 0 },
  { id: "gamma", label: "Midtones (gamma)", min: -50, max: 50, neutral: 0 },
  { id: "gain", label: "Highlights (gain)", min: -50, max: 50, neutral: 0 },
];

export interface ColorCorrectionSlidersProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  legend?: string;
}

/** Primary grade controls; tint is described as magenta/green, not a sign. */
export function ColorCorrectionSliders({
  values,
  onChange,
  legend = "Colour correction",
}: ColorCorrectionSlidersProps) {
  return (
    <SliderBank
      legend={legend}
      params={colorCorrectionParams}
      values={values}
      onChange={onChange}
    />
  );
}

/* ───────────────────────── EffectSliderBank ───────────────────────── */

export interface EffectSliderBankProps {
  effectName: string;
  params: SliderParam[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  bypassed?: boolean;
  onBypassChange?: (b: boolean) => void;
}

/** Parameters of one effect (e.g. Film grain: amount, size, softness). */
export function EffectSliderBank({ effectName, ...rest }: EffectSliderBankProps) {
  return <SliderBank legend={`${effectName} settings`} {...rest} />;
}
