/**
 * @maataa/ui/data/ShotList
 * A shot list by scene: size, angle, movement, lens, what the camera sees,
 * and how long each shot runs. Reads well on screen and prints on A4.
 */

import React from "react";
import { msg, useLocale, useT } from "../i18n/LocaleProvider";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ShotListShot {
  /** e.g. "1A" */
  shot: string;
  /** e.g. "WS", "MS", "CU", "ECU", "OTS", "INSERT" */
  size: string;
  angle: string;
  movement: string;
  /** What the camera sees */
  description: string;
  lens?: string;
  durationSec?: number;
  notes?: string;
}

export interface ShotListScene {
  scene: string;
  /** e.g. "INT. KITCHEN - NIGHT" */
  heading: string;
  shots: ShotListShot[];
}

export interface ShotListProps {
  title: string;
  scenes: ShotListScene[];
  className?: string;
  style?: React.CSSProperties;
}

/** Shot-size abbreviations, spelled out for screen readers and new crew. */
const SIZES: Record<string, string> = {
  EWS: msg("extreme wide shot"),
  ELS: msg("extreme long shot"),
  WS: msg("wide shot"),
  LS: msg("long shot"),
  FS: msg("full shot"),
  MWS: msg("medium wide shot"),
  MLS: msg("medium long shot"),
  MS: msg("medium shot"),
  MCU: msg("medium close-up"),
  CU: msg("close-up"),
  ECU: msg("extreme close-up"),
  OTS: msg("over the shoulder"),
  POV: msg("point of view"),
  "2S": msg("two-shot"),
  INSERT: msg("insert"),
};

const css = `@media print { @page { size: A4; margin: 12mm } }
.maataa-shotlist table { width: 100%; border-collapse: collapse; margin: 6px 0 16px }
.maataa-shotlist th, .maataa-shotlist td { border: 1px solid currentColor; padding: 4px 6px; text-align: left; vertical-align: top }
.maataa-shotlist thead th { font-weight: 600 }
@media print { .maataa-shotlist { color: #000 !important; background: #fff !important } }`;

/** "4 min 20 s" style duration */
function duration(seconds: number, t: ReturnType<typeof useT>): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return t("{s} s", { s });
  return s ? t("{m} min {s} s", { m, s }) : t("{m} min", { m });
}

/**
 * ShotList
 *
 * @example
 * ```tsx
 * <ShotList title="Bhairav" scenes={[{ scene: "1", heading: "EXT. GHAT - DAWN", shots: [...] }]} />
 * ```
 */
export function ShotList({ title, scenes, className, style }: ShotListProps) {
  const t = useT();
  const locale = useLocale();
  const all = scenes.flatMap((s) => s.shots);
  const total = all.reduce((sum, s) => sum + (s.durationSec ?? 0), 0);
  const missing = all.filter((s) => !s.durationSec).length;
  const muted = (v: string | undefined) =>
    !v || /^tbc$/i.test(v) ? (
      <span style={{ color: colorTokens.text.tertiary }}>{v || "—"}</span>
    ) : (
      v
    );

  return (
    <article
      className={["maataa-shotlist", className].filter(Boolean).join(" ")}
      style={{
        color: colorTokens.text.primary,
        background: colorTokens.background.primary,
        fontFamily: typographyTokens.fontFamily.base,
        fontSize: typographyTokens.fontSize.md,
        ...style,
      }}
    >
      <style>{css}</style>
      <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize["4xl"] }}>
        {t("Shot list: {title}", { title })}
      </h2>
      <p
        style={{
          margin: `${spacingTokens.xs} 0 ${spacingTokens.md}`,
          color: colorTokens.text.secondary,
        }}
      >
        {t.plural(scenes.length, "{count} scene", "{count} scenes")}
        {" · "}
        {t.plural(all.length, "{count} shot", "{count} shots")}
        {total > 0 && ` · ${t("about {time} of screen time", { time: duration(total, t) })}`}
        {missing > 0 &&
          ` · ${t.plural(missing, "{count} shot without a duration", "{count} shots without a duration")}`}
      </p>
      {scenes.map((sc, i) => {
        const secs = sc.shots.reduce((sum, s) => sum + (s.durationSec ?? 0), 0);
        return (
          <section
            key={`${sc.scene}-${i}`}
            aria-label={t("Scene {scene}: {heading}", { scene: sc.scene, heading: sc.heading })}
          >
            <h3
              style={{
                margin: `${spacingTokens.md} 0 0`,
                fontSize: typographyTokens.fontSize["2xl"],
              }}
            >
              {t("Scene {scene}: {heading}", { scene: sc.scene, heading: sc.heading })}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: typographyTokens.fontSize.sm,
                  color: colorTokens.text.secondary,
                }}
              >
                {" · "}
                {t.plural(sc.shots.length, "{count} shot", "{count} shots")}
                {secs > 0 && ` · ${duration(secs, t)}`}
              </span>
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">{t("Shot")}</th>
                    <th scope="col">{t("Size")}</th>
                    <th scope="col">{t("Angle")}</th>
                    <th scope="col">{t("Movement")}</th>
                    <th scope="col">{t("Lens")}</th>
                    <th scope="col">{t("What the camera sees")}</th>
                    <th scope="col">{t("Seconds")}</th>
                    <th scope="col">{t("Notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sc.shots.map((s, j) => {
                    const full = SIZES[s.size.toUpperCase()];
                    return (
                      <tr key={`${s.shot}-${j}`}>
                        <th scope="row">{s.shot}</th>
                        <td>{full ? <abbr title={t(full)}>{s.size}</abbr> : muted(s.size)}</td>
                        <td>{muted(s.angle)}</td>
                        <td>{muted(s.movement)}</td>
                        <td>{muted(s.lens)}</td>
                        <td>{s.description}</td>
                        <td>
                          {s.durationSec ? s.durationSec.toLocaleString(locale) : muted("TBC")}
                        </td>
                        <td>{muted(s.notes)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </article>
  );
}

ShotList.displayName = "ShotList";
