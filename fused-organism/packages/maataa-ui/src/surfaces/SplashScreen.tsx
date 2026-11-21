/**
 * @maataa/ui/surfaces/SplashScreen
 * Short cinematic opening, with a skip control and a still fallback
 */

import React, { useEffect, useRef } from "react";
import { BrandLogo } from "./BrandLogo";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SplashScreenProps {
  /** Called when it ends or is skipped */
  onDone: () => void;
  /** Total length in ms @default 2400 */
  duration?: number;
  tagline?: string;
  /** Force the still version; otherwise follows prefers-reduced-motion */
  reducedMotion?: boolean;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

const css = `@keyframes maataa-splash-in{0%{opacity:0;transform:scale(.92);letter-spacing:.2em}60%{opacity:1}100%{opacity:1;transform:scale(1);letter-spacing:0}}
@keyframes maataa-splash-bars{0%{transform:scaleY(1)}100%{transform:scaleY(0)}}`;

/**
 * SplashScreen
 * Letterbox bars open on the logo. Under reduced motion it shows a still
 * logo for a moment instead. Skip is a real button, focused first, and
 * Escape skips too. Never longer than a few seconds.
 *
 * @example
 * ```tsx
 * {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
 * ```
 */
export function SplashScreen({
  onDone,
  duration = 2400,
  tagline = "From first idea to final cut",
  reducedMotion,
}: SplashScreenProps) {
  const still = reducedMotion ?? prefersReducedMotion();
  const skipRef = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    doneRef.current();
  };
  useEffect(() => {
    skipRef.current?.focus();
    const t = setTimeout(finish, still ? Math.min(duration, 1200) : duration);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bar: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: "50%",
    background: "#000",
    transformOrigin: "top",
    animation: still ? undefined : `maataa-splash-bars ${duration * 0.4}ms ease-in forwards`,
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="maataa is starting"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "grid",
        placeItems: "center",
        background: "#14100B",
        color: colorTokens.text.inverse,
        overflow: "hidden",
      }}
    >
      <style>{css}</style>
      {!still && (
        <>
          <div aria-hidden="true" style={{ ...bar, top: 0 }} />
          <div aria-hidden="true" style={{ ...bar, bottom: 0, transformOrigin: "bottom" }} />
        </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacingTokens.md,
          animation: still ? undefined : `maataa-splash-in ${duration * 0.7}ms ease-out both`,
        }}
      >
        <BrandLogo size={64} tone="inverse" />
        <p style={{ margin: 0, fontSize: typographyTokens.fontSize.lg, opacity: 0.85 }}>
          {tagline}
        </p>
      </div>
      <button
        ref={skipRef}
        type="button"
        onClick={finish}
        style={{
          position: "absolute",
          right: spacingTokens.lg,
          bottom: spacingTokens.lg,
          minHeight: 40,
          padding: `0 ${spacingTokens.md}`,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.6)",
          background: "transparent",
          color: "#fff",
          font: "inherit",
          cursor: "pointer",
        }}
      >
        Skip intro
      </button>
    </div>
  );
}

SplashScreen.displayName = "SplashScreen";
