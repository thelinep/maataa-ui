/**
 * @maataa/ui/surfaces/Containers
 * ImageCard, ProfileCard, PricingTierCard, ServiceCard, InsetCard (nested),
 * GlassPanel, CompareGrid, PreviewFrame and FullScreenModal
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

const cardBase: React.CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  background: colorTokens.background.primary,
  border: `1px solid ${colorTokens.border.primary}`,
  borderRadius: 12,
  overflow: "hidden",
  minWidth: 0,
};

type HeadingLevel = 2 | 3 | 4;

/** Makes the whole card clickable via a stretched link on the title */
function TitleLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} style={{ color: "inherit", textDecoration: "none" }}>
      {children}
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
    </a>
  );
}

/* ───────────────────────── ImageCard ───────────────────────── */

export interface ImageCardProps {
  title: string;
  imageSrc?: string;
  /** Empty string for decorative images */
  imageAlt: string;
  /** Width / height @default 16/9 */
  aspect?: number;
  eyebrow?: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  href?: string;
  level?: HeadingLevel;
  actions?: React.ReactNode;
}

/**
 * ImageCard
 * Image on top, then a heading. With `href` the whole card is clickable but
 * only the title is the link (one tab stop, sensible name).
 */
export function ImageCard({
  title,
  imageSrc,
  imageAlt,
  aspect = 16 / 9,
  eyebrow,
  description,
  meta,
  href,
  level = 3,
  actions,
}: ImageCardProps) {
  const H = `h${level}` as "h3";
  return (
    <article style={cardBase}>
      <div
        style={{
          aspectRatio: String(aspect),
          background: colorTokens.background.tertiary,
          order: -1,
        }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
      <div style={{ padding: spacingTokens.md, display: "flex", flexDirection: "column", gap: 6 }}>
        <H
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize.lg,
            color: colorTokens.text.primary,
          }}
        >
          <TitleLink href={href}>{title}</TitleLink>
        </H>
        {eyebrow && (
          <p
            style={{
              margin: 0,
              order: -1,
              fontSize: typographyTokens.fontSize.xs,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: colorTokens.text.secondary,
            }}
          >
            {eyebrow}
          </p>
        )}
        {description && <div style={{ color: colorTokens.text.secondary }}>{description}</div>}
        {meta && (
          <div
            style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
          >
            {meta}
          </div>
        )}
        {actions && (
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 8, marginTop: 4 }}>
            {actions}
          </div>
        )}
      </div>
    </article>
  );
}

/* ───────────────────────── ProfileCard ───────────────────────── */

export interface ProfileCardProps {
  name: string;
  role?: string;
  photoSrc?: string;
  location?: string;
  /** Short facts, e.g. credits */
  facts?: { label: string; value: React.ReactNode }[];
  tags?: string[];
  href?: string;
  level?: HeadingLevel;
  actions?: React.ReactNode;
  /** e.g. "Available from 4 Dec" */
  availability?: string;
}

/**
 * ProfileCard
 * Person card. The photo is decorative (the name is the heading right
 * next to it), initials stand in when there is no photo.
 */
export function ProfileCard({
  name,
  role,
  photoSrc,
  location,
  facts,
  tags,
  href,
  level = 3,
  actions,
  availability,
}: ProfileCardProps) {
  const H = `h${level}` as "h3";
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <article style={{ ...cardBase, padding: spacingTokens.md, gap: spacingTokens.sm }}>
      <div style={{ display: "flex", gap: spacingTokens.md, alignItems: "center" }}>
        {photoSrc ? (
          <img
            src={photoSrc}
            alt=""
            width={64}
            height={64}
            style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: colorTokens.background.tertiary,
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {initials}
          </span>
        )}
        <div style={{ minWidth: 0 }}>
          <H style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
            <TitleLink href={href}>{name}</TitleLink>
          </H>
          {role && <div style={{ color: colorTokens.text.secondary }}>{role}</div>}
          {location && (
            <div
              style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
            >
              {location}
            </div>
          )}
        </div>
      </div>
      {availability && (
        <div
          style={{
            alignSelf: "flex-start",
            fontSize: typographyTokens.fontSize.xs,
            padding: "2px 10px",
            borderRadius: 999,
            background: colorTokens.semantic.success.bg,
            color: colorTokens.semantic.success.text,
            fontWeight: 600,
          }}
        >
          {availability}
        </div>
      )}
      {facts && (
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "4px 12px",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {facts.map((f) => (
            <React.Fragment key={f.label}>
              <dt style={{ color: colorTokens.text.secondary }}>{f.label}</dt>
              <dd style={{ margin: 0 }}>{f.value}</dd>
            </React.Fragment>
          ))}
        </dl>
      )}
      {tags && tags.length > 0 && (
        <ul
          aria-label="Skills"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {tags.map((t) => (
            <li
              key={t}
              style={{
                fontSize: typographyTokens.fontSize.xs,
                padding: "2px 8px",
                borderRadius: 999,
                border: `1px solid ${colorTokens.border.primary}`,
              }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      {actions && (
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 8 }}>{actions}</div>
      )}
    </article>
  );
}

/* ───────────────────────── PricingTierCard ───────────────────────── */

export interface PricingTierCardProps {
  name: string;
  price: string;
  /** e.g. "per month", "per project" */
  period?: string;
  description?: string;
  features: { label: string; included: boolean }[];
  ctaLabel: string;
  onSelect: () => void;
  highlighted?: boolean;
  /** e.g. "Most popular" */
  badge?: string;
  current?: boolean;
  level?: HeadingLevel;
}

/**
 * PricingTierCard
 * Features say "Included" / "Not included" in words. The button name
 * includes the tier ("Choose Studio").
 */
export function PricingTierCard({
  name,
  price,
  period,
  description,
  features,
  ctaLabel,
  onSelect,
  highlighted,
  badge,
  current,
  level = 3,
}: PricingTierCardProps) {
  const H = `h${level}` as "h3";
  return (
    <article
      style={{
        ...cardBase,
        padding: spacingTokens.lg,
        gap: spacingTokens.md,
        border: `${highlighted ? 3 : 1}px solid ${highlighted ? colorTokens.interactive.primary : colorTokens.border.primary}`,
        boxShadow: highlighted ? colorTokens.shadow.lg : undefined,
      }}
    >
      {badge && (
        <span
          style={{
            alignSelf: "flex-start",
            fontSize: typographyTokens.fontSize.xs,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
            background: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
          }}
        >
          {badge}
        </span>
      )}
      <H style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>{name}</H>
      <p style={{ margin: 0 }}>
        <span style={{ fontSize: typographyTokens.fontSize["3xl"], fontWeight: 800 }}>{price}</span>
        {period && <span style={{ color: colorTokens.text.secondary }}> {period}</span>}
      </p>
      {description && <p style={{ margin: 0, color: colorTokens.text.secondary }}>{description}</p>}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
        }}
      >
        {features.map((f) => (
          <li
            key={f.label}
            style={{
              display: "flex",
              gap: 8,
              color: f.included ? colorTokens.text.primary : colorTokens.text.tertiary,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color: f.included ? colorTokens.interactive.success : colorTokens.text.tertiary,
                fontWeight: 700,
              }}
            >
              {f.included ? "✓" : "–"}
            </span>
            <span>
              {f.label}
              <VisuallyHidden>{f.included ? ", included" : ", not included"}</VisuallyHidden>
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSelect}
        disabled={current}
        aria-label={current ? `${name} is your current plan` : `${ctaLabel} ${name}`}
        style={{
          minHeight: 48,
          borderRadius: 10,
          border: highlighted ? 0 : `1px solid ${colorTokens.border.control}`,
          background: highlighted
            ? colorTokens.interactive.primary
            : colorTokens.background.primary,
          color: highlighted ? colorTokens.text.inverse : colorTokens.text.primary,
          font: "inherit",
          fontWeight: 700,
          cursor: current ? "default" : "pointer",
          opacity: current ? 0.7 : 1,
        }}
      >
        {current ? "Current plan" : ctaLabel}
      </button>
    </article>
  );
}

/* ───────────────────────── ServiceCard ───────────────────────── */

export interface ServiceCardProps {
  title: string;
  icon?: React.ReactNode;
  description: React.ReactNode;
  /** What is in the package */
  includes?: string[];
  price?: string;
  turnaround?: string;
  href?: string;
  level?: HeadingLevel;
  actions?: React.ReactNode;
}

/** A service or package (e.g. "Colour grade — feature"), with inclusions. */
export function ServiceCard({
  title,
  icon,
  description,
  includes,
  price,
  turnaround,
  href,
  level = 3,
  actions,
}: ServiceCardProps) {
  const H = `h${level}` as "h3";
  return (
    <article style={{ ...cardBase, padding: spacingTokens.lg, gap: spacingTokens.sm }}>
      {icon && (
        <span
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: colorTokens.background.tertiary,
            fontSize: 24,
          }}
        >
          {icon}
        </span>
      )}
      <H style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        <TitleLink href={href}>{title}</TitleLink>
      </H>
      <div style={{ color: colorTokens.text.secondary }}>{description}</div>
      {includes && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {includes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
      {(price || turnaround) && (
        <dl
          style={{
            margin: 0,
            display: "flex",
            gap: spacingTokens.lg,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {price && (
            <div>
              <dt style={{ color: colorTokens.text.secondary }}>From</dt>
              <dd style={{ margin: 0, fontWeight: 700 }}>{price}</dd>
            </div>
          )}
          {turnaround && (
            <div>
              <dt style={{ color: colorTokens.text.secondary }}>Turnaround</dt>
              <dd style={{ margin: 0, fontWeight: 700 }}>{turnaround}</dd>
            </div>
          )}
        </dl>
      )}
      {actions && (
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 8 }}>{actions}</div>
      )}
    </article>
  );
}

/* ───────────────────────── InsetCard ───────────────────────── */

export interface InsetCardProps {
  title?: string;
  level?: HeadingLevel | 5;
  children: React.ReactNode;
  tone?: "neutral" | "info" | "warning";
}

/**
 * InsetCard
 * A card inside a card: recessed background and a lighter border instead of
 * another shadow, so the nesting reads clearly. A region only when titled.
 */
export function InsetCard({ title, level = 4, children, tone = "neutral" }: InsetCardProps) {
  const id = useId();
  const H = `h${level}` as "h4";
  const bg =
    tone === "info"
      ? colorTokens.semantic.info.bg
      : tone === "warning"
        ? colorTokens.semantic.warning.bg
        : colorTokens.background.secondary;
  return (
    <section
      aria-labelledby={title ? id : undefined}
      style={{
        background: bg,
        border: `1px solid ${colorTokens.border.secondary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {title && (
        <H id={id} style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
          {title}
        </H>
      )}
      {children}
    </section>
  );
}

/* ───────────────────────── GlassPanel ───────────────────────── */

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Blur strength in px @default 16 */
  blur?: number;
  children: React.ReactNode;
}

/**
 * GlassPanel
 * Frosted panel for use over imagery. The fill stays ≥ 85% opaque so text
 * keeps its contrast whatever is behind it; solid when transparency or
 * blur is unavailable.
 */
export function GlassPanel({ blur = 16, children, style, ...props }: GlassPanelProps) {
  return (
    <div
      {...props}
      style={{
        background: "rgba(255, 250, 240, 0.86)",
        backdropFilter: `blur(${blur}px) saturate(1.3)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(1.3)`,
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: colorTokens.shadow.lg,
        borderRadius: 16,
        padding: spacingTokens.lg,
        color: colorTokens.text.primary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── CompareGrid ───────────────────────── */

export interface CompareGridProps {
  /** 2–4 items side by side; stacks on narrow screens */
  children: React.ReactNode;
  /** Columns at full width @default number of children (max 4) */
  columns?: 2 | 3 | 4;
  label?: string;
}

/** Side-by-side layout for comparing 2–4 things. A list, so the count is announced. */
export function CompareGrid({ children, columns, label }: CompareGridProps) {
  const items = React.Children.toArray(children);
  const n = columns ?? (Math.min(4, Math.max(2, items.length)) as 2 | 3 | 4);
  return (
    <ul
      aria-label={label}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${Math.floor(960 / n) - 24}px), 1fr))`,
        gap: spacingTokens.md,
        alignItems: "stretch",
      }}
    >
      {items.map((c, i) => (
        <li key={i} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {c}
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── PreviewFrame ───────────────────────── */

export interface PreviewFrameProps {
  title: string;
  children: React.ReactNode;
  /** Source shown under "Show code" */
  code?: string;
  /** Offer phone/tablet/desktop widths @default true */
  viewports?: boolean;
}

const VIEWPORTS = [
  { id: "phone", label: "Phone", width: 375 },
  { id: "tablet", label: "Tablet", width: 768 },
  { id: "full", label: "Full width", width: 0 },
] as const;

/**
 * PreviewFrame
 * A component/storybook-style preview: title, width switcher (radio group),
 * the live preview in a labelled region, and optional code.
 */
export function PreviewFrame({ title, children, code, viewports = true }: PreviewFrameProps) {
  const id = useId();
  const [vp, setVp] = useState<(typeof VIEWPORTS)[number]["id"]>("full");
  const w = VIEWPORTS.find((v) => v.id === vp)!.width;
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          padding: "8px 12px",
          background: colorTokens.background.secondary,
          borderBottom: `1px solid ${colorTokens.border.secondary}`,
        }}
      >
        <h3 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
          {title}
        </h3>
        {viewports && (
          <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", gap: 4 }}>
            <legend
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              Preview width
            </legend>
            {VIEWPORTS.map((v) => (
              <label
                key={v.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: typographyTokens.fontSize.sm,
                  background: vp === v.id ? colorTokens.background.primary : "transparent",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`${id}-vp`}
                  checked={vp === v.id}
                  onChange={() => setVp(v.id)}
                  style={{ accentColor: colorTokens.interactive.primary }}
                />
                {v.label}
              </label>
            ))}
          </fieldset>
        )}
      </header>
      <div
        role="region"
        aria-label={`${title} preview${w ? `, ${w} pixels wide` : ""}`}
        style={{
          padding: spacingTokens.lg,
          background: `repeating-conic-gradient(${colorTokens.background.secondary} 0 25%, ${colorTokens.background.primary} 0 50%) 0 0 / 20px 20px`,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            width: w || "auto",
            maxWidth: "100%",
            margin: "0 auto",
            background: colorTokens.background.primary,
            boxShadow: w ? colorTokens.shadow.md : undefined,
          }}
        >
          {children}
        </div>
      </div>
      {code && (
        <details style={{ borderTop: `1px solid ${colorTokens.border.secondary}` }}>
          <summary
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            Show code
          </summary>
          <pre
            tabIndex={0}
            style={{
              margin: 0,
              padding: 12,
              overflowX: "auto",
              background: colorTokens.background.inverse,
              color: colorTokens.text.inverse,
              fontSize: 13,
            }}
          >
            <code>{code}</code>
          </pre>
        </details>
      )}
    </section>
  );
}

/* ───────────────────────── FullScreenModal ───────────────────────── */

export interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Buttons on the right of the header (e.g. Save) */
  actions?: React.ReactNode;
  /** @default 'Close' */
  closeLabel?: string;
}

/**
 * FullScreenModal
 * Covers the viewport (good for editors on phones). Focus moves to the
 * heading, Tab stays inside, Escape and Close return focus to the opener,
 * and the page behind is inert and does not scroll.
 */
export function FullScreenModal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  closeLabel = "Close",
}: FullScreenModalProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    opener.current = document.activeElement as HTMLElement | null;
    heading.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const siblings = Array.from(document.body.children).filter(
      (el) => !el.contains(ref.current)
    ) as HTMLElement[];
    siblings.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      document.body.style.overflow = prev;
      siblings.forEach((el) => el.removeAttribute("inert"));
      opener.current?.focus?.();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
          return;
        }
        if (e.key !== "Tab" || !ref.current) return;
        const f = Array.from(
          ref.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === heading.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        background: colorTokens.background.primary,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacingTokens.sm,
          padding: `${spacingTokens.sm} ${spacingTokens.md}`,
          borderBottom: `1px solid ${colorTokens.border.primary}`,
          paddingTop: "max(8px, env(safe-area-inset-top))",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            minHeight: 44,
            padding: "0 12px",
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 8,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            cursor: "pointer",
          }}
        >
          <span aria-hidden="true">✕ </span>
          {closeLabel}
        </button>
        <h2
          ref={heading}
          id={id}
          tabIndex={-1}
          style={{ margin: 0, flex: 1, fontSize: typographyTokens.fontSize.lg, outline: "none" }}
        >
          {title}
        </h2>
        {actions}
      </header>
      <div style={{ flex: 1, overflow: "auto", padding: spacingTokens.lg }}>{children}</div>
    </div>,
    document.body
  );
}
