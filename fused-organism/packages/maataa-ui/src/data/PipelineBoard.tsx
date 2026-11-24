/**
 * @maataa/ui/data/PipelineBoard
 * Applicants (or anything) moving through stages, with a keyboard way to move
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { Avatar } from "./Avatar";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PipelineStage {
  id: string;
  label: string;
}

export interface PipelineCard {
  id: string;
  title: string;
  subtitle?: string;
  stage: string;
  /** Shown as an avatar when it's a person */
  person?: boolean;
}

export interface PipelineBoardProps {
  stages: PipelineStage[];
  cards: PipelineCard[];
  onMove: (cardId: string, toStage: string) => void;
  onOpen?: (card: PipelineCard) => void;
  /** @default 'Pipeline' */
  label?: string;
}

/**
 * PipelineBoard
 * Columns are labelled lists with counts. Each card has a "Move to" select,
 * so moving never needs a mouse drag; drag and drop also works. The move is
 * announced ("Asha Rao moved to Callbacks").
 */
export function PipelineBoard({
  stages,
  cards,
  onMove,
  onOpen,
  label: labelProp,
}: PipelineBoardProps) {
  const t = useT();
  const label = labelProp ?? t("Pipeline");
  const [msg, setMsg] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const move = (c: PipelineCard, to: string) => {
    if (to === c.stage) return;
    onMove(c.id, to);
    setMsg(
      t("{title} moved to {stage}", {
        title: c.title,
        stage: stages.find((s) => s.id === to)?.label ?? to,
      })
    );
  };
  return (
    <section aria-label={label}>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(220px, 1fr)",
          gap: spacingTokens.sm,
          overflowX: "auto",
          paddingBottom: spacingTokens.xs,
        }}
      >
        {stages.map((st) => {
          const mine = cards.filter((c) => c.stage === st.id);
          return (
            <div
              key={st.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                const c = cards.find((x) => x.id === dragging);
                if (c) move(c, st.id);
                setDragging(null);
              }}
              style={{
                background: colorTokens.background.secondary,
                borderRadius: 8,
                padding: spacingTokens.sm,
                minHeight: 160,
              }}
            >
              <h3
                id={`col-${st.id}`}
                style={{
                  margin: `0 0 ${spacingTokens.sm}`,
                  fontSize: typographyTokens.fontSize.sm,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {st.label}
                <span style={{ color: colorTokens.text.secondary, fontWeight: 400 }}>
                  {mine.length}{" "}
                  <VisuallyHidden>{mine.length === 1 ? "card" : "cards"}</VisuallyHidden>
                </span>
              </h3>
              <ul
                aria-labelledby={`col-${st.id}`}
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: spacingTokens.xs,
                }}
              >
                {mine.map((c) => (
                  <li
                    key={c.id}
                    draggable
                    onDragStart={() => setDragging(c.id)}
                    style={{
                      background: colorTokens.background.primary,
                      border: `1px solid ${colorTokens.border.primary}`,
                      borderRadius: 6,
                      padding: spacingTokens.sm,
                      display: "flex",
                      flexDirection: "column",
                      gap: spacingTokens.xs,
                      cursor: "grab",
                    }}
                  >
                    <div style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
                      {c.person && <Avatar name={c.title} size="sm" decorative />}
                      <div style={{ minWidth: 0 }}>
                        {onOpen ? (
                          <button
                            type="button"
                            onClick={() => onOpen(c)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              font: "inherit",
                              fontWeight: 600,
                              color: colorTokens.text.primary,
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            {c.title}
                          </button>
                        ) : (
                          <strong>{c.title}</strong>
                        )}
                        {c.subtitle && (
                          <div
                            style={{
                              fontSize: typographyTokens.fontSize.xs,
                              color: colorTokens.text.secondary,
                            }}
                          >
                            {c.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <select
                      aria-label={t("Move {title} to", { title: c.title })}
                      value={c.stage}
                      onChange={(e) => move(c, e.target.value)}
                      style={{
                        fontSize: typographyTokens.fontSize.xs,
                        padding: 2,
                        border: `1px solid ${colorTokens.border.control}`,
                        borderRadius: 4,
                        background: colorTokens.background.primary,
                      }}
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id === c.stage
                            ? t("In {stage}", { stage: s.label })
                            : t("Move to {stage}", { stage: s.label })}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
PipelineBoard.displayName = "PipelineBoard";
