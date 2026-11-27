/**
 * @maataa/ui/i18n/LocaleProvider
 * One place to set the language, date/number/currency format and text
 * direction for every MAATAA component below it.
 */

import React, { createContext, useContext, useMemo } from "react";
import { builtInMessages, type Messages } from "./messages";

/** Languages written right to left. */
const RTL_LANGUAGES = new Set(["ar", "fa", "he", "ps", "sd", "ug", "ur", "yi"]);

/** The locale components use when there is no LocaleProvider. */
export const DEFAULT_LOCALE = "en-IN";

export interface LocaleContextValue {
  /** BCP 47 locale, e.g. "en-IN" or "hi-IN". Drives Intl date, number and currency formats. */
  locale: string;
  /** Text direction for the locale. */
  dir: "ltr" | "rtl";
  /** Translations of the built-in English UI text, merged with any overrides. */
  messages: Messages;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  messages: {},
});

/** The language part of a locale: "hi-IN" → "hi". */
export function languageOf(locale: string): string {
  return locale.split(/[-_]/)[0].toLowerCase();
}

/** "rtl" for right-to-left languages such as Urdu or Arabic, otherwise "ltr". */
export function directionOf(locale: string): "ltr" | "rtl" {
  return RTL_LANGUAGES.has(languageOf(locale)) ? "rtl" : "ltr";
}

export interface LocaleProviderProps {
  /** BCP 47 locale, e.g. "en-IN", "hi-IN". */
  locale: string;
  /**
   * Extra or replacement translations, keyed by the English source text.
   * They are merged over the built-in catalog for the locale's language, so
   * you can override a few labels or add a whole new language.
   */
  messages?: Messages;
  /** Text direction. @default worked out from the locale */
  dir?: "ltr" | "rtl";
  /**
   * Wrap children in an element carrying `lang` and `dir`, so screen readers
   * pronounce the text in the right language. Turn off when `<html lang>`
   * already matches. @default true
   */
  wrap?: boolean;
  children: React.ReactNode;
}

/**
 * LocaleProvider
 * Sets the locale for every component inside it: built-in UI text is shown in
 * the locale's language (English and Hindi ship; add others with `messages`),
 * and dates, numbers and ₹ amounts use its formats. A component's own
 * `locale` prop still wins over the provider.
 *
 * @example
 * ```tsx
 * <LocaleProvider locale="hi-IN">
 *   <App />
 * </LocaleProvider>
 * ```
 */
export function LocaleProvider({
  locale,
  messages,
  dir,
  wrap = true,
  children,
}: LocaleProviderProps) {
  const value = useMemo<LocaleContextValue>(() => {
    const builtIn = builtInMessages[languageOf(locale)] ?? {};
    return {
      locale,
      dir: dir ?? directionOf(locale),
      messages: messages ? { ...builtIn, ...messages } : builtIn,
    };
  }, [locale, messages, dir]);

  return (
    <LocaleContext.Provider value={value}>
      {wrap ? (
        <div lang={locale} dir={value.dir} style={{ display: "contents" }}>
          {children}
        </div>
      ) : (
        children
      )}
    </LocaleContext.Provider>
  );
}

LocaleProvider.displayName = "LocaleProvider";

/** The full locale context: locale, direction and messages. */
export function useLocaleContext(): LocaleContextValue {
  return useContext(LocaleContext);
}

/**
 * The locale to format with: the component's own `locale` prop if given,
 * else the nearest LocaleProvider's, else "en-IN".
 */
export function useLocale(override?: string): string {
  const { locale } = useContext(LocaleContext);
  return override ?? locale;
}

/** Values substituted into `{name}` placeholders. */
export type MessageValues = Record<string, string | number | null | undefined>;

/**
 * Translate English source text with a catalog. Missing entries fall back to
 * the English text, so an incomplete catalog never shows a blank.
 */
export function translate(messages: Messages, source: string, values?: MessageValues): string {
  const text = messages[source] ?? source;
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key] ?? "") : match
  );
}

/** A `t()`-shaped function: English source text in, display text out. */
export type TranslateFn = (source: string, values?: MessageValues) => string;

/**
 * Fills `{name}` placeholders without translating. The default for helpers
 * that take an optional `t` and are called outside a LocaleProvider.
 */
export const englishT: TranslateFn = (source, values) => translate({}, source, values);

/**
 * Marks English text for translation without translating it yet, e.g. in a
 * module-level map. Pass the value through `t()` when rendering.
 */
export function msg<T extends string>(source: T): T {
  return source;
}

export interface Translator {
  /** Translate English source text, filling `{name}` placeholders. */
  (source: string, values?: MessageValues): string;
  /**
   * Pick the singular or plural English text for `count`, then translate it.
   * `{count}` is filled with the count formatted for the locale.
   */
  plural: (count: number, one: string, other: string, values?: MessageValues) => string;
  locale: string;
}

/**
 * useT
 * Returns `t()`, which shows built-in English UI text in the active
 * language.
 *
 * @example
 * ```tsx
 * const t = useT();
 * <button aria-label={t("Dismiss notification")} />
 * t.plural(n, "{count} result", "{count} results")
 * ```
 */
export function useT(): Translator {
  const { locale, messages } = useContext(LocaleContext);
  return useMemo(() => {
    const rules = new Intl.PluralRules(locale);
    const number = new Intl.NumberFormat(locale);
    const t = ((source: string, values?: MessageValues) =>
      translate(messages, source, values)) as Translator;
    t.plural = (count, one, other, values) =>
      translate(messages, rules.select(count) === "one" ? one : other, {
        count: number.format(count),
        ...values,
      });
    t.locale = locale;
    return t;
  }, [messages, locale]);
}
