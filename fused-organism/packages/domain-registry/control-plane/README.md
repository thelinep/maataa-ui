# MAATAA Control Plane Manifest

This package adds a typed, declarative configuration layer to the existing Domain Registry. The Domain Registry Application Registry remains the authority for application IDs and names; this manifest references those IDs and owns the typed environment, infrastructure, and policy declarations used by migration planning. The admin-template platform screen remains a local preview and is not read as infrastructure truth.

## Data flow

```text
control-plane/manifest.ts
  → TypeScript typecheck and JSON Schema validation
  → semantic/reference validation
  → normalized Control Plane IR
  → deterministic canonical JSON
  → SHA-256 and M4 target inventory
```

TypeScript is the authoring surface. The JSON Schema plus normalized JSON are the interchange/evidence protocol. An importer for another syntax must compile to this same IR; it must not introduce another canonical registry. Persistence and observed-infrastructure verification remain future boundaries.

## Current declaration

The manifest references all four applications in `applications/registry.json`. It intentionally declares **zero environments, database targets, repositories, domains, infrastructure resources, secret references, or policies** because no authoritative infrastructure facts were supplied. Test fixtures exercise these models but are never included in the generated manifest.

`DECLARED`, `VERIFIED`, `CONFLICTED`, and `UNKNOWN` are distinct. A verified database target requires recorded observation and evidence references. `EMPTY` in a declaration is not proof that the real database is empty. SQLite and libSQL are separate providers.

## Commands and outputs

From the `fused-organism` workspace with its pinned Node/npm toolchain:

```bash
npm run control-plane:typecheck --workspace @maataa/domain-registry
npm run control-plane:compile --workspace @maataa/domain-registry
```

Compilation makes no network or database calls. It updates the established Domain Registry package manifest and generates:

- `generated/control-plane.canonical.json` — normalized Control Plane IR.
- `generated/control-plane.target-inventory.json` — M4-facing target rows, counts, eligibility, and approval boundaries.
- `generated/control-plane.hash.json` — SHA-256 of canonical JSON and the future audit-record field shape. Actor, timestamp, and change reason are not fabricated.
- `../migration-readiness/targets.json` and the M4 readiness report — derived counts and exact generated-inventory hash.

The target inventory distinguishes bootstrap candidacy from verified emptiness and verified existing-target diff inputs. None of those classifications grants migration or deployment approval.

## Model coverage

The TypeScript contract covers Application references, Environment, DatabaseTarget, Repository, Domain, Runtime, Storage, Queue, InfrastructureResource, environment-scoped resource assignments, opaque SecretReference, BackupPolicy, MigrationPolicy, and DeploymentPolicy. Existing-app identity and routes are not duplicated. Resource/policy references and environment boundaries are validated before canonicalization.

## Audit and persistence boundary

`control-plane.hash.json` records the manifest identity. A future applied-state record is shaped to hold `manifestHash`, `previousHash`, `actor`, `timestamp`, `changeReason`, and `source`. This milestone creates no audit event and no persistent control-plane database. A later persistence adapter can store canonical manifests, verification evidence, and audit records without changing their JSON protocol.
