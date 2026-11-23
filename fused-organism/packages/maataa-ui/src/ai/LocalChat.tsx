/**
 * @maataa/ui/ai/LocalChat
 * A complete chat box for a model running on your own machine (Ollama, LM
 * Studio, llama.cpp) or behind your own backend. Streams replies, can be
 * stopped, explains connection problems in plain words, and can ground its
 * answers in your documents.
 */

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useT } from "../i18n/LocaleProvider";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { AIChatBubble, AITypingIndicator } from "./AssistantUI";
import {
  DEFAULT_LOCAL_MODEL_URL,
  LocalModelError,
  streamChat,
  type ChatMessage,
  type LocalModelOptions,
} from "./localModel";

/** Sends the conversation somewhere and streams back the reply. */
export type ChatTransport = (messages: ChatMessage[], signal: AbortSignal) => AsyncIterable<string>;

/** Passages that help answer a question, e.g. from a docs search. */
export interface ChatContext {
  /** Text added to the system prompt for this question. */
  text: string;
  /** Shown under the answer as its sources. */
  sources?: { title: string; href?: string }[];
}

export interface LocalChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; href?: string }[];
  error?: string;
  stopped?: boolean;
}

export interface LocalChatProps {
  /** Talk straight to a local model server. Give this or `send`. */
  model?: LocalModelOptions;
  /** Any other transport, e.g. your own backend route. Wins over `model`. */
  send?: ChatTransport;
  /** Instructions sent before the conversation. */
  systemPrompt?: string;
  /** Looks up passages for each question (retrieval). */
  getContext?: (question: string) => ChatContext | Promise<ChatContext>;
  /** Heading, also the conversation's accessible name. @default "Chat" */
  title?: string;
  /** Hide the visible heading (it stays the accessible name). */
  hideTitle?: boolean;
  /** Name shown on replies. @default "Assistant" */
  assistantName?: string;
  /** Example questions offered while the conversation is empty. */
  starterQuestions?: string[];
  initialMessages?: LocalChatMessage[];
  onMessagesChange?: (messages: LocalChatMessage[]) => void;
  /** How many earlier messages are sent with each question. @default 20 */
  maxHistory?: number;
  /** Height of the scrolling conversation. @default 480 */
  height?: React.CSSProperties["height"];
  className?: string;
  style?: React.CSSProperties;
}

let nextId = 0;
const newId = () => `m${Date.now().toString(36)}${(nextId++).toString(36)}`;

/**
 * LocalChat
 *
 * @example
 * ```tsx
 * <LocalChat model={{ model: "llama3.2" }} />
 * <LocalChat send={(messages, signal) => myBackendStream(messages, signal)} />
 * ```
 */
export function LocalChat({
  model,
  send,
  systemPrompt,
  getContext,
  title,
  hideTitle = false,
  assistantName,
  starterQuestions,
  initialMessages,
  onMessagesChange,
  maxHistory = 20,
  height = 480,
  className,
  style,
}: LocalChatProps) {
  const t = useT();
  const titleId = useId();
  const inputId = useId();
  const [messages, setMessages] = useState<LocalChatMessage[]>(initialMessages ?? []);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const heading = title ?? t("Chat");
  const botName = assistantName ?? t("Assistant");

  const update = useCallback(
    (fn: (prev: LocalChatMessage[]) => LocalChatMessage[]) =>
      setMessages((prev) => {
        const next = fn(prev);
        onMessagesChange?.(next);
        return next;
      }),
    [onMessagesChange]
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const log = logRef.current;
    if (log && typeof log.scrollTo === "function") log.scrollTo({ top: log.scrollHeight });
  }, [messages, busy]);

  const describeError = (error: unknown): string => {
    if (error instanceof LocalModelError) {
      if (error.kind === "unreachable")
        return t(
          "Can’t reach the model at {url}. Check that it’s running (for Ollama: ollama serve).",
          {
            url: model?.baseUrl ?? DEFAULT_LOCAL_MODEL_URL,
          }
        );
      if (error.kind === "model-missing")
        return t("The model {model} isn’t installed. For Ollama, run: ollama pull {model}", {
          model: model?.model ?? "",
        });
      return t("The model stopped with an error: {message}", { message: error.message });
    }
    return t("The model stopped with an error: {message}", {
      message: (error as Error)?.message ?? String(error),
    });
  };

  const ask = async (question: string, history: LocalChatMessage[]) => {
    const transport: ChatTransport | null =
      send ?? (model ? (msgs, signal) => streamChat(msgs, model, signal) : null);
    const replyId = newId();
    const userMessage: LocalChatMessage = { id: newId(), role: "user", content: question };
    update(() => [...history, userMessage, { id: replyId, role: "assistant", content: "" }]);
    setBusy(true);
    setAnnouncement("");
    const controller = new AbortController();
    abortRef.current = controller;
    const patch = (changes: Partial<LocalChatMessage>) =>
      update((prev) => prev.map((m) => (m.id === replyId ? { ...m, ...changes } : m)));

    let reply = "";
    try {
      if (!transport) throw new Error(t("No model is set up for this chat."));
      const context = getContext ? await getContext(question) : undefined;
      const system = [systemPrompt, context?.text].filter(Boolean).join("\n\n");
      const outgoing: ChatMessage[] = [
        ...(system ? [{ role: "system" as const, content: system }] : []),
        ...history
          .filter((m) => !m.error && m.content)
          .slice(-maxHistory)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: question },
      ];
      if (context?.sources?.length) patch({ sources: context.sources });
      for await (const piece of transport(outgoing, controller.signal)) {
        reply += piece;
        patch({ content: reply });
      }
      setAnnouncement(t("{name} replied.", { name: botName }));
    } catch (error) {
      if ((error as Error)?.name === "AbortError" || controller.signal.aborted) {
        patch({ content: reply, stopped: true });
        setAnnouncement(t("Stopped."));
      } else {
        const text = describeError(error);
        patch({ content: reply, error: text });
        setAnnouncement(text);
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  };

  const submit = (text = draft) => {
    const question = text.trim();
    if (!question || busy) return;
    setDraft("");
    void ask(question, messages);
    inputRef.current?.focus();
  };

  const retry = (replyId: string) => {
    const index = messages.findIndex((m) => m.id === replyId);
    const question = messages[index - 1];
    if (index < 1 || question?.role !== "user" || busy) return;
    void ask(question.content, messages.slice(0, index - 1));
  };

  const clear = () => {
    abortRef.current?.abort();
    update(() => []);
    setAnnouncement(t("Conversation cleared."));
    inputRef.current?.focus();
  };

  const buttonStyle: React.CSSProperties = {
    minHeight: 36,
    padding: `0 ${spacingTokens.md}`,
    borderRadius: radiusTokens.md,
    border: `1px solid ${colorTokens.border.control}`,
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
    font: "inherit",
    fontSize: typographyTokens.fontSize.sm,
    cursor: "pointer",
  };

  return (
    <section
      aria-labelledby={titleId}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.md,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: radiusTokens.lg,
        background: colorTokens.background.primary,
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm }}>
        {hideTitle ? (
          <VisuallyHidden>
            <h2 id={titleId}>{heading}</h2>
          </VisuallyHidden>
        ) : (
          <h2 id={titleId} style={{ margin: 0, flex: 1, fontSize: typographyTokens.fontSize.xl }}>
            {heading}
          </h2>
        )}
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clear}
            style={{ ...buttonStyle, marginLeft: hideTitle ? "auto" : 0 }}
          >
            {t("New conversation")}
          </button>
        )}
      </div>

      <div
        ref={logRef}
        role="log"
        aria-labelledby={titleId}
        aria-busy={busy}
        tabIndex={0}
        style={{
          height,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.md,
          padding: spacingTokens.sm,
          borderRadius: radiusTokens.md,
          background: colorTokens.background.secondary,
        }}
      >
        {messages.length === 0 && (
          <div style={{ margin: "auto", textAlign: "center", color: colorTokens.text.secondary }}>
            <p style={{ margin: 0 }}>{t("Ask a question to start.")}</p>
            {starterQuestions && starterQuestions.length > 0 && (
              <ul
                aria-label={t("Example questions")}
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: `${spacingTokens.sm} 0 0`,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: spacingTokens.xs,
                  justifyContent: "center",
                }}
              >
                {starterQuestions.map((q) => (
                  <li key={q}>
                    <button type="button" onClick={() => submit(q)} style={buttonStyle}>
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {messages.map((m) => {
          const writing = busy && m.role === "assistant" && m === messages[messages.length - 1];
          if (writing && !m.content) return null;
          return (
            <AIChatBubble
              key={m.id}
              from={m.role}
              name={m.role === "assistant" ? botName : undefined}
              sources={m.role === "assistant" ? m.sources : undefined}
              error={m.error}
              actions={
                m.error ? (
                  <button type="button" onClick={() => retry(m.id)} style={buttonStyle}>
                    {t("Try again")}
                  </button>
                ) : undefined
              }
            >
              {m.content}
              {m.stopped && (
                <span style={{ color: colorTokens.text.secondary }}> {t("(stopped)")}</span>
              )}
            </AIChatBubble>
          );
        })}
        {busy && <AITypingIndicator name={botName} onStop={() => abortRef.current?.abort()} />}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-end" }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <label
            htmlFor={inputId}
            style={{ fontSize: typographyTokens.fontSize.sm, fontWeight: 600 }}
          >
            {t("Your message")}
          </label>
          <textarea
            ref={inputRef}
            id={inputId}
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit();
              }
            }}
            aria-describedby={`${inputId}-hint`}
            style={{
              resize: "vertical",
              minHeight: 48,
              padding: spacingTokens.sm,
              border: `1px solid ${colorTokens.border.control}`,
              borderRadius: radiusTokens.md,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
            }}
          />
          <span
            id={`${inputId}-hint`}
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
          >
            {t("Enter sends · Shift+Enter adds a line")}
          </span>
        </div>
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          style={{
            ...buttonStyle,
            minHeight: 48,
            border: 0,
            background:
              busy || !draft.trim()
                ? colorTokens.background.tertiary
                : colorTokens.interactive.primary,
            color: busy || !draft.trim() ? colorTokens.text.secondary : colorTokens.text.inverse,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {t("Send")}
        </button>
      </form>
      <VisuallyHidden>
        <span role="status">{announcement}</span>
      </VisuallyHidden>
    </section>
  );
}

LocalChat.displayName = "LocalChat";
