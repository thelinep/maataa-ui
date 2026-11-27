/**
 * @maataa/ui/data/ProductionListing
 * Public production cards (Dispatch) and their grid
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { EmptyState } from "./EmptyState";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ProductionListingItem {
  id: string;
  title: string;
  /** e.g. "Feature film", "Short", "Web series" */
  type: string;
  genre?: string;
  location?: string;
  /** e.g. "Shooting Jan–Feb 2027" */
  when?: string;
  /** Roles being hired, e.g. ["Editor", "Sound recordist"] */
  openRoles?: string[];
  posterUrl?: string;
  href?: string;
}

export interface ProductionListingCardProps {
  item: ProductionListingItem;
  onOpen?: (item: ProductionListingItem) => void;
  headingLevel?: 2 | 3 | 4;
}

/**
 * ProductionListingCard
 * One link per card (the title), stretched over the card, so the card is a
 * single tab stop with a clear name. Poster is decorative.
 */
export function ProductionListingCard({
  item,
  onOpen,
  headingLevel = 3,
}: ProductionListingCardProps) {
  const t = useT();
  const H = `h${headingLevel}` as "h3";
  return (
    <article
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        overflow: "hidden",
        background: colorTokens.background.primary,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          aspectRatio: "16 / 9",
          background: item.posterUrl
            ? `center / cover url(${item.posterUrl})`
            : colorTokens.background.tertiary,
          display: "grid",
          placeItems: "center",
          fontSize: 36,
        }}
      >
        {!item.posterUrl && "🎬"}
      </div>
      <div
        style={{
          padding: spacingTokens.md,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.xs,
        }}
      >
        <H style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
          <a
            href={item.href ?? `#${item.id}`}
            onClick={(e) => {
              if (onOpen) {
                e.preventDefault();
                onOpen(item);
              }
            }}
            style={{ color: colorTokens.text.primary, textDecoration: "none" }}
          >
            <span aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
            {item.title}
          </a>
        </H>
        <div style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}>
          {[item.type, item.genre, item.location].filter(Boolean).join(" · ")}
        </div>
        {item.when && <div style={{ fontSize: typographyTokens.fontSize.sm }}>{item.when}</div>}
        {item.openRoles && item.openRoles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacingTokens.xs,
              marginTop: spacingTokens.xs,
            }}
          >
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              {t("Hiring:")}
            </span>
            {item.openRoles.map((r) => (
              <Badge key={r} variant="info">
                {r}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
ProductionListingCard.displayName = "ProductionListingCard";

export interface ProductionListingGridProps {
  items: ProductionListingItem[];
  onOpen?: (item: ProductionListingItem) => void;
  /** Productions hidden by their owners' privacy settings */
  hiddenCount?: number;
  /** Clear the filters from the empty state */
  onClearFilters?: () => void;
  label?: string;
}

/**
 * ProductionListingGrid
 * A list of cards. When nothing matches it says whether privacy settings
 * are hiding productions, rather than implying none exist.
 */
export function ProductionListingGrid({
  items,
  onOpen,
  hiddenCount = 0,
  onClearFilters,
  label: labelProp,
}: ProductionListingGridProps) {
  const t = useT();
  const label = labelProp ?? t("Productions");
  if (items.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={t("No public productions match")}
        description={
          hiddenCount > 0
            ? `${hiddenCount} production${hiddenCount === 1 ? " is" : "s are"} set to private or unlisted, so ${hiddenCount === 1 ? "it isn't" : "they aren't"} shown here. Try fewer filters.`
            : "Try fewer filters, or check back soon."
        }
        action={
          onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              style={{
                background: "none",
                border: "none",
                color: colorTokens.interactive.primary,
                textDecoration: "underline",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              {t("Clear filters")}
            </button>
          ) : undefined
        }
      />
    );
  }
  return (
    <ul
      aria-label={label}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: spacingTokens.md,
      }}
    >
      {items.map((it) => (
        <li key={it.id}>
          <ProductionListingCard item={it} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}
ProductionListingGrid.displayName = "ProductionListingGrid";
