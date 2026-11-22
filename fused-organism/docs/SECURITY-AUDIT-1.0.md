# 1.0 dependency audit — release blocked pending review

Audit date: 2026-11-22
Repository: `thelinep/maataa-ui`
Branch: `codex/stage-4-release-mechanics`
Last committed base: `4a3ae7a` (toolchain migration changes are currently uncommitted)

## Decision

The full `npm audit` security gate remains unchanged and blocking. With the repository-required Node 22.22.3 and npm 10.9.0, the current lockfile reports **17 vulnerable package entries: 13 moderate, 3 high, and 1 critical**. The release must not proceed to Changesets versioning, tarball preflight, or release workflow until the full audit passes. No finding is waived, and no threshold or workflow was changed.

The original lockfile reported 44 entries (28 moderate, 11 high, 5 critical). Compatible fixes and the Prisma/Effect probe reduced that to 36 (26 moderate, 5 high, 5 critical). The Vite 6/Vitest 5 migration reduced the audit to 20 (13 moderate, 2 high, 5 critical). Updating the Storybook family from 8.6.14 to patched 8.6.19 removed the Storybook core critical findings; the current npm 10.9.0 audit is 17 entries (13 moderate, 3 high, 1 critical).

All 21 workspace packages remain `"private": true`. The full audit command was run; a production-only audit is not used as a release gate.

## Current high and critical dependency paths

| Audit package entry | Resolved path | Leaf advisory IDs |
| --- | --- | --- |
| Critical `tar@6.2.1` | `@maataa/ui → @storybook/cli@8.6.19 → giget@1.2.5 → tar@6.2.1` | Critical [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw); high [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v), [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96), [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w), [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m) |
| High `giget` | Same Storybook CLI → `giget` → vulnerable `tar` chain | Aggregate of the `tar` advisories above |
| High `@storybook/cli@8.6.19` | Direct UI dev dependency → `giget` and `glob` | Aggregate high entry; npm reports the available fix as Storybook CLI 10.6.8, a major upgrade |
| High `vite@5.4.21` | Retained peer instance through the UI Storybook React/Vite docgen plugin and the admin app's React/Vite plugin; direct Vite dependencies are 6.4.6 | High [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm); npm also reports moderate Vite/esbuild advisories on this vulnerable instance |

The Storybook 8.6.19 patch resolves the vulnerable Storybook core records, but it does not remove the CLI's vulnerable `giget@1.2.5` archive path. npm identifies Storybook CLI 10.6.8 as a fix and official Storybook guidance requires the staged 8 → 9 → 10 migration. This crosses major versions and the current release audit still fails, so stop here for review before attempting the next Storybook major or changing any release gate.

## Verified changes and checks

- `npm audit fix` was run without `--force`; the full audit threshold was not changed.
- Prisma moved within major 7 to 7.10.1, Electron within major 44 to 44.11.5, and the root override resolves Prisma's Effect pin to patched `effect@3.22.5`. Prisma schema validation and 43 domain-registry tests passed during that probe.
- Workspace Vite dependencies are now 6.4.6, `@vitejs/plugin-react` is 5.1.1, and UI Vitest/`@vitest/*` are 5.1.1. The UI Storybook family is 8.6.19.
- `npx --yes npm@10.9.0 run gate:toolchain`: passed (Node 22.22.3, npm 10.9.0). The shell's default npm is 12.0.2 and fails the gate; use the pinned version for release validation.
- UI lint: passed with 3 existing warnings. UI TypeScript check: passed.
- UI tests: **257 files and 1,241 tests passed** using the package test script after aligning its lint pre-hook with the canonical UI lint exclusions.
- UI package build: passed (9 canonical UI/TLPS packages).
- Admin-template build: passed with Vite 6.4.6; existing large-chunk warnings remain. TLPS application build: passed with Vite 6.4.6.
- Storybook static build: passed with Storybook 8.6.19 and Vite 6.4.6 after adding a small Node launcher that supplies the workspace-local module path required by npm's workspace layout. It built 637 modules; existing large-chunk and Storybook eval warnings remain.
- Full npm 10.9.0 audit: **17 entries (13 moderate, 3 high, 1 critical)**; exit status 1. The full release gate remains blocked.
- The Node/npm mismatch, Storybook workspace resolution, and unit-test entry-point failures found during verification have been corrected without changing the security threshold.

The full certification, browser certification, clean consumer installs, package secret scan, dry-run pack of all 21 packages, and release preflight remain to be run after the audit blockers are resolved. The pending Changesets, release workflow, and pre-audit tarball artifacts were left untouched.
