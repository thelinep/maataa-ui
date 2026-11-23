/**
 * @maataa/ui/data/NetworkingViews
 * Networking contacts and private interaction notes
 */

import React, { useState } from "react";
import { Badge } from "../primitives/Badge";
import { Avatar } from "./Avatar";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface NetworkContact {
  id: string;
  name: string;
  role: string;
  company?: string;
  /** e.g. "Met at MAMI 2026" */
  howWeMet?: string;
  lastContact?: Date;
  tags?: string[];
  /** Agreed to be kept in the contact book */
  consent: "given" | "pending" | "withdrawn";
}

export interface NetworkingContactListProps {
  contacts: NetworkContact[];
  onOpen: (c: NetworkContact) => void;
  /** @default 'en-IN' */
  locale?: string;
}

const consentText = {
  given: "Consent given",
  pending: "Consent pending",
  withdrawn: "Consent withdrawn",
};
const consentTone = { given: "success", pending: "warning", withdrawn: "error" } as const;

/**
 * NetworkingContactList
 * Searchable by name, company or tag. Every contact shows consent state;
 * withdrawn contacts are listed last with a note to anonymise them.
 */
export function NetworkingContactList({
  contacts,
  onOpen,
  locale = "en-IN",
}: NetworkingContactListProps) {
  const [q, setQ] = useState("");
  const shown = contacts
    .filter(
      (c) =>
        !q.trim() ||
        `${c.name} ${c.company ?? ""} ${c.role} ${(c.tags ?? []).join(" ")}`
          .toLowerCase()
          .includes(q.trim().toLowerCase())
    )
    .sort(
      (a, b) =>
        Number(a.consent === "withdrawn") - Number(b.consent === "withdrawn") ||
        a.name.localeCompare(b.name)
    );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: typographyTokens.fontSize.sm,
          fontWeight: 600,
        }}
      >
        Search contacts
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, company or tag"
          style={{
            padding: 6,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontWeight: 400,
          }}
        />
      </label>
      <span
        role="status"
        style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
      >
        {shown.length} contact{shown.length === 1 ? "" : "s"}
      </span>
      <ul aria-label="Contacts" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {shown.map((c) => (
          <li
            key={c.id}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "flex-start",
              padding: `${spacingTokens.sm} 0`,
              borderBottom: `1px solid ${colorTokens.border.primary}`,
              background: c.consent === "withdrawn" ? colorTokens.background.secondary : undefined,
            }}
          >
            <Avatar name={c.name} size="md" decorative />
            <div style={{ flex: 1, minWidth: 0 }}>
              <button
                type="button"
                onClick={() => onOpen(c)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                  fontWeight: 700,
                  color: colorTokens.text.primary,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {c.name}
              </button>
              <div
                style={{
                  fontSize: typographyTokens.fontSize.sm,
                  color: colorTokens.text.secondary,
                }}
              >
                {c.role}
                {c.company ? ` · ${c.company}` : ""}
              </div>
              <div
                style={{
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {c.howWeMet}
                {c.lastContact
                  ? `${c.howWeMet ? " · " : ""}last in touch ${c.lastContact.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}`
                  : ""}
              </div>
              {c.consent === "withdrawn" && (
                <div
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.interactive.error,
                    fontWeight: 600,
                  }}
                >
                  Anonymise this contact: they withdrew consent.
                </div>
              )}
              {c.tags && c.tags.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                  {c.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              )}
            </div>
            <Badge variant={consentTone[c.consent]}>{consentText[c.consent]}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
NetworkingContactList.displayName = "NetworkingContactList";

export interface PrivateNote {
  id: string;
  text: string;
  at: Date;
  author: string;
}

export interface PrivateNotesProps {
  /** Whose notes these are about */
  about: string;
  notes: PrivateNote[];
  onAdd: (text: string) => void;
  onDelete?: (id: string) => void;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * PrivateNotes
 * Clearly labelled as private (never shown to the contact or exported in
 * redacted packs). Newest first, dated, with author.
 */
export function PrivateNotes({
  about,
  notes,
  onAdd,
  onDelete,
  locale = "en-IN",
}: PrivateNotesProps) {
  const [text, setText] = useState("");
  return (
    <section
      aria-label={`Private notes about ${about}`}
      style={{
        border: `1px dashed ${colorTokens.border.control}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        background: colorTokens.background.secondary,
      }}
    >
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
        <span aria-hidden="true">🔒 </span>Private notes
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        Only you and your production team see these. {about} never does, and they’re left out of
        exports.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onAdd(text.trim());
          setText("");
        }}
        style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
            fontWeight: 600,
          }}
        >
          Add a note
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              padding: 6,
              border: `1px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              fontWeight: 400,
              background: colorTokens.background.primary,
            }}
          />
        </label>
        <div>
          <Button type="submit" size="sm">
            Save note
          </Button>
        </div>
      </form>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {[...notes]
          .sort((a, b) => b.at.getTime() - a.at.getTime())
          .map((n) => (
            <li
              key={n.id}
              style={{
                padding: `${spacingTokens.xs} 0`,
                borderTop: `1px solid ${colorTokens.border.primary}`,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", gap: spacingTokens.sm }}
              >
                <span
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {n.author} ·{" "}
                  {n.at.toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(n.id)}
                    aria-label={`Delete note from ${n.at.toLocaleDateString(locale, { day: "numeric", month: "short" })}`}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: colorTokens.text.secondary,
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                      fontSize: typographyTokens.fontSize.xs,
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              {n.text}
            </li>
          ))}
      </ul>
    </section>
  );
}
PrivateNotes.displayName = "PrivateNotes";
