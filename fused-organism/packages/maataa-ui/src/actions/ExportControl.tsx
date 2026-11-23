/**
 * @maataa/ui/actions/ExportControl
 * Export data as CSV, Excel or PDF, optionally with personal details redacted
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type ExportFormat = "csv" | "xlsx" | "pdf";

export interface ExportControlProps {
  /** What is exported, e.g. "budget" */
  subject: string;
  formats?: ExportFormat[];
  onExport: (format: ExportFormat, options: { redact: boolean }) => void;
  /** Offer a redacted export (names, phones, emails removed) */
  allowRedaction?: boolean;
  /** Redact by default @default true when allowed */
  defaultRedact?: boolean;
  busy?: boolean;
}

const formatLabel: Record<ExportFormat, string> = {
  csv: "CSV (opens in any spreadsheet)",
  xlsx: "Excel workbook",
  pdf: "PDF (for printing or sharing)",
};

/**
 * ExportControl
 * A small form: format radios, optional "Remove personal details" checkbox,
 * then Export. Says what will be removed.
 */
export function ExportControl({
  subject,
  formats = ["csv", "xlsx", "pdf"],
  onExport,
  allowRedaction = false,
  defaultRedact = true,
  busy,
}: ExportControlProps) {
  const id = useId();
  const [fmt, setFmt] = useState<ExportFormat>(formats[0]);
  const [redact, setRedact] = useState(allowRedaction && defaultRedact);
  return (
    <form
      aria-label={`Export ${subject}`}
      onSubmit={(e) => {
        e.preventDefault();
        onExport(fmt, { redact: allowRedaction && redact });
      }}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
        <legend style={{ fontWeight: 600, padding: 0, marginBottom: spacingTokens.xs }}>
          Format
        </legend>
        {formats.map((f) => (
          <label
            key={f}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "center",
              padding: "2px 0",
            }}
          >
            <input
              type="radio"
              name={`${id}-fmt`}
              checked={fmt === f}
              onChange={() => setFmt(f)}
              style={{
                width: 20,
                height: 20,
                margin: 2,
                accentColor: colorTokens.interactive.primary,
              }}
            />
            {formatLabel[f]}
          </label>
        ))}
      </fieldset>
      {allowRedaction && (
        <label style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }}>
          <input
            type="checkbox"
            checked={redact}
            onChange={(e) => setRedact(e.target.checked)}
            aria-describedby={`${id}-redact`}
            style={{
              width: 20,
              height: 20,
              margin: "1px 2px 2px",
              accentColor: colorTokens.interactive.primary,
            }}
          />
          <span>
            Remove personal details
            <span
              id={`${id}-redact`}
              style={{
                display: "block",
                fontSize: typographyTokens.fontSize.sm,
                color: colorTokens.text.secondary,
              }}
            >
              Names become roles; phone numbers, emails and addresses are left out.
            </span>
          </span>
        </label>
      )}
      <div>
        <Button type="submit" disabled={busy} aria-busy={busy || undefined}>
          {busy ? "Preparing…" : `Export ${subject}`}
        </Button>
      </div>
    </form>
  );
}
ExportControl.displayName = "ExportControl";
