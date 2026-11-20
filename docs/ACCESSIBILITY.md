# Advanced Accessibility Guide (Phase I Day 3)

## Overview

Comprehensive WCAG 2.1 AAA compliance implementation for maataa-ui components. This guide covers accessibility utilities, components, testing, and best practices.

## WCAG 2.1 Levels

- **Level A** - Basic accessibility (minimum)
- **Level AA** - Enhanced accessibility (recommended)
- **Level AAA** - Superior accessibility (excellence) ← **Target**

maataa-ui targets **WCAG 2.1 AAA** for all components.

## Features

✅ **Keyboard Navigation** - Full keyboard accessibility
✅ **Screen Reader Support** - ARIA labels and live regions
✅ **Focus Management** - Focus trap and restoration
✅ **Color Contrast** - 7:1 ratio for AAA compliance
✅ **Semantic HTML** - Proper role hierarchy
✅ **Accessible Names** - All interactive elements labeled
✅ **Skip Links** - Quick navigation shortcuts
✅ **Testing Tools** - Runtime accessibility checker

## Quick Start

### 1. Add Skip Links to App Shell

```tsx
import { SkipLinks } from '@/components/accessibility';
import { AppShell } from '@/layout';

export default function App() {
  return (
    <>
      <SkipLinks />
      <AppShell>
        <main id="main-content">
          {/* Content */}
        </main>
      </AppShell>
    </>
  );
}
```

### 2. Use Keyboard Navigation in Modals

```tsx
import { FocusTrap } from '@/components/accessibility';

export const Modal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <FocusTrap onEscape={onClose} trapFocus>
      <dialog>
        {/* Modal content */}
      </dialog>
    </FocusTrap>
  );
};
```

### 3. Announce Dynamic Changes

```tsx
import { LiveRegion } from '@/components/accessibility';
import { useTranslation } from '@/hooks/useTranslation';

export const Form = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <LiveRegion
        message={loading ? t('common.loading') : ''}
        priority="polite"
      />
      <form onSubmit={async () => {
        setLoading(true);
        // ... submit
      }}>
        {/* Form fields */}
      </form>
    </>
  );
};
```

## Accessibility Utilities

### generateId

Create unique IDs for aria-labelledby relationships:

```tsx
import { generateId } from '@/utils/accessibility';

const labelId = generateId('label');
const errorId = generateId('error');

<label id={labelId}>Email</label>
<input aria-labelledby={labelId} aria-describedby={errorId} />
<span id={errorId} role="alert">Invalid email</span>
```

### createAriaLabel

Build semantic aria labels:

```tsx
import { createAriaLabel } from '@/utils/accessibility';

const label = createAriaLabel('Save', 'unsaved changes');
// "Save (unsaved changes)"

<button aria-label={label}>Save</button>
```

### Color Contrast

Check WCAG compliance:

```tsx
import { meetsWCAG_AA, meetsWCAG_AAA } from '@/utils/accessibility';

// Valid for AA (4.5:1)
meetsWCAG_AA('#000000', '#FFFFFF') // true

// Valid for AAA (7:1)
meetsWCAG_AAA('#000000', '#FFFFFF') // true
```

### Keyboard Accessibility

```tsx
import { isKeyboardAccessible, getFocusableElements } from '@/utils/accessibility';

// Check if element is keyboard accessible
isKeyboardAccessible(button) // true for <button>

// Get all focusable elements in container
const focusable = getFocusableElements(form);
```

## Accessibility Components

### SkipLinks

Allow users to skip to main content:

```tsx
import { SkipLinks } from '@/components/accessibility';

<SkipLinks links={[
  { id: 'main-content', label: 'Skip to main content' },
  { id: 'navigation', label: 'Skip to navigation' },
]} />
```

**Keyboard:** Press Tab to reveal, Enter to activate

### FocusTrap

Trap focus in modals and dialogs:

```tsx
import { FocusTrap } from '@/components/accessibility';

<FocusTrap
  onEscape={() => closeModal()}
  initialFocus={submitButtonRef}
  trapFocus
>
  <dialog>
    {/* Modal content */}
  </dialog>
</FocusTrap>
```

**Features:**
- Traps Tab/Shift+Tab within container
- Restores focus on unmount
- Calls onEscape when Escape pressed

### LiveRegion

Announce dynamic changes to screen readers:

```tsx
import { LiveRegion } from '@/components/accessibility';

<LiveRegion
  message={error ? `Error: ${error.message}` : ''}
  priority="assertive"
  atomic
>
  {/* Content */}
</LiveRegion>
```

**Priority Levels:**
- `polite` - Wait for screen reader to finish current speech
- `assertive` - Interrupt current speech (use sparingly)

### AccessibilityChecker

Runtime accessibility auditing (dev mode):

```tsx
import { AccessibilityChecker } from '@/components/accessibility';

export default function App() {
  return (
    <>
      <AccessibilityChecker enabled={process.env.NODE_ENV === 'development'} />
      {/* App content */}
    </>
  );
}
```

Shows:
- Missing accessible names
- Poor color contrast
- Non-keyboard-accessible elements

## Hooks

### useFocusManagement

Manage focus in components:

```tsx
import { useFocusManagement } from '@/hooks/useAccessibility';

const MyModal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusFirst, focusLast, previousFocusRef } = useFocusManagement(containerRef);

  useEffect(() => {
    focusFirst(); // Focus first element
  }, []);

  return <div ref={containerRef}>{/* ... */}</div>;
};
```

### useKeyboardNavigation

Handle keyboard events:

```tsx
import { useKeyboardNavigation } from '@/hooks/useAccessibility';

const MyComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation(containerRef, {
    onEscape: () => handleClose(),
    onEnter: () => handleSubmit(),
    trapFocus: true,
  });

  return <div ref={containerRef}>{/* ... */}</div>;
};
```

### useAriaAnnouncements

Announce messages to screen readers:

```tsx
import { useAriaAnnouncements } from '@/hooks/useAccessibility';

const MyForm = () => {
  const { announceSuccess, announceError, announce } = useAriaAnnouncements();

  const handleSubmit = async () => {
    try {
      await api.submit();
      announceSuccess('Form submitted successfully');
    } catch (error) {
      announceError(error.message);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
};
```

### useAccessibility

Combined hook for all accessibility features:

```tsx
import { useAccessibility } from '@/hooks/useAccessibility';

const Modal = ({ onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { focusFirst, announce, generateAriaLabel } = useAccessibility(ref, {
    onEscape: onClose,
    trapFocus: true,
  });

  return (
    <div ref={ref}>
      {/* Modal content */}
    </div>
  );
};
```

## ARIA Attributes Reference

### Essential Attributes

```tsx
// Label elements
aria-label="Description"           // Direct label
aria-labelledby="label-id"         // Link to label element
aria-describedby="desc-id"         // Link to description element

// Live regions
aria-live="polite|assertive"       // Announcement priority
aria-atomic="true|false"           // Announce whole region
aria-relevant="additions text"     // What changes to announce

// Interactive elements
role="button|link|checkbox"        // Define element role
aria-pressed="true|false"          // Toggle state
aria-expanded="true|false"         // Expansion state
aria-selected="true|false"         // Selection state

// Forms
aria-required="true"               // Required field
aria-invalid="true|false"          // Validation state
aria-disabled="true|false"         // Disabled state
```

## Keyboard Navigation Patterns

### Modal/Dialog

```
Escape     - Close modal
Tab        - Navigate forward (trapped)
Shift+Tab  - Navigate backward (trapped)
Enter      - Activate focused button
Space      - Activate button/toggle
```

### Menu

```
ArrowDown  - Next menu item
ArrowUp    - Previous menu item
ArrowRight - Open submenu
ArrowLeft  - Close submenu
Enter      - Activate item
Space      - Activate item
Escape     - Close menu
```

### Tab Panel

```
ArrowRight - Next tab
ArrowLeft  - Previous tab
Home       - First tab
End        - Last tab
```

## Testing Accessibility

### Manual Testing Checklist

- [ ] Tab through entire page - all interactive elements reachable
- [ ] Escape closes modals/dialogs
- [ ] Focus order follows logical flow
- [ ] Skip links work
- [ ] Buttons have accessible names
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] Color contrast 7:1 (AAA)
- [ ] No text solely relies on color
- [ ] All images have alt text

### Automated Testing

```tsx
test('button has accessible name', () => {
  const { container } = render(<button>Save</button>);
  const button = container.querySelector('button');
  expect(hasAccessibleName(button!)).toBe(true);
});

test('color contrast meets AAA', () => {
  expect(meetsWCAG_AAA('#000000', '#FFFFFF')).toBe(true);
});

test('modal traps focus', () => {
  render(
    <FocusTrap>
      <button>Button 1</button>
      <button>Button 2</button>
    </FocusTrap>
  );
  // Focus should cycle through buttons only
});
```

### Screen Reader Testing

**NVDA (Windows)**
```
Download: https://www.nvaccess.org/
Keyboard: Insert + N opens menu
Insert + R toggles focus mode
```

**JAWS (Windows)**
```
Commercial: https://www.freedomscientific.com/products/software/jaws/
Insert + H opens help
Insert + R toggles forms mode
```

**VoiceOver (macOS/iOS)**
```
Built-in: Cmd + F5
VO key (Caps Lock or Ctrl + Option)
VO + Space toggles rotor
```

## Best Practices

### 1. Semantic HTML First

```tsx
// ✅ Good
<button onClick={handleClick}>Save</button>
<a href="/page">Link</a>
<form>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</form>

// ❌ Avoid
<div onClick={handleClick} role="button">Save</div>
<div onClick={() => navigate('/page')} role="link">Link</div>
<div>
  <span>Email</span>
  <div><!--input--></div>
</div>
```

### 2. Always Provide Accessible Names

```tsx
// ✅ Good
<button aria-label="Close dialog">×</button>
<img alt="Product image" src="product.jpg" />
<button>Save Changes</button>

// ❌ Avoid
<button>×</button>
<img src="product.jpg" />
<button aria-label="btn1">+</button>
```

### 3. Use Proper Color Contrast

```tsx
// ✅ Good
const Box = styled.div`
  color: var(--color-text-primary);        // High contrast
  background: var(--color-surface-background);
`;

// ❌ Avoid
const Box = styled.div`
  color: #CCCCCC;                          // Low contrast
  background: #FFFFFF;
`;
```

### 4. Handle Focus Properly

```tsx
// ✅ Good
const handleClose = () => {
  setOpen(false);
  previousFocusRef.current?.focus();       // Restore focus
};

// ❌ Avoid
const handleClose = () => {
  setOpen(false);
  // Focus lost!
};
```

### 5. Announce Important Changes

```tsx
// ✅ Good
<LiveRegion
  message={saveSuccess ? 'Saved successfully' : ''}
  priority="polite"
/>

// ❌ Avoid
{saveSuccess && <span>Saved successfully</span>}  // Not announced
```

## Common Mistakes to Avoid

1. **Missing alt text on images**
2. **Color as only indicator** - Use text, icons, or patterns too
3. **Keyboard traps** - Can't escape with Escape or Tab
4. **Missing focus indicators** - `outline: none` without replacement
5. **Unlabeled form inputs** - No associated `<label>` element
6. **Div as button** - Use semantic `<button>` element
7. **Auto-playing media** - Let user control audio/video
8. **Flashing content** - Avoid 3+ flashes per second
9. **Poor heading hierarchy** - Don't skip from h1 to h3
10. **Outdated ARIA** - Use semantic HTML when possible

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project](https://www.a11yproject.com/)

## Compliance Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (outline or custom)
- [ ] Focus order logical and intuitive
- [ ] Skip links present and functional
- [ ] Color contrast 7:1 or better (AAA)
- [ ] No content solely by color
- [ ] Form labels associated with inputs
- [ ] Error messages clear and announced
- [ ] Dynamic content announced to screen readers
- [ ] Alt text on all meaningful images
- [ ] No keyboard traps
- [ ] Page structure with semantic headings
- [ ] Modals trap focus
- [ ] All text resizable to 200%
- [ ] Motion/animation can be disabled
