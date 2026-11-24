/**
 * @maataa/ui/surfaces/AccessibilityTools
 * ModeSwitch (screen-reader mode, simplified mode), VoiceCommandGuide,
 * EyeGazeCalibration, HapticFeedback and PictureBoard
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

/* ───────────────────────── ModeSwitch ───────────────────────── */

export interface ModeSwitchProps {
  label: string;
  /** What changes when on */
  description: React.ReactNode;
  checked: boolean;
  onChange: (on: boolean) => void;
}

/**
 * ModeSwitch
 * role=switch with a visible On/Off word and a description. Use for
 * ScreenReaderModeToggle and SimplifiedModeToggle (presets below).
 */
export function ModeSwitch({ label, description, checked, onChange }: ModeSwitchProps) {
  const t = useT();
  const id = React.useId();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: spacingTokens.md,
        padding: spacingTokens.md,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        background: colorTokens.background.primary,
      }}
    >
      <div style={{ flex: 1 }}>
        <div id={`${id}-l`} style={{ fontWeight: 600 }}>
          {label}
        </div>
        <div
          id={`${id}-d`}
          style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
        >
          {description}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        aria-describedby={`${id}-d`}
        onClick={() => onChange(!checked)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: 40,
          padding: "0 6px 0 12px",
          borderRadius: 999,
          border: `2px solid ${checked ? colorTokens.interactive.primary : colorTokens.border.control}`,
          background: checked ? colorTokens.interactive.primary : colorTokens.background.primary,
          color: checked ? colorTokens.text.inverse : colorTokens.text.primary,
          font: "inherit",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <span aria-hidden="true">{checked ? t("On") : t("Off")}</span>
        <span
          aria-hidden="true"
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            background: checked ? colorTokens.background.primary : colorTokens.border.control,
          }}
        />
      </button>
    </div>
  );
}

export function ScreenReaderModeToggle(props: Omit<ModeSwitchProps, "label" | "description">) {
  const t = useT();
  return (
    <ModeSwitch
      label={t("Screen-reader mode")}
      description={t(
        "Turns off animations and auto-advancing content, expands collapsed details, and adds text descriptions to charts and boards."
      )}
      {...props}
    />
  );
}

export function SimplifiedModeToggle(props: Omit<ModeSwitchProps, "label" | "description">) {
  const t = useT();
  return (
    <ModeSwitch
      label={t("Simplified mode")}
      description={t(
        "Shows one task at a time with larger buttons, plain words and fewer options. You can switch back at any time."
      )}
      {...props}
    />
  );
}

/* ───────────────────────── VoiceCommandGuide ───────────────────────── */

export interface VoiceCommand {
  /** What to say */
  phrase: string;
  /** What it does */
  action: string;
  /** Group, e.g. "Navigation" */
  group: string;
  /** Other ways to say it */
  alternatives?: string[];
}

export interface VoiceCommandGuideProps {
  commands: VoiceCommand[];
  /** Optional: speak a phrase aloud as an example */
  speakable?: boolean;
  title?: string;
}

/**
 * VoiceCommandGuide
 * Searchable reference of what to say, grouped with headings. "Hear it"
 * reads a phrase aloud using the browser's speech synthesis.
 */
export function VoiceCommandGuide({
  commands,
  speakable = true,
  title: titleProp,
}: VoiceCommandGuideProps) {
  const t = useT();
  const title = titleProp ?? t("Voice commands");
  const [q, setQ] = useState("");
  const shown = commands.filter((c) =>
    (c.phrase + c.action + (c.alternatives ?? []).join(" ")).toLowerCase().includes(q.toLowerCase())
  );
  const groups = Array.from(new Set(shown.map((c) => c.group)));
  const canSpeak = speakable && typeof window !== "undefined" && "speechSynthesis" in window;
  return (
    <section
      aria-label={title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{title}</h2>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: typographyTokens.fontSize.sm,
          maxWidth: 360,
        }}
      >
        {t("Find a command")}
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            minHeight: 40,
            padding: "0 10px",
            border: `2px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
          }}
        />
      </label>
      <p
        role="status"
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        {shown.length} {shown.length === 1 ? "command" : "commands"}
      </p>
      {groups.map((g) => (
        <section key={g} aria-label={g}>
          <h3 style={{ margin: "8px 0 4px", fontSize: typographyTokens.fontSize.md }}>{g}</h3>
          <dl
            style={{
              margin: 0,
              display: "grid",
              gridTemplateColumns: "minmax(140px, auto) 1fr",
              gap: "6px 16px",
            }}
          >
            {shown
              .filter((c) => c.group === g)
              .map((c) => (
                <React.Fragment key={c.phrase}>
                  <dt style={{ fontWeight: 700 }}>
                    “{c.phrase}”
                    {canSpeak && (
                      <button
                        type="button"
                        onClick={() =>
                          window.speechSynthesis.speak(new SpeechSynthesisUtterance(c.phrase))
                        }
                        style={{
                          marginLeft: 8,
                          minHeight: 28,
                          padding: "0 8px",
                          borderRadius: 6,
                          border: `1px solid ${colorTokens.border.control}`,
                          background: colorTokens.background.primary,
                          color: colorTokens.text.primary,
                          font: "inherit",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        {t("Hear it")}
                        <VisuallyHidden>: {c.phrase}</VisuallyHidden>
                      </button>
                    )}
                  </dt>
                  <dd style={{ margin: 0 }}>
                    {c.action}
                    {c.alternatives && c.alternatives.length > 0 && (
                      <span
                        style={{
                          display: "block",
                          fontSize: typographyTokens.fontSize.xs,
                          color: colorTokens.text.secondary,
                        }}
                      >
                        Also: {c.alternatives.map((a) => `“${a}”`).join(", ")}
                      </span>
                    )}
                  </dd>
                </React.Fragment>
              ))}
          </dl>
        </section>
      ))}
    </section>
  );
}

/* ───────────────────────── EyeGazeCalibration ───────────────────────── */

export interface CalibrationPoint {
  /** 0–1 across */
  x: number;
  /** 0–1 down */
  y: number;
}

export const nineCalibrationPoints: CalibrationPoint[] = [0.1, 0.5, 0.9].flatMap((y) =>
  [0.1, 0.5, 0.9].map((x) => ({ x, y }))
);

export interface EyeGazeCalibrationProps {
  /** Called when the user confirms each point (Space/Enter/click/dwell) */
  onPoint: (index: number, point: CalibrationPoint) => void;
  onComplete: () => void;
  onCancel?: () => void;
  points?: CalibrationPoint[];
  /** Hold time per point (ms) when using dwell @default 1500 */
  dwellMs?: number;
}

/**
 * EyeGazeCalibration
 * One target at a time: look at it until the ring fills (or press Space).
 * Progress "Point 3 of 9" is announced; Escape cancels. Large, high-contrast
 * targets; no motion other than the fill.
 */
export function EyeGazeCalibration({
  onPoint,
  onComplete,
  onCancel,
  points = nineCalibrationPoints,
  dwellMs = 1500,
}: EyeGazeCalibrationProps) {
  const t = useT();
  const [i, setI] = useState(0);
  const [fill, setFill] = useState(0);
  const [hovering, setHovering] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const p = points[i];
  const done = i >= points.length;
  const confirm = () => {
    if (!p) return;
    onPoint(i, p);
    setFill(0);
    setHovering(false);
    if (i + 1 >= points.length) onComplete();
    setI(i + 1);
  };
  useEffect(() => {
    box.current?.focus();
  }, []);
  useEffect(() => {
    if (!hovering || done) return undefined;
    const start = Date.now();
    const t = setInterval(() => {
      const f = (Date.now() - start) / dwellMs;
      if (f >= 1) {
        clearInterval(t);
        confirm();
      } else setFill(f);
    }, 50);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering, i, done]);
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div
      ref={box}
      tabIndex={-1}
      role="application"
      aria-roledescription="calibration"
      aria-label={t(
        "Eye-gaze calibration. Look at each target until it fills, or press Space. Escape cancels."
      )}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          confirm();
        } else if (e.key === "Escape") onCancel?.();
      }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#141414",
        borderRadius: 12,
        overflow: "hidden",
        outline: "none",
      }}
    >
      <p
        role="status"
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          right: 0,
          margin: 0,
          textAlign: "center",
          color: "#FFFFFF",
          fontSize: typographyTokens.fontSize.md,
        }}
      >
        {done ? "Calibration complete." : `Point ${i + 1} of ${points.length}`}
      </p>
      {p && !done && (
        <button
          type="button"
          onClick={confirm}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => {
            setHovering(false);
            setFill(0);
          }}
          style={{
            position: "absolute",
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: 0,
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="72" height="72" aria-hidden="true">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#5C5C5C" strokeWidth="6" />
            <circle
              cx="36"
              cy="36"
              r={r}
              fill="none"
              stroke="#F5D547"
              strokeWidth="6"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - fill)}
              transform="rotate(-90 36 36)"
            />
            <circle cx="36" cy="36" r="8" fill="#FFFFFF" />
          </svg>
          <VisuallyHidden>{t("Confirm point {value}", { value: i + 1 })}</VisuallyHidden>
        </button>
      )}
      {onCancel && !done && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            minHeight: 40,
            padding: "0 14px",
            borderRadius: 8,
            border: "1px solid #FFFFFF",
            background: "transparent",
            color: "#FFFFFF",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          {t("Cancel")}
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── HapticFeedback ───────────────────────── */

export const hapticPatterns = {
  tap: [20],
  success: [30, 60, 30],
  warning: [80, 80, 80],
  error: [200, 100, 200],
} as const;

export type HapticPattern = keyof typeof hapticPatterns;

/** Vibrate if supported and allowed; returns whether it ran */
export function vibrate(pattern: HapticPattern | number[]): boolean {
  const p = typeof pattern === "string" ? [...hapticPatterns[pattern]] : pattern;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      return navigator.vibrate(p);
    } catch {
      return false;
    }
  }
  return false;
}

export interface HapticFeedbackProps {
  enabled: boolean;
  onEnabledChange: (on: boolean) => void;
  /** Show the visual pulse that simulates the vibration @default true */
  visualPulse?: boolean;
}

/**
 * HapticFeedback
 * Settings + tester. Each pattern can be tried; devices without vibration
 * show a visual pulse with the same rhythm instead, and say so.
 */
export function HapticFeedback({
  enabled,
  onEnabledChange,
  visualPulse = true,
}: HapticFeedbackProps) {
  const t = useT();
  const [pulse, setPulse] = useState<{ on: boolean; key: number }>({ on: false, key: 0 });
  const [msg, setMsg] = useState("");
  const supported = typeof navigator !== "undefined" && "vibrate" in navigator;
  const play = (name: HapticPattern) => {
    const ran = enabled && vibrate(name);
    setMsg(
      ran
        ? t("Played {name}.", { name })
        : supported
          ? t("{name} shown as a visual pulse.", { name })
          : t("{name} shown as a visual pulse (this device can’t vibrate).", { name })
    );
    if (!visualPulse) return;
    const seq = [...hapticPatterns[name]];
    let at = 0;
    seq.forEach((d, n) => {
      setTimeout(() => setPulse((p) => ({ on: n % 2 === 0, key: p.key + 1 })), at);
      at += d;
    });
    setTimeout(() => setPulse((p) => ({ on: false, key: p.key + 1 })), at);
  };
  return (
    <section
      aria-label={t("Haptic feedback")}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <ModeSwitch
        label={t("Vibration feedback")}
        description={t("Short vibrations confirm taps, saves and errors.")}
        checked={enabled}
        onChange={onEnabledChange}
      />
      <div
        style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm, flexWrap: "wrap" }}
      >
        {(Object.keys(hapticPatterns) as HapticPattern[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => play(k)}
            style={{
              minHeight: 40,
              padding: "0 12px",
              borderRadius: 8,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            Try {k}
          </button>
        ))}
        {visualPulse && (
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: pulse.on ? colorTokens.interactive.primary : colorTokens.border.secondary,
              boxShadow: pulse.on ? `0 0 0 6px ${colorTokens.semantic.warning.bg}` : "none",
            }}
          />
        )}
      </div>
      {!supported && (
        <p
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
          }}
        >
          {t("This device can’t vibrate, so patterns are shown visually.")}
        </p>
      )}
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </section>
  );
}

/* ───────────────────────── PictureBoard ───────────────────────── */

export interface PictureSymbol {
  id: string;
  label: string;
  /** Emoji, image URL or node */
  symbol: React.ReactNode;
  category: string;
}

export interface PictureBoardProps {
  symbols: PictureSymbol[];
  /** Called with the sentence when "Speak" is pressed */
  onSpeak?: (sentence: string) => void;
  /** BCP-47 for speech @default 'en-IN' */
  lang?: string;
  title?: string;
}

/**
 * PictureBoard
 * Augmentative and alternative communication (AAC): pick symbols to build a
 * sentence, then Speak it aloud. Category tabs, very large targets, every
 * symbol labelled in words.
 */
export function PictureBoard({
  symbols,
  onSpeak,
  lang = "en-IN",
  title: titleProp,
}: PictureBoardProps) {
  const t = useT();
  const title = titleProp ?? t("Picture board");
  const cats = useMemo(() => Array.from(new Set(symbols.map((s) => s.category))), [symbols]);
  const [cat, setCat] = useState(cats[0] ?? "");
  const [sentence, setSentence] = useState<PictureSymbol[]>([]);
  const [msg, setMsg] = useState("");
  const text = sentence.map((s) => s.label).join(" ");
  const speak = () => {
    if (!text) return;
    onSpeak?.(text);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      window.speechSynthesis.speak(u);
    }
    setMsg(`Spoken: ${text}`);
  };
  const big: React.CSSProperties = {
    minHeight: 52,
    padding: "0 16px",
    borderRadius: 10,
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
  };
  return (
    <section
      aria-label={title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      <div
        style={{ display: "flex", gap: spacingTokens.sm, alignItems: "stretch", flexWrap: "wrap" }}
      >
        <div
          role="group"
          aria-label={t("Sentence: {value}", { value: text || "empty" })}
          style={{
            flex: 1,
            minHeight: 72,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            padding: 8,
            borderRadius: 12,
            border: `2px solid ${colorTokens.border.control}`,
            background: colorTokens.background.secondary,
          }}
        >
          {sentence.length === 0 && (
            <span style={{ color: colorTokens.text.secondary }}>
              {t("Choose pictures to build a sentence")}
            </span>
          )}
          {sentence.map((s, n) => (
            <button
              key={`${s.id}-${n}`}
              type="button"
              onClick={() => setSentence((x) => x.filter((_, k) => k !== n))}
              style={{
                ...big,
                minHeight: 48,
                padding: "0 10px",
                border: `1px solid ${colorTokens.border.primary}`,
                background: colorTokens.background.primary,
                color: colorTokens.text.primary,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 22 }}>
                {s.symbol}
              </span>
              <VisuallyHidden>{t("Remove")}</VisuallyHidden> {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={speak}
          disabled={!text}
          style={{
            ...big,
            border: 0,
            background: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
            minWidth: 110,
          }}
        >
          <span aria-hidden="true">🔊 </span>
          {t("Speak")}
        </button>
        <button
          type="button"
          onClick={() => setSentence((x) => x.slice(0, -1))}
          disabled={!sentence.length}
          style={{
            ...big,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
          }}
        >
          {t("Delete last")}
        </button>
        <button
          type="button"
          onClick={() => setSentence([])}
          disabled={!sentence.length}
          style={{
            ...big,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
          }}
        >
          {t("Clear")}
        </button>
      </div>
      <div
        role="group"
        aria-label={t("Categories")}
        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
      >
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={c === cat}
            onClick={() => setCat(c)}
            style={{
              ...big,
              minHeight: 44,
              border: `2px solid ${c === cat ? colorTokens.interactive.primary : colorTokens.border.control}`,
              background:
                c === cat ? colorTokens.background.tertiary : colorTokens.background.primary,
              color: colorTokens.text.primary,
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <ul
        aria-label={t("{cat} pictures", { cat })}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
          gap: spacingTokens.sm,
        }}
      >
        {symbols
          .filter((s) => s.category === cat)
          .map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setSentence((x) => [...x, s]);
                  setMsg(`Added ${s.label}`);
                }}
                style={{
                  ...big,
                  width: "100%",
                  minHeight: 112,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  border: `2px solid ${colorTokens.border.control}`,
                  background: colorTokens.background.primary,
                  color: colorTokens.text.primary,
                  fontSize: typographyTokens.fontSize.md,
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 40, lineHeight: 1 }}>
                  {s.symbol}
                </span>
                {s.label}
              </button>
            </li>
          ))}
      </ul>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </section>
  );
}
