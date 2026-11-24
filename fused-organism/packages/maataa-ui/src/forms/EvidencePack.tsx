/**
 * @maataa/ui/forms/EvidencePack
 * Build an investor evidence pack, and share or revoke it
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { Button } from "../primitives/Button";
import { moveItem } from "../whiteboard/FrameTimelineStrip";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PackDocument {
  id: string;
  name: string;
  /** e.g. "Budget", "Chain of title" */
  category: string;
  /** Contains personal or confidential details */
  sensitive?: boolean;
}

export interface EvidencePackBuilderProps {
  available: PackDocument[];
  /** Ordered ids in the pack */
  included: string[];
  onChange: (ids: string[]) => void;
  /** Redact personal details when exporting */
  redact: boolean;
  onRedactChange: (v: boolean) => void;
  onPreview?: () => void;
}

/**
 * EvidencePackBuilder
 * Two lists: available documents (checkbox to add) and the pack, in order,
 * with earlier/later buttons. Sensitive documents are marked, and redaction
 * is on by default.
 */
export function EvidencePackBuilder({
  available,
  included,
  onChange,
  redact,
  onRedactChange,
  onPreview,
}: EvidencePackBuilderProps) {
  const tx = useT();
  const [msg, setMsg] = useState("");
  const byId = (id: string) => available.find((d) => d.id === id);
  const sensitiveIn = included.filter((id) => byId(id)?.sensitive).length;
  const small: React.CSSProperties = {
    minWidth: 30,
    minHeight: 30,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    background: colorTokens.background.primary,
    cursor: "pointer",
    color: colorTokens.text.primary,
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: spacingTokens.md,
      }}
    >
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
      <fieldset
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.sm,
          margin: 0,
        }}
      >
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>
          {tx("Documents")}
        </legend>
        {Array.from(new Set(available.map((d) => d.category))).map((cat) => (
          <div key={cat} style={{ marginBottom: spacingTokens.sm }}>
            <div
              style={{
                fontSize: typographyTokens.fontSize.xs,
                fontWeight: 700,
                color: colorTokens.text.secondary,
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}
            >
              {cat}
            </div>
            {available
              .filter((d) => d.category === cat)
              .map((d) => (
                <label
                  key={d.id}
                  style={{
                    display: "flex",
                    gap: spacingTokens.xs,
                    alignItems: "center",
                    padding: "2px 0",
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={included.includes(d.id)}
                    onChange={(e) => {
                      onChange(
                        e.target.checked ? [...included, d.id] : included.filter((x) => x !== d.id)
                      );
                      setMsg(
                        e.target.checked
                          ? tx("{name} added to the pack", { name: d.name })
                          : tx("{name} removed from the pack", { name: d.name })
                      );
                    }}
                    style={{
                      width: 20,
                      height: 20,
                      margin: 2,
                      accentColor: colorTokens.interactive.primary,
                    }}
                  />
                  {d.name}
                  {d.sensitive && " "}
                  {d.sensitive && (
                    <span
                      style={{
                        color: colorTokens.interactive.warning,
                        fontSize: typographyTokens.fontSize.xs,
                        fontWeight: 600,
                      }}
                    >
                      {tx("· confidential")}
                    </span>
                  )}
                </label>
              ))}
          </div>
        ))}
      </fieldset>
      <section
        aria-label={tx("Pack contents")}
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.sm,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.sm,
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
          {tx("Pack · {count} documents, in this order", { count: included.length })}
        </h3>
        {included.length === 0 ? (
          <p
            style={{
              margin: 0,
              color: colorTokens.text.secondary,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {tx("Tick documents on the left to add them.")}
          </p>
        ) : (
          <ol style={{ margin: 0, paddingLeft: spacingTokens.lg }}>
            {included.map((id, i) => (
              <li key={id} style={{ padding: "2px 0", fontSize: typographyTokens.fontSize.sm }}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {byId(id)?.name ?? id}
                  <span style={{ display: "flex", gap: 2 }}>
                    <button
                      type="button"
                      style={small}
                      disabled={i === 0}
                      aria-label={tx("Move {value} earlier", { value: byId(id)?.name })}
                      onClick={() => {
                        onChange(moveItem(included, i, i - 1));
                        setMsg(tx("Moved to position {position}", { position: i }));
                      }}
                    >
                      <span aria-hidden="true">↑</span>
                    </button>
                    <button
                      type="button"
                      style={small}
                      disabled={i === included.length - 1}
                      aria-label={tx("Move {value} later", { value: byId(id)?.name })}
                      onClick={() => {
                        onChange(moveItem(included, i, i + 1));
                        setMsg(tx("Moved to position {position}", { position: i + 2 }));
                      }}
                    >
                      <span aria-hidden="true">↓</span>
                    </button>
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
        <label
          style={{
            display: "flex",
            gap: spacingTokens.xs,
            alignItems: "flex-start",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <input
            type="checkbox"
            checked={redact}
            onChange={(e) => onRedactChange(e.target.checked)}
            style={{
              width: 20,
              height: 20,
              margin: "1px 2px 2px",
              accentColor: colorTokens.interactive.primary,
            }}
          />
          <span>
            Remove personal details (cast and crew phone numbers, addresses, ID numbers)
            {!redact && sensitiveIn > 0 && (
              <span
                style={{ display: "block", color: colorTokens.interactive.error, fontWeight: 600 }}
              >
                {sensitiveIn} confidential document{sensitiveIn === 1 ? "" : "s"} will be shared
                unredacted.
              </span>
            )}
          </span>
        </label>
        {onPreview && (
          <div>
            <Button variant="secondary" onClick={onPreview} disabled={!included.length}>
              {tx("Preview pack")}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
EvidencePackBuilder.displayName = "EvidencePackBuilder";

/* ---------- Share / revoke ---------- */

export interface ShareGrant {
  id: string;
  name: string;
  email: string;
  expiresAt?: Date;
  /** Last opened */
  lastViewed?: Date;
  canDownload: boolean;
}

export interface SharePermissionsProps {
  /** What's shared, e.g. "Evidence pack v2" */
  subject: string;
  grants: ShareGrant[];
  onAdd: (email: string, days: number, canDownload: boolean) => void;
  onRevoke: (id: string) => void;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * SharePermissions
 * Add a person with an expiry (7/30/90 days) and view-only by default;
 * each grant shows last viewed and a Revoke button that names them.
 */
export function SharePermissions({
  subject,
  grants,
  onAdd,
  onRevoke,
  locale: localeProp,
}: SharePermissionsProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(30);
  const [dl, setDl] = useState(false);
  const [err, setErr] = useState("");
  const d = (x: Date) => x.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const inp: React.CSSProperties = {
    padding: 6,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    font: "inherit",
    background: colorTokens.background.primary,
  };
  return (
    <section
      aria-label={tx("Who can see {subject}", { subject })}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
        {tx("Who can see {subject}", { subject })}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
            return setErr("Enter an email address");
          setErr("");
          onAdd(email.trim().toLowerCase(), days, dl);
          setEmail("");
        }}
        style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.xs, alignItems: "flex-end" }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: typographyTokens.fontSize.sm,
            flex: 1,
            minWidth: 180,
          }}
        >
          {tx("Email")}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={err ? true : undefined}
            style={inp}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {tx("Access for")}
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={inp}>
            <option value={7}>{tx("7 days")}</option>
            <option value={30}>{tx("30 days")}</option>
            <option value={90}>{tx("90 days")}</option>
          </select>
        </label>
        <label
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            fontSize: typographyTokens.fontSize.sm,
            paddingBottom: 6,
          }}
        >
          <input
            type="checkbox"
            checked={dl}
            onChange={(e) => setDl(e.target.checked)}
            style={{
              width: 20,
              height: 20,
              margin: 2,
              accentColor: colorTokens.interactive.primary,
            }}
          />
          {tx("Can download")}
        </label>
        <Button type="submit" size="sm">
          {tx("Share")}
        </Button>
      </form>
      {err && (
        <span
          role="alert"
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.sm }}
        >
          {err}
        </span>
      )}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {grants.map((g) => (
          <li
            key={g.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: spacingTokens.sm,
              padding: `${spacingTokens.xs} 0`,
              borderBottom: `1px solid ${colorTokens.border.primary}`,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            <span>
              <strong>{g.name}</strong> · {g.email}
              <span
                style={{
                  display: "block",
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {g.canDownload ? tx("Can download") : tx("View only")}
                {g.expiresAt ? " · " + tx("until {date}", { date: d(g.expiresAt) }) : ""}
                {" · " +
                  (g.lastViewed
                    ? tx("last viewed {date}", { date: d(g.lastViewed) })
                    : tx("not opened yet"))}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onRevoke(g.id)}
              aria-label={tx("Revoke access for {name}", { name: g.name })}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: colorTokens.interactive.error,
                textDecoration: "underline",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              {tx("Revoke")}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
SharePermissions.displayName = "SharePermissions";
