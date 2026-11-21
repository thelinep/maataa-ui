/**
 * @maataa/ui/forms/AccountSettingsForm
 * Name, contact, language, time zone and notification preferences
 */

import React, { useId, useState } from "react";
import { Input } from "../primitives/Input";
import { Button } from "../primitives/Button";
import { ErrorSummary, type FormError } from "./ErrorSummary";
import { LanguageSelector } from "./LocaleSelectors";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface AccountSettings {
  name: string;
  creditName: string;
  email: string;
  phone: string;
  language: string;
  timeZone: string;
  notify: { email: boolean; sms: boolean; whatsapp: boolean; digest: "off" | "daily" | "weekly" };
}

export interface AccountSettingsFormProps {
  initial: AccountSettings;
  onSave: (v: AccountSettings) => void;
  /** Email changes need verification */
  emailChangeNeedsVerification?: boolean;
  busy?: boolean;
  savedMessage?: string;
  timeZones?: string[];
}

/**
 * AccountSettingsForm
 * Grouped fieldsets; saves only what changed and says so. Changing email
 * explains the verification step before saving.
 */
export function AccountSettingsForm({
  initial,
  onSave,
  emailChangeNeedsVerification = true,
  busy,
  savedMessage,
  timeZones = [
    "Asia/Kolkata",
    "Asia/Dubai",
    "Europe/London",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Singapore",
  ],
}: AccountSettingsFormProps) {
  const id = useId();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<FormError[]>([]);
  const dirty = JSON.stringify(v) !== JSON.stringify(initial);
  const emailChanged = v.email.trim().toLowerCase() !== initial.email.trim().toLowerCase();
  const err = (f: string) => errors.find((e) => e.fieldId === `${id}-${f}`)?.message;
  const box: React.CSSProperties = {
    border: `1px solid ${colorTokens.border.primary}`,
    borderRadius: 8,
    padding: spacingTokens.md,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: spacingTokens.sm,
  };
  const chk = (k: "email" | "sms" | "whatsapp", label: string) => (
    <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
      <input
        type="checkbox"
        checked={v.notify[k]}
        onChange={(e) => setV({ ...v, notify: { ...v.notify, [k]: e.target.checked } })}
        style={{ accentColor: colorTokens.interactive.primary }}
      />
      {label}
    </label>
  );
  return (
    <form
      noValidate
      aria-label="Account settings"
      onSubmit={(e) => {
        e.preventDefault();
        const errs: FormError[] = [];
        if (!v.name.trim()) errs.push({ fieldId: `${id}-name`, message: "Enter your name" });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
          errs.push({ fieldId: `${id}-email`, message: "Enter an email like name@example.com" });
        setErrors(errs);
        if (!errs.length) onSave(v);
      }}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 560 }}
    >
      <ErrorSummary errors={errors} />
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>You</legend>
        <Input
          id={`${id}-name`}
          label="Name"
          autoComplete="name"
          value={v.name}
          onChange={(e) => setV({ ...v, name: e.target.value })}
          error={err("name")}
        />
        <Input
          id={`${id}-credit`}
          label="Name in credits"
          value={v.creditName}
          onChange={(e) => setV({ ...v, creditName: e.target.value })}
          helperText="e.g. Pandit Hemant Kumar Dixit (PHKD)"
        />
      </fieldset>
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Contact</legend>
        <Input
          id={`${id}-email`}
          label="Email"
          type="email"
          autoComplete="email"
          value={v.email}
          onChange={(e) => setV({ ...v, email: e.target.value })}
          error={err("email")}
          helperText={
            emailChanged && emailChangeNeedsVerification
              ? "We'll send a link to the new address. Your old email keeps working until you confirm."
              : undefined
          }
        />
        <Input
          id={`${id}-phone`}
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={v.phone}
          onChange={(e) => setV({ ...v, phone: e.target.value })}
        />
      </fieldset>
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>
          Language and time
        </legend>
        <LanguageSelector
          value={v.language}
          onChange={(language) => setV({ ...v, language })}
          label="App language"
        />
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 500 }}>
          Time zone
          <select
            value={v.timeZone}
            onChange={(e) => setV({ ...v, timeZone: e.target.value })}
            style={{
              padding: 8,
              border: `2px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              fontWeight: 400,
              background: colorTokens.background.primary,
            }}
          >
            {timeZones.map((z) => (
              <option key={z} value={z}>
                {z.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Notifications</legend>
        {chk("email", "Email notifications")}
        {chk("sms", "SMS notifications (call sheets and urgent changes only)")}
        {chk("whatsapp", "WhatsApp notifications")}
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 500 }}>
          Summary email
          <select
            value={v.notify.digest}
            onChange={(e) =>
              setV({
                ...v,
                notify: {
                  ...v.notify,
                  digest: e.target.value as AccountSettings["notify"]["digest"],
                },
              })
            }
            style={{
              padding: 8,
              border: `2px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              fontWeight: 400,
              background: colorTokens.background.primary,
              maxWidth: 200,
            }}
          >
            <option value="off">Off</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </fieldset>
      <div style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
        <Button type="submit" disabled={!dirty || busy}>
          {busy ? "Saving…" : "Save changes"}
        </Button>
        {dirty && (
          <Button variant="secondary" onClick={() => setV(initial)}>
            Undo changes
          </Button>
        )}
        <span
          role="status"
          style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.interactive.success }}
        >
          {!dirty && savedMessage ? savedMessage : ""}
        </span>
      </div>
    </form>
  );
}
AccountSettingsForm.displayName = "AccountSettingsForm";
