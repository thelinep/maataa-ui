/**
 * @maataa/ui/data/DeviceInfoCard
 * What we detected about this device, to prefill settings
 */

import React, { useMemo } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface DeviceInfo {
  browser: string;
  os: string;
  screen: string;
  language: string;
  timeZone: string;
  reducedMotion: boolean;
  touch: boolean;
}

/** Reads the device's settings. Everything stays on the device. */
export function detectDevice(): DeviceInfo {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Unknown browser";
  const os = /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad/.test(ua)
      ? "iOS"
      : /Mac OS X/.test(ua)
        ? "macOS"
        : /Windows/.test(ua)
          ? "Windows"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown system";
  const w = typeof window === "undefined" ? undefined : window;
  return {
    browser,
    os,
    screen: w
      ? `${w.screen?.width ?? w.innerWidth} × ${w.screen?.height ?? w.innerHeight}`
      : "Unknown",
    language: typeof navigator === "undefined" ? "en" : navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    reducedMotion: !!w?.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    touch: !!w && ("ontouchstart" in w || (navigator.maxTouchPoints ?? 0) > 0),
  };
}

export interface DeviceInfoCardProps {
  /** Override detection (tests, stories) */
  info?: DeviceInfo;
  onUse?: (info: DeviceInfo) => void;
}

/**
 * DeviceInfoCard
 * Shows the detected settings and offers to use them. Says plainly that
 * nothing is sent anywhere.
 */
export function DeviceInfoCard({ info, onUse }: DeviceInfoCardProps) {
  const d = useMemo(() => info ?? detectDevice(), [info]);
  const rows: [string, string][] = [
    ["Browser", `${d.browser} on ${d.os}`],
    ["Screen", d.screen],
    ["Language", d.language],
    ["Time zone", d.timeZone],
    ["Motion", d.reducedMotion ? "Reduced (we'll keep animation off)" : "Standard"],
    ["Input", d.touch ? "Touch" : "Mouse and keyboard"],
  ];
  return (
    <section
      aria-label="This device"
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        background: colorTokens.background.secondary,
      }}
    >
      <h3 style={{ margin: `0 0 ${spacingTokens.sm}`, fontSize: typographyTokens.fontSize.lg }}>
        We detected this device
      </h3>
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: `${spacingTokens.xs} ${spacingTokens.md}`,
          margin: 0,
        }}
      >
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt style={{ color: colorTokens.text.secondary }}>{k}</dt>
            <dd style={{ margin: 0 }}>{v}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}>
        This is read from your browser and isn’t sent anywhere.
      </p>
      {onUse && (
        <Button variant="secondary" onClick={() => onUse(d)}>
          Use these settings
        </Button>
      )}
    </section>
  );
}
DeviceInfoCard.displayName = "DeviceInfoCard";
