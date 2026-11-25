/**
 * @maataa/ui/data/QrCode
 * Draws a QR code as SVG, with no dependencies
 */

import React, { useMemo } from "react";
import { useT } from "../i18n/LocaleProvider";
import { encodeQr, type QrErrorLevel } from "./qr";

export interface QrCodeProps {
  /** Text or link to encode */
  value: string;
  /** Size in CSS units. @default 128 */
  size?: number | string;
  /** How much damage it survives: L 7%, M 15%, Q 25%, H 30%. @default "M" */
  level?: QrErrorLevel;
  /** What it opens, for screen readers. @default "QR code: <value>" */
  label?: string;
  /** Module color. Keep it dark on light for scanners. @default "#000" */
  color?: string;
  /** @default "#fff" */
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * QrCode
 *
 * @example
 * ```tsx
 * <QrCode value="https://tlps.in/crew/VFS-0142" label="Crew profile link" />
 * ```
 */
export function QrCode({
  value,
  size = 128,
  level = "M",
  label,
  color = "#000",
  background = "#fff",
  className,
  style,
}: QrCodeProps) {
  const t = useT();
  const qr = useMemo(() => encodeQr(value, level), [value, level]);
  const quiet = 4;
  const total = qr.size + quiet * 2;
  const path = useMemo(() => {
    let d = "";
    qr.modules.forEach((row, y) =>
      row.forEach((dark, x) => {
        if (dark) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
      })
    );
    return d;
  }, [qr]);
  return (
    <svg
      role="img"
      aria-label={label ?? t("QR code: {value}", { value })}
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      style={style}
    >
      <rect width={total} height={total} fill={background} />
      <path d={path} fill={color} />
    </svg>
  );
}

QrCode.displayName = "QrCode";
