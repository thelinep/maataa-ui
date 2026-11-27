/**
 * @maataa/ui/forms/CodeEditor
 * Monospace editor with line numbers, Tab-to-indent and an escape hatch
 * (Esc, then Tab) so keyboard users never get trapped
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame } from "./fieldKit";

export interface CodeEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown as a badge, e.g. "JSON" */
  language?: string;
  hint?: React.ReactNode;
  error?: string;
  rows?: number;
  /** Spaces per indent @default 2 */
  indent?: number;
  readOnly?: boolean;
}

/** Line and column (1-based) of a caret offset */
export function caretPosition(text: string, offset: number) {
  const before = text.slice(0, offset).split("\n");
  return { line: before.length, column: before[before.length - 1]!.length + 1 };
}

/**
 * CodeEditor
 * Tab / Shift+Tab indent and outdent the current lines. After Esc, the next
 * Tab moves focus out as normal. Line and column are shown under the editor.
 */
export function CodeEditor({
  label,
  value,
  onChange,
  language,
  hint,
  error,
  rows = 12,
  indent = 2,
  readOnly,
}: CodeEditorProps) {
  const t = useT();
  const ref = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const [escaped, setEscaped] = useState(false);
  const [pos, setPos] = useState({ line: 1, column: 1 });
  const lines = value.split("\n").length;
  const pad = " ".repeat(indent);

  const track = () => {
    const ta = ref.current;
    if (ta) setPos(caretPosition(value, ta.selectionStart));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setEscaped(true);
      return;
    }
    if (e.key !== "Tab" || readOnly) {
      if (e.key !== "Shift") setEscaped(false);
      return;
    }
    if (escaped) {
      setEscaped(false);
      return; // let focus move
    }
    e.preventDefault();
    const ta = e.currentTarget;
    const s = ta.selectionStart;
    const en = ta.selectionEnd;
    const ls = value.lastIndexOf("\n", s - 1) + 1;
    if (s === en && !e.shiftKey) {
      const next = value.slice(0, s) + pad + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => ta.setSelectionRange(s + indent, s + indent));
      return;
    }
    const block = value.slice(ls, en);
    const changed = block
      .split("\n")
      .map((l) => (e.shiftKey ? l.replace(new RegExp(`^ {1,${indent}}`), "") : pad + l))
      .join("\n");
    onChange(value.slice(0, ls) + changed + value.slice(en));
    requestAnimationFrame(() => ta.setSelectionRange(ls, ls + changed.length));
  };

  const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const lh = 1.5;
  return (
    <FieldFrame
      label={label}
      hint={
        hint ?? (readOnly ? undefined : "Tab indents. To leave the editor, press Esc and then Tab.")
      }
      error={error}
    >
      {(ids) => (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          <div
            style={{
              display: "flex",
              border: `2px solid ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
              borderRadius: 8,
              overflow: "hidden",
              background: colorTokens.background.primary,
            }}
          >
            <div
              ref={gutter}
              aria-hidden="true"
              style={{
                fontFamily: mono,
                fontSize: typographyTokens.fontSize.sm,
                lineHeight: lh,
                padding: "10px 8px",
                textAlign: "right",
                color: colorTokens.text.tertiary,
                background: colorTokens.background.secondary,
                userSelect: "none",
                overflow: "hidden",
                height: `calc(${rows * lh}em + 20px)`,
                boxSizing: "border-box",
              }}
            >
              {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={ref}
              id={ids.id}
              value={value}
              readOnly={readOnly}
              rows={rows}
              wrap="off"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              onKeyUp={track}
              onClick={track}
              onScroll={(e) => {
                if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop;
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={[ids.describedBy, `${ids.id}-pos`].filter(Boolean).join(" ")}
              style={{
                flex: 1,
                border: 0,
                outlineOffset: -2,
                padding: 10,
                fontFamily: mono,
                fontSize: typographyTokens.fontSize.sm,
                lineHeight: lh,
                resize: "vertical",
                background: "transparent",
                color: colorTokens.text.primary,
                tabSize: indent,
                whiteSpace: "pre",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: typographyTokens.fontSize.xs,
              color: colorTokens.text.secondary,
            }}
          >
            <span id={`${ids.id}-pos`}>
              {escaped
                ? t("Line {line}, column {column} · Tab will leave the editor", {
                    line: pos.line,
                    column: pos.column,
                  })
                : t("Line {line}, column {column}", { line: pos.line, column: pos.column })}
            </span>
            {language && <span>{language}</span>}
          </div>
        </div>
      )}
    </FieldFrame>
  );
}
