/**
 * @maataa/ui/surfaces/ConflictResolutionPanel
 * Two versions of a record changed offline: choose per field
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ConflictField {
  key: string;
  label: string;
  mine: string;
  theirs: string;
}

export interface ConflictResolutionPanelProps {
  /** What the record is, e.g. "Budget line: Catering" */
  recordName: string;
  /** Who made the other change */
  theirAuthor: string;
  theirTime?: Date;
  fields: ConflictField[];
  /** Called with the chosen value per field key */
  onResolve: (values: Record<string, string>) => void;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * ConflictResolutionPanel
 * Each differing field is a radio group: "Your version" or "<name>'s
 * version". Shortcuts keep all of one side. Nothing is applied until Save.
 *
 * @example
 * ```tsx
 * <ConflictResolutionPanel recordName="Catering" theirAuthor="Ravi" fields={diff} onResolve={save} />
 * ```
 */
export function ConflictResolutionPanel({
  recordName,
  theirAuthor,
  theirTime,
  fields,
  onResolve,
  locale = "en-IN",
}: ConflictResolutionPanelProps) {
  const id = useId();
  const [choice, setChoice] = useState<Record<string, "mine" | "theirs">>(() =>
    Object.fromEntries(fields.map((f) => [f.key, "mine"]))
  );
  const all = (side: "mine" | "theirs") =>
    setChoice(Object.fromEntries(fields.map((f) => [f.key, side])));
  const cell: React.CSSProperties = {
    display: "flex",
    gap: spacingTokens.sm,
    alignItems: "flex-start",
    padding: spacingTokens.sm,
    border: `1px solid ${colorTokens.border.primary}`,
    borderRadius: 6,
    cursor: "pointer",
  };
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      <div>
        <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>
          Two versions of {recordName}
        </h2>
        <p style={{ margin: `${spacingTokens.xs} 0 0`, color: colorTokens.text.secondary }}>
          {theirAuthor} changed this while you were offline
          {theirTime
            ? ` (${theirTime.toLocaleString(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })})`
            : ""}
          . Choose which value to keep for each field.
        </p>
      </div>
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button variant="secondary" onClick={() => all("mine")}>
          Keep all mine
        </Button>
        <Button variant="secondary" onClick={() => all("theirs")}>
          Keep all {theirAuthor}’s
        </Button>
      </div>
      {fields.map((f) => (
        <fieldset key={f.key} style={{ border: "none", margin: 0, padding: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: spacingTokens.xs }}>{f.label}</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.sm }}>
            {(["mine", "theirs"] as const).map((side) => (
              <label
                key={side}
                style={{
                  ...cell,
                  borderColor:
                    choice[f.key] === side
                      ? colorTokens.interactive.primary
                      : colorTokens.border.primary,
                  borderWidth: choice[f.key] === side ? 2 : 1,
                }}
              >
                <input
                  type="radio"
                  name={`${id}-${f.key}`}
                  checked={choice[f.key] === side}
                  onChange={() => setChoice((c) => ({ ...c, [f.key]: side }))}
                  style={{ accentColor: colorTokens.interactive.primary }}
                />
                <span>
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {side === "mine" ? "Your version" : `${theirAuthor}'s version`}
                  </span>
                  {side === "mine" ? f.mine : f.theirs}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div>
        <Button
          onClick={() =>
            onResolve(
              Object.fromEntries(
                fields.map((f) => [f.key, choice[f.key] === "mine" ? f.mine : f.theirs])
              )
            )
          }
        >
          Save chosen values
        </Button>
      </div>
    </section>
  );
}

ConflictResolutionPanel.displayName = "ConflictResolutionPanel";
