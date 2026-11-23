/**
 * @maataa/ui/i18n
 * Category: i18n
 * Language, locale formats and text direction for every component
 */

export {
  LocaleProvider,
  useLocale,
  useLocaleContext,
  useT,
  translate,
  msg,
  languageOf,
  directionOf,
  DEFAULT_LOCALE,
  type LocaleProviderProps,
  type LocaleContextValue,
  type MessageValues,
  type Translator,
} from "./LocaleProvider";
export { builtInMessages, hi as hiMessages, type Messages } from "./messages";
