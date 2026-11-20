import { lazy } from 'react';

// Lazy load workflow suites with error boundaries
export const BudgetWorkflow = lazy(() => 
  import('../workflows/BudgetWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const TeamWorkflow = lazy(() =>
  import('../workflows/TeamWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const ProjectWorkflow = lazy(() =>
  import('../workflows/ProjectWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const ScheduleWorkflow = lazy(() =>
  import('../workflows/ScheduleWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const EcommerceWorkflow = lazy(() =>
  import('../workflows/EcommerceWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const AnalyticsWorkflow = lazy(() =>
  import('../workflows/AnalyticsWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const AdminWorkflow = lazy(() =>
  import('../workflows/AdminWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);

export const ReportingWorkflow = lazy(() =>
  import('../workflows/ReportingWorkflow').catch(() => ({ default: () => <div>Error loading</div> }))
);
