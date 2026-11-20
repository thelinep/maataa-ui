# MAATAA / TLPS Data Ownership Declaration

**Version:** 0.2

**Status:** DECIDED FOR LOCAL DEVELOPMENT; production ownership approval and deployment targets remain unverified

**Canonical contract-set SHA-256:** `023f98b55c0be84ad6b0bf5f80d95a80d515c92069ba36057f66a9b0f484bcfa`

## Product boundary

All 352 canonical table contracts are assigned to one of three logical data owners:

- **MAATAA** owns the `platform` context (25 tables): platform control-plane settings, integrations, feature flags, and retention capabilities.
- **Shared** owns `identity`, `organisation`, `project`, `evidence`, `intelligence`, `communications`, and `public` (118 tables): cross-product identity, tenancy, project, governance, intelligence, communication, and public-surface capabilities.
- **TLPS** owns `creative`, `people`, `production`, `logistics`, `campaign`, `marketplace`, `finance`, `investor`, and `eventsSpatial` (209 tables): event, production, commerce, finance, investor, and spatial business workflows.

The table-level assignment is recorded in [`data/ownership/product-ownership.v1.json`](data/ownership/product-ownership.v1.json). Context names remain domain boundaries; this document explicitly supplies the product/service owner. Shared data has one shared service authority and is not duplicated into the MAATAA or TLPS databases.

## Cross-owner foreign keys

The canonical database-neutral contracts remain unchanged. All **1,491** canonical foreign-key constraints divide into **654 same-owner physical constraints** and **837 cross-owner service references**. The full edge-by-edge map is in [`data/ownership/cross-owner-references.v1.json`](data/ownership/cross-owner-references.v1.json).

An owner-local SQLite projection keeps the source reference columns and removes a physical SQLite FK only when its target lives in another owner's database. The source service validates new references with the target owner's authenticated `reference.resolve` operation and records an inbound reference with idempotent retry. The target owner enforces `restrict` by checking its inbound-reference index; for `set-null`, it asks the source owner to clear the nullable reference and waits for acknowledgement before final deletion. These cross-service operations require durable retry/outbox behavior; cross-service cascades are not used. An unavailable target/reference service fails closed for writes and deletion.

These operation names define the boundary only. They do not claim that API endpoints, authentication, inbound indexes, or retry workers have already been implemented. Service URLs and trusted actor/scope claims must be bound in the API/control-plane work before runtime use. Application code must not query another owner's local SQLite file directly.

## Local development databases

Three empty schema-only SQLite development databases have been created under `fused-organism/.local-dev/databases/`:

- `maataa.db` — 25 tables, 129 indexes, 12 same-owner FK constraints, 75 cross-owner references.
- `tlps.db` — 209 tables, 1,186 indexes, 255 same-owner FK constraints, 762 cross-owner references.
- `shared.db` — 118 tables, 494 indexes, 387 same-owner FK constraints, 0 outbound cross-owner references.

The checked-in generator [`scripts/create-local-owner-databases.py`](scripts/create-local-owner-databases.py) derives these from the canonical SQLite bootstrap and ownership map; it refuses to replace existing databases unless `--replace` is given because replacement discards local data. Generated files are git-ignored.

SQLite needs JSON object/array defaults expressed as quoted text, so the local projection normalizes `DEFAULT {}` to `DEFAULT '{}'` and `DEFAULT []` to `DEFAULT '[]'`. The canonical contracts are not changed by that SQLite-specific representation. `PRAGMA foreign_key_check` passes on each empty database. The source SQLite bootstrap reports five logical invariants not projected into provider constraints; these files do not claim complete invariant enforcement. They are local development fixtures, not production targets, migration baselines, or libSQL compatibility certification.

## Release boundary

This allocation and the three local files do **not** establish production ownership sign-off, a verified environment, provider/version baselines, migration approval, or deployment approval. Production targets still need accountable service owners, registered application environments, exact database identities, secrets by reference, and compatibility evidence. Migration planning and execution remain separately gated.
