/**
 * @maataa/ui/i18n/IndianDate
 * Shows a date as Vikram Samvat: lunar month, paksha, tithi, samvat year and
 * ritu — "Margashirsha Krishna Pratipada · Vikram Samvat 2083 · Hemant ritu", or in
 * Hindi "मार्गशीर्ष कृष्ण प्रतिपदा · विक्रम संवत् 2083 · हेमंत ऋतु". Digits follow the
 * LocaleProvider's `numerals` (Devanagari or Brahmi as well as 0–9).
 */

import React, { useEffect, useMemo, useState } from "react";
import { msg, useLocale, useT } from "./LocaleProvider";
import { vikramDate, type VikramDateOptions } from "./indianCalendar";

const PAKSHA = { shukla: msg("Shukla"), krishna: msg("Krishna") } as const;

export interface IndianDateProps extends VikramDateOptions {
  /** The moment to show. Leave out to show today, kept current while mounted. */
  date?: Date;
  /** Add the ritu (season). @default true */
  showRitu?: boolean;
  /** Add the Shaka year. @default false */
  showShaka?: boolean;
  /** Add the ordinary (Gregorian) date in the locale's format. @default false */
  showGregorian?: boolean;
  /** Locale for digits and the Gregorian date. @default the LocaleProvider's */
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * IndianDate
 *
 * @example
 * ```tsx
 * <LocaleProvider locale="hi-IN" numerals="brah">
 *   <IndianDate showGregorian />
 * </LocaleProvider>
 * ```
 */
export function IndianDate({
  date,
  showRitu = true,
  showShaka = false,
  showGregorian = false,
  locale: localeProp,
  className,
  style,
  system,
  lat,
  lng,
  at,
}: IndianDateProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (date) return undefined;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [date]);
  const when = date ?? now;
  const v = useMemo(() => vikramDate(when, { system, lat, lng, at }), [when, system, lat, lng, at]);

  const year = (n: number) => new Intl.NumberFormat(locale, { useGrouping: false }).format(n);
  const month = v.adhik ? t("Adhik {month}", { month: t(v.monthName) }) : t(v.monthName);
  const day =
    v.tithi === 15
      ? t("{month} {tithi}", { month, tithi: t(v.tithiName) })
      : t("{month} {paksha} {tithi}", {
          month,
          paksha: t(PAKSHA[v.paksha]),
          tithi: t(v.tithiName),
        });
  const parts = [day, t("Vikram Samvat {year}", { year: year(v.samvat) })];
  if (showShaka) parts.push(t("Shaka {year}", { year: year(v.shaka) }));
  if (showRitu) parts.push(t("{ritu} ritu", { ritu: t(v.rituName) }));
  if (showGregorian)
    parts.push(when.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }));

  const iso = `${when.getFullYear()}-${String(when.getMonth() + 1).padStart(2, "0")}-${String(when.getDate()).padStart(2, "0")}`;
  return (
    <time dateTime={iso} className={className} style={style}>
      {parts.join(" · ")}
    </time>
  );
}

IndianDate.displayName = "IndianDate";
