/**
 * @maataa/ui/forms/ApplicationForm
 * Apply for a role on a production
 */

import React, { useId, useState } from "react";
import { Input } from "../primitives/Input";
import { Button } from "../primitives/Button";
import { Textarea } from "./Textarea";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { colorTokens, spacingTokens } from "../tokens";

export interface ApplicationValues {
  role: string;
  message: string;
  portfolioUrl: string;
  availableFrom: string;
  shareContact: boolean;
}

export interface ApplicationFormProps {
  productionTitle: string;
  roles: string[];
  onSubmit: (values: ApplicationValues) => void;
  onCancel?: () => void;
  busy?: boolean;
}

/**
 * ApplicationForm
 * Role, a short message, an optional portfolio link and availability.
 * Contact sharing is opt-in and off by default.
 */
export function ApplicationForm({
  productionTitle,
  roles,
  onSubmit,
  onCancel,
  busy,
}: ApplicationFormProps) {
  const id = useId();
  const [v, setV] = useState<ApplicationValues>({
    role: roles.length === 1 ? roles[0] : "",
    message: "",
    portfolioUrl: "",
    availableFrom: "",
    shareContact: false,
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const err = (f: string) => errors.find((e) => e.fieldId === `${id}-${f}`)?.message;
  const set = <K extends keyof ApplicationValues>(k: K, val: ApplicationValues[K]) =>
    setV((s) => ({ ...s, [k]: val }));
  return (
    <form
      noValidate
      aria-label={`Apply to ${productionTitle}`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 520 }}
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        if (!v.role)
          errs.push({ fieldId: `${id}-role`, message: "Choose the role you're applying for" });
        if (v.message.trim().length < 20)
          errs.push({
            fieldId: `${id}-message`,
            message: "Write a short message (at least 20 characters)",
          });
        if (v.portfolioUrl && !/^https?:\/\/\S+\.\S+/.test(v.portfolioUrl))
          errs.push({
            fieldId: `${id}-portfolio`,
            message: "Portfolio link should start with https://",
          });
        setErrors(errs);
        if (!errs.length) onSubmit({ ...v, message: v.message.trim() });
      }}
    >
      <ErrorSummary errors={errors} />
      <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
        <label htmlFor={`${id}-role`} style={{ fontWeight: 500 }}>
          Role
        </label>
        <select
          id={`${id}-role`}
          value={v.role}
          onChange={(e) => set("role", e.target.value)}
          aria-invalid={err("role") ? true : undefined}
          aria-describedby={err("role") ? `${id}-role-error` : undefined}
          style={{
            padding: spacingTokens.sm,
            border: `2px solid ${err("role") ? colorTokens.interactive.error : colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            background: colorTokens.background.primary,
          }}
        >
          <option value="">Choose a role</option>
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        {err("role") && (
          <span
            id={`${id}-role-error`}
            style={{ color: colorTokens.interactive.error, fontSize: 12 }}
          >
            {err("role")}
          </span>
        )}
      </div>
      <Textarea
        id={`${id}-message`}
        label="Why you'd be a good fit"
        value={v.message}
        onChange={(e) => set("message", e.target.value)}
        rows={4}
        error={err("message")}
        helperText="A few lines about relevant work. Don't include your phone number here."
      />
      <Input
        id={`${id}-portfolio`}
        label="Portfolio or showreel link (optional)"
        type="url"
        inputMode="url"
        value={v.portfolioUrl}
        onChange={(e) => set("portfolioUrl", e.target.value)}
        error={err("portfolio")}
      />
      <Input
        id={`${id}-from`}
        label="Available from (optional)"
        type="date"
        value={v.availableFrom}
        onChange={(e) => set("availableFrom", e.target.value)}
      />
      <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }}>
        <input
          type="checkbox"
          checked={v.shareContact}
          onChange={(e) => set("shareContact", e.target.checked)}
          style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
        />
        <span>Share my email with the production team now (otherwise only after they reply)</span>
      </label>
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button type="submit" disabled={busy}>
          Send application
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
ApplicationForm.displayName = "ApplicationForm";
