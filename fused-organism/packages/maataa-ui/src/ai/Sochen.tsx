/**
 * @maataa/ui/ai/Sochen
 * Sochen: write a thought, get a model response, keep a history
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { CopyButton } from "../actions/CopyButton";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

/* ---------- Thought input ---------- */

export interface ThoughtInputProps {
  onSubmit: (text: string) => void;
  busy?: boolean;
  /** Blocks input with a reason (see ModelConfiguredCheck) */
  disabledReason?: string;
  /** @default 4000 */
  maxLength?: number;
  placeholder?: string;
  label?: string;
}

/**
 * ThoughtInput
 * Labelled textarea with a character count; Ctrl/⌘+Enter sends. While a
 * response is coming, the button shows progress and input stays editable.
 */
export function ThoughtInput({
  onSubmit,
  busy,
  disabledReason,
  maxLength = 4000,
  placeholder: placeholderProp,
  label: labelProp,
}: ThoughtInputProps) {
  const tx = useT();
  const label = labelProp ?? tx("What are you thinking about?");
  const placeholder = placeholderProp ?? tx("A scene idea, a doubt, a question about your script…");
  const id = useId();
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim() || busy || disabledReason) return;
    onSubmit(text.trim());
    setText("");
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}
    >
      <label htmlFor={`${id}-t`} style={{ fontWeight: 600 }}>
        {label}
      </label>
      <textarea
        id={`${id}-t`}
        rows={4}
        value={text}
        maxLength={maxLength}
        disabled={Boolean(disabledReason)}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            send();
          }
        }}
        aria-describedby={`${id}-h`}
        style={{
          padding: spacingTokens.sm,
          border: `2px solid ${colorTokens.border.control}`,
          borderRadius: 8,
          font: "inherit",
          background: disabledReason
            ? colorTokens.background.tertiary
            : colorTokens.background.primary,
          color: colorTokens.text.primary,
          resize: "vertical",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: spacingTokens.sm,
        }}
      >
        <span
          id={`${id}-h`}
          style={{
            fontSize: typographyTokens.fontSize.xs,
            color: disabledReason ? colorTokens.interactive.warning : colorTokens.text.secondary,
          }}
        >
          {disabledReason ??
            tx("{length} / {maxLength} · Ctrl+Enter to send", { length: text.length, maxLength })}
        </span>
        <Button
          type="submit"
          disabled={!text.trim() || busy || Boolean(disabledReason)}
          aria-busy={busy || undefined}
        >
          {busy ? tx("Thinking…") : tx("Send")}
        </Button>
      </div>
    </form>
  );
}
ThoughtInput.displayName = "ThoughtInput";

/* ---------- Model response ---------- */

export interface ModelResponseProps {
  /** The thought it answers */
  prompt: string;
  /** Text so far (may still be streaming) */
  text: string;
  /** Still generating */
  streaming?: boolean;
  /** e.g. "Claude Sonnet 5.5" */
  model?: string;
  error?: string;
  onRetry?: () => void;
  onStop?: () => void;
  at?: Date;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * ModelResponse
 * Streaming text is not announced word by word: a status says "Writing a
 * response…" then "Response ready", so screen readers aren't flooded. The
 * text is labelled as AI-written. Paragraphs split on blank lines.
 */
export function ModelResponse({
  prompt,
  text,
  streaming,
  model,
  error,
  onRetry,
  onStop,
  at,
  locale: localeProp,
}: ModelResponseProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const status = error ? "" : streaming ? "Writing a response…" : text ? "Response ready" : "";
  return (
    <article
      aria-label={tx("Response to: {value}", { value: prompt.slice(0, 80) })}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        padding: spacingTokens.md,
        background: colorTokens.background.primary,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <div
        style={{
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
          borderLeft: `3px solid ${colorTokens.border.control}`,
          paddingLeft: spacingTokens.sm,
        }}
      >
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {tx("You asked:")}
        </span>
        {prompt}
      </div>
      <div
        role="status"
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacingTokens.xs,
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        {streaming && <span aria-hidden="true">●</span>}
        {status}
      </div>
      {error ? (
        <div role="alert" style={{ color: colorTokens.interactive.error }}>
          {error}
          {onRetry && (
            <div style={{ marginTop: spacingTokens.xs }}>
              <Button variant="secondary" size="sm" onClick={onRetry}>
                {tx("Try again")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div aria-busy={streaming || undefined} style={{ lineHeight: 1.55 }}>
          {text.split(/\n\s*\n/).map((p, i) => (
            <p key={i} style={{ margin: `0 0 ${spacingTokens.sm}`, whiteSpace: "pre-wrap" }}>
              {p}
            </p>
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: spacingTokens.sm,
          flexWrap: "wrap",
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        <span>
          {[
            model ? tx("AI-written by {model}", { model }) : tx("AI-written"),
            at ? at.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" }) : null,
            tx("check before you use it"),
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
        <span style={{ display: "flex", gap: spacingTokens.xs }}>
          {streaming && onStop && (
            <Button variant="tertiary" size="sm" onClick={onStop}>
              {tx("Stop")}
            </Button>
          )}
          {!streaming && text && <CopyButton value={text} what="response" size="sm" />}
        </span>
      </div>
    </article>
  );
}
ModelResponse.displayName = "ModelResponse";

/* ---------- Model configured check ---------- */

export interface ModelConfiguredCheckProps {
  configured: boolean;
  /** Why not, e.g. "No API key" */
  reason?: string;
  /** Only admins can fix it */
  canConfigure?: boolean;
  onConfigure?: () => void;
  children: React.ReactNode;
}

/**
 * ModelConfiguredCheck
 * Renders its children when a model is set up; otherwise a clear notice
 * with who can fix it. Children are not rendered, so nothing looks usable
 * that isn't.
 */
export function ModelConfiguredCheck({
  configured,
  reason,
  canConfigure,
  onConfigure,
  children,
}: ModelConfiguredCheckProps) {
  const tx = useT();
  if (configured) return <>{children}</>;
  return (
    <div
      role="status"
      style={{
        border: `1px dashed ${colorTokens.interactive.warning}`,
        borderRadius: 10,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <strong>{tx("Sochen isn’t set up yet")}</strong>
      <span style={{ color: colorTokens.text.secondary }}>
        {reason ? `${reason}. ` : ""}
        {canConfigure
          ? tx("Connect a model to start using it.")
          : tx("Ask your workspace admin to connect a model.")}
      </span>
      {canConfigure && onConfigure && (
        <div>
          <Button onClick={onConfigure}>{tx("Set up a model")}</Button>
        </div>
      )}
    </div>
  );
}
ModelConfiguredCheck.displayName = "ModelConfiguredCheck";

/* ---------- Thought history ---------- */

export interface ThoughtRecord {
  id: string;
  text: string;
  at: Date;
  /** Short start of the response */
  preview?: string;
  pinned?: boolean;
}

export interface ThoughtHistoryProps {
  thoughts: ThoughtRecord[];
  onOpen: (t: ThoughtRecord) => void;
  onDelete?: (id: string) => void;
  activeId?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * ThoughtHistory
 * Searchable list, pinned first then newest. Delete buttons name the thought.
 */
export function ThoughtHistory({
  thoughts,
  onOpen,
  onDelete,
  activeId,
  locale: localeProp,
}: ThoughtHistoryProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const [q, setQ] = useState("");
  const shown = thoughts
    .filter(
      (t) =>
        !q.trim() ||
        (t.text + " " + (t.preview ?? "")).toLowerCase().includes(q.trim().toLowerCase())
    )
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.getTime() - a.at.getTime());
  return (
    <nav
      aria-label={tx("Past thoughts")}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}
    >
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: typographyTokens.fontSize.sm,
          fontWeight: 600,
        }}
      >
        {tx("Search past thoughts")}
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: 6,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontWeight: 400,
          }}
        />
      </label>
      <span
        role="status"
        style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
      >
        {q.trim() ? `${shown.length} found` : `${thoughts.length} thoughts`}
      </span>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {shown.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              gap: 4,
              alignItems: "flex-start",
              borderBottom: `1px solid ${colorTokens.border.primary}`,
            }}
          >
            <button
              type="button"
              onClick={() => onOpen(t)}
              aria-current={t.id === activeId ? "page" : undefined}
              style={{
                flex: 1,
                minWidth: 0,
                textAlign: "left",
                padding: "6px 4px",
                border: "none",
                background: t.id === activeId ? colorTokens.background.tertiary : "transparent",
                cursor: "pointer",
                font: "inherit",
                color: colorTokens.text.primary,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t.pinned && <span aria-hidden="true">📌 </span>}
                {t.pinned && (
                  <span
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      clip: "rect(0 0 0 0)",
                    }}
                  >
                    {tx("Pinned:")}
                  </span>
                )}
                {t.pinned && " "}
                {t.text}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {t.at.toLocaleString(locale, {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {t.preview ? ` · ${t.preview}` : ""}
              </span>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(t.id)}
                aria-label={tx("Delete thought: {value}", { value: t.text.slice(0, 60) })}
                style={{
                  minWidth: 30,
                  minHeight: 30,
                  marginTop: 4,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: colorTokens.text.secondary,
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
ThoughtHistory.displayName = "ThoughtHistory";
