/**
 * @maataa/ui/status
 * Category: status
 */

// Re-export types
export type { Readiness, StatusBadgeProps } from "./StatusBadge";

export type { SpinnerProps, SpinnerSize } from "./Spinner";
export type { StepIndicatorProps, Step, StepState } from "./StepIndicator";
export type { ScanStatusBadgeProps, ScanStatus } from "./ScanStatusBadge";
export type { TimerProps, TimerResult } from "./Timer";

// Re-export components
export { StatusBadge } from "./StatusBadge";
export { Spinner } from "./Spinner";
export { StepIndicator } from "./StepIndicator";
export { ScanStatusBadge, scanStatusLabel } from "./ScanStatusBadge";
export { Timer, formatDuration, spokenDuration } from "./Timer";

// Catalogue A: shared states
export { Skeleton, type SkeletonProps } from "./Skeleton";
export { OfflineBanner, useOnlineStatus, type OfflineBannerProps } from "./OfflineBanner";
export { SyncStatus, type SyncStatusProps, type SyncState } from "./SyncStatus";
export { RetryCountdown, type RetryCountdownProps } from "./RetryCountdown";
export { SessionExpiryWarning, type SessionExpiryWarningProps } from "./SessionExpiryWarning";

// Catalogue B
export { SignedUrlStatus, type SignedUrlStatusProps } from "./SignedUrlStatus";
export { OverrunAlert, type OverrunAlertProps } from "./OverrunAlert";
export {
  ScheduleConflictBadge,
  type ScheduleConflictBadgeProps,
  type ScheduleConflict,
} from "./ScheduleConflictBadge";
