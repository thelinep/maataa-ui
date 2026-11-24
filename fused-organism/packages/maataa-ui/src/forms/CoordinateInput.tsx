/**
 * @maataa/ui/forms/CoordinateInput
 * Latitude/longitude entry: type, paste "lat, lng", or use this device's location
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle, smallButtonStyle } from "./fieldKit";
import { parseLatLng } from "./PinSelector";

export interface Coordinates {
  lat: number;
  lng: number;
  /** Accuracy in metres, when it came from GPS */
  accuracy?: number;
}

export interface CoordinateInputProps {
  label: string;
  value: Coordinates | null;
  onChange: (value: Coordinates | null) => void;
  hint?: React.ReactNode;
  error?: string;
  /** Offer "Use my location" @default true */
  allowGeolocation?: boolean;
  /** Decimal places kept @default 6 */
  precision?: number;
}

/** 28.6139, 77.209 → "28.6139° N, 77.2090° E" */
export function formatCoordinates(c: Coordinates, digits = 4): string {
  const ns = c.lat >= 0 ? "N" : "S";
  const ew = c.lng >= 0 ? "E" : "W";
  return `${Math.abs(c.lat).toFixed(digits)}° ${ns}, ${Math.abs(c.lng).toFixed(digits)}° ${ew}`;
}

/**
 * CoordinateInput
 * Two labelled number fields. Pasting "28.61, 77.20" into either fills both.
 * Geolocation errors are explained in words, never silent.
 */
export function CoordinateInput({
  label,
  value,
  onChange,
  hint,
  error,
  allowGeolocation = true,
  precision = 6,
}: CoordinateInputProps) {
  const t = useT();
  const [lat, setLat] = useState(value ? String(value.lat) : "");
  const [lng, setLng] = useState(value ? String(value.lng) : "");
  const [own, setOwn] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const msg = error ?? own ?? undefined;
  const f = 10 ** precision;
  const round = (n: number) => Math.round(n * f) / f;

  const commit = (la: string, ln: string) => {
    if (!la.trim() && !ln.trim()) {
      setOwn(null);
      onChange(null);
      return;
    }
    const a = Number(la);
    const b = Number(ln);
    if (!Number.isFinite(a) || Math.abs(a) > 90) {
      setOwn("Latitude must be a number from -90 to 90");
      return;
    }
    if (!Number.isFinite(b) || Math.abs(b) > 180) {
      setOwn("Longitude must be a number from -180 to 180");
      return;
    }
    setOwn(null);
    onChange({ lat: round(a), lng: round(b) });
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const p = parseLatLng(e.clipboardData.getData("text"));
    if (p) {
      e.preventDefault();
      setLat(String(round(p.lat)));
      setLng(String(round(p.lng)));
      commit(String(p.lat), String(p.lng));
      setStatus("Pasted latitude and longitude.");
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus("This device can’t share its location. Type the coordinates instead.");
      return;
    }
    setStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = {
          lat: round(pos.coords.latitude),
          lng: round(pos.coords.longitude),
          accuracy: Math.round(pos.coords.accuracy),
        };
        setLat(String(c.lat));
        setLng(String(c.lng));
        setOwn(null);
        onChange(c);
        setStatus(
          t("Location found, accurate to about {accuracy} metres.", { accuracy: c.accuracy })
        );
      },
      (err) => {
        setStatus(
          err.code === 1
            ? t(
                "Location permission was refused. Allow it in your browser settings, or type the coordinates."
              )
            : t("Couldn’t get a location fix. Try again outdoors, or type the coordinates.")
        );
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const num: React.CSSProperties = { ...controlStyle(!!msg), width: "11em" };
  return (
    <FieldFrame label={label} hint={hint} error={msg} group>
      {(ids) => (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          <div
            style={{ display: "flex", gap: spacingTokens.sm, flexWrap: "wrap", alignItems: "end" }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {t("Latitude")}
              <input
                id={ids.id}
                inputMode="decimal"
                value={lat}
                placeholder="28.6139"
                onChange={(e) => setLat(e.target.value)}
                onBlur={() => commit(lat, lng)}
                onPaste={onPaste}
                aria-invalid={msg ? true : undefined}
                aria-describedby={ids.describedBy}
                style={num}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {t("Longitude")}
              <input
                inputMode="decimal"
                value={lng}
                placeholder="77.2090"
                onChange={(e) => setLng(e.target.value)}
                onBlur={() => commit(lat, lng)}
                onPaste={onPaste}
                aria-invalid={msg ? true : undefined}
                aria-describedby={ids.describedBy}
                style={num}
              />
            </label>
            {allowGeolocation && (
              <button type="button" style={smallButtonStyle} onClick={locate}>
                {t("Use my location")}
              </button>
            )}
          </div>
          {value && (
            <span
              style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
            >
              {formatCoordinates(value)}
              {value.accuracy != null && ` (±${value.accuracy} m)`}
            </span>
          )}
          <span role="status" style={{ fontSize: typographyTokens.fontSize.sm }}>
            {status}
          </span>
        </div>
      )}
    </FieldFrame>
  );
}
