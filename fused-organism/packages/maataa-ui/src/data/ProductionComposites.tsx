/**
 * @maataa/ui/data/ProductionComposites
 * ScriptAnalysisChart, CastingProfileCard, CallTimeBadge, SidesViewer,
 * WardrobeScheduleCard, PerDiemTable, WaiverSignatureBlock,
 * DeliverySpecCard and ApprovalFrameMarker
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { ChartFigure, LegendList, chartColor } from "./chartKit";
import { ScrollTable } from "./ScrollTable";
import { SignaturePad, type SignatureValue } from "../forms/SignaturePad";

const card: React.CSSProperties = {
  border: `1px solid ${colorTokens.border.primary}`,
  borderRadius: 12,
  background: colorTokens.background.primary,
  padding: spacingTokens.md,
  display: "flex",
  flexDirection: "column",
  gap: spacingTokens.xs,
  minWidth: 0,
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 999,
  background: bg,
  color: fg,
  fontSize: 12,
  fontWeight: 700,
});
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ───────────────────────── ScriptAnalysisChart ───────────────────────── */

export interface SceneStat {
  scene: string;
  /** Length in eighths of a page */
  eighths: number;
  intExt: "INT" | "EXT" | "INT/EXT";
  time: "DAY" | "NIGHT" | "DAWN" | "DUSK";
}

/** "1 3/8" pages from eighths */
export function pagesFromEighths(e: number): string {
  const whole = Math.floor(e / 8);
  const rest = e % 8;
  return `${whole || ""}${whole && rest ? " " : ""}${rest ? `${rest}/8` : ""}` || "0";
}

/**
 * ScriptAnalysisChart
 * Pacing (page length per scene) as bars coloured by day/night, plus INT/EXT
 * and day/night splits written as percentages.
 */
export function ScriptAnalysisChart({
  title: titleProp,
  scenes,
}: {
  title?: string;
  scenes: SceneStat[];
}) {
  const t = useT();
  const title = titleProp ?? t("Script pacing");
  const total = scenes.reduce((s, x) => s + x.eighths, 0) || 1;
  const pct = (f: (s: SceneStat) => boolean) =>
    Math.round((scenes.filter(f).reduce((s, x) => s + x.eighths, 0) / total) * 100);
  const night = pct((s) => s.time === "NIGHT" || s.time === "DUSK");
  const ext = pct((s) => s.intExt !== "INT");
  const longest = scenes.reduce((a, b) => (b.eighths > a.eighths ? b : a), scenes[0]!);
  const max = Math.max(...scenes.map((s) => s.eighths), 1);
  const W = 560;
  const H = 150;
  const bw = W / scenes.length;
  const col = (s: SceneStat) =>
    s.time === "NIGHT"
      ? chartColor(1)
      : s.time === "DUSK" || s.time === "DAWN"
        ? chartColor(4)
        : "#C9A100";
  return (
    <ChartFigure
      title={title}
      summary={`${scenes.length} scenes, ${pagesFromEighths(total)} pages. ${night}% night, ${ext}% exterior. Longest: scene ${longest.scene} (${pagesFromEighths(longest.eighths)} pages).`}
      table={{
        columns: ["Scene", "Pages", "INT/EXT", "Time"],
        rows: scenes.map((s) => [s.scene, pagesFromEighths(s.eighths), s.intExt, s.time]),
      }}
      footer={
        <LegendList
          items={[
            { label: msg("Day"), color: "#C9A100" },
            { label: msg("Dawn / dusk"), color: chartColor(4) },
            { label: msg("Night"), color: chartColor(1) },
          ]}
        />
      }
    >
      <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" aria-hidden="true">
        {scenes.map((s, i) => {
          const h = (s.eighths / max) * H;
          return (
            <g key={s.scene}>
              <rect x={i * bw + 1} y={H - h} width={Math.max(1, bw - 2)} height={h} fill={col(s)} />
              {s.intExt !== "INT" && (
                <rect
                  x={i * bw + 1}
                  y={H + 3}
                  width={Math.max(1, bw - 2)}
                  height={4}
                  fill={colorTokens.interactive.success}
                />
              )}
            </g>
          );
        })}
        <text x={0} y={H + 17} style={{ fontSize: 10, fill: colorTokens.text.secondary }}>
          {t("Green underline = exterior")}
        </text>
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── CastingProfileCard ───────────────────────── */

export interface CastingProfileCardProps {
  name: string;
  headshotSrc?: string;
  /** Playing age range */
  playingAge: string;
  languages: string[];
  skills?: string[];
  height?: string;
  agent?: string;
  /** Pipeline stage */
  stage?: "Applied" | "Shortlisted" | "Auditioned" | "Callback" | "Offered" | "Cast";
  showreelHref?: string;
  /** For this role */
  forRole?: string;
  actions?: React.ReactNode;
}

/** Actor profile for casting: playing age, languages, skills, stage in words. */
export function CastingProfileCard({
  name,
  headshotSrc,
  playingAge,
  languages,
  skills,
  height,
  agent,
  stage,
  showreelHref,
  forRole,
  actions,
}: CastingProfileCardProps) {
  const t = useT();
  return (
    <article style={{ ...card, flexDirection: "row", gap: spacingTokens.md }}>
      <div
        aria-hidden="true"
        style={{
          width: 96,
          aspectRatio: "4 / 5",
          borderRadius: 8,
          flexShrink: 0,
          background: headshotSrc
            ? `center / cover url(${headshotSrc})`
            : `linear-gradient(160deg, ${colorTokens.background.tertiary}, ${colorTokens.border.primary})`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{name}</h3>
          {stage && (
            <span
              style={pill(
                stage === "Cast"
                  ? colorTokens.semantic.success.bg
                  : colorTokens.background.tertiary,
                stage === "Cast" ? colorTokens.semantic.success.text : colorTokens.text.primary
              )}
            >
              {stage}
            </span>
          )}
        </div>
        {forRole && (
          <div
            style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
          >
            For: {forRole}
          </div>
        )}
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "2px 10px",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <dt style={{ color: colorTokens.text.secondary }}>{t("Playing age")}</dt>
          <dd style={{ margin: 0 }}>{playingAge}</dd>
          <dt style={{ color: colorTokens.text.secondary }}>{t("Languages")}</dt>
          <dd style={{ margin: 0 }}>{languages.join(", ")}</dd>
          {height && (
            <>
              <dt style={{ color: colorTokens.text.secondary }}>{t("Height")}</dt>
              <dd style={{ margin: 0 }}>{height}</dd>
            </>
          )}
          {agent && (
            <>
              <dt style={{ color: colorTokens.text.secondary }}>{t("Agent")}</dt>
              <dd style={{ margin: 0 }}>{agent}</dd>
            </>
          )}
        </dl>
        {skills && skills.length > 0 && (
          <ul
            aria-label={t("Skills")}
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {skills.map((s) => (
              <li
                key={s}
                style={{
                  fontSize: 12,
                  padding: "1px 8px",
                  borderRadius: 999,
                  border: `1px solid ${colorTokens.border.primary}`,
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          {showreelHref && (
            <a
              href={showreelHref}
              style={{ color: colorTokens.interactive.primary, fontWeight: 600 }}
            >
              {t("Showreel")}
              <VisuallyHidden>: {name}</VisuallyHidden>
            </a>
          )}
          {actions}
        </div>
      </div>
    </article>
  );
}

/* ───────────────────────── CallTimeBadge ───────────────────────── */

export interface CallTimeBadgeProps {
  /** "05:30" */
  time: string;
  /** e.g. "Crew call", "Pick-up", "Hair & make-up" */
  label?: string;
  /** Changed since last version */
  changedFrom?: string;
  size?: "sm" | "lg";
}

/** A call time with its kind; a change from the previous call is shown and said. */
export function CallTimeBadge({
  time,
  label: labelProp,
  changedFrom,
  size = "sm",
}: CallTimeBadgeProps) {
  const t = useT();
  const label = labelProp ?? t("Call");
  const big = size === "lg";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        borderRadius: 8,
        overflow: "hidden",
        border: `2px solid ${changedFrom ? colorTokens.interactive.error : colorTokens.text.primary}`,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          padding: big ? "6px 10px" : "2px 8px",
          background: colorTokens.text.primary,
          color: colorTokens.text.inverse,
          fontSize: big ? 13 : 11,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        {label}
      </span>
      <span
        style={{
          padding: big ? "4px 12px" : "2px 8px",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: big ? 26 : 14,
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {time}
        {changedFrom && (
          <span
            style={{
              fontSize: big ? 12 : 10,
              color: colorTokens.interactive.error,
              fontFamily: "inherit",
            }}
          >
            <span aria-hidden="true">was </span>
            <s aria-hidden="true">{changedFrom}</s>
            <VisuallyHidden>{t("changed from {changedFrom}", { changedFrom })}</VisuallyHidden>
          </span>
        )}
      </span>
    </span>
  );
}

/* ───────────────────────── SidesViewer ───────────────────────── */

export type SideLine = {
  kind: "heading" | "action" | "character" | "dialogue" | "parenthetical" | "transition";
  text: string;
};

export interface SidesViewerProps {
  title: string;
  /** Scenes in these sides */
  scenes: { number: string; lines: SideLine[] }[];
  /** Highlight this character's lines */
  highlight?: string;
}

/**
 * SidesViewer
 * Today's pages in screenplay layout, one scene per section with a heading.
 * The chosen character's dialogue is highlighted and marked "your line".
 * Text size can be enlarged in place.
 */
export function SidesViewer({ title, scenes, highlight }: SidesViewerProps) {
  const t = useT();
  const [zoom, setZoom] = useState(1);
  const mono = "'Courier Prime', 'Courier New', ui-monospace, monospace";
  return (
    <section aria-label={title} style={{ ...card, padding: 0, overflow: "hidden" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: colorTokens.background.secondary,
          borderBottom: `1px solid ${colorTokens.border.secondary}`,
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{title}</h3>
        <div role="group" aria-label={t("Text size")} style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(1)))}
            style={{
              minWidth: 36,
              minHeight: 36,
              borderRadius: 6,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              cursor: "pointer",
              font: "inherit",
            }}
          >
            A− <VisuallyHidden>{t("smaller text")}</VisuallyHidden>
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}
            style={{
              minWidth: 36,
              minHeight: 36,
              borderRadius: 6,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              cursor: "pointer",
              font: "inherit",
            }}
          >
            A+ <VisuallyHidden>{t("larger text")}</VisuallyHidden>
          </button>
        </div>
      </header>
      <div
        tabIndex={0}
        style={{
          padding: "16px 24px",
          maxHeight: 420,
          overflow: "auto",
          fontFamily: mono,
          fontSize: `${zoom}em`,
          lineHeight: 1.45,
          background: "#FFFEFA",
        }}
      >
        {scenes.map((sc) => (
          <section
            key={sc.number}
            aria-label={t("Scene {number}", { number: sc.number })}
            style={{ marginBottom: 24 }}
          >
            {sc.lines.map((l, i) => {
              const mine =
                highlight &&
                l.kind === "dialogue" &&
                sc.lines[i - 1]?.kind === "character" &&
                sc.lines[i - 1]!.text.toUpperCase().startsWith(highlight.toUpperCase());
              const mineParen =
                highlight &&
                l.kind === "dialogue" &&
                sc.lines[i - 1]?.kind === "parenthetical" &&
                sc.lines[i - 2]?.text.toUpperCase().startsWith(highlight.toUpperCase());
              const s: Record<SideLine["kind"], React.CSSProperties> = {
                heading: { fontWeight: 700, textTransform: "uppercase", margin: "0 0 12px" },
                action: { margin: "0 0 12px" },
                character: { margin: "0 0 0 37%", textTransform: "uppercase" },
                parenthetical: { margin: "0 0 0 30%" },
                dialogue: { margin: "0 18% 12px 22%" },
                transition: { margin: "0 0 12px", textAlign: "right", textTransform: "uppercase" },
              };
              if (l.kind === "heading")
                return (
                  <h4 key={i} style={{ ...s.heading, fontSize: "1em", fontFamily: mono }}>
                    {sc.number}. {t(l.text)}
                  </h4>
                );
              return (
                <p
                  key={i}
                  style={{
                    ...s[l.kind],
                    background: mine || mineParen ? "#FFF1A8" : undefined,
                    padding: mine || mineParen ? "2px 4px" : undefined,
                  }}
                >
                  {(mine || mineParen) && <VisuallyHidden>{t("Your line:")} </VisuallyHidden>}
                  {t(l.text)}
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── WardrobeScheduleCard ───────────────────────── */

export interface WardrobeChange {
  /** e.g. "Change 3" */
  id: string;
  scenes: string[];
  description: string;
  status: "ready" | "fitting" | "alteration" | "missing";
}

const WARDROBE_STATUS: Record<WardrobeChange["status"], { label: string; bg: string; fg: string }> =
  {
    ready: {
      label: msg("Ready"),
      bg: colorTokens.semantic.success.bg,
      fg: colorTokens.semantic.success.text,
    },
    fitting: {
      label: msg("Fitting booked"),
      bg: colorTokens.semantic.info.bg,
      fg: colorTokens.semantic.info.text,
    },
    alteration: {
      label: msg("Needs alteration"),
      bg: colorTokens.semantic.warning.bg,
      fg: colorTokens.semantic.warning.text,
    },
    missing: {
      label: msg("Missing"),
      bg: colorTokens.semantic.error.bg,
      fg: colorTokens.semantic.error.text,
    },
  };

/** One character's costume changes with scenes and readiness in words. */
export function WardrobeScheduleCard({
  character,
  actor,
  changes,
  fittingAt,
}: {
  character: string;
  actor: string;
  changes: WardrobeChange[];
  fittingAt?: string;
}) {
  const t = useT();
  return (
    <article style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{character}</h3>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {fittingAt
          ? t("Played by {actor} · Next fitting {fittingAt}", { actor, fittingAt })
          : t("Played by {actor}", { actor })}
      </div>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {changes.map((c) => {
          const st = WARDROBE_STATUS[c.status];
          return (
            <li
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 8,
                alignItems: "baseline",
                padding: "6px 0",
                borderTop: `1px solid ${colorTokens.border.tertiary}`,
              }}
            >
              <strong>{c.id}</strong>
              <span>
                {t(c.description)}
                <span style={{ display: "block", fontSize: 12, color: colorTokens.text.secondary }}>
                  {t("Scenes {value}", { value: c.scenes.join(", ") })}
                </span>
              </span>
              <span style={pill(st.bg, st.fg)}>{t(st.label)}</span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

/* ───────────────────────── PerDiemTable ───────────────────────── */

export interface PerDiemRow {
  id: string;
  name: string;
  role: string;
  days: number;
  /** Daily allowance in ₹ */
  rate: number;
  /** Already paid in ₹ */
  paid?: number;
}

/** Per-diem per person with totals and balance due; numbers right-aligned. */
export function PerDiemTable({ rows, label: labelProp }: { rows: PerDiemRow[]; label?: string }) {
  const t = useT();
  const label = labelProp ?? t("Per diems");
  const total = rows.reduce((s, r) => s + r.days * r.rate, 0);
  const paid = rows.reduce((s, r) => s + (r.paid ?? 0), 0);
  const th: React.CSSProperties = {
    padding: "8px 10px",
    textAlign: "left",
    borderBottom: `2px solid ${colorTokens.border.primary}`,
    background: colorTokens.background.secondary,
  };
  const td: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
  };
  const num: React.CSSProperties = {
    ...td,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <ScrollTable label={label}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 560,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <thead>
          <tr>
            <th scope="col" style={th}>
              {t("Name")}
            </th>
            <th scope="col" style={th}>
              {t("Role")}
            </th>
            <th scope="col" style={{ ...th, textAlign: "right" }}>
              {t("Days")}
            </th>
            <th scope="col" style={{ ...th, textAlign: "right" }}>
              {t("Rate")}
            </th>
            <th scope="col" style={{ ...th, textAlign: "right" }}>
              {t("Total")}
            </th>
            <th scope="col" style={{ ...th, textAlign: "right" }}>
              {t("Balance due")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const t = r.days * r.rate;
            const due = t - (r.paid ?? 0);
            return (
              <tr key={r.id}>
                <th scope="row" style={{ ...td, fontWeight: 500 }}>
                  {r.name}
                </th>
                <td style={td}>{r.role}</td>
                <td style={num}>{r.days}</td>
                <td style={num}>{inr(r.rate)}</td>
                <td style={num}>{inr(t)}</td>
                <td
                  style={{
                    ...num,
                    color:
                      due > 0 ? colorTokens.interactive.error : colorTokens.interactive.success,
                    fontWeight: 600,
                  }}
                >
                  {due > 0 ? inr(due) : "Paid"}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={4} style={{ ...td, textAlign: "right" }}>
              {t("Total")}
            </th>
            <td style={{ ...num, fontWeight: 700 }}>{inr(total)}</td>
            <td style={{ ...num, fontWeight: 700 }}>{inr(total - paid)}</td>
          </tr>
        </tfoot>
      </table>
    </ScrollTable>
  );
}

/* ───────────────────────── WaiverSignatureBlock ───────────────────────── */

export interface WaiverSignatureBlockProps {
  title: string;
  /** The terms; shown in a scrollable, focusable region */
  terms: React.ReactNode;
  signerName: string;
  value: SignatureValue;
  onChange: (v: SignatureValue) => void;
  /** Guardian signature needed (for a minor) */
  guardianRequired?: boolean;
  guardianValue?: SignatureValue;
  onGuardianChange?: (v: SignatureValue) => void;
  onSubmit: () => void;
}

/**
 * WaiverSignatureBlock
 * Terms, a required "I have read and agree" checkbox, then signature (draw or
 * type). Submit stays enabled; missing steps are explained on submit.
 */
export function WaiverSignatureBlock({
  title,
  terms,
  signerName,
  value,
  onChange,
  guardianRequired,
  guardianValue,
  onGuardianChange,
  onSubmit,
}: WaiverSignatureBlockProps) {
  const t = useT();
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const id = React.useId();
  const submit = () => {
    const e: string[] = [];
    if (!agreed) e.push("Tick “I have read and agree”.");
    if (!value) e.push(`${signerName} needs to sign.`);
    if (guardianRequired && !guardianValue) e.push("A parent or guardian needs to sign.");
    setErrors(e);
    if (!e.length) onSubmit();
    else requestAnimationFrame(() => document.getElementById(`${id}-err`)?.focus());
  };
  return (
    <section aria-labelledby={`${id}-t`} style={{ ...card, gap: spacingTokens.md }}>
      <h3 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        {title}
      </h3>
      {errors.length > 0 && (
        <div
          id={`${id}-err`}
          tabIndex={-1}
          role="alert"
          style={{
            padding: spacingTokens.sm,
            borderRadius: 8,
            background: colorTokens.semantic.error.bg,
            color: colorTokens.semantic.error.text,
          }}
        >
          <strong>{t("Before you submit:")}</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      <div
        role="region"
        aria-label={t("Terms")}
        tabIndex={0}
        style={{
          maxHeight: 160,
          overflow: "auto",
          padding: spacingTokens.sm,
          border: `1px solid ${colorTokens.border.secondary}`,
          borderRadius: 8,
          background: colorTokens.background.secondary,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        {terms}
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "center", minHeight: 36 }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ width: 20, height: 20, accentColor: colorTokens.interactive.primary }}
        />
        {t("I have read and agree")}
      </label>
      <SignaturePad
        label={t("Signature of {signerName}", { signerName })}
        value={value}
        onChange={onChange}
      />
      {guardianRequired && onGuardianChange && (
        <SignaturePad
          label={t("Signature of parent or guardian")}
          value={guardianValue ?? null}
          onChange={onGuardianChange}
        />
      )}
      <div>
        <button
          type="button"
          onClick={submit}
          style={{
            minHeight: 48,
            padding: "0 20px",
            borderRadius: 10,
            border: 0,
            background: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
            font: "inherit",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {t("Submit signed form")}
        </button>
      </div>
    </section>
  );
}

/* ───────────────────────── DeliverySpecCard ───────────────────────── */

export interface DeliverySpec {
  label: string;
  value: string;
  /** Meets spec (true), fails (false), or not checked (undefined) */
  ok?: boolean;
}

/** A deliverable's technical spec (DCP, IMF, broadcast) with QC result per line. */
export function DeliverySpecCard({
  name,
  recipient,
  due,
  specs,
}: {
  name: string;
  recipient: string;
  due?: string;
  specs: DeliverySpec[];
}) {
  const t = useT();
  const fails = specs.filter((s) => s.ok === false).length;
  return (
    <article style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{name}</h3>
        <span
          style={
            fails
              ? pill(colorTokens.semantic.error.bg, colorTokens.semantic.error.text)
              : pill(colorTokens.semantic.success.bg, colorTokens.semantic.success.text)
          }
        >
          {fails ? `${fails} failing` : "Meets spec"}
        </span>
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {due
          ? t("For {recipient} · Due {due}", { recipient, due })
          : t("For {recipient}", { recipient })}
      </div>
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "4px 12px",
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        {specs.map((s) => (
          <React.Fragment key={t(s.label)}>
            <dt style={{ color: colorTokens.text.secondary }}>{t(s.label)}</dt>
            <dd style={{ margin: 0, fontFamily: "ui-monospace, Menlo, monospace" }}>{s.value}</dd>
            <dd
              style={{
                margin: 0,
                color:
                  s.ok === false
                    ? colorTokens.interactive.error
                    : s.ok
                      ? colorTokens.interactive.success
                      : colorTokens.text.tertiary,
                fontWeight: 700,
              }}
            >
              {s.ok === undefined ? "Not checked" : s.ok ? "✓ Pass" : "✕ Fail"}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </article>
  );
}

/* ───────────────────────── ApprovalFrameMarker ───────────────────────── */

export interface ApprovalFrameMarkerProps {
  /** Thumbnail of the frame */
  src?: string;
  /** Timecode or frame number */
  at: string;
  status: "approved" | "changes" | "pending";
  reviewer?: string;
  note?: string;
  onOpen?: () => void;
}

const FRAME_STATUS = {
  approved: {
    label: msg("Approved"),
    sym: "✓",
    bg: colorTokens.semantic.success.bg,
    fg: colorTokens.semantic.success.text,
  },
  changes: {
    label: msg("Changes requested"),
    sym: "!",
    bg: colorTokens.semantic.warning.bg,
    fg: colorTokens.semantic.warning.text,
  },
  pending: {
    label: msg("Awaiting review"),
    sym: "…",
    bg: colorTokens.background.tertiary,
    fg: colorTokens.text.primary,
  },
};

/** A frame thumbnail with its review status as a corner badge and in words. */
export function ApprovalFrameMarker({
  src,
  at,
  status,
  reviewer,
  note,
  onOpen,
}: ApprovalFrameMarkerProps) {
  const t = useT();
  const s = FRAME_STATUS[status];
  const body = (
    <>
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          display: "block",
          aspectRatio: "16 / 9",
          borderRadius: 6,
          background: src
            ? `center / cover url(${src})`
            : `linear-gradient(135deg, #2B1F14, ${colorTokens.interactive.primary})`,
          outline: `3px solid ${s.fg}`,
          outlineOffset: -3,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 24,
            height: 24,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: s.bg,
            color: s.fg,
            fontWeight: 800,
          }}
        >
          {s.sym}
        </span>
      </span>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 6,
          marginTop: 4,
          fontSize: 12,
        }}
      >
        <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{at}</span>
        <span style={{ fontWeight: 700, color: s.fg }}>{t(s.label)}</span>
      </span>
      {(reviewer || note) && (
        <span style={{ display: "block", fontSize: 12, color: colorTokens.text.secondary }}>
          {reviewer && `${reviewer}: `}
          {note}
        </span>
      )}
    </>
  );
  return onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      style={{
        display: "block",
        width: 200,
        padding: 0,
        border: 0,
        background: "transparent",
        textAlign: "left",
        font: "inherit",
        color: colorTokens.text.primary,
        cursor: "pointer",
      }}
    >
      <VisuallyHidden>
        {`Frame ${at}, ${t(s.label)}${reviewer ? ` by ${reviewer}` : ""}${note ? `: ${note}` : ""}`}
      </VisuallyHidden>
      <span aria-hidden="true">{body}</span>
    </button>
  ) : (
    <figure
      style={{ margin: 0, width: 200 }}
      aria-label={t("Frame {at}, {label}", { at, label: s.label })}
    >
      {body}
    </figure>
  );
}
