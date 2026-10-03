# MAATAA UI Roadmap

This file is the concise milestone index. The detailed critical path, dependencies, and exit evidence are maintained in [`docs/FINAL-RELEASE-ROADMAP.md`](docs/FINAL-RELEASE-ROADMAP.md). M2's 0.4.1 closeout remains a completed historical baseline; it is not the current product release or evidence of production readiness.

## M0R — Retrospective foundation reconciliation — COMPLETE

Historical foundation findings were recorded and dispositioned in `docs/M0R-FINDINGS.md`. Deferred certification remains outside the M2 claim.

## M1 — Contract/API freeze — 0.3.3 — COMPLETE AFTER RECONCILIATION

Compatibility contracts, public API and registry baselines, deprecation metadata, and lifecycle invariants were frozen and reconciled.

## M2 — Browser and React adapter certification — 0.4.1 — COMPLETE HISTORICAL BASELINE

The 0.4.1 closeout is complete under `docs/M2-CLOSEOUT.md` and `RELEASE.md`'s historical acceptance record. It certifies only the documented M2 surface and exclusions; it does not establish broader product integration, migration readiness, or production deployment.

## M3 — Product integration — IN PROGRESS

Scope is the bounded TLPS spatial-preview route `/mobile/223/3d-cad-previz`. M3.1 baseline inventory and M3.2 runtime/simulator-adapter integration are complete. M3.3A selected `eventsspatial.spatial_layouts` as the authoritative save target, with `exhibition_layouts` retained as a distinct venue/exhibition deliverable. M3.3 local contract semantics, fixture host, and route conformance are implemented and validated; verified host binding and overall M3 acceptance remain incomplete.

M3 does not claim physical-camera certification, a production host, all-route completeness, migration readiness, or deployment approval. The 11 unresolved route findings remain open for broader product-completeness claims. See [`docs/M3-PRODUCT-INTEGRATION-SCOPE.md`](docs/M3-PRODUCT-INTEGRATION-SCOPE.md) and the detailed release roadmap.

## M4 — Migration readiness — BLOCKED / INCOMPLETE

Prepare a target-bound, reviewed migration plan. Real provider/version, target baseline/history, upgrade diffs, compatibility rehearsal, backup/restore proof, and recovery ownership remain required. A reviewed plan is not execution approval. See [`packages/domain-registry/MIGRATION-READINESS-PLAN.md`](packages/domain-registry/MIGRATION-READINESS-PLAN.md).

## M5 — Migration execution — NOT AUTHORIZED

Execution requires separate explicit approval bound to the provider, target environment, exact migration hash, execution window, and operator. Record the result and post-migration checks.

## M6 — Deployment and final release — NOT AUTHORIZED

Deployment requires a separate explicit approval bound to exact application artifacts, environment, rollout window, health gates, and responsible operator. Publish a release record only after the declared production checks pass.

## Release boundary

The completed 0.4.1/M2 baseline is historical certification evidence. The spatial M3 slice is not yet complete. No roadmap status grants migration or deployment authority. Detailed sequencing and release-wide exit criteria are in [`docs/FINAL-RELEASE-ROADMAP.md`](docs/FINAL-RELEASE-ROADMAP.md).
