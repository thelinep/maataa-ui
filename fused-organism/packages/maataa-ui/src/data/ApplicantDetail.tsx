/**
 * @maataa/ui/data/ApplicantDetail
 * An applicant's profile, message, portfolio and stage actions
 */

import { useLocale, useT, msg } from "../i18n/LocaleProvider";
import React from "react";
import { Avatar } from "./Avatar";
import { DetailList } from "./RecordHeader";
import { AssetGrid, type Asset } from "./AssetPreview";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Applicant {
  id: string;
  name: string;
  role: string;
  stage: string;
  city?: string;
  languages?: string[];
  experience?: string;
  message?: string;
  portfolio?: Asset[];
  /** Shared only once the applicant agreed */
  email?: string;
  appliedAt: Date;
}

export interface ApplicantDetailProps {
  applicant: Applicant;
  onOpenAsset?: (a: Asset) => void;
  /** Stage buttons: Shortlist, Callback, Offer, Decline */
  actions?: React.ReactNode;
  /** @default 'en-IN' */
  locale?: string;
}

/** ApplicantDetail */
export function ApplicantDetail({
  applicant: a,
  onOpenAsset,
  actions,
  locale: localeProp,
}: ApplicantDetailProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  return (
    <article
      aria-labelledby={`applicant-${a.id}`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      <div
        style={{ display: "flex", gap: spacingTokens.md, alignItems: "center", flexWrap: "wrap" }}
      >
        <Avatar name={a.name} size="lg" decorative />
        <div style={{ flex: 1 }}>
          <h2
            id={`applicant-${a.id}`}
            style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"] }}
          >
            {a.name}
          </h2>
          <div style={{ color: colorTokens.text.secondary }}>
            {t("Applied for {role} · {value}", {
              role: a.role,
              value: a.appliedAt.toLocaleDateString(locale, { day: "numeric", month: "short" }),
            })}
          </div>
        </div>
        <Badge variant="info">{a.stage}</Badge>
      </div>
      {actions && (
        <div style={{ display: "flex", gap: spacingTokens.sm, flexWrap: "wrap" }}>{actions}</div>
      )}
      <DetailList
        items={[
          { label: msg("City"), value: a.city ?? "" },
          { label: msg("Languages"), value: a.languages?.join(", ") ?? "" },
          { label: msg("Experience"), value: a.experience ?? "" },
          { label: msg("Email"), value: a.email ?? "Shared after you reply" },
        ]}
      />
      {a.message && (
        <section aria-label={t("Message")}>
          <h3 style={{ margin: `0 0 ${spacingTokens.xs}`, fontSize: typographyTokens.fontSize.lg }}>
            {t("Message")}
          </h3>
          <blockquote
            style={{
              margin: 0,
              padding: spacingTokens.sm,
              borderLeft: `3px solid ${colorTokens.border.control}`,
              background: colorTokens.background.secondary,
            }}
          >
            {t(a.message)}
          </blockquote>
        </section>
      )}
      {a.portfolio && a.portfolio.length > 0 && (
        <section aria-label={t("Portfolio")}>
          <h3 style={{ margin: `0 0 ${spacingTokens.xs}`, fontSize: typographyTokens.fontSize.lg }}>
            {t("Portfolio")}
          </h3>
          <AssetGrid
            assets={a.portfolio}
            onOpen={(x) => onOpenAsset?.(x)}
            label={t("{name}'s portfolio", { name: a.name })}
          />
        </section>
      )}
    </article>
  );
}
ApplicantDetail.displayName = "ApplicantDetail";
