# Release Acceptance Gates

This checklist separates the completed M2 historical baseline from the current M3 product slice and later operational gates. Record evidence against the exact source snapshot and artifact hashes being accepted. A gate remains open when evidence is absent; do not infer it from an earlier milestone.

## M2 — 0.4.1 historical certification

**Status: COMPLETE as the documented historical baseline.** Reproduce with the M2 closeout command set when verifying that baseline. Preserve the certified Chromium policy, generation drift, lint, boundaries, exports, tests, build, browser/visual evidence, changelog, and certification records. The M2 certificate applies only to the surface in `docs/CERTIFIED-SURFACES.md` and exclusions in `docs/NOT-CERTIFIED.md`; it is not current M3, migration, or production-release evidence.

## M3 — bounded product integration

**Status: IN PROGRESS.** Selected slice: TLPS route `/mobile/223/3d-cad-previz`.

Recorded progress: M3.1 inventory and M3.2 simulator-adapter integration complete; M3.3A domain choice complete (`spatial_layouts` is the save authority; `exhibition_layouts` remains distinct); M3.3B local contract semantics frozen; M3.3C in-memory fixture host and M3.3D editable route integration implemented. The local contract validator, focused create/update/conflict/tenant/permission tests, build, and browser checks are recorded in the current task result. No API Studio product, authenticated/durable host, or production database transaction is claimed.

Before accepting M3, attach evidence for each item:

- [ ] Exact clean source commit, selected route, package/API versions, contract-set hash, and generated evidence hashes.
- [x] Local spatial payload, versioning, validation, conflict, and fixture-permission semantics are frozen; external host identity and production policy remain separate.
- [ ] Deterministic API IR validation and conformance results. Clearly label fixture/local simulation separately from authenticated, persistent host integration.
- [ ] Route consumes the contract through the intended adapter; reads/writes and failure paths have focused tests and browser evidence.
- [ ] Actor and authorization behavior are accurately described. UI role previews or local fixture actors are not server-side authorization evidence.
- [ ] Build, relevant tests, package boundaries, keyboard/focus/accessibility, and applicable responsive/browser checks pass on the exact snapshot.
- [ ] Scope, unresolved routes, demo/fixture data, unavailable host capabilities, and camera-certification exclusions are reported.

M3 acceptance does not certify physical cameras, all TLPS routes, all requested MAATAA applications, schema migration, or deployment. Broader product-completeness claims remain blocked while unresolved authoritative route findings remain.

## M4 — migration readiness

**Status: BLOCKED / INCOMPLETE.** Acceptance requires evidence tied to a real target and exact baseline:

- [ ] Provider, exact version, environment, existing schema baseline, migration history, privileges, data characteristics, and operational objectives verified.
- [ ] Target-specific upgrade diffs generated and reviewed operation by operation; bootstrap candidates are not upgrade diffs.
- [ ] Provider-specific deferred invariants and compatibility/backfill behavior reviewed and rehearsed against representative data.
- [ ] Backup method and recovery objectives selected; isolated restore rehearsal succeeds.
- [ ] Rollback or forward-recovery path rehearsed; decision owner and operator named.
- [ ] Migration plan binds exact target, baseline, migration hash, review evidence, and recovery evidence.

M4 plan acceptance does not authorize migration execution.

## M5 — migration execution

**Status: NOT AUTHORIZED.** Before execution, require a separate explicit approval bound to all of:

- [ ] Provider and exact target environment.
- [ ] Exact reviewed migration hash and baseline.
- [ ] Approved execution window and named operator/decision owner.
- [ ] Verified preflight and backup/restore evidence.
- [ ] Approved recovery procedure and stop conditions.

After execution, record actual commands/results, resulting schema and data checks, exceptions, duration, and decision. Migration approval does not authorize deployment.

## M6 — deployment and final release

**Status: NOT AUTHORIZED.** Before deployment, require a separate explicit approval bound to all of:

- [ ] Exact application artifacts, source commit, API contract, and schema/migration hashes.
- [ ] Target environment, rollout window, named operator, and decision owner.
- [ ] Monitoring, health gates, rollback/recovery owner, and support/incident coverage.
- [ ] Production authentication and server-side authorization evidence for the claimed workflows.

The final release record must report scope, hashes, migration outcome, deployment outcome, post-release checks, known limitations, and approval references. A passing test/build or a reviewed migration plan alone is not deployment authorization.

## Approval separation

Keep the following statuses distinct and evidence-backed:

```text
schema readiness
M3 product-slice acceptance
M4 migration-plan review
M5 migration execution approval
M6 deployment approval
```

No status automatically grants the next. See [`../ROADMAP.md`](../ROADMAP.md), [`../RELEASE.md`](../RELEASE.md), and [`../docs/FINAL-RELEASE-ROADMAP.md`](../docs/FINAL-RELEASE-ROADMAP.md) for the milestone index, release contract, and detailed sequence.
