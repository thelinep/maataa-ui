# 1.0 dependency audit — review required

Audit date: 2026-11-22

Repository: `thelinep/maataa-ui`
Branch base: `codex/stage-4-release-mechanics` at `901f4f8`

## Decision

The full `npm audit --audit-level=high` gate remains unchanged. It currently fails, so release preparation must stop before versioning the pending Changesets, running the tarball release preflight, or triggering the release workflow. No audit finding is waived and no gate is downgraded.

The full audit currently reports **36 vulnerable package entries: 26 moderate, 5 high, 5 critical**. The initial lockfile had 44 entries (28 moderate, 11 high, 5 critical). `npm audit fix` without `--force` reduced that to 42 (26 moderate, 11 high, 5 critical). Updating Prisma within major 7 to 7.10.1 and Electron within major 44 to 44.11.5 reduced it to 39 (26 moderate, 8 high, 5 critical). A tested root override of Prisma's exact Effect dependency from 3.20.0 to patched Effect 3.22.5 reduced it to 36 (26 moderate, 5 high, 5 critical).

All remaining high and critical entries are reachable only through workspace development/build/test tooling in this lockfile: Prisma CLI/config, Storybook, Vite, Vitest, Puppeteer, and Electron packaging. `npm audit --omit=dev` reports zero entries; this is reachability context only and is not a substitute for the required full audit.

## Remaining high and critical package paths

| Severity | Audit package entry | Current dependency path | Leaf advisory IDs / finding |
| --- | --- | --- | --- |
| Critical | `@vitest/coverage-v8` 1.6.1 | `@maataa/ui` dev dependency → Vitest 1.6.1 | Via Vitest UI, Tinypool, Vite, and the Vitest UI-server advisory below |
| Critical | `@vitest/ui` 1.6.1 | `@maataa/ui` dev dependency → Vitest 1.6.1 | Via the Vitest UI-server advisory below and vulnerable test-tool dependencies |
| Critical | `tar` 6.2.1 | `@maataa/ui` → Storybook CLI 7.6.24 → `giget` 1.2.5 → `tar` | Includes critical [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw); all tar IDs are listed below |
| Critical | `tinypool` 0.8.4 | `@maataa/ui` → Vitest 1.6.1 → Tinypool | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3), [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) |
| Critical | `vitest` 1.6.1 | `@maataa/ui` dev dependency; also parent of `@vitest/ui`, coverage, Tinypool, Vite, and vite-node | UI server arbitrary file read/execute: [GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp) |
| High | `@storybook/cli` 7.6.24 | `@maataa/ui` dev dependency → Storybook CLI → core/server/telemetry, `giget`, and Puppeteer | Aggregates the vulnerable transitive packages in this table; no separate leaf GHSA is reported for the CLI entry |
| High | `extract-zip` 1.7.0 | Storybook CLI 7.6.24 → `puppeteer-core` 2.1.1 → `extract-zip` | [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv), [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3) |
| High | `giget` 1.2.5 | Storybook CLI 7.6.24 → `giget` → vulnerable `tar` | Aggregates the tar findings listed below |
| High | `puppeteer-core` 2.1.1 | Storybook CLI 7.6.24 → `puppeteer-core` → `extract-zip` | Aggregates [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3) |
| High | `vite` 5.4.21 | UI and app build/test dev dependencies → Vite → `launch-editor` and esbuild | High `launch-editor` Windows path check bypass: [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm); Vite also aggregates moderate Vite/esbuild findings |

`@storybook/cli`, `giget`, `puppeteer-core`, and Vitest add-on entries are npm's aggregate package records: their severity comes from the vulnerable leaf dependency paths, not from a separate advisory ID for each aggregate row. The Prisma/Effect path is currently resolved by the tested override described below; `deepmerge-ts` was already cleared by Prisma 7.10.1.

## Tar advisory IDs on the Storybook → giget path

The vulnerable tar entry aggregates these IDs. Their individual severities are shown by npm; the critical one makes the package entry critical.

- High: [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v), [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96), [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w), [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m).
- Critical: [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw).
- Moderate (not blocking the configured high threshold): [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh), [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp), [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j).

## Remediation plan for review

1. **Prisma/Effect probe — passed:** the root override resolves Prisma's exact `effect@3.20.0` pin to patched `effect@3.22.5`, still on Effect major 3. Prisma casting and communications PostgreSQL/SQLite schema validations and all 43 domain-registry tests passed. The override removes the remaining Prisma/Effect high entries in `npm audit`. Keep it unless a future supported Prisma release pins a fixed Effect version, then remove the override and recheck.
2. **Vite + Storybook 8 compatibility slice:** Vite 5.4.21 is the latest Vite 5 release; 6.4.4 is beyond the audited Vite affected range. Storybook 7.6.24's `builder-vite` and `react-vite` peers stop at Vite 5, while Storybook 8.6.14 supports Vite 6. Therefore a supported Vite 6 test requires moving Storybook 7 → 8 in the same slice. Vite and Storybook are coupled by peer ranges; the `tar`/`extract-zip` advisory chain is separate from Vite.
3. **Vitest + Tinypool:** after Vite 6.4.4 is present, migrate `vitest`, `@vitest/ui`, and `@vitest/coverage-v8` together to a supported fixed line (npm currently proposes 5.1.1). Vitest 5 requires Vite >=6.4 and Node >=22.12; this workspace's Node 22.22.3 meets the Node requirement. Run all UI/unit tests, verify coverage/UI configuration, and check that Tinypool is outside both affected ranges.
4. **Storybook/Puppeteer/archive chain:** the archive advisories run through Storybook CLI 7.6.24 → `giget`/`tar` and Puppeteer/`extract-zip`; changing Vite alone will not clear them. npm proposes Storybook CLI 10.6.8. Storybook's official upgrade instructions require a staged 7 → 8 → 9 → 10 path, so validate the Storybook 8 bridge first, then 9, then 10 with the relevant story, axe, and static-build checks at each stage. Storybook 10 is ESM-only; validate its config migration. Do not add broad archive-package overrides without compatibility evidence for every parent range.
5. Rerun the full `npm audit --audit-level=high` after each aligned upgrade. Only when it passes, run the full certification and requested UI/build/test/tarball gates. Keep all 21 packages private and preserve the existing audit threshold.

## Checks completed at this stop point

- `npm audit fix` ran without `--force`; no audit gate or threshold was changed.
- Direct dependencies were updated within their existing major lines: Prisma `7.9.1` → `7.10.1`, Electron `44.5.1` → `44.11.5`.
- Prisma casting and communications PostgreSQL/SQLite schema validation passed.
- `npm test --workspace=@maataa/domain-registry`: 43 tests passed.
- Prisma 7.10.1 plus root `overrides.effect = 3.22.5`: `npm ls` reports Effect as overridden under Prisma config; Prisma schema validation and all 43 domain-registry tests pass.
- Final full audit after the Effect probe: 36 entries (26 moderate, 5 high, 5 critical), exit status 1. `npm audit --omit=dev` was zero only as reachability context.
- Vite metadata review: 5.4.21 is the latest Vite 5; 6.4.4 exists and is beyond the audited affected range. Storybook 7.6.24 builder/react-vite peers stop at Vite 5, while Storybook 10.6.8 accepts Vite 5–8. The existing nested React plugin 3.1.0 also has a Vite 4-only peer declaration, which contributes to the current invalid-peer report.
- Official migration guidance: Storybook requires sequential major upgrades (7 → 8 → 9 → 10); Storybook 10 is ESM-only. Vitest 5 requires Vite >=6.4 and Node >=22.12, so the Vite 6.4.4/Storybook 8 compatibility bridge precedes the Vitest step.

No workflow, certification gate, severity threshold, package privacy flag, pending Changeset, or release version was changed in response to these findings.
