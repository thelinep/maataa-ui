/**
 * @maataa/ui/forms/WrapForm
 * End-of-day wrap report and its summary
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { DetailList } from "../data/RecordHeader";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface WrapValues {
  wrapTime: string;
  scenesCompleted: string;
  scenesMoved: string;
  /** e.g. "4 4/8" */
  pagesShot: string;
  setups: number;
  cardsBackedUp: boolean;
  backupBy: string;
  incidents: boolean;
  notes: string;
}

export interface WrapFormProps {
  shootDay: number;
  initial?: Partial<WrapValues>;
  onSubmit: (v: WrapValues) => void;
  busy?: boolean;
}

/**
 * WrapForm
 * Media backup is confirmed with a named person; the form won't submit
 * without it. Ticking "incidents" reminds you to file an incident report.
 */
export function WrapForm({ shootDay, initial = {}, onSubmit, busy }: WrapFormProps) {
  const id = useId();
  const [v, setV] = useState<WrapValues>({
    wrapTime: "",
    scenesCompleted: "",
    scenesMoved: "",
    pagesShot: "",
    setups: 0,
    cardsBackedUp: false,
    backupBy: "",
    incidents: false,
    notes: "",
    ...initial,
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const set = <K extends keyof WrapValues>(k: K, val: WrapValues[K]) =>
    setV((s) => ({ ...s, [k]: val }));
  const inp: React.CSSProperties = {
    padding: 8,
    border: `2px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    font: "inherit",
    fontWeight: 400,
    background: colorTokens.background.primary,
  };
  const lab: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    fontWeight: 500,
  };
  return (
    <form
      noValidate
      aria-label={`Wrap report, day ${shootDay}`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        if (!v.wrapTime) errs.push({ fieldId: `${id}-wrap`, message: "Enter the wrap time" });
        if (!v.cardsBackedUp || !v.backupBy.trim())
          errs.push({
            fieldId: `${id}-backup`,
            message: "Confirm the cards are backed up, and by whom",
          });
        setErrors(errs);
        if (!errs.length) onSubmit(v);
      }}
    >
      <ErrorSummary errors={errors} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
        <label style={lab}>
          Wrap time
          <input
            id={`${id}-wrap`}
            type="time"
            value={v.wrapTime}
            onChange={(e) => set("wrapTime", e.target.value)}
            style={inp}
          />
        </label>
        <label style={lab}>
          Setups
          <input
            type="number"
            min={0}
            value={v.setups}
            onChange={(e) => set("setups", Math.max(0, Number(e.target.value) || 0))}
            style={inp}
          />
        </label>
        <label style={lab}>
          Scenes completed
          <input
            value={v.scenesCompleted}
            onChange={(e) => set("scenesCompleted", e.target.value)}
            placeholder="12, 13, 14A"
            style={inp}
          />
        </label>
        <label style={lab}>
          Pages shot
          <input
            value={v.pagesShot}
            onChange={(e) => set("pagesShot", e.target.value)}
            placeholder="4 4/8"
            style={inp}
          />
        </label>
      </div>
      <label style={lab}>
        Scenes moved to another day
        <input
          value={v.scenesMoved}
          onChange={(e) => set("scenesMoved", e.target.value)}
          style={inp}
        />
      </label>
      <fieldset
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.sm,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.xs,
        }}
      >
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Media backup</legend>
        <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
          <input
            id={`${id}-backup`}
            type="checkbox"
            checked={v.cardsBackedUp}
            onChange={(e) => set("cardsBackedUp", e.target.checked)}
            style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
          />
          All camera and sound cards are backed up to two drives
        </label>
        <label style={lab}>
          Backed up by
          <input value={v.backupBy} onChange={(e) => set("backupBy", e.target.value)} style={inp} />
        </label>
      </fieldset>
      <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }}>
        <input
          type="checkbox"
          checked={v.incidents}
          onChange={(e) => set("incidents", e.target.checked)}
          aria-describedby={v.incidents ? `${id}-inc` : undefined}
          style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
        />
        <span>
          There was an injury, damage or near miss today
          {v.incidents && (
            <span
              id={`${id}-inc`}
              style={{
                display: "block",
                color: colorTokens.interactive.warning,
                fontSize: typographyTokens.fontSize.sm,
                fontWeight: 600,
              }}
            >
              File an incident report before you leave set.
            </span>
          )}
        </span>
      </label>
      <label style={lab}>
        Notes for tomorrow
        <textarea
          rows={3}
          value={v.notes}
          onChange={(e) => set("notes", e.target.value)}
          style={inp}
        />
      </label>
      <div>
        <Button type="submit" disabled={busy}>
          Submit wrap report
        </Button>
      </div>
    </form>
  );
}
WrapForm.displayName = "WrapForm";

/** WrapSummary: the submitted wrap report, read-only. */
export function WrapSummary({
  shootDay,
  wrap,
  submittedBy,
}: {
  shootDay: number;
  wrap: WrapValues;
  submittedBy?: string;
}) {
  return (
    <section
      aria-label={`Wrap summary, day ${shootDay}`}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        Day {shootDay} wrapped at {wrap.wrapTime}
      </h3>
      <DetailList
        items={[
          { label: "Scenes completed", value: wrap.scenesCompleted },
          { label: "Scenes moved", value: wrap.scenesMoved || "None" },
          { label: "Pages shot", value: wrap.pagesShot },
          { label: "Setups", value: String(wrap.setups) },
          {
            label: "Backup",
            value: wrap.cardsBackedUp ? `Done by ${wrap.backupBy}` : "Not confirmed",
          },
          { label: "Incidents", value: wrap.incidents ? "Yes, see incident report" : "None" },
        ]}
      />
      {wrap.notes && <p style={{ margin: 0 }}>{wrap.notes}</p>}
      {submittedBy && (
        <span style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}>
          Submitted by {submittedBy}
        </span>
      )}
    </section>
  );
}
WrapSummary.displayName = "WrapSummary";
