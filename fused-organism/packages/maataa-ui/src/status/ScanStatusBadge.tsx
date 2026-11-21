/**
 * @maataa/ui/status/ScanStatusBadge
 * Malware-scan state of an uploaded document
 */

import React from "react";
import { Badge, type BadgeProps } from "../primitives/Badge";

export type ScanStatus = "pending" | "scanning" | "clean" | "quarantined" | "failed";

export interface ScanStatusBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  status: ScanStatus;
}

const config: Record<ScanStatus, { variant: NonNullable<BadgeProps["variant"]>; text: string }> = {
  pending: { variant: "default", text: "Waiting for scan" },
  scanning: { variant: "info", text: "Scanning" },
  clean: { variant: "success", text: "Clean" },
  quarantined: { variant: "error", text: "Quarantined" },
  failed: { variant: "warning", text: "Scan failed" },
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
  ({ status, ...props }, ref) => (
    <Badge ref={ref} variant={config[status].variant} {...props}>
      {config[status].text}
    </Badge>
  )
);

ScanStatusBadge.displayName = "ScanStatusBadge";

/** Label for a scan status, e.g. for table cells or announcements. */
export const scanStatusLabel = (status: ScanStatus): string => config[status].text;
