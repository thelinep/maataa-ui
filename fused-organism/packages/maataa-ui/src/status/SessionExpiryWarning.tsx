/**
 * @maataa/ui/status/SessionExpiryWarning
 * Warns before a session times out, with time to extend it (WCAG 2.2.1)
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useState } from "react";
import { Modal } from "../surfaces/Modal";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens } from "../tokens";

export interface SessionExpiryWarningProps {
  expiresAt: Date;
  /** Open the warning this many seconds before expiry @default 120 */
  warnBeforeSeconds?: number;
  onExtend: () => void;
  onSignOut: () => void;
  /** Clock for tests */
  now?: () => number;
}

function minutesText(s: number): string {
  if (s >= 60) {
    const m = Math.ceil(s / 60);
    return `${m} minute${m === 1 ? "" : "s"}`;
  }
  return `${s} second${s === 1 ? "" : "s"}`;
}

/**
 * SessionExpiryWarning
 * Opens a dialog before expiry. "Stay signed in" is first and focused. The
 * remaining time updates silently and is announced only at open.
 *
 * @example
 * ```tsx
 * <SessionExpiryWarning expiresAt={session.expiresAt} onExtend={refresh} onSignOut={signOut} />
 * ```
 */
export function SessionExpiryWarning({
  expiresAt,
  warnBeforeSeconds = 120,
  onExtend,
  onSignOut,
  now = Date.now,
}: SessionExpiryWarningProps) {
  const t = useT();
  const secondsLeft = () => Math.max(0, Math.round((expiresAt.getTime() - now()) / 1000));
  const [left, setLeft] = useState(secondsLeft);
  useEffect(() => {
    setLeft(secondsLeft());
    const t = setInterval(() => setLeft(secondsLeft()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);
  const open = left > 0 && left <= warnBeforeSeconds;
  return (
    <Modal
      isOpen={open}
      onClose={onExtend}
      title={t("You'll be signed out soon")}
      size="sm"
      closeButton={false}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: spacingTokens.sm }}>
          <Button onClick={onExtend}>{t("Stay signed in")}</Button>
          <Button variant="secondary" onClick={onSignOut}>
            {t("Sign out now")}
          </Button>
        </div>
      }
    >
      <p style={{ margin: 0, color: colorTokens.text.primary }}>
        {t("For your security, you’ll be signed out in")} <strong>{minutesText(left)}</strong>.
        Unsaved work on this page is kept on this device.
      </p>
    </Modal>
  );
}

SessionExpiryWarning.displayName = "SessionExpiryWarning";
