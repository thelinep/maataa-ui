/**
 * @maataa/ui/actions/QuickActionPanel
 * Dashboard shortcuts to the most common tasks
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Why it's disabled, shown in words */
  disabledReason?: string;
}

export interface QuickActionPanelProps {
  actions: QuickAction[];
  /** @default 'Quick actions' */
  title?: string;
}

/**
 * QuickActionPanel
 * A labelled region of large buttons. Disabled actions say why.
 */
export function QuickActionPanel({ actions, title = "Quick actions" }: QuickActionPanelProps) {
  return (
    <section aria-label={title}>
      <h2 style={{ margin: `0 0 ${spacingTokens.sm}`, fontSize: typographyTokens.fontSize.lg }}>
        {title}
      </h2>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: spacingTokens.sm,
        }}
      >
        {actions.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={a.onSelect}
              disabled={a.disabled}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                gap: spacingTokens.sm,
                alignItems: "flex-start",
                textAlign: "left",
                padding: spacingTokens.md,
                border: `1px solid ${colorTokens.border.primary}`,
                borderRadius: 8,
                background: colorTokens.background.primary,
                color: colorTokens.text.primary,
                cursor: a.disabled ? "not-allowed" : "pointer",
                opacity: a.disabled ? 0.6 : 1,
                font: "inherit",
              }}
            >
              {a.icon && (
                <span aria-hidden="true" style={{ fontSize: 22 }}>
                  {a.icon}
                </span>
              )}
              <span>
                <span style={{ display: "block", fontWeight: 600 }}>{a.label}</span>
                {(a.disabled ? a.disabledReason : a.description) && (
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.sm,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {a.disabled ? a.disabledReason : a.description}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
QuickActionPanel.displayName = "QuickActionPanel";
