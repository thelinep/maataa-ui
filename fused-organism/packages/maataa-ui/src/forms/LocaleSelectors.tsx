/**
 * @maataa/ui/forms/LocaleSelectors
 * Language, country, state/district and currency pickers
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useMemo } from "react";
import { Select, type SelectOption } from "./Select";
import {
  commonCurrencies,
  countryCodes,
  displayName,
  indianLanguages,
  indianStates,
} from "./localeData";

interface Common {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  description?: string;
  disabled?: boolean;
  /** Locale for names @default 'en-IN' */
  locale?: string;
}

const one = (v: string | string[]) => (Array.isArray(v) ? (v[0] ?? "") : v);

/**
 * LanguageSelector
 * Each language shows its English and native name ("Tamil · தமிழ்"), and the
 * native part carries its own lang attribute for correct pronunciation.
 */
export function LanguageSelector({
  value,
  onChange,
  label: labelProp,
  languages = indianLanguages,
  ...p
}: Common & { languages?: typeof indianLanguages }) {
  const t = useT();
  const label = labelProp ?? t("Language");
  const options: SelectOption[] = useMemo(
    () =>
      languages.map((l) => ({
        value: l.code,
        label: l.name === l.native ? l.name : `${l.name} · ${l.native}`,
      })),
    [languages]
  );
  return (
    <Select
      label={label}
      searchable
      value={value}
      onChange={(v) => onChange(one(v))}
      options={options}
      renderOption={(o) => {
        const lang = languages.find((l) => l.code === o.value);
        return lang && lang.native !== lang.name ? (
          <span>
            {lang.name} · <span lang={lang.code}>{lang.native}</span>
          </span>
        ) : (
          o.label
        );
      }}
      {...p}
    />
  );
}
LanguageSelector.displayName = "LanguageSelector";

/** CountrySelector: every ISO country, named in the chosen locale, searchable */
export function CountrySelector({
  value,
  onChange,
  label: labelProp,
  locale: localeProp,
  priority = ["IN"],
  ...p
}: Common & { priority?: string[] }) {
  const t = useT();
  const label = labelProp ?? t("Country");
  const locale = useLocale(localeProp);
  const options = useMemo(() => {
    const all = countryCodes.map((c) => ({ value: c, label: displayName(c, "region", locale) }));
    all.sort((a, b) => a.label.localeCompare(b.label, locale));
    const top = priority
      .map((c) => all.find((o) => o.value === c))
      .filter(Boolean) as SelectOption[];
    return [...top, ...all.filter((o) => !priority.includes(o.value))];
  }, [locale, priority]);
  return (
    <Select
      label={label}
      searchable
      value={value}
      onChange={(v) => onChange(one(v))}
      options={options}
      {...p}
    />
  );
}
CountrySelector.displayName = "CountrySelector";

export interface RegionValue {
  state: string;
  district?: string;
}

export interface RegionSelectorProps {
  value: RegionValue;
  onChange: (value: RegionValue) => void;
  /** Districts for the chosen state; omit to hide the district field */
  districtsFor?: (stateCode: string) => string[];
  stateError?: string;
  districtError?: string;
}

/**
 * RegionSelector
 * State / union territory, then district. Changing the state clears the
 * district so a stale one can't be submitted.
 */
export function RegionSelector({
  value,
  onChange,
  districtsFor,
  stateError,
  districtError,
}: RegionSelectorProps) {
  const t = useT();
  const states = useMemo(
    () => indianStates.map((s) => ({ value: s.code, label: s.ut ? `${s.name} (UT)` : s.name })),
    []
  );
  const districts = value.state && districtsFor ? districtsFor(value.state) : [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        label={t("State or union territory")}
        searchable
        value={value.state}
        onChange={(v) => onChange({ state: one(v), district: undefined })}
        options={states}
        error={stateError}
      />
      {districtsFor && (
        <Select
          label={t("District")}
          searchable
          disabled={!value.state}
          description={value.state ? undefined : "Choose a state first"}
          value={value.district ?? ""}
          onChange={(v) => onChange({ ...value, district: one(v) })}
          options={districts.map((d) => ({ value: d, label: d }))}
          error={districtError}
        />
      )}
    </div>
  );
}
RegionSelector.displayName = "RegionSelector";

/** CurrencySelector: "INR · Indian Rupee (₹)" with common currencies first */
export function CurrencySelector({
  value,
  onChange,
  label: labelProp,
  locale: localeProp,
  currencies = commonCurrencies,
  ...p
}: Common & { currencies?: string[] }) {
  const t = useT();
  const label = labelProp ?? t("Currency");
  const locale = useLocale(localeProp);
  const options = useMemo(
    () =>
      currencies.map((c) => {
        let symbol = "";
        try {
          symbol =
            new Intl.NumberFormat(locale, {
              style: "currency",
              currency: c,
              currencyDisplay: "narrowSymbol",
            })
              .formatToParts(0)
              .find((x) => x.type === "currency")?.value ?? "";
        } catch {
          /* unknown */
        }
        return {
          value: c,
          label: `${c} · ${displayName(c, "currency", locale)}${symbol && symbol !== c ? ` (${symbol})` : ""}`,
        };
      }),
    [currencies, locale]
  );
  return (
    <Select
      label={label}
      searchable
      value={value}
      onChange={(v) => onChange(one(v))}
      options={options}
      {...p}
    />
  );
}
CurrencySelector.displayName = "CurrencySelector";
