# maataa-ui Deployment Guide

## Prerequisites

- Node.js 18+ 
- npm 9+
- Git
- Phase 1 Design Tokens configured
- Phase 2 Entity Manager running
- Phase 5 WebSocket server running

## Development Setup

```bash
# Clone repository
git clone https://github.com/forfilmcoin/maataa-ui.git
cd maataa-ui

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Update .env with your values
# PHASE_2_API_URL=http://localhost:3001
# PHASE_5_WEBSOCKET_URL=ws://localhost:3002
# REACT_APP_ENV=development
```

## Development Environment

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Start Storybook
npm run storybook

# Build for production
npm run build

# Check TypeScript
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── budget/              # Budget workflow components
│   ├── team/                # Team management components
│   ├── project/             # Project management components
│   ├── schedule/            # Schedule management components
│   ├── foundational/        # Reusable UI components
│   └── __tests__/           # Component tests
├── hooks/
│   ├── useEntity.ts         # Phase 2 entity fetching
│   ├── usePresence.ts       # Phase 5 real-time presence
│   └── usePermission.ts     # Phase 5 RBAC
├── layout/
│   ├── AppShell.tsx         # Main app layout
│   ├── WorkspaceNav.tsx     # Workspace navigation
│   └── PageLayout.tsx       # Page template
├── pages/
│   ├── BudgetWorkflow.tsx
│   ├── TeamWorkflow.tsx
│   ├── ProjectWorkflow.tsx
│   ├── ScheduleWorkflow.tsx
│   └── 404.tsx
├── design-system/
│   └── phase1-design-tokens.ts  # Phase 1 token system
└── utils/
    ├── validation.ts        # Form validation schemas
    └── formatting.ts        # Data formatting helpers

tests/
├── integration/
│   └── workflows.integration.test.tsx   # End-to-end workflow tests
└── e2e/
    └── workflows.e2e.spec.ts            # E2E browser tests
```

## Configuration

### Phase 1 Tokens
Located at: `src/design-system/phase1-design-tokens.ts`

```typescript
export const colorTokens = {
  background: {
    primary: '#faf9f4',
    secondary: '#f5f4f1'
  },
  text: {
    primary: '#3d3835',
    secondary: '#8a8784'
  },
  // ... more tokens
};
```

### Phase 2 Connection
In `.env`:
```
REACT_APP_PHASE_2_API=http://localhost:3001/api
```

Usage:
```typescript
import { entityManager } from '@/hooks/useEntity';

const budget = await entityManager.getEntity('budget', budgetId);
```

### Phase 5 Connection
In `.env`:
```
REACT_APP_PHASE_5_WEBSOCKET=ws://localhost:3002
```

Usage:
```typescript
import { usePresence } from '@/hooks/usePresence';

const { setTyping, participants } = usePresence({ entityId });
```

## Deployment

### Build for Production
```bash
# Build React app
npm run build

# Output: build/
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src ./src
COPY public ./public
COPY tsconfig.json .

# Build
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t maataa-ui .
docker run -p 80:80 maataa-ui
```

### Environment Variables

**Development:**
```
REACT_APP_ENV=development
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

**Staging:**
```
REACT_APP_ENV=staging
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=warn
```

**Production:**
```
REACT_APP_ENV=production
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

## CI/CD

### GitHub Actions Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build
      - name: Deploy to production
        run: |
          # Deploy to your hosting provider
          # Example: aws s3 sync build/ s3://bucket-name/
```

## Testing Strategy

### Unit Tests
```bash
npm test -- --testPathPattern=components
```

### Integration Tests
```bash
npm test -- --testPathPattern=integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm test -- --coverage
# Target: >80% coverage
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load workflow pages
import { lazy, Suspense } from 'react';

const BudgetWorkflow = lazy(() => import('./pages/BudgetWorkflow'));

<Suspense fallback={<LoadingSpinner />}>
  <BudgetWorkflow />
</Suspense>
```

### Image Optimization
```typescript
// Use optimized images
<img 
  src={image} 
  alt="description" 
  loading="lazy" 
  width={300} 
  height={300}
/>
```

### Caching Strategy
- Phase 2 entities: Cache for 5 minutes
- Phase 5 presence: Cache for 30 seconds
- Design tokens: Cache forever (versioned)

## Monitoring

### Error Tracking
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV
});
```

### Analytics
```typescript
// Track user interactions
import { gtag } from '@next/third-parties/google';

gtag.event('page_view', {
  page_path: location.pathname
});
```

### Logging
```typescript
// Structured logging
console.info({
  level: 'info',
  message: 'User created budget',
  userId: user.id,
  budgetId: budget.id,
  timestamp: new Date().toISOString()
});
```

## Troubleshooting

### Phase 2 Connection Issues
```bash
# Check Phase 2 health
curl http://localhost:3001/health

# Check environment variables
echo $REACT_APP_PHASE_2_API
```

### Phase 5 WebSocket Issues
```bash
# Check WebSocket connection
npm run dev  # Watch console for connection messages

# Verify WebSocket URL
echo $REACT_APP_PHASE_5_WEBSOCKET
```

### Type Checking Errors
```bash
# Generate type definitions
npm run type-check

# Fix common issues
npm run type-check -- --pretty
```

### Test Failures
```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test
npm test BudgetCategories
```

## Rollback Procedure

1. Identify failed deployment
2. Revert to previous commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. Redeploy from CD pipeline
4. Verify rollback success
5. Post incident review

## Maintenance

### Weekly
- Run `npm audit` to check dependencies
- Review error logs in Sentry
- Check application performance

### Monthly
- Update dependencies: `npm update`
- Review and optimize slow pages
- Cleanup old test data

### Quarterly
- Security audit
- Performance profiling
- Architecture review

## Support

For issues:
1. Check this guide's troubleshooting section
2. Review GitHub Issues
3. Contact the team

## Related Documentation

- [Component API Reference](./COMPONENT_API.md)
- [Integration Patterns](./INTEGRATION_PATTERNS.md)
- [Workflow Examples](./WORKFLOW_EXAMPLES.md)
- [Phase 1 Design Tokens](../design-system/phase1-design-tokens.ts)
- [Phase 2 Entity Manager](../knowledge-base/EntityManager.ts)
- [Phase 5 Collaboration](../collaboration/phase5-collaboration-hooks.ts)

