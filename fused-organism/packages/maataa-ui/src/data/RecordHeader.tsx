/**
 * @maataa/ui/data/RecordHeader
 * Detail-page header: back link, title, status, key facts, actions
 */

import React from "react";
import { Badge, type BadgeProps } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface RecordHeaderProps {
  title: string;
  /** e.g. "Feature film · Hindi" */
  subtitle?: string;
  status?: string;
  statusVariant?: BadgeProps["variant"];
  /** Short facts shown inline, e.g. [{label:"Budget", value:"₹48 L"}] */
  facts?: { label: string; value: React.ReactNode }[];
  /** Buttons on the right */
  actions?: React.ReactNode;
  /** Back link, e.g. { label: "Projects", href: "/projects" } */
  back?: { label: string; href?: string; onClick?: () => void };
  /** Leading visual (Avatar, poster) */
  media?: React.ReactNode;
}

/**
 * RecordHeader
 * The page's h1 plus its facts as a definition list. The back link names
 * where it goes ("Back to Projects").
 */
export function RecordHeader({
  title,
  subtitle,
  status,
  statusVariant = "default",
  facts,
  actions,
  back,
  media,
}: RecordHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        paddingBottom: spacingTokens.md,
        borderBottom: `1px solid ${colorTokens.border.primary}`,
      }}
    >
      {back && (
        <a
          href={back.href ?? "#"}
          onClick={(e) => {
            if (back.onClick) {
              e.preventDefault();
              back.onClick();
            }
          }}
          style={{
            color: colorTokens.interactive.primary,
            fontSize: typographyTokens.fontSize.sm,
            alignSelf: "flex-start",
          }}
        >
          <span aria-hidden="true">← </span>Back to {back.label}
        </a>
      )}
      <div
        style={{
          display: "flex",
          gap: spacingTokens.md,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {media}
        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: typographyTokens.fontSize["3xl"],
                color: colorTokens.text.primary,
              }}
            >
              {title}
            </h1>
            {status && <Badge variant={statusVariant}>{status}</Badge>}
          </div>
          {subtitle && (
            <p style={{ margin: `${spacingTokens.xs} 0 0`, color: colorTokens.text.secondary }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: "flex", gap: spacingTokens.sm, flexWrap: "wrap" }}>{actions}</div>
        )}
      </div>
      {facts && facts.length > 0 && (
        <dl
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: `${spacingTokens.xs} ${spacingTokens.lg}`,
            margin: 0,
          }}
        >
          {facts.map((f) => (
            <div key={f.label} style={{ display: "flex", gap: spacingTokens.xs }}>
              <dt style={{ color: colorTokens.text.secondary }}>{f.label}:</dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
RecordHeader.displayName = "RecordHeader";

export interface DetailListProps {
  items: { label: string; value: React.ReactNode }[];
  /** Columns on wide screens @default 2 */
  columns?: 1 | 2 | 3;
  /** Text for empty values @default 'Not given' */
  emptyText?: string;
}

/** DetailList: label/value pairs as a responsive definition list. */
export function DetailList({ items, columns = 2, emptyText = "Not given" }: DetailListProps) {
  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 1 ? 100 : columns === 2 ? 45 : 30}%, 1fr))`,
        gap: spacingTokens.md,
        margin: 0,
      }}
    >
      {items.map((i) => (
        <div key={i.label}>
          <dt style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
            {i.label}
          </dt>
          <dd
            style={{
              margin: 0,
              color:
                i.value === "" || i.value == null
                  ? colorTokens.text.secondary
                  : colorTokens.text.primary,
            }}
          >
            {i.value === "" || i.value == null ? emptyText : i.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
DetailList.displayName = "DetailList";
