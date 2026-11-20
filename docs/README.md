# maataa-ui Documentation

Complete documentation for the maataa-ui component library and workflow framework.

## Quick Links

**Start Here:**
- 📖 [Component API Reference](./COMPONENT_API.md) — All 17 components with props, usage, and features
- 🔗 [Integration Patterns](./INTEGRATION_PATTERNS.md) — How to combine components and connect to Phase 1-5
- 📊 [Workflow Examples](./WORKFLOW_EXAMPLES.md) — Complete end-to-end workflows (Budget, Team, Project, Schedule)
- 🚀 [Deployment Guide](./DEPLOYMENT_GUIDE.md) — Setup, build, test, and deploy to production

## 17 Components

**Budget Suite (3):**
- BudgetCategories — Visual breakdown by category
- BudgetForecast — Predict spending and depletion
- BudgetAlerts — Configure threshold alerts

**Team Suite (3):**
- TeamRoles — Role hierarchy visualization
- TeamPermissions — Granular access control
- MemberApproval — Member onboarding workflow

**Project Suite (3):**
- ProjectDependencies — Task dependency graph
- ProjectTimeline — Timeline with milestones
- GanttChart — SVG-based timeline visualization

**Schedule Suite (4):**
- ScheduleList — Display and filter events
- ScheduleForm — Create/edit events with validation
- ConflictDetection — Detect and resolve conflicts
- ResourceAvailability — Find optimal meeting times

**Foundational (4):**
- Button — Customizable with variants/sizes
- FormInput — Text input with validation
- MultiSelect — Multi-choice selection
- DataTable — Sortable, filterable data

## Phase Integration

All components integrate with:

**Phase 1: Design Tokens**
- No hardcoded colors — all from token system
- Warm paper-and-ink palette
- Responsive spacing and typography

**Phase 2: Entity Manager**
- Create/read/update entities (budgets, teams, projects, events)
- CRUD operations with schema validation
- Relationship management

**Phase 5: Real-time Collaboration**
- WebSocket sync for multi-user editing
- Presence indicators (typing, cursors)
- Activity stream logging
- Role-based access control (RBAC)

## Workflow Patterns

### Budget → Forecast → Alerts
1. Create budget with allocation
2. Record spending via transactions
3. Load trends into forecast
4. Configure alerts for thresholds
5. All users see updates in real-time

### Team → Approval → Permissions
1. Create team with roles
2. Invite members via email
3. Approve in queue
4. Configure role permissions
5. Permissions apply instantly

### Project → Timeline → Gantt
1. Create project with phases
2. Add milestones and deliverables
3. Visualize on timeline
4. Update progress on Gantt
5. Team sees live updates

### Schedule → Conflicts → Availability
1. Create events with attendees
2. Auto-detect scheduling conflicts
3. Find optimal meeting times
4. Suggest alternatives
5. Book when all attendees available

## Getting Started

### Installation
```bash
npm install @maataa/ui
```

### Basic Usage
```typescript
import { BudgetForecast, TeamRoles, ScheduleList } from '@maataa/ui';

// Use in your app
<BudgetForecast 
  budgetName="Q4"
  allocated={50000}
  spent={12500}
/>
```

### With Phase 2 & 5
```typescript
import { useEntity } from '@maataa/ui/hooks';
import { usePresence } from '@maataa/ui/hooks';

export function MyDashboard({ budgetId }) {
  // Load from Phase 2
  const { entity: budget } = useEntity({ 
    entityId: budgetId, 
    type: 'budget' 
  });

  // Show presence from Phase 5
  const { participants } = usePresence({ entityId: budgetId });

  return <BudgetForecast {...budget} />;
}
```

## Documentation Organization

```
docs/
├── README.md                    # This file
├── COMPONENT_API.md             # Component reference (17 components)
├── INTEGRATION_PATTERNS.md      # How to combine components
├── WORKFLOW_EXAMPLES.md         # Complete workflow examples
└── DEPLOYMENT_GUIDE.md          # Build, test, deploy
```

## Component API (Quick Reference)

**Budget Components:**
```typescript
<BudgetCategories categories={...} onAddCategory={...} />
<BudgetForecast budgetName={...} allocated={...} spent={...} />
<BudgetAlerts budgetId={...} allocated={...} onAddAlert={...} />
```

**Team Components:**
```typescript
<TeamRoles roles={...} onAddRole={...} />
<TeamPermissions roles={...} permissions={...} onTogglePermission={...} />
<MemberApproval teamId={...} requests={...} onApprove={...} />
```

**Project Components:**
```typescript
<ProjectDependencies tasks={...} dependencies={...} />
<ProjectTimeline projectName={...} phases={...} milestones={...} />
<GanttChart tasks={...} startDate={...} endDate={...} />
```

**Schedule Components:**
```typescript
<ScheduleList events={...} onCreateEvent={...} />
<ScheduleForm onSubmit={...} availableAttendees={...} />
<ConflictDetection conflicts={...} onResolve={...} />
<ResourceAvailability attendees={...} onSelectSlot={...} />
```

## Common Patterns

### Form + Entity
Create a form that syncs with Phase 2 entities:
```typescript
// See Integration Patterns → Pattern 1
const { entity: budget } = useEntity({ entityId, type: 'budget' });
// Form updates trigger Phase 5 sync
```

### List + Detail Navigation
Navigate between list and detail pages:
```typescript
// See Integration Patterns → Pattern 2
<BudgetList onRowClick={navigateToBudgetDetail} />
<BudgetDetail budgetId={selectedBudgetId} />
```

### Real-time Presence
Show who's editing with typing indicators:
```typescript
// See Integration Patterns → Pattern 3
const { setTyping, participants } = usePresence({ entityId });
// Auto-broadcast to other users
```

### Permission-Based UI
Show different UI based on role:
```typescript
// See Integration Patterns → Pattern 4
const { canEdit } = usePermission();
{canEdit && <EditButton />}
```

## Best Practices

1. ✅ Always use Phase 1 tokens (no hardcoded colors)
2. ✅ Validate forms with Zod before submit
3. ✅ Use usePresence for multi-user features
4. ✅ Handle loading and error states
5. ✅ Provide empty states for no data
6. ✅ Use TypeScript strict mode
7. ✅ Test with Testing Library
8. ✅ WCAG 2.1 AA keyboard accessible

## Testing

Each component has comprehensive tests:

```bash
# Run all tests
npm test

# Run specific component tests
npm test BudgetCategories

# View coverage
npm test -- --coverage
```

See [Component API](./COMPONENT_API.md) for testing examples.

## Deployment

For production deployment:

1. Build: `npm run build`
2. Test: `npm test -- --coverage`
3. Lint: `npm run lint`
4. Type check: `npm run type-check`
5. Deploy: See [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Troubleshooting

**Phase 2 connection failing?**
→ Check REACT_APP_PHASE_2_API in .env

**Phase 5 WebSocket failing?**
→ Check REACT_APP_PHASE_5_WEBSOCKET in .env

**Type errors?**
→ Run `npm run type-check`

**Component not rendering?**
→ Check console for errors, verify props match Component API

**Tests failing?**
→ Run with --watch flag, check test isolation

For detailed troubleshooting, see [Deployment Guide](./DEPLOYMENT_GUIDE.md).

## Support

- 📖 [Component API Reference](./COMPONENT_API.md) for component details
- 🔗 [Integration Patterns](./INTEGRATION_PATTERNS.md) for combining components
- 📊 [Workflow Examples](./WORKFLOW_EXAMPLES.md) for complete workflows
- 🚀 [Deployment Guide](./DEPLOYMENT_GUIDE.md) for setup and deployment

## License

MIT

---

**Last Updated:** November 20, 2026  
**Components:** 17  
**Workflows:** 4  
**Documentation Pages:** 4

