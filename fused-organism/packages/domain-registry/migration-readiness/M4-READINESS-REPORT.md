# MAATAA M4.1–M4.2 Readiness Report

**Result:** M4.1 is **BLOCKED for release readiness** because only local targets are declared. M4.2 is **PARTIAL**: no non-local target diff has been generated.

## Current schema proof

- 352 canonical contracts; contract hash `023f98b55c0be84ad6b0bf5f80d95a80d515c92069ba36057f66a9b0f484bcfa`.
- Logical schema hash `5638ba9529982882b04c2a5014d8b5b3923c1a661ccb27ec6b556386ff324da5`; FK/relation closure PASS.
- PostgreSQL and SQLite Prisma validation PASS; the saved schema proof records 43/43 tests and registry validation PASS. These are baseline proof results, not a fresh rerun for this local recovery rehearsal.
- Registry hash `581b7df1a87592e24e955c8ca0460fe97ef40e1e398afc5dce6d21ac1701d58f`; source worktree was dirty.
- 11 unresolved routes remain informational.

## Target inventory

- Operational applications represented: **3**.
- Environments declared: **3**.
- Database targets declared / verified / conflicted / unknown: **3 / 3 / 0 / 0**.
- Local development targets: **3**; non-local targets: **0**.
- Provider counts: PostgreSQL 0, SQLite 3, libSQL 0, MySQL 0, other 0.
- Control-plane hash: `1cadfce380dddbc86f1b2aa54be3402b5f4d2c5380e1f94b7329508339732629`; target-inventory hash: `2aae8b4e1aacf3bb425b8502fdbf7aa56c745ef8ca547852fa5b0d1b6ab75308`.
- MAATAA, TLPS, and the shared data owner resolve from `control-plane/application-registry.json`; the four composition proof apps remain in `applications/registry.json`.
- Three local SQLite files were inspected and verified by recorded hashes, SQLite integrity checks, and foreign-key checks. These local targets do not satisfy hosted/staging/production target evidence. No remote database was contacted.
- See `targets.json`, `baseline-inventory.json`, `migration-history-inventory.json`, and `../control-plane/evidence/local-development/target-verification.json`.

## M4.2 artifacts

| Provider | Empty-state bootstrap | SHA-256 | Target upgrade diff |
|---|---|---|---|
| PostgreSQL | `migration-preview.global.postgresql.bootstrap.sql` | `e195cf475a8aecaf1259c8c76846ec7e7d1229aee1f0627edd04a45790d53c71` | **Not generated — NO_NONLOCAL_TARGET_DIFF_INPUT** |
| SQLite | `migration-preview.global.sqlite.bootstrap.sql` | `f232aded3034253a85bfc469d0029fcd3339a7e691b39dbd3168fa91c9292021` | **Not generated — NO_NONLOCAL_TARGET_DIFF_INPUT** |

These are empty-state previews, not target-bound upgrades, reviewed migrations, executable artifacts, or deployment approval. Both now append all five provider-specific Communications invariants after the base schema DDL. PostgreSQL has static projection review; SQLite enforcement has in-memory behavioral checks and is included in the local shared SQLite fixture. No live provider execution occurred. SQLite evidence does not establish libSQL compatibility. See `provider-invariant-plan.json` and each bootstrap metadata file.

## Gate status

| Gate | Status |
|---|---|
| M4.1 Targets and baselines | **BLOCKED** |
| M4.2 Provider diffs | **PARTIAL** |
| M4.3 Compatibility rehearsal | **BLOCKED** |
| M4.4 Backup and restore | **LOCAL REHEARSAL PASS; RELEASE BLOCKED** |
| M4.5 Recovery plan | **BLOCKED — no target-specific change to rehearse** |
| M4.6 Plan review | **NOT READY** |

Provider enforcement status: **integrated in both empty-state bootstrap previews**. All five invariant names match the canonical Communications contracts and provider crosswalk. PostgreSQL remains static-review evidence; SQLite behavior checks passed in memory and the shared local SQLite fixture has eight triggers plus the active-episode partial unique index. The three local target diffs are no-op SQLite comparisons; no non-local target diff has been generated and neither provider has been exercised on a live release target.

- **M4.1:** BLOCKED (`NO_NONLOCAL_TARGET_DECLARED`); three local-development targets have recorded baselines and histories.
- **M4.2:** PARTIAL; no non-local target diff generated. Local owner databases are development fixtures, not release targets.
- **M4.3:** BLOCKED; no representative target data compatibility rehearsal.
- **M4.4:** Local backup/restore rehearsal PASS for three empty SQLite fixtures; release recovery remains blocked pending representative data, recovery objectives, and a non-local target rehearsal.
- **M4.5:** BLOCKED; the target diffs are no-op and there is no release change to rehearse for rollback/forward recovery.
- **M4.6:** NOT READY; no target-bound migration-plan review or written approval exists.
- Local database files inspected / created: **YES / YES**; integrity and FK checks: **PASS**. Remote/hosted database contacted / mutated: **NO / NO**. Migration execution/deployment approval: **NOT GRANTED / NOT GRANTED**.

## Local target diff and recovery evidence

Three target-bound SQLite diffs were generated against the verified local MAATAA (25 tables), shared (118 tables), and TLPS (209 tables) owner projections. All three are no-op diffs; they do not represent staging or production upgrade plans. See `target-diffs/local-development/` for SQL and hash-bound metadata.

Backup and restore were rehearsed with SQLite's online backup API for all three local targets. The restored databases matched their source schema-object inventories, had `integrity_check=ok`, zero foreign-key violations, and zero rows. Evidence: `fused-organism/packages/domain-registry/migration-readiness/recovery-rehearsals/sqlite-local-recovery-20261003T231201Z.json`. This does not establish recovery of representative business data or a hosted target.

Migration plan review is **NOT READY** and written migration approval is **NOT GRANTED**. Written deployment approval is **NOT GRANTED**. No migration execution or deployment is authorized.

## Next safe action

Designate the intended non-local staging or production application/environment and exact provider/engine version. Capture its read-only baseline and migration history, or explicitly attest a new empty target. Then generate and review a target-bound diff. The local SQLite targets do not substitute for that release evidence. No migration execution or deployment is authorized until the exact target, migration, recovery plan, and separate written approvals are bound together.
