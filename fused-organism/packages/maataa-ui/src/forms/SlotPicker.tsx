/**
 * @maataa/ui/forms/SlotPicker
 * Pick a time slot (auditions, recces, rentals)
 */

import { useLocale } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Slot {
  id: string;
  start: Date;
  end: Date;
  /** Taken by someone else */
  taken?: boolean;
}

export interface SlotPickerProps {
  legend: string;
  slots: Slot[];
  value: string | undefined;
  onChange: (slotId: string) => void;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * SlotPicker
 * Slots grouped by day, as radios inside each day's fieldset. Taken slots
 * stay visible but disabled with "taken" in their name.
 */
export function SlotPicker({
  legend,
  slots,
  value,
  onChange,
  locale: localeProp,
}: SlotPickerProps) {
  const locale = useLocale(localeProp);
  const t = (d: Date) => d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const days = new Map<string, Slot[]>();
  [...slots]
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .forEach((s) => {
      const k = s.start.toDateString();
      days.set(k, [...(days.get(k) ?? []), s]);
    });
  return (
    <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
      <legend style={{ fontWeight: 600, padding: 0, marginBottom: spacingTokens.sm }}>
        {legend}
      </legend>
      <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}>
        {Array.from(days.entries()).map(([k, list]) => (
          <fieldset key={k} style={{ border: "none", margin: 0, padding: 0 }}>
            <legend
              style={{
                fontSize: typographyTokens.fontSize.sm,
                color: colorTokens.text.secondary,
                padding: 0,
                marginBottom: spacingTokens.xs,
              }}
            >
              {list[0].start.toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </legend>
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.xs }}>
              {list.map((s) => {
                const on = value === s.id;
                return (
                  <label
                    key={s.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: `6px ${spacingTokens.sm}`,
                      border: `${on ? 2 : 1}px solid ${on ? colorTokens.interactive.primary : colorTokens.border.control}`,
                      borderRadius: 999,
                      background: s.taken
                        ? colorTokens.background.tertiary
                        : on
                          ? colorTokens.background.tertiary
                          : colorTokens.background.primary,
                      color: s.taken ? colorTokens.text.secondary : colorTokens.text.primary,
                      textDecoration: s.taken ? "line-through" : "none",
                      cursor: s.taken ? "not-allowed" : "pointer",
                      fontSize: typographyTokens.fontSize.sm,
                    }}
                  >
                    <input
                      type="radio"
                      name={`slot-${legend}`}
                      checked={on}
                      disabled={s.taken}
                      onChange={() => onChange(s.id)}
                      style={{ accentColor: colorTokens.interactive.primary }}
                    />
                    {t(s.start)}–{t(s.end)}
                    {s.taken && (
                      <span
                        style={{
                          position: "absolute",
                          width: 1,
                          height: 1,
                          overflow: "hidden",
                          clip: "rect(0 0 0 0)",
                        }}
                      >
                        , taken
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </fieldset>
  );
}
SlotPicker.displayName = "SlotPicker";
