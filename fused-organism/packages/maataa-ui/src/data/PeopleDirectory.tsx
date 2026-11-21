/**
 * @maataa/ui/data/PeopleDirectory
 * Searchable, filterable list of people
 */

import React, { useMemo, useState } from "react";
import { PersonRow } from "./PersonRow";
import { FilterBar, type FilterDef } from "../forms/FilterBar";
import { colorTokens, spacingTokens } from "../tokens";
import type { PresenceStatus } from "./Avatar";

export interface DirectoryPerson {
  id: string;
  name: string;
  role: string;
  department?: string;
  city?: string;
  avatarSrc?: string;
  presence?: PresenceStatus;
  status?: string;
}

export interface PeopleDirectoryProps {
  people: DirectoryPerson[];
  onOpen?: (p: DirectoryPerson) => void;
  /** @default 'People' */
  label?: string;
}

/**
 * PeopleDirectory
 * Search box plus department and city filters; the result count is
 * announced. Each row's name is a button that opens the person.
 */
export function PeopleDirectory({ people, onOpen, label = "People" }: PeopleDirectoryProps) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Record<string, string>>({ department: "", city: "" });
  const uniq = (k: "department" | "city") =>
    Array.from(new Set(people.map((p) => p[k]).filter(Boolean) as string[])).sort();
  const filters: FilterDef[] = [
    {
      id: "department",
      label: "Department",
      options: uniq("department").map((d) => ({ value: d, label: d })),
    },
    { id: "city", label: "City", options: uniq("city").map((d) => ({ value: d, label: d })) },
  ];
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return people.filter(
      (p) =>
        (!s ||
          [p.name, p.role, p.department, p.city]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(s)) &&
        (!f.department || p.department === f.department) &&
        (!f.city || p.city === f.city)
    );
  }, [people, q, f]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}>
      <FilterBar
        label={`Filter ${label.toLowerCase()}`}
        filters={filters}
        values={f}
        onChange={setF}
        resultCount={shown.length}
        resultNoun="people"
        resultNounSingular="person"
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 14 }}>
          Search
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, role or city"
            style={{
              minWidth: 220,
              padding: spacingTokens.sm,
              border: `1px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              background: colorTokens.background.primary,
            }}
          />
        </label>
      </FilterBar>
      {shown.length === 0 ? (
        <p style={{ color: colorTokens.text.secondary }}>
          No one matches. Try a different name or clear the filters.
        </p>
      ) : (
        <ul aria-label={label} style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((p) => (
            <li key={p.id} style={{ borderBottom: `1px solid ${colorTokens.border.primary}` }}>
              <PersonRow
                name={p.name}
                subtitle={[p.role, p.department, p.city].filter(Boolean).join(" · ")}
                avatarSrc={p.avatarSrc}
                presence={p.presence}
                status={p.status}
                actions={
                  onOpen ? (
                    <button
                      type="button"
                      onClick={() => onOpen(p)}
                      aria-label={`Open ${p.name}`}
                      style={{
                        background: "none",
                        border: `1px solid ${colorTokens.border.control}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        cursor: "pointer",
                        font: "inherit",
                        color: colorTokens.text.primary,
                      }}
                    >
                      Open
                    </button>
                  ) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
PeopleDirectory.displayName = "PeopleDirectory";
