/**
 * @maataa/ui/surfaces/SettingsPanel
 * Settings sections with a sticky save bar that appears on change
 */

import React, { useId } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  /** Danger zone styling (archive, delete, transfer) */
  danger?: boolean;
}

export interface SettingsPanelProps {
  title: string;
  sections: SettingsSection[];
  /** Unsaved changes exist */
  dirty?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
  saving?: boolean;
  /** Last save result, announced politely */
  savedMessage?: string;
}

/**
 * SettingsPanel
 * Each section is a labelled region with its own heading. The save bar
 * only appears when something changed, and says so.
 */
export function SettingsPanel({
  title,
  sections,
  dirty = false,
  onSave,
  onDiscard,
  saving,
  savedMessage,
}: SettingsPanelProps) {
  const id = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.lg }}>
      <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"] }}>{title}</h2>
      {sections.map((s) => (
        <section
          key={s.id}
          aria-labelledby={`${id}-${s.id}`}
          style={{
            border: `1px solid ${s.danger ? colorTokens.interactive.error : colorTokens.border.primary}`,
            borderRadius: 8,
            padding: spacingTokens.md,
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens.sm,
          }}
        >
          <div>
            <h3
              id={`${id}-${s.id}`}
              style={{
                margin: 0,
                fontSize: typographyTokens.fontSize.lg,
                color: s.danger ? colorTokens.interactive.error : colorTokens.text.primary,
              }}
            >
              {s.title}
            </h3>
            {s.description && (
              <p
                style={{
                  margin: `${spacingTokens.xs} 0 0`,
                  color: colorTokens.text.secondary,
                  fontSize: typographyTokens.fontSize.sm,
                }}
              >
                {s.description}
              </p>
            )}
          </div>
          {s.content}
        </section>
      ))}
      <div
        role="status"
        style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.interactive.success }}
      >
        {!dirty && savedMessage ? savedMessage : ""}
      </div>
      {dirty && (onSave || onDiscard) && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: spacingTokens.sm,
            padding: spacingTokens.sm,
            background: colorTokens.background.secondary,
            borderTop: `1px solid ${colorTokens.border.primary}`,
          }}
        >
          <span>You have unsaved changes.</span>
          <span style={{ display: "flex", gap: spacingTokens.sm }}>
            {onDiscard && (
              <Button variant="secondary" onClick={onDiscard} disabled={saving}>
                Discard
              </Button>
            )}
            {onSave && (
              <Button onClick={onSave} disabled={saving} aria-busy={saving || undefined}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
SettingsPanel.displayName = "SettingsPanel";
