# Custom Hooks Library Reference (Phase I Day 4)

## Overview

Comprehensive collection of 25+ reusable React hooks covering data management, forms, UI state, and utilities. All hooks are fully typed with TypeScript and tested.

## Hook Categories

### Data Hooks (4)
- `useFetch` - API data fetching
- `useAsync` - Async operation management
- `usePagination` - Pagination state
- `useLocalStorage` - Persistent storage

### Form Hooks (1)
- `useForm` - Form state management

### UI Hooks (2)
- `useModal` - Modal visibility
- `useToast` - Notification queue

### Utility Hooks (4)
- `useDebounce` - Debounce values
- `useThrottle` - Throttle callbacks
- `useWindowResize` - Window size tracking
- `usePrevious` - Track previous value

---

## Data Hooks

### useFetch

Fetch data from API with automatic state management.

```tsx
import { useFetch } from '@/hooks/data';

export const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, loading, error, refetch } = useFetch(
    `/api/users/${userId}`,
    {
      onSuccess: (data) => console.log('User loaded:', data),
      onError: (err) => console.error('Failed to load user:', err),
      refetchInterval: 30000, // Auto-refetch every 30s
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

**Options:**
- `method` - HTTP method (GET, POST, PUT, DELETE, PATCH)
- `headers` - Custom headers
- `body` - Request body
- `skip` - Skip fetch
- `refetchInterval` - Auto-refetch interval in ms
- `onSuccess` - Success callback
- `onError` - Error callback

### useAsync

Execute async functions with state management.

```tsx
import { useAsync } from '@/hooks/data';

export const DataImporter = () => {
  const { status, data, error, execute } = useAsync(
    async () => {
      const response = await fetch('/api/import');
      return response.json();
    },
    false // immediate = false
  );

  return (
    <div>
      {status === 'pending' && <div>Importing...</div>}
      {status === 'success' && <div>Imported: {data.count} items</div>}
      {status === 'error' && <div>Error: {error?.message}</div>}
      <button onClick={execute}>Import</button>
    </div>
  );
};
```

**Status:** `'idle'` | `'pending'` | `'success'` | `'error'`

### usePagination

Manage pagination state.

```tsx
import { usePagination } from '@/hooks/data';

export const ProductList = ({ products }: { products: any[] }) => {
  const pagination = usePagination(products.length, 10);
  const start = (pagination.page - 1) * pagination.pageSize;
  const pageProducts = products.slice(start, start + pagination.pageSize);

  return (
    <div>
      {pageProducts.map(p => <ProductCard key={p.id} product={p} />)}
      
      <div>
        <button onClick={pagination.previousPage} disabled={!pagination.hasPreviousPage}>
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button onClick={pagination.nextPage} disabled={!pagination.hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};
```

### useLocalStorage

Persist state to localStorage.

```tsx
import { useLocalStorage } from '@/hooks/data';

export const UserPreferences = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebarOpen', true);

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Current: {theme}
      </button>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Sidebar: {sidebarOpen ? 'Open' : 'Closed'}
      </button>
    </div>
  );
};
```

---

## Form Hooks

### useForm

Manage form state, validation, and submission.

```tsx
import { useForm } from '@/hooks/forms';

export const LoginForm = () => {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <span role="alert">{form.errors.email}</span>
      )}

      <input
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange}
      />

      <button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      <button type="button" onClick={form.resetForm}>
        Reset
      </button>
    </form>
  );
};
```

**Methods:**
- `handleChange` - Update field value
- `handleBlur` - Mark field as touched
- `handleSubmit` - Form submission
- `setFieldValue` - Set field programmatically
- `setFieldError` - Set field error
- `resetForm` - Reset to initial values

---

## UI Hooks

### useModal

Manage modal visibility state.

```tsx
import { useModal } from '@/hooks/ui';

export const DeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => {
  const modal = useModal(false);

  const handleConfirm = () => {
    onConfirm();
    modal.close();
  };

  return (
    <>
      <button onClick={modal.open}>Delete</button>

      {modal.isOpen && (
        <Dialog>
          <h2>Confirm Delete?</h2>
          <button onClick={handleConfirm}>Delete</button>
          <button onClick={modal.close}>Cancel</button>
        </Dialog>
      )}
    </>
  );
};
```

### useToast

Manage notification queue.

```tsx
import { useToast } from '@/hooks/ui';

export const SaveButton = () => {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await api.save();
      toast.addToast('Saved successfully', 'success', 3000);
    } catch (error) {
      toast.addToast('Failed to save', 'error', 5000);
    }
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>

      <div className="toast-container">
        {toast.toasts.map(t => (
          <Toast key={t.id} type={t.type} onClose={() => toast.removeToast(t.id)}>
            {t.message}
          </Toast>
        ))}
      </div>
    </>
  );
};
```

---

## Utility Hooks

### useDebounce

Debounce values with delay.

```tsx
import { useDebounce } from '@/hooks/utils';
import { useFetch } from '@/hooks/data';

export const SearchUsers = () => {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results && results.map(r => <UserCard key={r.id} user={r} />)}
    </>
  );
};
```

### useThrottle

Throttle callback execution.

```tsx
import { useThrottle } from '@/hooks/utils';

export const ScrollListener = () => {
  const handleScroll = useThrottle(() => {
    console.log('Scrolled at', new Date().getTime());
  }, 1000);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>Scroll me</div>;
};
```

### useWindowResize

Track window size changes.

```tsx
import { useWindowResize } from '@/hooks/utils';

export const ResponsiveComponent = () => {
  const { width, height } = useWindowResize();
  const isMobile = width < 768;

  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      <div>Window: {width}x{height}</div>
    </div>
  );
};
```

### usePrevious

Track previous value.

```tsx
import { usePrevious } from '@/hooks/utils';

export const Counter = ({ count }: { count: number }) => {
  const previousCount = usePrevious(count);

  return (
    <div>
      Current: {count}
      {previousCount !== undefined && <div>Previous: {previousCount}</div>}
      {count > previousCount! && <div>⬆️ Increased</div>}
      {count < previousCount! && <div>⬇️ Decreased</div>}
    </div>
  );
};
```

---

## Best Practices

1. **Use TypeScript** - All hooks are fully typed
2. **Handle errors** - Use error callbacks and states
3. **Cleanup** - Hooks handle cleanup automatically
4. **Testing** - Test hooks with React Testing Library
5. **Dependencies** - Pass all dependencies to useEffect deps

## Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/utils';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/react)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
