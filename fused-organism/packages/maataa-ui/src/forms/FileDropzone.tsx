/**
 * @maataa/ui/forms/FileDropzone
 * Drag files in, or choose them with a button
 */

import React, { useId, useRef, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface FileRejection {
  file: File;
  reason: string;
}

export interface FileDropzoneProps {
  /** Visible label, e.g. "Upload script" */
  label: string;
  /** Called with accepted files */
  onFiles: (files: File[]) => void;
  /** Called with files that failed type or size checks */
  onReject?: (rejections: FileRejection[]) => void;
  /** Same syntax as the input accept attribute, e.g. ".pdf,image/*" */
  accept?: string;
  multiple?: boolean;
  /** Per-file limit in bytes */
  maxSizeBytes?: number;
  /** Hint under the label, e.g. "PDF or Final Draft, up to 20 MB" */
  hint?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** "20 MB" style size text */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n >= 10 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

/** True if `file` matches an accept string */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

/**
 * FileDropzone
 * Dragging is optional: the "Choose files" button is the keyboard and
 * screen-reader path. Results are announced in a status region.
 *
 * @example
 * ```tsx
 * <FileDropzone label="Upload script" accept=".pdf,.fdx" maxSizeBytes={20e6} onFiles={upload} />
 * ```
 */
export function FileDropzone({
  label,
  onFiles,
  onReject,
  accept,
  multiple = true,
  maxSizeBytes,
  hint,
  disabled = false,
  style,
}: FileDropzoneProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [message, setMessage] = useState("");

  const handle = (list: FileList | File[] | null) => {
    if (!list || disabled) return;
    let files = Array.from(list);
    if (!multiple) files = files.slice(0, 1);
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    for (const file of files) {
      if (!fileMatchesAccept(file, accept))
        rejected.push({ file, reason: "file type not allowed" });
      else if (maxSizeBytes !== undefined && file.size > maxSizeBytes)
        rejected.push({ file, reason: `larger than ${formatBytes(maxSizeBytes)}` });
      else accepted.push(file);
    }
    if (accepted.length) onFiles(accepted);
    if (rejected.length) onReject?.(rejected);
    const parts: string[] = [];
    if (accepted.length)
      parts.push(`${accepted.length} ${accepted.length === 1 ? "file" : "files"} added`);
    for (const r of rejected) parts.push(`${r.file.name} not added: ${r.reason}`);
    setMessage(parts.join(". "));
  };

  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      aria-describedby={hint ? `${id}-hint` : undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer?.files ?? null);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacingTokens.sm,
        padding: spacingTokens.lg,
        border: `2px dashed ${over ? colorTokens.interactive.primary : colorTokens.border.control}`,
        borderRadius: 8,
        background: over ? colorTokens.background.tertiary : colorTokens.background.secondary,
        textAlign: "center",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      <span id={`${id}-label`} style={{ fontWeight: 600, color: colorTokens.text.primary }}>
        {label}
      </span>
      <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}>
        Drag {multiple ? "files" : "a file"} here, or
      </span>
      <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={disabled}>
        Choose {multiple ? "files" : "file"}
      </Button>
      {hint && (
        <span
          id={`${id}-hint`}
          style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}
        >
          {hint}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
        data-testid="file-dropzone-input"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
      <span
        role="status"
        style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.primary }}
      >
        {message}
      </span>
    </div>
  );
}

FileDropzone.displayName = "FileDropzone";
