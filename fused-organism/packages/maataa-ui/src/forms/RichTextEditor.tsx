/**
 * @maataa/ui/forms/RichTextEditor
 * Formatted text with a toolbar, stored as a small Markdown subset. Editing
 * happens in a plain textarea (which every screen reader handles well);
 * Preview renders it safely as React elements (no HTML injection).
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle } from "./fieldKit";

/** Inline: **bold**, _italic_, `code`, [text](https://…) */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${keyBase}-${i++}`;
    if (t.startsWith("**")) out.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("_")) out.push(<em key={k}>{t.slice(1, -1)}</em>);
    else if (t.startsWith("`")) out.push(<code key={k}>{t.slice(1, -1)}</code>);
    else {
      const lm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t)!;
      const href = lm[2]!;
      out.push(
        /^(https?:|mailto:)/i.test(href) ? (
          <a
            key={k}
            href={href}
            rel="noopener noreferrer"
            style={{ color: colorTokens.interactive.primary }}
          >
            {lm[1]}
          </a>
        ) : (
          lm[1]
        )
      );
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Render the Markdown subset to React elements */
export function renderMarkdown(src: string): React.ReactNode {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) {
      i++;
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1]!.length + 2; // # → h3, ## → h4, ### → h5 (inside a page)
      const Tag = `h${level}` as "h3";
      blocks.push(<Tag key={k++}>{inline(h[2]!, `h${k}`)}</Tag>);
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: React.ReactNode[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/).test(lines[i]!)) {
        items.push(
          <li key={i}>{inline(lines[i]!.replace(/^\s*([-*]|\d+\.)\s+/, ""), `li${i}`)}</li>
        );
        i++;
      }
      blocks.push(ordered ? <ol key={k++}>{items}</ol> : <ul key={k++}>{items}</ul>);
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() &&
      !/^(#{1,3}\s|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]!)
    ) {
      para.push(lines[i]!);
      i++;
    }
    blocks.push(<p key={k++}>{inline(para.join(" "), `p${k}`)}</p>);
  }
  return blocks;
}

type Action = "bold" | "italic" | "heading" | "bullets" | "numbers" | "link";

const ACTIONS: { id: Action; label: string; glyph: string; key?: string }[] = [
  { id: "bold", label: msg("Bold"), glyph: "B", key: "b" },
  { id: "italic", label: msg("Italic"), glyph: "I", key: "i" },
  { id: "heading", label: msg("Heading"), glyph: "H" },
  { id: "bullets", label: msg("Bulleted list"), glyph: "•" },
  { id: "numbers", label: msg("Numbered list"), glyph: "⒈" },
  { id: "link", label: msg("Link"), glyph: "🔗", key: "k" },
];

export interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
  error?: string;
  rows?: number;
}

/**
 * RichTextEditor
 * Toolbar uses the APG toolbar pattern (one tab stop, arrow keys between
 * buttons). Ctrl/⌘+B, I and K work in the text. Write/Preview are tabs.
 */
export function RichTextEditor({
  label,
  value,
  onChange,
  hint,
  error,
  rows = 8,
}: RichTextEditorProps) {
  const t = useT();
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [focusIdx, setFocusIdx] = useState(0);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const apply = (a: Action) => {
    const ta = ref.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const sel = value.slice(s, e);
    let before = value.slice(0, s);
    let mid = sel;
    const after = value.slice(e);
    let cursorStart = s;
    let cursorEnd = e;
    const wrap = (l: string, r: string, placeholder: string) => {
      mid = `${l}${sel || placeholder}${r}`;
      cursorStart = s + l.length;
      cursorEnd = cursorStart + (sel || placeholder).length;
    };
    const linePrefix = (fn: (line: string, n: number) => string) => {
      const ls = before.lastIndexOf("\n") + 1;
      const block = value.slice(ls, e) || "";
      before = value.slice(0, ls);
      mid = block
        .split("\n")
        .map((l, n) => fn(l, n))
        .join("\n");
      cursorStart = ls;
      cursorEnd = ls + mid.length;
    };
    if (a === "bold") wrap("**", "**", "bold text");
    else if (a === "italic") wrap("_", "_", "italic text");
    else if (a === "link") {
      mid = `[${sel || "link text"}](https://)`;
      cursorStart = s + mid.length - 9;
      cursorEnd = s + mid.length - 1;
    } else if (a === "heading") linePrefix((l) => (l.startsWith("#") ? l : `## ${l}`));
    else if (a === "bullets") linePrefix((l) => (l.startsWith("- ") ? l : `- ${l}`));
    else linePrefix((l, n) => (/^\d+\.\s/.test(l) ? l : `${n + 1}. ${l}`));
    onChange(before + mid + after);
    ta.focus();
    requestAnimationFrame(() => ta.setSelectionRange(cursorStart, cursorEnd));
  };

  const tabBtn = (t: "write" | "preview", text: string) => (
    <button
      type="button"
      role="tab"
      id={`${id}-tab-${t}`}
      aria-selected={tab === t}
      aria-controls={`${id}-panel-${t}`}
      tabIndex={tab === t ? 0 : -1}
      onClick={() => setTab(t)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const next = tab === "write" ? "preview" : "write";
          setTab(next);
          document.getElementById(`${id}-tab-${next}`)?.focus();
        }
      }}
      style={{
        minHeight: 40,
        padding: "0 14px",
        border: 0,
        borderBottom: `3px solid ${tab === t ? colorTokens.interactive.primary : "transparent"}`,
        background: "transparent",
        color: tab === t ? colorTokens.text.primary : colorTokens.text.secondary,
        fontWeight: tab === t ? 600 : 400,
        font: "inherit",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );

  return (
    <FieldFrame label={label} hint={hint} error={error} id={`${id}-ta`}>
      {(ids) => (
        <div
          style={{
            border: `2px solid ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              background: colorTokens.background.secondary,
              borderBottom: `1px solid ${colorTokens.border.secondary}`,
            }}
          >
            <div role="tablist" aria-label={t("Editor view")}>
              {tabBtn("write", "Write")}
              {tabBtn("preview", "Preview")}
            </div>
            {tab === "write" && (
              <div
                role="toolbar"
                aria-label={t("Formatting")}
                aria-controls={ids.id}
                style={{ display: "flex", gap: 2, padding: 2 }}
              >
                {ACTIONS.map((a, n) => (
                  <button
                    key={a.id}
                    ref={(el) => {
                      btnRefs.current[n] = el;
                    }}
                    type="button"
                    tabIndex={n === focusIdx ? 0 : -1}
                    title={a.key ? `${t(a.label)} (Ctrl+${a.key.toUpperCase()})` : a.label}
                    aria-label={t(a.label)}
                    onClick={() => apply(a.id)}
                    onKeyDown={(e) => {
                      let next = n;
                      if (e.key === "ArrowRight") next = (n + 1) % ACTIONS.length;
                      else if (e.key === "ArrowLeft")
                        next = (n - 1 + ACTIONS.length) % ACTIONS.length;
                      else if (e.key === "Home") next = 0;
                      else if (e.key === "End") next = ACTIONS.length - 1;
                      else return;
                      e.preventDefault();
                      setFocusIdx(next);
                      btnRefs.current[next]?.focus();
                    }}
                    style={{
                      minWidth: 36,
                      minHeight: 36,
                      border: 0,
                      borderRadius: 6,
                      background: "transparent",
                      color: colorTokens.text.primary,
                      fontWeight: a.id === "bold" ? 700 : 500,
                      fontStyle: a.id === "italic" ? "italic" : undefined,
                      font: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <span aria-hidden="true">{a.glyph}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            role="tabpanel"
            id={`${id}-panel-write`}
            aria-labelledby={`${id}-tab-write`}
            hidden={tab !== "write"}
          >
            <textarea
              ref={ref}
              id={ids.id}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (!(e.ctrlKey || e.metaKey)) return;
                const a = ACTIONS.find((x) => x.key === e.key.toLowerCase());
                if (a) {
                  e.preventDefault();
                  apply(a.id);
                }
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={ids.describedBy}
              style={{
                ...controlStyle(false),
                border: 0,
                borderRadius: 0,
                width: "100%",
                resize: "vertical",
                display: "block",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div
            role="tabpanel"
            id={`${id}-panel-preview`}
            aria-labelledby={`${id}-tab-preview`}
            hidden={tab !== "preview"}
            tabIndex={0}
            style={{
              padding: spacingTokens.md,
              minHeight: rows * 20,
              color: colorTokens.text.primary,
              fontSize: typographyTokens.fontSize.md,
            }}
          >
            {value.trim() ? (
              renderMarkdown(value)
            ) : (
              <p style={{ color: colorTokens.text.secondary }}>{t("Nothing to preview yet.")}</p>
            )}
          </div>
        </div>
      )}
    </FieldFrame>
  );
}
