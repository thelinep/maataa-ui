/**
 * Production-analysis build: `npx vite build --config vite.config.performance.mts`
 *
 * Extends the base config with Rolldown code-splitting groups for the heavy
 * vendor libraries and strips console/debugger calls. Route-level splitting is
 * already handled by React.lazy() in src/app/routes.tsx, so workflow pages land
 * in their own chunks automatically.
 */
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      sourcemap: false,
      reportCompressedSize: true,
      rolldownOptions: {
        output: {
          minify: { compress: { dropConsole: true, dropDebugger: true } },
          codeSplitting: {
            groups: [
              { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
              { name: 'vendor-router', test: /node_modules[\\/]react-router[\\/]/, priority: 20 },
              { name: 'vendor-styles', test: /node_modules[\\/](styled-components|@emotion)[\\/]/, priority: 20 },
              { name: 'vendor-forms', test: /node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/, priority: 20 },
              { name: 'vendor-i18n', test: /node_modules[\\/](i18next|react-i18next)[\\/]/, priority: 20 },
              { name: 'vendor-maataa', test: /node_modules[\\/]@maataa[\\/]/, priority: 10 },
            ],
          },
        },
      },
    },
  }),
);
