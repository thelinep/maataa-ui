/**
 * @maataa/ui/forms/ScreeningFeedbackForm
 * Audience feedback after a test screening
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface FeedbackValues {
  overall: number;
  /** question id → 1–5 */
  ratings: Record<string, number>;
  liked: string;
  confusing: string;
  recommend: "yes" | "maybe" | "no" | "";
  anonymous: boolean;
}

export interface ScreeningFeedbackFormProps {
  film: string;
  questions?: { id: string; label: string }[];
  onSubmit: (v: FeedbackValues) => void;
}

const scale = ["Poor", "Fair", "Good", "Very good", "Excellent"];

function Rating({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
      <legend style={{ fontWeight: 500, padding: 0, marginBottom: 4 }}>{label}</legend>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {scale.map((w, i) => (
          <label
            key={w}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              border: `1px solid ${value === i + 1 ? colorTokens.interactive.primary : colorTokens.border.control}`,
              borderRadius: 999,
              background:
                value === i + 1 ? colorTokens.background.tertiary : colorTokens.background.primary,
              cursor: "pointer",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            <input
              type="radio"
              name={name}
              checked={value === i + 1}
              onChange={() => onChange(i + 1)}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            {i + 1} · {w}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * ScreeningFeedbackForm
 * Ratings are radio groups with words for each point (not just stars).
 * Free text is optional; anonymity is the default.
 */
export function ScreeningFeedbackForm({
  film,
  questions = [
    { id: "story", label: msg("The story") },
    { id: "pace", label: msg("The pace") },
    { id: "performances", label: msg("The performances") },
    { id: "music", label: msg("The music") },
  ],
  onSubmit,
}: ScreeningFeedbackFormProps) {
  const t = useT();
  const id = useId();
  const [v, setV] = useState<FeedbackValues>({
    overall: 0,
    ratings: {},
    liked: "",
    confusing: "",
    recommend: "",
    anonymous: true,
  });
  const [err, setErr] = useState("");
  const ta: React.CSSProperties = {
    padding: spacingTokens.sm,
    border: `2px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    font: "inherit",
    fontWeight: 400,
    background: colorTokens.background.primary,
  };
  return (
    <form
      noValidate
      aria-label={t("Feedback on {film}", { film })}
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.overall) return setErr("Give an overall rating (the rest is optional)");
        setErr("");
        onSubmit(v);
      }}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 600 }}
    >
      <p style={{ margin: 0, color: colorTokens.text.secondary }}>
        {t("Thanks for watching {film}. This takes about two minutes.", { film })}
      </p>
      <Rating
        name={`${id}-overall`}
        label={t("Overall")}
        value={v.overall}
        onChange={(n) => setV({ ...v, overall: n })}
      />
      {err && (
        <span role="alert" style={{ color: colorTokens.interactive.error, marginTop: -8 }}>
          {err}
        </span>
      )}
      {questions.map((q) => (
        <Rating
          key={q.id}
          name={`${id}-${q.id}`}
          label={t(q.label)}
          value={v.ratings[q.id] ?? 0}
          onChange={(n) => setV({ ...v, ratings: { ...v.ratings, [q.id]: n } })}
        />
      ))}
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 500 }}>
        {t("What stayed with you?")}
        <textarea
          rows={3}
          value={v.liked}
          onChange={(e) => setV({ ...v, liked: e.target.value })}
          style={ta}
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 500 }}>
        {t("Anything confusing or slow?")}
        <textarea
          rows={3}
          value={v.confusing}
          onChange={(e) => setV({ ...v, confusing: e.target.value })}
          style={ta}
        />
      </label>
      <fieldset
        style={{
          border: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          gap: spacingTokens.md,
          flexWrap: "wrap",
        }}
      >
        <legend style={{ fontWeight: 500, padding: 0, marginBottom: 4 }}>
          {t("Would you recommend it to a friend?")}
        </legend>
        {(["yes", "maybe", "no"] as const).map((r) => (
          <label key={r} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name={`${id}-rec`}
              checked={v.recommend === r}
              onChange={() => setV({ ...v, recommend: r })}
              style={{ accentColor: colorTokens.interactive.primary }}
            />
            {r === "yes" ? "Yes" : r === "maybe" ? t("Maybe") : t("No")}
          </label>
        ))}
      </fieldset>
      <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={v.anonymous}
          onChange={(e) => setV({ ...v, anonymous: e.target.checked })}
          style={{ accentColor: colorTokens.interactive.primary }}
        />
        {t("Keep my feedback anonymous")}
      </label>
      <div>
        <Button type="submit">{t("Send feedback")}</Button>
      </div>
    </form>
  );
}
ScreeningFeedbackForm.displayName = "ScreeningFeedbackForm";
