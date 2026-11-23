/**
 * @maataa/ui/data/DocumentList
 * Documents with virus-scan state, safe download, and what to do when held
 */

import { useLocale, useT, msg } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { ScanStatusBadge, type ScanStatus } from "../status/ScanStatusBadge";
import { formatBytes } from "../forms/FileDropzone";
import { Button } from "../primitives/Button";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  uploadedBy?: string;
  scan: ScanStatus;
}

export interface CleanDownloadButtonProps {
  name: string;
  scan: ScanStatus;
  onDownload: () => void;
}

const holdReason: Record<ScanStatus, string> = {
  pending: msg("Waiting for the virus scan. Download is available once it's clean."),
  scanning: msg("Being scanned for viruses. Download is available once it's clean."),
  clean: "",
  quarantined: msg("Held because the scan found a problem."),
  failed: msg("The scan couldn't finish, so the file is held."),
};

/**
 * CleanDownloadButton
 * Enabled only for clean files. When held, it stays focusable
 * (aria-disabled) and its description says why.
 */
export function CleanDownloadButton({ name, scan, onDownload }: CleanDownloadButtonProps) {
  const t = useT();
  const ok = scan === "clean";
  const descId = useId();
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
      <Button
        variant="secondary"
        size="sm"
        aria-label={t("Download {name}", { name })}
        aria-disabled={!ok || undefined}
        aria-describedby={ok ? undefined : descId}
        onClick={() => ok && onDownload()}
        style={ok ? undefined : { opacity: 0.55, cursor: "not-allowed" }}
      >
        {t("Download")}
      </Button>
      {!ok && (
        <span
          id={descId}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {t(holdReason[scan])}
        </span>
      )}
    </span>
  );
}
CleanDownloadButton.displayName = "CleanDownloadButton";

export interface QuarantinePanelProps {
  name: string;
  /** Scanner's finding, e.g. "Trojan.PDF.Generic" */
  finding?: string;
  onDelete: () => void;
  onRequestReview?: () => void;
}

/** QuarantinePanel: what was found, that nobody can download it, and what to do. */
export function QuarantinePanel({
  name,
  finding,
  onDelete,
  onRequestReview,
}: QuarantinePanelProps) {
  const t = useT();
  return (
    <section
      aria-label={t("{name} is quarantined", { name })}
      role="alert"
      style={{
        border: `1px solid ${colorTokens.interactive.error}`,
        borderLeft: `6px solid ${colorTokens.interactive.error}`,
        borderRadius: 6,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <strong>{t("{name} was quarantined", { name })}</strong>
      <span>
        The virus scan found {finding ? <code>{finding}</code> : "a possible threat"}. Nobody can
        download it, and it isn’t shared. If you trust where it came from, ask an admin to review
        it; otherwise delete it and ask the sender for a fresh copy.
      </span>
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button variant="danger" onClick={onDelete}>
          {t("Delete file")}
        </Button>
        {onRequestReview && (
          <Button variant="secondary" onClick={onRequestReview}>
            {t("Ask an admin to review")}
          </Button>
        )}
      </div>
    </section>
  );
}
QuarantinePanel.displayName = "QuarantinePanel";

export interface ScannerFailureNoticeProps {
  name: string;
  onRetry: () => void;
  retrying?: boolean;
}

/** ScannerFailureNotice: the scanner failed; the file is held, not lost. */
export function ScannerFailureNotice({ name, onRetry, retrying }: ScannerFailureNoticeProps) {
  const t = useT();
  return (
    <div
      role="status"
      style={{
        border: `1px solid ${colorTokens.interactive.warning}`,
        borderRadius: 6,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <strong>{t("We couldn’t scan {name}", { name })}</strong>
      <span>
        The scanner didn’t respond. The file is saved and held until a scan succeeds. Try again in a
        minute; if it keeps failing, tell your admin.
      </span>
      <div>
        <Button variant="secondary" onClick={onRetry} disabled={retrying}>
          {retrying ? t("Scanning…") : t("Scan again")}
        </Button>
      </div>
    </div>
  );
}
ScannerFailureNotice.displayName = "ScannerFailureNotice";

export interface DocumentListProps {
  documents: DocumentItem[];
  onDownload: (doc: DocumentItem) => void;
  onOpenIssue?: (doc: DocumentItem) => void;
  /** @default 'en-IN' */
  locale?: string;
  /** @default 'Documents' */
  caption?: string;
}

/** DocumentList: table of files with scan state and a guarded download. */
export function DocumentList({
  documents,
  onDownload,
  onOpenIssue,
  locale: localeProp,
  caption = "Documents",
}: DocumentListProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const td: React.CSSProperties = {
    padding: spacingTokens.sm,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    verticalAlign: "middle",
  };
  return (
    <ScrollTable label={caption}>
      <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
          {caption}
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {t("Name")}
            </th>
            <th scope="col" style={td}>
              {t("Uploaded")}
            </th>
            <th scope="col" style={td}>
              {t("Size")}
            </th>
            <th scope="col" style={td}>
              {t("Scan")}
            </th>
            <th scope="col" style={td}>
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                }}
              >
                {t("Actions")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => (
            <tr key={d.id}>
              <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                {d.name}
              </th>
              <td style={td}>
                {d.uploadedAt.toLocaleDateString(locale, { day: "numeric", month: "short" })}
                {d.uploadedBy ? ` · ${d.uploadedBy}` : ""}
              </td>
              <td style={td}>{formatBytes(d.size)}</td>
              <td style={td}>
                <ScanStatusBadge status={d.scan} />
              </td>
              <td style={{ ...td, whiteSpace: "nowrap" }}>
                <CleanDownloadButton name={d.name} scan={d.scan} onDownload={() => onDownload(d)} />
                {(d.scan === "quarantined" || d.scan === "failed") && onOpenIssue && (
                  <button
                    type="button"
                    onClick={() => onOpenIssue(d)}
                    aria-label={t("What happened to {name}?", { name: d.name })}
                    style={{
                      marginLeft: spacingTokens.sm,
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: colorTokens.interactive.primary,
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    {t("What happened?")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
DocumentList.displayName = "DocumentList";
