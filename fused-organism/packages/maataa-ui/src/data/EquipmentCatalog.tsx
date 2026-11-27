/**
 * @maataa/ui/data/EquipmentCatalog
 * Gear with availability and day rates
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  dayRate?: number;
  available: number;
  total: number;
  photoUrl?: string;
}

export interface EquipmentCatalogProps {
  items: EquipmentItem[];
  onBook: (item: EquipmentItem) => void;
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/** EquipmentCatalog: grouped by category; "Book" names the item. */
export function EquipmentCatalog({
  items,
  onBook,
  currency = "INR",
  locale: localeProp,
}: EquipmentCatalogProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const cats = Array.from(new Set(items.map((i) => i.category)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.lg }}>
      {cats.map((c) => (
        <section key={c} aria-label={c}>
          <h3 style={{ margin: `0 0 ${spacingTokens.sm}`, fontSize: typographyTokens.fontSize.lg }}>
            {c}
          </h3>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: spacingTokens.sm,
            }}
          >
            {items
              .filter((i) => i.category === c)
              .map((i) => (
                <li
                  key={i.id}
                  style={{
                    border: `1px solid ${colorTokens.border.primary}`,
                    borderRadius: 8,
                    padding: spacingTokens.sm,
                    background: colorTokens.background.primary,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <strong>{i.name}</strong>
                  <span
                    style={{
                      fontSize: typographyTokens.fontSize.sm,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {i.dayRate !== undefined
                      ? `${money.format(i.dayRate)} / day`
                      : "Rate on request"}
                  </span>
                  <span>
                    <Badge
                      variant={
                        i.available === 0 ? "error" : i.available < i.total ? "warning" : "success"
                      }
                    >
                      {i.available === 0 ? "None free" : `${i.available} of ${i.total} free`}
                    </Badge>
                  </span>
                  <button
                    type="button"
                    disabled={i.available === 0}
                    onClick={() => onBook(i)}
                    aria-label={t("Book {name}", { name: i.name })}
                    style={{
                      marginTop: 4,
                      alignSelf: "flex-start",
                      padding: "4px 12px",
                      border: `1px solid ${colorTokens.interactive.primary}`,
                      borderRadius: 6,
                      background: colorTokens.background.primary,
                      color: colorTokens.interactive.primary,
                      cursor: i.available ? "pointer" : "not-allowed",
                      font: "inherit",
                      opacity: i.available ? 1 : 0.5,
                    }}
                  >
                    {t("Book")}
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
EquipmentCatalog.displayName = "EquipmentCatalog";
