/**
 * @maataa/ui/forms/SearchWithResults
 * Search box with a results list you can arrow through (APG combobox)
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SearchResult {
  id: string;
  label: string;
  description?: string;
  /** Group heading, e.g. "Projects" */
  group?: string;
  /** Right-aligned hint, e.g. a shortcut */
  hint?: string;
}

export interface SearchWithResultsProps {
  label: string;
  query: string;
  onQueryChange: (q: string) => void;
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  loading?: boolean;
  /** @default 'No matches' */
  emptyText?: string;
  placeholder?: string;
  /** Hide the visible label (still named) */
  hideLabel?: boolean;
  /** Keep the list open even with an empty query (palettes) @default false */
  alwaysOpen?: boolean;
  /** Escape with an empty query */
  onEscape?: () => void;
  autoFocus?: boolean;
  /** Max list height @default 320 */
  maxHeight?: number;
}

/**
 * SearchWithResults
 * Focus stays in the input; arrows move the active option
 * (aria-activedescendant), Enter picks it, Escape clears. A status line
 * says how many results there are.
 *
 * @example
 * ```tsx
 * <SearchWithResults label="Search people" query={q} onQueryChange={setQ} results={hits} onSelect={open} />
 * ```
 */
export function SearchWithResults({
  label,
  query,
  onQueryChange,
  results,
  onSelect,
  loading = false,
  emptyText = "No matches",
  placeholder,
  hideLabel = false,
  alwaysOpen = false,
  onEscape,
  autoFocus,
  maxHeight = 320,
}: SearchWithResultsProps) {
  const id = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const open = alwaysOpen || query.trim().length > 0;
  useEffect(() => setActive(0), [query, results.length]);
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Home" && open && results.length) {
      setActive(0);
    } else if (e.key === "End" && open && results.length) {
      setActive(results.length - 1);
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      onSelect(results[active]);
    } else if (e.key === "Escape") {
      if (query) {
        e.preventDefault();
        e.stopPropagation();
        onQueryChange("");
      } else onEscape?.();
    }
  };

  let lastGroup: string | undefined;
  const status = loading
    ? "Searching…"
    : open
      ? results.length
        ? `${results.length} result${results.length === 1 ? "" : "s"}`
        : emptyText
      : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <label
        htmlFor={`${id}-input`}
        style={
          hideLabel
            ? {
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }
            : { fontWeight: 500 }
        }
      >
        {label}
      </label>
      <input
        id={`${id}-input`}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && results[active] ? `${id}-opt-${active}` : undefined}
        value={query}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{
          padding: spacingTokens.sm,
          border: `2px solid ${colorTokens.border.control}`,
          borderRadius: 6,
          font: "inherit",
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
        }}
      />
      <span
        role="status"
        style={{
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
          minHeight: "1em",
        }}
      >
        {status}
      </span>
      <ul
        id={`${id}-list`}
        ref={listRef}
        role="listbox"
        aria-label={label}
        hidden={!open || results.length === 0}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          maxHeight,
          overflowY: "auto",
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 6,
        }}
      >
        {results.map((r, i) => {
          const header = r.group && r.group !== lastGroup ? r.group : null;
          lastGroup = r.group;
          return (
            <React.Fragment key={r.id}>
              {header && (
                <li
                  role="presentation"
                  style={{
                    padding: `${spacingTokens.xs} ${spacingTokens.sm}`,
                    fontSize: typographyTokens.fontSize.xs,
                    fontWeight: 700,
                    color: colorTokens.text.secondary,
                    background: colorTokens.background.secondary,
                  }}
                >
                  {header}
                </li>
              )}
              <li
                id={`${id}-opt-${i}`}
                role="option"
                data-index={i}
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(r)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: spacingTokens.sm,
                  padding: spacingTokens.sm,
                  cursor: "pointer",
                  background: i === active ? colorTokens.background.tertiary : "transparent",
                  outline: i === active ? `2px solid ${colorTokens.interactive.primary}` : "none",
                  outlineOffset: -2,
                }}
              >
                <span>
                  <span style={{ display: "block", color: colorTokens.text.primary }}>
                    {r.label}
                  </span>
                  {r.description && (
                    <span
                      style={{
                        fontSize: typographyTokens.fontSize.xs,
                        color: colorTokens.text.secondary,
                      }}
                    >
                      {r.description}
                    </span>
                  )}
                </span>
                {r.hint && (
                  <kbd
                    style={{
                      fontFamily: typographyTokens.fontFamily.mono,
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {r.hint}
                  </kbd>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}

SearchWithResults.displayName = "SearchWithResults";
