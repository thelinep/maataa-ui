/**
 * @maataa/ui/data/CrewIdCard
 * A printable crew identity card (CR80, 54 × 85.6 mm): photo, name,
 * designation, department, crew ID and a QR code on the front; emergency
 * contact and return address on the back
 */

import React from "react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { chartTokens, colorTokens, typographyTokens } from "../tokens";
import { BeingAvatar, type Species } from "./BeingAvatar";
import { PRODUCTION_DEPARTMENTS } from "./departments";
import { QrCode } from "./QrCode";

export interface CrewPerson {
  /** Crew ID printed on the card, e.g. "VFS-0142" */
  id: string;
  name: string;
  photo?: string;
  /** e.g. "1st Assistant Camera" */
  designation: string;
  /** e.g. "Camera"; the built-in department names are translated */
  department: string;
  /** For animal actors and handlers' animals: ["dog"] */
  species?: (string | Species)[];
  phone?: string;
  email?: string;
}

export interface EmergencyContact {
  name: string;
  /** e.g. "Spouse", "Handler" */
  relation?: string;
  phone: string;
}

export interface CrewIdCardProps {
  person: CrewPerson;
  /** Production or event the card is for */
  production: string;
  /** Company issuing it, printed on the back */
  organisation: string;
  validUntil?: Date;
  emergency?: EmergencyContact;
  /** What the QR code opens. @default the crew ID */
  qrValue?: string;
  /** @default "both" */
  side?: "front" | "back" | "both";
  /** Stripe color. @default picked from the department */
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** A stable color per department name. */
export function departmentColor(department: string): string {
  let h = 0;
  for (const ch of department) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return chartTokens.categorical[h % chartTokens.categorical.length]!;
}

/** Black or white, whichever reads better on `hex`. */
function inkOn(hex: string): string {
  const c = [1, 3, 5].map((i) => {
    const v = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const l = 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
  return 1.05 / (l + 0.05) >= (l + 0.05) / 0.0617 ? "#fff" : "#1d1a17";
}

const card: React.CSSProperties = {
  width: "54mm",
  height: "85.6mm",
  boxSizing: "border-box",
  borderRadius: "3mm",
  border: `0.3mm solid ${colorTokens.border.primary}`,
  background: "#fff",
  color: "#1d1a17",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  breakInside: "avoid",
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
  fontFamily: typographyTokens.fontFamily.base,
};

/**
 * CrewIdCard
 * Prints at true size. Card colors stay fixed (dark on white) in every
 * theme so the card and its QR code print and scan the same way.
 *
 * @example
 * ```tsx
 * <CrewIdCard
 *   person={{ id: "VFS-0142", name: "Asha Rao", designation: "1st AC", department: "Camera" }}
 *   production="Bhairav" organisation="Vesahe Film Solutions"
 *   validUntil={new Date("2027-03-31")}
 *   emergency={{ name: "Ravi Rao", relation: "Brother", phone: "+91 98100 00000" }}
 * />
 * ```
 */
export function CrewIdCard({
  person,
  production,
  organisation,
  validUntil,
  emergency,
  qrValue,
  side = "both",
  accent,
  className,
  style,
}: CrewIdCardProps) {
  const t = useT();
  const locale = useLocale();
  const stripe = accent ?? departmentColor(person.department);
  const dept = (PRODUCTION_DEPARTMENTS as readonly string[]).includes(person.department)
    ? t(person.department)
    : person.department;
  const small: React.CSSProperties = { fontSize: "2.4mm", lineHeight: 1.3 };

  const front = (
    <section aria-label={t("ID card, front")} style={card}>
      <div
        style={{
          background: stripe,
          color: /^#[0-9a-f]{6}$/i.test(stripe) ? inkOn(stripe) : "#fff",
          padding: "2mm 3mm",
          fontWeight: 700,
          fontSize: "3mm",
          letterSpacing: "0.02em",
        }}
      >
        {production}
      </div>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          gap: "1.2mm",
          padding: "3mm 3mm 0",
          textAlign: "center",
        }}
      >
        <BeingAvatar
          name={person.name}
          src={person.photo}
          species={person.species}
          size="xl"
          compact
        />
        <div style={{ fontWeight: 700, fontSize: "3.6mm", lineHeight: 1.2 }}>{person.name}</div>
        <div style={{ fontSize: "2.8mm" }}>{person.designation}</div>
        <div
          style={{
            ...small,
            fontWeight: 600,
            padding: "0.4mm 2mm",
            borderRadius: "2mm",
            border: `0.3mm solid ${stripe}`,
          }}
        >
          {dept}
        </div>
      </div>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "2mm 3mm 3mm",
        }}
      >
        <div style={small}>
          <div style={{ fontWeight: 700 }}>{person.id}</div>
          {validUntil && (
            <div>
              {t("Valid until {date}", {
                date: validUntil.toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              })}
            </div>
          )}
        </div>
        <QrCode
          value={qrValue ?? person.id}
          size="16mm"
          label={t("QR code for {name}", { name: person.name })}
        />
      </div>
    </section>
  );

  const back = (
    <section aria-label={t("ID card, back")} style={{ ...card, padding: "4mm 3.5mm", gap: "3mm" }}>
      <div style={{ height: "1.5mm", background: stripe, margin: "-4mm -3.5mm 0" }} />
      {emergency && (
        <div style={small}>
          <div style={{ fontWeight: 700, fontSize: "2.8mm", marginBottom: "1mm" }}>
            {t("In an emergency, call")}
          </div>
          <div>
            {emergency.relation ? `${emergency.name} (${emergency.relation})` : emergency.name}
          </div>
          <div style={{ fontWeight: 700, fontSize: "3.2mm" }}>{emergency.phone}</div>
        </div>
      )}
      {(person.phone || person.email) && (
        <div style={small}>
          <div style={{ fontWeight: 700, fontSize: "2.8mm", marginBottom: "1mm" }}>
            {t("Card holder")}
          </div>
          {person.phone && <div>{person.phone}</div>}
          {person.email && <div>{person.email}</div>}
        </div>
      )}
      <div style={{ ...small, marginTop: "auto" }}>
        {t(
          "This card belongs to {organisation}. If found, please return it to the production office.",
          { organisation }
        )}
      </div>
      <div style={{ ...small, fontWeight: 700 }}>{organisation}</div>
    </section>
  );

  return (
    <div className={className} style={{ display: "flex", flexWrap: "wrap", gap: "4mm", ...style }}>
      {side !== "back" && front}
      {side !== "front" && back}
    </div>
  );
}

CrewIdCard.displayName = "CrewIdCard";
