# Testing and Certification Gates — 0.4.1 / M2

The kernel uses Node's built-in test runner and has zero external package dependencies in workspace `dependencies`. `@maataa/react` has one optional host-provided React peer. M2 uses **exact Chromium 144.0.7559.96** through direct Chrome DevTools Protocol automation; the browser executable is an environment prerequisite, not an npm dependency. Other browser versions are not implied certified.

## Named certification gates

| Gate | Command | Implementation |
| --- | --- | --- |
| M0 retrospective foundation | `npm run gate:m0` | `scripts/check-m0-foundation.mjs` |
| M2 evidence closeout | `npm run gate:m2-closeout` | `scripts/check-m2-closeout.mjs` |
| Toolchain | `npm run gate:toolchain` | `scripts/check-toolchain.mjs` |
| Version synchronization | `npm run gate:version-sync` | `scripts/check-version-sync.mjs` |
| Generated drift | `npm run gate:drift` | `scripts/check-drift.mjs` |
| Visual policy metadata | `npm run gate:visual-policy` | `scripts/check-visual-policy.mjs` |
| Registry binding resolution | `npm run check:registry-bindings` | `scripts/check-registry-bindings.mjs` |
| React peer/adapter policy | `npm run check:react-policy` | `scripts/check-react-policy.mjs` |
| Compatibility | `npm run check:compat` | contract + API + registry + deprecation checks |
| Lint | `npm run lint` | `scripts/lint.mjs` |
| Format | `npm run format:check` | `scripts/format-check.mjs` |
| Package boundaries | `npm run check:boundaries` | `scripts/check-boundaries.mjs` |
| Export integrity | `npm run check:exports` | `scripts/check-exports.mjs` |
| React adapter tests | `npm run test:react` | `packages/react/test/react-adapter.test.mjs` |
| Node tests | `npm test` | `tests/**/*.test.mjs` + package tests |
| Build | `npm run build` | `scripts/build.mjs` |
| Tree-only fresh clone | `npm run fresh-clone` | `scripts/fresh-clone.mjs` |
| Browser runtime | `npm run gate:browser-runtime` | `scripts/check-browser-runtime.mjs` |
| Browser certification | `npm run certify:browser` | `scripts/browser-certify.mjs` |
| Release | `npm run release:check` | `scripts/release-check.mjs` |

`npm run certify` records every top-level gate in the sole machine-readable result: `certification/certification.json`. `certification/REPORT.md` is generated from that source.

## Compatibility sub-gates

| Check | Command | Contract |
| --- | --- | --- |
| Contract compatibility | `npm run check:contracts-compat` | frozen v1 schemas remain shape-compatible |
| Public API compatibility | `npm run check:api-compat` | frozen named exports cannot disappear |
| Registry compatibility | `npm run check:registry-compat` | frozen semantic metadata/bindings cannot silently drift |
| Deprecations | `npm run check:deprecations` | planned removals use complete metadata |

## Architecture invariant → executable test/check map

The same 22-entry map is published as the generated `docs/INVARIANTS.md`; `architecture.json` is the authoritative source.

| Invariant | Named test/check | File |
| --- | --- | --- |
| `INV-001` UI claims cannot bypass policy/approval. | `INV-001 UI authority flags cannot bypass policy` | `tests/architecture/invariants.test.mjs` |
| `INV-002` Prompt text is not authorization. | `INV-002 prompt text cannot satisfy authorization` | `tests/architecture/invariants.test.mjs` |
| `INV-003` ACK is not verification. | `INV-003 acknowledged command can still fail verification` | `tests/architecture/invariants.test.mjs` |
| `INV-004` Renderer rejects executable/hostile payloads. | `renderer rejects nested hostile payloads at runtime without invoking accessors` | `tests/security/renderer.test.mjs` |
| `INV-005` Hardware safety remains an external dispatch precondition. | `INV-005 hardware safety state can deny an otherwise approved command` | `tests/architecture/invariants.test.mjs` |
| `INV-006` Foundation/domain dependencies stay one-way. | `INV-006 experimental domain fixture obeys one-way package boundaries` | `tests/packages/domain-boundary-fixture.test.mjs` |
| `INV-007` Frozen v1 contracts cannot mutate in place. | `INV-007 frozen v1 contract baseline remains compatible` | `tests/compatibility/contracts-compat.test.mjs` |
| `INV-008` Frozen public exports cannot disappear. | `INV-008 public API baseline exports remain available` | `tests/compatibility/public-api-compat.test.mjs` |
| `INV-009` Frozen registry semantics/bindings cannot silently drift. | `INV-009 registry baseline remains compatible` | `tests/compatibility/registry-compat.test.mjs` |
| `INV-010` Terminal states are irreversible. | `INV-010 terminal control states cannot transition back to active states` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-011` NACK cannot become verified. | `INV-011 NACK cannot transition to verified` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-012` Cancelled cannot become completed. | `INV-012 cancelled commands cannot transition to completed` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-013` Expired lease cannot authorize dispatch. | `INV-013 expired lease cannot authorize dispatch` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-014` Verification uses observed state, not ACK payload. | `INV-014 verification result is derived from observed state, not ACK payload` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-015` React adapter requires the declared host APIs. | `INV-015 React adapter rejects incomplete host contracts` | `packages/react/test/react-adapter.test.mjs` |
| `INV-016` Adapter primitives retain browser accessibility semantics. | `INV-016 React adapter primitives expose accessible browser semantics` | `tests/browser/browser-certification.browser.mjs` |
| `INV-017` Keyboard/focus behaviour is deterministic. | `INV-017 keyboard navigation and focus restoration pass` | `tests/browser/browser-certification.browser.mjs` |
| `INV-018` Dynamic command feedback uses a live region. | `INV-018 command feedback is exposed through a live region` | `tests/browser/browser-certification.browser.mjs` |
| `INV-019` Certified viewports have no horizontal overflow. | `INV-019 responsive viewport matrix has no horizontal overflow` | `tests/browser/browser-certification.browser.mjs` |
| `INV-020` Reduced-motion preference disables nonessential animation. | `INV-020 reduced motion disables nonessential animation` | `tests/browser/browser-certification.browser.mjs` |
| `INV-021` Forced-colors retains visible boundaries. | `INV-021 forced colors preserves control boundaries` | `tests/browser/browser-certification.browser.mjs` |
| `INV-022` Screenshot fixture stays within visual threshold. | `INV-022 screenshot visual regression remains within threshold` | `tests/browser/browser-certification.browser.mjs` |

## Browser visual baselines

`tests/browser/baselines/*.png` are reviewed inputs, not generated certification outputs. Certification only compares current screenshots to them. Update requires explicit human intent: `MAATAA_VISUAL_REVIEW=approved npm run visuals:update`. Normal certification cannot create or update a missing baseline. See `docs/VISUAL-REGRESSION.md`.

## Scope note

M2 automated accessibility checks are contract-level checks, not a complete WCAG conformance audit. M2 does not run axe-core or Playwright and does not certify the third-party React implementation. Exact certified and excluded surfaces are published in `docs/CERTIFIED-SURFACES.md` and `docs/NOT-CERTIFIED.md`. Browser-required versus tree-only gates are listed in `docs/GATE-MATRIX.md`.
