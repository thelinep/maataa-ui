/**
 * @maataa/ui/data/CrewProfile
 * One person's (or animal actor's) profile on a production: header with
 * avatar, designation and department, then tabs for work, tools, utils,
 * rating, pricing, call sheets, availability, documents, emergency contact,
 * health (only for those allowed) and the printable iCard
 */

import React, { useState } from "react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { Tabs, type TabItem } from "../navigation/Tabs";
import { AvailabilityCalendar } from "../forms/AvailabilityCalendar";
import { Button } from "../primitives/Button";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { BeingAvatar, type HealthMark } from "./BeingAvatar";
import { CrewIdCard, departmentColor, type CrewPerson, type EmergencyContact } from "./CrewIdCard";
import { PRODUCTION_DEPARTMENTS } from "./departments";
import { StarRating } from "./StarRating";

export interface CrewCredit {
  title: string;
  /** What they did on it */
  role: string;
  year?: number;
}

export interface CrewTool {
  name: string;
  /** e.g. "ARRI Alexa Mini LF, serial 2341" */
  detail?: string;
  /** Brings their own */
  owned?: boolean;
}

export interface CrewUtil {
  /** e.g. "Languages", "Driving licence", "Passport", "Own vehicle" */
  label: string;
  value: string;
}

export interface CrewReview {
  author: string;
  /** 1–5 */
  rating: number;
  text: string;
  date?: Date;
}

export interface CrewRate {
  /** e.g. "Day rate (12 hours)", "Overtime per hour", "With kit" */
  label: string;
  /** In rupees unless `currency` says otherwise */
  amount: number;
  currency?: string;
  note?: string;
}

export interface CrewCallSheet {
  id: string;
  date: Date;
  /** e.g. "06:30" */
  callTime: string;
  location: string;
  status: "draft" | "published" | "confirmed";
}

export interface CrewDocument {
  id: string;
  /** e.g. "Contract", "NDA", "Animal performance permit" */
  name: string;
  status: "signed" | "pending" | "expired" | "missing";
  expires?: Date;
  href?: string;
}

export interface CrewProfileProps {
  person: CrewPerson;
  /** Character or role played, shown under the designation */
  subtitle?: string;
  credits?: CrewCredit[];
  tools?: CrewTool[];
  utils?: CrewUtil[];
  rating?: { value: number; count?: number; reviews?: CrewReview[] };
  rates?: CrewRate[];
  callSheets?: CrewCallSheet[];
  /** Days already booked */
  booked?: Date[];
  documents?: CrewDocument[];
  emergency?: EmergencyContact;
  health?: HealthMark[];
  /**
   * Whether the person viewing may see health details (production and
   * medical roles). When false the Health tab isn't there at all.
   * @default false
   */
  canSeeHealth?: boolean;
  /** For the iCard tab */
  production?: string;
  organisation?: string;
  validUntil?: Date;
  /** Tab open first. @default "work" */
  defaultTab?: string;
  className?: string;
  style?: React.CSSProperties;
}

const box: React.CSSProperties = {
  border: `1px solid ${colorTokens.border.primary}`,
  borderRadius: radiusTokens.lg,
  padding: spacingTokens.md,
};

const statusStyle = (tone: "success" | "warning" | "error" | "info"): React.CSSProperties => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 999,
  background: colorTokens.semantic[tone].bg,
  color: colorTokens.semantic[tone].text,
  fontSize: typographyTokens.fontSize.sm,
  fontWeight: 600,
});

function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: 0, color: colorTokens.text.secondary }}>{children}</p>;
}

/**
 * CrewProfile
 *
 * @example
 * ```tsx
 * <CrewProfile person={asha} credits={…} rates={…} callSheets={…}
 *   emergency={…} health={…} canSeeHealth={viewer.role === "production"} />
 * ```
 */
export function CrewProfile({
  person,
  subtitle,
  credits = [],
  tools = [],
  utils = [],
  rating,
  rates = [],
  callSheets = [],
  booked = [],
  documents = [],
  emergency,
  health = [],
  canSeeHealth = false,
  production,
  organisation,
  validUntil,
  defaultTab = "work",
  className,
  style,
}: CrewProfileProps) {
  const t = useT();
  const locale = useLocale();
  const [month, setMonth] = useState(() => new Date());
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const date = (d: Date) =>
    d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const money = (r: CrewRate) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: r.currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(r.amount);
  const dept = (PRODUCTION_DEPARTMENTS as readonly string[]).includes(person.department)
    ? t(person.department)
    : person.department;

  const table = (head: string[], rows: React.ReactNode[][]) => (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: typographyTokens.fontSize.md,
        }}
      >
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                style={{
                  textAlign: "left",
                  padding: spacingTokens.sm,
                  borderBottom: `2px solid ${colorTokens.border.primary}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    padding: spacingTokens.sm,
                    borderBottom: `1px solid ${colorTokens.border.secondary}`,
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CALL = {
    draft: ["info", t("Draft")],
    published: ["warning", t("Published")],
    confirmed: ["success", t("Confirmed")],
  } as const;
  const DOC = {
    signed: ["success", t("Signed")],
    pending: ["warning", t("Waiting for signature")],
    expired: ["error", t("Expired")],
    missing: ["error", t("Missing")],
  } as const;

  const tabs: TabItem[] = [
    {
      id: "work",
      label: t("Work"),
      content: credits.length ? (
        table(
          [t("Title"), t("Role"), t("Year")],
          credits.map((c) => [c.title, c.role, c.year ?? ""])
        )
      ) : (
        <Empty>{t("No work added yet.")}</Empty>
      ),
    },
    {
      id: "tools",
      label: t("Tools"),
      content: tools.length ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: spacingTokens.lg,
            display: "grid",
            gap: spacingTokens.xs,
          }}
        >
          {tools.map((k) => (
            <li key={k.name}>
              <strong>{k.name}</strong>
              {k.detail ? ` · ${k.detail}` : ""}
              {k.owned ? ` · ${t("own kit")}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <Empty>{t("No tools added yet.")}</Empty>
      ),
    },
    {
      id: "utils",
      label: t("Utils"),
      content: utils.length ? (
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            gap: `${spacingTokens.xs} ${spacingTokens.lg}`,
          }}
        >
          {utils.map((u) => (
            <React.Fragment key={u.label}>
              <dt style={{ color: colorTokens.text.secondary }}>{u.label}</dt>
              <dd style={{ margin: 0 }}>{u.value}</dd>
            </React.Fragment>
          ))}
        </dl>
      ) : (
        <Empty>{t("Nothing added yet.")}</Empty>
      ),
    },
    {
      id: "rating",
      label: t("Rating"),
      content: rating ? (
        <div style={{ display: "grid", gap: spacingTokens.md }}>
          <StarRating value={rating.value} count={rating.count} size={22} />
          {(rating.reviews ?? []).map((r, i) => (
            <figure key={i} style={{ ...box, margin: 0 }}>
              <StarRating value={r.rating} size={14} />
              <blockquote style={{ margin: `${spacingTokens.xs} 0` }}>{r.text}</blockquote>
              <figcaption
                style={{
                  color: colorTokens.text.secondary,
                  fontSize: typographyTokens.fontSize.sm,
                }}
              >
                {r.date ? `${r.author} · ${date(r.date)}` : r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <Empty>{t("Not rated yet.")}</Empty>
      ),
    },
    {
      id: "pricing",
      label: t("Pricing"),
      content: rates.length ? (
        table(
          [t("Rate"), t("Amount"), t("Note")],
          rates.map((r) => [r.label, <strong key="a">{money(r)}</strong>, r.note ?? ""])
        )
      ) : (
        <Empty>{t("No rates added yet.")}</Empty>
      ),
    },
    {
      id: "call-sheets",
      label: t("Call sheets"),
      content: callSheets.length ? (
        table(
          [t("Date"), t("Call time"), t("Location"), t("Status")],
          [...callSheets]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((c) => [
              date(c.date),
              c.callTime,
              c.location,
              <span key="s" style={statusStyle(CALL[c.status][0])}>
                {CALL[c.status][1]}
              </span>,
            ])
        )
      ) : (
        <Empty>{t("No call sheets yet.")}</Empty>
      ),
    },
    {
      id: "availability",
      label: t("Availability"),
      content: (
        <AvailabilityCalendar
          subject={person.name}
          month={month}
          onMonthChange={setMonth}
          booked={booked}
          value={range}
          onChange={setRange}
          locale={locale}
        />
      ),
    },
    {
      id: "documents",
      label: t("Documents"),
      content: documents.length ? (
        table(
          [t("Document"), t("Status"), t("Expires")],
          documents.map((d) => [
            d.href ? (
              <a key="n" href={d.href}>
                {d.name}
              </a>
            ) : (
              d.name
            ),
            <span key="s" style={statusStyle(DOC[d.status][0])}>
              {DOC[d.status][1]}
            </span>,
            d.expires ? date(d.expires) : "",
          ])
        )
      ) : (
        <Empty>{t("No documents yet.")}</Empty>
      ),
    },
    {
      id: "emergency",
      label: t("Emergency contact"),
      content: emergency ? (
        <div style={box}>
          <div style={{ fontWeight: 600 }}>
            {emergency.relation ? `${emergency.name} (${emergency.relation})` : emergency.name}
          </div>
          <a
            href={`tel:${emergency.phone.replace(/[^\d+]/g, "")}`}
            style={{ fontSize: typographyTokens.fontSize["2xl"], fontWeight: 700 }}
          >
            {emergency.phone}
          </a>
        </div>
      ) : (
        <Empty>{t("No emergency contact added. Add one before the first shoot day.")}</Empty>
      ),
    },
  ];

  if (canSeeHealth)
    tabs.push({
      id: "health",
      label: t("Health"),
      content: health.length ? (
        <div style={{ display: "grid", gap: spacingTokens.sm }}>
          <p
            style={{
              margin: 0,
              fontSize: typographyTokens.fontSize.sm,
              color: colorTokens.text.secondary,
            }}
          >
            {t("Only production and medical roles can see this.")}
          </p>
          <BeingAvatar
            name={person.name}
            src={person.photo}
            species={person.species}
            health={health}
            showHealth
            size="md"
          />
        </div>
      ) : (
        <Empty>{t("No health notes.")}</Empty>
      ),
    });

  if (production && organisation)
    tabs.push({
      id: "icard",
      label: t("iCard"),
      content: (
        <div style={{ display: "grid", gap: spacingTokens.md, justifyItems: "start" }}>
          <CrewIdCard
            person={person}
            production={production}
            organisation={organisation}
            validUntil={validUntil}
            emergency={emergency}
          />
          <Button size="sm" variant="secondary" onClick={() => window.print()}>
            {t("Print iCard")}
          </Button>
        </div>
      ),
    });

  return (
    <article
      className={className}
      style={{
        display: "grid",
        gap: spacingTokens.lg,
        color: colorTokens.text.primary,
        fontFamily: typographyTokens.fontFamily.base,
        ...style,
      }}
    >
      <header
        style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.lg, alignItems: "center" }}
      >
        <BeingAvatar
          name={person.name}
          src={person.photo}
          species={person.species}
          subtitle={[person.designation, subtitle].filter(Boolean).join(" · ")}
          size="xl"
        />
        <div style={{ display: "grid", gap: spacingTokens.xs }}>
          <span
            style={{
              justifySelf: "start",
              padding: "2px 10px",
              borderRadius: 999,
              border: `2px solid ${departmentColor(person.department)}`,
              fontSize: typographyTokens.fontSize.sm,
              fontWeight: 600,
            }}
          >
            {t("Department: {department}", { department: dept })}
          </span>
          <span
            style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
          >
            {t("Crew ID {id}", { id: person.id })}
          </span>
          {rating && <StarRating value={rating.value} count={rating.count} />}
        </div>
      </header>
      <Tabs tabs={tabs} defaultTab={defaultTab} aria-label={t("Profile sections")} />
    </article>
  );
}

CrewProfile.displayName = "CrewProfile";
