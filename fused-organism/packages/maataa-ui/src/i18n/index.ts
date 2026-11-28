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
  withNumerals,
  englishT,
  languageOf,
  directionOf,
  DEFAULT_LOCALE,
  type LocaleProviderProps,
  type LocaleContextValue,
  type MessageValues,
  type Translator,
  type TranslateFn,
  type Numerals,
} from "./LocaleProvider";
export { IndianDate, type IndianDateProps } from "./IndianDate";
export {
  vikramDate,
  sunLongitude,
  moonLongitude,
  lahiriAyanamsa,
  sunSign,
  elongation,
  VIKRAM_MONTHS,
  TITHIS,
  RITUS,
  type VikramDate,
  type VikramDateOptions,
  type MonthSystem,
} from "./indianCalendar";
export { builtInMessages, hi as hiMessages, type Messages } from "./messages";
