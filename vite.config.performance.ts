import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core dependencies
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'styled-components'
          ],
          
          // Form & validation
          'forms': [
            'react-hook-form',
            'zod'
          ],

          // Budget workflow chunk
          'budget': [
            './src/components/budget/BudgetCategories.tsx',
            './src/components/budget/BudgetForecast.tsx',
            './src/components/budget/BudgetAlerts.tsx'
          ],

          // Team workflow chunk
          'team': [
            './src/components/team/TeamRoles.tsx',
            './src/components/team/TeamPermissions.tsx',
            './src/components/team/MemberApproval.tsx'
          ],

          // Project workflow chunk
          'project': [
            './src/components/project/ProjectDependencies.tsx',
            './src/components/project/ProjectTimeline.tsx',
            './src/components/project/GanttChart.tsx'
          ],

          // Schedule workflow chunk
          'schedule': [
            './src/components/schedule/ScheduleList.tsx',
            './src/components/schedule/ConflictDetection.tsx',
            './src/components/schedule/ScheduleForm.tsx',
            './src/components/schedule/ResourceAvailability.tsx'
          ],

          // E-commerce workflow chunk
          'ecommerce': [
            './src/components/ecommerce/ProductCatalog.tsx',
            './src/components/ecommerce/ShoppingCart.tsx',
            './src/components/ecommerce/CheckoutFlow.tsx',
            './src/components/ecommerce/OrderHistory.tsx'
          ],

          // Analytics workflow chunk
          'analytics': [
            './src/components/analytics/MetricsOverview.tsx',
            './src/components/analytics/ChartWidget.tsx',
            './src/components/analytics/DateRangeFilter.tsx'
          ],

          // Admin workflow chunk
          'admin': [
            './src/components/admin/SystemSettings.tsx',
            './src/components/admin/AuditLog.tsx'
          ],

          // Reporting workflow chunk
          'reporting': [
            './src/components/reporting/ReportBuilder.tsx',
            './src/components/reporting/ScheduledReports.tsx'
          ]
        }
      }
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false,
    reportCompressedSize: true
  }
});
