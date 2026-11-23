/**
 * @maataa/ui/data/LocationGallery
 * Location cards and a location detail view
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { DetailList } from "./RecordHeader";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface FilmLocation {
  id: string;
  name: string;
  area: string;
  /** e.g. "Interior", "Exterior", "Both" */
  setting: string;
  photoUrl?: string;
  photoAlt?: string;
  dayRate?: string;
  permit?: "notNeeded" | "needed" | "held";
  accessNotes?: string;
  power?: string;
  parking?: string;
  contact?: string;
  lat?: number;
  lng?: number;
}

const permitText = { notNeeded: "No permit needed", needed: "Permit needed", held: "Permit held" };
const permitTone = { notNeeded: "default", needed: "warning", held: "success" } as const;

export interface LocationGalleryProps {
  locations: FilmLocation[];
  onOpen: (l: FilmLocation) => void;
  label?: string;
}

/** LocationGallery: photo cards, one named link per card. */
export function LocationGallery({ locations, onOpen, label: labelProp }: LocationGalleryProps) {
  const t = useT();
  const label = labelProp ?? t("Locations");
  return (
    <ul
      aria-label={label}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: spacingTokens.md,
      }}
    >
      {locations.map((l) => (
        <li
          key={l.id}
          style={{
            position: "relative",
            border: `1px solid ${colorTokens.border.primary}`,
            borderRadius: 10,
            overflow: "hidden",
            background: colorTokens.background.primary,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              aspectRatio: "3 / 2",
              background: l.photoUrl
                ? `center / cover url(${l.photoUrl})`
                : colorTokens.background.tertiary,
              display: "grid",
              placeItems: "center",
              fontSize: 32,
            }}
          >
            {!l.photoUrl && "📍"}
          </div>
          <div
            style={{ padding: spacingTokens.sm, display: "flex", flexDirection: "column", gap: 4 }}
          >
            <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen(l);
                }}
                style={{ color: colorTokens.text.primary, textDecoration: "none" }}
              >
                <span aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
                {l.name}
              </a>
            </h3>
            <span
              style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
            >
              {l.area} · {l.setting}
              {l.dayRate ? ` · ${l.dayRate}` : ""}
            </span>
            {l.permit && (
              <span>
                <Badge variant={permitTone[l.permit]}>{permitText[l.permit]}</Badge>
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
LocationGallery.displayName = "LocationGallery";

export interface LocationDetailProps {
  location: FilmLocation;
  actions?: React.ReactNode;
}

/** LocationDetail: photo with alt text, facts, and access notes. */
export function LocationDetail({ location: l, actions }: LocationDetailProps) {
  const t = useT();
  return (
    <article
      aria-labelledby={`loc-${l.id}`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      {l.photoUrl && (
        <img
          src={l.photoUrl}
          alt={l.photoAlt ?? ""}
          style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 8 }}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: spacingTokens.sm,
          flexWrap: "wrap",
          alignItems: "baseline",
        }}
      >
        <h2 id={`loc-${l.id}`} style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"] }}>
          {l.name}
        </h2>
        {l.permit && <Badge variant={permitTone[l.permit]}>{permitText[l.permit]}</Badge>}
      </div>
      {actions && <div style={{ display: "flex", gap: spacingTokens.sm }}>{actions}</div>}
      <DetailList
        items={[
          { label: msg("Area"), value: l.area },
          { label: msg("Setting"), value: l.setting },
          { label: msg("Day rate"), value: l.dayRate ?? "" },
          { label: msg("Power"), value: l.power ?? "" },
          { label: msg("Parking"), value: l.parking ?? "" },
          { label: msg("Contact"), value: l.contact ?? "" },
          {
            label: msg("Coordinates"),
            value:
              l.lat !== undefined && l.lng !== undefined
                ? `${l.lat.toFixed(4)}, ${l.lng.toFixed(4)}`
                : "",
          },
        ]}
      />
      {l.accessNotes && (
        <section aria-label={t("Access")}>
          <h3 style={{ margin: `0 0 ${spacingTokens.xs}`, fontSize: typographyTokens.fontSize.lg }}>
            {t("Access")}
          </h3>
          <p style={{ margin: 0 }}>{l.accessNotes}</p>
        </section>
      )}
    </article>
  );
}
LocationDetail.displayName = "LocationDetail";
