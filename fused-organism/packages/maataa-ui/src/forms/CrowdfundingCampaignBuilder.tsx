/**
 * @maataa/ui/forms/CrowdfundingCampaignBuilder
 * Goal, dates, story and reward tiers for a crowdfunding campaign
 */

import React, { useId } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface RewardTier {
  id: string;
  title: string;
  amount: number;
  description: string;
  /** Limited quantity; empty = unlimited */
  limit?: number;
  /** e.g. "Mar 2027" */
  delivery?: string;
}

export interface CampaignDraft {
  title: string;
  goal: number;
  start: string;
  end: string;
  story: string;
  /** Where the money goes, in plain words */
  useOfFunds: string;
  tiers: RewardTier[];
}

/** Problems that block submitting for review */
export function campaignProblems(c: CampaignDraft): string[] {
  const p: string[] = [];
  if (!c.title.trim()) p.push("Add a title");
  if (!(c.goal > 0)) p.push("Set a funding goal");
  if (c.start && c.end) {
    const days = (new Date(c.end).getTime() - new Date(c.start).getTime()) / 86_400_000;
    if (days < 7) p.push("Run the campaign for at least 7 days");
    if (days > 60) p.push("Keep the campaign to 60 days or fewer");
  } else p.push("Set start and end dates");
  if (c.story.trim().length < 200) p.push("Tell the story in at least 200 characters");
  if (!c.useOfFunds.trim()) p.push("Say how the money will be used");
  if (c.tiers.length === 0) p.push("Add at least one reward tier");
  c.tiers.forEach((t, i) => {
    if (!t.title.trim() || !(t.amount > 0)) p.push(`Tier ${i + 1} needs a title and an amount`);
  });
  return p;
}

export interface CrowdfundingCampaignBuilderProps {
  value: CampaignDraft;
  onChange: (c: CampaignDraft) => void;
  onSubmitForReview: () => void;
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
  newId?: () => string;
}

/**
 * CrowdfundingCampaignBuilder
 * Sections for basics, story and tiers. A live checklist lists what still
 * blocks review, so the submit button is never disabled without a reason.
 */
export function CrowdfundingCampaignBuilder({
  value: c,
  onChange,
  onSubmitForReview,
  currency = "INR",
  locale = "en-IN",
  newId = () => Math.random().toString(36).slice(2, 9),
}: CrowdfundingCampaignBuilderProps) {
  const id = useId();
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const problems = campaignProblems(c);
  const set = <K extends keyof CampaignDraft>(k: K, v: CampaignDraft[K]) =>
    onChange({ ...c, [k]: v });
  const setTier = (tid: string, p: Partial<RewardTier>) =>
    set(
      "tiers",
      c.tiers.map((t) => (t.id === tid ? { ...t, ...p } : t))
    );
  const inp: React.CSSProperties = {
    padding: 8,
    border: `2px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    font: "inherit",
    fontWeight: 400,
    background: colorTokens.background.primary,
  };
  const lab: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    fontWeight: 500,
  };
  const box: React.CSSProperties = {
    border: `1px solid ${colorTokens.border.primary}`,
    borderRadius: 8,
    padding: spacingTokens.md,
    display: "flex",
    flexDirection: "column",
    gap: spacingTokens.sm,
    margin: 0,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 680 }}>
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Basics</legend>
        <label style={lab}>
          Campaign title
          <input value={c.title} onChange={(e) => set("title", e.target.value)} style={inp} />
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: spacingTokens.sm,
          }}
        >
          <label style={lab}>
            Goal ({currency})
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={c.goal || ""}
              onChange={(e) => set("goal", Number(e.target.value))}
              style={inp}
            />
          </label>
          <label style={lab}>
            Starts
            <input
              type="date"
              value={c.start}
              onChange={(e) => set("start", e.target.value)}
              style={inp}
            />
          </label>
          <label style={lab}>
            Ends
            <input
              type="date"
              value={c.end}
              onChange={(e) => set("end", e.target.value)}
              style={inp}
            />
          </label>
        </div>
      </fieldset>
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Story</legend>
        <label style={lab}>
          Why this film, why now
          <textarea
            rows={6}
            value={c.story}
            onChange={(e) => set("story", e.target.value)}
            aria-describedby={`${id}-count`}
            style={inp}
          />
        </label>
        <span
          id={`${id}-count`}
          style={{
            fontSize: typographyTokens.fontSize.xs,
            color:
              c.story.trim().length < 200
                ? colorTokens.interactive.warning
                : colorTokens.text.secondary,
          }}
        >
          {c.story.trim().length} characters (200 or more)
        </span>
        <label style={lab}>
          How the money will be used
          <textarea
            rows={3}
            value={c.useOfFunds}
            onChange={(e) => set("useOfFunds", e.target.value)}
            style={inp}
          />
        </label>
      </fieldset>
      <fieldset style={box}>
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>Reward tiers</legend>
        {c.tiers.map((t, i) => (
          <fieldset
            key={t.id}
            style={{
              border: `1px dashed ${colorTokens.border.control}`,
              borderRadius: 6,
              padding: spacingTokens.sm,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: spacingTokens.xs,
            }}
          >
            <legend style={{ fontSize: typographyTokens.fontSize.sm, fontWeight: 600 }}>
              Tier {i + 1}
              {t.amount > 0 ? ` · ${money.format(t.amount)}` : ""}
            </legend>
            <label style={{ ...lab, fontSize: typographyTokens.fontSize.sm }}>
              Title
              <input
                value={t.title}
                onChange={(e) => setTier(t.id, { title: e.target.value })}
                style={inp}
              />
            </label>
            <label style={{ ...lab, fontSize: typographyTokens.fontSize.sm }}>
              Amount
              <input
                type="number"
                min={0}
                value={t.amount || ""}
                onChange={(e) => setTier(t.id, { amount: Number(e.target.value) })}
                style={inp}
              />
            </label>
            <label style={{ ...lab, fontSize: typographyTokens.fontSize.sm }}>
              Limit (optional)
              <input
                type="number"
                min={0}
                value={t.limit ?? ""}
                onChange={(e) =>
                  setTier(t.id, { limit: e.target.value ? Number(e.target.value) : undefined })
                }
                style={inp}
              />
            </label>
            <label style={{ ...lab, fontSize: typographyTokens.fontSize.sm, gridColumn: "1 / -1" }}>
              What backers get
              <input
                value={t.description}
                onChange={(e) => setTier(t.id, { description: e.target.value })}
                style={inp}
              />
            </label>
            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() =>
                  set(
                    "tiers",
                    c.tiers.filter((x) => x.id !== t.id)
                  )
                }
                aria-label={`Remove tier ${i + 1}`}
              >
                Remove
              </Button>
            </div>
          </fieldset>
        ))}
        <div>
          <Button
            variant="secondary"
            onClick={() =>
              set("tiers", [...c.tiers, { id: newId(), title: "", amount: 0, description: "" }])
            }
          >
            Add tier
          </Button>
        </div>
      </fieldset>
      <section
        aria-label="Ready for review"
        style={{
          border: `1px solid ${problems.length ? colorTokens.interactive.warning : colorTokens.interactive.success}`,
          borderRadius: 8,
          padding: spacingTokens.md,
        }}
      >
        <div role="status" style={{ fontWeight: 600 }}>
          {problems.length
            ? `${problems.length} thing${problems.length === 1 ? "" : "s"} to do before review`
            : "Ready to send for review"}
        </div>
        {problems.length > 0 && (
          <ul
            style={{
              margin: `${spacingTokens.xs} 0 0`,
              paddingLeft: spacingTokens.lg,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: spacingTokens.sm }}>
          <Button onClick={onSubmitForReview} disabled={problems.length > 0}>
            Send for review
          </Button>
        </div>
      </section>
    </div>
  );
}
CrowdfundingCampaignBuilder.displayName = "CrowdfundingCampaignBuilder";
