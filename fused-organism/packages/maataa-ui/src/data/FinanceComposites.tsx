/**
 * @maataa/ui/data/FinanceComposites
 * CostDriverRow, ScenarioSwitcher, ContractExpiryPill, TokenBalanceCard,
 * SmartContractStatusCard, ProfitDistributionRing, GovernanceVoteCard,
 * PitchSlideThumbnail, InvestorRow, CrowdfundingProgressBar,
 * RewardTierCard and AudienceRecommendationMeter
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { chartColor } from "./chartKit";

const card: React.CSSProperties = {
  border: `1px solid ${colorTokens.border.primary}`,
  borderRadius: 12,
  background: colorTokens.background.primary,
  padding: spacingTokens.md,
  display: "flex",
  flexDirection: "column",
  gap: spacingTokens.xs,
  minWidth: 0,
};
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
/** ₹ in lakh/crore words for large numbers */
export function inrShort(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e7) return `₹${(n / 1e7).toFixed(a >= 1e8 ? 0 : 2).replace(/\.?0+$/, "")} crore`;
  if (a >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, "")} lakh`;
  return inr(n);
}

/* ───────────────────────── CostDriverRow ───────────────────────── */

export interface CostDriver {
  id: string;
  label: string;
  amount: number;
  /** Change vs previous version (₹) */
  delta?: number;
  /** e.g. "Extra shoot day added" */
  reason?: string;
}

/**
 * CostDriverRow
 * Ranked list of what drives the budget, each with its share as a bar and
 * the change since the last version in words ("up ₹2 lakh").
 */
export function CostDriverRow({
  drivers,
  total,
  label: labelProp,
}: {
  drivers: CostDriver[];
  total?: number;
  label?: string;
}) {
  const t = useT();
  const label = labelProp ?? t("Cost drivers");
  const sum = total ?? drivers.reduce((s, d) => s + d.amount, 0);
  const sorted = [...drivers].sort((a, b) => b.amount - a.amount);
  return (
    <section aria-label={label} style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{label}</h3>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {sorted.map((d) => {
          const share = Math.round((d.amount / (sum || 1)) * 100);
          return (
            <li
              key={d.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(120px, 1fr) 2fr auto",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {d.label}
                {d.reason && (
                  <span
                    style={{ display: "block", fontSize: 11, color: colorTokens.text.secondary }}
                  >
                    {d.reason}
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: colorTokens.background.tertiary,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    width: `${share}%`,
                    background: colorTokens.interactive.primary,
                  }}
                />
              </span>
              <span
                style={{
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  fontSize: typographyTokens.fontSize.sm,
                }}
              >
                {inrShort(d.amount)}{" "}
                <span style={{ color: colorTokens.text.secondary }}>({share}%)</span>
                {d.delta ? (
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        d.delta > 0
                          ? colorTokens.interactive.error
                          : colorTokens.interactive.success,
                    }}
                  >
                    <span aria-hidden="true">{d.delta > 0 ? "▲ " : "▼ "}</span>
                    {d.delta > 0 ? "up" : "down"} {inrShort(Math.abs(d.delta))}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ───────────────────────── ScenarioSwitcher ───────────────────────── */

export interface Scenario {
  id: string;
  name: string;
  /** Headline number for the scenario */
  value: number;
  /** Words, e.g. "Break-even month 14" */
  note?: string;
}

/**
 * ScenarioSwitcher
 * Radio cards for budget/revenue scenarios (Low / Base / High) with each
 * headline number; arrow keys move between them.
 */
export function ScenarioSwitcher({
  label: labelProp,
  scenarios,
  value,
  onChange,
  valueLabel: valueLabelProp,
}: {
  label?: string;
  scenarios: Scenario[];
  value: string;
  onChange: (id: string) => void;
  valueLabel?: string;
}) {
  const t = useT();
  const valueLabel = valueLabelProp ?? t("Net revenue");
  const label = labelProp ?? t("Scenario");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(
    0,
    scenarios.findIndex((s) => s.id === value)
  );
  const go = (n: number) => {
    const k = (n + scenarios.length) % scenarios.length;
    onChange(scenarios[k]!.id);
    refs.current[k]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${scenarios.length}, minmax(120px, 1fr))`,
        gap: spacingTokens.sm,
      }}
    >
      {scenarios.map((s, i) => {
        const on = s.id === value;
        return (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === idx ? 0 : -1}
            onClick={() => onChange(s.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") go(i + 1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(i - 1);
              else return;
              e.preventDefault();
            }}
            style={{
              textAlign: "left",
              padding: spacingTokens.md,
              borderRadius: 12,
              border: `${on ? 3 : 1}px solid ${on ? colorTokens.interactive.primary : colorTokens.border.primary}`,
              background: on ? colorTokens.background.tertiary : colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", fontWeight: 700 }}>{s.name}</span>{" "}
            <span style={{ display: "block", fontSize: 11, color: colorTokens.text.secondary }}>
              {valueLabel}
            </span>{" "}
            <span
              style={{ display: "block", fontSize: typographyTokens.fontSize.xl, fontWeight: 800 }}
            >
              {inrShort(s.value)}
            </span>{" "}
            {s.note && (
              <span style={{ display: "block", fontSize: 12, color: colorTokens.text.secondary }}>
                {s.note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── ContractExpiryPill ───────────────────────── */

/** Days from `today` to `expires` */
export function daysUntil(expires: Date, today: Date = new Date()): number {
  const a = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const b = Date.UTC(expires.getFullYear(), expires.getMonth(), expires.getDate());
  return Math.round((b - a) / 86400000);
}

/** "Expires in 12 days" / "Expired 3 days ago" with urgency colour + icon. */
export function ContractExpiryPill({
  expires,
  today,
  warnDays = 30,
}: {
  expires: Date;
  today?: Date;
  warnDays?: number;
}) {
  const locale = useLocale();
  const d = daysUntil(expires, today);
  const expired = d < 0;
  const soon = !expired && d <= warnDays;
  const text = expired
    ? `Expired ${-d} ${d === -1 ? "day" : "days"} ago`
    : d === 0
      ? "Expires today"
      : `Expires in ${d} ${d === 1 ? "day" : "days"}`;
  const [bg, fg, sym] = expired
    ? [colorTokens.semantic.error.bg, colorTokens.semantic.error.text, "✕"]
    : soon
      ? [colorTokens.semantic.warning.bg, colorTokens.semantic.warning.text, "!"]
      : [colorTokens.background.tertiary, colorTokens.text.secondary, "◷"];
  return (
    <span
      title={expires.toLocaleDateString(locale, { dateStyle: "long" })}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span aria-hidden="true">{sym}</span>
      {text}
      <VisuallyHidden>, {expires.toLocaleDateString(locale, { dateStyle: "long" })}</VisuallyHidden>
    </span>
  );
}

/* ───────────────────────── Token / smart contract ───────────────────────── */

export function TokenBalanceCard({
  symbol,
  name,
  balance,
  valueInr,
  change24h,
  holdersShare,
}: {
  symbol: string;
  name: string;
  balance: number;
  valueInr?: number;
  change24h?: number;
  holdersShare?: number;
}) {
  const t = useT();
  const locale = useLocale();
  return (
    <article style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          {symbol.slice(0, 3)}
        </span>
        <div>
          <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{name}</h3>
          <span style={{ fontSize: 12, color: colorTokens.text.secondary }}>{symbol}</span>
        </div>
      </div>
      <div
        style={{
          fontSize: typographyTokens.fontSize["2xl"],
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {balance.toLocaleString(locale)}{" "}
        <span style={{ fontSize: typographyTokens.fontSize.sm, fontWeight: 600 }}>{symbol}</span>
      </div>
      {valueInr != null && (
        <div style={{ color: colorTokens.text.secondary }}>≈ {inr(valueInr)}</div>
      )}
      {change24h != null && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: change24h >= 0 ? colorTokens.interactive.success : colorTokens.interactive.error,
          }}
        >
          <span aria-hidden="true">{change24h >= 0 ? "▲ " : "▼ "}</span>
          {change24h >= 0 ? t("Up") : t("Down")} {Math.abs(change24h).toFixed(1)}% in 24 hours
        </div>
      )}
      {holdersShare != null && (
        <div style={{ fontSize: 12, color: colorTokens.text.secondary }}>
          {t("You hold {holdersShare}% of the supply", { holdersShare })}
        </div>
      )}
    </article>
  );
}

export type ContractState = "draft" | "audited" | "deployed" | "paused" | "failed";

/** Smart-contract status with network, address (shortened, copyable) and audit. */
export function SmartContractStatusCard({
  name,
  state,
  network,
  address,
  auditedBy,
  lastEvent,
}: {
  name: string;
  state: ContractState;
  network: string;
  address?: string;
  auditedBy?: string;
  lastEvent?: string;
}) {
  const t = useT();
  const map: Record<ContractState, [string, string, string]> = {
    draft: ["Draft", colorTokens.background.tertiary, colorTokens.text.primary],
    audited: ["Audited", colorTokens.semantic.info.bg, colorTokens.semantic.info.text],
    deployed: ["Deployed", colorTokens.semantic.success.bg, colorTokens.semantic.success.text],
    paused: ["Paused", colorTokens.semantic.warning.bg, colorTokens.semantic.warning.text],
    failed: ["Failed", colorTokens.semantic.error.bg, colorTokens.semantic.error.text],
  };
  const [w, bg, fg] = map[state];
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
  return (
    <article style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{name}</h3>
        <span
          style={{
            padding: "2px 10px",
            borderRadius: 999,
            background: bg,
            color: fg,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {w}
        </span>
      </div>
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "2px 10px",
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <dt style={{ color: colorTokens.text.secondary }}>{t("Network")}</dt>
        <dd style={{ margin: 0 }}>{network}</dd>
        {address && (
          <>
            <dt style={{ color: colorTokens.text.secondary }}>{t("Address")}</dt>
            <dd style={{ margin: 0, fontFamily: "ui-monospace, Menlo, monospace" }} title={address}>
              <span aria-hidden="true">{short}</span>
              <VisuallyHidden>{address}</VisuallyHidden>
            </dd>
          </>
        )}
        {auditedBy && (
          <>
            <dt style={{ color: colorTokens.text.secondary }}>{t("Audit")}</dt>
            <dd style={{ margin: 0 }}>{auditedBy}</dd>
          </>
        )}
        {lastEvent && (
          <>
            <dt style={{ color: colorTokens.text.secondary }}>{t("Last event")}</dt>
            <dd style={{ margin: 0 }}>{lastEvent}</dd>
          </>
        )}
      </dl>
    </article>
  );
}

/* ───────────────────────── ProfitDistributionRing ───────────────────────── */

export interface Share {
  label: string;
  percent: number;
}

/**
 * ProfitDistributionRing
 * Waterfall of who gets what share of net profit, as a ring with a list
 * (percent and ₹ for the given pool) — the list is the real content.
 */
export function ProfitDistributionRing({
  title: titleProp,
  shares,
  pool,
}: {
  title?: string;
  shares: Share[];
  pool?: number;
}) {
  const t = useT();
  const title = titleProp ?? t("Profit distribution");
  const R = 54;
  const C = 2 * Math.PI * R;
  let off = 0;
  const total = shares.reduce((s, x) => s + x.percent, 0);
  return (
    <section
      aria-label={title}
      style={{
        ...card,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: spacingTokens.md,
      }}
    >
      <svg width="140" height="140" viewBox="-70 -70 140 140" aria-hidden="true">
        {shares.map((s, i) => {
          const len = (s.percent / 100) * C;
          const el = (
            <circle
              key={s.label}
              r={R}
              fill="none"
              stroke={chartColor(i)}
              strokeWidth={20}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-off}
              transform="rotate(-90)"
            />
          );
          off += len;
          return el;
        })}
        <text textAnchor="middle" y={-2} style={{ fontSize: 11, fill: colorTokens.text.secondary }}>
          {t("Net pool")}
        </text>
        <text
          textAnchor="middle"
          y={14}
          style={{ fontSize: 13, fontWeight: 800, fill: colorTokens.text.primary }}
        >
          {pool != null ? inrShort(pool) : `${total}%`}
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: 180 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: typographyTokens.fontSize.md }}>{title}</h3>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {shares.map((s, i) => (
            <li key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden="true"
                style={{ width: 12, height: 12, borderRadius: 3, background: chartColor(i) }}
              />
              <span style={{ flex: 1 }}>{s.label}</span>
              <strong>{s.percent}%</strong>
              {pool != null && (
                <span
                  style={{ color: colorTokens.text.secondary, minWidth: 80, textAlign: "right" }}
                >
                  {inrShort((pool * s.percent) / 100)}
                </span>
              )}
            </li>
          ))}
        </ul>
        {total !== 100 && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: colorTokens.interactive.error }}>
            {t("Shares add up to {total}%, not 100%.", { total })}
          </p>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── GovernanceVoteCard ───────────────────────── */

export interface VoteOption {
  id: string;
  label: string;
  votes: number;
}

/**
 * GovernanceVoteCard
 * Proposal with options as a radio group (when open) and results as
 * percentages in words. Quorum and closing time are stated.
 */
export function GovernanceVoteCard({
  title,
  description,
  options,
  closesAt,
  quorum,
  myVote,
  onVote,
  closed,
}: {
  title: string;
  description?: string;
  options: VoteOption[];
  closesAt: string;
  quorum?: number;
  myVote?: string;
  onVote?: (id: string) => void;
  closed?: boolean;
}) {
  const t = useT();
  const id = React.useId();
  const total = options.reduce((s, o) => s + o.votes, 0);
  const lead = options.reduce((a, b) => (b.votes > a.votes ? b : a), options[0]!);
  return (
    <article style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{title}</h3>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
          }}
        >
          {description}
        </p>
      )}
      <p style={{ margin: 0, fontSize: 12, color: colorTokens.text.secondary }}>
        {closed ? `Closed · ${lead.label} won` : `Closes ${closesAt}`}
        {quorum != null &&
          ` · Quorum ${quorum} votes (${total >= quorum ? "reached" : `${quorum - total} more needed`})`}
      </p>
      <fieldset
        style={{
          border: 0,
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
        disabled={closed || !onVote}
      >
        <legend
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {title}
        </legend>
        {options.map((o) => {
          const p = total ? Math.round((o.votes / total) * 100) : 0;
          return (
            <label
              key={o.id}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minHeight: 40,
                padding: "0 10px",
                borderRadius: 8,
                border: `1px solid ${myVote === o.id ? colorTokens.interactive.primary : colorTokens.border.secondary}`,
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${p}%`,
                  background: colorTokens.background.tertiary,
                }}
              />
              <input
                type="radio"
                name={id}
                checked={myVote === o.id}
                onChange={() => onVote?.(o.id)}
                style={{
                  position: "relative",
                  width: 18,
                  height: 18,
                  accentColor: colorTokens.interactive.primary,
                }}
              />
              <span style={{ position: "relative", flex: 1 }}>{o.label}</span>{" "}
              <span
                style={{
                  position: "relative",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {p}%<VisuallyHidden>{t(", {votes} votes", { votes: o.votes })}</VisuallyHidden>
              </span>
            </label>
          );
        })}
      </fieldset>
      <span style={{ fontSize: 12, color: colorTokens.text.secondary }}>
        {myVote ? t("{total} votes · You voted", { total }) : t("{total} votes", { total })}
      </span>
    </article>
  );
}

/* ───────────────────────── PitchSlideThumbnail ───────────────────────── */

/** Slide thumbnail with number and title; current slide is marked. */
export function PitchSlideThumbnail({
  number,
  title,
  src,
  current,
  viewedSeconds,
  onOpen,
}: {
  number: number;
  title: string;
  src?: string;
  current?: boolean;
  viewedSeconds?: number;
  onOpen?: () => void;
}) {
  const body = (
    <>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          aspectRatio: "16 / 9",
          borderRadius: 6,
          background: src
            ? `center / cover url(${src})`
            : `linear-gradient(135deg, ${colorTokens.background.tertiary}, ${colorTokens.border.primary})`,
          outline: current
            ? `3px solid ${colorTokens.interactive.primary}`
            : `1px solid ${colorTokens.border.primary}`,
        }}
      />
      <span style={{ display: "flex", gap: 6, marginTop: 4, fontSize: 12 }}>
        <strong>{number}</strong>
        <span
          style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {title}
        </span>
        {viewedSeconds != null && (
          <span style={{ color: colorTokens.text.secondary }}>{viewedSeconds}s</span>
        )}
      </span>
    </>
  );
  const name = `Slide ${number}: ${title}${viewedSeconds != null ? `, viewed ${viewedSeconds} seconds` : ""}`;
  return onOpen ? (
    <button
      type="button"
      aria-current={current ? "true" : undefined}
      onClick={onOpen}
      style={{
        width: 180,
        padding: 0,
        border: 0,
        background: "transparent",
        textAlign: "left",
        font: "inherit",
        color: colorTokens.text.primary,
        cursor: "pointer",
      }}
    >
      {/* Named by its content: the spoken summary, with the visual shorthand ("12s") hidden */}
      <VisuallyHidden>{name}</VisuallyHidden>
      <span aria-hidden="true">{body}</span>
    </button>
  ) : (
    <figure aria-label={name} style={{ margin: 0, width: 180 }}>
      {body}
    </figure>
  );
}

/* ───────────────────────── InvestorRow ───────────────────────── */

export interface Investor {
  id: string;
  name: string;
  firm?: string;
  /** Ticket size in ₹ */
  ticket?: number;
  stage:
    "Contacted" | "Deck sent" | "Meeting" | "Due diligence" | "Term sheet" | "Committed" | "Passed";
  lastContact?: string;
  nextStep?: string;
}

/** Investor pipeline as a table: stage in words, ticket in ₹ lakh/crore. */
export function InvestorRow({
  investors,
  label: labelProp,
}: {
  investors: Investor[];
  label?: string;
}) {
  const t = useT();
  const label = labelProp ?? t("Investors");
  const td: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: `1px solid ${colorTokens.border.secondary}`,
    textAlign: "left",
  };
  const committed = investors
    .filter((i) => i.stage === "Committed")
    .reduce((s, i) => s + (i.ticket ?? 0), 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={{ margin: 0, fontSize: typographyTokens.fontSize.sm }}>
        {t("Committed so far:")} <strong>{inrShort(committed)}</strong>
      </p>
      <div role="region" aria-label={label} tabIndex={0} style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 640,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <thead>
            <tr style={{ background: colorTokens.background.secondary }}>
              {["Investor", "Ticket", "Stage", "Last contact", "Next step"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  style={{ ...td, borderBottom: `2px solid ${colorTokens.border.primary}` }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {investors.map((i) => (
              <tr key={i.id}>
                <th scope="row" style={{ ...td, fontWeight: 600 }}>
                  {i.name}
                  {i.firm && (
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 400,
                        color: colorTokens.text.secondary,
                      }}
                    >
                      {i.firm}
                    </span>
                  )}
                </th>
                <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>
                  {i.ticket != null ? inrShort(i.ticket) : "—"}
                </td>
                <td
                  style={{
                    ...td,
                    fontWeight: 700,
                    color:
                      i.stage === "Committed"
                        ? colorTokens.interactive.success
                        : i.stage === "Passed"
                          ? colorTokens.text.tertiary
                          : colorTokens.text.primary,
                  }}
                >
                  {i.stage}
                </td>
                <td style={td}>{i.lastContact ?? "—"}</td>
                <td style={td}>{i.nextStep ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────── Crowdfunding ───────────────────────── */

/** Raised vs goal with backers and days left; role=progressbar in ₹ words. */
export function CrowdfundingProgressBar({
  raised,
  goal,
  backers,
  daysLeft,
  stretchGoals,
}: {
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  stretchGoals?: { at: number; label: string }[];
}) {
  const t = useT();
  const locale = useLocale();
  const p = Math.round((raised / (goal || 1)) * 100);
  const max = Math.max(goal, ...(stretchGoals ?? []).map((s) => s.at), raised);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <strong style={{ fontSize: typographyTokens.fontSize["2xl"] }}>{inrShort(raised)}</strong>
        <span style={{ color: colorTokens.text.secondary }}>
          {t("raised of {value} goal", { value: inrShort(goal) })}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={t("Funding")}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(raised, goal)}
        aria-valuetext={t("{value} of {value2}, {p}%", {
          value: inrShort(raised),
          value2: inrShort(goal),
          p,
        })}
        style={{
          position: "relative",
          height: 14,
          borderRadius: 999,
          background: colorTokens.background.tertiary,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            width: `${Math.min(100, (raised / max) * 100)}%`,
            borderRadius: 999,
            background:
              p >= 100 ? colorTokens.interactive.success : colorTokens.interactive.primary,
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -4,
            bottom: -4,
            left: `${(goal / max) * 100}%`,
            width: 2,
            background: colorTokens.text.primary,
          }}
        />
        {stretchGoals?.map((s) => (
          <span
            key={s.at}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              bottom: -4,
              left: `${(s.at / max) * 100}%`,
              width: 2,
              background: colorTokens.text.tertiary,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: typographyTokens.fontSize.sm }}>
        <span>
          <strong>{p}%</strong> funded
        </span>
        <span>
          <strong>{backers.toLocaleString(locale)}</strong> backers
        </span>
        <span>
          <strong>{daysLeft}</strong> {t.plural(daysLeft, "day left", "days left")}
        </span>
      </div>
      {stretchGoals && (
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: colorTokens.text.secondary }}>
          {stretchGoals.map((s) => (
            <li key={s.at}>
              {inrShort(s.at)}: {s.label} {raised >= s.at ? "— reached" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Backer reward tier: price, what you get, delivery, limited count left. */
export function RewardTierCard({
  title,
  amount,
  includes,
  delivery,
  limit,
  claimed,
  onSelect,
}: {
  title: string;
  amount: number;
  includes: string[];
  delivery?: string;
  limit?: number;
  claimed?: number;
  onSelect?: () => void;
}) {
  const left = limit != null ? limit - (claimed ?? 0) : null;
  const gone = left !== null && left <= 0;
  return (
    <article
      style={{ ...card, background: gone ? colorTokens.background.secondary : card.background }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{title}</h3>
        <strong style={{ fontSize: typographyTokens.fontSize.xl }}>{inr(amount)}</strong>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: typographyTokens.fontSize.sm }}>
        {includes.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <div style={{ fontSize: 12, color: colorTokens.text.secondary }}>
        {delivery && `Estimated delivery ${delivery}`}
        {left !== null && ` · ${gone ? "All claimed" : `${left} of ${limit} left`}`}
      </div>
      {onSelect && (
        <button
          type="button"
          onClick={onSelect}
          disabled={gone}
          style={{
            minHeight: 44,
            borderRadius: 10,
            border: 0,
            background: gone ? colorTokens.background.tertiary : colorTokens.interactive.primary,
            color: gone ? colorTokens.text.secondary : colorTokens.text.inverse,
            font: "inherit",
            fontWeight: 700,
            cursor: gone ? "not-allowed" : "pointer",
          }}
        >
          {gone ? "All claimed" : `Back for ${inr(amount)}`}
          <VisuallyHidden>: {title}</VisuallyHidden>
        </button>
      )}
    </article>
  );
}

/* ───────────────────────── AudienceRecommendationMeter ───────────────────────── */

/**
 * AudienceRecommendationMeter
 * "Would you recommend it?" from screenings: % recommend on a meter, plus
 * a net score (recommend − not) and the sample size.
 */
export function AudienceRecommendationMeter({
  recommend,
  neutral,
  notRecommend,
  label: labelProp,
}: {
  recommend: number;
  neutral: number;
  notRecommend: number;
  label?: string;
}) {
  const t = useT();
  const label = labelProp ?? t("Audience recommendation");
  const n = recommend + neutral + notRecommend || 1;
  const pr = Math.round((recommend / n) * 100);
  const pn = Math.round((notRecommend / n) * 100);
  const net = pr - pn;
  const word =
    net >= 50 ? "Strong" : net >= 20 ? "Positive" : net >= 0 ? t("Mixed") : t("Negative");
  return (
    <section aria-label={label} style={card}>
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{label}</h3>
      <div
        role="meter"
        aria-label={t("Would recommend")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pr}
        aria-valuetext={t("{pr}% would recommend", { pr })}
        style={{ display: "flex", height: 16, borderRadius: 999, overflow: "hidden" }}
      >
        <span style={{ width: `${pr}%`, background: colorTokens.interactive.success }} />
        <span style={{ width: `${100 - pr - pn}%`, background: colorTokens.border.secondary }} />
        <span style={{ width: `${pn}%`, background: colorTokens.interactive.error }} />
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <li>
          <strong>{pr}%</strong> {t("would recommend")}
        </li>
        <li>
          <strong>{100 - pr - pn}%</strong> unsure
        </li>
        <li>
          <strong>{pn}%</strong> {t("would not")}
        </li>
      </ul>
      <p style={{ margin: 0, fontSize: typographyTokens.fontSize.sm }}>
        {t("Net score")} <strong>{net > 0 ? `+${net}` : net}</strong>{" "}
        {t("— {word}. Based on {n} responses.", { word, n })}
      </p>
    </section>
  );
}
