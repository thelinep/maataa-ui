/**
 * @maataa/ui/forms/PinSelector
 * Choose one or several places, from a list or by coordinates
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Pin {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface PinSelectorProps {
  legend: string;
  /** Known places to choose from */
  places: Pin[];
  /** Selected pin ids */
  value: string[];
  onChange: (ids: string[]) => void;
  /** Allow several @default false */
  multiple?: boolean;
  /** Add a custom pin from typed coordinates */
  onAddPin?: (pin: Omit<Pin, "id">) => void;
  /** A map that reflects the selection (e.g. GeoMap); decorative here */
  map?: React.ReactNode;
}

/** Parses "19.0760, 72.8777" (also with spaces or °). */
export function parseLatLng(text: string): { lat: number; lng: number } | null {
  const m = text.replace(/°/g, "").match(/^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
}

/**
 * PinSelector
 * The list is the accessible way to choose; the map is a visual aid that
 * shows the same selection. A custom pin can be added by typing coordinates.
 */
export function PinSelector({
  legend,
  places,
  value,
  onChange,
  multiple = false,
  onAddPin,
  map,
}: PinSelectorProps) {
  const t = useT();
  const id = useId();
  const [coords, setCoords] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const toggle = (pid: string) =>
    onChange(
      multiple ? (value.includes(pid) ? value.filter((x) => x !== pid) : [...value, pid]) : [pid]
    );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: map ? "minmax(0, 1fr) minmax(0, 1fr)" : "1fr",
        gap: spacingTokens.md,
      }}
    >
      <fieldset
        style={{
          border: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.xs,
        }}
      >
        <legend style={{ fontWeight: 600, padding: 0, marginBottom: spacingTokens.xs }}>
          {legend}
          {multiple && (
            <>
              {" "}
              <span style={{ fontWeight: 400, color: colorTokens.text.secondary }}>
                {t("· {count} chosen", { count: value.length })}
              </span>
            </>
          )}
        </legend>
        {places.map((p) => (
          <label
            key={p.id}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "center",
              padding: "4px 0",
            }}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={`${id}-pin`}
              checked={value.includes(p.id)}
              onChange={() => toggle(p.id)}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            <span>
              {p.label}
              <span
                style={{
                  display: "block",
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
              </span>
            </span>
          </label>
        ))}
        {onAddPin && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacingTokens.xs,
              marginTop: spacingTokens.sm,
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {t("New place name")}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: 6,
                  border: `1px solid ${colorTokens.border.control}`,
                  borderRadius: 4,
                  font: "inherit",
                }}
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {t("Coordinates (latitude, longitude)")}
              <input
                value={coords}
                onChange={(e) => setCoords(e.target.value)}
                placeholder="19.0760, 72.8777"
                inputMode="decimal"
                aria-invalid={err ? true : undefined}
                aria-describedby={err ? `${id}-err` : undefined}
                style={{
                  padding: 6,
                  border: `1px solid ${err ? colorTokens.interactive.error : colorTokens.border.control}`,
                  borderRadius: 4,
                  font: "inherit",
                }}
              />
            </label>
            {err && (
              <span
                id={`${id}-err`}
                style={{
                  color: colorTokens.interactive.error,
                  fontSize: typographyTokens.fontSize.xs,
                }}
              >
                {err}
              </span>
            )}
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const c = parseLatLng(coords);
                  if (!name.trim()) return setErr("Name the place");
                  if (!c) return setErr("Enter coordinates like 19.0760, 72.8777");
                  setErr("");
                  onAddPin({ label: name.trim(), ...c });
                  setName("");
                  setCoords("");
                }}
              >
                {t("Add place")}
              </Button>
            </div>
          </div>
        )}
      </fieldset>
      {map && <div aria-hidden="true">{map}</div>}
    </div>
  );
}
PinSelector.displayName = "PinSelector";
