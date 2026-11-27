/**
 * @maataa/ui/surfaces/ConfirmDialog
 * A modal question before a consequential action
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useId, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ConfirmDialogProps {
  isOpen: boolean;
  /** Called on Cancel, Escape or the close button */
  onCancel: () => void;
  /** Called on the confirming button */
  onConfirm: () => void;
  /** A question, e.g. "Archive this project?" */
  title: string;
  /** What will happen, in plain words */
  message: React.ReactNode;
  /** Verb for the action, e.g. "Archive" @default 'Confirm' */
  confirmLabel?: string;
  /** @default 'Cancel' */
  cancelLabel?: string;
  /** Use the danger style for destructive actions @default false */
  destructive?: boolean;
  /** Disables the confirm button while work is in flight */
  busy?: boolean;
}

/**
 * ConfirmDialog
 * Built on Modal (focus trap, Escape, focus return). No close button, so Cancel is
 * the first focusable and receives focus, so Enter never confirms by accident.
 *
 * @example
 * ```tsx
 * <ConfirmDialog isOpen={open} title="Archive this project?" message="It moves to Archived. You can restore it later."
 *   confirmLabel="Archive" onConfirm={archive} onCancel={() => setOpen(false)} />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  destructive = false,
  busy = false,
}: ConfirmDialogProps) {
  const t = useT();
  const cancelLabel = cancelLabelProp ?? t("Cancel");
  const confirmLabel = confirmLabelProp ?? t("Confirm");
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      closeButton={false}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: spacingTokens.sm }}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy || undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div style={{ color: colorTokens.text.primary, fontSize: typographyTokens.fontSize.md }}>
        {message}
      </div>
    </Modal>
  );
}

ConfirmDialog.displayName = "ConfirmDialog";

export interface TypedConfirmDialogProps extends Omit<ConfirmDialogProps, "destructive"> {
  /** The exact text the person must type, e.g. the project name */
  confirmationText: string;
}

/**
 * TypedConfirmDialog
 * For irreversible actions: the confirm button stays disabled until the
 * person types `confirmationText` exactly. Always destructive.
 *
 * @example
 * ```tsx
 * <TypedConfirmDialog isOpen={open} title="Delete Monsoon Diaries?" message="This removes every scene and cannot be undone."
 *   confirmationText="Monsoon Diaries" confirmLabel="Delete forever" onConfirm={del} onCancel={close} />
 * ```
 */
export function TypedConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmationText,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  busy = false,
}: TypedConfirmDialogProps) {
  const t = useT();
  const cancelLabel = cancelLabelProp ?? t("Cancel");
  const confirmLabel = confirmLabelProp ?? t("Delete");
  const id = useId();
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!isOpen) setTyped("");
  }, [isOpen]);
  const matches = typed.trim() === confirmationText;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      closeButton={false}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: spacingTokens.sm }}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={!matches || busy}
            aria-busy={busy || undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div style={{ color: colorTokens.text.primary }}>{message}</div>
      <label
        htmlFor={`${id}-input`}
        style={{ display: "block", marginTop: spacingTokens.md, fontWeight: 600 }}
      >
        {t("Type")} <strong>{confirmationText}</strong> {t("to confirm")}
      </label>
      <input
        id={`${id}-input`}
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        style={{
          marginTop: spacingTokens.xs,
          width: "100%",
          boxSizing: "border-box",
          padding: spacingTokens.sm,
          border: `1px solid ${colorTokens.border.control}`,
          borderRadius: 6,
          font: "inherit",
        }}
      />
    </Modal>
  );
}

TypedConfirmDialog.displayName = "TypedConfirmDialog";
