/**
 * @maataa/ui/status/RetryCountdown
 * "Retrying in 12 s" with a Retry now button
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens } from "../tokens";

export interface RetryCountdownProps {
  /** Seconds until the automatic retry */
  seconds: number;
  /** Called when the countdown ends or on Retry now */
  onRetry: () => void;
  /** What failed, e.g. "Couldn't load the call sheet." */
  message: string;
  /** Pause the countdown (e.g. while offline) */
  paused?: boolean;
}

/**
 * RetryCountdown
 * The message is announced once (role=alert); the ticking seconds are not
 * announced, so screen readers aren't flooded.
 *
 * @example
 * ```tsx
 * <RetryCountdown message="Couldn't load the call sheet." seconds={15} onRetry={reload} />
 * ```
 */
export function RetryCountdown({ seconds, onRetry, message, paused = false }: RetryCountdownProps) {
  const t = useT();
  const [left, setLeft] = useState(seconds);
  const onRetryRef = useRef(onRetry);
  onRetryRef.current = onRetry;
  useEffect(() => setLeft(seconds), [seconds]);
  useEffect(() => {
    if (paused || left <= 0) return;
    const t = setTimeout(() => {
      if (left === 1) onRetryRef.current();
      setLeft(left - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [left, paused]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: spacingTokens.md }}>
      <span role="alert" style={{ color: colorTokens.text.primary }}>
        {message}
      </span>
      <span
        aria-hidden="true"
        style={{ color: colorTokens.text.secondary, fontVariantNumeric: "tabular-nums" }}
      >
        {paused ? "Paused" : left > 0 ? `Retrying in ${left} s` : "Retrying…"}
      </span>
      <Button
        variant="secondary"
        onClick={() => {
          setLeft(0);
          onRetry();
        }}
      >
        {t("Retry now")}
      </Button>
    </div>
  );
}

RetryCountdown.displayName = "RetryCountdown";
