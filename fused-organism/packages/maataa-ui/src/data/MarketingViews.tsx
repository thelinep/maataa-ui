/**
 * @maataa/ui/data/MarketingViews
 * Marketing campaign cards and an asset library with usage rights
 */

import { useLocale, useT, msg } from "../i18n/LocaleProvider";
import React, { useMemo, useState } from "react";
import { Badge } from "../primitives/Badge";
import { StateBadge, publicationStates } from "../status/StateBadge";
import { FilterBar } from "../forms/FilterBar";
import { AssetGrid, type Asset } from "./AssetPreview";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface MarketingCampaign {
  id: string;
  name: string;
  /** e.g. "Trailer launch" */
  goal: string;
  channels: string[];
  start: Date;
  end: Date;
  budget?: number;
  spent?: number;
  status: keyof typeof publicationStates;
  /** e.g. { label: msg("Trailer views"), value: "1.2 M" } */
  result?: { label: string; value: string };
}

export interface MarketingCampaignCardProps {
  campaign: MarketingCampaign;
  onOpen?: (c: MarketingCampaign) => void;
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/** MarketingCampaignCard: dates, channels, spend against budget in words. */
export function MarketingCampaignCard({
  campaign: c,
  onOpen,
  currency = "INR",
  locale: localeProp,
}: MarketingCampaignCardProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    notation: "compact",
  });
  const d = (x: Date) => x.toLocaleDateString(locale, { day: "numeric", month: "short" });
  return (
    <article
      aria-label={c.name}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        padding: spacingTokens.md,
        background: colorTokens.background.primary,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.xs,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: spacingTokens.sm,
          alignItems: "baseline",
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(c)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                fontWeight: 700,
                color: colorTokens.text.primary,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {c.name}
            </button>
          ) : (
            c.name
          )}
        </h3>
        <StateBadge state={c.status} states={publicationStates} />
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {c.goal} · {d(c.start)} – {d(c.end)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {c.channels.map((ch) => (
          <Badge key={ch} variant="info">
            {ch}
          </Badge>
        ))}
      </div>
      {c.budget !== undefined && (
        <div style={{ fontSize: typographyTokens.fontSize.sm }}>
          Spent {money.format(c.spent ?? 0)} of {money.format(c.budget)}
          {(c.spent ?? 0) > c.budget && (
            <strong style={{ color: colorTokens.interactive.error }}> {t("· over budget")}</strong>
          )}
        </div>
      )}
      {c.result && (
        <div style={{ fontSize: typographyTokens.fontSize.sm }}>
          {t(c.result.label)}: <strong>{c.result.value}</strong>
        </div>
      )}
    </article>
  );
}
MarketingCampaignCard.displayName = "MarketingCampaignCard";

export interface MarketingAsset extends Asset {
  /** e.g. "Poster", "Trailer", "Still" */
  type: string;
  /** e.g. ["Instagram", "Press"] */
  approvedFor: string[];
  /** Usage rights end */
  rightsUntil?: Date;
}

export interface MarketingAssetLibraryProps {
  assets: MarketingAsset[];
  onOpen: (a: MarketingAsset) => void;
  /** @default 'en-IN' */
  locale?: string;
  now?: Date;
}

/**
 * MarketingAssetLibrary
 * Filter by type and channel; assets whose rights have run out are listed
 * separately so they aren't reused by mistake.
 */
export function MarketingAssetLibrary({
  assets,
  onOpen,
  locale: localeProp,
  now = new Date(),
}: MarketingAssetLibraryProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const [f, setF] = useState<Record<string, string>>({ type: "", channel: "" });
  const types = Array.from(new Set(assets.map((a) => a.type)));
  const channels = Array.from(new Set(assets.flatMap((a) => a.approvedFor)));
  const shown = useMemo(
    () =>
      assets.filter(
        (a) => (!f.type || a.type === f.type) && (!f.channel || a.approvedFor.includes(f.channel))
      ),
    [assets, f]
  );
  const live = shown.filter((a) => !a.rightsUntil || a.rightsUntil >= now);
  const expired = shown.filter((a) => a.rightsUntil && a.rightsUntil < now);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}>
      <FilterBar
        label={t("Filter marketing assets")}
        filters={[
          { id: "type", label: msg("Type"), options: types.map((t) => ({ value: t, label: t })) },
          {
            id: "channel",
            label: msg("Approved for"),
            options: channels.map((c) => ({ value: c, label: c })),
          },
        ]}
        values={f}
        onChange={setF}
        resultCount={live.length}
        resultNoun="usable assets"
        resultNounSingular="usable asset"
      />
      <AssetGrid
        assets={live}
        onOpen={(a) => onOpen(a as MarketingAsset)}
        label={t("Usable assets")}
      />
      {expired.length > 0 && (
        <section aria-label={t("Rights expired")}>
          <h3
            style={{
              margin: `0 0 ${spacingTokens.xs}`,
              fontSize: typographyTokens.fontSize.md,
              color: colorTokens.interactive.error,
            }}
          >
            {t("Rights expired · don’t use")}
          </h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: spacingTokens.lg,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {expired.map((a) => (
              <li key={a.id}>
                {t("{name} · ended {value}", {
                  name: a.name,
                  value: a.rightsUntil!.toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                })}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
MarketingAssetLibrary.displayName = "MarketingAssetLibrary";
