/**
 * @maataa/ui/forms/SignaturePad
 * Sign by drawing, or by typing your name (equally valid, needs no pointer)
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { controlStyle, smallButtonStyle } from "./fieldKit";

export type SignatureValue =
  | { kind: "drawn"; dataUrl: string; signedAt: string }
  | { kind: "typed"; name: string; signedAt: string }
  | null;

export interface SignaturePadProps {
  label: string;
  value: SignatureValue;
  onChange: (value: SignatureValue) => void;
  /** Statement the signer agrees to, shown above the pad */
  statement?: React.ReactNode;
  /** Start in typed mode @default 'draw' */
  defaultMode?: "draw" | "type";
  error?: string;
  width?: number;
  height?: number;
}

/**
 * SignaturePad
 * Two modes in a radio group: Draw and Type. The typed name is shown in a
 * script font and stored as text. The state ("Signed by drawing at 14:02")
 * is always in words.
 */
export function SignaturePad({
  label,
  value,
  onChange,
  statement,
  defaultMode = "draw",
  error,
  width = 400,
  height = 140,
}: SignaturePadProps) {
  const id = useId();
  const [mode, setMode] = useState<"draw" | "type">(
    value?.kind === "typed" ? "type" : value?.kind === "drawn" ? "draw" : defaultMode
  );
  const [name, setName] = useState(value?.kind === "typed" ? value.name : "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext?.("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colorTokens.text.primary;
  }, [mode]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * width,
      y: ((e.clientY - r.top) / r.height) * height,
    };
  };

  const clear = () => {
    const c = canvasRef.current;
    c?.getContext?.("2d")?.clearRect(0, 0, width, height);
    dirty.current = false;
    setName("");
    onChange(null);
  };

  const stamp = () => new Date().toISOString();
  const time = value
    ? new Date(value.signedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <fieldset
      style={{
        border: 0,
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <legend
        style={{
          fontWeight: 500,
          padding: 0,
          color: error ? colorTokens.interactive.error : colorTokens.text.primary,
        }}
      >
        {label}
      </legend>
      {statement && <div style={{ color: colorTokens.text.secondary }}>{statement}</div>}
      <div
        role="radiogroup"
        aria-label="How to sign"
        style={{ display: "flex", gap: spacingTokens.md }}
      >
        {(["draw", "type"] as const).map((m) => (
          <label key={m} style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 44 }}>
            <input
              type="radio"
              name={`${id}-mode`}
              checked={mode === m}
              onChange={() => {
                setMode(m);
                clear();
              }}
              style={{ accentColor: colorTokens.interactive.primary, width: 20, height: 20 }}
            />
            {m === "draw" ? "Draw signature" : "Type name"}
          </label>
        ))}
      </div>
      {mode === "draw" ? (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          role="img"
          aria-label={
            value?.kind === "drawn"
              ? "Signature drawn"
              : "Signature pad, empty. Draw with a finger, pen or mouse."
          }
          onPointerDown={(e) => {
            const ctx = e.currentTarget.getContext?.("2d");
            if (!ctx) return;
            drawing.current = true;
            e.currentTarget.setPointerCapture?.(e.pointerId);
            const p = pos(e);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = e.currentTarget.getContext?.("2d");
            if (!ctx) return;
            const p = pos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            dirty.current = true;
          }}
          onPointerUp={(e) => {
            drawing.current = false;
            if (dirty.current) {
              onChange({ kind: "drawn", dataUrl: e.currentTarget.toDataURL(), signedAt: stamp() });
            }
          }}
          style={{
            width: "100%",
            maxWidth: width,
            aspectRatio: `${width} / ${height}`,
            border: `2px dashed ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
            borderRadius: 6,
            background: colorTokens.background.primary,
            touchAction: "none",
            cursor: "crosshair",
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          <label htmlFor={`${id}-name`}>Full name</label>
          <input
            id={`${id}-name`}
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              const n = name.trim();
              if (n === (value?.kind === "typed" ? value.name : "")) return;
              onChange(n ? { kind: "typed", name: n, signedAt: stamp() } : null);
            }}
            aria-invalid={error ? true : undefined}
            style={{ ...controlStyle(!!error), maxWidth: width }}
          />
          {name.trim() && (
            <div
              aria-hidden="true"
              style={{
                fontFamily: '"Segoe Script", "Brush Script MT", cursive',
                fontSize: 32,
                color: colorTokens.text.primary,
                borderBottom: `1px solid ${colorTokens.border.control}`,
                maxWidth: width,
              }}
            >
              {name}
            </div>
          )}
        </div>
      )}
      <div
        style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center", flexWrap: "wrap" }}
      >
        <button type="button" onClick={clear} style={smallButtonStyle} disabled={!value}>
          Clear signature
        </button>
        <span
          role="status"
          style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
        >
          {value
            ? value.kind === "drawn"
              ? `Signed by drawing at ${time}.`
              : `Signed as ${value.name} at ${time}.`
            : "Not signed yet."}
        </span>
      </div>
      {error && (
        <span
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.xs }}
        >
          {error}
        </span>
      )}
    </fieldset>
  );
}
