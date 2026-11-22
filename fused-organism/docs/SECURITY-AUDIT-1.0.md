# 1.0 dependency audit — release blocked

Audit date: 2026-11-22

Repository: `thelinep/maataa-ui`

Branch: `codex/stage-4-release-mechanics`

Audited lockfile commit: `1c71d47`

Toolchain: Node 22.22.3, npm 10.9.2

## Decision

The full `npm audit` remains a blocking release gate and exits non-zero. The current lockfile has **15 vulnerable package entries: 12 moderate, 2 high, and 1 critical**. `npm audit --omit=dev` reports zero findings, which is a reachability signal for runtime dependencies only; it does not replace or waive the full audit. All 21 workspace packages remain `"private": true`. No audit threshold, command, or release workflow was weakened.

The original lockfile had 44 entries (28 moderate, 11 high, 5 critical). Non-forcing fixes and subsequent dependency work reduced this to 15. The prior 17-entry snapshot at `a45aa68` is superseded. The current dependency tree has Vite 6.4.6 for the applications, Storybook builder, and Vitest; the former Vite 5.4.21 finding is no longer present.

## Current high and critical paths

The npm audit count is vulnerable package entries, not distinct advisories. The current high and critical entries are all development tooling:

| Audit entry | Resolved path | Reachability and advisory detail |
| --- | --- | --- |
| Critical `tar@6.2.1` | `@maataa/ui` dev dependency → `@storybook/cli@8.6.19` → `giget@1.2.5` → `tar@6.2.1` | npm reports critical [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw), high [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v), [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96), [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w), and [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m). npm also reports moderate tar advisories [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh), [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp), and [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j). |
| High `giget@1.2.5` | Same Storybook CLI template-fetch/archive chain → `tar@6.2.1` | Development-time CLI chain only; the affected path is not a package runtime dependency. |
| High `@storybook/cli@8.6.19` | Direct `@maataa/ui` dev dependency → `giget` and `glob` | npm identifies Storybook 10.6.8 as the available major-version fix. The 8→9→10 migration is not a safe single-step patch. |

The remaining moderate entries are in Storybook’s `@joshwooding/vite-plugin-react-docgen-typescript → glob` and `addon-essentials → addon-actions → uuid` chains, plus Electron Builder’s `app-builder-lib`/`@electron/universal`/`dmg-builder`/`electron-builder-squirrel-windows` and `minimatch` chain. Leaf moderate advisories include [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), and [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq).

`npm ls` confirms the separate Prisma path uses `giget@3.3.1`; Electron Builder has `tar@7.5.22`; neither is the vulnerable `tar@6.2.1` node. The vulnerable Storybook chain is development tooling. Package secret scanning passed for all 21 workspaces, and the prior pack inspection found no Storybook/Vite/Vitest/CLI tool files in package payloads. This reachability evidence does not change the full audit result.

## Time-bound internal tooling disposition

**Decision:** defer the Storybook 8 → 9 → 10 migration until after the TLPS v2 `/desk` pilot, with a review deadline of **2026-12-06 or before any package release, whichever comes first**. This is an internal risk record only; it does not make audit green or authorize a release.

- **Compensating controls:** keep all packages private; do not expose Storybook’s dev server to untrusted networks; do not use its CLI to fetch untrusted templates; retain the full audit gate; do not merge or release while the gate fails.
- **Upgrade follow-up:** run the sequential Storybook 9 and 10 migration in an isolated spike, resolve the remaining Vite peer tree if it reappears, then require the full audit to pass. At each step check all 629 stories, axe results, 15 stable UI baselines, and the static Storybook build. Revert a spike if those regress.
- **Owner:** release maintainer.

This disposition does not waive findings. The audit still exits non-zero, and the release gate remains blocking.

## Certification snapshot

A full local certification attempt on the `1c71d47` source tree, using temporary clean-checkout harness fixes, passed the toolchain, version sync, generated drift, registry/React policy, compatibility, lint/format, boundaries/exports, package-secret scan, 5 React adapter tests, 92 kernel tests, both builds, UI types/lint/format, **1,241 UI tests**, Storybook static build, all 629 story axe checks (zero stable-set violations; 85 beta/experimental violations), all 15 stable UI visual baselines, component stability, product smoke, fresh-clone, and pinned Chromium runtime.

The initial browser fixture screenshot failed on macOS because its clip started at a fractional vertical coordinate. Inspection also found the checked-in mobile semantic baseline was a blank image. The harness was adjusted in the isolated worktree to place the color-only fixture at integer coordinates and force sRGB capture; reviewed desktop and mobile candidate baselines were then regenerated under Chromium 144.0.7559.96. Normal browser certification passed all 7 invariants with baseline updates disabled. These harness and baseline changes are included for review in the associated release-preparation commit; rerun full certification on that commit and retain CI’s commit-bound artifact.

The audit and certification results are separate gates: full `npm audit` remains red even when component certification passes. The release check must not run or pass until both required checks are green.
