/**
 * @maataa/ui/forms/BookingForm
 * Book a location or equipment for a date range
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { AvailabilityCalendar, type DateRangeValue } from "./AvailabilityCalendar";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface BookingValues {
  start: Date;
  end: Date;
  quantity: number;
  purpose: string;
  /** e.g. scene numbers */
  scenes: string;
}

export interface BookingFormProps {
  subject: string;
  booked: Date[];
  /** Per-day price, for the estimate */
  dayRate?: number;
  /** Show the quantity field (equipment) */
  withQuantity?: boolean;
  maxQuantity?: number;
  onSubmit: (v: BookingValues) => void;
  onCancel?: () => void;
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
  initialMonth?: Date;
}

/**
 * BookingForm
 * Dates from the availability calendar, then purpose; shows a live cost
 * estimate in a status line.
 */
export function BookingForm({
  subject,
  booked,
  dayRate,
  withQuantity,
  maxQuantity = 10,
  onSubmit,
  onCancel,
  currency = "INR",
  locale: localeProp,
  initialMonth = new Date(),
}: BookingFormProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const id = useId();
  const [month, setMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );
  const [range, setRange] = useState<DateRangeValue>({ start: null, end: null });
  const [qty, setQty] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [scenes, setScenes] = useState("");
  const [error, setError] = useState("");
  const days = range.start
    ? Math.round(((range.end ?? range.start).getTime() - range.start.getTime()) / 86_400_000) + 1
    : 0;
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return (
    <form
      noValidate
      aria-label={t("Book {subject}", { subject })}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 520 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!range.start) return setError("Choose the dates first");
        if (!purpose.trim()) return setError("Say what it's for");
        setError("");
        onSubmit({
          start: range.start,
          end: range.end ?? range.start,
          quantity: qty,
          purpose: purpose.trim(),
          scenes: scenes.trim(),
        });
      }}
    >
      <AvailabilityCalendar
        subject={subject}
        month={month}
        onMonthChange={setMonth}
        booked={booked}
        value={range}
        onChange={setRange}
        locale={locale}
        min={new Date()}
      />
      {withQuantity && (
        <label style={{ display: "flex", flexDirection: "column", gap: 2, fontWeight: 500 }}>
          {t("Quantity")}
          <input
            type="number"
            min={1}
            max={maxQuantity}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Math.min(maxQuantity, Number(e.target.value) || 1)))
            }
            style={{
              width: 100,
              padding: 8,
              border: `2px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
            }}
          />
        </label>
      )}
      <label style={{ display: "flex", flexDirection: "column", gap: 2, fontWeight: 500 }}>
        {t("What it’s for")}
        <input
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          aria-describedby={error ? `${id}-e` : undefined}
          style={{
            padding: 8,
            border: `2px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontWeight: 400,
          }}
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 2, fontWeight: 500 }}>
        {t("Scenes (optional)")}
        <input
          value={scenes}
          onChange={(e) => setScenes(e.target.value)}
          placeholder="e.g. 12, 14A"
          style={{
            padding: 8,
            border: `2px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontWeight: 400,
          }}
        />
      </label>
      {dayRate !== undefined && (
        <div role="status" style={{ fontSize: typographyTokens.fontSize.sm }}>
          {days
            ? t.plural(
                days,
                "Estimate: {count} day × {qty} × {rate} = {total}",
                "Estimate: {count} days × {qty} × {rate} = {total}",
                { qty, rate: money.format(dayRate), total: money.format(days * qty * dayRate) }
              )
            : t("Day rate {rate}", { rate: money.format(dayRate) })}
        </div>
      )}
      {error && (
        <div id={`${id}-e`} role="alert" style={{ color: colorTokens.interactive.error }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button type="submit">{t("Request booking")}</Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {t("Cancel")}
          </Button>
        )}
      </div>
    </form>
  );
}
BookingForm.displayName = "BookingForm";
