# 1.0 dependency audit — release blocked

## Superseding update — 2026-11-23

This update supersedes the 2026-11-22 audit counts and Storybook deferral below. It describes the **uncommitted local working tree** based on `b9af9a3` on `codex/stage-4-release-mechanics`.

- Storybook was migrated from 8.6.19 through 9.1.21 to 10.6.8. The direct `@storybook/cli` dependency was removed; all 21 workspace packages remain private.
- The full default `npm audit` now reports **9 vulnerable package entries: 9 moderate, 0 high, 0 critical**, and exits non-zero. The full audit command and gate remain unchanged.
- The remaining entries are in the Storybook `@storybook/react-vite` → `@joshwooding/vite-plugin-react-docgen-typescript` → `glob` chain (`GHSA-3g3m-2fjr-6pw4`); the Electron Builder chain (`electron-builder`, `app-builder-lib`, `dmg-builder`, `electron-builder-squirrel-windows`, `@electron/universal`) and `minimatch` (`GHSA-g3hv-75wg-m249`). npm's suggested fixes require major-version changes or downgrades; no force fix was applied.
- `npm run build:ui`, the Storybook 10 static build, all **1,241 UI tests**, and the **629-story axe audit** passed. Axe reported zero stable-set violations and 79 beta/experimental violations. The 15 visual baselines passed in the isolated Storybook 10 spike before the final ESLint-plugin alignment; a final main-checkout visual run is pending because Chromium 144.0.7559.96 is unavailable locally.
- The pinned certification toolchain was not satisfied: this machine has Node 22.22.3 and npm 12.0.2, while the repository requires npm 10.9.2. Full certification and release preflight have not been rerun on this working tree.
- The lockfile currently reflects the local npm 12 install and has a broad diff. Regenerate or verify it with npm 10.9.2 before committing. This update is not a certification pass or release approval.

Storybook is available locally at `http://127.0.0.1:6006/`. Keep the security gate blocking until the remaining audit entries are resolved or explicitly reviewed and the pinned-toolchain gates pass.

Audit date: 2026-11-22

Repository: `thelinep/maataa-ui`

Branch: `codex/stage-4-release-mechanics`

Audited lockfile commit: `1c71d47`

Toolchain: Node 22.22.3, npm 10.9.2

## Decision

The full `npm audit` remains a blocking release gate and exits non-zero. The current lockfile has **15 vulnerable package entries: 12 moderate, 2 high, and 1 critical**. `npm audit --omit=dev` reports zero findings, which is a reachability signal for runtime dependencies only; it does not replace or waive the full audit. All 21 workspace packages remain `"private": true`. No audit threshold, command, or release workflow was weakened.

The original lockfile had 44 entries (28 moderate, 11 high, 5 critical). Non-forcing fixes and subsequent dependency work reduced this to 15. The prior 17-entry snapshot at `a45aa68` is superseded. The current dependency tree has Vite 6.4.6 for the applications, Storybook builder, and Vitest; the former Vite 5.4.21 finding is no longer present.

## High and critical paths before Storybook migration (2026-11-22)

The npm audit count is vulnerable package entries, not distinct advisories. The current high and critical entries are all development tooling:

| Audit entry | Resolved path | Reachability and advisory detail |
| --- | --- | --- |
| Critical `tar@6.2.1` | `@maataa/ui` dev dependency → `@storybook/cli@8.6.19` → `giget@1.2.5` → `tar@6.2.1` | npm reports critical [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw), high [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v), [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96), [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w), and [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m). npm also reports moderate tar advisories [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh), [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp), and [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j). |
| High `giget@1.2.5` | Same Storybook CLI template-fetch/archive chain → `tar@6.2.1` | Development-time CLI chain only; the affected path is not a package runtime dependency. |
| High `@storybook/cli@8.6.19` | Direct `@maataa/ui` dev dependency → `giget` and `glob` | npm identifies Storybook 10.6.8 as the available major-version fix. The 8→9→10 migration is not a safe single-step patch. |

The remaining moderate entries are in Storybook’s `@joshwooding/vite-plugin-react-docgen-typescript → glob` and `addon-essentials → addon-actions → uuid` chains, plus Electron Builder’s `app-builder-lib`/`@electron/universal`/`dmg-builder`/`electron-builder-squirrel-windows` and `minimatch` chain. Leaf moderate advisories include [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), and [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq).

`npm ls` confirms the separate Prisma path uses `giget@3.3.1`; Electron Builder has `tar@7.5.22`; neither is the vulnerable `tar@6.2.1` node. The vulnerable Storybook chain is development tooling. Package secret scanning passed for all 21 workspaces, and the prior pack inspection found no Storybook/Vite/Vitest/CLI tool files in package payloads. This reachability evidence does not change the full audit result.

## Previous internal tooling disposition (superseded 2026-11-23)

**Decision:** defer the Storybook 8 → 9 → 10 migration until after the TLPS v2 `/desk` pilot, with a review deadline of **2026-12-06 or before any package release, whichever comes first**. This is an internal risk record only; it does not make audit green or authorize a release.

- **Compensating controls:** keep all packages private; do not expose Storybook’s dev server to untrusted networks; do not use its CLI to fetch untrusted templates; retain the full audit gate; do not merge or release while the gate fails.
- **Upgrade follow-up:** run the sequential Storybook 9 and 10 migration in an isolated spike, resolve the remaining Vite peer tree if it reappears, then require the full audit to pass. At each step check all 629 stories, axe results, 15 stable UI baselines, and the static Storybook build. Revert a spike if those regress.
- **Owner:** release maintainer.

This disposition does not waive findings. The audit still exits non-zero, and the release gate remains blocking.

## Certification snapshot

A full local certification attempt on the `1c71d47` source tree, using temporary clean-checkout harness fixes, passed the toolchain, version sync, generated drift, registry/React policy, compatibility, lint/format, boundaries/exports, package-secret scan, 5 React adapter tests, 92 kernel tests, both builds, UI types/lint/format, **1,241 UI tests**, Storybook static build, all 629 story axe checks (zero stable-set violations; 85 beta/experimental violations), all 15 stable UI visual baselines, component stability, product smoke, fresh-clone, and pinned Chromium runtime.

The initial browser fixture screenshot failed on macOS because its clip started at a fractional vertical coordinate. Inspection also found the checked-in mobile semantic baseline was a blank image. The harness was adjusted in the isolated worktree to place the color-only fixture at integer coordinates and force sRGB capture; reviewed desktop and mobile candidate baselines were then regenerated under Chromium 144.0.7559.96. Normal browser certification passed all 7 invariants with baseline updates disabled. These harness and baseline changes are included for review in the associated release-preparation commit; rerun full certification on that commit and retain CI’s commit-bound artifact.

The audit and certification results are separate gates: full `npm audit` remains red even when component certification passes. The release check must not run or pass until both required checks are green.
