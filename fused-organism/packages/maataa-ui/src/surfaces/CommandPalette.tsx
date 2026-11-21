/**
 * @maataa/ui/surfaces/CommandPalette
 * Ctrl/⌘+K: jump to a page or run an action by typing
 */

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { SearchWithResults, type SearchResult } from "../forms/SearchWithResults";

export interface Command {
  id: string;
  label: string;
  group?: string;
  description?: string;
  /** Shortcut shown as a hint, e.g. "G P" */
  shortcut?: string;
  /** Extra words that should match, e.g. ["money", "cost"] for Budgets */
  keywords?: string[];
  run: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  /** @default 'Go to or do…' */
  title?: string;
}

/** Case-insensitive match on label, group, description and keywords; label-prefix hits first. */
export function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  const words = q.split(/\s+/);
  const hay = (c: Command) =>
    [c.label, c.group, c.description, ...(c.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  return commands
    .filter((c) => words.every((w) => hay(c).includes(w)))
    .sort(
      (a, b) =>
        Number(!a.label.toLowerCase().startsWith(q)) - Number(!b.label.toLowerCase().startsWith(q))
    );
}

/** Opens the palette on Ctrl+K / ⌘K. */
export function useCommandPaletteShortcut(open: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
}

/**
 * CommandPalette
 * A dialog holding a combobox search. Commands close the dialog, then run.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * useCommandPaletteShortcut(() => setOpen(true));
 * <CommandPalette isOpen={open} onClose={() => setOpen(false)} commands={commands} />
 * ```
 */
export function CommandPalette({
  isOpen,
  onClose,
  commands,
  title = "Go to or do…",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);
  const matches = useMemo(() => filterCommands(commands, query), [commands, query]);
  const results: SearchResult[] = matches.map((c) => ({
    id: c.id,
    label: c.label,
    group: c.group,
    description: c.description,
    hint: c.shortcut,
  }));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md" closeButton={false}>
      <SearchWithResults
        label="Search commands"
        hideLabel
        alwaysOpen
        query={query}
        onQueryChange={setQuery}
        results={results}
        placeholder="Type a page or action"
        emptyText="No commands match"
        onEscape={onClose}
        onSelect={(r) => {
          const cmd = commands.find((c) => c.id === r.id);
          onClose();
          cmd?.run();
        }}
      />
    </Modal>
  );
}

CommandPalette.displayName = "CommandPalette";
