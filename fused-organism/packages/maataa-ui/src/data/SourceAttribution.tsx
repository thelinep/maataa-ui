/**
 * @maataa/ui/data/SourceAttribution
 * Where a figure came from, and how old it is
 */

import React from "react";
import { colorTokens, typographyTokens } from "../tokens";

export interface SourceAttributionProps extends React.HTMLAttributes<HTMLElement> {
  /** Title of the source document or page */
  title: string;
  url?: string;
  /** Publisher, e.g. "FICCI-EY" */
  publisher?: string;
  /** When the source was checked */
  accessedAt: Date;
  /**
   * After this many days the source is flagged as possibly out of date
   * @default 180
   */
  staleAfterDays?: number;
  /** @default 'en-IN' */
  locale?: string;
  /** Clock for tests */
  now?: Date;
}

const DAY = 86_400_000;

/**
 * SourceAttribution
 * "Source: <title> (publisher), checked 3 Mar 2026". Older than
 * `staleAfterDays`, it adds "may be out of date" in words, not only colour.
 *
 * @example
 * ```tsx
 * <SourceAttribution title="Indian M&E report 2026" publisher="FICCI-EY" url="https://…" accessedAt={new Date("2026-03-03")} />
 * ```
 */
export const SourceAttribution = React.forwardRef<HTMLElement, SourceAttributionProps>(
  (
    {
      title,
      url,
      publisher,
      accessedAt,
      staleAfterDays = 180,
      locale = "en-IN",
      now = new Date(),
      style,
      ...props
    },
    ref
  ) => {
    const ageDays = Math.floor((now.getTime() - accessedAt.getTime()) / DAY);
    const stale = ageDays > staleAfterDays;
    const date = accessedAt.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return (
      <small
        ref={ref}
        style={{
          display: "block",
          color: colorTokens.text.secondary,
          fontSize: typographyTokens.fontSize.xs,
          ...style,
        }}
        {...props}
      >
        Source:{" "}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colorTokens.interactive.primary }}
          >
            {title}
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              {" "}
              (opens in a new tab)
            </span>
          </a>
        ) : (
          title
        )}
        {publisher ? ` (${publisher})` : ""}, checked{" "}
        <time dateTime={accessedAt.toISOString().slice(0, 10)}>{date}</time>
        {stale && (
          <strong style={{ color: colorTokens.interactive.warning }}>
            {" "}
            · may be out of date ({ageDays} days old)
          </strong>
        )}
      </small>
    );
  }
);

SourceAttribution.displayName = "SourceAttribution";
