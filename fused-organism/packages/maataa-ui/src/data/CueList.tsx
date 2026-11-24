/**
 * @maataa/ui/data/CueList
 * Sound or music cues with timecode in/out and status
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Cue {
  id: string;
  /** e.g. "1M3" or "SFX 12" */
  code: string;
  kind: "music" | "dialogue" | "sfx" | "foley" | "ambience";
  in: string;
  out: string;
  description: string;
  status: "spotted" | "inProgress" | "delivered" | "approved";
  /** Rights cleared (music) */
  cleared?: boolean;
}

const kindText = {
  music: msg("Music"),
  dialogue: msg("Dialogue"),
  sfx: msg("Sound effect"),
  foley: msg("Foley"),
  ambience: msg("Ambience"),
};
const statusText = {
  spotted: msg("Spotted"),
  inProgress: msg("In progress"),
  delivered: msg("Delivered"),
  approved: msg("Approved"),
};
const statusTone = {
  spotted: "default",
  inProgress: "info",
  delivered: "warning",
  approved: "success",
} as const;

/** Duration between two "HH:MM:SS(:FF)" timecodes, as "m:ss" */
export function cueLength(tcIn: string, tcOut: string): string {
  const s = (tc: string) =>
    tc
      .split(":")
      .slice(0, 3)
      .map(Number)
      .reduce((a, b) => a * 60 + b, 0);
  const d = Math.max(0, s(tcOut) - s(tcIn));
  return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, "0")}`;
}

export interface CueListProps {
  cues: Cue[];
  onSeek?: (timecode: string) => void;
  /** @default 'Cue list' */
  caption?: string;
}

/** CueList: timecodes are buttons that seek; uncleared music is flagged in words. */
export function CueList({ cues, onSeek, caption = "Cue list" }: CueListProps) {
  const t = useT();
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    verticalAlign: "top",
  };
  const tc: React.CSSProperties = {
    fontFamily: typographyTokens.fontFamily.mono,
    fontSize: typographyTokens.fontSize.xs,
  };
  const uncleared = cues.filter((c) => c.kind === "music" && !c.cleared).length;
  return (
    <ScrollTable label={caption}>
      <table style={{ width: "100%", minWidth: 680, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {caption} · {cues.length} cues
          {uncleared ? (
            <span style={{ color: colorTokens.interactive.error }}>
              {" · " +
                t.plural(
                  uncleared,
                  "{count} music cue not cleared",
                  "{count} music cues not cleared"
                )}
            </span>
          ) : null}
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {t("Cue")}
            </th>
            <th scope="col" style={td}>
              {t("In")}
            </th>
            <th scope="col" style={td}>
              {t("Length")}
            </th>
            <th scope="col" style={td}>
              {t("Description")}
            </th>
            <th scope="col" style={td}>
              {t("Status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {cues.map((c) => (
            <tr key={c.id}>
              <th scope="row" style={{ ...td, textAlign: "left" }}>
                {c.code}
                <span
                  style={{
                    display: "block",
                    fontWeight: 400,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {t(kindText[c.kind])}
                </span>
              </th>
              <td style={td}>
                {onSeek ? (
                  <button
                    type="button"
                    onClick={() => onSeek(c.in)}
                    aria-label={t("Go to {code} at {in}", { code: c.code, in: c.in })}
                    style={{
                      ...tc,
                      padding: "0 4px",
                      border: `1px solid ${colorTokens.border.control}`,
                      borderRadius: 3,
                      background: colorTokens.background.primary,
                      cursor: "pointer",
                    }}
                  >
                    {c.in}
                  </button>
                ) : (
                  <span style={tc}>{c.in}</span>
                )}
              </td>
              <td style={{ ...td, ...tc }}>{cueLength(c.in, c.out)}</td>
              <td style={td}>
                {t(c.description)}
                {c.kind === "music" && !c.cleared && (
                  <span
                    style={{
                      display: "block",
                      color: colorTokens.interactive.error,
                      fontWeight: 600,
                      fontSize: typographyTokens.fontSize.xs,
                    }}
                  >
                    {t("Rights not cleared")}
                  </span>
                )}
              </td>
              <td style={td}>
                <Badge variant={statusTone[c.status]}>{t(statusText[c.status])}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
CueList.displayName = "CueList";
