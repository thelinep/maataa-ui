/**
 * @maataa/ui/data/ReviewThread
 * Timecoded review notes on a cut, with replies and resolve
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ReviewNote {
  id: string;
  /** "HH:MM:SS:FF" or "MM:SS" */
  timecode: string;
  author: string;
  text: string;
  at: Date;
  resolved?: boolean;
  replies?: { id: string; author: string; text: string; at: Date }[];
}

export interface ReviewThreadProps {
  notes: ReviewNote[];
  /** Jump the player to a timecode */
  onSeek?: (timecode: string) => void;
  onReply: (noteId: string, text: string) => void;
  onToggleResolved: (noteId: string) => void;
  /** Add a note at the current playhead */
  onAdd?: (text: string) => void;
  /** Timecode where a new note will go, e.g. the playhead */
  currentTimecode?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * ReviewThread
 * Notes in timecode order; each timecode is a button that seeks. Replies
 * are nested lists. A filter hides resolved notes; counts are in the heading.
 */
export function ReviewThread({
  notes,
  onSeek,
  onReply,
  onToggleResolved,
  onAdd,
  currentTimecode,
  locale: localeProp,
}: ReviewThreadProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const id = useId();
  const [hideResolved, setHideResolved] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newText, setNewText] = useState("");
  const open = notes.filter((n) => !n.resolved).length;
  const shown = [...notes]
    .filter((n) => !(hideResolved && n.resolved))
    .sort((a, b) => a.timecode.localeCompare(b.timecode));
  const when = (d: Date) =>
    d.toLocaleString(locale, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: spacingTokens.sm,
          flexWrap: "wrap",
        }}
      >
        <h3 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
          {t("Review notes · {open} open of {count}", { open, count: notes.length })}
        </h3>
        <label
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <input
            type="checkbox"
            checked={hideResolved}
            onChange={(e) => setHideResolved(e.target.checked)}
            style={{ accentColor: colorTokens.interactive.primary }}
          />
          {t("Hide resolved")}
        </label>
      </div>
      {onAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newText.trim()) return;
            onAdd(newText.trim());
            setNewText("");
          }}
          style={{ display: "flex", gap: spacingTokens.xs, alignItems: "flex-end" }}
        >
          <label
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            New note{currentTimecode ? ` at ${currentTimecode}` : ""}
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              style={{
                padding: 6,
                border: `1px solid ${colorTokens.border.control}`,
                borderRadius: 4,
                font: "inherit",
                background: colorTokens.background.primary,
              }}
            />
          </label>
          <Button type="submit" size="sm">
            {t("Add note")}
          </Button>
        </form>
      )}
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.sm,
        }}
      >
        {shown.map((n) => (
          <li
            key={n.id}
            style={{
              border: `1px solid ${colorTokens.border.primary}`,
              borderRadius: 8,
              padding: spacingTokens.sm,
              background: n.resolved
                ? colorTokens.background.secondary
                : colorTokens.background.primary,
            }}
          >
            <div style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }}>
              <Avatar name={n.author} size="sm" decorative />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    gap: spacingTokens.xs,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSeek?.(n.timecode)}
                    aria-label={t("Go to {timecode}", { timecode: n.timecode })}
                    disabled={!onSeek}
                    style={{
                      fontFamily: typographyTokens.fontFamily.mono,
                      fontSize: typographyTokens.fontSize.sm,
                      padding: "0 6px",
                      border: `1px solid ${colorTokens.interactive.primary}`,
                      borderRadius: 4,
                      background: colorTokens.background.primary,
                      color: colorTokens.interactive.primary,
                      cursor: onSeek ? "pointer" : "default",
                    }}
                  >
                    {n.timecode}
                  </button>
                  <strong>{n.author}</strong>
                  <span
                    style={{
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {when(n.at)}
                  </span>
                  {n.resolved && (
                    <span
                      style={{
                        fontSize: typographyTokens.fontSize.xs,
                        color: colorTokens.interactive.success,
                        fontWeight: 600,
                      }}
                    >
                      {t("✓ Resolved")}
                    </span>
                  )}
                </div>
                <p style={{ margin: `${spacingTokens.xs} 0` }}>{n.text}</p>
                {n.replies && n.replies.length > 0 && (
                  <ul
                    aria-label={t("Replies to {author}'s note at {timecode}", {
                      author: n.author,
                      timecode: n.timecode,
                    })}
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: `0 0 0 ${spacingTokens.md}`,
                      borderLeft: `2px solid ${colorTokens.border.primary}`,
                    }}
                  >
                    {n.replies.map((r) => (
                      <li
                        key={r.id}
                        style={{ fontSize: typographyTokens.fontSize.sm, padding: "2px 0" }}
                      >
                        <strong>{r.author}:</strong> {r.text}
                      </li>
                    ))}
                  </ul>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: spacingTokens.xs,
                    marginTop: spacingTokens.xs,
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    aria-label={t("Reply to {author} at {timecode}", {
                      author: n.author,
                      timecode: n.timecode,
                    })}
                    value={drafts[n.id] ?? ""}
                    onChange={(e) => setDrafts({ ...drafts, [n.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && drafts[n.id]?.trim()) {
                        e.preventDefault();
                        onReply(n.id, drafts[n.id].trim());
                        setDrafts({ ...drafts, [n.id]: "" });
                      }
                    }}
                    placeholder={t("Reply, then press Enter")}
                    style={{
                      flex: 1,
                      minWidth: 140,
                      padding: 4,
                      border: `1px solid ${colorTokens.border.control}`,
                      borderRadius: 4,
                      font: "inherit",
                      fontSize: typographyTokens.fontSize.sm,
                    }}
                  />
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => onToggleResolved(n.id)}
                    aria-label={`${n.resolved ? t("Reopen") : t("Resolve")} note at ${n.timecode}`}
                  >
                    {n.resolved ? t("Reopen") : t("Resolve")}
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
ReviewThread.displayName = "ReviewThread";
