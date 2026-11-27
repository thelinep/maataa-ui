/**
 * @maataa/ui/surfaces/SplashVariants
 * ParticleSplash, GlassSplash and CameraScienceSplash — alternative intros
 * sharing SplashScreen's rules: Skip button focused, Escape skips, ends on
 * its own, and a still frame with reduced motion
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { BrandLogo } from "./BrandLogo";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export interface SplashVariantProps {
  onDone: () => void;
  /** ms @default 2800 */
  duration?: number;
  tagline?: string;
  reducedMotion?: boolean;
  /** Render inside its parent instead of covering the window (previews) */
  contained?: boolean;
}

function SplashFrame({
  onDone,
  duration = 2800,
  tagline = "From first idea to final cut",
  reducedMotion,
  contained,
  children,
  background,
  label,
}: SplashVariantProps & { children?: React.ReactNode; background: string; label: string }) {
  const t = useT();
  const still = reducedMotion ?? prefersReduced();
  const skip = useRef<HTMLButtonElement>(null);
  const done = useRef(false);
  const cb = useRef(onDone);
  cb.current = onDone;
  const finish = () => {
    if (done.current) return;
    done.current = true;
    cb.current();
  };
  useEffect(() => {
    skip.current?.focus({ preventScroll: true });
    const t = setTimeout(finish, still ? Math.min(duration, 1200) : duration);
    const k = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", k);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", k);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      role="dialog"
      aria-modal={contained ? undefined : true}
      aria-label={label}
      style={{
        position: contained ? "relative" : "fixed",
        inset: contained ? undefined : 0,
        height: contained ? 320 : undefined,
        zIndex: 2000,
        display: "grid",
        placeItems: "center",
        background,
        color: colorTokens.text.inverse,
        overflow: "hidden",
        borderRadius: contained ? 12 : 0,
      }}
    >
      {children}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacingTokens.md,
        }}
      >
        <BrandLogo size={64} tone="inverse" />
        <p style={{ margin: 0, fontSize: typographyTokens.fontSize.lg, opacity: 0.9 }}>{tagline}</p>
      </div>
      <button
        ref={skip}
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
          background: "rgba(0,0,0,0.25)",
          color: "#fff",
          font: "inherit",
          cursor: "pointer",
        }}
      >
        {t("Skip intro")}
      </button>
    </div>
  );
}

/* ───────────────────────── ParticleSplash ───────────────────────── */

/**
 * ParticleSplash
 * Dust-in-a-projector-beam particles drawn on canvas. Still: a fixed
 * scatter of motes.
 */
export function ParticleSplash(props: SplashVariantProps) {
  const t = useT();
  const canvas = useRef<HTMLCanvasElement>(null);
  const still = props.reducedMotion ?? prefersReduced();
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext?.("2d");
    if (!c || !ctx) return undefined;
    const W = (c.width = c.offsetWidth || 800);
    const H = (c.height = c.offsetHeight || 450);
    const parts = Array.from({ length: 140 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 2,
      vx: 0.2 + Math.random() * 0.6,
      vy: (Math.random() - 0.5) * 0.3,
      a: 0.2 + Math.random() * 0.7,
      s: i,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, H / 2, W, H / 2);
      g.addColorStop(0, "rgba(245,213,71,0.18)");
      g.addColorStop(1, "rgba(245,213,71,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, H / 2 - 20);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H / 2 + 20);
      ctx.fill();
      for (const p of parts) {
        ctx.fillStyle = `rgba(255,240,200,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    if (still) {
      draw();
      return undefined;
    }
    let raf = 0;
    const tick = () => {
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy + Math.sin((p.x + p.s) / 40) * 0.2;
        if (p.x > W) p.x = 0;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [still]);
  return (
    <SplashFrame
      {...props}
      label={t("maataa is starting")}
      background="radial-gradient(ellipse at 20% 50%, #3A2A1A, #0E0A06 70%)"
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </SplashFrame>
  );
}

/* ───────────────────────── GlassSplash ───────────────────────── */

/**
 * GlassSplash
 * Refracting glass: layered blurred light shapes behind a frosted lens that
 * slowly sweeps across (CSS only). Still: the lens at rest.
 */
export function GlassSplash(props: SplashVariantProps) {
  const t = useT();
  const still = props.reducedMotion ?? prefersReduced();
  const dur = props.duration ?? 2800;
  return (
    <SplashFrame {...props} label={t("maataa is starting")} background="#120E0A">
      <style>{`@keyframes maataa-glass { from { transform: translateX(-30%) rotate(-8deg); } to { transform: translateX(30%) rotate(8deg); } } @keyframes maataa-glow { 0%,100% { opacity: .55 } 50% { opacity: .95 } }`}</style>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        {[
          ["#F5D547", "25%", "30%", 220],
          ["#806641", "65%", "60%", 280],
          ["#1E3A5F", "45%", "75%", 200],
          ["#9A4A6B", "70%", "25%", 160],
        ].map(([c, l, t, s], i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: l as string,
              top: t as string,
              width: s as number,
              height: s as number,
              marginLeft: -(s as number) / 2,
              marginTop: -(s as number) / 2,
              borderRadius: "50%",
              background: c as string,
              filter: "blur(40px)",
              opacity: 0.7,
              animation: still
                ? undefined
                : `maataa-glow ${dur}ms ease-in-out ${i * 200}ms infinite`,
            }}
          />
        ))}
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 360,
            height: 360,
            marginLeft: -180,
            marginTop: -180,
            borderRadius: 48,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px) saturate(1.6)",
            WebkitBackdropFilter: "blur(18px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 30px 80px rgba(0,0,0,0.5)",
            animation: still ? undefined : `maataa-glass ${dur}ms cubic-bezier(.4,0,.2,1) both`,
          }}
        />
      </div>
    </SplashFrame>
  );
}

/* ───────────────────────── CameraScienceSplash ───────────────────────── */

/**
 * CameraScienceSplash
 * An iris diaphragm opens from f/22 to f/1.4 with focus-pull rings and
 * lens markings, then reveals the logo. Still: the open iris.
 */
export function CameraScienceSplash(props: SplashVariantProps) {
  const t = useT();
  const still = props.reducedMotion ?? prefersReduced();
  const dur = props.duration ?? 2800;
  const blades = 9;
  return (
    <SplashFrame {...props} label={t("maataa is starting")} background="#0B0B0D">
      <style>{`@keyframes maataa-iris { from { transform: rotate(0deg) scale(1); } to { transform: rotate(38deg) scale(1.9); } } @keyframes maataa-ring { from { transform: rotate(-60deg); } to { transform: rotate(0deg); } } @keyframes maataa-fade { from { opacity: 1 } to { opacity: 0 } }`}</style>
      <svg
        aria-hidden="true"
        viewBox="-200 -200 400 400"
        style={{
          position: "absolute",
          width: "min(90vw, 520px)",
          height: "min(90vw, 520px)",
          maxHeight: "100%",
        }}
      >
        <g
          style={{
            transformOrigin: "0 0",
            animation: still ? undefined : `maataa-ring ${dur * 0.8}ms ease-out both`,
          }}
        >
          <circle r="190" fill="none" stroke="#3A3A40" strokeWidth="14" />
          {["1.4", "2", "2.8", "4", "5.6", "8", "11", "16", "22"].map((f, i) => {
            const a = (-120 + i * 30) * (Math.PI / 180);
            return (
              <text
                key={f}
                x={Math.cos(a) * 168}
                y={Math.sin(a) * 168 + 4}
                textAnchor="middle"
                style={{
                  fontSize: 11,
                  fill: "#C9C9CF",
                  fontFamily: "ui-monospace, Menlo, monospace",
                }}
              >
                {f}
              </text>
            );
          })}
          <circle r="150" fill="none" stroke="#2A2A2F" strokeWidth="6" strokeDasharray="2 6" />
        </g>
        <g
          style={{
            transformOrigin: "0 0",
            animation: still
              ? "none"
              : `maataa-fade ${dur * 0.4}ms ease-in ${dur * 0.45}ms forwards`,
            opacity: still ? 0 : 1,
          }}
        >
          <g
            style={{
              transformOrigin: "0 0",
              animation: still
                ? undefined
                : `maataa-iris ${dur * 0.6}ms cubic-bezier(.5,0,.2,1) both`,
            }}
          >
            {Array.from({ length: blades }, (_, i) => (
              <path
                key={i}
                d="M0 0 L140 -30 A140 140 0 0 1 120 70 Z"
                transform={`rotate(${(360 / blades) * i})`}
                fill="#1C1C21"
                stroke="#4A4A52"
                strokeWidth="1.5"
              />
            ))}
          </g>
        </g>
      </svg>
    </SplashFrame>
  );
}
