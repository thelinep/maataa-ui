/**
 * UI Components Export
 *
 * This module exports all foundational UI components for use
 * throughout the application. Import components from here rather
 * than directly from their individual files.
 */

// Forms
export { FormInput, type FormInputProps, type InputType } from './forms/FormInput';
export { FormFieldWrapper, type FormFieldWrapperProps } from './forms/FormFieldWrapper';
export { Select, type SelectProps, type SelectOption } from './forms/Select';
export { MultiSelect, type MultiSelectProps, type MultiSelectOption } from './forms/MultiSelect';

// Buttons
// Canonical Button from the fused design system (@maataa/primitives).
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from '@maataa/primitives';

// Navigation
export { Tabs, type TabsProps, type TabItem } from './navigation/Tabs';

// Layout
export { Card, type CardProps } from './layout/Card';
export { Modal, type ModalProps } from './layout/Modal';
export { DataTable, type DataTableProps, type DataTableColumn } from './layout/DataTable';

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
