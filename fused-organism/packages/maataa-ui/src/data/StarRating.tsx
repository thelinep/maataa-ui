/**
 * @maataa/ui/data/StarRating
 * Shows a rating out of five, with half stars, in words for screen readers
 */

import React, { useId } from "react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { colorTokens, typographyTokens } from "../tokens";

export interface StarRatingProps {
  /** 0–5. Stars round to the nearest half; the number shows one decimal. */
  value: number;
  /** How many ratings it's based on */
  count?: number;
  /** Star size in px. @default 16 */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** StarRating */
export function StarRating({ value, count, size = 16, className, style }: StarRatingProps) {
  const t = useT();
  const locale = useLocale();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const v = Math.max(0, Math.min(5, Math.round(value * 2) / 2));
  const shown = (Math.round(Math.max(0, Math.min(5, value)) * 10) / 10).toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const label =
    count === undefined
      ? t("Rated {value} out of 5", { value: shown })
      : t.plural(
          count,
          "Rated {value} out of 5 from {count} rating",
          "Rated {value} out of 5 from {count} ratings",
          { value: shown }
        );
  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, v - i));
          const id = `star-${uid}-${i}`;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={id}>
                  <stop offset={`${fill * 100}%`} stopColor={colorTokens.interactive.warning} />
                  <stop offset={`${fill * 100}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
                fill={`url(#${id})`}
                stroke={colorTokens.interactive.warning}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          );
        })}
      </span>
      <span
        aria-hidden="true"
        style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
      >
        {count === undefined ? shown : `${shown} (${count.toLocaleString(locale)})`}
      </span>
    </span>
  );
}

StarRating.displayName = "StarRating";
