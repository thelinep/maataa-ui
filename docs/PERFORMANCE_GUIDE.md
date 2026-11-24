# maataa-ui performance guide

How the root maataa-ui app keeps its first load small, catches page crashes, and measures real users. Everything here exists in the repo; what doesn't yet is listed at the end.

Measured on 24 Nov 2026 (branch `fix/perf-gaps-and-guide` from master 48dfaa5, Vite 8.3.8). Sizes are gzip.

## What a first visit downloads

| Build | Files at first load | Size (gzip) |
|---|---|---|
| `npm run build` (normal) | 6 | about 205 kB |
| `npm run build:analyze` (vendor groups) | 13 | about 225 kB |

Each workflow page is then fetched on demand as a chunk of about 1–3.5 kB (for example `ConceptList` 2.0 kB, `BudgetDetail` 2.2 kB, `ScriptEditor` 2.2 kB).

**Finding:** the vendor groups in `vite.config.performance.mts` make the first load about 20 kB *larger*. The forms (`react-hook-form`, `zod`, 38 kB) and i18n (15.5 kB) chunks are preloaded on every first visit, even though the start page needs neither. The groups help long-term caching, because vendor code changes rarely. But until the forms and i18n code is only imported by the pages that use it, the normal build is the faster first load.

## Route-level code splitting

- `src/config/lazyLoad.tsx` wraps about 20 pages in `React.lazy()`: Concepts, Scripts, Storyboards, Filming, Screenings, Editing, Colour grading, Sound and Projects.
- `src/app/routes.tsx` imports them, and lazy-loads `AccessibilityGuide` directly.
- `src/app/AppLayout.tsx` shows `LoadingState` (from `src/pages/shared/AsyncState.tsx`) in a `<Suspense>` while a page's chunk loads, both in the main area and in `WorkflowTabs`.

To make a new page lazy, export it from `lazyLoad.tsx` and use that export in `routes.tsx`.

## Page crashes

`src/app/RouteErrorBoundary.tsx` wraps every routed page, using `@maataa/ui`'s `ErrorBoundary`:

- If a page throws while rendering, or its lazy chunk fails to download (for example offline), only that page is replaced. The message says "This page couldn't be shown. The rest of the page still works. Your saved data is safe.", and offers **Try again**. The sidebar and the rest of the app keep working.
- The boundary resets when the route changes, so moving to another page clears the error.
- Each crash is pushed to `window.__analyticsQueue` as `{ event: "render_error", message, path }` when the app defines that queue.

Inside `WorkflowTabs`, the message names the workflow (its tab bar label) instead of "This page".

## Measuring real users: Core Web Vitals

`src/main.tsx` calls `trackWebVitals()` before the app renders. It collects, for the current page view:

| Metric | Meaning | Good | Needs work |
|---|---|---|---|
| `lcp` | Largest Contentful Paint, ms | ≤ 2,500 | > 4,000 |
| `inp` | Interaction to Next Paint (slowest interaction), ms | ≤ 200 | > 500 |
| `cls` | Cumulative Layout Shift (largest session window) | ≤ 0.1 | > 0.25 |
| `ttfb` | Time to First Byte, ms | ≤ 800 | > 1,800 |

Values that happened before tracking started are included (buffered observers). Interaction to Next Paint replaces First Input Delay, which browsers no longer report as a Core Web Vital.

When the page is hidden (tab switch, close, navigation away), it reports once:

- to `onReport`, if you pass one: `trackWebVitals({ onReport: (v) => sendToServer(v) })`;
- to `window.__analyticsQueue`, as `{ event: "web_vitals", lcp, cls, inp, ttfb }`, if the app defines that queue.

`getWebVitals()` returns the values collected so far, which is useful in the browser console. `trackWebVitals({ debug: true })` also prints them with `console.info`. The performance build strips `console` calls, so don't rely on the console there.

The older `performanceMonitor.measure()` / `measureAsync()` helpers in the same file still time any block of code with `performance.mark`.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Type-check and build, as deployed |
| `npm run build:analyze` | The same with `vite.config.performance.mts`: vendor groups, `console` and `debugger` removed, no sourcemaps, compressed sizes printed per chunk |
| `npm run preview` | Serve the last build locally, to try it in a browser |

To check a page by hand: run `npm run build && npm run preview`, open it in Chrome, then use DevTools → Lighthouse (mobile) or the Performance panel. Run `getWebVitals()` in the console after interacting with the page.

## Not done yet

- **No field data.** Vitals go to `window.__analyticsQueue`, but nothing collects that queue or sends it to a server. Pass `onReport` once there is an endpoint.
- **No bundle treemap.** `build:analyze` prints sizes per chunk. A visual treemap would need a new dev dependency (for example `rollup-plugin-visualizer`), which needs a lockfile change made with npm 10.9.2.
- **No size budget or Lighthouse in CI.** Nothing fails a build that grows. A first budget could be "first load ≤ 210 kB gzip".
- **Forms and i18n on the first load.** Move those imports behind the pages that need them; then the vendor groups stop costing first-load size.
- **Library side:** whether `@maataa/ui` declares `sideEffects` waits on the v2 pilot's bundle measurement (readiness matrix #15).
- **Lint:** `npm run lint` fails because the root app has no ESLint config. That was already the case on master and is unrelated to performance.
