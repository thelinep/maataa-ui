/**
 * @maataa/ui/data/Timeline
 * Vertical history: activity, audit or version events
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TimelineEvent {
  id: string;
  /** What happened, e.g. "Asha approved the budget" */
  title: string;
  at: Date;
  /** More detail under the title */
  detail?: React.ReactNode;
  /** Who did it */
  actor?: string;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  events: TimelineEvent[];
  /** Accessible name, e.g. "Version history" */
  label: string;
  /** @default 'en-IN' */
  locale?: string;
  /** Shown when there are no events @default 'Nothing yet' */
  emptyText?: string;
}

/**
 * Timeline
 * An ordered list (newest first, as given) with a time element per event.
 *
 * @example
 * ```tsx
 * <Timeline label="Activity" events={[{ id: "1", title: "Budget approved", at: new Date(), actor: "Asha" }]} />
 * ```
 */
export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ events, label, locale: localeProp, emptyText: emptyTextProp, style, ...props }, ref) => {
    const t = useT();
    const emptyText = emptyTextProp ?? t("Nothing yet");
    const locale = useLocale(localeProp);
    if (events.length === 0) {
      return <p style={{ color: colorTokens.text.secondary }}>{emptyText}</p>;
    }
    return (
      <ol
        ref={ref}
        aria-label={label}
        style={{ listStyle: "none", margin: 0, padding: 0, ...style }}
        {...props}
      >
        {events.map((e, i) => (
          <li
            key={e.id}
            style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: spacingTokens.md }}
          >
            <span
              aria-hidden="true"
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  marginTop: 6,
                  borderRadius: "50%",
                  background: colorTokens.interactive.primary,
                }}
              />
              {i < events.length - 1 && (
                <span style={{ flex: 1, width: 2, background: colorTokens.border.primary }} />
              )}
            </span>
            <div style={{ paddingBottom: spacingTokens.md }}>
              <div style={{ color: colorTokens.text.primary, fontWeight: 600 }}>{e.title}</div>
              <div
                style={{
                  color: colorTokens.text.secondary,
                  fontSize: typographyTokens.fontSize.xs,
                }}
              >
                {e.actor ? `${e.actor} · ` : ""}
                <time dateTime={e.at.toISOString()}>
                  {e.at.toLocaleString(locale, {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              {e.detail && (
                <div style={{ marginTop: spacingTokens.xs, color: colorTokens.text.primary }}>
                  {e.detail}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  }
);

Timeline.displayName = "Timeline";
