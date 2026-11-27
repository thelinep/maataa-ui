/**
 * @maataa/ui/forms/ChoiceCards
 * Large selectable cards: single (radio) or multiple (checkbox)
 */

import { msg, useT } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ChoiceCardOption {
  value: string;
  label: string;
  description?: string;
  /** Decorative icon or emoji */
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface Base {
  legend: string;
  options: ChoiceCardOption[];
  /** Minimum card width @default 180 */
  minWidth?: number;
  error?: string;
  hint?: string;
}

export interface ChoiceCardsSingleProps extends Base {
  multiple?: false;
  value: string | undefined;
  onChange: (value: string) => void;
}

export interface ChoiceCardsMultiProps extends Base {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

export type ChoiceCardsProps = ChoiceCardsSingleProps | ChoiceCardsMultiProps;

/**
 * ChoiceCards
 * Native radios or checkboxes inside label cards, grouped by a fieldset,
 * so arrow keys and screen readers work as usual.
 *
 * @example
 * ```tsx
 * <ChoiceCards legend="Account type" options={opts} value={type} onChange={setType} />
 * ```
 */
export function ChoiceCards(props: ChoiceCardsProps) {
  const t = useT();
  const { legend, options, minWidth = 180, error, hint } = props;
  const id = useId();
  const isOn = (v: string) => (props.multiple ? props.value.includes(v) : props.value === v);
  const toggle = (v: string) => {
    if (props.multiple)
      props.onChange(
        props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]
      );
    else props.onChange(v);
  };
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset aria-describedby={describedBy} style={{ border: "none", margin: 0, padding: 0 }}>
      <legend style={{ fontWeight: 600, marginBottom: spacingTokens.xs, padding: 0 }}>
        {legend}
      </legend>
      {hint && (
        <div
          id={`${id}-hint`}
          style={{
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.sm,
            marginBottom: spacingTokens.sm,
          }}
        >
          {hint}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
          gap: spacingTokens.sm,
        }}
      >
        {options.map((o) => {
          const on = isOn(o.value);
          return (
            <label
              key={o.value}
              style={{
                display: "flex",
                gap: spacingTokens.sm,
                alignItems: "flex-start",
                padding: spacingTokens.md,
                borderRadius: 8,
                border: `${on ? 2 : 1}px solid ${on ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                background: on ? colorTokens.background.tertiary : colorTokens.background.primary,
                cursor: o.disabled ? "not-allowed" : "pointer",
                opacity: o.disabled ? 0.55 : 1,
              }}
            >
              <input
                type={props.multiple ? "checkbox" : "radio"}
                name={`${id}-choice`}
                value={o.value}
                checked={on}
                disabled={o.disabled}
                onChange={() => toggle(o.value)}
                style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
              />
              <span>
                {o.icon && (
                  <span
                    aria-hidden="true"
                    style={{ display: "block", fontSize: 24, marginBottom: 4 }}
                  >
                    {o.icon}
                  </span>
                )}
                <span
                  style={{ display: "block", fontWeight: 600, color: colorTokens.text.primary }}
                >
                  {t(o.label)}
                </span>
                {o.description && (
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.sm,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {t(o.description)}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <div
          id={`${id}-err`}
          role="alert"
          style={{
            color: colorTokens.interactive.error,
            fontSize: typographyTokens.fontSize.sm,
            marginTop: spacingTokens.xs,
          }}
        >
          {error}
        </div>
      )}
    </fieldset>
  );
}
ChoiceCards.displayName = "ChoiceCards";

/** The four account types from onboarding */
export const accountTypeOptions: ChoiceCardOption[] = [
  {
    value: "individual",
    label: msg("Individual"),
    description: msg("Freelancer, crew member or artist"),
    icon: "🎭",
  },
  {
    value: "company",
    label: msg("Company"),
    description: msg("Production house or studio"),
    icon: "🏢",
  },
  {
    value: "organization",
    label: msg("Organization"),
    description: msg("Non-profit, school or collective"),
    icon: "🤝",
  },
  {
    value: "government",
    label: msg("Government"),
    description: msg("Film commission or public body"),
    icon: "🏛️",
  },
];

/** Common production roles for the role grid */
export const productionRoleOptions: ChoiceCardOption[] = [
  { value: "producer", label: msg("Producer"), icon: "🎬" },
  { value: "director", label: msg("Director"), icon: "🎥" },
  { value: "writer", label: msg("Writer"), icon: "✍️" },
  { value: "dop", label: msg("Cinematographer"), icon: "📷" },
  { value: "editor", label: msg("Editor"), icon: "✂️" },
  { value: "sound", label: msg("Sound"), icon: "🎧" },
  { value: "actor", label: msg("Actor"), icon: "🎭" },
  { value: "music", label: msg("Music"), icon: "🎼" },
  { value: "production", label: msg("Production team"), icon: "📋" },
];

export type AccountTypeSelectorProps = Omit<
  ChoiceCardsSingleProps,
  "options" | "legend" | "multiple"
> & { legend?: string };
/** AccountTypeSelector: Individual / Company / Organization / Government */
export const AccountTypeSelector = ({
  legend = "What kind of account is this?",
  ...p
}: AccountTypeSelectorProps) => <ChoiceCards legend={legend} options={accountTypeOptions} {...p} />;

export type RoleSelectionGridProps = Omit<
  ChoiceCardsMultiProps,
  "options" | "legend" | "multiple"
> & { legend?: string; options?: ChoiceCardOption[] };
/** RoleSelectionGrid: pick every role that applies */
export const RoleSelectionGrid = ({
  legend = "What do you do? Pick all that apply.",
  options = productionRoleOptions,
  ...p
}: RoleSelectionGridProps) => (
  <ChoiceCards multiple legend={legend} options={options} minWidth={150} {...p} />
);
