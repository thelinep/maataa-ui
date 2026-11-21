/**
 * @maataa/ui/navigation/SiteFooter
 * Multi-column footer, and the compact legal + social variant
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  /** e.g. "Instagram" */
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SiteFooterProps {
  brand?: React.ReactNode;
  tagline?: string;
  columns?: FooterColumn[];
  social?: SocialLink[];
  legal?: { label: string; href: string }[];
  /** e.g. "© 2026 Vesahe Film Solutions Pvt Ltd" */
  copyright: string;
  /** Extra line such as CIN or GSTIN */
  registration?: string;
  variant?: "full" | "compact";
}

/**
 * SiteFooter
 * A contentinfo landmark. Columns are nav landmarks named by their heading;
 * social links are named "Instagram (opens in a new tab)".
 */
export function SiteFooter({
  brand,
  tagline,
  columns = [],
  social = [],
  legal = [],
  copyright,
  registration,
  variant = "full",
}: SiteFooterProps) {
  const link: React.CSSProperties = {
    color: colorTokens.text.inverse,
    opacity: 0.9,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    minHeight: 32,
  };
  const socialList = social.length > 0 && (
    <ul
      aria-label="Social media"
      style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 8 }}
    >
      {social.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...link,
              justifyContent: "center",
              minWidth: 40,
              minHeight: 40,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "0 10px",
              gap: 6,
            }}
          >
            {s.icon && <span aria-hidden="true">{s.icon}</span>}
            <span
              style={
                s.icon
                  ? {
                      position: "absolute",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      clip: "rect(0 0 0 0)",
                    }
                  : undefined
              }
            >
              {s.name}
            </span>{" "}
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              (opens in a new tab)
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
  const legalRow = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px 20px",
        alignItems: "center",
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      <span style={{ opacity: 0.85 }}>{copyright}</span>
      {registration && <span style={{ opacity: 0.7 }}>{registration}</span>}
      {legal.length > 0 && (
        <nav aria-label="Legal">
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {legal.map((l) => (
              <li key={l.label + l.href}>
                <a href={l.href} style={{ ...link, textDecoration: "underline" }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
  return (
    <footer
      style={{
        background: colorTokens.background.inverse,
        color: colorTokens.text.inverse,
        padding:
          variant === "full"
            ? `${spacingTokens.xl} ${spacingTokens.lg}`
            : `${spacingTokens.md} ${spacingTokens.lg}`,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.lg,
      }}
    >
      {variant === "full" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: spacingTokens.lg,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacingTokens.sm,
              minWidth: 200,
            }}
          >
            {brand && (
              <div style={{ fontSize: typographyTokens.fontSize.xl, fontWeight: 800 }}>{brand}</div>
            )}
            {tagline && (
              <p style={{ margin: 0, opacity: 0.85, fontSize: typographyTokens.fontSize.sm }}>
                {tagline}
              </p>
            )}
            {socialList}
          </div>
          {columns.map((c) => (
            <nav key={c.heading} aria-label={c.heading}>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: typographyTokens.fontSize.sm,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#F5D547",
                }}
              >
                {c.heading}
              </h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {c.links.map((l) => (
                  <li key={l.label + l.href}>
                    <a href={l.href} style={link}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: spacingTokens.md,
          flexWrap: "wrap",
          borderTop: variant === "full" ? "1px solid rgba(255,255,255,0.2)" : undefined,
          paddingTop: variant === "full" ? spacingTokens.md : 0,
        }}
      >
        {legalRow}
        {variant === "compact" && socialList}
      </div>
    </footer>
  );
}
