/**
 * @maataa/ui/forms/TagInput
 * Free-text tags: type and press Enter or comma; each tag has its own Remove button
 */

import React, { useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle } from "./fieldKit";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

export interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  /** Offered as the user types (native datalist) */
  suggestions?: string[];
  maxTags?: number;
  hint?: React.ReactNode;
  error?: string;
  /** Normalise before adding (e.g. lower-case) */
  normalize?: (tag: string) => string;
}

/**
 * TagInput
 * Duplicates are refused with a message. Adding and removing is announced.
 * After removing a tag, focus moves to the text field.
 */
export function TagInput({
  label,
  value,
  onChange,
  suggestions,
  maxTags,
  hint,
  error,
  normalize = (t) => t.trim(),
}: TagInputProps) {
  const listId = useId();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const full = maxTags != null && value.length >= maxTags;

  const add = (raw: string) => {
    const parts = raw.split(",").map(normalize).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    const added: string[] = [];
    for (const p of parts) {
      if (maxTags != null && next.length >= maxTags) {
        setMsg(`You can add up to ${maxTags} tags.`);
        break;
      }
      if (next.some((t) => t.toLowerCase() === p.toLowerCase())) {
        setMsg(`${p} is already added.`);
        continue;
      }
      next.push(p);
      added.push(p);
    }
    if (added.length) {
      onChange(next);
      setMsg(`Added ${added.join(", ")}. ${next.length} tags.`);
    }
    setText("");
  };

  const remove = (tag: string) => {
    const next = value.filter((t) => t !== tag);
    onChange(next);
    setMsg(`Removed ${tag}. ${next.length} tags.`);
    inputRef.current?.focus();
  };

  return (
    <FieldFrame
      label={label}
      hint={hint ?? "Press Enter or type a comma to add a tag."}
      error={error}
    >
      {(ids) => (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          {value.length > 0 && (
            <ul
              aria-label={`${label}: ${value.length} tags`}
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: spacingTokens.xs,
              }}
            >
              {value.map((t) => (
                <li
                  key={t}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 2px 2px 10px",
                    borderRadius: 999,
                    background: colorTokens.background.tertiary,
                    border: `1px solid ${colorTokens.border.primary}`,
                    color: colorTokens.text.primary,
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => remove(t)}
                    style={{
                      minWidth: 32,
                      minHeight: 32,
                      border: 0,
                      borderRadius: 999,
                      background: "transparent",
                      color: colorTokens.text.secondary,
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    <span aria-hidden="true">×</span>
                    <VisuallyHidden>Remove {t}</VisuallyHidden>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <input
            ref={inputRef}
            id={ids.id}
            value={text}
            disabled={full}
            list={suggestions ? listId : undefined}
            placeholder={full ? `Limit of ${maxTags} reached` : undefined}
            onChange={(e) => {
              const v = e.target.value;
              if (v.endsWith(",")) add(v);
              else setText(v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(text);
              } else if (e.key === "Backspace" && !text && value.length) {
                remove(value[value.length - 1]!);
              }
            }}
            onBlur={() => text.trim() && add(text)}
            aria-invalid={error ? true : undefined}
            aria-describedby={ids.describedBy}
            style={controlStyle(!!error)}
          />
          {suggestions && (
            <datalist id={listId}>
              {suggestions
                .filter((s) => !value.includes(s))
                .map((s) => (
                  <option key={s} value={s} />
                ))}
            </datalist>
          )}
          <VisuallyHidden role="status">{msg}</VisuallyHidden>
        </div>
      )}
    </FieldFrame>
  );
}
