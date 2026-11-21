/**
 * @maataa/ui/forms/IncidentForm
 * Report an injury, damage or near miss, and its follow-up
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface IncidentValues {
  kind: "injury" | "damage" | "nearMiss" | "other";
  when: string;
  where: string;
  whatHappened: string;
  peopleInvolved: string;
  firstAidGiven: boolean;
  hospitalVisit: boolean;
  followUp: string;
  followUpOwner: string;
  followUpBy: string;
}

export interface IncidentFormProps {
  onSubmit: (v: IncidentValues) => void;
  busy?: boolean;
}

/**
 * IncidentForm
 * Plain-language fields with an "If someone is hurt, call 112 first"
 * notice at the top. Follow-up needs an owner and a date.
 */
export function IncidentForm({ onSubmit, busy }: IncidentFormProps) {
  const id = useId();
  const [v, setV] = useState<IncidentValues>({
    kind: "nearMiss",
    when: "",
    where: "",
    whatHappened: "",
    peopleInvolved: "",
    firstAidGiven: false,
    hospitalVisit: false,
    followUp: "",
    followUpOwner: "",
    followUpBy: "",
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const set = <K extends keyof IncidentValues>(k: K, val: IncidentValues[K]) =>
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
  const kinds = {
    injury: "Injury",
    damage: "Damage to equipment or property",
    nearMiss: "Near miss",
    other: "Other",
  };
  return (
    <form
      noValidate
      aria-label="Incident report"
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        if (!v.when) errs.push({ fieldId: `${id}-when`, message: "Enter when it happened" });
        if (v.whatHappened.trim().length < 20)
          errs.push({
            fieldId: `${id}-what`,
            message: "Describe what happened (at least 20 characters)",
          });
        if (v.followUp.trim() && (!v.followUpOwner.trim() || !v.followUpBy))
          errs.push({ fieldId: `${id}-owner`, message: "Give the follow-up an owner and a date" });
        setErrors(errs);
        if (!errs.length) onSubmit(v);
      }}
    >
      <p
        style={{
          margin: 0,
          padding: spacingTokens.sm,
          border: `2px solid ${colorTokens.interactive.error}`,
          borderRadius: 6,
          fontWeight: 600,
        }}
      >
        If someone is hurt, call 112 and get first aid before filling this in.
      </p>
      <ErrorSummary errors={errors} />
      <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
        <legend style={{ fontWeight: 500, padding: 0, marginBottom: spacingTokens.xs }}>
          What kind of incident?
        </legend>
        {Object.entries(kinds).map(([k, l]) => (
          <label
            key={k}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "center",
              padding: "2px 0",
            }}
          >
            <input
              type="radio"
              name={`${id}-kind`}
              checked={v.kind === k}
              onChange={() => set("kind", k as IncidentValues["kind"])}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            {l}
          </label>
        ))}
      </fieldset>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
        <label style={lab}>
          When
          <input
            id={`${id}-when`}
            type="datetime-local"
            value={v.when}
            onChange={(e) => set("when", e.target.value)}
            style={inp}
          />
        </label>
        <label style={lab}>
          Where
          <input value={v.where} onChange={(e) => set("where", e.target.value)} style={inp} />
        </label>
      </div>
      <label style={lab}>
        What happened
        <textarea
          id={`${id}-what`}
          rows={4}
          value={v.whatHappened}
          onChange={(e) => set("whatHappened", e.target.value)}
          style={inp}
        />
      </label>
      <label style={lab}>
        People involved
        <input
          value={v.peopleInvolved}
          onChange={(e) => set("peopleInvolved", e.target.value)}
          style={inp}
        />
      </label>
      {v.kind === "injury" && (
        <div style={{ display: "flex", gap: spacingTokens.lg, flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={v.firstAidGiven}
              onChange={(e) => set("firstAidGiven", e.target.checked)}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            First aid given
          </label>
          <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={v.hospitalVisit}
              onChange={(e) => set("hospitalVisit", e.target.checked)}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            Went to hospital
          </label>
        </div>
      )}
      <fieldset
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.sm,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.sm,
        }}
      >
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Follow-up</legend>
        <label style={lab}>
          What needs to happen
          <input value={v.followUp} onChange={(e) => set("followUp", e.target.value)} style={inp} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
          <label style={lab}>
            Who
            <input
              id={`${id}-owner`}
              value={v.followUpOwner}
              onChange={(e) => set("followUpOwner", e.target.value)}
              style={inp}
            />
          </label>
          <label style={lab}>
            By
            <input
              type="date"
              value={v.followUpBy}
              onChange={(e) => set("followUpBy", e.target.value)}
              style={inp}
            />
          </label>
        </div>
      </fieldset>
      <span style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}>
        Reports are seen by the producer and the safety lead only.
      </span>
      <div>
        <Button type="submit" disabled={busy}>
          Submit report
        </Button>
      </div>
    </form>
  );
}
IncidentForm.displayName = "IncidentForm";
