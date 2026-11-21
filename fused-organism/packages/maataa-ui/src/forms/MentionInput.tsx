/**
 * @maataa/ui/forms/MentionInput
 * Multi-line text where "@" opens a list of people to mention (APG combobox on a textarea)
 */

import React, { useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle } from "./fieldKit";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

export interface Mentionable {
  id: string;
  name: string;
  /** Shown after the name, e.g. role */
  detail?: string;
}

export interface MentionInputProps {
  label: string;
  value: string;
  onChange: (value: string, mentionedIds: string[]) => void;
  people: Mentionable[];
  hint?: React.ReactNode;
  error?: string;
  rows?: number;
  /** Most suggestions shown @default 6 */
  limit?: number;
}

/** Ids of people whose "@Name" appears in the text */
export function mentionedIn(text: string, people: Mentionable[]): string[] {
  return people.filter((p) => text.includes(`@${p.name}`)).map((p) => p.id);
}

function queryAt(text: string, caret: number): { start: number; q: string } | null {
  const before = text.slice(0, caret);
  const m = /(^|\s)@([^\s@]{0,30})$/.exec(before);
  if (!m) return null;
  return { start: caret - m[2]!.length - 1, q: m[2]! };
}

/**
 * MentionInput
 * Arrow keys move through suggestions, Enter or Tab inserts, Escape closes.
 * The number of matches is announced.
 */
export function MentionInput({
  label,
  value,
  onChange,
  people,
  hint,
  error,
  rows = 4,
  limit = 6,
}: MentionInputProps) {
  const listId = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState<{ start: number; q: string } | null>(null);
  const [active, setActive] = useState(0);
  const matches = query
    ? people.filter((p) => p.name.toLowerCase().includes(query.q.toLowerCase())).slice(0, limit)
    : [];
  const open = matches.length > 0;

  const update = (text: string, caret: number) => {
    onChange(text, mentionedIn(text, people));
    setQuery(queryAt(text, caret));
    setActive(0);
  };

  const insert = (p: Mentionable) => {
    if (!query || !ref.current) return;
    const caret = ref.current.selectionStart ?? value.length;
    const text = `${value.slice(0, query.start)}@${p.name} ${value.slice(caret)}`;
    const pos = query.start + p.name.length + 2;
    onChange(text, mentionedIn(text, people));
    setQuery(null);
    requestAnimationFrame(() => ref.current?.setSelectionRange(pos, pos));
  };

  return (
    <FieldFrame label={label} hint={hint ?? "Type @ to mention someone."} error={error}>
      {(ids) => (
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <textarea
            ref={ref}
            id={ids.id}
            rows={rows}
            value={value}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open ? `${listId}-${active}` : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={ids.describedBy}
            onChange={(e) =>
              update(e.target.value, e.target.selectionStart ?? e.target.value.length)
            }
            onKeyDown={(e) => {
              if (!open) return;
              if (e.key === "ArrowDown") setActive((a) => (a + 1) % matches.length);
              else if (e.key === "ArrowUp")
                setActive((a) => (a - 1 + matches.length) % matches.length);
              else if (e.key === "Enter" || e.key === "Tab") insert(matches[active]!);
              else if (e.key === "Escape") setQuery(null);
              else return;
              e.preventDefault();
            }}
            onBlur={() => setTimeout(() => setQuery(null), 150)}
            style={{ ...controlStyle(!!error), resize: "vertical", fontFamily: "inherit" }}
          />
          {open && (
            <ul
              id={listId}
              role="listbox"
              aria-label="People to mention"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 10,
                minWidth: 240,
                margin: "4px 0 0",
                padding: 4,
                listStyle: "none",
                background: colorTokens.background.primary,
                border: `1px solid ${colorTokens.border.control}`,
                borderRadius: 8,
                boxShadow: colorTokens.shadow.md,
              }}
            >
              {matches.map((p, i) => (
                <li
                  key={p.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insert(p);
                  }}
                  style={{
                    padding: "8px 10px",
                    minHeight: 24,
                    borderRadius: 6,
                    cursor: "pointer",
                    background: i === active ? colorTokens.background.tertiary : "transparent",
                    outline:
                      i === active ? `2px solid ${colorTokens.interactive.primary}` : undefined,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                  {p.detail && (
                    <>
                      {" "}
                      <span
                        style={{
                          color: colorTokens.text.secondary,
                          fontSize: typographyTokens.fontSize.xs,
                        }}
                      >
                        · {p.detail}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <VisuallyHidden role="status">
            {query
              ? open
                ? `${matches.length} ${matches.length === 1 ? "person" : "people"} found`
                : "No one found"
              : ""}
          </VisuallyHidden>
          {mentionedIn(value, people).length > 0 && (
            <span
              style={{
                marginTop: spacingTokens.xs,
                fontSize: typographyTokens.fontSize.xs,
                color: colorTokens.text.secondary,
              }}
            >
              Will notify:{" "}
              {people
                .filter((p) => value.includes(`@${p.name}`))
                .map((p) => p.name)
                .join(", ")}
            </span>
          )}
        </div>
      )}
    </FieldFrame>
  );
}
