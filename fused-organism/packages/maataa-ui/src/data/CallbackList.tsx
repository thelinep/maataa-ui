/**
 * @maataa/ui/data/CallbackList
 * Who's called back, when, for what, and whether they confirmed
 */

import React from "react";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Callback {
  id: string;
  name: string;
  role: string;
  at: Date;
  /** e.g. "Scene 12 with Ravi" */
  material?: string;
  status: "invited" | "confirmed" | "declined" | "rescheduling";
}

export interface CallbackListProps {
  callbacks: Callback[];
  /** @default 'en-IN' */
  locale?: string;
  /** @default 'Callbacks' */
  caption?: string;
}

const tone = {
  invited: "warning",
  confirmed: "success",
  declined: "error",
  rescheduling: "info",
} as const;
const word = {
  invited: "Invited",
  confirmed: "Confirmed",
  declined: "Declined",
  rescheduling: "Rescheduling",
};

/** CallbackList: a table sorted by time. */
export function CallbackList({
  callbacks,
  locale = "en-IN",
  caption = "Callbacks",
}: CallbackListProps) {
  const td: React.CSSProperties = {
    padding: spacingTokens.sm,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
        {caption}
      </caption>
      <thead>
        <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
          <th scope="col" style={td}>
            When
          </th>
          <th scope="col" style={td}>
            Person
          </th>
          <th scope="col" style={td}>
            Role and material
          </th>
          <th scope="col" style={td}>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {[...callbacks]
          .sort((a, b) => a.at.getTime() - b.at.getTime())
          .map((c) => (
            <tr key={c.id}>
              <td style={td}>
                {c.at.toLocaleString(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </td>
              <th scope="row" style={{ ...td, textAlign: "left" }}>
                {c.name}
              </th>
              <td style={td}>
                {c.role}
                {c.material && (
                  <span style={{ display: "block", color: colorTokens.text.secondary }}>
                    {c.material}
                  </span>
                )}
              </td>
              <td style={td}>
                <Badge variant={tone[c.status]}>{word[c.status]}</Badge>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
CallbackList.displayName = "CallbackList";
