/**
 * Hooks Export Index
 * Phase I Day 4: Custom Hooks Library
 * 
 * All reusable React hooks in one place
 */

// Data Hooks
export { useFetch } from './data/useFetch';
export { useAsync } from './data/useAsync';
export { usePagination } from './data/usePagination';
export { useLocalStorage } from './data/useLocalStorage';

// Form Hooks
export { useForm } from './forms/useForm';

// UI Hooks
export { useModal } from './ui/useModal';
export { useToast } from './ui/useToast';

// Utility Hooks
export { useDebounce } from './utils/useDebounce';
export { useThrottle } from './utils/useThrottle';
export { useWindowResize } from './utils/useWindowResize';
export { usePrevious } from './utils/usePrevious';

// Theme & Accessibility (from other phases)
export { useTheme } from '../providers/ThemeProvider';
export { useTranslation } from './useTranslation';
export { useAccessibility } from './useAccessibility';

export * from './data/index';
export * from './forms/index';
export * from './ui/index';
export * from './utils/index';
