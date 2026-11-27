/**
 * @maataa/ui/status/ScanStatusBadge
 * Malware-scan state of an uploaded document
 */

import { msg, useT } from "../i18n/LocaleProvider";
import React from "react";
import { Badge, type BadgeProps } from "../primitives/Badge";

export type ScanStatus = "pending" | "scanning" | "clean" | "quarantined" | "failed";

export interface ScanStatusBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  status: ScanStatus;
}

const config: Record<ScanStatus, { variant: NonNullable<BadgeProps["variant"]>; text: string }> = {
  pending: { variant: "default", text: msg("Waiting for scan") },
  scanning: { variant: "info", text: msg("Scanning") },
  clean: { variant: "success", text: msg("Clean") },
  quarantined: { variant: "error", text: msg("Quarantined") },
  failed: { variant: "warning", text: msg("Scan failed") },
};

/**
 * ScanStatusBadge
 * Shows whether a file has passed its virus scan, in words, so a download
 * button can be offered only for "clean" files.
 *
 * @example
 * ```tsx
 * <ScanStatusBadge status="quarantined" />
 * ```
 */
export const ScanStatusBadge = React.forwardRef<HTMLSpanElement, ScanStatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const t = useT();
    return (
      <Badge ref={ref} variant={config[status].variant} {...props}>
        {t(config[status].text)}
      </Badge>
    );
  }
);

ScanStatusBadge.displayName = "ScanStatusBadge";

/** Label for a scan status, e.g. for table cells or announcements. */
export const scanStatusLabel = (status: ScanStatus): string => config[status].text;
