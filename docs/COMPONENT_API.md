# maataa-ui Component API Reference

## Overview

Complete reference for 17 UI components across 4 workflow suites. All components use Phase 1 design tokens (no hardcoded colors) and integrate with Phase 2 entities and Phase 5 real-time collaboration.

---

## Budget Components (3)

### BudgetCategories
Display and manage spending breakdown by category.

```typescript
<BudgetCategories
  categories={categories}
  currency="USD"
  onAddCategory={handleAdd}
  onUpdateCategory={handleUpdate}
  onDeleteCategory={handleDelete}
/>
```

**Features:**
- Visual category cards with allocation vs spent
- Add/remove categories with form
- Color-coded status (green if under, red if over)
- Total allocation and percentage calculations

**Props:**
- `categories: BudgetCategory[]` - Array of budget categories
- `currency?: string` - Currency code (default: USD)
- `onAddCategory?: (category) => void` - Callback when adding
- `onUpdateCategory?: (category) => void` - Callback when updating
- `onDeleteCategory?: (categoryId) => void` - Callback when deleting

---

### BudgetForecast
Predict future spending and budget depletion.

```typescript
<BudgetForecast
  budgetName="Q4 Marketing"
  allocated={50000}
  spent={12500}
  trends={historicalTrends}
  daysInBudgetPeriod={90}
  currentDayOfPeriod={30}
/>
```

**Features:**
- Daily average spending calculation
- End-of-period spending projection
- Days until budget depletion
- Multi-level alerts (over-budget, near-critical)
- Timeline progress bar (green → yellow → red)

**Props:**
- `budgetName: string` - Display name
- `allocated: number` - Total allocated amount
- `spent: number` - Amount spent so far
- `trends: SpendingTrend[]` - Historical spending data
- `currency?: string` - Currency code (default: USD)
- `daysInBudgetPeriod?: number` - Total period days (default: 90)
- `currentDayOfPeriod?: number` - Current day in period

---

### BudgetAlerts
Configure spending threshold alerts.

```typescript
<BudgetAlerts
  budgetId="budget-123"
  allocated={50000}
  spent={25000}
  alerts={alerts}
  onAddAlert={handleAdd}
  onUpdateAlert={handleUpdate}
  onDeleteAlert={handleDelete}
/>
```

**Features:**
- Three alert types: threshold (%), daily limit, category limit
- Multi-channel notifications (email, in-app, Slack)
- Toggle enable/disable per alert
- Form-based creation

**Props:**
- `budgetId: string` - Budget identifier
- `allocated: number` - Total budget
- `spent: number` - Current spending
- `alerts: SpendingAlert[]` - Active alerts
- `currency?: string` - Currency code (default: USD)
- Callbacks: `onAddAlert`, `onUpdateAlert`, `onDeleteAlert`

---

## Team Components (3)

### TeamRoles
Visualize team role hierarchy.

```typescript
<TeamRoles
  roles={roles}
  onAddRole={handleAdd}
  onUpdateRole={handleUpdate}
  onDeleteRole={handleDelete}
/>
```

**Features:**
- 4-level hierarchy: Member, Lead, Manager, Admin
- Visual hierarchy chart with role cards
- Permission count and member count per role
- Expandable permission details with colored tags

**Props:**
- `roles: TeamRole[]` - Array of roles
- Callbacks: `onAddRole`, `onUpdateRole`, `onDeleteRole`

---

### TeamPermissions
Manage granular access control matrix.

```typescript
<TeamPermissions
  roles={roles}
  permissions={permissions}
  rolePermissions={rolePermissions}
  onTogglePermission={handleToggle}
/>
```

**Features:**
- Visual grid: roles × resources × actions
- Granular permissions (view, edit, delete, approve)
- Resource groups (Projects, Budgets, Team, Members)
- Collapsible permission descriptions

**Props:**
- `roles: Array<{id, name, level}>` - Roles to configure
- `permissions: Permission[]` - Available permissions
- `rolePermissions: RolePermission[]` - Granted permissions
- `onTogglePermission?: (roleId, permId, granted) => void`

---

### MemberApproval
Manage member onboarding and approval workflow.

```typescript
<MemberApproval
  teamId="team-123"
  requests={memberRequests}
  currentUserId="user-123"
  canApprove={true}
  onApprove={handleApprove}
  onReject={handleReject}
  onInvite={handleInvite}
/>
```

**Features:**
- Email invite form with role selection
- Pending approval queue (managers only)
- Approved/rejected member lists
- Request status badges (pending/approved/rejected)

**Props:**
- `teamId: string` - Team identifier
- `requests: MemberRequest[]` - Member requests
- `currentUserId: string` - Current user ID
- `canApprove: boolean` - Can approve requests
- Callbacks: `onApprove`, `onReject`, `onInvite`

---

## Project Components (3)

### ProjectDependencies
Visualize task dependencies and critical path.

```typescript
<ProjectDependencies
  tasks={tasks}
  dependencies={dependencies}
  criticalPath={criticalPathIds}
  onAddDependency={handleAdd}
  onRemoveDependency={handleRemove}
/>
```

**Features:**
- Task dependency graph with visual arrows
- Critical path highlighting (red border + glow)
- Dependency types (finish-start, start-start, finish-finish)
- Lag days support
- Task status and member counts

**Props:**
- `tasks: ProjectTask[]` - Tasks in project
- `dependencies: TaskDependency[]` - Task dependencies
- `criticalPath?: string[]` - Critical path task IDs
- Callbacks: `onAddDependency`, `onRemoveDependency`

---

### ProjectTimeline
Display project timeline with milestones.

```typescript
<ProjectTimeline
  projectName="Q4 Launch"
  startDate="2026-10-01"
  endDate="2026-12-31"
  phases={phases}
  milestones={milestones}
  onAddMilestone={handleAdd}
  onUpdatePhase={handleUpdate}
/>
```

**Features:**
- Phase progression bars with percentage
- Milestone list with status indicators
- Deliverables as tags per milestone
- Project-level progress tracking

**Props:**
- `projectName: string` - Display name
- `startDate, endDate: string` - Date range
- `phases: ProjectPhase[]` - Project phases
- `milestones: ProjectMilestone[]` - Key milestones
- `currentDate?: string` - Current date reference
- Callbacks: `onAddMilestone`, `onUpdatePhase`

---

### GanttChart
Visualize tasks and progress on timeline.

```typescript
<GanttChart
  tasks={tasks}
  startDate="2026-10-01"
  endDate="2026-12-31"
  currentDate="2026-11-15"
  onTaskClick={handleTaskClick}
/>
```

**Features:**
- SVG-based Gantt chart
- Task bars with progress fill
- Current date indicator (dashed line)
- Status-based colors (green/blue/red/gray)
- Click-to-select tasks

**Props:**
- `tasks: GanttTask[]` - Tasks to display
- `startDate, endDate: string` - Chart date range
- `currentDate?: string` - Current date line
- `onTaskClick?: (taskId) => void` - Task click handler

---

## Schedule Components (4)

### ScheduleList
Display and filter scheduled events.

```typescript
<ScheduleList
  events={events}
  currentUserId="user-123"
  onCreateEvent={handleCreate}
  onViewEvent={handleView}
  onEditEvent={handleEdit}
  onDeleteEvent={handleDelete}
/>
```

**Features:**
- Grid layout with title, type, time, attendees
- Search by title/description
- Filter by type and status
- Event type badges
- Duration calculation

**Props:**
- `events: ScheduledEvent[]` - Scheduled events
- `currentUserId: string` - Current user ID
- Callbacks: `onCreateEvent`, `onViewEvent`, `onEditEvent`, `onDeleteEvent`

---

### ScheduleForm
Create or edit scheduled events.

```typescript
<ScheduleForm
  eventId="event-123"
  initialData={eventData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  availableAttendees={attendees}
/>
```

**Features:**
- React Hook Form + Zod validation
- Fields: title, type, time, location, attendees, resources
- Auto-calculated duration display
- Phase 5 typing indicators
- Error/success messages

**Props:**
- `eventId?: string` - Event ID for editing
- `initialData?: Partial<ScheduleFormData>` - Pre-fill values
- `onSubmit: (data) => Promise<void>` - Form submission
- `onCancel?: () => void` - Cancel handler
- `availableAttendees?: {label, value}[]` - Attendee options

---

### ConflictDetection
Identify and resolve scheduling conflicts.

```typescript
<ConflictDetection
  conflicts={conflicts}
  totalEvents={45}
  onResolve={handleResolve}
  onShowAlternatives={handleAlternatives}
/>
```

**Features:**
- Conflict severity scoring (high/medium/low)
- Resource conflict visualization
- Suggested resolutions
- Conflict rate metrics
- Severity-based styling

**Props:**
- `conflicts: ResourceConflict[]` - Detected conflicts
- `totalEvents: number` - Total events count
- Callbacks: `onResolve`, `onShowAlternatives`

---

### ResourceAvailability
Find optimal meeting times.

```typescript
<ResourceAvailability
  attendees={attendees}
  resources={resources}
  busyTimes={busyTimes}
  dateRange={{startDate, endDate}}
  onSelectSlot={handleSelect}
/>
```

**Features:**
- Generate available time slots with scoring
- Attendee and resource availability
- Sorted by match score (highest first)
- Score visualization
- Quick select buttons

**Props:**
- `attendees: {id, name}[]` - Team members
- `resources: {id, name}[]` - Required resources
- `busyTimes: {startTime, endTime}[]` - Blocked times
- `dateRange: {startDate, endDate}` - Search range
- `onSelectSlot?: (slot) => void` - Selection handler

---

## Foundational Components (4)

These components are reused across workflows.

### Button
Customizable button with variants and sizes.

**Variants:** primary, secondary, outline, destructive, ghost  
**Sizes:** sm, md, lg  
**States:** loading, disabled

### FormInput
Text input with validation states.

**Types:** text, email, password, number, url  
**Features:** labels, hints, error messages

### MultiSelect
Multi-choice selection component.

**Features:** Search, keyboard navigation, clear all

### DataTable
Sortable, filterable data display.

**Features:** Column definitions, pagination, row click handlers

---

## Phase Integration

### Phase 1 (Design Tokens)
All components use token colors—no hardcoded values:
```typescript
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

styled.div`
  background: ${colorTokens.background.primary};
  color: ${colorTokens.text.primary};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${typography.body.fontSize};
`;
```

### Phase 2 (Entity Manager)
Components structured for Phase 2 integration:
```typescript
const { entity, loading } = useEntity({
  entityId: projectId,
  type: 'project',
  autoFetch: !!projectId
});
```

### Phase 5 (Real-time Collaboration)
Components emit presence and sync via Phase 5:
```typescript
const { setTyping, participants } = usePresence({ entityId });
```

---

## Best Practices

1. **Always use Phase 1 tokens** for colors/spacing
2. **Validate with Zod** before submitting forms
3. **Use usePresence** for multi-user features
4. **Handle loading states** in async operations
5. **Provide empty states** for empty data
6. **Use TypeScript** for all props
7. **Test user interactions** with Testing Library
8. **Keyboard accessible** (WCAG 2.1 AA)

