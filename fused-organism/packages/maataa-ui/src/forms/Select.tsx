/**
 * @maataa/ui/forms/Select
 * Accessible dropdown select with optional search and multi-select.
 *
 * Follows the WAI-ARIA Authoring Practices combobox pattern:
 * - single / multi: a "select-only" combobox (focusable element with
 *   role="combobox") that controls a listbox;
 * - searchable: an editable combobox (<input role="combobox">) whose typing
 *   filters the listbox.
 * Focus stays on the combobox; the highlighted option is conveyed with
 * aria-activedescendant, so screen readers announce it as it moves.
 */

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Portal } from "../primitives/Portal";
import { useField } from "../primitives/Input";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Small decorative visual before the label (an icon element). */
  icon?: React.ReactNode;
  /**
   * Image URL. Shown as a thumbnail in the "thumbnail" and "grid" views and
   * as a small leading image elsewhere. Decorative: the label names the option.
   */
  thumbnail?: string;
  /** Secondary text under the label (not shown in the "compact" view). */
  description?: string;
}

/**
 * How options are laid out in the popup:
 * - "list": icon/thumbnail, label and description (default)
 * - "compact": one line per option, small visual, no description
 * - "thumbnail": a larger image beside the label and description
 * - "grid": tiles in `gridColumns` columns, image above the label
 */
export type SelectView = "list" | "compact" | "thumbnail" | "grid";

export interface SelectOptionState {
  selected: boolean;
  active: boolean;
  disabled: boolean;
}

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  /** Typing in the control filters the options. */
  searchable?: boolean;
  /** Several options can be selected; `value`/`onChange` use string[]. */
  multiSelect?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  /** Renders hidden input(s) so the value is submitted with a native form. */
  name?: string;
  /** Shown when a search matches nothing. */
  noOptionsText?: string;
  /** Popup layout. @default "list" */
  view?: SelectView;
  /** Columns in the "grid" view. @default 3 */
  gridColumns?: number;
  /**
   * How a multi-select shows its selection: as text in the control, or as
   * removable chips under it. @default "text"
   */
  selectedDisplay?: "text" | "chips";
  /**
   * Custom option content (inside the option element, which keeps its role,
   * selection state and keyboard handling). The option is named by its label.
   */
  renderOption?: (option: SelectOption, state: SelectOptionState) => React.ReactNode;
}

const joinIds = (...ids: Array<string | undefined | false>) =>
  ids.filter(Boolean).join(" ") || undefined;

const sizeMap = {
  sm: { minHeight: "32px", fontSize: "14px", padding: "6px 12px" },
  md: { minHeight: "40px", fontSize: "14px", padding: "8px 14px" },
  lg: { minHeight: "48px", fontSize: "15px", padding: "10px 16px" },
} as const;

const TYPEAHEAD_RESET_MS = 500;

/**
 * Select
 * Dropdown select with optional search and multi-select.
 *
 * @example
 * <Select label="Currency" options={currencies} value={currency} onChange={setCurrency} />
 * <Select label="Members" multiSelect searchable options={people} value={ids} onChange={setIds} />
 */
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options,
    value,
    onChange,
    placeholder = "Select an option",
    searchable = false,
    multiSelect = false,
    disabled = false,
    error,
    label,
    description,
    size = "md",
    name,
    noOptionsText = "No options found",
    view = "list",
    gridColumns = 3,
    selectedDisplay = "text",
    renderOption,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    style,
    ...props
  },
  ref
) {
  const field = useField();
  const uid = useId();
  const controlId = id ?? field?.id ?? `${uid}-control`;
  const listboxId = `${uid}-listbox`;
  const labelId = label ? `${uid}-label` : undefined;
  const descriptionId = description ? `${uid}-description` : undefined;
  const errorId = error ? `${uid}-error` : undefined;
  const labelledBy = ariaLabelledBy ?? labelId ?? (ariaLabel ? undefined : field?.labelId);
  const describedBy = joinIds(errorId, descriptionId, field?.describedBy, ariaDescribedBy);
  const invalid = Boolean(error) || Boolean(field?.invalid);
  const required = field?.required || undefined;

  const selected: string[] = Array.isArray(value) ? value : value ? [value] : [];

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [position, setPosition] = useState<React.CSSProperties>({});

  const rootRef = useRef<HTMLDivElement | null>(null);
  const controlRef = useRef<HTMLDivElement | HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typeahead = useRef({ text: "", timer: 0 as ReturnType<typeof setTimeout> | 0 });

  const filtered =
    searchable && query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;
  const optionId = (index: number) => `${uid}-option-${index}`;

  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  // --- navigation helpers over the currently visible options -------------
  const isEnabled = (i: number) => i >= 0 && i < filtered.length && !filtered[i].disabled;
  const firstEnabled = () => filtered.findIndex((o) => !o.disabled);
  const lastEnabled = () => {
    for (let i = filtered.length - 1; i >= 0; i--) if (!filtered[i].disabled) return i;
    return -1;
  };
  const isGrid = view === "grid";
  // In the grid view Up/Down move a whole row.
  const rowStep = isGrid ? Math.max(1, Math.floor(gridColumns)) : 1;
  const step = (from: number, delta: number) => {
    for (let i = from + delta; i >= 0 && i < filtered.length; i += delta)
      if (isEnabled(i)) return i;
    return from;
  };
  const selectedIndex = () => filtered.findIndex((o) => selected.includes(o.value) && !o.disabled);

  const open = (at: "selected" | "first" | "last" | number = "selected") => {
    if (disabled) return;
    setIsOpen(true);
    if (typeof at === "number") setActiveIndex(at);
    else if (at === "first") setActiveIndex(firstEnabled());
    else if (at === "last") setActiveIndex(lastEnabled());
    else {
      const s = selectedIndex();
      setActiveIndex(s >= 0 ? s : firstEnabled());
    }
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
    // A fresh type-ahead search starts after the list closes.
    const state = typeahead.current;
    if (state.timer) clearTimeout(state.timer);
    state.text = "";
  }, []);

  const commit = (index: number) => {
    const option = filtered[index];
    if (!option || option.disabled) return;
    if (multiSelect) {
      const next = selected.includes(option.value)
        ? selected.filter((v) => v !== option.value)
        : [...selected, option.value];
      onChange?.(next);
      setActiveIndex(index);
    } else {
      onChange?.(option.value);
      close();
    }
  };

  const runTypeahead = (char: string) => {
    const state = typeahead.current;
    if (state.timer) clearTimeout(state.timer);
    state.text += char.toLowerCase();
    state.timer = setTimeout(() => (state.text = ""), TYPEAHEAD_RESET_MS);
    const n = filtered.length;
    if (n === 0) return;
    // A new search starts after the current option (so repeating a letter
    // cycles through matches); a longer search re-checks the current one.
    const start = isOpen ? activeIndex : selectedIndex();
    const base = start < 0 ? 0 : (start + (state.text.length === 1 ? 1 : 0)) % n;
    const order = Array.from({ length: n }, (_, k) => (base + k) % n);
    const match = order.find(
      (i) => isEnabled(i) && filtered[i].label.toLowerCase().startsWith(state.text)
    );
    if (match === undefined) return;
    if (isOpen) setActiveIndex(match);
    else open(match);
  };

  // --- keyboard -------------------------------------------------------------
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    const { key, altKey } = event;

    if (
      key === "Backspace" &&
      multiSelect &&
      selectedDisplay === "chips" &&
      selected.length > 0 &&
      !(searchable && query)
    ) {
      event.preventDefault();
      onChange?.(selected.slice(0, -1));
      return;
    }

    if (!isOpen) {
      if (
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Enter" ||
        (key === " " && !searchable)
      ) {
        event.preventDefault();
        open("selected");
      } else if (key === "Home" && !searchable) {
        event.preventDefault();
        open("first");
      } else if (key === "End" && !searchable) {
        event.preventDefault();
        open("last");
      } else if (key === "Escape" && searchable && query) {
        setQuery("");
      } else if (!searchable && key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
        runTypeahead(key);
      }
      return;
    }

    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (i < 0 ? firstEnabled() : step(i, rowStep)));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (altKey) {
          if (!multiSelect && activeIndex >= 0) commit(activeIndex);
          else close();
        } else setActiveIndex((i) => (i < 0 ? lastEnabled() : step(i, -rowStep)));
        break;
      case "ArrowRight":
      case "ArrowLeft":
        // Columns only exist in the grid; in a search box these move the caret.
        if (!isGrid || searchable) break;
        event.preventDefault();
        setActiveIndex((i) => (i < 0 ? firstEnabled() : step(i, key === "ArrowRight" ? 1 : -1)));
        break;
      case "Home":
        if (searchable) break;
        event.preventDefault();
        setActiveIndex(firstEnabled());
        break;
      case "End":
        if (searchable) break;
        event.preventDefault();
        setActiveIndex(lastEnabled());
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0) commit(activeIndex);
        else close();
        break;
      case " ":
        if (searchable) break;
        event.preventDefault();
        if (activeIndex >= 0) commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation(); // don't also close an enclosing dialog
        close();
        break;
      case "Tab":
        // APG select-only combobox: Tab accepts the highlighted option.
        if (!multiSelect && !searchable && activeIndex >= 0) commit(activeIndex);
        else close();
        break;
      default:
        if (!searchable && key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
          runTypeahead(key);
        }
    }
  };

  // --- open/close side effects ------------------------------------------------
  // Close when focus leaves the control (options never take focus).
  const onControlBlur = () => {
    setFocused(false);
    close();
  };

  // Close on a pointer press outside the control and the listbox.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen, close]);

  // Keep the highlighted option visible while navigating.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const el = document.getElementById(optionId(activeIndex));
    el?.scrollIntoView?.({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  // Position the listbox under (or, without room, above) the control and keep
  // it attached while the page scrolls or resizes.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const place = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const gap = 4;
      const spaceBelow = window.innerHeight - rect.bottom;
      const above = spaceBelow < 220 && rect.top > spaceBelow;
      // The listbox is portalled to <body>, so it would not inherit the app's
      // font; copy it from the control.
      const font = window.getComputedStyle(anchor);
      const width = Math.min(
        window.innerWidth - 16,
        Math.max(rect.width, isGrid ? Math.floor(gridColumns) * 120 + 16 : 0)
      );
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      setPosition({
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        left,
        width,
        ...(above ? { bottom: window.innerHeight - rect.top + gap } : { top: rect.bottom + gap }),
        maxHeight: Math.max(
          120,
          Math.min(isGrid ? 420 : 300, (above ? rect.top : spaceBelow) - gap * 2)
        ),
      });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [isOpen, isGrid, gridColumns]);

  // Keep the active option valid as the search narrows the list.
  useEffect(() => {
    if (!isOpen || !searchable) return;
    setActiveIndex(query ? filtered.findIndex((o) => !o.disabled) : selectedIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // --- rendering --------------------------------------------------------------
  // Selected options in the order they were chosen.
  const selectedOptions = selected
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is SelectOption => Boolean(o));
  const selectedLabels = selectedOptions.map((o) => o.label);
  const showChips = multiSelect && selectedDisplay === "chips";
  const chipsLabelTarget = labelId ?? field?.labelId;
  const displayText =
    selectedLabels.length === 0
      ? ""
      : multiSelect
        ? selectedLabels.length <= 2 && !showChips
          ? selectedLabels.join(", ")
          : `${selectedLabels.length} selected`
        : selectedLabels[0];
  const singleSelected = !multiSelect ? selectedOptions[0] : undefined;

  /** Decorative image or icon for an option; the label carries the meaning. */
  const renderVisual = (option: SelectOption, px: number, fill = false) => {
    if (option.thumbnail) {
      return (
        <img
          src={option.thumbnail}
          alt=""
          aria-hidden="true"
          style={{
            width: fill ? "100%" : px,
            height: px,
            flex: "none",
            objectFit: "cover",
            borderRadius: radiusTokens.sm,
            display: "block",
          }}
        />
      );
    }
    if (option.icon) {
      return (
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: fill ? "100%" : px,
            height: px,
            flex: "none",
            fontSize: Math.round(px * 0.75),
            lineHeight: 1,
          }}
        >
          {option.icon}
        </span>
      );
    }
    return null;
  };
  const visualSize = { compact: 16, list: 20, thumbnail: 40, grid: 72 }[view];

  const sizeStyle = sizeMap[size];
  const borderColor = invalid
    ? colorTokens.interactive.error
    : focused || isOpen
      ? colorTokens.interactive.primary
      : colorTokens.border.primary;

  const comboboxProps = {
    id: controlId,
    role: "combobox" as const,
    "aria-controls": listboxId,
    "aria-expanded": isOpen,
    "aria-haspopup": "listbox" as const,
    "aria-labelledby": labelledBy,
    "aria-label": ariaLabel,
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    "aria-required": required,
    "aria-activedescendant": isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined,
    onKeyDown,
    onFocus: () => setFocused(true),
    onBlur: onControlBlur,
  };

  return (
    <div ref={setRefs} {...props} style={{ width: "100%", ...style }}>
      {label && (
        <label
          id={labelId}
          htmlFor={controlId}
          // A <label> only focuses form controls; focus the custom combobox too.
          onClick={() => !searchable && controlRef.current?.focus()}
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "8px",
            color: colorTokens.text.primary,
          }}
        >
          {label}
          {required && (
            <span
              aria-hidden="true"
              style={{ color: colorTokens.interactive.error, marginLeft: 2 }}
            >
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <p
          id={descriptionId}
          style={{ fontSize: "12px", color: colorTokens.text.secondary, margin: "0 0 8px" }}
        >
          {description}
        </p>
      )}

      <div
        ref={anchorRef}
        onMouseDown={(e) => {
          // Keep focus on the combobox when the chevron or padding is pressed
          // (the searchable input still gets native caret placement).
          if (disabled || (searchable && e.target === controlRef.current)) return;
          e.preventDefault();
          controlRef.current?.focus();
        }}
        onClick={() => {
          if (disabled) return;
          if (searchable) {
            controlRef.current?.focus();
            if (!isOpen) open();
          } else if (isOpen) close();
          else open();
        }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: spacingTokens.sm,
          width: "100%",
          boxSizing: "border-box",
          ...sizeStyle,
          border: `1px solid ${borderColor}`,
          outline: focused ? `1px solid ${colorTokens.interactive.primary}` : "none",
          borderRadius: radiusTokens.md,
          backgroundColor: disabled
            ? colorTokens.background.tertiary
            : colorTokens.background.primary,
          color: colorTokens.text.primary,
          cursor: disabled ? "not-allowed" : searchable ? "text" : "pointer",
          opacity: disabled ? 0.6 : 1,
          transition: "border-color 0.2s ease",
        }}
      >
        {searchable && !isOpen && singleSelected && renderVisual(singleSelected, 20)}
        {searchable ? (
          <input
            {...comboboxProps}
            ref={(node) => {
              controlRef.current = node;
            }}
            type="text"
            autoComplete="off"
            aria-autocomplete="list"
            disabled={disabled}
            placeholder={displayText || placeholder}
            value={isOpen ? query : displayText}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "inherit",
              font: "inherit",
              padding: 0,
            }}
          />
        ) : (
          <div
            {...comboboxProps}
            ref={(node) => {
              controlRef.current = node;
            }}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            style={{
              flex: 1,
              minWidth: 0,
              outline: "none",
              display: "flex",
              alignItems: "center",
              gap: spacingTokens.sm,
              color: displayText ? colorTokens.text.primary : colorTokens.text.secondary,
            }}
          >
            {singleSelected && renderVisual(singleSelected, 20)}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayText || placeholder}
            </span>
          </div>
        )}
        <span aria-hidden="true" style={{ color: colorTokens.text.secondary, fontSize: "11px" }}>
          ▼
        </span>
      </div>

      {showChips && selectedOptions.length > 0 && chipsLabelTarget && (
        <span id={`${uid}-chips-prefix`} hidden>
          Selected
        </span>
      )}
      {showChips && selectedOptions.length > 0 && (
        <ul
          // "Selected <field label>", whether the label is our own or a FieldShell's.
          aria-labelledby={chipsLabelTarget ? `${uid}-chips-prefix ${chipsLabelTarget}` : undefined}
          aria-label={chipsLabelTarget ? undefined : "Selected options"}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacingTokens.xs,
            listStyle: "none",
            margin: `${spacingTokens.sm} 0 0`,
            padding: 0,
          }}
        >
          {selectedOptions.map((option) => (
            <li
              key={option.value}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: disabled ? "2px 10px" : "2px 4px 2px 8px",
                borderRadius: 999,
                border: `1px solid ${colorTokens.border.primary}`,
                backgroundColor: colorTokens.background.secondary,
                color: colorTokens.text.primary,
                fontSize: "13px",
                maxWidth: "100%",
              }}
            >
              {renderVisual(option, 16)}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {option.label}
              </span>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${option.label}`}
                  onClick={() => onChange?.(selected.filter((v) => v !== option.value))}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: "0 4px",
                    fontSize: "15px",
                    lineHeight: 1,
                    color: colorTokens.text.primary,
                    borderRadius: 999,
                  }}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          style={{ fontSize: "12px", color: colorTokens.interactive.error, margin: "4px 0 0" }}
        >
          {error}
        </p>
      )}

      {name &&
        (multiSelect ? selected : selected.slice(0, 1)).map((v) => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}

      {isOpen && (
        <Portal>
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : ariaLabel}
            aria-multiselectable={multiSelect || undefined}
            tabIndex={-1}
            style={{
              position: "fixed",
              zIndex: 1100,
              margin: 0,
              padding: isGrid ? spacingTokens.xs : `${spacingTokens.xs} 0`,
              listStyle: "none",
              overflowY: "auto",
              ...(isGrid
                ? {
                    display: "grid",
                    gridTemplateColumns: `repeat(${rowStep}, minmax(0, 1fr))`,
                    gap: spacingTokens.xs,
                    alignContent: "start",
                  }
                : {}),
              boxSizing: "border-box",
              backgroundColor: colorTokens.background.primary,
              border: `1px solid ${colorTokens.border.primary}`,
              borderRadius: radiusTokens.md,
              boxShadow: colorTokens.shadow.md,
              ...position,
            }}
          >
            {filtered.length === 0 ? (
              <li
                role="option"
                aria-disabled="true"
                aria-selected={false}
                style={{
                  padding: spacingTokens.md,
                  color: colorTokens.text.secondary,
                  gridColumn: "1 / -1",
                }}
              >
                {noOptionsText}
              </li>
            ) : (
              filtered.map((option, index) => {
                const isSelected = selected.includes(option.value);
                const isActive = index === activeIndex;
                const isDisabled = Boolean(option.disabled);
                const id = optionId(index);
                const showDescription = Boolean(option.description) && view !== "compact";
                const state = { selected: isSelected, active: isActive, disabled: isDisabled };

                const indicator = multiSelect ? (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 14,
                      height: 14,
                      flex: "none",
                      boxSizing: "border-box",
                      border: `2px solid ${colorTokens.interactive.primary}`,
                      borderRadius: 3,
                      backgroundColor: isSelected ? colorTokens.interactive.primary : "transparent",
                      color: colorTokens.text.inverse,
                      fontSize: 10,
                      lineHeight: "10px",
                      textAlign: "center",
                    }}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                ) : (
                  <span aria-hidden="true" style={{ width: 14, flex: "none" }}>
                    {isSelected ? "✓" : ""}
                  </span>
                );

                const text = (
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                      gap: 2,
                      alignItems: isGrid ? "center" : "flex-start",
                    }}
                  >
                    <span
                      id={`${id}-label`}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: view === "compact" || isGrid ? "nowrap" : "normal",
                        maxWidth: "100%",
                      }}
                    >
                      {option.label}
                    </span>
                    {showDescription && (
                      <span
                        id={`${id}-description`}
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: colorTokens.text.secondary,
                        }}
                      >
                        {option.description}
                      </span>
                    )}
                  </span>
                );

                const content = renderOption ? (
                  renderOption(option, state)
                ) : isGrid ? (
                  <>
                    {renderVisual(option, visualSize, true)}
                    {text}
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          backgroundColor: colorTokens.interactive.primary,
                          color: colorTokens.text.inverse,
                          fontSize: 11,
                          lineHeight: "18px",
                          textAlign: "center",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {indicator}
                    {renderVisual(option, visualSize)}
                    {text}
                  </>
                );

                return (
                  <li
                    key={option.value}
                    id={id}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled || undefined}
                    // Custom content may hold anything; name the option by its label.
                    aria-label={renderOption ? option.label : undefined}
                    aria-labelledby={renderOption ? undefined : `${id}-label`}
                    aria-describedby={
                      !renderOption && showDescription ? `${id}-description` : undefined
                    }
                    // Keep focus on the combobox while clicking an option.
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseMove={() =>
                      !isDisabled && activeIndex !== index && setActiveIndex(index)
                    }
                    onClick={() => commit(index)}
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: isGrid ? "column" : "row",
                      alignItems: isGrid ? "stretch" : "center",
                      gap: isGrid ? spacingTokens.xs : spacingTokens.sm,
                      padding: isGrid
                        ? spacingTokens.xs
                        : view === "compact"
                          ? `4px ${spacingTokens.md}`
                          : `${spacingTokens.sm} ${spacingTokens.md}`,
                      borderRadius: isGrid ? radiusTokens.md : 0,
                      border: isGrid
                        ? `2px solid ${isSelected ? colorTokens.interactive.primary : "transparent"}`
                        : undefined,
                      textAlign: isGrid ? "center" : "left",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      opacity: isDisabled ? 0.6 : 1,
                      color: colorTokens.text.primary,
                      backgroundColor: isActive ? colorTokens.background.secondary : "transparent",
                      outline: isActive ? `2px solid ${colorTokens.interactive.primary}` : "none",
                      outlineOffset: "-2px",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {content}
                  </li>
                );
              })
            )}
          </ul>
        </Portal>
      )}
    </div>
  );
});

Select.displayName = "Select";
