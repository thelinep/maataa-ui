/**
 * Playwright Configuration for Phase 3 Video Testing
 * Includes video recording, screenshot capture, and accessibility audits
 *
 * Video Recording:
 * - Records all tests to test-results/videos/
 * - Can be enabled via --record-video flag or in config
 * - Videos are 1280x720 for clarity and performance
 * - Only saves failed test videos by default (can be changed to 'on')
 *
 * Screenshots:
 * - Captures on failure
 * - Useful for debugging video playback issues
 *
 * Trace Recording:
 * - Records trace on failure for detailed debugging
 * - Can replay trace in Playwright Inspector
 *
 * Usage:
 * npx playwright test                                    # Run all tests
 * npx playwright test phase3-video-tests.spec.ts        # Run video tests
 * npx playwright test --record-video=on                 # Record all videos
 * npx playwright test --record-video=retain-on-failure  # Record only failures
 * npx playwright show-report                             # View test report
 * npx playwright show-trace test-results/trace.zip       # View trace
 */

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.spec.ts',

  // ========================================================================
  // TIMEOUT SETTINGS
  // ========================================================================

  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for expect() calls
  },

  // ========================================================================
  // REPORTER CONFIGURATION
  // ========================================================================

  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'], // Console output
  ],

  // ========================================================================
  // PROJECTS (BROWSERS)
  // ========================================================================

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Video recording configuration
        recordVideo: {
          dir: 'test-results/videos/chromium',
          size: { width: 1280, height: 720 },
        },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        recordVideo: {
          dir: 'test-results/videos/firefox',
          size: { width: 1280, height: 720 },
        },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        recordVideo: {
          dir: 'test-results/videos/webkit',
          size: { width: 1280, height: 720 },
        },
      },
    },

    // Mobile testing with video recording
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        recordVideo: {
          dir: 'test-results/videos/mobile-chrome',
          size: { width: 393, height: 851 },
        },
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        recordVideo: {
          dir: 'test-results/videos/mobile-safari',
          size: { width: 390, height: 844 },
        },
      },
    },

    // Tablet testing
    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
        recordVideo: {
          dir: 'test-results/videos/tablet',
          size: { width: 1024, height: 1366 },
        },
      },
    },
  ],

  // ========================================================================
  // WEB SERVER CONFIGURATION
  // ========================================================================

  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Wait up to 2 minutes for server to start
  },

  // ========================================================================
  // USE OPTIONS (GLOBAL SETTINGS)
  // ========================================================================

  use: {
    baseURL,

    // Video recording: 'on' | 'off' | 'retain-on-failure'
    recordVideo: 'retain-on-failure', // Only save failed test videos

    // Screenshot capture on failure
    screenshot: 'only-on-failure',
    screenshotDir: 'test-results/screenshots',

    // Trace recording for debugging
    trace: 'retain-on-failure', // Can be 'on' or 'off'
    traceDir: 'test-results/traces',

    // Navigation timeout
    navigationTimeout: 30000,

    // Action timeout (click, fill, etc.)
    actionTimeout: 10000,
  },

  // ========================================================================
  // PARALLEL EXECUTION
  // ========================================================================

  workers: process.env.CI ? 1 : undefined, // Single worker in CI, auto in local

  // ========================================================================
  // RETRY CONFIGURATION
  // ========================================================================

  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI

  // ========================================================================
  // OUTPUT FOLDER
  // ========================================================================

  outputDir: 'test-results',
});
