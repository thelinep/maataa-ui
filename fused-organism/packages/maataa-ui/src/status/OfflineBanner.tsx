/**
 * @maataa/ui/status/OfflineBanner
 * Tells people they are offline and what happens to their work
 */

import React, { useEffect, useState } from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface OfflineBannerProps {
  /** Force a state; omit to follow the browser's online/offline events */
  online?: boolean;
  /** Changes waiting to sync */
  pendingCount?: number;
  /** Shown briefly after reconnecting @default true */
  showReconnected?: boolean;
}

/** Follows navigator.onLine and the online/offline events. */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

/**
 * OfflineBanner
 * A polite status region that is always mounted, so the change is announced.
 * Says that work is kept on this device and syncs later.
 *
 * @example
 * ```tsx
 * <OfflineBanner pendingCount={queue.length} />
 * ```
 */
export function OfflineBanner({
  online,
  pendingCount = 0,
  showReconnected = true,
}: OfflineBannerProps) {
  const auto = useOnlineStatus();
  const isOnline = online ?? auto;
  const [justReconnected, setJustReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(!isOnline);
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      return;
    }
    if (wasOffline && showReconnected) {
      setJustReconnected(true);
      setWasOffline(false);
      const t = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isOnline, wasOffline, showReconnected]);

  const pending =
    pendingCount > 0
      ? ` ${pendingCount} ${pendingCount === 1 ? "change is" : "changes are"} waiting to sync.`
      : "";
  const text = !isOnline
    ? `You're offline. Your work is saved on this device and will sync when you reconnect.${pending}`
    : justReconnected
      ? "Back online. Syncing your changes."
      : "";
  return (
    <div
      role="status"
      style={
        text
          ? {
              padding: `${spacingTokens.sm} ${spacingTokens.md}`,
              background: isOnline
                ? colorTokens.interactive.success
                : colorTokens.interactive.warning,
              color: colorTokens.text.inverse,
              fontWeight: 600,
            }
          : { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }
      }
    >
      {text}
    </div>
  );
}

OfflineBanner.displayName = "OfflineBanner";
