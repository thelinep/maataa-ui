/**
 * @maataa/ui/themes/ThemePicker
 * Lets people choose Light, Dark, TLPS v2, High contrast or "System", and
 * remembers the choice.
 */

import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useT } from "../i18n/LocaleProvider";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import {
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  resolveThemeChoice,
  resolveThemeOptions,
  type ThemeChoice,
  type ThemePreferenceOptions,
} from "./themePreference";

const CHANGE_EVENT = "maataa-theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export interface ThemePreference {
  /** What the person chose: a theme name or "system". */
  choice: ThemeChoice;
  /** The theme actually showing. */
  theme: string;
  /** Change and save the choice. */
  setChoice: (choice: ThemeChoice) => void;
}

/**
 * useThemePreference
 * Reads, saves and applies the theme choice on `<html data-maataa-theme>`.
 * Follows the system setting live when the choice is "system", and stays in
 * step with other pickers and other tabs.
 */
export function useThemePreference(options: ThemePreferenceOptions = {}): ThemePreference {
  const resolved = resolveThemeOptions(options);
  const { storageKey, defaultChoice } = resolved;
  const namesKey = resolved.names.join("|");
  const valid = useCallback(
    (value: string | null): value is ThemeChoice =>
      value === "system" || (value !== null && namesKey.split("|").includes(value)),
    [namesKey]
  );

  const [choice, setChoiceState] = useState<ThemeChoice>(defaultChoice);
  const [prefersDark, setPrefersDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored(storageKey);
    const fromPage = document.documentElement.getAttribute(THEME_CHOICE_ATTRIBUTE);
    setChoiceState(valid(stored) ? stored : valid(fromPage) ? fromPage : defaultChoice);
    const media = typeof window.matchMedia === "function" ? window.matchMedia(DARK_QUERY) : null;
    setPrefersDark(Boolean(media?.matches));
    setReady(true);

    const onMedia = (event: MediaQueryListEvent) => setPrefersDark(event.matches);
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      if (valid(next)) setChoiceState(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey && valid(event.newValue)) setChoiceState(event.newValue);
    };
    media?.addEventListener?.("change", onMedia);
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media?.removeEventListener?.("change", onMedia);
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [storageKey, defaultChoice, valid]);

  const theme = resolveThemeChoice(choice, prefersDark, options);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, theme);
    root.setAttribute(THEME_CHOICE_ATTRIBUTE, choice);
  }, [ready, theme, choice]);

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      if (!valid(next)) return;
      setChoiceState(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage can be unavailable (private mode, blocked cookies); the choice still applies.
      }
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
    },
    [storageKey, valid]
  );

  return { choice, theme, setChoice };
}

export interface ThemePickerProps extends ThemePreferenceOptions {
  /** Visible label. @default "Theme" (translated) */
  label?: string;
  /** Keep the label for screen readers only. @default false */
  hideLabel?: boolean;
  /** Offer "System" (follow the device setting). @default true */
  showSystem?: boolean;
  /** Called after the choice changes. */
  onChange?: (choice: ThemeChoice, theme: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ThemePicker
 * A labelled select of the available themes. Pair it with
 * `<ThemePreferenceHead />` in `<head>` so the saved theme loads without a
 * flash; without it the picker still works once the page has loaded.
 *
 * @example
 * ```tsx
 * <ThemePicker />
 * <ThemePicker themes={[paperTheme, tlpsV2Theme]} showSystem={false} />
 * ```
 */
export const ThemePicker = React.forwardRef<HTMLSelectElement, ThemePickerProps>(
  (
    { label, hideLabel = false, showSystem = true, onChange, className, style, ...options },
    ref
  ) => {
    const t = useT();
    const id = useId();
    const { choice, theme, setChoice } = useThemePreference(options);
    const { themes } = resolveThemeOptions(options);
    const labelText = label ?? t("Theme");

    const choices = useMemo(
      () => [
        ...(showSystem ? [{ value: "system", text: t("System") }] : []),
        ...themes.map((theme) => ({ value: theme.name, text: t(theme.label ?? theme.name) })),
      ],
      [showSystem, themes, t]
    );
    const value = choice === "system" && !showSystem ? theme : choice;

    const labelNode = (
      <label
        htmlFor={id}
        style={{
          fontSize: typographyTokens.fontSize.sm,
          fontWeight: typographyTokens.fontWeight.medium,
          color: colorTokens.text.primary,
        }}
      >
        {labelText}
      </label>
    );

    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", gap: spacingTokens.sm, ...style }}
      >
        {hideLabel ? <VisuallyHidden>{labelNode}</VisuallyHidden> : labelNode}
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            setChoice(next);
            const dark =
              typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches;
            onChange?.(next, resolveThemeChoice(next, dark, options));
          }}
          style={{
            minHeight: 32,
            padding: `${spacingTokens.xs} ${spacingTokens.sm}`,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: radiusTokens.md,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {choices.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </span>
    );
  }
);

ThemePicker.displayName = "ThemePicker";
