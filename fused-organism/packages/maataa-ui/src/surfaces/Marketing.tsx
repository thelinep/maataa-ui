/**
 * @maataa/ui/surfaces/Marketing
 * Hero, FeatureGrid/FeatureCard, TestimonialCard, TestimonialCarousel,
 * LogoStrip, StatsStrip, PricingCardRow, PricingTable, FAQAccordion,
 * AnnouncementStrip and CookieConsentBanner
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useId, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { PricingTierCard, type PricingTierCardProps } from "./Containers";

const btn = (primary: boolean, onDark = false): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  minHeight: 48,
  padding: "0 22px",
  borderRadius: 10,
  border: primary ? 0 : `2px solid ${onDark ? "#FFFFFF" : colorTokens.interactive.primary}`,
  background: primary ? (onDark ? "#F5D547" : colorTokens.interactive.primary) : "transparent",
  color: primary
    ? onDark
      ? colorTokens.text.primary
      : colorTokens.text.inverse
    : onDark
      ? "#FFFFFF"
      : colorTokens.interactive.primary,
  fontWeight: 700,
  textDecoration: "none",
  font: "inherit",
  cursor: "pointer",
});

/* ───────────────────────── Hero ───────────────────────── */

export interface HeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroProps {
  title: string;
  subtitle?: React.ReactNode;
  eyebrow?: string;
  primary?: HeroAction;
  secondary?: HeroAction;
  /** "full" = text over image; "split" = image beside text; "plain" = text only */
  variant?: "full" | "split" | "plain";
  imageSrc?: string;
  /** Alt text for split images; full-bleed images are decorative */
  imageAlt?: string;
}

function Action({ a, primary, onDark }: { a: HeroAction; primary: boolean; onDark?: boolean }) {
  return a.href ? (
    <a href={a.href} style={btn(primary, onDark)}>
      {a.label}
    </a>
  ) : (
    <button type="button" onClick={a.onClick} style={btn(primary, onDark)}>
      {a.label}
    </button>
  );
}

/**
 * Hero
 * One h1 per page. In the full-bleed variant a dark scrim keeps text at 4.5:1
 * whatever the photo; the image itself is decorative.
 */
export function Hero({
  title,
  subtitle,
  eyebrow,
  primary,
  secondary,
  variant = "full",
  imageSrc,
  imageAlt = "",
}: HeroProps) {
  const full = variant === "full";
  const text = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.md,
        maxWidth: 640,
        position: "relative",
      }}
    >
      {eyebrow && (
        <p
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize.sm,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: full ? "#F5D547" : colorTokens.interactive.primary,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          lineHeight: 1.1,
          color: full ? "#FFFFFF" : colorTokens.text.primary,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <div
          style={{
            fontSize: typographyTokens.fontSize.lg,
            color: full ? "rgba(255,255,255,0.92)" : colorTokens.text.secondary,
          }}
        >
          {subtitle}
        </div>
      )}
      {(primary || secondary) && (
        <div
          style={{
            display: "flex",
            gap: spacingTokens.sm,
            flexWrap: "wrap",
            marginTop: spacingTokens.xs,
          }}
        >
          {primary && <Action a={primary} primary onDark={full} />}
          {secondary && <Action a={secondary} primary={false} onDark={full} />}
        </div>
      )}
    </div>
  );
  if (variant === "split") {
    return (
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: spacingTokens.xl,
          alignItems: "center",
          padding: `${spacingTokens.xl} 0`,
        }}
      >
        {text}
        <div
          style={{
            aspectRatio: "4 / 3",
            borderRadius: 16,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${colorTokens.background.tertiary}, ${colorTokens.border.primary})`,
          }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      </section>
    );
  }
  return (
    <section
      style={{
        position: "relative",
        minHeight: full ? 440 : undefined,
        display: "flex",
        alignItems: "flex-end",
        padding: full ? "clamp(24px, 6vw, 72px)" : `${spacingTokens.xl} 0`,
        borderRadius: full ? 16 : 0,
        overflow: "hidden",
        background: full
          ? `#2B1F14 ${imageSrc ? `center / cover url(${imageSrc})` : ""}`
          : undefined,
      }}
    >
      {full && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,14,8,0.88) 10%, rgba(20,14,8,0.55) 55%, rgba(20,14,8,0.25))",
          }}
        />
      )}
      {text}
    </section>
  );
}

/* ───────────────────────── Features ───────────────────────── */

export interface Feature {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  points?: string[];
  href?: string;
}

/** Feature card: icon, heading, text and an optional bullet list. */
export function FeatureCard({
  title,
  description,
  icon,
  points,
  href,
  level = 3,
}: Feature & { level?: 2 | 3 | 4 }) {
  const H = `h${level}` as "h3";
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.lg,
        borderRadius: 14,
        border: `1px solid ${colorTokens.border.primary}`,
        background: colorTokens.background.primary,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {icon && (
        <span
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            fontSize: 24,
            background: colorTokens.background.tertiary,
          }}
        >
          {icon}
        </span>
      )}
      <H style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        {href ? (
          <a href={href} style={{ color: colorTokens.text.primary }}>
            {title}
          </a>
        ) : (
          title
        )}
      </H>
      <div style={{ color: colorTokens.text.secondary }}>{description}</div>
      {points && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {points.map((p) => (
            <li key={p} style={{ display: "flex", gap: 8 }}>
              <span
                aria-hidden="true"
                style={{ color: colorTokens.interactive.success, fontWeight: 800 }}
              >
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** 3×2 (responsive) grid of FeatureCards with an optional section heading. */
export function FeatureGrid({
  title,
  intro,
  features,
  columns = 3,
}: {
  title?: string;
  intro?: React.ReactNode;
  features: Feature[];
  columns?: 2 | 3 | 4;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={title ? id : undefined}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.lg }}
    >
      {title && (
        <h2
          id={id}
          style={{ margin: 0, fontSize: typographyTokens.fontSize["2xl"], textAlign: "center" }}
        >
          {title}
        </h2>
      )}
      {intro && (
        <div
          style={{
            textAlign: "center",
            color: colorTokens.text.secondary,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          {intro}
        </div>
      )}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${columns === 4 ? 200 : columns === 2 ? 320 : 240}px), 1fr))`,
          gap: spacingTokens.md,
        }}
      >
        {features.map((f) => (
          <li key={f.title}>
            <FeatureCard {...f} level={title ? 3 : 2} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  photoSrc?: string;
  /** 1–5 */
  rating?: number;
}

/** Quote in a blockquote with the attribution in a figcaption. */
export function TestimonialCard({ quote, name, role, photoSrc, rating }: Testimonial) {
  const t = useT();
  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.lg,
        borderRadius: 14,
        background: colorTokens.background.secondary,
        border: `1px solid ${colorTokens.border.secondary}`,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {rating != null && (
        <span style={{ color: "#C9A100", letterSpacing: 2 }}>
          <span aria-hidden="true">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </span>
          <VisuallyHidden>{t("Rated {rating} out of 5", { rating })}</VisuallyHidden>
        </span>
      )}
      <blockquote
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.lg,
          lineHeight: 1.5,
          color: colorTokens.text.primary,
        }}
      >
        “{quote}”
      </blockquote>
      <figcaption style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
        <span
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            background: photoSrc
              ? `center / cover url(${photoSrc})`
              : colorTokens.background.tertiary,
          }}
        >
          {photoSrc ? "" : name[0]}
        </span>
        <span>
          <strong style={{ display: "block" }}>{name}</strong>
          {role && (
            <span
              style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
            >
              {role}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * TestimonialCarousel
 * APG carousel: Previous/Next buttons, slide picker, "2 of 5" in words. It
 * does not auto-rotate unless asked, and then has a Pause button and stops on
 * hover/focus and with reduced motion.
 */
export function TestimonialCarousel({
  label: labelProp,
  items,
  autoRotateMs,
}: {
  label?: string;
  items: Testimonial[];
  autoRotateMs?: number;
}) {
  const t = useT();
  const label = labelProp ?? t("What people say");
  const id = useId();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!!autoRotateMs);
  const [hover, setHover] = useState(false);
  const reduce =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!autoRotateMs || !playing || hover || reduce) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), autoRotateMs);
    return () => clearInterval(t);
  }, [autoRotateMs, playing, hover, reduce, items.length]);
  const go = (n: number) => setI((n + items.length) % items.length);
  const b: React.CSSProperties = {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 999,
    border: `1px solid ${colorTokens.border.control}`,
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
    font: "inherit",
    cursor: "pointer",
    padding: "0 12px",
  };
  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {autoRotateMs && (
          <button type="button" style={b} onClick={() => setPlaying((p) => !p)}>
            {playing ? t("Pause") : t("Play")} <VisuallyHidden>rotation</VisuallyHidden>
          </button>
        )}
        <button type="button" style={b} aria-controls={id} onClick={() => go(i - 1)}>
          <span aria-hidden="true">‹ </span>
          {t("Previous")}
        </button>
        <button type="button" style={b} aria-controls={id} onClick={() => go(i + 1)}>
          Next<span aria-hidden="true"> ›</span>
        </button>
        <span
          style={{
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
            marginLeft: 6,
          }}
        >
          {i + 1} of {items.length}
        </span>
      </div>
      <div id={id} aria-live={playing && !hover ? "off" : "polite"}>
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={t("{value} of {count}", { value: i + 1, count: items.length })}
        >
          <TestimonialCard {...items[i]!} />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── LogoStrip / StatsStrip ───────────────────────── */

export function LogoStrip({
  label: labelProp,
  logos,
}: {
  label?: string;
  logos: { name: string; src?: string }[];
}) {
  const t = useT();
  const label = labelProp ?? t("Trusted by");
  return (
    <section
      aria-label={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacingTokens.sm,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: colorTokens.text.secondary,
        }}
      >
        {label}
      </h2>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px 40px",
        }}
      >
        {logos.map((l) => (
          <li key={l.name}>
            {l.src ? (
              <img
                src={l.src}
                alt={l.name}
                style={{ height: 32, filter: "grayscale(1)", opacity: 0.8 }}
              />
            ) : (
              <span
                style={{
                  fontWeight: 800,
                  fontSize: typographyTokens.fontSize.lg,
                  color: colorTokens.text.tertiary,
                  letterSpacing: 1,
                }}
              >
                {l.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function StatsStrip({
  stats,
  label: labelProp,
}: {
  stats: { value: string; label: string }[];
  label?: string;
}) {
  const t = useT();
  const label = labelProp ?? t("In numbers");
  return (
    <section aria-label={label}>
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
          gap: spacingTokens.md,
          padding: spacingTokens.lg,
          borderRadius: 16,
          background: colorTokens.background.inverse,
          color: colorTokens.text.inverse,
          textAlign: "center",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column-reverse" }}>
            <dt style={{ fontSize: typographyTokens.fontSize.sm, opacity: 0.85 }}>{s.label}</dt>
            <dd
              style={{
                margin: 0,
                fontSize: typographyTokens.fontSize["3xl"],
                fontWeight: 800,
                color: "#F5D547",
              }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ───────────────────────── Pricing ───────────────────────── */

/** A row of PricingTierCards with a monthly/yearly switch. */
export function PricingCardRow({
  tiers,
  billing,
  onBillingChange,
}: {
  tiers: PricingTierCardProps[];
  billing?: "monthly" | "yearly";
  onBillingChange?: (b: "monthly" | "yearly") => void;
}) {
  const t = useT();
  const id = useId();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.md,
        alignItems: "center",
      }}
    >
      {onBillingChange && (
        <fieldset
          style={{
            border: 0,
            padding: 4,
            margin: 0,
            display: "inline-flex",
            gap: 4,
            borderRadius: 999,
            background: colorTokens.background.tertiary,
          }}
        >
          <legend
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            {t("Billing")}
          </legend>
          {(["monthly", "yearly"] as const).map((b) => (
            <label
              key={b}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 999,
                background: billing === b ? colorTokens.background.primary : "transparent",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name={id}
                checked={billing === b}
                onChange={() => onBillingChange(b)}
                style={{ accentColor: colorTokens.interactive.primary }}
              />
              {b === "monthly" ? t("Monthly") : t("Yearly (2 months free)")}
            </label>
          ))}
        </fieldset>
      )}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: spacingTokens.md,
          alignItems: "stretch",
        }}
      >
        {tiers.map((t) => (
          <li key={t.name} style={{ display: "flex", flexDirection: "column" }}>
            <PricingTierCard {...t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface PricingTableProps {
  plans: {
    name: string;
    price: string;
    period?: string;
    ctaLabel: string;
    onSelect: () => void;
    highlighted?: boolean;
  }[];
  /** Feature rows: values per plan (true/false/text) */
  rows: { feature: string; group?: string; values: (boolean | string)[] }[];
  caption?: string;
}

/**
 * PricingTable
 * Full plan comparison as a real table with a caption, column headers per
 * plan and row headers per feature; ✓/– always with "Included" words.
 */
export function PricingTable({ plans, rows, caption = "Compare plans" }: PricingTableProps) {
  const t = useT();
  const th: React.CSSProperties = {
    padding: "10px 12px",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
    textAlign: "left",
  };
  let lastGroup: string | undefined;
  return (
    <div role="region" aria-label={caption} tabIndex={0} style={{ overflowX: "auto" }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%", minWidth: 200 + plans.length * 150 }}
      >
        <caption
          style={{
            textAlign: "left",
            fontWeight: 700,
            fontSize: typographyTokens.fontSize.lg,
            paddingBottom: 8,
          }}
        >
          {caption}
        </caption>
        <thead>
          <tr>
            <td style={th} />
            {plans.map((p) => (
              <th
                key={p.name}
                scope="col"
                style={{
                  ...th,
                  textAlign: "center",
                  background: p.highlighted ? colorTokens.background.tertiary : undefined,
                  borderTop: p.highlighted
                    ? `4px solid ${colorTokens.interactive.primary}`
                    : undefined,
                }}
              >
                <span style={{ display: "block", fontSize: typographyTokens.fontSize.lg }}>
                  {p.name}
                </span>{" "}
                <span
                  style={{
                    display: "block",
                    fontSize: typographyTokens.fontSize.xl,
                    fontWeight: 800,
                  }}
                >
                  {p.price}
                </span>{" "}
                {p.period && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 400,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {p.period}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const header = r.group && r.group !== lastGroup;
            lastGroup = r.group;
            return (
              <React.Fragment key={r.feature}>
                {header && (
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={plans.length + 1}
                      style={{
                        ...th,
                        background: colorTokens.background.secondary,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {r.group}
                    </th>
                  </tr>
                )}
                <tr>
                  <th scope="row" style={{ ...th, fontWeight: 500 }}>
                    {r.feature}
                  </th>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      style={{
                        ...th,
                        textAlign: "center",
                        background: plans[i]?.highlighted ? "rgba(245,237,228,0.5)" : undefined,
                      }}
                    >
                      {v === true ? (
                        <span style={{ color: colorTokens.interactive.success, fontWeight: 800 }}>
                          <span aria-hidden="true">✓</span>
                          <VisuallyHidden>{t("Included")}</VisuallyHidden>
                        </span>
                      ) : v === false ? (
                        <span style={{ color: colorTokens.text.tertiary }}>
                          <span aria-hidden="true">–</span>
                          <VisuallyHidden>{t("Not included")}</VisuallyHidden>
                        </span>
                      ) : (
                        v
                      )}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ padding: 12 }} />
            {plans.map((p) => (
              <td key={p.name} style={{ padding: 12, textAlign: "center" }}>
                <button
                  type="button"
                  onClick={p.onSelect}
                  style={{ ...btn(!!p.highlighted), minHeight: 44, padding: "0 16px" }}
                >
                  {p.ctaLabel}
                  <VisuallyHidden>: {p.name}</VisuallyHidden>
                </button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ───────────────────────── FAQAccordion ───────────────────────── */

/**
 * FAQAccordion
 * Native details/summary per question inside a headed section: works with
 * no JavaScript, find-in-page opens matches, and "Expand all" is offered.
 */
export function FAQAccordion({
  title: titleProp,
  items,
}: {
  title?: string;
  items: { q: string; a: React.ReactNode }[];
}) {
  const t = useT();
  const title = titleProp ?? t("Frequently asked questions");
  const id = useId();
  const [all, setAll] = useState<boolean | null>(null);
  return (
    <section
      aria-labelledby={id}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h2 id={id} style={{ margin: 0, fontSize: typographyTokens.fontSize["2xl"] }}>
          {title}
        </h2>
        <button
          type="button"
          onClick={() => setAll((a) => !a)}
          style={{
            minHeight: 36,
            border: 0,
            background: "transparent",
            color: colorTokens.interactive.primary,
            textDecoration: "underline",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          {all ? t("Collapse all") : t("Expand all")}
        </button>
      </div>
      {items.map((it) => (
        <details
          key={it.q + String(all)}
          open={all ?? false}
          style={{
            borderRadius: 10,
            border: `1px solid ${colorTokens.border.primary}`,
            background: colorTokens.background.primary,
          }}
        >
          <summary
            style={{ cursor: "pointer", padding: "14px 16px", fontWeight: 700, minHeight: 24 }}
          >
            {it.q}
          </summary>
          <div style={{ padding: "0 16px 14px", color: colorTokens.text.secondary }}>{it.a}</div>
        </details>
      ))}
    </section>
  );
}

/* ───────────────────────── AnnouncementStrip ───────────────────────── */

/** Thin site-wide notice with optional link and a dismiss button. */
export function AnnouncementStrip({
  children,
  href,
  linkLabel: linkLabelProp,
  onDismiss,
  tone = "brand",
}: {
  children: React.ReactNode;
  href?: string;
  linkLabel?: string;
  onDismiss?: () => void;
  tone?: "brand" | "warning";
}) {
  const t = useT();
  const linkLabel = linkLabelProp ?? t("Learn more");
  const bg = tone === "warning" ? colorTokens.semantic.warning.bg : colorTokens.background.inverse;
  const fg = tone === "warning" ? colorTokens.text.primary : colorTokens.text.inverse;
  return (
    <div
      role="region"
      aria-label={t("Announcement")}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spacingTokens.sm,
        padding: "8px 48px",
        position: "relative",
        background: bg,
        color: fg,
        fontSize: typographyTokens.fontSize.sm,
        textAlign: "center",
        flexWrap: "wrap",
      }}
    >
      <span>{children}</span>
      {href && (
        <a href={href} style={{ color: fg, fontWeight: 700, textDecoration: "underline" }}>
          {linkLabel}
        </a>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t("Dismiss announcement")}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 36,
            height: 36,
            border: 0,
            background: "transparent",
            color: fg,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── CookieConsentBanner ───────────────────────── */

export interface CookieChoices {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

/**
 * CookieConsentBanner
 * Accept all / Reject all are equal buttons (no dark pattern), and
 * "Choose" opens per-category switches. A labelled region, not a modal, so
 * the page stays usable (DPDP Act 2023 / GDPR style consent).
 */
export function CookieConsentBanner({
  onSave,
  policyHref,
}: {
  onSave: (c: CookieChoices) => void;
  policyHref?: string;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<CookieChoices>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const b: React.CSSProperties = { ...btn(false), minHeight: 44, padding: "0 16px" };
  return (
    <section
      aria-label={t("Cookie choices")}
      style={{
        position: "sticky",
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.md,
        background: colorTokens.background.primary,
        borderTop: `3px solid ${colorTokens.interactive.primary}`,
        boxShadow: colorTokens.shadow.xl,
      }}
    >
      <p style={{ margin: 0 }}>
        We use necessary cookies to run the site. With your permission we’d also use analytics and
        marketing cookies.{" "}
        {policyHref && (
          <a href={policyHref} style={{ color: colorTokens.interactive.primary }}>
            {t("Cookie policy")}
          </a>
        )}
      </p>
      {open && (
        <fieldset
          style={{
            border: 0,
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <legend style={{ fontWeight: 700, marginBottom: 4 }}>{t("Choose cookies")}</legend>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 32,
              color: colorTokens.text.secondary,
            }}
          >
            <input type="checkbox" checked disabled style={{ width: 18, height: 18 }} /> Necessary
            (always on)
          </label>
          {(["analytics", "marketing"] as const).map((k) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32 }}>
              <input
                type="checkbox"
                checked={c[k]}
                onChange={(e) => setC({ ...c, [k]: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
              />
              {k === "analytics"
                ? t("Analytics — how the site is used")
                : t("Marketing — personalised ads")}
            </label>
          ))}
        </fieldset>
      )}
      <div style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap" }}>
        <button
          type="button"
          style={b}
          onClick={() => onSave({ necessary: true, analytics: false, marketing: false })}
        >
          {t("Reject all")}
        </button>
        <button
          type="button"
          style={b}
          onClick={() => onSave({ necessary: true, analytics: true, marketing: true })}
        >
          {t("Accept all")}
        </button>
        {open ? (
          <button
            type="button"
            style={{ ...b, ...btn(true), minHeight: 44, padding: "0 16px" }}
            onClick={() => onSave(c)}
          >
            {t("Save my choices")}
          </button>
        ) : (
          <button
            type="button"
            style={{ ...b, border: 0, textDecoration: "underline" }}
            aria-expanded={false}
            onClick={() => setOpen(true)}
          >
            {t("Choose")}
          </button>
        )}
      </div>
    </section>
  );
}
