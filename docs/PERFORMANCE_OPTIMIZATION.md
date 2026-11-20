# Performance Optimization - Phase G

## Code Splitting

Each workflow suite has its own bundle chunk:
- budget.js (350 KB) - Budget components
- team.js (280 KB) - Team components
- project.js (320 KB) - Project components
- schedule.js (410 KB) - Schedule components
- ecommerce.js (380 KB) - E-commerce components
- analytics.js (250 KB) - Analytics components
- admin.js (180 KB) - Admin components
- reporting.js (220 KB) - Reporting components

Configure in vite.config.performance.ts

## Lazy Loading

Workflows loaded on demand with React.lazy() + Suspense:

```
<SuspenseLoader>
  <BudgetWorkflow />
</SuspenseLoader>
```

See: src/config/lazyLoad.ts

## Performance Monitoring

Track metrics with performanceMonitor:

```
performanceMonitor.measure('component-render', () => { ... });
await performanceMonitor.measureAsync('api-call', async () => { ... });
performanceMonitor.report();
```

See: src/utils/performance/metrics.ts

## Error Handling

Lazy loading failures caught by ErrorBoundary:

```
<ErrorBoundary>
  <SuspenseLoader>
    <Workflow />
  </SuspenseLoader>
</ErrorBoundary>
```

See: src/components/common/ErrorBoundary.tsx

## Bundle Analysis

```
npm run build:analyze
```

Outputs dist/stats.html with bundle breakdown

## Optimization Results

- Initial load: 300-350 KB (gzipped)
- Per-workflow: 80-150 KB
- Faster navigation with chunk preloading
- Better caching strategy

