/**
 * @maataa/ui/data/VersionHistoryList
 * Versions of a cut, contract, deck or mix, with compare / restore / download
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { Badge, type BadgeProps } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface VersionEntry {
  id: string;
  /** e.g. "Cut v7" or "Contract v3" */
  label: string;
  createdAt: Date;
  author?: string;
  /** e.g. "Locked", "Sent", "Signed" */
  status?: string;
  statusVariant?: BadgeProps["variant"];
  note?: string;
  /** e.g. "1:52:10" or "24 pages" */
  meta?: string;
}

export interface VersionHistoryListProps {
  /** e.g. "Edit versions" */
  title: string;
  versions: VersionEntry[];
  currentId?: string;
  onOpen?: (v: VersionEntry) => void;
  onCompare?: (v: VersionEntry) => void;
  onRestore?: (v: VersionEntry) => void;
  onDownload?: (v: VersionEntry) => void;
  /** @default 'en-IN' */
  locale?: string;
}

const link: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: colorTokens.interactive.primary,
  textDecoration: "underline",
  cursor: "pointer",
  font: "inherit",
  fontSize: typographyTokens.fontSize.sm,
};

/**
 * VersionHistoryList
 * Newest first. The current version says "Current" in words. Each action
 * names its version ("Compare Cut v6 with current").
 */
export function VersionHistoryList({
  title,
  versions,
  currentId,
  onOpen,
  onCompare,
  onRestore,
  onDownload,
  locale: localeProp,
}: VersionHistoryListProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const sorted = [...versions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return (
    <section aria-label={title}>
      <h3 style={{ margin: `0 0 ${spacingTokens.sm}`, fontSize: typographyTokens.fontSize.lg }}>
        {title}
      </h3>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {sorted.map((v) => {
          const cur = v.id === currentId;
          return (
            <li
              key={v.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: spacingTokens.sm,
                padding: `${spacingTokens.sm} 0`,
                borderBottom: `1px solid ${colorTokens.border.primary}`,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: spacingTokens.xs,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {onOpen ? (
                    <button
                      type="button"
                      onClick={() => onOpen(v)}
                      style={{
                        ...link,
                        fontSize: typographyTokens.fontSize.md,
                        fontWeight: 600,
                        textDecoration: "none",
                        color: colorTokens.text.primary,
                      }}
                    >
                      {v.label}
                    </button>
                  ) : (
                    <strong>{v.label}</strong>
                  )}
                  {cur && <Badge variant="success">{t("Current")}</Badge>}
                  {v.status && <Badge variant={v.statusVariant ?? "default"}>{v.status}</Badge>}
                </div>
                <div
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  <time dateTime={v.createdAt.toISOString()}>
                    {v.createdAt.toLocaleString(locale, {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                  {v.author ? ` · ${v.author}` : ""}
                  {v.meta ? ` · ${v.meta}` : ""}
                </div>
                {v.note && (
                  <div style={{ fontSize: typographyTokens.fontSize.sm, marginTop: 2 }}>
                    {v.note}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
                {onCompare && !cur && (
                  <button
                    type="button"
                    style={link}
                    onClick={() => onCompare(v)}
                    aria-label={t("Compare {label} with current", { label: v.label })}
                  >
                    {t("Compare")}
                  </button>
                )}
                {onRestore && !cur && (
                  <button
                    type="button"
                    style={link}
                    onClick={() => onRestore(v)}
                    aria-label={t("Restore {label}", { label: v.label })}
                  >
                    {t("Restore")}
                  </button>
                )}
                {onDownload && (
                  <button
                    type="button"
                    style={link}
                    onClick={() => onDownload(v)}
                    aria-label={t("Download {label}", { label: v.label })}
                  >
                    {t("Download")}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
VersionHistoryList.displayName = "VersionHistoryList";
