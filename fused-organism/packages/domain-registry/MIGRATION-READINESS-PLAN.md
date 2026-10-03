# MAATAA M4 — Migration Readiness and Controlled Change

**Purpose:** turn the canonical, database-neutral schema into provider-specific migration plans that can be reviewed, rehearsed, and separately authorized. This document is a plan. It grants no migration or deployment permission.

## Current evidence and boundary

The current global schema proof is recorded at `fused-organism/certification/global-schema-release-proof.md`.

| Evidence | Current value |
|---|---|
| Canonical contract set | 352 tables; SHA-256 `023f98b55c0be84ad6b0bf5f80d95a80d515c92069ba36057f66a9b0f484bcfa` |
| Logical schema | SHA-256 `5638ba9529982882b04c2a5014d8b5b3923c1a661ccb27ec6b556386ff324da5` |
| PostgreSQL / SQLite Prisma previews | Both validate against that logical hash |
| Global migration previews | `migrationPreviewValid: false` for both providers; no global provider SQL migration artifacts are present |
| Available migration SQL | Communications DRAFT closure only: 14 tables (9 Communications, 4 Organisation, `identity.users`) |
| Communications preview state | DRAFT; SQL preview metadata says valid, but migration approval and deployment approval are false |
| Target environments | No provider version, target database, existing schema/migration history, data volume, or operational SLO is recorded here |

Therefore, the current proof establishes **schema readiness**, not compatibility with a live database, a complete global migration diff, a backup capability, or a recoverable production change.

## Provider-specific findings

The provider previews share the same database-neutral Communications contract and logical-schema hash, but their enforcement SQL differs.

| Area | PostgreSQL projection | SQLite projection | Required migration review |
|---|---|---|---|
| UUID representation and ordering | Native UUID comparison in the ordered participant-pair check | Canonical UUID text normalization and comparison in triggers | Prove existing identifiers are canonical and that comparisons preserve the logical rule |
| Announcement audience scope | `CHECK` constraint | `BEFORE INSERT` and `BEFORE UPDATE` triggers | Test nullability transitions and updates as well as inserts |
| Direct-message parent kind/scope | Trigger functions and triggers | Trigger definitions | Test parent changes, mapping writes, and referential actions on each supported engine/version |
| Membership episode immutability | Trigger function and trigger | Trigger definition | Verify all permitted terminal transitions and reject reopen/rekey attempts |
| At most one active membership episode | Partial unique index | Partial unique index | Verify existing duplicate-active rows are detected/remediated before index creation |
| Physical naming | Deterministic shortened names were added after PostgreSQL’s 63-byte identifier limit was hit | Provider-specific emitted names | Check collisions, truncation, and stable-name behavior across the full global schema |

Communications preview evidence is bound to contract hash `41ac98624962fdd44140016c65c8a5e30cffce35ef68c3eb5dbfae788f9d1352`. The current PostgreSQL migration SQL SHA-256 is `2c3c0917311e36a36764f12be425c5f09e71e6eef4f824c07a06b49483f974cf`; SQLite is `b41aae0b469c733960734935f5cd964301022d4cc9868622b9d2f3d985a755e5`. These are **review inputs**, not approved executable migrations.

The provider enforcement plan labels PostgreSQL checks/triggers as statically reviewed and SQLite behavior checks as passing. Neither claim is a live-target rehearsal. In particular, Prisma's schema/diff tooling does not report unsupported database features such as triggers; review the provider enforcement overlays independently and compare them to each generated migration. See Prisma's [migration diff limitations](https://www.prisma.io/docs/cli/v7/migrate/diff) and [unsupported database features](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/unsupported-database-features).

## Milestone sequence

### M4.1 — Select targets and record compatibility baselines

For every intended target, record provider and exact engine version, environment, database/schema identity, extensions and privileges, current schema and migration history, application versions that will overlap the change, data volume, write/read patterns, maintenance window, availability objective, and recovery point/time objectives. Decide whether SQLite/libSQL is a production target, a local/edge projection, or both; do not treat SQLite and libSQL as interchangeable without testing the actual runtime.

Capture an authoritative schema-only baseline and migration history from each existing database. Compare the baseline to the expected pre-migration state and investigate drift before generating a change. If a target is new and empty, record that fact and keep the empty-database bootstrap path distinct from an in-place upgrade.

**Exit:** target inventory and baselines are reviewed; provider/version compatibility is known; drift is resolved or explicitly dispositioned.

### M4.2 — Generate and review provider-specific diffs

Generate global PostgreSQL and SQLite migration candidates from the exact canonical contract/logical hashes above, then bind each output to its provider, schema hash, target baseline hash, generator/Prisma version, and source commit. Generate both an empty-database bootstrap and each required existing-target upgrade path.

Review SQL operation by operation: object creation/deletion/rename, type conversions, nullability/default changes, unique and partial indexes, FK actions, enum representation, triggers/functions/checks, physical identifiers, lock/rewrite risk, statement ordering, and any data backfill. Compare the Prisma-produced SQL with the separately authored enforcement overlays. Prisma `migrate deploy` does not detect schema drift or prove the order is safe, so independently compare the target baseline and pending migration history before any application.

For SQLite, identify table-rebuild operations, FK enforcement and connection settings, trigger/index preservation, and WAL/journal-mode effects. For PostgreSQL, identify index-build strategy, long-running locks, extension/role privileges, trigger/function ownership, and transaction boundaries. Use the actual provider versions and representative data to establish compatibility; do not infer it from `prisma validate`.

**Exit:** provider diffs are reviewed and hash-bound; no unclassified destructive or unsupported change remains; each deferred logical invariant has an explicit provider enforcement artifact and test evidence.

### M4.3 — Prove application and data compatibility

Use a staged expand/backfill/contract plan where old and new application versions may overlap. Make backfills restartable and observable; define preconditions, batching, idempotency, validation queries, and stop thresholds. Prove tenant/workspace boundaries and FK closure against representative data. Test constraints against existing rows before enabling them, including uniqueness and partial-unique conditions.

Rehearse the exact migration and backfill against a production-like clone. Record duration, locks, peak resource use, application errors, queue lag, and post-migration correctness checks. Confirm the previous app version remains safe during the compatibility window or define the coordinated outage/rollback behavior.

**Exit:** test evidence is tied to exact migration hashes and representative baseline data; measured impact fits the approved operational window.

### M4.4 — Approve and rehearse backup and recovery

For PostgreSQL, choose the recovery objective first. The operator plan should specify a verified pre-change backup and, when point-in-time recovery is required, a tested base-backup plus WAL-archive recovery path. A logical dump can supplement recovery/portability but is not by itself a point-in-time recovery plan. Restore into an isolated target, validate row counts and application invariants, and measure achieved recovery time. PostgreSQL documents SQL dumps, file-level backups, and continuous archiving/PITR as distinct strategies: [Backup and Restore](https://www.postgresql.org/docs/current/backup.html).

For SQLite, record journal mode, file placement, concurrent-reader/writer behavior, and backup mechanism. Prefer a consistent live-database backup mechanism such as the SQLite Online Backup API or `VACUUM INTO` over an uncoordinated file copy. Restore the resulting snapshot into an isolated location, run integrity checks, and verify application-level invariants. Include WAL handling in the rehearsed procedure: [SQLite Online Backup API](https://www.sqlite.org/backup.html) and [Write-Ahead Logging](https://www.sqlite.org/wal.html).

The current repository does not identify an operator, backup service, retention window, encryption/key recovery process, restore target, or completed restore rehearsal. These remain open planning items.

**Exit:** backup is fresh, integrity-checked, restorable, access-controlled, and meets the recorded recovery objectives; the restore rehearsal is attached to the exact migration candidate.

### M4.5 — Define rollback and forward-recovery procedures

For each migration, name the rollback trigger, decision owner, detection window, and exact recovery path. Separate:

1. **Pre-commit failure:** stop the release and use the provider's tested transaction/statement recovery behavior; do not assume all DDL is transactionally reversible.
2. **Post-commit, before incompatible writes:** use a reviewed down/compensating migration only if it is demonstrably safe and tested against the migrated clone.
3. **After data has been written in the new shape:** prefer a tested forward repair or restore/PITR to the approved recovery point. State the data loss window and reconciliation steps; a schema rollback alone does not reverse application writes.

For SQLite table rebuilds, verify the recovery path preserves data, indexes, FKs, triggers, and application continuity. For PostgreSQL trigger/index/function overlays, include their removal or replacement order in the rollback/forward plan. Rehearse at least one failure after partial progress, and verify restore rather than assuming a generated reverse diff is safe.

**Exit:** rollback/forward-recovery rehearsal passes; data-loss and downtime consequences are explicit; on-call and decision owners are named.

### M4.6 — Separate approvals, then execute only the approved change

Approval records must bind to the exact provider-specific migration hashes, target baseline hash, backup/recovery evidence, test/rehearsal evidence, and deployment artifact.

- **Migration-plan review:** accepts the proposed SQL, compatibility, backup, and recovery plan. It does not permit execution.
- **Migration-execution approval:** names one provider, one target environment, one migration hash, one execution window, and one operator. Without this explicit approval, execution remains forbidden.
- **Deployment approval:** separately names the application artifact, environment, rollout/health gates, and rollback owner. It is not implied by migration approval.

The actual deploy workflow should use committed, reviewed migrations and the production migration command documented by Prisma; development reset/push workflows are not substitutes. Prisma also documents that deployment applies pending migrations non-interactively and does not detect drift, so the baseline/drift gate above remains mandatory: [development and production workflows](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production).

**Exit:** all required approvals exist and match the candidate hashes. If any hash, target, or plan changes, approval must be refreshed. Execution and deployment are separate recorded events with separate evidence.

## Current open blockers

1. No target database/provider versions or authoritative target baselines are recorded.
2. No global 352-table migration SQL preview exists; global metadata currently has `migrationPreviewValid: false` for both providers.
3. Existing Communications SQL previews are DRAFT and cover only the 14-table closure, not the global schema.
4. No production-like data compatibility rehearsal has been recorded.
5. No backup service, recovery objectives, or successful restore rehearsal are recorded.
6. No tested rollback/forward-recovery procedure or named operator/decision owner is recorded.
7. Migration execution and deployment approvals are both **NOT GRANTED**.

## Release boundary

`SCHEMA_READY` remains a property of the canonical schema. It is not a migration approval, backup certification, target compatibility result, or deployment approval. This milestone closes only when the evidence above is complete; applying SQL and releasing an application still require their own explicit approvals.
