/**
 * @maataa/ui/data/VfxShotTable
 * VFX shot breakdown with artist assignment and render state
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { StateBadge, renderStates } from "../status/StateBadge";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface VfxShot {
  id: string;
  /** e.g. "MD_042_010" */
  code: string;
  scene: string;
  description: string;
  /** e.g. "Rain comp", "Sky replacement" */
  work: string;
  frames: number;
  artistId?: string;
  due?: Date;
  render: keyof typeof renderStates;
}

export interface VfxShotTableProps {
  shots: VfxShot[];
  artists: { id: string; name: string }[];
  onAssign: (shotId: string, artistId: string) => void;
  /** @default 'en-IN' */
  locale?: string;
  now?: Date;
}

/**
 * VfxShotTable
 * Each shot has an artist select named by its code ("Artist for
 * MD_042_010") and its render state in words. Overdue shots say so.
 */
export function VfxShotTable({
  shots,
  artists,
  onAssign,
  locale: localeProp,
  now = new Date(),
}: VfxShotTableProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    verticalAlign: "top",
  };
  const unassigned = shots.filter((s) => !s.artistId).length;
  return (
    <ScrollTable label={t("VFX shots")}>
      <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {t("VFX shots · {count} shots, {unassigned} unassigned", {
            count: shots.length,
            unassigned,
          })}
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {t("Shot")}
            </th>
            <th scope="col" style={td}>
              {t("Work")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Frames")}
            </th>
            <th scope="col" style={td}>
              {t("Artist")}
            </th>
            <th scope="col" style={td}>
              {t("Due")}
            </th>
            <th scope="col" style={td}>
              {t("Render")}
            </th>
          </tr>
        </thead>
        <tbody>
          {shots.map((s) => {
            const overdue = s.due && s.due < now && s.render !== "done";
            return (
              <tr key={s.id}>
                <th scope="row" style={{ ...td, textAlign: "left" }}>
                  <span style={{ fontFamily: typographyTokens.fontFamily.mono }}>{s.code}</span>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 400,
                      color: colorTokens.text.secondary,
                      fontSize: typographyTokens.fontSize.xs,
                    }}
                  >
                    Sc. {s.scene} · {s.description}
                  </span>
                </th>
                <td style={td}>{s.work}</td>
                <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {s.frames}
                </td>
                <td style={td}>
                  <select
                    aria-label={t("Artist for {code}", { code: s.code })}
                    value={s.artistId ?? ""}
                    onChange={(e) => onAssign(s.id, e.target.value)}
                    style={{
                      padding: 3,
                      border: `1px solid ${s.artistId ? colorTokens.border.control : colorTokens.interactive.warning}`,
                      borderRadius: 4,
                      font: "inherit",
                      background: colorTokens.background.primary,
                    }}
                  >
                    <option value="">{t("Unassigned")}</option>
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td
                  style={{
                    ...td,
                    color: overdue ? colorTokens.interactive.error : undefined,
                    fontWeight: overdue ? 700 : 400,
                  }}
                >
                  {s.due
                    ? s.due.toLocaleDateString(locale, { day: "numeric", month: "short" })
                    : "—"}
                  {overdue ? " · overdue" : ""}
                </td>
                <td style={td}>
                  <StateBadge state={s.render} states={renderStates} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
VfxShotTable.displayName = "VfxShotTable";
