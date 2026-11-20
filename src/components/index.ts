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
export { DatePickerInput, type DatePickerInputProps } from './forms/DatePickerInput';
export { Select, type SelectProps, type SelectOption } from './forms/Select';
export { MultiSelect, type MultiSelectProps, type MultiSelectOption } from './forms/MultiSelect';
export { Checkbox, type CheckboxProps } from './forms/Checkbox';
export { Radio, type RadioProps } from './forms/Radio';
export { Toggle, type ToggleProps } from './forms/Toggle';
export { Combobox, type ComboboxProps, type ComboboxOption } from './forms/Combobox';

// Buttons
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './buttons/Button';

// Navigation
export { TopBar, type TopBarProps } from './navigation/TopBar';
export { Sidebar, type SidebarProps, type SidebarLink, type SidebarSection } from './navigation/Sidebar';
export { Tabs, type TabsProps, type TabItem } from './navigation/Tabs';
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from './navigation/Breadcrumb';

// Layout
export { Card, type CardProps } from './layout/Card';
export { Modal, type ModalProps } from './layout/Modal';
export { Drawer, type DrawerProps } from './layout/Drawer';
export { PageLayout, type PageLayoutProps } from './layout/PageLayout';
export { DataTable, type DataTableProps, type DataTableColumn } from './layout/DataTable';

// Collaboration
export { PresenceIndicator, type PresenceIndicatorProps } from './collaboration/PresenceIndicator';
export { ActivityFeed, type ActivityFeedProps } from './collaboration/ActivityFeed';

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
