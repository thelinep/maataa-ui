# Architecture Invariant → Test Map

Generated from `architecture.json` for MAATAA UI 0.4.1. Do not edit manually.

| Invariant | Statement | Named test/check | File |
| --- | --- | --- | --- |
| `INV-001` | UI-supplied authority claims cannot bypass policy and approval. | `INV-001 UI authority flags cannot bypass policy` | `tests/architecture/invariants.test.mjs` |
| `INV-002` | Prompt text is not authorization. | `INV-002 prompt text cannot satisfy authorization` | `tests/architecture/invariants.test.mjs` |
| `INV-003` | Acknowledgement is not verification. | `INV-003 acknowledged command can still fail verification` | `tests/architecture/invariants.test.mjs` |
| `INV-004` | Renderer executes no payload code and rejects hostile data at runtime. | `renderer rejects nested hostile payloads at runtime without invoking accessors` | `tests/security/renderer.test.mjs` |
| `INV-005` | Hardware safety readiness and active interlocks remain external preconditions to dispatch. | `INV-005 hardware safety state can deny an otherwise approved command` | `tests/architecture/invariants.test.mjs` |
| `INV-006` | Foundation packages never depend on domain packs; experimental domain packs may depend only on approved foundation packages. | `INV-006 experimental domain fixture obeys one-way package boundaries` | `tests/packages/domain-boundary-fixture.test.mjs` |
| `INV-007` | Frozen v1 contracts cannot change shape or identity without a new contract version. | `INV-007 frozen v1 contract baseline remains compatible` | `tests/compatibility/contracts-compat.test.mjs` |
| `INV-008` | Frozen public package exports cannot be removed from the 0.3.x API surface. | `INV-008 public API baseline exports remain available` | `tests/compatibility/public-api-compat.test.mjs` |
| `INV-009` | Frozen registry entries cannot silently change identity, authority class, package, headless status, schema binding, or supported states. | `INV-009 registry baseline remains compatible` | `tests/compatibility/registry-compat.test.mjs` |
| `INV-010` | Terminal control states cannot transition back to active states. | `INV-010 terminal control states cannot transition back to active states` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-011` | NACK cannot transition to verified. | `INV-011 NACK cannot transition to verified` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-012` | Cancelled commands cannot transition to completed. | `INV-012 cancelled commands cannot transition to completed` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-013` | Expired leases cannot authorize dispatch. | `INV-013 expired lease cannot authorize dispatch` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-014` | Verification is derived from observed state rather than acknowledgement payload. | `INV-014 verification result is derived from observed state, not ACK payload` | `tests/control/lifecycle-invariants.test.mjs` |
| `INV-015` | The React adapter rejects hosts that do not satisfy its declared host contract. | `INV-015 React adapter rejects incomplete host contracts` | `packages/react/test/react-adapter.test.mjs` |
| `INV-016` | React adapter primitives preserve native accessible semantics in a real browser. | `INV-016 React adapter primitives expose accessible browser semantics` | `tests/browser/browser-certification.browser.mjs` |
| `INV-017` | Keyboard navigation and focus restoration remain deterministic. | `INV-017 keyboard navigation and focus restoration pass` | `tests/browser/browser-certification.browser.mjs` |
| `INV-018` | Dynamic command feedback is exposed through a live region. | `INV-018 command feedback is exposed through a live region` | `tests/browser/browser-certification.browser.mjs` |
| `INV-019` | Certified responsive viewports do not introduce horizontal overflow. | `INV-019 responsive viewport matrix has no horizontal overflow` | `tests/browser/browser-certification.browser.mjs` |
| `INV-020` | Reduced-motion preference disables nonessential animation. | `INV-020 reduced motion disables nonessential animation` | `tests/browser/browser-certification.browser.mjs` |
| `INV-021` | Forced-colors mode preserves visible control boundaries and focus. | `INV-021 forced colors preserves control boundaries` | `tests/browser/browser-certification.browser.mjs` |
| `INV-022` | Certified visual fixtures remain within the screenshot regression threshold. | `INV-022 screenshot visual regression remains within threshold` | `tests/browser/browser-certification.browser.mjs` |

Total mapped invariants: **22**.
