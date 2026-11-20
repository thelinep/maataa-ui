# maataa-ui Workflow Examples

## Complete Workflow: Budget Management

Track spending across budget periods with real-time collaboration.

### Setup
```typescript
// 1. Create budget entity in Phase 2
const budget = await entityManager.createEntity('budget', {
  name: 'Q4 Marketing',
  allocated: 50000,
  currency: 'USD',
  startDate: new Date('2026-10-01'),
  endDate: new Date('2026-12-31')
});

// 2. Add categories to budget
await entityManager.updateEntity(budget.id, {
  categories: [
    { id: 'cat-ads', name: 'Ads', allocated: 25000 },
    { id: 'cat-content', name: 'Content', allocated: 15000 },
    { id: 'cat-tools', name: 'Tools', allocated: 10000 }
  ]
});
```

### Display Budget Page
```typescript
// BudgetDashboard.tsx
export function BudgetDashboard({ budgetId }) {
  // Load budget from Phase 2
  const { entity: budget, loading } = useEntity({
    entityId: budgetId,
    type: 'budget',
    autoFetch: true
  });

  // Calculate trends from transactions
  const trends = useMemo(() => {
    return budget.transactions?.map(t => ({
      date: t.date,
      amount: t.amount
    })) || [];
  }, [budget.transactions]);

  return (
    <PageLayout title={budget?.name}>
      {/* Budget forecast */}
      <BudgetForecast
        budgetName={budget?.name}
        allocated={budget?.allocated}
        spent={budget?.spent}
        trends={trends}
        daysInBudgetPeriod={90}
        currentDayOfPeriod={calculateDayOfPeriod(budget)}
      />

      {/* Category breakdown */}
      <BudgetCategories
        categories={budget?.categories}
        currency={budget?.currency}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Spending alerts */}
      <BudgetAlerts
        budgetId={budget?.id}
        allocated={budget?.allocated}
        spent={budget?.spent}
        alerts={budget?.alerts}
        onAddAlert={handleAddAlert}
        onUpdateAlert={handleUpdateAlert}
        onDeleteAlert={handleDeleteAlert}
      />
    </PageLayout>
  );
}
```

### Record Spending
```typescript
// TransactionForm.tsx
export function TransactionForm({ budgetId }) {
  const [loading, setLoading] = useState(false);
  const { setTyping } = usePresence({ entityId: budgetId });

  const handleSubmit = async (data) => {
    setLoading(true);
    setTyping(true);

    try {
      // Create transaction
      const transaction = await entityManager.createEntity('transaction', {
        budgetId,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: new Date()
      });

      // Update budget spent amount (Phase 2 handles aggregation)
      await entityManager.updateEntity(budgetId, {
        spent: (await entityManager.getEntity('budget', budgetId)).spent + data.amount
      });

      // Phase 5 auto-syncs changes to all users
      toast.success('Transaction recorded');
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  return (
    <ScheduleForm
      onSubmit={handleSubmit}
      fields={[
        { name: 'amount', type: 'number', label: 'Amount', required: true },
        { name: 'category', type: 'select', label: 'Category' },
        { name: 'description', type: 'text', label: 'Description' }
      ]}
    />
  );
}
```

### Results: Real-time Sync
- All users see budget update instantly
- Forecasts recalculate automatically
- Alerts trigger if thresholds crossed
- Activity stream logs each transaction
- Phase 5 presence shows who's active

---

## Complete Workflow: Team Collaboration

Manage team structure, roles, and member approvals.

### Setup
```typescript
// 1. Create team entity
const team = await entityManager.createEntity('team', {
  name: 'Marketing',
  description: 'Marketing team',
  budget: budgetId,
  project: projectId
});

// 2. Create roles
const roles = [
  { id: 'member', name: 'Member', level: 1 },
  { id: 'lead', name: 'Team Lead', level: 2 },
  { id: 'manager', name: 'Manager', level: 3 },
  { id: 'admin', name: 'Admin', level: 4 }
];

await entityManager.updateEntity(team.id, { roles });

// 3. Set permissions for each role
const permissions = [
  // Members can view projects
  { role: 'member', resource: 'project', action: 'view' },
  
  // Leads can edit projects
  { role: 'lead', resource: 'project', action: 'edit' },
  
  // Managers can approve members
  { role: 'manager', resource: 'member', action: 'approve' },
  
  // Admins can everything
  { role: 'admin', resource: '*', action: '*' }
];

await entityManager.updateEntity(team.id, { permissions });
```

### Team Management Page
```typescript
export function TeamManagement({ teamId }) {
  const { entity: team } = useEntity({
    entityId: teamId,
    type: 'team',
    autoFetch: true
  });

  return (
    <PageLayout title={`${team?.name} - Team Management`}>
      <Tabs>
        {/* Roles tab */}
        <TabPane label="Roles">
          <TeamRoles
            roles={team?.roles}
            onAddRole={handleAddRole}
            onUpdateRole={handleUpdateRole}
          />
        </TabPane>

        {/* Permissions tab */}
        <TabPane label="Permissions">
          <TeamPermissions
            roles={team?.roles}
            permissions={team?.permissions}
            rolePermissions={team?.rolePermissions}
            onTogglePermission={handleTogglePermission}
          />
        </TabPane>

        {/* Member approvals tab */}
        <TabPane label="Member Approvals">
          <MemberApproval
            teamId={team?.id}
            requests={team?.memberRequests}
            currentUserId={currentUserId}
            canApprove={checkPermission('approve:members')}
            onApprove={handleApprove}
            onReject={handleReject}
            onInvite={handleInvite}
          />
        </TabPane>

        {/* Members tab */}
        <TabPane label="Members">
          <MembersList
            members={team?.members}
            onRemoveMember={handleRemoveMember}
          />
        </TabPane>
      </Tabs>
    </PageLayout>
  );
}
```

### Results: Real-time Collaboration
- Managers approve members in real-time
- Permissions apply instantly
- Activity stream tracks role changes
- Multi-user edits synced via Phase 5

---

## Complete Workflow: Project Timeline

Plan projects with tasks, dependencies, and milestones.

### Setup
```typescript
// 1. Create project entity
const project = await entityManager.createEntity('project', {
  name: 'Q4 Product Launch',
  description: 'Launch new features',
  status: 'planning',
  startDate: new Date('2026-10-01'),
  endDate: new Date('2026-12-31'),
  teamId,
  budgetId
});

// 2. Add phases
await entityManager.updateEntity(project.id, {
  phases: [
    { id: 'p1', name: 'Design', startDate, endDate, percentComplete: 0 },
    { id: 'p2', name: 'Development', startDate, endDate, percentComplete: 0 },
    { id: 'p3', name: 'Testing', startDate, endDate, percentComplete: 0 }
  ]
});

// 3. Add milestones
await entityManager.updateEntity(project.id, {
  milestones: [
    { id: 'm1', name: 'Design Review', date, deliverables: [] },
    { id: 'm2', name: 'Beta Launch', date, deliverables: [] },
    { id: 'm3', name: 'Full Release', date, deliverables: [] }
  ]
});
```

### Project Timeline View
```typescript
export function ProjectTimeline({ projectId }) {
  const { entity: project } = useEntity({
    entityId: projectId,
    type: 'project',
    autoFetch: true
  });

  const handleUpdatePhase = async (phaseId, updates) => {
    const phase = project.phases.find(p => p.id === phaseId);
    await entityManager.updateEntity(project.id, {
      phases: project.phases.map(p => 
        p.id === phaseId ? { ...p, ...updates } : p
      )
    });
  };

  return (
    <PageLayout title={`${project?.name} - Timeline`}>
      <ProjectTimeline
        projectName={project?.name}
        startDate={project?.startDate}
        endDate={project?.endDate}
        phases={project?.phases}
        milestones={project?.milestones}
        onAddMilestone={handleAddMilestone}
        onUpdatePhase={handleUpdatePhase}
      />
    </PageLayout>
  );
}
```

### Results: Team Visibility
- All team members see timeline
- Status updates propagate in real-time
- Milestones mark key dates
- Gantt chart tracks progress

---

## Complete Workflow: Schedule Management

Manage events, detect conflicts, find optimal times.

### Setup
```typescript
// 1. Create events
const event = await entityManager.createEntity('event', {
  title: 'Sprint Planning',
  type: 'meeting',
  startTime: new Date('2026-11-20T10:00:00Z'),
  endTime: new Date('2026-11-20T11:00:00Z'),
  location: 'Conference Room A',
  attendees: [userId1, userId2, userId3],
  resources: ['projector', 'whiteboard']
});

// 2. Add team members
await entityManager.updateEntity(event.id, {
  attendees: team.members.map(m => m.id)
});

// 3. Set recurring pattern
await entityManager.updateEntity(event.id, {
  recurrence: {
    frequency: 'weekly',
    dayOfWeek: 'wednesday',
    endDate: new Date('2026-12-31')
  }
});
```

### Schedule Management Page
```typescript
export function ScheduleManagement({ teamId }) {
  const { entity: team } = useEntity({ entityId: teamId, type: 'team' });
  const [events, setEvents] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    // Fetch team events from Phase 2
    const teamEvents = entityManager.getEntitiesByType('event')
      .filter(e => team.members.some(m => e.attendees.includes(m.id)));
    
    setEvents(teamEvents);

    // Auto-detect conflicts
    const detected = detectConflicts(teamEvents);
    setConflicts(detected);
  }, [team]);

  return (
    <PageLayout title={`${team?.name} - Schedule`}>
      {/* Show conflicts */}
      {conflicts.length > 0 && (
        <ConflictDetection
          conflicts={conflicts}
          totalEvents={events.length}
          onResolve={handleResolveConflict}
        />
      )}

      {/* Event list */}
      <ScheduleList
        events={events}
        currentUserId={userId}
        onCreateEvent={handleCreateEvent}
        onEditEvent={handleEditEvent}
      />

      {/* Find optimal time */}
      <ResourceAvailability
        attendees={team.members}
        resources={getTeamResources(team)}
        busyTimes={events}
        dateRange={{ startDate: today, endDate: in30Days }}
        onSelectSlot={handleSelectSlot}
      />
    </PageLayout>
  );
}
```

### Results: Conflict-Free Scheduling
- Real-time conflict detection
- Optimal time suggestions
- Multi-user typing indicators
- Activity stream tracks changes

---

## Cross-Workflow Integration

### Budget + Team: Team Size Affects Budget
```typescript
export function ProjectBudgetTeamContext({ projectId }) {
  const { entity: project } = useEntity({ entityId: projectId, type: 'project' });
  const { entity: budget } = useEntity({ entityId: project.budgetId, type: 'budget' });
  const { entity: team } = useEntity({ entityId: project.teamId, type: 'team' });

  // Calculate per-person budget
  const perPersonBudget = budget.allocated / team.members.length;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>Total Budget: ${budget.allocated}</p>
      <p>Team Size: {team.members.length}</p>
      <p>Per-Person Budget: ${perPersonBudget}</p>

      {/* Show budget vs team trends */}
      <BudgetForecast {...budget} />
      <TeamRoles roles={team.roles} />
    </div>
  );
}
```

### Schedule + Team: Team Availability Affects Scheduling
```typescript
export function ProjectScheduleTeamContext({ projectId }) {
  const { entity: project } = useEntity({ entityId: projectId, type: 'project' });
  const events = entityManager.getEntitiesByType('event')
    .filter(e => e.projectId === projectId);

  // Show team members' schedule
  const { entity: team } = useEntity({ entityId: project.teamId, type: 'team' });

  const memberAvailability = team.members.map(member => {
    const memberEvents = events.filter(e => e.attendees.includes(member.id));
    return {
      member,
      busyUntil: memberEvents.length > 0 
        ? new Date(Math.max(...memberEvents.map(e => e.endTime)))
        : new Date()
    };
  });

  return (
    <div>
      <ScheduleList events={events} />
      <div>
        {memberAvailability.map(({ member, busyUntil }) => (
          <div key={member.id}>
            {member.name}: Available from {busyUntil.toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Always Validate Before Submit
```typescript
// Use Zod schema validation
import { z } from 'zod';

const BudgetSchema = z.object({
  name: z.string().min(1, 'Budget name required'),
  allocated: z.number().min(0, 'Must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP'])
});

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(BudgetSchema)
});
```

### 2. Show Loading States
```typescript
// Always show loading while fetching
const { entity: budget, loading } = useEntity({ ... });

if (loading) return <LoadingSpinner />;
if (!budget) return <EmptyState message="Budget not found" />;

return <BudgetForecast {...budget} />;
```

### 3. Handle Errors Gracefully
```typescript
try {
  await entityManager.updateEntity(id, data);
  toast.success('Changes saved');
} catch (error) {
  console.error(error);
  toast.error(`Failed to save: ${error.message}`);
}
```

### 4. Use Real-time Presence
```typescript
// Show who's editing
const { setTyping, participants } = usePresence({ entityId: budgetId });

<FormInput
  onFocus={() => setTyping(true)}
  onBlur={() => setTyping(false)}
  onChange={handleChange}
/>

{participants.filter(p => p.isTyping).map(p => (
  <TypingIndicator key={p.userId}>{p.userName} is typing...</TypingIndicator>
))}
```

### 5. Leverage Phase 1 Tokens
```typescript
// Every color should come from tokens
import { colorTokens, spacing, typography } from '@/design-system/phase1-design-tokens';

const StyledContainer = styled.div`
  background: ${colorTokens.background.primary};
  color: ${colorTokens.text.primary};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${typography.body.fontSize};
`;
```

