# Fused organism — scrutiny report

## Package extraction update — 2026-10-02

- The MAATAA visual package is now `@maataa/ui`; tokens and reusable primitives have canonical source packages at `@maataa/tokens` and `@maataa/primitives`.
- All six proposed TLPS workspace packages now build and export their assigned registry catalogs: domain, workflow, evidence, generative, composites, and templates. Entries still labeled `planned` are not implementations.
- `npm run build` passes for all nine packages and both applications. Product tests pass: 49 kernel, 5 React adapter, 726 UI, and 5 admin tests. Package import smoke, export checks, workspace-boundary checks, UI typecheck, and formatting pass.
- The toolchain gate remains blocked by npm 12.0.2 versus required npm 10.9.x. A complete offline install remains unverified because the cache lacks one locked tarball. Browser certification was not rerun; the prior closeout reported missing pinned Chromium.
- The findings below document the initial fusion snapshot. Where they conflict with this update, this extraction update is current.

## Composition

- The M2 kernel remains in its original `packages/*` workspace layout.
- The earlier React library is included as the new `@maataa/maataa-ui` workspace at `packages/maataa-ui`.
- The requested stale output is preserved at `legacy-artifacts/maataa-ui/dist.stale-1788963495`. It is archival only and is not wired into package exports or the build.
- The two sides remain separate package APIs. This is a monorepo fusion, not yet a shared component/runtime implementation.

## Findings

### Remaining limits before certification

1. **Full browser certification is pending.** This environment cannot find the pinned Chromium runtime (`CHROMIUM_NOT_FOUND`). The UI button smoke test is not a substitute for cross-browser evidence.
2. **The UI package's Vitest suite cannot start on this machine.** Its installed Rollup optional dependency is Linux ARM64, while this host is Darwin ARM64; the matching platform package is not cached. The UI typecheck, build, and direct DOM smoke check are separate evidence, not a replacement for the suite.
3. **Clean install and lock reproducibility are pending.** Offline lock regeneration was blocked by uncached Storybook registry metadata. Installed npm is 12.0.2, while the kernel policy requires npm 10.9.x.
4. **The React authorization adapter is a client-side interaction guard.** The host server must authenticate the user and re-authorize every consequential request. `allow_with_constraints` stays blocked until a constraint evaluator is integrated.
5. **The legacy UI's mock AI algorithms and non-functional ABAC engine were removed from the fused package.** AI visual components remain; no model-backed predictions are claimed.

### Integration and reproducibility notes

- `scripts/build.mjs` compiles the UI TypeScript and copies both the kernel and UI artifacts to `dist/`.
- Root scripts expose distinct UI typecheck, lint, format, test, build, and product smoke lanes. UI tests still need to run on a compatible install.
- The kernel toolchain gate distinguishes kernel runtime dependencies from the UI's development toolchain; the current local npm version remains outside policy.
- Offline lockfile regeneration could not complete because the npm cache lacks Storybook registry metadata (`ENOTCACHED`). Regenerate and validate it in a network-enabled or fully cached environment before relying on clean installs.
- The package name in the legacy manifest and source is `@maataa/maataa-ui`; the old README examples used `@maataa/ui`. The copied README examples were normalized to the manifest name, but published-import compatibility still needs a deliberate decision.

## Compatibility that looks sound

- The React ranges overlap: the kernel adapter accepts `>=18.2.0 <20`, and this package now declares React and React DOM as host peers in that same range.
- Keeping the APIs under separate workspace package names avoids immediate root-export collisions such as `Button`, `Input`, and `Box`.
- The stale distribution has 432 files and is kept outside the package build and export paths. It must not be treated as a source tree or certification evidence.

## Admin workspace increment

- `apps/admin-template/` adds the requested 15 application areas, 19 page routes, configurable shell, 24 content-layout options, and a launchpad default. The runnable guide is in `apps/admin-template/README.md`.
- The build now copies nested app modules; `npm run build` passes. Local browser checks rendered all 35 app/page routes without console errors, and the main content retained usable width at desktop and mobile viewport sizes.
- Tasks and notes persist only in browser local storage. Other edits are session preview data. JWT, server-side authorization, email, calendar, commerce, and cloud storage still require host services.
- These are local application checks; they do not close the Chromium certification, clean-install, or package test-suite blockers above.

## Verification status

- Source and configuration inspection: complete.
- Workspace layout and package manifest: assembled.
- Clean install: **not verified**; offline lock regeneration was blocked by uncached registry metadata.
- Fresh evidence: kernel suite **49/49 PASS**; UI TypeScript **PASS**; integrated build **PASS**; product DOM smoke **PASS**; root lint, UI lint (**0 errors, 4 warnings**), UI formatting, package exports, and dependency boundaries **PASS**. UI Vitest **blocked by platform-specific Rollup package**; toolchain **FAIL** (npm 12.0.2 vs required npm 10.9.x); browser runtime **FAIL** (`CHROMIUM_NOT_FOUND`); clean install remains unverified.
- Certification: **not granted**. The inherited report is now explicitly labeled historical and does not certify the fused package.
