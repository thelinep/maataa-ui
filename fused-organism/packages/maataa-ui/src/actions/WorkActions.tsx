/**
 * @maataa/ui/actions/WorkActions
 * SaveDraftButton (with "saved 2 min ago" status and optional autosave) and
 * BulkActionBar (actions on selected rows)
 */

import React, { useEffect, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

/** "just now", "2 min ago", "at 14:05" */
export function savedAgo(savedAt: Date, now: Date = new Date()): string {
  const s = Math.round((now.getTime() - savedAt.getTime()) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  return `at ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export interface SaveDraftButtonProps {
  /** Save; resolve when done, reject on failure */
  onSave: () => Promise<void>;
  /** Unsaved changes exist */
  dirty: boolean;
  /** When the draft was last saved */
  savedAt?: Date | null;
  /** Autosave this long after the last change (ms); off when omitted */
  autosaveMs?: number;
  label?: string;
}

/**
 * SaveDraftButton
 * The status next to the button says "Unsaved changes", "Saving…", "Draft
 * saved 2 min ago" or the error, in a polite live region. Autosave never
 * steals focus.
 */
export function SaveDraftButton({
  onSave,
  dirty,
  savedAt,
  autosaveMs,
  label = "Save draft",
}: SaveDraftButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [, tick] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const save = async () => {
    setState("saving");
    try {
      await onSave();
      setState("idle");
    } catch {
      setState("error");
    }
  };

  useEffect(() => {
    if (!autosaveMs || !dirty || state === "saving") return undefined;
    timer.current = setTimeout(save, autosaveMs);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, autosaveMs]);

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const status =
    state === "saving"
      ? "Saving…"
      : state === "error"
        ? "Couldn’t save the draft. Check your connection and try again."
        : dirty
          ? autosaveMs
            ? "Unsaved changes (saves automatically)"
            : "Unsaved changes"
          : savedAt
            ? `Draft saved ${savedAgo(savedAt)}`
            : "";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacingTokens.sm,
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        onClick={save}
        disabled={state === "saving"}
        aria-busy={state === "saving" || undefined}
        style={{
          minHeight: 44,
          padding: "0 16px",
          borderRadius: 8,
          border: `1px solid ${colorTokens.border.control}`,
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
          font: "inherit",
          cursor: state === "saving" ? "progress" : "pointer",
        }}
      >
        {label}
      </button>
      <span
        role="status"
        style={{
          fontSize: typographyTokens.fontSize.sm,
          color: state === "error" ? colorTokens.interactive.error : colorTokens.text.secondary,
        }}
      >
        {status}
      </span>
    </div>
  );
}

export interface BulkAction {
  id: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export interface BulkActionBarProps {
  /** Number of selected rows */
  count: number;
  /** Plural noun @default 'items' */
  noun?: string;
  /** Singular noun @default noun minus trailing s */
  nounSingular?: string;
  actions: BulkAction[];
  onClearSelection: () => void;
  /** Total available, enables "Select all N" */
  total?: number;
  onSelectAll?: () => void;
}

/**
 * BulkActionBar
 * Appears while something is selected. A group named by the count
 * ("3 shots selected"); the count change is announced.
 */
export function BulkActionBar({
  count,
  noun = "items",
  nounSingular,
  actions,
  onClearSelection,
  total,
  onSelectAll,
}: BulkActionBarProps) {
  const one = nounSingular ?? noun.replace(/s$/, "");
  const summary = `${count} ${count === 1 ? one : noun} selected`;
  const btn = (danger?: boolean): React.CSSProperties => ({
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 8,
    border: `1px solid ${danger ? colorTokens.semantic.error.bg : colorTokens.text.inverse}`,
    background: danger ? colorTokens.semantic.error.bg : "transparent",
    color: danger ? colorTokens.semantic.error.text : colorTokens.text.inverse,
    font: "inherit",
    fontWeight: 500,
    cursor: "pointer",
  });
  const live = <VisuallyHidden role="status">{count ? summary : ""}</VisuallyHidden>;
  return (
    <>
      {live}
      {count > 0 && (
        <div
          role="group"
          aria-label={summary}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: spacingTokens.sm,
            padding: `${spacingTokens.sm} ${spacingTokens.md}`,
            borderRadius: 12,
            background: colorTokens.background.inverse,
            color: colorTokens.text.inverse,
            boxShadow: colorTokens.shadow.lg,
          }}
        >
          <span aria-hidden="true" style={{ fontWeight: 600, marginRight: spacingTokens.sm }}>
            {summary}
          </span>
          {total != null && onSelectAll && count < total && (
            <button
              type="button"
              onClick={onSelectAll}
              style={{ ...btn(), border: 0, textDecoration: "underline" }}
            >
              Select all {total}
            </button>
          )}
          <span style={{ flex: 1 }} />
          {actions.map((a) => (
            <button key={a.id} type="button" onClick={a.onClick} style={btn(a.danger)}>
              {a.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onClearSelection}
            style={{ ...btn(), border: 0, textDecoration: "underline" }}
          >
            Clear selection
          </button>
        </div>
      )}
    </>
  );
}
