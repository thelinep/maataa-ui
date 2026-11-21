/**
 * @maataa/ui/data/CultureComposites
 * ChakraCategoryRow, LanguageCulturalTimeline, AncestralChainFlow and
 * TLPClassificationCard
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

/* ───────────────────────── Chakras ───────────────────────── */

export type ChakraId = "root" | "sacral" | "solar" | "heart" | "throat" | "thirdEye" | "crown";

export const CHAKRAS: Record<
  ChakraId,
  { sanskrit: string; english: string; devanagari: string; color: string; theme: string }
> = {
  root: {
    sanskrit: "Muladhara",
    english: "Root",
    devanagari: "मूलाधार",
    color: "#B3261E",
    theme: "Grounding, survival, home",
  },
  sacral: {
    sanskrit: "Svadhisthana",
    english: "Sacral",
    devanagari: "स्वाधिष्ठान",
    color: "#C2570C",
    theme: "Desire, creativity, pleasure",
  },
  solar: {
    sanskrit: "Manipura",
    english: "Solar plexus",
    devanagari: "मणिपूर",
    color: "#9A7B00",
    theme: "Will, power, ambition",
  },
  heart: {
    sanskrit: "Anahata",
    english: "Heart",
    devanagari: "अनाहत",
    color: "#2D6A3E",
    theme: "Love, grief, compassion",
  },
  throat: {
    sanskrit: "Vishuddha",
    english: "Throat",
    devanagari: "विशुद्ध",
    color: "#1D5C8C",
    theme: "Truth, voice, expression",
  },
  thirdEye: {
    sanskrit: "Ajna",
    english: "Third eye",
    devanagari: "आज्ञा",
    color: "#3B3B8F",
    theme: "Insight, intuition, vision",
  },
  crown: {
    sanskrit: "Sahasrara",
    english: "Crown",
    devanagari: "सहस्रार",
    color: "#6A3D8F",
    theme: "Transcendence, the spiritual",
  },
};

export interface ChakraCategoryRowProps {
  chakra: ChakraId;
  /** What is filed here, e.g. "Family dramas" */
  category: string;
  count?: number;
  description?: string;
  onOpen?: () => void;
}

/**
 * ChakraCategoryRow
 * A content category aligned to a chakra. Colour is decorative; the chakra
 * is named in Sanskrit (with Devanagari, lang="sa") and English.
 */
export function ChakraCategoryRow({
  chakra,
  category,
  count,
  description,
  onOpen,
}: ChakraCategoryRowProps) {
  const c = CHAKRAS[chakra];
  const inner = (
    <>
      <span
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: c.color,
          color: "#FFFFFF",
          fontSize: 16,
        }}
      >
        ◉
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 700 }}>{category}</span>
        <span style={{ display: "block", fontSize: 12, color: colorTokens.text.secondary }}>
          {c.english} · {c.sanskrit} <span lang="sa">{c.devanagari}</span>
        </span>
        {description && (
          <span style={{ display: "block", fontSize: 12, color: colorTokens.text.secondary }}>
            {description}
          </span>
        )}
      </span>{" "}
      {count != null && (
        <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{count}</span>
      )}
    </>
  );
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: spacingTokens.sm,
    width: "100%",
    padding: "8px 12px",
    borderRadius: 10,
    background: colorTokens.background.primary,
    border: `1px solid ${colorTokens.border.primary}`,
    borderLeftWidth: 6,
    borderLeftColor: c.color,
    textAlign: "left",
    font: "inherit",
    color: colorTokens.text.primary,
  };
  return onOpen ? (
    <button type="button" onClick={onOpen} style={{ ...style, cursor: "pointer" }}>
      {inner}
    </button>
  ) : (
    <div style={style}>{inner}</div>
  );
}

/* ───────────────────────── LanguageCulturalTimeline ───────────────────────── */

export interface CulturalEra {
  /** e.g. "c. 1200 BCE" */
  period: string;
  title: string;
  description?: string;
  /** Sample text in the language */
  sample?: string;
  sampleLang?: string;
  /** Romanised sample */
  transliteration?: string;
}

/**
 * LanguageCulturalTimeline
 * A vertical timeline of a language's eras with samples marked with their
 * own lang attribute and a transliteration, so they are pronounced right.
 */
export function LanguageCulturalTimeline({
  language,
  eras,
}: {
  language: string;
  eras: CulturalEra[];
}) {
  return (
    <section aria-label={`${language} through time`}>
      <h3 style={{ margin: "0 0 8px", fontSize: typographyTokens.fontSize.lg }}>
        {language} through time
      </h3>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          borderLeft: `3px solid ${colorTokens.border.primary}`,
        }}
      >
        {eras.map((e) => (
          <li key={e.period + e.title} style={{ position: "relative", padding: "0 0 16px 20px" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -9,
                top: 4,
                width: 14,
                height: 14,
                borderRadius: 999,
                background: colorTokens.interactive.primary,
                border: `3px solid ${colorTokens.background.primary}`,
              }}
            />
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: colorTokens.interactive.primary,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {e.period}
            </div>
            <div style={{ fontWeight: 700 }}>{e.title}</div>
            {e.description && (
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: typographyTokens.fontSize.sm,
                  color: colorTokens.text.secondary,
                }}
              >
                {e.description}
              </p>
            )}
            {e.sample && (
              <blockquote
                style={{
                  margin: "6px 0 0",
                  padding: "6px 10px",
                  borderLeft: `3px solid ${colorTokens.border.secondary}`,
                  background: colorTokens.background.secondary,
                }}
              >
                <span
                  lang={e.sampleLang}
                  style={{ display: "block", fontSize: typographyTokens.fontSize.lg }}
                >
                  {e.sample}
                </span>
                {e.transliteration && (
                  <span
                    style={{
                      display: "block",
                      fontStyle: "italic",
                      fontSize: 12,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {e.transliteration}
                  </span>
                )}
              </blockquote>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────── AncestralChainFlow ───────────────────────── */

export interface Ancestor {
  id: string;
  name: string;
  /** e.g. "Guru", "Grandfather", "Gharana founder" */
  relation?: string;
  years?: string;
  note?: string;
}

/**
 * AncestralChainFlow
 * A lineage (guru–shishya parampara, family line, gharana) from earliest to
 * latest. An ordered list, drawn as a flowing chain with arrows.
 */
export function AncestralChainFlow({
  title,
  chain,
  direction = "vertical",
}: {
  title: string;
  chain: Ancestor[];
  direction?: "vertical" | "horizontal";
}) {
  const h = direction === "horizontal";
  return (
    <section aria-label={title}>
      <h3 style={{ margin: "0 0 8px", fontSize: typographyTokens.fontSize.lg }}>{title}</h3>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: h ? "row" : "column",
          alignItems: h ? "center" : "stretch",
          flexWrap: h ? "wrap" : undefined,
          gap: 0,
        }}
      >
        {chain.map((a, i) => (
          <li
            key={a.id}
            style={{ display: "flex", flexDirection: h ? "row" : "column", alignItems: "center" }}
          >
            <div
              style={{
                padding: "8px 14px",
                borderRadius: 12,
                border: `2px solid ${i === chain.length - 1 ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                background: colorTokens.background.primary,
                textAlign: "center",
                minWidth: 140,
              }}
            >
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              {(a.relation || a.years) && (
                <div style={{ fontSize: 12, color: colorTokens.text.secondary }}>
                  {[a.relation, a.years].filter(Boolean).join(" · ")}
                </div>
              )}
              {a.note && (
                <div style={{ fontSize: 11, color: colorTokens.text.secondary }}>{a.note}</div>
              )}
            </div>
            {i < chain.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  color: colorTokens.text.tertiary,
                  fontSize: 20,
                  padding: h ? "0 6px" : "2px 0",
                }}
              >
                {h ? "→" : "↓"}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────── TLPClassificationCard ───────────────────────── */

export type TLPLevel = "RED" | "AMBER+STRICT" | "AMBER" | "GREEN" | "CLEAR" | "WHITE";

const TLP: Record<TLPLevel, { color: string; who: string; detail: string }> = {
  RED: {
    color: "#FF2B2B",
    who: "For the named recipients only",
    detail: "Do not share beyond the people in the room or on the message.",
  },
  "AMBER+STRICT": {
    color: "#FFC000",
    who: "Your organisation only",
    detail: "Share only inside your own organisation.",
  },
  AMBER: {
    color: "#FFC000",
    who: "Your organisation and its clients",
    detail: "Share on a need-to-know basis within your organisation and its clients.",
  },
  GREEN: {
    color: "#33FF00",
    who: "Your community",
    detail: "Share within your community, but not publicly.",
  },
  CLEAR: { color: "#FFFFFF", who: "Anyone", detail: "No limit on sharing; subject to copyright." },
  WHITE: {
    color: "#FFFFFF",
    who: "Anyone (TLP:WHITE is now TLP:CLEAR)",
    detail: "No limit on sharing; subject to copyright.",
  },
};

/**
 * TLPClassificationCard
 * Traffic Light Protocol label in its standard colours on black (high
 * contrast), with who may see it written out. Never colour alone.
 */
export function TLPClassificationCard({
  level,
  title,
  owner,
  compact,
}: {
  level: TLPLevel;
  title?: string;
  owner?: string;
  compact?: boolean;
}) {
  const t = TLP[level];
  const label = (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: "#000000",
        color: t.color,
        fontFamily: "ui-monospace, Menlo, monospace",
        fontWeight: 800,
        letterSpacing: 0.5,
        borderRadius: 3,
      }}
    >
      TLP:{level}
    </span>
  );
  if (compact) return <span title={t.who}>{label}</span>;
  return (
    <section
      aria-label={`Classification TLP ${level}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: spacingTokens.md,
        borderRadius: 10,
        border: `2px solid #000000`,
        borderLeft: `10px solid ${t.color === "#FFFFFF" ? "#000000" : t.color}`,
        background: colorTokens.background.primary,
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {label}
        {title && <strong>{title}</strong>}
      </div>
      <p style={{ margin: 0, fontWeight: 700 }}>Who can see this: {t.who}</p>
      <p
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        {t.detail}
      </p>
      {owner && (
        <p style={{ margin: 0, fontSize: 12, color: colorTokens.text.secondary }}>
          Classified by {owner}
        </p>
      )}
    </section>
  );
}
