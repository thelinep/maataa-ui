/**
 * @maataa/ui/forms/JobPostingForm
 * Post a cast or crew opening
 */

import React, { useId, useState } from "react";
import { Input } from "../primitives/Input";
import { Button } from "../primitives/Button";
import { Textarea } from "./Textarea";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { VisibilitySelector, type Visibility } from "./VisibilitySelector";
import { colorTokens, spacingTokens } from "../tokens";

export interface JobPostingValues {
  title: string;
  kind: "cast" | "crew";
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  /** e.g. "₹8,000/day" or "Negotiable" */
  pay: string;
  closesOn: string;
  visibility: Visibility;
}

export interface JobPostingFormProps {
  initial?: Partial<JobPostingValues>;
  onSubmit: (v: JobPostingValues) => void;
  onSaveDraft?: (v: JobPostingValues) => void;
  busy?: boolean;
}

/**
 * JobPostingForm
 * Pay is required in words (Indian film unions expect it stated); dates
 * are checked so the end isn't before the start. Visibility defaults to
 * private until you publish.
 */
export function JobPostingForm({ initial = {}, onSubmit, onSaveDraft, busy }: JobPostingFormProps) {
  const id = useId();
  const [v, setV] = useState<JobPostingValues>({
    title: "",
    kind: "crew",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    pay: "",
    closesOn: "",
    visibility: "private",
    ...initial,
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const err = (f: string) => errors.find((e) => e.fieldId === `${id}-${f}`)?.message;
  const set = <K extends keyof JobPostingValues>(k: K, val: JobPostingValues[K]) =>
    setV((s) => ({ ...s, [k]: val }));
  const bind = (k: "title" | "location" | "startDate" | "endDate" | "pay" | "closesOn") => ({
    id: `${id}-${k}`,
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
    error: err(k),
  });
  return (
    <form
      noValidate
      aria-label="Post an opening"
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        if (!v.title.trim()) errs.push({ fieldId: `${id}-title`, message: "Enter the role title" });
        if (v.description.trim().length < 30)
          errs.push({
            fieldId: `${id}-description`,
            message: "Describe the role in at least 30 characters",
          });
        if (!v.pay.trim())
          errs.push({ fieldId: `${id}-pay`, message: "State the pay, or write Negotiable" });
        if (v.startDate && v.endDate && v.endDate < v.startDate)
          errs.push({ fieldId: `${id}-endDate`, message: "End date is before the start date" });
        setErrors(errs);
        if (!errs.length) onSubmit(v);
      }}
    >
      <ErrorSummary errors={errors} />
      <fieldset
        style={{ border: "none", margin: 0, padding: 0, display: "flex", gap: spacingTokens.md }}
      >
        <legend style={{ fontWeight: 500, padding: 0, marginBottom: spacingTokens.xs }}>
          Opening for
        </legend>
        {(["crew", "cast"] as const).map((k) => (
          <label key={k} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name={`${id}-kind`}
              checked={v.kind === k}
              onChange={() => set("kind", k)}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            {k === "crew" ? "Crew" : "Cast"}
          </label>
        ))}
      </fieldset>
      <Input
        label="Role title"
        {...bind("title")}
        helperText={
          v.kind === "cast" ? "e.g. Meera (lead), female 25–35" : "e.g. Gaffer, Sound recordist"
        }
      />
      <Textarea
        id={`${id}-description`}
        label="What the role involves"
        rows={4}
        value={v.description}
        onChange={(e) => set("description", e.target.value)}
        error={err("description")}
      />
      <Input label="Location" {...bind("location")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
        <Input label="Start date" type="date" {...bind("startDate")} />
        <Input label="End date" type="date" {...bind("endDate")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
        <Input label="Pay" {...bind("pay")} helperText="e.g. ₹8,000/day" />
        <Input label="Applications close" type="date" {...bind("closesOn")} />
      </div>
      <VisibilitySelector
        value={v.visibility}
        onChange={(x) => set("visibility", x)}
        subject="this opening"
      />
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button type="submit" disabled={busy}>
          {v.visibility === "private" ? "Save opening" : "Publish opening"}
        </Button>
        {onSaveDraft && (
          <Button variant="secondary" onClick={() => onSaveDraft(v)} disabled={busy}>
            Save draft
          </Button>
        )}
      </div>
    </form>
  );
}
JobPostingForm.displayName = "JobPostingForm";
