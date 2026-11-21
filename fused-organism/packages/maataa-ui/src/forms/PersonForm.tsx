/**
 * @maataa/ui/forms/PersonForm
 * Create or edit a person (crew, cast, contact)
 */

import React, { useId, useState } from "react";
import { Input } from "../primitives/Input";
import { Button } from "../primitives/Button";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { spacingTokens } from "../tokens";

export interface PersonValues {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  city: string;
}

export interface PersonFormProps {
  initial?: Partial<PersonValues>;
  onSubmit: (values: PersonValues) => void;
  onCancel?: () => void;
  busy?: boolean;
  /** @default 'Save person' */
  submitLabel?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * PersonForm
 * Name and role required; email or phone at least one, so the person can
 * be reached. Indian phone numbers may include +91 and spaces.
 */
export function PersonForm({
  initial = {},
  onSubmit,
  onCancel,
  busy,
  submitLabel = "Save person",
}: PersonFormProps) {
  const id = useId();
  const [v, setV] = useState<PersonValues>({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    city: "",
    ...initial,
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const err = (f: string) => errors.find((e) => e.fieldId === `${id}-${f}`)?.message;
  const bind = (k: keyof PersonValues) => ({
    id: `${id}-${k}`,
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setV((s) => ({ ...s, [k]: e.target.value })),
    error: err(k),
  });
  return (
    <form
      noValidate
      aria-label={initial.name ? `Edit ${initial.name}` : "Add a person"}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 520 }}
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        if (!v.name.trim())
          errs.push({ fieldId: `${id}-name`, message: "Enter the person's name" });
        if (!v.role.trim())
          errs.push({ fieldId: `${id}-role`, message: "Enter their role, like Editor or Gaffer" });
        if (!v.email.trim() && !v.phone.trim())
          errs.push({ fieldId: `${id}-email`, message: "Add an email or a phone number" });
        if (v.email.trim() && !EMAIL.test(v.email.trim()))
          errs.push({ fieldId: `${id}-email`, message: "Enter an email like name@example.com" });
        if (v.phone.trim() && !/^\+?[\d\s-]{8,16}$/.test(v.phone.trim()))
          errs.push({
            fieldId: `${id}-phone`,
            message: "Enter a phone number like +91 98765 43210",
          });
        setErrors(errs);
        if (!errs.length)
          onSubmit(
            Object.fromEntries(
              Object.entries(v).map(([k, x]) => [k, x.trim()])
            ) as unknown as PersonValues
          );
      }}
    >
      <ErrorSummary errors={errors} />
      <Input label="Full name" autoComplete="off" {...bind("name")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
        <Input label="Role" {...bind("role")} />
        <Input label="Department (optional)" {...bind("department")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacingTokens.md }}>
        <Input label="Email" type="email" inputMode="email" {...bind("email")} />
        <Input label="Phone" type="tel" inputMode="tel" {...bind("phone")} />
      </div>
      <Input label="City (optional)" {...bind("city")} />
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button type="submit" disabled={busy}>
          {submitLabel}
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
PersonForm.displayName = "PersonForm";
