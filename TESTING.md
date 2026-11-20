# Testing & Storybook Infrastructure

Complete quality assurance infrastructure for maataa-ui components with unit tests, integration tests, and visual documentation.

## Overview

**Testing Stack:**
- **Framework:** Vitest (fast unit testing)
- **DOM Testing:** @testing-library/react
- **User Interactions:** @testing-library/user-event
- **Matchers:** @testing-library/jest-dom
- **Coverage:** @vitest/coverage-v8

**Documentation Stack:**
- **Visual Catalog:** Storybook 10.9.9
- **Addon Essentials:** Stories, Docs, Controls, Interactions
- **Autodocs:** Automatic component documentation
- **Responsive Preview:** Test on mobile, tablet, desktop

## Running Tests

### Unit Tests
```bash
npm test                    # Run all tests
npm run test:ui            # Interactive UI mode
npm run test:coverage      # With coverage report
npm test -- --watch       # Watch mode
npm test -- Button.test   # Specific file
```

### Storybook
```bash
npm run storybook         # Start dev server (port 6006)
npm run storybook:build   # Create static build
```

## File Structure

```
src/components/
├── buttons/
│   ├── Button.tsx
│   ├── Button.test.tsx           # Unit tests
│   └── Button.stories.tsx        # Visual stories
├── forms/
│   ├── FormInput.tsx
│   ├── FormInput.test.tsx
│   └── FormInput.stories.tsx
├── layout/
│   ├── Card.tsx
│   ├── Card.test.tsx
│   └── Card.stories.tsx
└── collaboration/
    ├── TypingIndicator.tsx
    ├── TypingIndicator.test.tsx
    └── TypingIndicator.stories.tsx

tests/
├── setup.ts                       # Vitest global setup
├── integration/
│   └── workflows/
│       └── budgets.integration.test.ts

.storybook/
├── main.ts                        # Storybook config
└── preview.ts                     # Global decorators
```

## Unit Tests Pattern

### Test Structure
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Component>Content</Component>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle clicks', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Component onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      render(<Component />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
```

### Test Categories

#### 1. Rendering Tests
- Component renders with props
- All variants display correctly
- Props are reflected in DOM
- Default values work

#### 2. State Tests
- Disabled/enabled states
- Error/success states
- Loading/empty states
- Visual feedback

#### 3. Interaction Tests
- Click handlers work
- Input changes tracked
- Focus/blur events fire
- Keyboard navigation works

#### 4. Accessibility Tests
- ARIA attributes present
- Semantic HTML used
- Keyboard accessible
- Screen reader compatible

#### 5. Props & Attributes Tests
- Accept custom className
- Accept custom style
- Support HTML attributes
- Handle edge cases

## Storybook Stories Pattern

### Story Structure
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta = {
  title: 'Components/Category/Name',
  component: Component,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Short description of component',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    prop: {
      control: 'text',
      description: 'What this prop does',
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    prop: 'value',
  },
};

export const Variant: Story = {
  args: {
    variant: 'special',
  },
};

export const Interactive: Story = {
  render: () => (
    // Custom render with logic
  ),
};
```

### Story Categories

#### 1. Single Variant Stories
- Each variant gets its own story
- Primary, Secondary, Outline, Destructive, Ghost
- Small, Medium, Large sizes
- Enabled, Disabled states

#### 2. Combined Stories
- AllVariants: Show all options in one view
- AllSizes: Compare sizes side-by-side
- AllStates: Show all state combinations

#### 3. Context Stories
- InForm: Component within a form
- InLayout: Component in page context
- WithOtherComponents: Component interactions

#### 4. Interactive Stories
- Live examples with state
- Form submission examples
- Animation demonstrations

## Coverage Goals

### Component Coverage: >80%
- Lines: >80% executed
- Branches: >80% covered
- Functions: >80% covered
- Statements: >80% covered

### Test Distribution
- Unit tests: 70% (component behavior)
- Integration tests: 20% (workflow interactions)
- E2E tests: 10% (user journeys)

## Component Testing Checklist

For each new component, create:

- [ ] Component.tsx - Implementation
- [ ] Component.test.tsx - Unit tests (5+ test suites, 20+ tests)
- [ ] Component.stories.tsx - 5+ stories showing variants
- [ ] JSDoc comments - Type documentation
- [ ] Error handling - Invalid props, edge cases
- [ ] Accessibility - ARIA, keyboard, semantic HTML
- [ ] Props validation - TypeScript types, required fields
- [ ] Integration - Works with other components

## Workflow Integration Tests

### Budget Workflow Tests
- BudgetList: Fetch, filter, navigate
- BudgetForm: Validation, calculation, submission
- BudgetDetail: Display, edit, delete
- Real-time: Typing, presence, activity
- Phase 2: Entity CRUD operations
- Phase 1: Token usage

### Team Workflow Tests
- TeamList: Display, search, create
- TeamForm: Validation, member selection
- TeamDetail: Display, relationships
- Collaboration: Presence, activity
- Phase 2: Entity management

### Project Workflow Tests
- ProjectList: Display, sorting
- ProjectForm: Validation, fields
- ProjectDetail: Tabs, relationships
- Collaboration: Typing, cursors
- Phase 2 & 5 integration

## Best Practices

### Testing
1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state
   - Use semantic queries (getByRole)

2. **Write Descriptive Tests**
   - Use clear test names
   - Organize with describe blocks
   - Add comments for complex logic

3. **Keep Tests DRY**
   - Extract common setup
   - Use helper functions
   - Share fixtures

4. **Test Accessibility**
   - Use getByRole queries
   - Test keyboard navigation
   - Verify ARIA attributes

### Storybook
1. **Organize Hierarchically**
   - Components/Category/Name
   - Clear nesting structure
   - Logical grouping

2. **Use Controls**
   - Props show up as controls
   - Users can interact with stories
   - Live documentation

3. **Show Context**
   - Render components in realistic context
   - Show common patterns
   - Demonstrate integrations

4. **Document Everything**
   - Write descriptions
   - Add code examples
   - Explain use cases

## Continuous Integration

### Pre-commit Checks
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test              # Vitest
```

### Pre-push Checks
```bash
npm run build         # Full build
npm run test:coverage # Coverage report
npm run storybook:build  # Storybook build
```

## Coverage Report

Generate HTML coverage report:
```bash
npm run test:coverage
# View: coverage/index.html
```

## Troubleshooting

### Tests Timeout
- Reduce test size
- Split into smaller suites
- Check for infinite loops
- Increase timeout: `vi.setConfig({ testTimeout: 10000 })`

### Storybook Build Fails
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Check for circular imports
- Verify story syntax

### Type Errors in Stories
- Import Meta, StoryObj from @storybook/react
- Use `satisfies Meta<typeof Component>`
- Export default meta
- Export Story type

### React Testing Library Issues
- Ensure component renders without errors
- Use screen queries (getByRole, getByText)
- Check async operations with waitFor
- Use userEvent for realistic interactions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Storybook Documentation](https://storybook.js.org/)
- [@testing-library/jest-dom](https://testing-library.com/jest-dom)
- [Best Practices Guide](https://testing-library.com/best-practices)

## Next Steps

1. Add tests for remaining components
2. Increase coverage to >85%
3. Set up CI/CD integration
4. Add visual regression tests
5. Create component usage guide
6. Set up design token showcase in Storybook
7. Add accessibility audit stories
8. Document collaboration features
