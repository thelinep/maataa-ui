# M0R Findings and Disposition

M0 was not executed as a named milestone before M1. M0R is therefore a **retrospective foundation audit**, not rewritten history.

Blocking findings remaining: 0

The original foundation concerns and their disposition before M3 are:

| ID | Finding | Disposition | Evidence / owner |
| --- | --- | --- | --- |
| M0-F01 | Root workspace/toolchain was missing or contradictory. | **RESOLVED** | npm-only root workspace, lockfile, Node/npm pin, toolchain gate. |
| M0-F02 | Fresh-clone reproducibility was not proven. | **RESOLVED** | Empty-cache offline `npm run fresh-clone`. |
| M0-F03 | Root governance/release/security documents were incomplete. | **RESOLVED for scaffold** | README, LICENSE, CONTRIBUTING, SECURITY, GOVERNANCE, RELEASE, CODEOWNERS, acceptance docs. Connected external audit remains deferred. |
| M0-F04 | Tests were placeholders. | **RESOLVED for active kernel/M2** | Node, contract, control, security, registry, package, React-adapter, browser and visual tests now execute. Protocol/HIL/pentest coverage is deferred. |
| M0-F05 | Core primitives were incomplete. | **RESOLVED at headless contract inventory; visual breadth deferred** | 38 core primitive names exist; M2 browser-certifies only the surfaces named in `docs/CERTIFIED-SURFACES.md`. Full rendered implementations are not claimed. |
| M0-F06 | Package boundaries/overlap were ambiguous. | **RESOLVED for active kernel** | 11-package surface, BOUNDARIES.json, executable domain fixture, one-way dependency invariant. Broader domain package promotion is deferred. |
| M0-F07 | Safety/control lifecycle components were missing. | **RESOLVED at supervisory/headless level** | command ACK/NACK/cancel/timeout/rejection, leases, handover, interlock/safety status, audit/provenance and lifecycle invariants. Safety-rated hardware remains explicitly excluded. |
| M0-F08 | Schemas/registry were manual and drift-prone. | **RESOLVED** | generated schemas/contract manifest/registry/API manifest plus drift and compatibility gates. |
| M0-F09 | Registry entries could be unbound. | **RESOLVED** | all current registry entries are `headless-bound` to executable package exports and checked by `check:registry-bindings`. Rendering is not implied. |
| M0-F10 | React dependency and host boundary were unclear. | **RESOLVED for M2** | optional host peer policy, ADR-002/004, React policy gate, shipped/deferred hook map. |
| M0-F11 | AI/agent UI breadth exceeded verification. | **DEFERRED — non-blocking** | Active AI package remains headless/advisory. Additional agent/memory/prompt/product surfaces require their own tests before promotion. |
| M0-F12 | Security/a11y governance was documented more broadly than enforced. | **PARTIALLY RESOLVED / DEFERRED** | hostile-renderer/runtime checks and M2 browser accessibility contracts execute; full WCAG, manual AT, penetration testing and external audit remain not certified. |
| M0-F13 | Apps/examples/docs were uneven. | **RESOLVED for certified workflows; broader examples deferred** | docs app, reference-control app, browser-cert app, camera scenario, failure matrix, M0–M2 docs. Domain examples wait for domain promotion. |
| M0-F14 | Naming/taxonomy inconsistency could grow. | **RESOLVED at package boundary; component taxonomy deferred** | 11 active packages and registry IDs are frozen. A broad Card/Panel/View naming normalization is not a release blocker and must use deprecation rules if changed. |
| M0-F15 | Browser runtime/version evidence was too broad (`>=120`). | **RESOLVED in 0.4.1** | Exact Chromium `144.0.7559.96` is pinned and enforced. |
| M0-F16 | Browser-tool choice, visual mechanics and certified surface were under-documented. | **RESOLVED in 0.4.1** | ADR-005, GATE-MATRIX, VISUAL-REGRESSION, CERTIFIED-SURFACES, REACT-SURFACE, NOT-CERTIFIED. |

## Deferred items are not hidden blockers

The deferred items above are outside the M2 claim. They become blocking only when a future milestone attempts the corresponding claim: cross-browser release, full WCAG conformance, real protocol/device control, HIL/safety certification, public package publication, or expanded rendered component/domain support.
