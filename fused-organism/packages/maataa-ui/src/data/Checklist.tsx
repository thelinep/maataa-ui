/**
 * @maataa/ui/data/Checklist
 * Items to tick off, with a completion count
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ChecklistItem {
  id: string;
  label: string;
  /** Extra detail under the label */
  description?: string;
  checked: boolean;
  /** Cannot be changed (e.g. completed by someone else) */
  disabled?: boolean;
}

export interface ChecklistProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Heading of the list, e.g. "Subsidy application" */
  title: string;
  items: ChecklistItem[];
  onChange?: (id: string, checked: boolean) => void;
  /** Heading level of the title @default 3 */
  headingLevel?: 2 | 3 | 4;
}

/**
 * Checklist
 * Native checkboxes with labels, and an "N of M done" count and bar. The
 * count is tied to the list with aria-describedby.
 *
 * @example
 * ```tsx
 * <Checklist title="Subsidy application" items={items} onChange={toggle} />
 * ```
 */
export const Checklist = React.forwardRef<HTMLElement, ChecklistProps>(
  ({ title, items, onChange, headingLevel = 3, style, ...props }, ref) => {
    const id = useId();
    const done = items.filter((i) => i.checked).length;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
    return (
      <section ref={ref} aria-labelledby={`${id}-title`} style={style} {...props}>
        <Heading id={`${id}-title`} style={{ margin: `0 0 ${spacingTokens.xs}` }}>
          {title}
        </Heading>
        <p
          id={`${id}-count`}
          style={{
            margin: `0 0 ${spacingTokens.sm}`,
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {done} of {items.length} done
        </p>
        <div
          aria-hidden="true"
          style={{
            height: 6,
            borderRadius: 3,
            background: colorTokens.background.tertiary,
            marginBottom: spacingTokens.md,
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 3,
              background: colorTokens.interactive.success,
            }}
          />
        </div>
        <ul aria-describedby={`${id}-count`} style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ padding: `${spacingTokens.xs} 0` }}>
              <label
                style={{
                  display: "flex",
                  gap: spacingTokens.sm,
                  alignItems: "flex-start",
                  cursor: item.disabled ? "default" : "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  disabled={item.disabled}
                  aria-describedby={item.description ? `${id}-${item.id}-d` : undefined}
                  onChange={(e) => onChange?.(item.id, e.target.checked)}
                  style={{ width: 20, height: 20, margin: 0, flex: "0 0 auto" }}
                />
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: colorTokens.text.primary,
                      textDecoration: item.checked ? "line-through" : "none",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span
                      id={`${id}-${item.id}-d`}
                      style={{
                        color: colorTokens.text.secondary,
                        fontSize: typographyTokens.fontSize.sm,
                      }}
                    >
                      {item.description}
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    );
  }
);

Checklist.displayName = "Checklist";
