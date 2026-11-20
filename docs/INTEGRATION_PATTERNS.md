# maataa-ui Integration Patterns

## Overview

Patterns for integrating maataa-ui components with Phase 1 (Design Tokens), Phase 2 (Entity Manager), and Phase 5 (Real-time Collaboration).

---

## Pattern 1: Form + Entity Integration

Create forms that sync with Phase 2 entities.

```typescript
// In BudgetForm.tsx
import { useEntity } from '@/hooks/useEntity';
import { useForm, Controller } from 'react-hook-form';

export function BudgetForm({ budgetId }) {
  // Load entity from Phase 2
  const { entity: budget, loading } = useEntity({
    entityId: budgetId,
    type: 'budget',
    autoFetch: !!budgetId
  });

  // Form with validation
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(BudgetSchema),
    defaultValues: budget?.data || {}
  });

  // Submit creates/updates Phase 2 entity
  const onSubmit = async (data) => {
    await entityManager.updateEntity(budgetId, data);
    // Phase 5 auto-syncs to other users
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

**Key Points:**
- `useEntity` hook fetches Phase 2 data
- Form validation with Zod
- Submit updates entity manager
- Phase 5 handles real-time sync

---

## Pattern 2: List + Detail Navigation

Workflow: List page → Detail page with entity data.

```typescript
// BudgetList.tsx
function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  
  useEffect(() => {
    // Fetch from Phase 2
    const data = entityManager.getEntitiesByType('budget');
    setBudgets(data);
  }, []);

  return (
    <DataTable
      data={budgets}
      onRowClick={(budget) => navigate(`/budgets/${budget.id}`)}
    />
  );
}

// BudgetDetail.tsx
function BudgetDetail({ budgetId }) {
  const { entity: budget } = useEntity({
    entityId: budgetId,
    type: 'budget',
    autoFetch: true
  });

  return (
    <>
      <BudgetForecast {...budget} />
      <BudgetCategories {...budget.categories} />
      <BudgetAlerts {...budget.alerts} />
    </>
  );
}
```

**Key Points:**
- List fetches all entities
- Click navigates to detail
- Detail loads single entity
- Share state between pages via URL

---

## Pattern 3: Real-time Presence

Show who's editing what, in real time.

```typescript
// In ScheduleForm.tsx
import { usePresence } from '@/hooks/usePresence';

export function ScheduleForm({ eventId }) {
  const { setTyping, participants, updateCursor } = usePresence({
    entityId: eventId
  });

  // Broadcast typing
  const handleFieldChange = (fieldName) => {
    setTyping(true);
    // Auto-disable after 1 second of inactivity
    setTimeout(() => setTyping(false), 1000);
  };

  // Track cursor position
  const handleCursorUpdate = (fieldName, event) => {
    updateCursor({
      line: 0,
      column: event.target.selectionStart
    });
  };

  return (
    <>
      <FormInput onChange={handleFieldChange} />
      
      {/* Show who's typing */}
      <TypingIndicator
        typists={participants
          .filter(p => p.isTyping)
          .map(p => p.userName)}
      />

      {/* Show cursor positions */}
      {participants.map(p => (
        <CursorIndicator
          key={p.userId}
          position={p.cursorPosition}
          userName={p.userName}
        />
      ))}
    </>
  );
}
```

**Key Points:**
- `usePresence` hooks into Phase 5
- Broadcast typing/cursor via WebSocket
- Render other users' presence
- Auto-sync clears on inactivity

---

## Pattern 4: Permission-Based UI

Render different UI based on Phase 5 RBAC.

```typescript
// In TeamDetail.tsx
import { usePermission } from '@/hooks/usePermission';

export function TeamDetail({ teamId }) {
  const { checkPermission } = usePermission();
  const [canEdit, setCanEdit] = useState(false);
  const [canApprove, setCanApprove] = useState(false);

  useEffect(() => {
    // Check permissions for team
    const hasEdit = await checkPermission('edit:team', teamId);
    const hasApprove = await checkPermission('approve:members', teamId);
    
    setCanEdit(hasEdit);
    setCanApprove(hasApprove);
  }, [teamId]);

  return (
    <>
      {/* Only show edit button if permitted */}
      {canEdit && (
        <Button onClick={() => setEditMode(true)}>Edit Team</Button>
      )}

      {/* Only show approval section if permitted */}
      {canApprove && (
        <MemberApproval
          teamId={teamId}
          canApprove={canApprove}
        />
      )}
    </>
  );
}
```

**Key Points:**
- `usePermission` checks Phase 5 RBAC
- Conditionally render UI
- Prevents unauthorized actions
- Syncs with Phase 5 permission changes

---

## Pattern 5: Multi-Workflow Data Context

Share data between independent workflows.

```typescript
// Context for cross-workflow state
export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [budget, setBudget] = useState();
  const [team, setTeam] = useState();
  const [schedule, setSchedule] = useState();

  useEffect(() => {
    // Load related data for project
    const projectBudget = entityManager.getEntity('budget', projectId);
    const projectTeam = entityManager.getEntity('team', teamId);
    
    setBudget(projectBudget);
    setTeam(projectTeam);
  }, [projectId]);

  return (
    <ProjectContext.Provider value={{ budget, team, schedule }}>
      {children}
    </ProjectContext.Provider>
  );
}

// In ProjectDetail.tsx
export function ProjectDetail() {
  const { budget, team } = useContext(ProjectContext);

  // Show budget with team context
  return (
    <>
      <BudgetForecast {...budget} />
      
      {/* Team members affecting budget */}
      <div>Team Size: {team?.members?.length}</div>
      
      {/* Schedule affects both budget and team */}
      <ScheduleList
        events={schedule?.events}
        teamMembers={team?.members}
      />
    </>
  );
}
```

**Key Points:**
- Context shares state between workflows
- Load related entities together
- Update all dependents on change
- Phase 5 syncs context changes

---

## Pattern 6: Conflict Detection + Resolution

Detect conflicts and suggest resolutions.

```typescript
// In ScheduleWorkflow.tsx
export function ScheduleWorkflow() {
  const [events, setEvents] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  // Detect conflicts when events change
  useEffect(() => {
    const detected = detectConflicts(events);
    setConflicts(detected);
  }, [events]);

  const handleResolveConflict = async (conflictId, resolution) => {
    // Update event in Phase 2
    const conflict = conflicts.find(c => c.id === conflictId);
    
    // Move event to suggested time
    await entityManager.updateEntity(
      conflict.eventIds[0],
      { startTime: resolution.startTime }
    );

    // Phase 5 broadcasts change
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  return (
    <>
      {conflicts.length > 0 && (
        <ConflictDetection
          conflicts={conflicts}
          totalEvents={events.length}
          onResolve={handleResolveConflict}
        />
      )}

      <ScheduleList
        events={events}
        onCreateEvent={(event) => {
          setEvents([...events, event]);
          // Conflicts auto-detect above
        }}
      />
    </>
  );
}
```

**Key Points:**
- Watch for conflicts when data changes
- Use Phase 2 to update conflicting entities
- Phase 5 auto-syncs to other users
- Clear conflict when resolved

---

## Pattern 7: Token-Based Styling

Consistent styling across all components.

```typescript
// Theme from Phase 1 tokens
import { colorTokens, spacing, typography, borderRadius } from '@/utils/tokens';

const StyledCard = styled.div`
  /* Use tokens, never hardcoded colors */
  background: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  color: ${colorTokens.text.primary};
  font-size: ${typography.body.fontSize};

  /* Status-based colors from tokens */
  &.error {
    border-color: ${colorTokens.interactive.error};
    background: ${colorTokens.interactive.error}20;
  }

  &.success {
    border-color: ${colorTokens.interactive.success};
    background: ${colorTokens.interactive.success}20;
  }
`;

// All components follow this pattern
export const BudgetCategories = styled.div`
  display: grid;
  gap: ${spacing.md};
`;
```

**Key Points:**
- Never hardcode colors
- Use token values everywhere
- Status via token-based classes
- Dark mode works automatically

---

## Pattern 8: Testing Workflow Integration

Test complete workflows end-to-end.

```typescript
// tests/integration/workflows.test.tsx
describe('Budget Workflow', () => {
  it('creates budget → adds categories → tracks spending', async () => {
    // 1. Create budget (Phase 2)
    const budget = await entityManager.createEntity('budget', {
      name: 'Q4',
      allocated: 50000
    });

    // 2. Add categories
    await entityManager.updateEntity(budget.id, {
      categories: [
        { name: 'Ads', allocated: 25000 },
        { name: 'Content', allocated: 15000 }
      ]
    });

    // 3. Record spending
    await entityManager.createEntity('transaction', {
      budgetId: budget.id,
      amount: 8000,
      category: 'Ads'
    });

    // 4. Verify Phase 5 sync
    const syncedBudget = await entityManager.getEntity('budget', budget.id);
    expect(syncedBudget.spent).toBe(8000);
    expect(syncedBudget.categories[0].spent).toBe(8000);
  });
});
```

**Key Points:**
- Create entities in Phase 2
- Update relationships
- Verify Phase 5 sync
- Test full workflow chain

---

## Common Workflow Chains

### Budget → Forecasting → Alerts
1. Create budget with allocation
2. Record spending via transactions
3. Load trends into BudgetForecast
4. Configure alerts via BudgetAlerts
5. Phase 5 broadcasts all updates

### Team → Approval → Permissions
1. Create team with roles
2. Invite members via email
3. Approve in MemberApproval
4. Configure permissions in TeamPermissions
5. Phase 5 updates team access

### Project → Schedule → Conflicts
1. Create project with timeline
2. Create events via ScheduleForm
3. ConflictDetection finds overlaps
4. Suggest alternatives via ResourceAvailability
5. Phase 5 syncs accepted schedule

### Budget + Team + Project + Schedule
1. Project has budget and team
2. Team members affect budget cost
3. Schedule affects team availability
4. Budget limits project scope
5. All synced via Phase 5

