# 1.0 dependency audit — review required

Audit date: 2026-11-22

Repository: `thelinep/maataa-ui`
Branch base: `codex/stage-4-release-mechanics` at `901f4f8`

## Decision

The full `npm audit --audit-level=high` gate remains unchanged. It currently fails, so release preparation must stop before versioning the pending Changesets, running the tarball release preflight, or triggering the release workflow. No audit finding is waived and no gate is downgraded.

The full audit reports **39 vulnerable package entries: 26 moderate, 8 high, 5 critical**. The initial lockfile had 44 entries (28 moderate, 11 high, 5 critical). `npm audit fix` without `--force` reduced that to 42 (26 moderate, 11 high, 5 critical). Updating Prisma within major 7 to 7.10.1 and Electron within major 44 to 44.11.5 reduced the final count to 39 (26 moderate, 8 high, 5 critical). The same-major updates fixed three high entries: `deepmerge-ts`, `mysql2`, and `electron`.

All remaining high and critical entries are reachable only through workspace development/build/test tooling in this lockfile: Prisma CLI/config, Storybook, Vite, Vitest, Puppeteer, and Electron packaging. `npm audit --omit=dev` reports zero entries; this is reachability context only and is not a substitute for the required full audit.

## Remaining high and critical package paths

| Severity | Audit package entry | Current dependency path | Leaf advisory IDs / finding |
| --- | --- | --- | --- |
| Critical | `@vitest/coverage-v8` 1.6.1 | `@maataa/ui` dev dependency → Vitest 1.6.1 | Via Vitest UI, Tinypool, Vite, and the Vitest UI-server advisory below |
| Critical | `@vitest/ui` 1.6.1 | `@maataa/ui` dev dependency → Vitest 1.6.1 | Via the Vitest UI-server advisory below and vulnerable test-tool dependencies |
| Critical | `tar` 6.2.1 | `@maataa/ui` → Storybook CLI 7.6.24 → `giget` 1.2.5 → `tar` | Includes critical [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw); all tar IDs are listed below |
| Critical | `tinypool` 0.8.4 | `@maataa/ui` → Vitest 1.6.1 → Tinypool | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3), [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) |
| Critical | `vitest` 1.6.1 | `@maataa/ui` dev dependency; also parent of `@vitest/ui`, coverage, Tinypool, Vite, and vite-node | UI server arbitrary file read/execute: [GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp) |
| High | `@prisma/config` 7.10.1 | `@maataa/domain-registry` dev dependency → Prisma 7.10.1 → `@prisma/config` → Effect 3.20.0 | ReDoS: [GHSA-7589-6fvf-x4pw](https://github.com/advisories/GHSA-7589-6fvf-x4pw) |
| High | `@storybook/cli` 7.6.24 | `@maataa/ui` dev dependency → Storybook CLI → core/server/telemetry, `giget`, and Puppeteer | Aggregates the vulnerable transitive packages in this table; no separate leaf GHSA is reported for the CLI entry |
| High | `effect` 3.20.0 | `@maataa/domain-registry` → Prisma 7.10.1 → `@prisma/config` (pins Effect 3.20.0) | ReDoS: [GHSA-7589-6fvf-x4pw](https://github.com/advisories/GHSA-7589-6fvf-x4pw) |
| High | `extract-zip` 1.7.0 | Storybook CLI 7.6.24 → `puppeteer-core` 2.1.1 → `extract-zip` | [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv), [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3) |
| High | `giget` 1.2.5 | Storybook CLI 7.6.24 → `giget` → vulnerable `tar` | Aggregates the tar findings listed below |
| High | `prisma` 7.10.1 | `@maataa/domain-registry` dev dependency → `@prisma/config` → Effect | ReDoS: [GHSA-7589-6fvf-x4pw](https://github.com/advisories/GHSA-7589-6fvf-x4pw) |
| High | `puppeteer-core` 2.1.1 | Storybook CLI 7.6.24 → `puppeteer-core` → `extract-zip` | Aggregates [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3) |
| High | `vite` 5.4.21 | UI and app build/test dev dependencies → Vite → `launch-editor` and esbuild | High `launch-editor` Windows path check bypass: [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm); Vite also aggregates moderate Vite/esbuild findings |

`@storybook/cli`, `giget`, `puppeteer-core`, Prisma, `@prisma/config`, and Vitest add-on entries are npm's aggregate package records: their severity comes from the vulnerable leaf dependency paths, not from a separate advisory ID for each aggregate row.

## Tar advisory IDs on the Storybook → giget path

The vulnerable tar entry aggregates these IDs. Their individual severities are shown by npm; the critical one makes the package entry critical.

- High: [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v), [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96), [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w), [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m).
- Critical: [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw).
- Moderate (not blocking the configured high threshold): [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh), [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp), [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j).

## Remediation plan for review

1. **Vitest family:** update `vitest`, `@vitest/ui`, and `@vitest/coverage-v8` together to a supported fixed line (npm currently proposes 5.1.1). Audit the migration from Vitest 1, verify coverage and UI configuration, then run all UI/unit tests. Confirm the resolved Tinypool version is outside both affected ranges before accepting.
2. **Storybook/Puppeteer/archive chain:** upgrade the aligned Storybook packages from 7.6.24 to a fixed supported major (npm proposes 10.6.8 for the CLI), then remove or replace the obsolete CLI/Puppeteer/Giget chain. Verify Storybook config/build, every story's axe checks, and package exports. Do not add a broad `tar` or `extract-zip` override without demonstrating compatibility with each parent range.
3. **Vite family:** move Vite 5 and its React plugin, Storybook builder, and Vitest integrations to a compatible fixed major line (npm proposes Vite 8.3.8). Resolve the currently invalid Vite peer requirement reported for Storybook's nested `@vitejs/plugin-react@3.1.0`; validate both app builds, UI build, browser certification, and consumer fixtures.
4. **Prisma/Effect:** Prisma 7.10.1 fixed the `deepmerge-ts` and `mysql2` findings, but its config pins vulnerable Effect 3.20.0. Wait for a Prisma release whose supported config dependency is fixed, or test an explicit Effect override against Prisma generation, schema validation, and domain-registry tests. The current npm fix suggestion for the remaining Prisma/Effect chain points to a major-version switch and is not applied.
5. Rerun the full `npm audit --audit-level=high` after each aligned upgrade. Only when it passes, run the full certification and requested UI/build/test/tarball gates. Keep all 21 packages private and preserve the existing audit threshold.

## Checks completed at this stop point

- `npm audit fix` ran without `--force`; no override was added.
- Direct dependencies were updated within their existing major lines: Prisma `7.9.1` → `7.10.1`, Electron `44.5.1` → `44.11.5`.
- Prisma casting and communications PostgreSQL/SQLite schema validation passed.
- `npm test --workspace=@maataa/domain-registry`: 43 tests passed.
- Final full audit: 39 entries (26 moderate, 8 high, 5 critical), exit status 1. `npm audit --omit=dev` was zero only as reachability context.
- The invalid Storybook peer pairing (`@vitejs/plugin-react@3.1.0` requiring Vite 4 while Vite 5.4.21 is installed) remains unresolved and is included in the Storybook/Vite migration review.

No workflow, certification gate, severity threshold, package privacy flag, pending Changeset, or release version was changed in response to these findings.
