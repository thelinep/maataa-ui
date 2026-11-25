/**
 * @maataa/ui/ai/LocalChat
 * A complete chat box for a model running on your own machine (Ollama, LM
 * Studio, llama.cpp) or behind your own backend. Streams replies, can be
 * stopped, explains connection problems in plain words, and can ground its
 * answers in your documents.
 */

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { AIChatBubble, AITypingIndicator } from "./AssistantUI";
import { ChatMarkdown, type FencedBlock, type MathRenderer } from "./ChatMarkdown";
import { renderChatBlock } from "./ChatBlocks";
import { useSpeech } from "./speech";
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

/** A slash command, typed as "/name optional words". */
export interface ChatCommand {
  /** Without the slash, e.g. "model". */
  name: string;
  /** Shown in the suggestions and in /help. */
  description: string;
  /** Hint for what follows the name, e.g. "<name>". */
  args?: string;
  /** Runs the command. A returned string is shown under the chat. */
  run: (args: string) => void | string | Promise<void | string>;
}

export interface LocalChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Pictures the person attached, as data URLs. */
  images?: string[];
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
  /**
   * Slash commands. Typing "/" lists them; /clear and /help are always there.
   * Text starting with "/" that matches no command is sent as a normal message.
   */
  commands?: ChatCommand[];
  /** How many earlier messages are sent with each question. @default 20 */
  maxHistory?: number;
  /** Height of the scrolling conversation. Ignored with `fill`. @default 480 */
  height?: React.CSSProperties["height"];
  /** Fill the parent's height instead (the parent needs a set height). */
  fill?: boolean;
  /** No border or padding of its own, for placing inside an app's layout. */
  bare?: boolean;
  /** Hide the New conversation button, when the app offers its own. */
  hideNewConversation?: boolean;
  /**
   * Set when the model can't be used right now (server down, no model). Shown
   * in place of the conversation's empty state; sending is turned off.
   */
  unavailable?: React.ReactNode;
  /** Let the person attach pictures (needs a model that can see). */
  allowImages?: boolean;
  /** Format replies (Markdown, tables, charts, options, MAATAA blocks). @default true */
  richReplies?: boolean;
  /** Draw LaTeX maths in replies (e.g. with KaTeX). See ChatMarkdown. */
  renderMath?: MathRenderer;
  /** Draw extra fenced-block kinds. Return nothing to use the built-in ones. */
  renderBlock?: (block: FencedBlock) => React.ReactNode | null | undefined;
  /** Offer reading replies aloud and speaking instead of typing. */
  voice?: boolean;
  /** Extra buttons under a finished reply, e.g. "Open as artifact". */
  messageActions?: (message: LocalChatMessage) => React.ReactNode;
  /** Placeholder in the message box. */
  placeholder?: string;
  /** Called once when a reply finishes (not when it fails or is stopped). */
  onReplyDone?: (reply: LocalChatMessage, question: LocalChatMessage) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_IMAGES = 4;
const MAX_IMAGE_SIDE = 1600;

/** Reads a picture as a data URL, scaling big photos down so requests stay small. */
function shrinkImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const src = String(reader.result);
      if (file.size < 600_000 || typeof document === "undefined" || typeof Image === "undefined")
        return resolve(src);
      const img = new Image();
      img.onerror = () => resolve(src);
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
        if (scale === 1 && file.size < 1_500_000) return resolve(src);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/** Coarse-pointer (touch) screens get 44 px targets; see WCAG 2.5.5. */
const CHAT_CSS = `@media (pointer: coarse) { .mc-t { min-height: 44px !important; min-width: 44px; } }
.mc-chat textarea::placeholder { color: inherit; opacity: .65; }`;

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
  commands = [],
  maxHistory = 20,
  height = 480,
  fill = false,
  bare = false,
  hideNewConversation = false,
  unavailable,
  allowImages = false,
  richReplies = true,
  renderBlock,
  renderMath,
  voice = false,
  messageActions,
  placeholder,
  onReplyDone,
  className,
  style,
}: LocalChatProps) {
  const t = useT();
  const locale = useLocale();
  const speech = useSpeech(locale);
  const [images, setImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const draftBeforeListen = useRef("");
  const blocked = !!unavailable;
  const titleId = useId();
  const inputId = useId();
  const [messages, setMessages] = useState<LocalChatMessage[]>(initialMessages ?? []);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [notice, setNotice] = useState("");
  const [activeCommand, setActiveCommand] = useState(0);
  const [commandsDismissed, setCommandsDismissed] = useState(false);
  const listId = useId();
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

  const ask = async (question: string, history: LocalChatMessage[], pictures: string[] = []) => {
    const transport: ChatTransport | null =
      send ?? (model ? (msgs, signal) => streamChat(msgs, model, signal) : null);
    const replyId = newId();
    const userMessage: LocalChatMessage = {
      id: newId(),
      role: "user",
      content: question,
      ...(pictures.length ? { images: pictures } : {}),
    };
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
          .map((m) => ({
            role: m.role,
            content: m.content,
            ...(m.images ? { images: m.images } : {}),
          })),
        { role: "user", content: question, ...(pictures.length ? { images: pictures } : {}) },
      ];
      if (context?.sources?.length) patch({ sources: context.sources });
      for await (const piece of transport(outgoing, controller.signal)) {
        reply += piece;
        patch({ content: reply });
      }
      setAnnouncement(t("{name} replied.", { name: botName }));
      onReplyDone?.(
        {
          id: replyId,
          role: "assistant",
          content: reply,
          ...(context?.sources?.length ? { sources: context.sources } : {}),
        },
        userMessage
      );
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

  const builtIns: ChatCommand[] = [
    { name: "clear", description: t("Start a new conversation"), run: () => clear() },
    {
      name: "help",
      description: t("List the commands"),
      run: () =>
        t("Commands: {list}", {
          list: allCommands
            .map((c) => `/${c.name}${c.args ? ` ${c.args}` : ""} (${c.description})`)
            .join(", "),
        }),
    },
  ];
  const allCommands: ChatCommand[] = [
    ...commands,
    ...builtIns.filter((b) => !commands.some((c) => c.name === b.name)),
  ];
  const slash = /^\/(\S*)$/.exec(draft);
  const suggestions =
    slash && !commandsDismissed
      ? allCommands.filter((c) => c.name.toLowerCase().startsWith(slash[1].toLowerCase()))
      : [];
  const showSuggestions = suggestions.length > 0;
  const active = Math.min(activeCommand, Math.max(suggestions.length - 1, 0));

  const complete = (command: ChatCommand) => {
    setDraft(`/${command.name}${command.args ? " " : ""}`);
    setCommandsDismissed(true);
    inputRef.current?.focus();
  };

  const runCommand = async (text: string): Promise<boolean> => {
    const match = /^\/(\S+)\s*([\s\S]*)$/.exec(text);
    const command =
      match && allCommands.find((c) => c.name.toLowerCase() === match[1].toLowerCase());
    if (!command || !match) return false;
    setDraft("");
    setCommandsDismissed(false);
    try {
      const result = await command.run(match[2].trim());
      setNotice(result || t("Done: /{name}", { name: command.name }));
    } catch (error) {
      setNotice(
        t("That command didn’t work: {message}", { message: (error as Error)?.message ?? "" })
      );
    }
    inputRef.current?.focus();
    return true;
  };

  const submit = (text = draft) => {
    const question = text.trim();
    if ((!question && !images.length) || busy) return;
    if (speech.listening) speech.stopListening();
    if (question.startsWith("/") && !images.length) {
      void runCommand(question).then((handled) => {
        if (!handled) {
          setDraft("");
          void ask(question, messages);
        }
      });
      return;
    }
    if (blocked) return;
    setNotice("");
    setDraft("");
    const pictures = images;
    setImages([]);
    void ask(question || t("What’s in this picture?"), messages, pictures);
    inputRef.current?.focus();
  };

  const addImages = async (files: Iterable<File>) => {
    const picked = [...files].filter((f) => f.type.startsWith("image/"));
    if (!picked.length) return;
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setNotice(
        t.plural(
          MAX_IMAGES,
          "You can attach up to {count} picture.",
          "You can attach up to {count} pictures."
        )
      );
      return;
    }
    const read = await Promise.all(
      picked.slice(0, room).map((f) => shrinkImage(f).catch(() => null))
    );
    const ok = read.filter((x): x is string => !!x);
    if (ok.length < picked.length)
      setNotice(
        t.plural(
          MAX_IMAGES,
          "You can attach up to {count} picture.",
          "You can attach up to {count} pictures."
        )
      );
    setImages((prev) => [...prev, ...ok].slice(0, MAX_IMAGES));
    setAnnouncement(t.plural(ok.length, "{count} picture attached.", "{count} pictures attached."));
  };

  const toggleListening = () => {
    if (speech.listening) {
      speech.stopListening();
      return;
    }
    draftBeforeListen.current = draft ? `${draft.trimEnd()} ` : "";
    speech.listen((text) => setDraft(draftBeforeListen.current + text));
  };

  const retry = (replyId: string) => {
    const index = messages.findIndex((m) => m.id === replyId);
    const question = messages[index - 1];
    if (index < 1 || question?.role !== "user" || busy) return;
    void ask(question.content, messages.slice(0, index - 1), question.images);
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
  const iconButton: React.CSSProperties = {
    ...buttonStyle,
    minWidth: 40,
    minHeight: 40,
    padding: 0,
    border: 0,
    background: "transparent",
    fontSize: 18,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const smallAction: React.CSSProperties = {
    ...buttonStyle,
    minHeight: 32,
    padding: `0 ${spacingTokens.sm}`,
    fontSize: typographyTokens.fontSize.xs,
    border: `1px solid ${colorTokens.border.secondary}`,
  };
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const canSend = !busy && !blocked && (!!draft.trim() || images.length > 0);
  const showNew = !hideNewConversation && messages.length > 0;

  const blockRenderer = (m: LocalChatMessage) => (block: FencedBlock) =>
    renderBlock?.(block) ??
    renderChatBlock(block, {
      onChoose: (text) => submit(text),
      canChoose: !busy && !blocked && m === lastAssistant,
    });

  return (
    <section
      aria-labelledby={titleId}
      className={["mc-chat", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: bare ? 0 : spacingTokens.md,
        border: bare ? 0 : `1px solid ${colorTokens.border.primary}`,
        borderRadius: bare ? 0 : radiusTokens.lg,
        background: bare ? "transparent" : colorTokens.background.primary,
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        minWidth: 0,
        boxSizing: "border-box",
        ...(fill ? { height: "100%", minHeight: 0 } : {}),
        ...style,
      }}
    >
      <style>{CHAT_CSS}</style>
      {hideTitle && !showNew ? (
        <VisuallyHidden>
          <h2 id={titleId}>{heading}</h2>
        </VisuallyHidden>
      ) : (
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
          {showNew && (
            <button
              type="button"
              className="mc-t"
              onClick={clear}
              style={{ ...buttonStyle, marginLeft: hideTitle ? "auto" : 0 }}
            >
              {t("New conversation")}
            </button>
          )}
        </div>
      )}

      <div
        ref={logRef}
        role="log"
        aria-labelledby={titleId}
        aria-busy={busy}
        tabIndex={0}
        style={{
          ...(fill ? { flex: 1, minHeight: 0 } : { height }),
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.md,
          padding: spacingTokens.sm,
          borderRadius: radiusTokens.md,
          background: bare ? "transparent" : colorTokens.background.secondary,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              color: colorTokens.text.secondary,
              maxWidth: 520,
            }}
          >
            {unavailable ?? <p style={{ margin: 0 }}>{t("Ask a question to start.")}</p>}
            {!blocked && starterQuestions && starterQuestions.length > 0 && (
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
                  <li key={q} style={{ maxWidth: "100%" }}>
                    <button
                      type="button"
                      className="mc-t"
                      onClick={() => submit(q)}
                      style={{
                        ...buttonStyle,
                        maxWidth: "100%",
                        whiteSpace: "normal",
                        textAlign: "left",
                        padding: `6px ${spacingTokens.md}`,
                      }}
                    >
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
          const assistant = m.role === "assistant";
          const rich = assistant && richReplies;
          const done = !writing && !m.error && !!m.content;
          const extra = assistant && done ? messageActions?.(m) : null;
          const canRead = voice && speech.canSpeak && assistant && done;
          return (
            <AIChatBubble
              key={m.id}
              from={m.role}
              name={assistant ? botName : undefined}
              sources={assistant ? m.sources : undefined}
              error={m.error}
              wide={rich && /```|\n\|/.test(m.content)}
              actions={
                m.error ? (
                  <button
                    type="button"
                    className="mc-t"
                    onClick={() => retry(m.id)}
                    style={buttonStyle}
                  >
                    {t("Try again")}
                  </button>
                ) : canRead || extra ? (
                  <>
                    {canRead && (
                      <button
                        type="button"
                        className="mc-t"
                        aria-pressed={speech.speakingId === m.id}
                        onClick={() =>
                          speech.speakingId === m.id
                            ? speech.stopSpeaking()
                            : speech.speak(m.content, m.id)
                        }
                        style={smallAction}
                      >
                        {speech.speakingId === m.id ? t("Stop reading") : t("Read aloud")}
                      </button>
                    )}
                    {extra}
                  </>
                ) : undefined
              }
            >
              {m.images && m.images.length > 0 && (
                <span
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: m.content ? 6 : 0,
                  }}
                >
                  {m.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={t("Attached picture {n}", { n: i + 1 })}
                      style={{
                        maxWidth: 160,
                        maxHeight: 160,
                        borderRadius: radiusTokens.md,
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </span>
              )}
              {rich ? (
                <ChatMarkdown
                  renderBlock={blockRenderer(m)}
                  renderMath={renderMath}
                  style={{ whiteSpace: "normal" }}
                >
                  {m.content}
                </ChatMarkdown>
              ) : (
                m.content
              )}
              {m.stopped && (
                <span style={{ color: colorTokens.text.secondary }}> {t("(stopped)")}</span>
              )}
            </AIChatBubble>
          );
        })}
        {busy && <AITypingIndicator name={botName} />}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        onDragOver={
          allowImages && !blocked
            ? (e) => {
                if ([...e.dataTransfer.types].includes("Files")) {
                  e.preventDefault();
                  setDragging(true);
                }
              }
            : undefined
        }
        onDragLeave={allowImages ? () => setDragging(false) : undefined}
        onDrop={
          allowImages && !blocked
            ? (e) => {
                e.preventDefault();
                setDragging(false);
                void addImages(e.dataTransfer.files);
              }
            : undefined
        }
        style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative" }}
      >
        {showSuggestions && (
          <ul
            id={listId}
            role="listbox"
            aria-label={t("Commands")}
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              right: 0,
              margin: "0 0 4px",
              padding: 4,
              listStyle: "none",
              background: colorTokens.background.primary,
              border: `1px solid ${colorTokens.border.control}`,
              borderRadius: radiusTokens.md,
              boxShadow: colorTokens.shadow.md,
              zIndex: 5,
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            {suggestions.map((c, i) => (
              <li
                key={c.name}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className="mc-t"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => complete(c)}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: `0 ${spacingTokens.sm}`,
                  alignItems: "baseline",
                  minHeight: 32,
                  padding: `4px ${spacingTokens.sm}`,
                  borderRadius: radiusTokens.sm,
                  cursor: "pointer",
                  background: i === active ? colorTokens.background.tertiary : undefined,
                }}
              >
                <code style={{ fontWeight: 700 }}>
                  /{c.name}
                  {c.args ? ` ${c.args}` : ""}
                </code>
                <span
                  style={{
                    color: colorTokens.text.secondary,
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  {c.description}
                </span>
              </li>
            ))}
          </ul>
        )}
        <VisuallyHidden>
          <label htmlFor={inputId}>{t("Your message")}</label>
        </VisuallyHidden>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 4,
            border: `${dragging ? 2 : 1}px ${dragging ? "dashed" : "solid"} ${dragging ? colorTokens.interactive.primary : colorTokens.border.control}`,
            borderRadius: radiusTokens.lg,
            background: colorTokens.background.primary,
          }}
        >
          {images.length > 0 && (
            <ul
              aria-label={t("Attached pictures")}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                listStyle: "none",
                margin: 0,
                padding: 4,
              }}
            >
              {images.map((src, i) => (
                <li key={i} style={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={t("Attached picture {n}", { n: i + 1 })}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: radiusTokens.md,
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    className="mc-t"
                    aria-label={t("Remove picture {n}", { n: i + 1 })}
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      minHeight: 24,
                      borderRadius: 999,
                      border: `1px solid ${colorTokens.border.control}`,
                      background: colorTokens.background.primary,
                      color: colorTokens.text.primary,
                      cursor: "pointer",
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
            {allowImages && (
              <>
                <button
                  type="button"
                  className="mc-t"
                  aria-label={t("Attach a picture")}
                  title={t("Attach a picture")}
                  disabled={blocked || images.length >= MAX_IMAGES}
                  onClick={() => fileRef.current?.click()}
                  style={{ ...iconButton, opacity: blocked ? 0.5 : 1 }}
                >
                  <span aria-hidden="true">＋</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={(e) => {
                    if (e.target.files) void addImages(e.target.files);
                    e.target.value = "";
                  }}
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    opacity: 0,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                />
              </>
            )}
            <textarea
              ref={inputRef}
              id={inputId}
              className="mc-t"
              rows={1}
              value={draft}
              placeholder={placeholder ?? t("Message {name}…", { name: botName })}
              onChange={(event) => {
                setDraft(event.target.value);
                setCommandsDismissed(false);
                setActiveCommand(0);
                const el = event.target;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
              }}
              onPaste={
                allowImages && !blocked
                  ? (e) => {
                      const files = [...e.clipboardData.items]
                        .filter((it) => it.kind === "file")
                        .map((it) => it.getAsFile())
                        .filter((f): f is File => !!f && f.type.startsWith("image/"));
                      if (files.length) {
                        e.preventDefault();
                        void addImages(files);
                      }
                    }
                  : undefined
              }
              aria-autocomplete={allCommands.length ? "list" : undefined}
              aria-controls={showSuggestions ? listId : undefined}
              aria-activedescendant={showSuggestions ? `${listId}-${active}` : undefined}
              onKeyDown={(event) => {
                if (showSuggestions) {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    const d = event.key === "ArrowDown" ? 1 : -1;
                    setActiveCommand((active + d + suggestions.length) % suggestions.length);
                    return;
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setCommandsDismissed(true);
                    return;
                  }
                  if (
                    (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey)) &&
                    !event.nativeEvent.isComposing
                  ) {
                    const pick = suggestions[active]!;
                    event.preventDefault();
                    if (event.key === "Enter" && !pick.args) {
                      submit(`/${pick.name}`);
                      return;
                    }
                    complete(pick);
                    return;
                  }
                }
                if (event.key === "Escape" && busy) {
                  event.preventDefault();
                  abortRef.current?.abort();
                  return;
                }
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit();
                }
              }}
              aria-describedby={`${inputId}-hint`}
              style={{
                flex: 1,
                minWidth: 0,
                resize: "none",
                minHeight: 40,
                maxHeight: 200,
                padding: "9px 8px",
                border: 0,
                outlineOffset: 2,
                borderRadius: radiusTokens.md,
                background: "transparent",
                color: colorTokens.text.primary,
                font: "inherit",
                lineHeight: 1.4,
                boxSizing: "border-box",
              }}
            />
            {voice && speech.canListen && (
              <button
                type="button"
                className="mc-t"
                aria-label={speech.listening ? t("Stop listening") : t("Speak your message")}
                aria-pressed={speech.listening}
                title={speech.listening ? t("Stop listening") : t("Speak your message")}
                disabled={blocked || busy}
                onClick={toggleListening}
                style={{
                  ...iconButton,
                  color: speech.listening
                    ? colorTokens.interactive.error
                    : colorTokens.text.primary,
                  opacity: blocked || busy ? 0.5 : 1,
                }}
              >
                <span aria-hidden="true">{speech.listening ? "■" : "🎙"}</span>
              </button>
            )}
            {busy ? (
              <button
                type="button"
                className="mc-t"
                onClick={() => abortRef.current?.abort()}
                style={{
                  ...buttonStyle,
                  minHeight: 40,
                  border: `1px solid ${colorTokens.interactive.primary}`,
                  fontWeight: 600,
                }}
              >
                <span aria-hidden="true">■ </span>
                {t("Stop writing")}
              </button>
            ) : (
              <button
                type="submit"
                className="mc-t"
                disabled={!canSend}
                style={{
                  ...buttonStyle,
                  minHeight: 40,
                  border: 0,
                  background: canSend
                    ? colorTokens.interactive.primary
                    : colorTokens.background.tertiary,
                  color: canSend ? colorTokens.text.inverse : colorTokens.text.secondary,
                  fontWeight: 600,
                  cursor: canSend ? "pointer" : "not-allowed",
                }}
              >
                {t("Send")}
              </button>
            )}
          </div>
        </div>
        <span
          id={`${inputId}-hint`}
          className="mc-hint"
          style={{
            fontSize: typographyTokens.fontSize.xs,
            color: colorTokens.text.secondary,
            paddingLeft: 4,
          }}
        >
          {blocked
            ? t("Sending is off until the model is available.")
            : allCommands.length > 2 || commands.length
              ? t("Enter sends · Shift+Enter adds a line · / for commands")
              : t("Enter sends · Shift+Enter adds a line")}
        </span>
      </form>
      <p
        role="status"
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
          ...(notice ? {} : { position: "absolute", width: 1, height: 1, overflow: "hidden" }),
        }}
      >
        {notice}
      </p>
      <VisuallyHidden>
        <span role="status">
          {showSuggestions
            ? t.plural(suggestions.length, "{count} command matches", "{count} commands match")
            : speech.listening
              ? t("Listening…")
              : announcement}
        </span>
      </VisuallyHidden>
    </section>
  );
}

LocalChat.displayName = "LocalChat";
