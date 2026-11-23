/**
 * @maataa/ui/forms/InviteForm
 * Invite people to a project by email, with a role
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface InviteFormProps {
  roles: { value: string; label: string }[];
  onInvite: (emails: string[], role: string, note: string) => void;
  /** Emails that are already members or invited */
  existing?: string[];
  busy?: boolean;
  /** @default 20 */
  max?: number;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Splits on commas, spaces, semicolons and new lines; lower-cases and de-duplicates. */
export function parseEmails(text: string): string[] {
  return Array.from(
    new Set(
      text
        .split(/[\s,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

/**
 * InviteForm
 * Paste several addresses at once. Problems are listed by address
 * ("ravi@ isn't a valid email", "asha@… is already on the team").
 */
export function InviteForm({ roles, onInvite, existing = [], busy, max = 20 }: InviteFormProps) {
  const t = useT();
  const id = useId();
  const [text, setText] = useState("");
  const [role, setRole] = useState(roles[0]?.value ?? "");
  const [note, setNote] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const have = existing.map((e) => e.toLowerCase());
  return (
    <form
      noValidate
      aria-label={t("Invite people")}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 520 }}
      onSubmit={(e) => {
        e.preventDefault();
        const emails = parseEmails(text);
        const p: string[] = [];
        if (!emails.length) p.push("Enter at least one email address");
        emails
          .filter((x) => !EMAIL.test(x))
          .forEach((x) => p.push(`${x} isn't a valid email address`));
        emails
          .filter((x) => have.includes(x))
          .forEach((x) => p.push(`${x} is already on the team or invited`));
        if (emails.length > max) p.push(`Invite up to ${max} people at a time`);
        setProblems(p);
        if (!p.length) {
          onInvite(emails, role, note.trim());
          setText("");
          setNote("");
        }
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
        <label htmlFor={`${id}-emails`} style={{ fontWeight: 500 }}>
          {t("Email addresses")}
        </label>
        <span
          id={`${id}-hint`}
          style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
        >
          {t("Separate with commas or new lines")}
        </span>
        <textarea
          id={`${id}-emails`}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-describedby={`${id}-hint${problems.length ? ` ${id}-problems` : ""}`}
          aria-invalid={problems.length ? true : undefined}
          autoComplete="off"
          spellCheck={false}
          style={{
            padding: spacingTokens.sm,
            border: `2px solid ${problems.length ? colorTokens.interactive.error : colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            background: colorTokens.background.primary,
          }}
        />
        {problems.length > 0 && (
          <ul
            id={`${id}-problems`}
            role="alert"
            style={{
              margin: 0,
              paddingLeft: spacingTokens.lg,
              color: colorTokens.interactive.error,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>
      <label
        style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs, fontWeight: 500 }}
      >
        {t("Role")}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: spacingTokens.sm,
            border: `2px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontWeight: 400,
            background: colorTokens.background.primary,
          }}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <label
        style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs, fontWeight: 500 }}
      >
        {t("Personal note (optional)")}
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={280}
          style={{
            padding: spacingTokens.sm,
            border: `2px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontWeight: 400,
            background: colorTokens.background.primary,
          }}
        />
      </label>
      <div>
        <Button type="submit" disabled={busy}>
          {t("Send invitations")}
        </Button>
      </div>
    </form>
  );
}
InviteForm.displayName = "InviteForm";
