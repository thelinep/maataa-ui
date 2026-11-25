/**
 * @maataa/ui/ai/ChatMarkdown
 * Shows a model's reply as formatted text: headings, lists, checklists,
 * tables, quotes, links and code. It never injects HTML, so a reply can't run
 * scripts or load anything. Works while the reply is still streaming in.
 */

import React, { useState } from "react";
import { useT } from "../i18n/LocaleProvider";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";

/** A fenced code block, e.g. ```chart title="Budget"``` */
export interface FencedBlock {
  /** The word after the fence, lower-cased, e.g. "tsx", "chart". Empty when none. */
  lang: string;
  /** key="value" pairs after the language, e.g. { title: "Budget" } */
  meta: Record<string, string>;
  code: string;
  /** False while the reply is still streaming and the fence hasn't closed. */
  closed: boolean;
}

export interface ChatMarkdownProps {
  children: string;
  /**
   * Draw a fenced block yourself (charts, call sheets, choices…). Return
   * nothing to fall back to an ordinary code block.
   */
  renderBlock?: (block: FencedBlock) => React.ReactNode | null | undefined;
  className?: string;
  style?: React.CSSProperties;
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; level: number; text: string }
  | { kind: "hr" }
  | { kind: "quote"; text: string }
  | { kind: "code"; block: FencedBlock }
  | { kind: "list"; ordered: boolean; start: number; items: ListItem[] }
  | {
      kind: "table";
      head: string[];
      align: ("left" | "right" | "center" | undefined)[];
      rows: string[][];
    };

interface ListItem {
  text: string;
  checked?: boolean;
  depth: number;
}

/** Reads `chart title="Q1 budget" type=bar` into a language and its settings. */
export function parseFenceInfo(info: string): { lang: string; meta: Record<string, string> } {
  const trimmed = info.trim();
  const lang = (/^[^\s{]+/.exec(trimmed)?.[0] ?? "").toLowerCase();
  const meta: Record<string, string> = {};
  const re = /([\w-]+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trimmed.slice(lang.length)))) meta[m[1]!] = m[2] ?? m[3] ?? m[4] ?? "";
  return { lang, meta };
}

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

const isTableDivider = (line: string) =>
  /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
const listRe = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;

/** Splits markdown into blocks. Exported for tests and for finding blocks. */
export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = /^\s*(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      const marker = fence[1]!;
      const body: string[] = [];
      i++;
      let closed = false;
      while (i < lines.length) {
        if (
          lines[i]!.trim().startsWith(marker[0]!.repeat(marker.length)) &&
          !lines[i]!.trim().slice(marker.length).trim()
        ) {
          closed = true;
          i++;
          break;
        }
        body.push(lines[i]!);
        i++;
      }
      blocks.push({
        kind: "code",
        block: { ...parseFenceInfo(fence[2] ?? ""), code: body.join("\n"), closed },
      });
      continue;
    }
    const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      blocks.push({ kind: "h", level: heading[1]!.length, text: heading[2]! });
      i++;
      continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      blocks.push({ kind: "hr" });
      i++;
      continue;
    }
    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i]!))
        body.push(lines[i++]!.replace(/^\s*>\s?/, ""));
      blocks.push({ kind: "quote", text: body.join("\n") });
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1]!)) {
      const head = splitRow(line);
      const align = splitRow(lines[i + 1]!).map((c) =>
        c.startsWith(":") && c.endsWith(":")
          ? "center"
          : c.endsWith(":")
            ? "right"
            : c.startsWith(":")
              ? "left"
              : undefined
      );
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.includes("|") && lines[i]!.trim())
        rows.push(splitRow(lines[i++]!));
      blocks.push({ kind: "table", head, align, rows });
      continue;
    }
    const first = listRe.exec(line);
    if (first) {
      const ordered = /\d/.test(first[2]!);
      const items: ListItem[] = [];
      const baseIndent = first[1]!.length;
      while (i < lines.length) {
        const m = listRe.exec(lines[i]!);
        if (m) {
          if (/\d/.test(m[2]!) !== ordered && m[1]!.length <= baseIndent) break;
          const task = /^\[([ xX])\]\s+(.*)$/.exec(m[3]!);
          items.push({
            text: task ? task[2]! : m[3]!,
            checked: task ? task[1] !== " " : undefined,
            depth: Math.min(3, Math.floor(Math.max(0, m[1]!.length - baseIndent) / 2)),
          });
          i++;
        } else if (lines[i]!.trim() && /^\s{2,}/.test(lines[i]!) && items.length) {
          items[items.length - 1]!.text += " " + lines[i]!.trim();
          i++;
        } else break;
      }
      blocks.push({ kind: "list", ordered, start: ordered ? parseInt(first[2]!, 10) : 1, items });
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() &&
      !/^\s*(`{3,}|~{3,})/.test(lines[i]!) &&
      !/^#{1,6}\s/.test(lines[i]!) &&
      !/^\s*>/.test(lines[i]!) &&
      !(para.length && listRe.test(lines[i]!)) &&
      !(lines[i]!.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1]!))
    )
      para.push(lines[i++]!);
    blocks.push({ kind: "p", text: para.join("\n") });
  }
  return blocks;
}

/** Every fenced block in a reply, in order. */
export function findFencedBlocks(source: string): FencedBlock[] {
  return parseMarkdown(source).flatMap((b) => (b.kind === "code" ? [b.block] : []));
}

const safeHref = (href: string) => (/^(https?:|mailto:)/i.test(href.trim()) ? href.trim() : null);

/** Inline formatting: `code`, **bold**, *italic*, ~~struck~~, [links](https://…). */
export function renderInline(text: string, keyPrefix = "i"): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re =
    /(`+)([\s\S]+?)\1|\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|~~([\s\S]+?)~~|\*([^*\s][^*]*?)\*|(?<![\w])_([^_\s][^_]*?)_(?![\w])|\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])|(\n)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${n++}`;
    if (m[2] !== undefined)
      out.push(
        <code
          key={key}
          style={{
            fontFamily: typographyTokens.fontFamily.mono,
            fontSize: "0.92em",
            padding: "0 4px",
            borderRadius: radiusTokens.sm,
            background: colorTokens.background.tertiary,
          }}
        >
          {m[2]}
        </code>
      );
    else if (m[3] !== undefined || m[4] !== undefined)
      out.push(<strong key={key}>{renderInline(m[3] ?? m[4]!, key)}</strong>);
    else if (m[5] !== undefined) out.push(<s key={key}>{renderInline(m[5], key)}</s>);
    else if (m[6] !== undefined || m[7] !== undefined)
      out.push(<em key={key}>{renderInline(m[6] ?? m[7]!, key)}</em>);
    else if (m[8] !== undefined) {
      const href = safeHref(m[9]!);
      out.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colorTokens.interactive.primary }}
          >
            {renderInline(m[8], key)}
          </a>
        ) : (
          <React.Fragment key={key}>{renderInline(m[8], key)}</React.Fragment>
        )
      );
    } else if (m[10] !== undefined)
      out.push(
        <a
          key={key}
          href={m[10]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colorTokens.interactive.primary }}
        >
          {m[10]}
        </a>
      );
    else if (m[11] !== undefined) out.push(<br key={key} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** A code block with its language and a Copy button. */
export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <figure
      style={{
        margin: 0,
        border: `1px solid ${colorTokens.border.secondary}`,
        borderRadius: radiusTokens.md,
        overflow: "hidden",
      }}
    >
      <figcaption
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacingTokens.sm,
          padding: `2px 2px 2px ${spacingTokens.sm}`,
          background: colorTokens.background.tertiary,
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        <span>{lang || t("Code")}</span>
        <button
          type="button"
          className="mc-t"
          onClick={() => void copy()}
          style={{
            minHeight: 32,
            padding: `0 ${spacingTokens.sm}`,
            border: 0,
            borderRadius: radiusTokens.sm,
            background: "transparent",
            color: colorTokens.text.primary,
            font: "inherit",
            cursor: "pointer",
          }}
        >
          {copied ? t("Copied") : t("Copy")}
        </button>
      </figcaption>
      <pre
        tabIndex={0}
        style={{
          margin: 0,
          padding: spacingTokens.sm,
          overflowX: "auto",
          maxWidth: "100%",
          fontFamily: typographyTokens.fontFamily.mono,
          fontSize: typographyTokens.fontSize.sm,
          lineHeight: 1.5,
          background: colorTokens.background.primary,
        }}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}

/**
 * ChatMarkdown
 *
 * @example
 * ```tsx
 * <ChatMarkdown>{"**Call time** is 6 am.\n\n- Camera\n- Sound"}</ChatMarkdown>
 * ```
 */
export function ChatMarkdown({ children, renderBlock, className, style }: ChatMarkdownProps) {
  const t = useT();
  const blocks = parseMarkdown(children);
  const cell: React.CSSProperties = {
    border: `1px solid ${colorTokens.border.secondary}`,
    padding: "4px 8px",
    verticalAlign: "top",
  };
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gap: spacingTokens.sm,
        minWidth: 0,
        overflowWrap: "anywhere",
        ...style,
      }}
    >
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.kind) {
          case "p":
            return (
              <p key={key} style={{ margin: 0 }}>
                {renderInline(b.text, key)}
              </p>
            );
          case "h": {
            const Tag = `h${Math.min(6, b.level + 2)}` as "h3";
            return (
              <Tag
                key={key}
                style={{
                  margin: 0,
                  fontSize:
                    b.level <= 1 ? typographyTokens.fontSize.lg : typographyTokens.fontSize.md,
                  fontWeight: 700,
                }}
              >
                {renderInline(b.text, key)}
              </Tag>
            );
          }
          case "hr":
            return (
              <hr
                key={key}
                style={{
                  border: 0,
                  borderTop: `1px solid ${colorTokens.border.secondary}`,
                  margin: 0,
                  width: "100%",
                }}
              />
            );
          case "quote":
            return (
              <blockquote
                key={key}
                style={{
                  margin: 0,
                  paddingLeft: spacingTokens.sm,
                  borderLeft: `3px solid ${colorTokens.border.primary}`,
                  color: colorTokens.text.secondary,
                }}
              >
                <ChatMarkdown renderBlock={renderBlock}>{b.text}</ChatMarkdown>
              </blockquote>
            );
          case "code": {
            const custom = renderBlock?.(b.block);
            if (custom) return <React.Fragment key={key}>{custom}</React.Fragment>;
            return <CodeBlock key={key} code={b.block.code} lang={b.block.lang} />;
          }
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            const isTasks = b.items.some((it) => it.checked !== undefined);
            return (
              <Tag
                key={key}
                start={b.ordered && b.start !== 1 ? b.start : undefined}
                style={{
                  margin: 0,
                  paddingLeft: isTasks ? 4 : 22,
                  listStyle: isTasks ? "none" : undefined,
                }}
              >
                {b.items.map((it, j) => (
                  <li key={j} style={{ marginLeft: it.depth * 18 }}>
                    {it.checked !== undefined && (
                      <span aria-hidden="true" style={{ marginRight: 6 }}>
                        {it.checked ? "☑" : "☐"}
                      </span>
                    )}
                    {it.checked !== undefined && (
                      <span style={visuallyHidden}>{it.checked ? t("Done:") : t("To do:")} </span>
                    )}
                    {renderInline(it.text, `${key}-${j}`)}
                  </li>
                ))}
              </Tag>
            );
          }
          case "table":
            return (
              <div
                key={key}
                tabIndex={0}
                role="region"
                aria-label={b.head.join(", ")}
                style={{ overflowX: "auto", maxWidth: "100%" }}
              >
                <table
                  style={{
                    borderCollapse: "collapse",
                    fontSize: typographyTokens.fontSize.sm,
                    minWidth: "100%",
                  }}
                >
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th
                          key={j}
                          scope="col"
                          style={{
                            ...cell,
                            textAlign: b.align[j] ?? "left",
                            background: colorTokens.background.tertiary,
                          }}
                        >
                          {renderInline(h, `${key}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {b.head.map((_, j) => (
                          <td
                            key={j}
                            style={{
                              ...cell,
                              textAlign:
                                b.align[j] ??
                                (/^[-+₹$]?[\d,.]+%?$/.test(r[j] ?? "") ? "right" : "left"),
                            }}
                          >
                            {renderInline(r[j] ?? "", `${key}-${ri}-${j}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

ChatMarkdown.displayName = "ChatMarkdown";
