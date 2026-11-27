/**
 * @maataa/ui/forms/RoleAssignmentTable
 * Change each member's role on a project, protecting the last owner
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { Avatar } from "../data/Avatar";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface RoleMember {
  id: string;
  name: string;
  email?: string;
  role: string;
}

export interface RoleAssignmentTableProps {
  members: RoleMember[];
  roles: { value: string; label: string }[];
  onChange: (memberId: string, role: string) => void;
  /** Role value that must keep at least one holder @default 'owner' */
  ownerRole?: string;
  /** The signed-in member; can't demote themselves if they're the last owner */
  currentUserId?: string;
  /** @default 'Team roles' */
  caption?: string;
}

/**
 * RoleAssignmentTable
 * One labelled select per person ("Role for Asha Rao"). The last owner's
 * select is locked with a reason, so a project can't be left without one.
 */
export function RoleAssignmentTable({
  members,
  roles,
  onChange,
  ownerRole = "owner",
  caption = "Team roles",
}: RoleAssignmentTableProps) {
  const t = useT();
  const owners = members.filter((m) => m.role === ownerRole).length;
  const td: React.CSSProperties = {
    padding: spacingTokens.sm,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    verticalAlign: "middle",
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
        {caption}
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            style={{
              ...td,
              textAlign: "left",
              color: colorTokens.text.secondary,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {t("Person")}
          </th>
          <th
            scope="col"
            style={{
              ...td,
              textAlign: "left",
              color: colorTokens.text.secondary,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {t("Role")}
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => {
          const lastOwner = m.role === ownerRole && owners <= 1;
          return (
            <tr key={m.id}>
              <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 400 }}>
                <span style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center" }}>
                  <Avatar name={m.name} size="sm" decorative />
                  <span>
                    <span style={{ display: "block", fontWeight: 600 }}>{m.name}</span>
                    {m.email && (
                      <span
                        style={{
                          fontSize: typographyTokens.fontSize.xs,
                          color: colorTokens.text.secondary,
                        }}
                      >
                        {m.email}
                      </span>
                    )}
                  </span>
                </span>
              </th>
              <td style={td}>
                <select
                  aria-label={t("Role for {name}", { name: m.name })}
                  value={m.role}
                  disabled={lastOwner}
                  aria-describedby={lastOwner ? `last-owner-${m.id}` : undefined}
                  onChange={(e) => onChange(m.id, e.target.value)}
                  style={{
                    padding: spacingTokens.xs,
                    border: `1px solid ${colorTokens.border.control}`,
                    borderRadius: 6,
                    font: "inherit",
                    background: colorTokens.background.primary,
                  }}
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {lastOwner && (
                  <div
                    id={`last-owner-${m.id}`}
                    style={{
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                      marginTop: 2,
                    }}
                  >
                    {t("Only owner. Make someone else an owner first.")}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
RoleAssignmentTable.displayName = "RoleAssignmentTable";
