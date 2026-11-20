import { vi } from 'vitest';
/**
 * Custom Hooks Tests
 * Phase I Day 4: Custom Hooks Library
 */

import { renderHook, act } from '@testing-library/react';
import { useFetch } from '../data/useFetch';
import { useAsync } from '../data/useAsync';
import { usePagination } from '../data/usePagination';
import { useLocalStorage } from '../data/useLocalStorage';
import { useForm } from '../forms/useForm';
import { useModal } from '../ui/useModal';
import { useToast } from '../ui/useToast';
import { usePrevious } from '../utils/usePrevious';

describe('Custom Hooks Library', () => {
  describe('Data Hooks', () => {
    test('useFetch manages loading state', () => {
      const { result } = renderHook(() => useFetch('/api/data', { skip: true }));
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
    });

    test('useAsync manages async operations', async () => {
      const asyncFn = vi.fn().mockResolvedValue({ data: 'test' });
      const { result } = renderHook(() => useAsync(asyncFn, false));

      expect(result.current.status).toBe('idle');
    });

    test('usePagination calculates pages correctly', () => {
      const { result } = renderHook(() => usePagination(100, 10));

      expect(result.current.totalPages).toBe(10);
      expect(result.current.page).toBe(1);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);
    });

    test('useLocalStorage manages state', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      const [value] = result.current;
      expect(value).toBe('initial');
    });
  });

  describe('Form Hooks', () => {
    test('useForm initializes with values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.values).toEqual({ email: '' });
      expect(result.current.isValid).toBe(true);
    });

    test('useForm updates field values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.setFieldValue('name', 'John');
      });

      expect(result.current.values.name).toBe('John');
    });
  });

  describe('UI Hooks', () => {
    test('useModal toggles visibility', () => {
      const { result } = renderHook(() => useModal(false));
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    test('useToast adds toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test', 'info', 0);
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('Utility Hooks', () => {
    test('usePrevious tracks previous value', () => {
      const { result, rerender } = renderHook(
        ({ value }) => usePrevious(value),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBeUndefined();

      rerender({ value: 'updated' });

      expect(result.current).toBe('initial');
    });
  });
});
