/**
 * @maataa/ui/data/AssetPreview
 * Image or video preview with alt text, captions and file facts
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { formatBytes } from "../forms/FileDropzone";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Asset {
  id: string;
  name: string;
  kind: "image" | "video" | "audio" | "document";
  url?: string;
  thumbnailUrl?: string;
  /** Required for images that carry meaning */
  alt?: string;
  /** WebVTT captions for video */
  captionsUrl?: string;
  size?: number;
  /** e.g. "4K · 2:31" */
  meta?: string;
}

export interface AssetPreviewProps {
  asset: Asset;
  /** Max height of the media @default 360 */
  maxHeight?: number;
}

const kindIcon: Record<Asset["kind"], string> = {
  image: "🖼",
  video: "🎞",
  audio: "🎧",
  document: "📄",
};

/**
 * AssetPreview
 * Video uses native controls and a captions track when given. An image
 * without alt text shows a visible "Add a description" warning.
 */
export function AssetPreview({ asset: a, maxHeight = 360 }: AssetPreviewProps) {
  const t = useT();
  const media: React.CSSProperties = {
    display: "block",
    maxWidth: "100%",
    maxHeight,
    margin: "0 auto",
    borderRadius: 6,
    background: "#000",
  };
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      {a.kind === "image" && a.url ? (
        <img src={a.url} alt={a.alt ?? ""} style={{ ...media, background: "transparent" }} />
      ) : a.kind === "video" && a.url ? (
        <video controls preload="metadata" poster={a.thumbnailUrl} style={media}>
          <source src={a.url} />
          {a.captionsUrl && (
            <track kind="captions" src={a.captionsUrl} srcLang="en" label={t("English")} default />
          )}
        </video>
      ) : a.kind === "audio" && a.url ? (
        <audio controls preload="metadata" src={a.url} style={{ width: "100%" }} />
      ) : (
        <div
          aria-hidden="true"
          style={{
            height: 160,
            display: "grid",
            placeItems: "center",
            fontSize: 48,
            background: colorTokens.background.tertiary,
            borderRadius: 6,
          }}
        >
          {kindIcon[a.kind]}
        </div>
      )}
      <figcaption style={{ fontSize: typographyTokens.fontSize.sm }}>
        <strong>{a.name}</strong>
        <span style={{ color: colorTokens.text.secondary }}>
          {[a.meta, a.size !== undefined ? formatBytes(a.size) : undefined]
            .filter(Boolean)
            .map((x) => ` · ${x}`)}
        </span>
        {a.kind === "image" && !a.alt && (
          <div style={{ color: colorTokens.interactive.warning, fontWeight: 600 }}>
            {t("No description yet. Add one so screen-reader users know what this shows.")}
          </div>
        )}
        {a.kind === "video" && !a.captionsUrl && (
          <div style={{ color: colorTokens.interactive.warning, fontWeight: 600 }}>
            {t("No captions yet.")}
          </div>
        )}
      </figcaption>
    </figure>
  );
}
AssetPreview.displayName = "AssetPreview";

export interface AssetGridProps {
  assets: Asset[];
  onOpen: (asset: Asset) => void;
  /** Ids currently selected */
  selected?: string[];
  onToggleSelect?: (id: string) => void;
  label?: string;
}

/**
 * AssetGrid
 * Thumbnails as buttons named by file name and type. Optional selection
 * uses real checkboxes.
 */
export function AssetGrid({
  assets,
  onOpen,
  selected,
  onToggleSelect,
  label: labelProp,
}: AssetGridProps) {
  const t = useT();
  const label = labelProp ?? t("Assets");
  return (
    <ul
      aria-label={label}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: spacingTokens.sm,
      }}
    >
      {assets.map((a) => (
        <li
          key={a.id}
          style={{
            position: "relative",
            border: `1px solid ${colorTokens.border.primary}`,
            borderRadius: 8,
            overflow: "hidden",
            background: colorTokens.background.primary,
          }}
        >
          <button
            type="button"
            onClick={() => onOpen(a)}
            aria-label={`${a.name}, ${a.kind}`}
            style={{
              display: "block",
              width: "100%",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                aspectRatio: "4 / 3",
                background: a.thumbnailUrl
                  ? `center / cover url(${a.thumbnailUrl})`
                  : colorTokens.background.tertiary,
                display: "grid",
                placeItems: "center",
                fontSize: 32,
              }}
            >
              {!a.thumbnailUrl && kindIcon[a.kind]}
            </div>
            <div
              aria-hidden="true"
              style={{
                padding: spacingTokens.xs,
                fontSize: typographyTokens.fontSize.xs,
                color: colorTokens.text.primary,
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {a.name}
            </div>
          </button>
          {onToggleSelect && (
            <input
              type="checkbox"
              aria-label={t("Select {name}", { name: a.name })}
              checked={selected?.includes(a.id) ?? false}
              onChange={() => onToggleSelect(a.id)}
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                width: 18,
                height: 18,
                accentColor: colorTokens.interactive.primary,
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
AssetGrid.displayName = "AssetGrid";
