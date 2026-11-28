/**
 * @maataa/ui/data/BeingAvatar
 * An avatar for anyone on a production: people, animal actors, and story
 * characters (creatures, robots), with their species and, for those allowed
 * to see it, their health
 */

import React from "react";
import { msg, useLocale, useT } from "../i18n/LocaleProvider";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { Avatar, type AvatarSize } from "./Avatar";

export type SpeciesKind = "human" | "animal" | "creature" | "robot" | "other";

export interface Species {
  id: string;
  /** English label; translated with t() when it's in the catalog */
  label: string;
  kind: SpeciesKind;
  /** A short glyph for the badge */
  icon?: string;
}

/** Common species on a set. Pass their ids, or your own Species objects. */
export const SPECIES: Record<string, Species> = {
  human: { id: "human", label: msg("Human"), kind: "human", icon: "🧑" },
  dog: { id: "dog", label: msg("Dog"), kind: "animal", icon: "🐕" },
  cat: { id: "cat", label: msg("Cat"), kind: "animal", icon: "🐈" },
  horse: { id: "horse", label: msg("Horse"), kind: "animal", icon: "🐎" },
  cow: { id: "cow", label: msg("Cow"), kind: "animal", icon: "🐄" },
  elephant: { id: "elephant", label: msg("Elephant"), kind: "animal", icon: "🐘" },
  camel: { id: "camel", label: msg("Camel"), kind: "animal", icon: "🐪" },
  monkey: { id: "monkey", label: msg("Monkey"), kind: "animal", icon: "🐒" },
  bird: { id: "bird", label: msg("Bird"), kind: "animal", icon: "🐦" },
  snake: { id: "snake", label: msg("Snake"), kind: "animal", icon: "🐍" },
  creature: { id: "creature", label: msg("Creature"), kind: "creature", icon: "🐉" },
  robot: { id: "robot", label: msg("Robot"), kind: "robot", icon: "🤖" },
  alien: { id: "alien", label: msg("Alien"), kind: "creature", icon: "👽" },
  spirit: { id: "spirit", label: msg("Spirit"), kind: "creature", icon: "✨" },
};

export type HealthState = "ok" | "watch" | "alert";

export interface HealthMark {
  /** e.g. "Fit to work", "Vet check", "Peanut allergy", "Knee strain" */
  label: string;
  /** @default "ok" */
  state?: HealthState;
  /** Extra words, e.g. who checked and what to do */
  detail?: string;
  /** When it's next due or was last done */
  date?: Date;
}

export type BeingAvatarVariant = "crew" | "character" | "game";

export interface BeingAvatarProps {
  name: string;
  src?: string;
  /** One or more: a hybrid character can be ["human", "robot"]. Ids from SPECIES or your own. */
  species?: (string | Species)[];
  /**
   * Health notes. Shown only when `showHealth` is true: pass it only for
   * people whose role lets them see health details.
   */
  health?: HealthMark[];
  /** 0–100: condition of a character, or hit points in "game". */
  vitality?: number;
  /** @default false */
  showHealth?: boolean;
  /**
   * "crew": people and animals on the call sheet; "character": someone in
   * the story (vitality reads as a condition word); "game": a hit-point bar.
   * @default "crew"
   */
  variant?: BeingAvatarVariant;
  /** Words under the name, e.g. the role or the character played */
  subtitle?: string;
  /** @default "lg" */
  size?: AvatarSize;
  /** Show only the picture with its badges */
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const STATE = {
  ok: { ...colorTokens.semantic.success, word: msg("OK") },
  watch: { ...colorTokens.semantic.warning, word: msg("Watch") },
  alert: { ...colorTokens.semantic.error, word: msg("Needs attention") },
} as const;

const resolve = (s: string | Species): Species =>
  typeof s === "string" ? (SPECIES[s] ?? { id: s, label: s, kind: "other" }) : s;

function worst(marks: HealthMark[]): HealthState | null {
  if (!marks.length) return null;
  if (marks.some((m) => m.state === "alert")) return "alert";
  if (marks.some((m) => m.state === "watch")) return "watch";
  return "ok";
}

/**
 * BeingAvatar
 *
 * @example
 * ```tsx
 * <BeingAvatar name="Moti" species={["dog"]} subtitle="Plays Sheru"
 *   health={[{ label: "Vet check", state: "ok", date: new Date("2026-11-20") }]}
 *   showHealth={canSeeHealth} />
 * ```
 */
export function BeingAvatar({
  name,
  src,
  species = [],
  health = [],
  vitality,
  showHealth = false,
  variant = "crew",
  subtitle,
  size = "lg",
  compact = false,
  className,
  style,
}: BeingAvatarProps) {
  const t = useT();
  const locale = useLocale();
  const kinds = species.map(resolve);
  const speciesWords = kinds.map((k) => t(k.label)).join(" + ");
  const state = showHealth ? worst(health) : null;
  const ring = state ? STATE[state].text : undefined;
  const v = vitality === undefined ? undefined : Math.max(0, Math.min(100, Math.round(vitality)));
  const showVitality = v !== undefined && (variant !== "crew" || showHealth);
  const condition =
    v === undefined
      ? ""
      : v >= 75
        ? t("Strong")
        : v >= 40
          ? t("Hurt")
          : v > 0
            ? t("Badly hurt")
            : t("Down");
  const date = (d: Date) =>
    d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

  const picture = (
    <span style={{ position: "relative", display: "inline-flex", flex: "none" }}>
      <span
        style={{
          display: "inline-flex",
          borderRadius: "50%",
          boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
        }}
      >
        <Avatar name={name} src={src} size={size} decorative={!compact} />
      </span>
      {kinds.length > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -6,
            bottom: -6,
            display: "inline-flex",
            gap: 1,
            padding: "1px 4px",
            borderRadius: 999,
            background: colorTokens.background.primary,
            border: `1px solid ${colorTokens.border.primary}`,
            fontSize: size === "sm" || size === "md" ? 10 : 14,
            lineHeight: 1.2,
          }}
        >
          {kinds.map((k) => (
            <span key={k.id}>{k.icon ?? "•"}</span>
          ))}
        </span>
      )}
    </span>
  );

  const accessibleName = [
    name,
    speciesWords,
    state ? t("health: {state}", { state: t(STATE[state].word) }) : "",
    showVitality ? (variant === "game" ? t("{value} of 100 health", { value: v }) : condition) : "",
  ]
    .filter(Boolean)
    .join(", ");

  if (compact)
    return (
      <span
        role="img"
        aria-label={accessibleName}
        className={className}
        style={{ display: "inline-flex", ...style }}
      >
        {picture}
      </span>
    );

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: spacingTokens.md,
        alignItems: "flex-start",
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      {picture}
      <div style={{ display: "grid", gap: spacingTokens.xs, minWidth: 0 }}>
        <div>
          <strong style={{ fontSize: typographyTokens.fontSize.xl }}>{name}</strong>
          {subtitle && (
            <div
              style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.md }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {kinds.length > 0 && (
          <ul
            aria-label={t("Species")}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacingTokens.xs,
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {kinds.map((k) => (
              <li
                key={k.id}
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: colorTokens.background.secondary,
                  border: `1px solid ${colorTokens.border.primary}`,
                  fontSize: typographyTokens.fontSize.sm,
                }}
              >
                <span aria-hidden="true">{k.icon ? `${k.icon} ` : ""}</span>
                {t(k.label)}
              </li>
            ))}
          </ul>
        )}
        {showVitality && (
          <div style={{ display: "grid", gap: 2 }}>
            <div
              role="meter"
              aria-label={variant === "game" ? t("Health") : t("Condition")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={v}
              aria-valuetext={variant === "game" ? t("{value} of 100", { value: v }) : condition}
              style={{
                width: 160,
                height: 8,
                borderRadius: 999,
                background: colorTokens.background.tertiary,
                border: `1px solid ${colorTokens.border.control}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${v}%`,
                  height: "100%",
                  background:
                    v! >= 75
                      ? colorTokens.interactive.success
                      : v! >= 40
                        ? colorTokens.interactive.warning
                        : colorTokens.interactive.error,
                }}
              />
            </div>
            <span
              style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
            >
              {variant === "game" ? t("{value} / 100 HP", { value: v }) : condition}
            </span>
          </div>
        )}
        {showHealth && health.length > 0 && (
          <ul
            aria-label={t("Health")}
            style={{
              display: "grid",
              gap: spacingTokens.xs,
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {health.map((m, i) => {
              const s = STATE[m.state ?? "ok"];
              return (
                <li
                  key={i}
                  style={{
                    padding: `${spacingTokens.xs} ${spacingTokens.sm}`,
                    borderRadius: radiusTokens.md,
                    background: s.bg,
                    color: s.text,
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  <strong>{m.label}</strong>
                  {` · ${t(s.word)}`}
                  {m.date ? ` · ${date(m.date)}` : ""}
                  {m.detail ? <div>{m.detail}</div> : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

BeingAvatar.displayName = "BeingAvatar";
