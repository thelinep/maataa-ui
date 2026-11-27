/**
 * @maataa/ui/data/MediaPlayback
 * Timecode helpers, TimecodeReadout, MediaScrubber, TimelinePlayhead,
 * AudioPlayer and Slate
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { spokenDuration } from "../status/Timer";

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/* ───────────────────────── Timecode ───────────────────────── */

/** Seconds → "HH:MM:SS:FF" (SMPTE, non-drop) */
export function formatTimecode(seconds: number, fps = 25): string {
  const s = Math.max(0, seconds);
  const totalFrames = Math.round(s * fps);
  const f = totalFrames % fps;
  const t = Math.floor(totalFrames / fps);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)}:${p(f)}`;
}

/** "HH:MM:SS:FF" → seconds (null if malformed) */
export function parseTimecode(tc: string, fps = 25): number | null {
  const m = /^(\d{1,2}):(\d{2}):(\d{2})[:;](\d{2})$/.exec(tc.trim());
  if (!m) return null;
  const [h, mi, s, f] = m.slice(1).map(Number) as [number, number, number, number];
  if (mi > 59 || s > 59 || f >= fps) return null;
  return h * 3600 + mi * 60 + s + f / fps;
}

/** Seconds → "1 hour 2 minutes 5 seconds" (for screen readers) */
const spokenSeconds = (seconds: number) => spokenDuration(Math.round(seconds) * 1000);

/** Seconds → "m:ss" or "h:mm:ss" */
export function clock(seconds: number): string {
  const t = Math.floor(Math.max(0, seconds));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export interface TimecodeReadoutProps {
  seconds: number;
  fps?: number;
  label?: string;
  size?: "sm" | "lg";
  /** Running timecodes should not be announced every frame @default false */
  live?: boolean;
}

/**
 * TimecodeReadout
 * Large monospaced SMPTE timecode. Visually HH:MM:SS:FF; for screen readers
 * hours/minutes/seconds and frames in words.
 */
export function TimecodeReadout({
  seconds,
  fps = 25,
  label: labelProp,
  size = "lg",
  live,
}: TimecodeReadoutProps) {
  const tx = useT();
  const label = labelProp ?? tx("Timecode");
  const tc = formatTimecode(seconds, fps);
  const frames = Number(tc.slice(-2));
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label} <span aria-hidden="true">{tx("· {fps} fps", { fps })}</span>
      </span>
      <span
        aria-live={live ? "off" : undefined}
        style={{
          fontFamily: mono,
          fontSize: size === "lg" ? 32 : 16,
          fontWeight: 700,
          letterSpacing: 1,
          padding: size === "lg" ? "4px 12px" : "2px 8px",
          borderRadius: 6,
          background: colorTokens.background.inverse,
          color: "#F5D547",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span aria-hidden="true">{tc}</span>
        <VisuallyHidden>
          {tx("{value}, frame {frames}", { value: spokenSeconds(Math.floor(seconds)), frames })}
        </VisuallyHidden>
      </span>
    </div>
  );
}

/* ───────────────────────── MediaScrubber ───────────────────────── */

export interface ScrubMarker {
  at: number;
  label: string;
}

export interface MediaScrubberProps {
  /** Seconds */
  value: number;
  duration: number;
  onChange: (seconds: number) => void;
  label?: string;
  /** Buffered up to (seconds) */
  buffered?: number;
  markers?: ScrubMarker[];
  /** Arrow-key step in seconds @default 5 */
  step?: number;
  /** Show SMPTE timecode instead of a clock */
  fps?: number;
}

/**
 * MediaScrubber
 * A native range input (so every AT understands it) styled as a timeline,
 * with aria-valuetext like "1 minute 5 seconds of 3 minutes". Markers are
 * also listed as buttons that jump to them.
 */
export function MediaScrubber({
  value,
  duration,
  onChange,
  label: labelProp,
  buffered,
  markers,
  step = 5,
  fps,
}: MediaScrubberProps) {
  const tx = useT();
  const label = labelProp ?? tx("Seek");
  const pct = (s: number) => `${(Math.min(duration, Math.max(0, s)) / (duration || 1)) * 100}%`;
  const fmt = (s: number) => (fps ? formatTimecode(s, fps) : clock(s));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 999,
            background: colorTokens.border.secondary,
            overflow: "hidden",
          }}
        >
          {buffered != null && (
            <span
              style={{
                position: "absolute",
                inset: 0,
                width: pct(buffered),
                background: colorTokens.border.primary,
              }}
            />
          )}
          <span
            style={{
              position: "absolute",
              inset: 0,
              width: pct(value),
              background: colorTokens.interactive.primary,
            }}
          />
        </div>
        {markers?.map((m) => (
          <span
            key={m.at + m.label}
            aria-hidden="true"
            title={m.label}
            style={{
              position: "absolute",
              left: pct(m.at),
              width: 3,
              height: 14,
              marginLeft: -1,
              background: colorTokens.interactive.error,
              borderRadius: 2,
            }}
          />
        ))}
        <input
          type="range"
          aria-label={label}
          min={0}
          max={duration}
          step={step}
          value={value}
          aria-valuetext={tx("{value} of {value2}", {
            value: spokenSeconds(value),
            value2: spokenSeconds(duration),
          })}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "relative",
            width: "100%",
            margin: 0,
            height: 28,
            background: "transparent",
            accentColor: colorTokens.interactive.primary,
            opacity: 0.9,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: mono,
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        <span>{fmt(value)}</span>
        <span>{fmt(duration)}</span>
      </div>
      {markers && markers.length > 0 && (
        <ul
          aria-label={tx("Markers")}
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {markers.map((m) => (
            <li key={m.at + m.label}>
              <button
                type="button"
                onClick={() => onChange(m.at)}
                style={{
                  minHeight: 32,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: `1px solid ${colorTokens.border.control}`,
                  background: colorTokens.background.primary,
                  color: colorTokens.text.primary,
                  font: "inherit",
                  fontSize: typographyTokens.fontSize.xs,
                  cursor: "pointer",
                }}
              >
                {m.label}{" "}
                <span style={{ fontFamily: mono, color: colorTokens.text.secondary }}>
                  {fmt(m.at)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────── TimelinePlayhead ───────────────────────── */

export interface TimelinePlayheadProps {
  /** Seconds */
  position: number;
  duration: number;
  onChange: (seconds: number) => void;
  fps?: number;
  /** Timeline track(s) drawn under the playhead */
  children?: React.ReactNode;
  height?: number;
  label?: string;
}

/**
 * TimelinePlayhead
 * A vertical playhead over a timeline. It is a slider: Left/Right move one
 * frame, Shift+Left/Right one second, Home/End to the ends; click or drag
 * the ruler to jump.
 */
export function TimelinePlayhead({
  position,
  duration,
  onChange,
  fps = 25,
  children,
  height = 96,
  label: labelProp,
}: TimelinePlayheadProps) {
  const tx = useT();
  const label = labelProp ?? tx("Playhead");
  const track = useRef<HTMLDivElement>(null);
  const clampT = (s: number) => Math.min(duration, Math.max(0, s));
  const fromX = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return clampT(((clientX - r.left) / r.width) * duration);
  };
  const drag = useRef(false);
  const left = `${(clampT(position) / (duration || 1)) * 100}%`;
  return (
    <div
      ref={track}
      onPointerDown={(e) => {
        drag.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        onChange(fromX(e.clientX));
      }}
      onPointerMove={(e) => drag.current && onChange(fromX(e.clientX))}
      onPointerUp={() => (drag.current = false)}
      style={{
        position: "relative",
        height,
        background: colorTokens.background.secondary,
        borderRadius: 6,
        cursor: "col-resize",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {children}
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={Math.round(position * 100) / 100}
        aria-valuetext={formatTimecode(position, fps)}
        onKeyDown={(e) => {
          const frame = 1 / fps;
          let n: number | null = null;
          if (e.key === "ArrowRight") n = position + (e.shiftKey ? 1 : frame);
          else if (e.key === "ArrowLeft") n = position - (e.shiftKey ? 1 : frame);
          else if (e.key === "PageUp") n = position + 10;
          else if (e.key === "PageDown") n = position - 10;
          else if (e.key === "Home") n = 0;
          else if (e.key === "End") n = duration;
          if (n === null) return;
          e.preventDefault();
          onChange(clampT(n));
        }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left,
          width: 24,
          marginLeft: -12,
          display: "flex",
          justifyContent: "center",
          outlineOffset: 2,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            width: 14,
            height: 12,
            background: colorTokens.interactive.error,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
        <span
          aria-hidden="true"
          style={{ width: 2, height: "100%", background: colorTokens.interactive.error }}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── AudioPlayer ───────────────────────── */

export interface AudioPlayerProps {
  src: string;
  title: string;
  /** e.g. "Sound mix v3 · 5.1 downmix" */
  subtitle?: string;
  /** Text transcript (WCAG 1.2.1) */
  transcript?: React.ReactNode;
}

/**
 * AudioPlayer
 * Custom controls on a hidden-UI <audio>: Play/Pause (name changes), −10 s
 * and +10 s, a seek slider, playback speed and volume — all native controls
 * with names. A transcript disclosure is offered when provided.
 */
export function AudioPlayer({ src, title, subtitle, transcript }: AudioPlayerProps) {
  const tx = useT();
  const id = useId();
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);
  const [rate, setRate] = useState(1);
  useEffect(() => {
    const a = ref.current;
    if (!a) return undefined;
    const on = () => setT(a.currentTime);
    const meta = () => setDur(a.duration || 0);
    const play = () => setPlaying(true);
    const pause = () => setPlaying(false);
    a.addEventListener("timeupdate", on);
    a.addEventListener("loadedmetadata", meta);
    a.addEventListener("play", play);
    a.addEventListener("pause", pause);
    return () => {
      a.removeEventListener("timeupdate", on);
      a.removeEventListener("loadedmetadata", meta);
      a.removeEventListener("play", play);
      a.removeEventListener("pause", pause);
    };
  }, []);
  const seek = (s: number) => {
    if (ref.current) ref.current.currentTime = Math.min(dur, Math.max(0, s));
    setT(s);
  };
  const btn: React.CSSProperties = {
    minWidth: 44,
    minHeight: 44,
    padding: "0 10px",
    borderRadius: 8,
    border: `1px solid ${colorTokens.border.control}`,
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
    font: "inherit",
    cursor: "pointer",
  };
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.md,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 12,
        background: colorTokens.background.primary,
      }}
    >
      <audio ref={ref} src={src} preload="metadata" />
      <div>
        <h3 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
          {title}
        </h3>
        {subtitle && (
          <div
            style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <MediaScrubber
        value={t}
        duration={dur}
        onChange={seek}
        label={tx("Seek {title}", { title })}
        step={1}
      />
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.xs, alignItems: "center" }}
      >
        <button type="button" style={btn} onClick={() => seek(t - 10)}>
          <span aria-hidden="true">↺ </span>
          {tx("Back 10 seconds")}
        </button>
        <button
          type="button"
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            if (a.paused) void a.play().catch(() => undefined);
            else a.pause();
            setPlaying(a.paused ? false : true);
          }}
          style={{
            ...btn,
            background: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
            border: 0,
            fontWeight: 700,
            minWidth: 90,
          }}
        >
          {playing ? tx("Pause") : tx("Play")}
        </button>
        <button type="button" style={btn} onClick={() => seek(t + 10)}>
          {tx("Forward 10 seconds")}
          <span aria-hidden="true"> ↻</span>
        </button>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {tx("Speed")}
          <select
            value={rate}
            onChange={(e) => {
              const r = Number(e.target.value);
              setRate(r);
              if (ref.current) ref.current.playbackRate = r;
            }}
            style={{ ...btn, minWidth: 0 }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
              <option key={r} value={r}>
                {r}×
              </option>
            ))}
          </select>
        </label>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {tx("Volume")}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={vol}
            aria-valuetext={`${Math.round(vol * 100)}%`}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVol(v);
              if (ref.current) ref.current.volume = v;
            }}
            style={{ accentColor: colorTokens.interactive.primary, width: 100 }}
          />
        </label>
      </div>
      {transcript && (
        <details>
          <summary
            style={{
              cursor: "pointer",
              minHeight: 32,
              display: "flex",
              alignItems: "center",
              color: colorTokens.interactive.primary,
            }}
          >
            {tx("Transcript")}
          </summary>
          <div style={{ padding: "8px 0", maxHeight: 240, overflow: "auto" }} tabIndex={0}>
            {transcript}
          </div>
        </details>
      )}
    </section>
  );
}

/* ───────────────────────── Slate ───────────────────────── */

export interface SlateProps {
  production: string;
  roll: string;
  scene: string;
  take: number;
  director?: string;
  camera?: string;
  date?: string;
  /** e.g. "MOS", "Night", "Sync" */
  flags?: string[];
  /** Flash the clapper (respects reduced motion) */
  clapKey?: number;
}

/**
 * Slate
 * Digital clapperboard for the start of a take. Rendered as a description
 * list, so it reads as "Scene 14C, Take 3" etc.
 */
export function Slate({
  production,
  roll,
  scene,
  take,
  director,
  camera,
  date,
  flags,
  clapKey,
}: SlateProps) {
  const tx = useT();
  const [flash, setFlash] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 180);
    return () => clearTimeout(t);
  }, [clapKey]);
  const cell = (label: string, value: React.ReactNode, big?: boolean) => (
    <div
      style={{
        borderRight: "2px solid #FFFFFF",
        borderBottom: "2px solid #FFFFFF",
        padding: "6px 10px",
      }}
    >
      <dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, opacity: 0.85 }}>
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontSize: big ? 40 : 18,
          fontWeight: 800,
          fontFamily: mono,
          lineHeight: 1.1,
        }}
      >
        {value}
      </dd>
    </div>
  );
  return (
    <figure
      aria-label={tx("Slate: scene {scene}, take {take}", { scene, take })}
      style={{
        margin: 0,
        maxWidth: 520,
        borderRadius: 8,
        overflow: "hidden",
        background: flash ? "#FFFFFF" : "#141414",
        color: "#FFFFFF",
        border: "3px solid #141414",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          height: 26,
          background: "repeating-linear-gradient(-45deg, #FFFFFF 0 18px, #141414 18px 36px)",
          transform: flash ? "rotate(0)" : "rotate(-4deg)",
          transformOrigin: "left bottom",
          transition: "transform 120ms",
        }}
      />
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: "2px solid #FFFFFF",
          borderLeft: "2px solid #FFFFFF",
          visibility: flash ? "hidden" : "visible",
        }}
      >
        <div
          style={{
            gridColumn: "1 / -1",
            borderRight: "2px solid #FFFFFF",
            borderBottom: "2px solid #FFFFFF",
            padding: "6px 10px",
          }}
        >
          <dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, opacity: 0.85 }}>
            {tx("Production")}
          </dt>
          <dd style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{production}</dd>
        </div>
        {cell("Roll", roll, true)}
        {cell("Scene", scene, true)}
        {cell("Take", take, true)}
        {director && cell("Director", director)}
        {camera && cell("Camera", camera)}
        {date && cell("Date", date)}
        {flags && flags.length > 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              borderRight: "2px solid #FFFFFF",
              borderBottom: "2px solid #FFFFFF",
              padding: "6px 10px",
            }}
          >
            <dt
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              {tx("Notes")}
            </dt>
            <dd style={{ margin: 0, display: "flex", gap: 8 }}>
              {flags.map((f) => (
                <span
                  key={f}
                  style={{
                    padding: "2px 10px",
                    borderRadius: 4,
                    background: "#F5D547",
                    color: "#141414",
                    fontWeight: 800,
                  }}
                >
                  {f}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </figure>
  );
}
