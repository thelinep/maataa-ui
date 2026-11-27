/**
 * @maataa/ui/data/ScenarioCard
 * One what-if scenario: its assumptions and results, selectable
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ScenarioFigure {
  label: string;
  /** Already formatted, e.g. "₹2.4 Cr" or "18%" */
  value: string;
}

export interface ScenarioCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onSelect" | "results"
> {
  name: string;
  /** One line about the scenario */
  summary?: string;
  assumptions: ScenarioFigure[];
  results: ScenarioFigure[];
  /** Marks the chosen scenario */
  selected?: boolean;
  /** Shows a "Use this scenario" button */
  onSelect?: () => void;
}

const dl: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: `${spacingTokens.xs} ${spacingTokens.md}`,
  margin: 0,
};

/**
 * ScenarioCard
 * Revenue or budget scenario, with assumptions and outcomes as definition
 * lists. Selection is a real button with aria-pressed.
 *
 * @example
 * ```tsx
 * <ScenarioCard name="Festival-first" assumptions={[...]} results={[...]} selected onSelect={pick} />
 * ```
 */
export const ScenarioCard = React.forwardRef<HTMLElement, ScenarioCardProps>(
  ({ name, summary, assumptions, results, selected = false, onSelect, style, ...props }, ref) => {
    const t = useT();
    const id = useId();
    const block = (title: string, figures: ScenarioFigure[]) => (
      <div>
        <h4
          style={{
            margin: `${spacingTokens.md} 0 ${spacingTokens.xs}`,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
          }}
        >
          {title}
        </h4>
        <dl style={dl}>
          {figures.map((f) => (
            <React.Fragment key={f.label}>
              <dt style={{ color: colorTokens.text.primary }}>{f.label}</dt>
              <dd
                style={{
                  margin: 0,
                  fontWeight: 600,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {f.value}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    );
    return (
      <article
        ref={ref}
        aria-labelledby={`${id}-name`}
        style={{
          border: `${selected ? 2 : 1}px solid ${selected ? colorTokens.interactive.primary : colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.lg,
          background: colorTokens.background.secondary,
          ...style,
        }}
        {...props}
      >
        <h3 id={`${id}-name`} style={{ margin: 0 }}>
          {name}
          {selected && " "}
          {selected && (
            <span
              style={{
                color: colorTokens.interactive.primary,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {t("(selected)")}
            </span>
          )}
        </h3>
        {summary && (
          <p style={{ margin: `${spacingTokens.xs} 0 0`, color: colorTokens.text.secondary }}>
            {summary}
          </p>
        )}
        {block("Assumptions", assumptions)}
        {block("Results", results)}
        {onSelect && (
          <button
            type="button"
            aria-pressed={selected}
            aria-describedby={`${id}-name`}
            onClick={onSelect}
            style={{
              marginTop: spacingTokens.md,
              minHeight: 36,
              padding: `0 ${spacingTokens.md}`,
              borderRadius: 6,
              border: `1px solid ${colorTokens.interactive.primary}`,
              background: selected ? colorTokens.interactive.primary : "transparent",
              color: selected ? colorTokens.text.inverse : colorTokens.interactive.primary,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {selected ? t("Selected") : t("Use this scenario")}
          </button>
        )}
      </article>
    );
  }
);

ScenarioCard.displayName = "ScenarioCard";
