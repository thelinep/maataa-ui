# MAATAA Data Ownership Declaration

**Version:** 0.1
**Status:** PROPOSED — ownership allocation not approved
**Snapshot base:** `b25ee75e1f7ac6a2b378a531a4249fb4846d1475`

## Declaration

This version records the currently supportable data boundary. It does not assign canonical tables to MAATAA, TLPS, or another product, and it does not authorize creating, migrating, or deploying a database.

- The Domain Registry is the canonical, database-neutral definition of 352 table contracts. A context label identifies a schema context; it does not by itself identify the application or product that owns the persisted data.
- The current Control Plane manifest represents four reference applications and declares zero environments and zero database targets. It does not yet register MAATAA and TLPS as deployment owners.
- No local SQLite database files or verified database targets are present in the inspected repository state.
- The canonical table contracts contain 1,491 foreign keys. Of these, 1,154 cross context boundaries, spanning 64 directed context edges. A per-application or per-context database split therefore requires an explicit ownership map and a reviewed plan for every cross-owner relationship.
- PostgreSQL and SQLite bootstrap files are schema previews. They are not target-bound migrations. SQLite validation does not establish libSQL compatibility.

## Ownership rule for this version

Until a table-level ownership map is reviewed and approved, physical owner for every canonical table is **UNASSIGNED**. No database named `maataa.db`, `tlps.db`, or `<domain>.db` is implied by this declaration.

Future target declarations should be scoped to an application environment. A database-per-product layout may be evaluated after the table ownership map and cross-product relation strategy are complete. Bounded contexts remain logical schema boundaries and do not automatically become database boundaries.

## Release and migration boundary

The 352-table logical schema and provider projections remain schema artifacts. A real target still requires an accountable owner, application and environment assignment, provider and engine version, target identity, verified baseline or verified-empty evidence, migration history, and runtime compatibility evidence. Migration-plan review, migration execution approval, and deployment approval remain separate decisions.

## Conditions to advance this declaration

1. Register MAATAA and TLPS as distinct applications in the authoritative application registry.
2. Assign each canonical table to an owning product or explicitly shared service.
3. Resolve cross-owner foreign keys through a shared relational boundary or reviewed service/API references; do not silently drop referential guarantees.
4. Select actual environment targets and record their verified identities and baselines.
5. Reconcile provider-specific invariants into the full provider bootstrap and target-bound diffs.

This declaration is a versioned proposal for review. It becomes an approved ownership policy only through a separate explicit review decision bound to this exact commit/tag.
