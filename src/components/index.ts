/**
 * UI Components Export
 *
 * This module exports all foundational UI components for use
 * throughout the application. Import components from here rather
 * than directly from their individual files.
 */

// Buttons
// Canonical Button from the fused design system (@maataa/primitives).
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from '@maataa/primitives';

// Layout
export { Card, type CardProps } from '@maataa/primitives';

// Collaboration
export { PresenceIndicator, type PresenceIndicatorProps } from './collaboration/PresenceIndicator';
export { ActivityFeed, type ActivityFeedProps } from './collaboration/ActivityFeed';
export { TypingIndicator, type TypingIndicatorProps } from './collaboration/TypingIndicator';

// Budget (Phase D Enhancements)
export { BudgetCategories, type BudgetCategoriesProps, type BudgetCategory } from './budget/BudgetCategories';
export { BudgetForecast, type BudgetForecastProps, type SpendingTrend } from './budget/BudgetForecast';
export { BudgetAlerts, type BudgetAlertsProps, type SpendingAlert } from './budget/BudgetAlerts';

// Team (Phase D Enhancements)
export { TeamRoles, type TeamRolesProps, type TeamRole } from './team/TeamRoles';
export { TeamPermissions, type TeamPermissionsProps, type Permission, type RolePermission } from './team/TeamPermissions';
export { MemberApproval, type MemberApprovalProps, type MemberRequest } from './team/MemberApproval';

// Project (Phase D Enhancements)
export { ProjectDependencies, type ProjectDependenciesProps, type ProjectTask, type TaskDependency } from './project/ProjectDependencies';
export { ProjectTimeline, type ProjectTimelineProps, type ProjectMilestone, type ProjectPhase } from './project/ProjectTimeline';
export { GanttChart, type GanttChartProps, type GanttTask } from './project/GanttChart';

// Schedule (Phase D Enhancements)
export { ScheduleList, type ScheduleListProps, type ScheduledEvent } from './schedule/ScheduleList';
export { ConflictDetection, type ConflictDetectionProps, type ResourceConflict } from './schedule/ConflictDetection';
export { ScheduleForm, type ScheduleFormProps, type ScheduleFormData } from './schedule/ScheduleForm';
export { ResourceAvailability, type ResourceAvailabilityProps, type TimeSlotAvailability } from './schedule/ResourceAvailability';
