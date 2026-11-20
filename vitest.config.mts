/**
 * Vitest Configuration
 * Unit and integration testing setup for maataa-ui components
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    // fused-organism/ is a separate workspace with its own deps and test runner
    exclude: ['**/node_modules/**', '**/dist/**', 'fused-organism/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.stories.tsx',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
