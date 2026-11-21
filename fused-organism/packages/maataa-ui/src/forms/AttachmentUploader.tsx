/**
 * @maataa/ui/forms/AttachmentUploader
 * A dropzone plus the list of attached files and their upload state
 */

import React from "react";
import { FileDropzone, formatBytes, type FileDropzoneProps } from "./FileDropzone";
import { ScanStatusBadge, type ScanStatus } from "../status/ScanStatusBadge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  /** Upload state */
  state: "uploading" | "done" | "error";
  /** 0–100 while uploading */
  progress?: number;
  /** Virus-scan result, when the server scans */
  scan?: ScanStatus;
  /** Shown when state is "error" */
  error?: string;
}

export interface AttachmentUploaderProps extends Omit<FileDropzoneProps, "onFiles"> {
  attachments: Attachment[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}

/**
 * AttachmentUploader
 * Each file shows a native progress bar while uploading, then its scan
 * badge. Remove buttons name the file.
 *
 * @example
 * ```tsx
 * <AttachmentUploader label="Attach call sheet" attachments={files} onAdd={upload} onRemove={remove} />
 * ```
 */
export function AttachmentUploader({
  attachments,
  onAdd,
  onRemove,
  ...dropzone
}: AttachmentUploaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <FileDropzone {...dropzone} onFiles={onAdd} />
      {attachments.length > 0 && (
        <ul
          aria-label="Attached files"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens.xs,
          }}
        >
          {attachments.map((a) => (
            <li
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: spacingTokens.sm,
                alignItems: "center",
                padding: spacingTokens.sm,
                border: `1px solid ${colorTokens.border.primary}`,
                borderRadius: 6,
              }}
            >
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.name}
                </span>
                <span
                  style={{
                    color: colorTokens.text.secondary,
                    fontSize: typographyTokens.fontSize.xs,
                  }}
                >
                  {formatBytes(a.size)}
                  {a.state === "error" && (
                    <span style={{ color: colorTokens.interactive.error }}>
                      {" "}
                      · Upload failed{a.error ? `: ${a.error}` : ""}
                    </span>
                  )}
                </span>
                {a.state === "uploading" && (
                  <progress
                    max={100}
                    value={a.progress ?? undefined}
                    aria-label={`Uploading ${a.name}`}
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: 4,
                      accentColor: colorTokens.interactive.primary,
                    }}
                  />
                )}
              </span>
              <span>{a.state === "done" && a.scan && <ScanStatusBadge status={a.scan} />}</span>
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                aria-label={`Remove ${a.name}`}
                style={{
                  minWidth: 32,
                  minHeight: 32,
                  border: `1px solid ${colorTokens.border.control}`,
                  borderRadius: 6,
                  background: colorTokens.background.primary,
                  color: colorTokens.text.primary,
                  cursor: "pointer",
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

AttachmentUploader.displayName = "AttachmentUploader";
