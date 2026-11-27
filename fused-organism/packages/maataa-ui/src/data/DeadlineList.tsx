/**
 * @maataa/ui/data/DeadlineList
 * Upcoming deadlines, soonest first, with overdue and due-soon in words
 */

import { useLocale, useT, type Translator } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Deadline {
  id: string;
  title: string;
  due: Date;
  /** e.g. project name */
  context?: string;
  done?: boolean;
  onOpen?: () => void;
}

export interface DeadlineListProps {
  items: Deadline[];
  /** @default 'Upcoming deadlines' */
  title?: string;
  /** Days ahead that count as "due soon" @default 3 */
  soonDays?: number;
  /** @default 'en-IN' */
  locale?: string;
  now?: Date;
  /** Hide completed items @default true */
  hideDone?: boolean;
}

const DAY = 86_400_000;

/** "Overdue by 2 days" / "Due today" / "Due in 3 days" */
export function relativeDue(
  due: Date,
  now: Date,
  /** Pass `useT()` to get the text in the active language. @default English */
  t: Pick<Translator, "plural"> & ((source: string) => string) = englishText
): { text: string; tone: "error" | "warning" | "default" } {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(due) - start(now)) / DAY);
  if (days < 0)
    return {
      text: t.plural(-days, "Overdue by {count} day", "Overdue by {count} days"),
      tone: "error",
    };
  if (days === 0) return { text: t("Due today"), tone: "warning" };
  if (days === 1) return { text: t("Due tomorrow"), tone: "warning" };
  return { text: t.plural(days, "Due in {count} day", "Due in {count} days"), tone: "default" };
}

const englishText = Object.assign((source: string) => source, {
  plural: (count: number, one: string, other: string) =>
    (count === 1 ? one : other).replace("{count}", String(count)),
});

/** DeadlineList: sorted by date; state is a badge with words. */
export function DeadlineList({
  items,
  title: titleProp,
  soonDays = 3,
  locale: localeProp,
  now = new Date(),
  hideDone = true,
}: DeadlineListProps) {
  const t = useT();
  const title = titleProp ?? t("Upcoming deadlines");
  const locale = useLocale(localeProp);
  const shown = items
    .filter((i) => !(hideDone && i.done))
    .sort((a, b) => a.due.getTime() - b.due.getTime());
  return (
    <section aria-label={title}>
      <h2 style={{ margin: `0 0 ${spacingTokens.sm}`, fontSize: typographyTokens.fontSize.lg }}>
        {title}
      </h2>
      {shown.length === 0 ? (
        <p style={{ color: colorTokens.text.secondary }}>{t("Nothing due. Nice.")}</p>
      ) : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((d) => {
            const r = relativeDue(d.due, now, t);
            const soon = r.tone === "default" && d.due.getTime() - now.getTime() <= soonDays * DAY;
            return (
              <li
                key={d.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: spacingTokens.sm,
                  padding: `${spacingTokens.sm} 0`,
                  borderBottom: `1px solid ${colorTokens.border.primary}`,
                }}
              >
                <div>
                  {d.onOpen ? (
                    <button
                      type="button"
                      onClick={d.onOpen}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        font: "inherit",
                        fontWeight: 600,
                        color: colorTokens.text.primary,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {t(d.title)}
                    </button>
                  ) : (
                    <span style={{ fontWeight: 600 }}>{t(d.title)}</span>
                  )}
                  <div
                    style={{
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {d.context ? `${d.context} · ` : ""}
                    <time dateTime={d.due.toISOString()}>
                      {d.due.toLocaleDateString(locale, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
                  </div>
                </div>
                <Badge
                  variant={
                    r.tone === "error"
                      ? "error"
                      : r.tone === "warning" || soon
                        ? "warning"
                        : "default"
                  }
                >
                  {t(r.text)}
                </Badge>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
DeadlineList.displayName = "DeadlineList";
