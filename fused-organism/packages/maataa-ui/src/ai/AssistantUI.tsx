/**
 * @maataa/ui/ai/AssistantUI
 * AIChatBubble, AITypingIndicator and InteractionModeSwitcher
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useRef } from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface AIChatBubbleProps {
  from: "user" | "assistant";
  /** Display name, e.g. "You" / "Sochen" */
  name?: string;
  children: React.ReactNode;
  time?: string;
  /** Sources the answer relied on */
  sources?: { title: string; href?: string }[];
  /** Copy / feedback buttons etc. */
  actions?: React.ReactNode;
  /** The answer was cut off or failed */
  error?: string;
}

/**
 * AIChatBubble
 * One message as an article with a visible speaker name (never colour or side
 * alone). Assistant messages say "AI-generated" and list their sources.
 */
export function AIChatBubble({
  from,
  name,
  children,
  time,
  sources,
  actions,
  error,
}: AIChatBubbleProps) {
  const t = useT();
  const mine = from === "user";
  const who = name ?? (mine ? t("You") : t("Assistant"));
  return (
    <article
      aria-label={`${who}${time ? `, ${time}` : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: mine ? "flex-end" : "flex-start",
        gap: 2,
        maxWidth: "100%",
      }}
    >
      <span style={{ fontSize: 12, color: colorTokens.text.secondary }}>
        <strong style={{ color: colorTokens.text.primary }}>{who}</strong>
        {!mine && <span> {t("· AI-generated")}</span>}
        {time && <span> · {time}</span>}
      </span>
      <div
        style={{
          maxWidth: "min(560px, 90%)",
          padding: "10px 14px",
          borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: mine ? colorTokens.interactive.primary : colorTokens.background.secondary,
          color: mine ? colorTokens.text.inverse : colorTokens.text.primary,
          border: mine ? 0 : `1px solid ${colorTokens.border.secondary}`,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
        {error && (
          <p
            style={{
              margin: "6px 0 0",
              color: mine ? colorTokens.text.inverse : colorTokens.interactive.error,
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}
      </div>
      {sources && sources.length > 0 && (
        <details style={{ fontSize: 12 }}>
          <summary style={{ cursor: "pointer", color: colorTokens.interactive.primary }}>
            {t.plural(sources.length, "{count} source", "{count} sources")}
          </summary>
          <ol style={{ margin: "4px 0 0", paddingLeft: 18 }}>
            {sources.map((s) => (
              <li key={t(s.title)}>
                {s.href ? (
                  <a href={s.href} style={{ color: colorTokens.interactive.primary }}>
                    {t(s.title)}
                  </a>
                ) : (
                  s.title
                )}
              </li>
            ))}
          </ol>
        </details>
      )}
      {actions && <div style={{ display: "flex", gap: 4 }}>{actions}</div>}
    </article>
  );
}

/**
 * AITypingIndicator
 * Three dots while the model writes. Announced once ("Sochen is writing");
 * the dots don't animate with reduced motion. Optional Stop button.
 */
export function AITypingIndicator({
  name = "Assistant",
  onStop,
}: {
  name?: string;
  onStop?: () => void;
}) {
  const t = useT();
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: spacingTokens.sm }}>
      <style>{`@keyframes maataa-dot { 0%, 80%, 100% { opacity: .25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } } @media (prefers-reduced-motion: reduce) { .maataa-dot { animation: none !important; opacity: .7 !important; } }`}</style>
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          gap: 4,
          padding: "10px 14px",
          borderRadius: "16px 16px 16px 4px",
          background: colorTokens.background.secondary,
          border: `1px solid ${colorTokens.border.secondary}`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="maataa-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: colorTokens.text.secondary,
              animation: `maataa-dot 1.2s ${i * 0.15}s infinite ease-in-out`,
            }}
          />
        ))}
      </span>
      <span role="status" style={{ fontSize: 12, color: colorTokens.text.secondary }}>
        {t("{name} is writing…", { name })}
      </span>
      {onStop && (
        <button
          type="button"
          onClick={onStop}
          aria-label={t("Stop writing")}
          style={{
            minHeight: 32,
            padding: "0 10px",
            borderRadius: 6,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {t("Stop")}
        </button>
      )}
    </div>
  );
}

export type InteractionMode = "text" | "voice" | "sign" | "simple";

const MODES: { id: InteractionMode; label: string; icon: string; hint: string }[] = [
  { id: "text", label: msg("Type"), icon: "⌨️", hint: msg("Type and read") },
  { id: "voice", label: msg("Speak"), icon: "🎙", hint: msg("Talk and listen") },
  { id: "sign", label: msg("Sign"), icon: "🤟", hint: msg("Indian Sign Language video") },
  { id: "simple", label: msg("Simple"), icon: "🔤", hint: msg("Short answers, plain words") },
];

/**
 * InteractionModeSwitcher
 * How to talk to the assistant: type, speak, sign (ISL) or simplified. A
 * radio group with icons AND words; arrow keys move.
 */
export function InteractionModeSwitcher({
  value,
  onChange,
  available = ["text", "voice", "sign", "simple"],
}: {
  value: InteractionMode;
  onChange: (m: InteractionMode) => void;
  available?: InteractionMode[];
}) {
  const t = useT();
  const list = MODES.filter((m) => available.includes(m.id));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(
    0,
    list.findIndex((m) => m.id === value)
  );
  const go = (n: number) => {
    const k = (n + list.length) % list.length;
    onChange(list[k]!.id);
    refs.current[k]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={t("How do you want to interact?")}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${list.length}, minmax(90px, 1fr))`,
        gap: 6,
      }}
    >
      {list.map((m, i) => {
        const on = m.id === value;
        return (
          <button
            key={m.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === idx ? 0 : -1}
            onClick={() => onChange(m.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") go(i + 1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(i - 1);
              else return;
              e.preventDefault();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "10px 6px",
              borderRadius: 12,
              border: `${on ? 3 : 1}px solid ${on ? colorTokens.interactive.primary : colorTokens.border.primary}`,
              background: on ? colorTokens.background.tertiary : colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 24 }}>
              {m.icon}
            </span>
            <span style={{ fontWeight: 700 }}>{t(m.label)}</span>{" "}
            <span style={{ fontSize: 11, color: colorTokens.text.secondary, textAlign: "center" }}>
              {t(m.hint)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
