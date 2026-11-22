# 1.0 dependency audit — release blocked

Audit date: 2026-11-22
Repository: `thelinep/maataa-ui`
Branch: `codex/stage-4-release-mechanics`
Audited commit: `a45aa68`

## Decision

The full `npm audit` gate remains unchanged and blocking. With Node 22.22.3 and the repository-required npm 10.9.0, the lockfile reports **17 vulnerable package entries: 13 moderate, 3 high, and 1 critical**. The time-bound disposition below is an internal tooling risk record; it does not make the audit green or authorize a merge, release, or workflow exception.

The original lockfile reported 44 entries (28 moderate, 11 high, 5 critical). Compatible fixes and the Prisma/Effect probe reduced that to 36 (26 moderate, 5 high, 5 critical). Vite 6/Vitest 5 reduced it to 20 (13 moderate, 2 high, 5 critical). Storybook 8.6.19 fixed the Storybook core advisories; the current full npm 10.9.0 audit is 17 entries (13 moderate, 3 high, 1 critical).

All 21 workspace packages remain `"private": true`. No severity threshold, audit command, or release workflow was changed.

## Current high and critical paths

The audit reports **package entries**, not a one-to-one count of leaf GHSA records. The 3 high entries are aggregate `@storybook/cli`, `giget`, and `vite`; the critical entry is `tar`.

| Audit package entry | Resolved dependency path | Leaf advisory IDs |
| --- | --- | --- |
| Critical `tar@6.2.1` | `@maataa/ui` dev dependency → `@storybook/cli@8.6.19` → `giget@1.2.5` → `tar@6.2.1` | Critical [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw); high [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v), [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96), [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w), [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m) |
| High `giget@1.2.5` | Same Storybook CLI → `giget` → vulnerable `tar` chain | Aggregate of the `tar` advisories above |
| High `@storybook/cli@8.6.19` | Direct UI dev dependency → `giget` and `glob` | Aggregate high entry; npm identifies Storybook CLI 10.6.8 as the available fix |
| High `vite@5.4.21` | Peer instance for `@joshwooding/vite-plugin-react-docgen-typescript@0.5.0` (from Storybook React/Vite) and `@vitejs/plugin-react@5.1.1`; direct app, Storybook builder, and Vitest Vite dependencies are 6.4.6 | High [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm); npm also reports moderate Vite/esbuild advisories on this peer instance |

The Storybook 8.6.19 patch resolves the vulnerable Storybook core records but retains the CLI's vulnerable template-fetch/archive path. The affected `giget` and `tar` nodes are dev-only. The lockfile has separate `giget@3.3.1` under Prisma config and `tar@7.5.22` under Electron packaging.

Vite 5.4.21 is a peer-resolved build/test dependency; the app builds, Storybook builder, and Vitest use direct Vite 6.4.6. A root Vite 6.4.6 override left the Vite 5 peer invalid. Plain npm deduplication also failed with `ERESOLVE` against the current Vitest 5 peer graph. Both probes were reverted; package manifests and lockfile are unchanged from `a45aa68`.

## Time-bound internal tooling disposition

**Decision:** defer the Storybook 8 → 9 → 10 migration until after the TLPS v2 `/desk` pilot. Storybook 10 is ESM-only, requires ESM-valid main config/presets, and the official migration path requires upgrading 8 → 9 → 10 in sequence. This is a time-limited internal development disposition only.

- **Scope:** the Storybook CLI/template-fetch chain and the Vite 5.4.21 peer instance above. None is a runtime dependency of the 21 packages.
- **Compensating controls:** keep every package private; do not expose the Storybook dev server to untrusted networks; do not use the Storybook CLI to fetch untrusted templates; keep the full audit check enabled and failing; do not merge or release while it fails.
- **Artifact evidence:** `@maataa/ui` declares Storybook/Vite/Vitest as devDependencies, and its `files` list ships `dist`, README, and NOTICE. Its `npm pack --dry-run` reported 1,200 files and no Storybook, Vite, Vitest, giget, or tar tool files. The 21 packages' runtime dependency manifests contain none of those tool packages. The packed `package.json` still lists devDependencies, which npm does not install as consumer runtime dependencies.
- **Owner:** release maintainer.
- **Review deadline:** 2026-12-06, or before any package release (whichever comes first).
- **Follow-up:** upgrade through Storybook 9 then 10.6.8 or a newer patched release, resolve the Vite peer tree, then require the full audit to pass. At each major, verify the 629 stories, axe checks, 15 Chromium visual baselines, and static Storybook build; revert that spike if any break.

This disposition does not waive the findings. The audit still exits non-zero, and all CI/release decisions remain governed by the unchanged full audit gate.

## Verified changes and checks

- `npm audit fix` ran without `--force`; no audit threshold was changed.
- Prisma moved within major 7 to 7.10.1, Electron within major 44 to 44.11.5, and the root override resolves Prisma's Effect pin to patched `effect@3.22.5`. Prisma schema validation and 43 domain-registry tests passed during that probe.
- Workspace Vite dependencies are 6.4.6, `@vitejs/plugin-react` is 5.1.1, UI Vitest/`@vitest/*` are 5.1.1, and the UI Storybook family is 8.6.19.
- `npx --yes npm@10.9.0 run gate:toolchain`: passed (Node 22.22.3, npm 10.9.0). The shell's default npm is 12.0.2 and fails the gate; use the pinned npm version.
- UI lint passed with 3 existing warnings; UI TypeScript check passed.
- UI tests: **257 files and 1,241 tests passed**.
- UI package build passed (9 canonical UI/TLPS packages).
- Admin-template and TLPS application builds passed with Vite 6.4.6; the admin build has existing large-chunk warnings.
- Storybook 8.6.19 static build passed with Vite 6.4.6 after adding a workspace module-path launcher; 637 modules built, with existing chunk-size and eval warnings.
- Full npm 10.9.0 audit: **17 entries (13 moderate, 3 high, 1 critical)**; exit status 1.

Full certification, browser certification, clean consumer installs, package secret scans, all-21 package dry-run pack checks, Changeset versioning, release preflight, and fresh tarball generation still need completion. The pending Changesets, release workflow, and existing tarball artifacts have not been changed.
