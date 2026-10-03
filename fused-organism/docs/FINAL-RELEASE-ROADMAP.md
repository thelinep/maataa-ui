# MAATAA / TLPS Final Release Roadmap

**Purpose:** provide one release path from the current M3 spatial-preview branch to a controlled production release, while keeping schema readiness, product readiness, migration approval, and deployment approval distinct.

**Current branch:** `feat/m3-tlps-spatial-preview` at `697a5b2406ffd4ad0bed938df99d8ef069ae5a55`.

**Current worktree:** contains uncommitted M3 planning and spatial API/conformance artifacts. Inspect the live Git status before preparing a release snapshot. M3.3 local API contract conformance is implemented; no API Studio product or real authenticated/durable API runtime is claimed.

## Release target and claim boundary

This roadmap's critical path is a production release of the selected TLPS spatial workflow at `/mobile/223/3d-cad-previz`, backed by MAATAA's canonical schema and a verified host environment. It does not, by itself, declare all 284 registered TLPS routes, all 11 currently unresolved route references, every requested MAATAA application, or every API Studio capability production-complete. Those require separate scope and acceptance evidence.

The application can have an earlier **local demonstration release** after M3.3 local conformance work. That release must remain labeled local/demo and cannot claim authenticated access, durable server persistence, tenant security, migration readiness, or production deployment.

## Milestone model

Use these names consistently across `ROADMAP.md`, `RELEASE.md`, and the M4/M5/M6 plans:

| Milestone | Meaning | Current status |
|---|---|---|
| M0–M2 | MAATAA foundation, contracts, and 0.4.1 kernel/browser certification | Documented complete; retain as historical baseline. |
| M3 | Bounded product integration: TLPS spatial preview and its required runtime/domain integration | In progress. M3.1, M3.2, and local M3.3 contract/fixture-host/UI conformance are complete; verified host binding and product acceptance remain open. |
| M4 | Migration readiness and target-bound migration plan | Blocked/partial; no real target baseline. |
| M5 | Separately approved migration execution | Not authorized. |
| M6 | Separately approved application deployment and final release | Not authorized. |

The experimental camera package remains a technical workstream supporting M3. It does not change M4 into camera certification. Physical camera certification is not part of the selected M3 route claim.

## Phase 0 — Reconcile plan and scope

### Work

1. Make the milestone meanings above authoritative in project roadmap and release documents.
2. Define whether the release is the spatial route, a broader TLPS release, or the full requested MAATAA application suite. This roadmap currently assumes the spatial route as the production vertical slice.
3. Define supported providers and environments from actual infrastructure evidence. Do not infer a database target from the canonical Prisma projections.
4. Classify desired release claims as local/demo, staging, or production and bind each claim to the evidence it requires.
5. Classify and preserve any unrelated dirty work; do not include it in the release snapshot without review.

### Exit evidence

- One roadmap version with consistent M3/M4/M5/M6 definitions.
- A release scope statement naming application, route, data, environment class, and exclusions.
- A clean commit or an explicit reviewed file set for the M3.3 draft work.

## Phase 1 — Freeze a reproducible schema and code baseline

The saved global schema proof reports 352/352 complete contracts, no duplicate IDs, closed FK/relation graphs, and valid PostgreSQL/SQLite Prisma projections. Its source commit is `89dd322...` and it records a dirty source worktree. It is not release evidence for this exact M3 branch tip.

### Work

1. Select and commit the intended M3 code/artifact snapshot.
2. Regenerate the global schema proof from that exact clean snapshot.
3. Verify contract-set, logical-schema, registry, and provider projection hashes.
4. Re-run registry integrity and schema closure checks; confirm route findings and the distinction between informational route debt and blockers for this M3 slice.
5. Record the exact commit and commands in release evidence.

### Exit evidence

- Clean source commit.
- Fresh proof bound to that commit.
- 352/352 contracts; duplicate IDs 0; FK closure PASS; relation closure PASS; PostgreSQL and SQLite projection PASS.
- Registry checks and tests pass on the same source snapshot.

## Phase 2 — Complete M3.3: contract-backed spatial data path

### M3.3A — Domain ownership: COMPLETE

The user's decision is recorded:

- `eventsspatial.spatial_projects` is the parent.
- `eventsspatial.spatial_layouts` is the authoritative M3.3 working layout.
- `eventsspatial.exhibition_layouts` is a separate venue/exhibition deliverable.
- M3.3 does not dual-write, add schema, or add a lineage FK.
- Spatial-to-exhibition conversion is an explicit future workflow.

### M3.3B — API contract: LOCAL SEMANTICS FROZEN; LIFECYCLE DRAFT

Current artifact: `apps/tlps-application/api-contracts/spatial-preview.v1.draft.json`.

The local DRAFT resolves the editor payload and strict bounds, deterministic list ordering/pagination, PATCH allowlist/full replacement behavior, stable error mappings, fixture permission checks, and expected-version conflict semantics. Create initializes version 1; each accepted save increments the same in-memory fixture row once; stale writes return 409 without changing it. `packages/api-contract/scripts/validate.mjs` verifies contract shape, operation uniqueness, canonical table/flow bindings, source hashes, schema compilation, lifecycle claims, and deterministic hashing. This remains a MAATAA-authored local API contract, not a published API Studio IR.

Do not add `publish`, snapshot export, or exhibition approval operations to this route unless product behavior and authorization are separately defined.

### M3.3C — Local reference host: IMPLEMENTED AS A BOUNDED IN-MEMORY CONFORMANCE FIXTURE

The fixture host provides tenant-scoped list/get/create/update through the app adapter, validates request and editor payloads, checks fixture-only permissions, and returns stable errors. Unknown or cross-tenant resources do not reveal existence. Stale expected versions return 409 without writes. Its in-memory compare-and-swap is synchronous JavaScript behavior, not database transaction proof. It is labelled `LOCAL_CONFORMANCE_SIMULATION` / `FIXTURE_DATA`; no real auth, durable storage, production server, or environment exists.

### M3.3D — Page adapter: IMPLEMENTED AGAINST LOCAL CONFORMANCE FIXTURE

`/mobile/223/3d-cad-previz` defaults to a clearly labelled fixture view, edits the current layout, and saves through the host adapter. Successful saves keep the same row ID and advance its version. Conflict responses preserve the user's unsaved editor state and ask for explicit reload/reapply. The fixed fixture actor and permissions are independent of browser role selection. The separate local demo editor remains browser-local. This is not an authenticated actor, durable write path, transactional database, or full M3 acceptance.

### M3.3E — Verified production host: BLOCKED ON ENVIRONMENT

Identify the actual authorized API host, identity provider, persistent data store, tenant scope, and environment. Verify server-side permission enforcement and durable reads/writes. Pin runtime binding separately from the API contract. The current control-plane inventory has four applications, zero environments, and zero database targets.

### M3 acceptance

- Route remains `/mobile/223/3d-cad-previz` and is source-backed/executable.
- UI and domain package boundaries use declared public exports.
- Contract and runtime errors are handled; authorization deny behavior is demonstrated at the host boundary.
- Tests, type/build checks, keyboard/accessibility and responsive checks, and applicable browser certification pass on a clean checkout.
- Release evidence states whether the result is `LOCAL_SIMULATION` or connected to a verified production host.
- No physical-camera, full-WCAG, full-TLPS, or migration/deployment claim is inferred.

## Phase 3 — API Studio product scope

The present repository has no dedicated API Studio UI, canonical API IR package/validator, request/response lab, OpenAPI import/export, or runtime conformance evidence surface. The M3.3 app-local JSON draft does not constitute those capabilities.

If API Studio is included in the final product commitment, deliver and certify a separate bounded API Studio v1:

1. API registry and contract editor.
2. Deterministic API IR, structural validation, hashing, diff, and provenance.
3. Contract links to application, routes, flows, actors, permissions, and canonical data contracts.
4. Local mock/request lab and conformance findings.
5. Secret references only; credential redaction in request history.
6. Runtime/environment bindings kept separate from contract design.
7. No unrestricted production request console; production calls require an authorized environment and evidence.

If API Studio is deferred, keep the contract as a versioned app-owned artifact and remove API Studio from this release's claims.

## Phase 4 — Persistent control plane and target registration

The control-plane compiler/manifest exists, but it currently describes four applications and no environments or database targets. A persistent control-plane backend is not a schema or migration prerequisite, but it is required if the final product must manage live application environments and resources through MAATAA.

### Work, if included in the release

- Persist desired state, observed state, verification evidence, and change history.
- Implement one workflow: application → environment → resource assignment → secret reference → verification.
- Distinguish `DECLARED`, `VERIFIED`, `CONFLICTED`, and `UNKNOWN` states.
- Store secrets by reference; do not persist plaintext secrets.
- Record the real target/provider version, ownership, baseline, and migration history.

### Exit evidence

- At least one real, verified environment and its permitted resources are recorded, or production release is explicitly deferred.
- Reconciliation/audit trail and permissions are demonstrated against the persistent backend.

## Phase 5 — M4 migration readiness

See `packages/domain-registry/MIGRATION-READINESS-PLAN.md`. Current state: M4.1 blocked, M4.2 partial, M4.3–M4.5 blocked, M4.6 not ready for approval.

### M4.1 Targets and baselines

Record real provider/version, target identity/environment, baseline schema hash, migration history hash, privileges/extensions, workload, data volume, compatibility window, and recovery objectives. Decide whether SQLite/libSQL is an actual production target or a local/edge projection.

### M4.2 Target diffs and provider invariants

Generate target-specific upgrade diffs from exact baselines; keep empty-state bootstrap distinct. Review SQL operation by operation. Reconcile the five deferred logical invariants with provider-specific enforcement, including Communications overlays. Test with the actual provider versions.

### M4.3 Compatibility rehearsal

Use representative data to rehearse backfill, constraints, overlapping app versions, tenant/workspace boundaries, performance, locks, and stop thresholds.

### M4.4 Backup and restore

Select recovery objectives and backup method. Prove restore into isolation and validate both database integrity and application invariants.

### M4.5 Recovery plan

Name decision/on-call owners; rehearse partial migration failure and rollback/forward recovery. Record downtime and data-loss limits.

### M4.6 Plan review

Bind review to provider, target baseline, migration hashes, backup/restore evidence, and rehearsal outputs. Review approval permits no execution.

### M4 exit evidence

- Every target diff and overlay is reviewed and hash-bound.
- No unresolved destructive operation or provider invariant remains.
- Compatibility, backup/restore, and recovery rehearsals pass.
- Migration plan review is recorded separately from execution authorization.

## Phase 6 — M5 migration execution

Migration execution requires a separate explicit approval naming exactly one provider, target environment, migration hash, execution window, and operator.

1. Recheck target identity and drift against the approved baseline.
2. Verify the approved backup and operator access.
3. Apply only the approved migration artifact.
4. Run schema, data, application, and tenant-boundary checks.
5. Record actual output, duration, errors, and resulting hashes.
6. Stop on failed gates and follow the reviewed recovery plan.

### M5 exit evidence

- Migration result and post-migration checks are recorded and tied to the authorized hash.
- No deployment is implied by database success.

## Phase 7 — M6 deployment and final release

Deployment approval is separate and must name the exact application artifact, target environment, rollout window, health gates, and rollback owner.

### Before approval

- Release build and supply-chain/provenance evidence are complete.
- Runtime secrets are referenced safely; authentication, authorization, tenant isolation, and rate/security controls are verified at the host.
- Monitoring, alerting, support ownership, incident response, and release/rollback runbooks are ready.
- Migration output and deployed application compatibility are confirmed.
- Accessibility/browser claims match the actual tested matrix; full WCAG and physical camera certification remain unclaimed unless separately proved.
- Final schema/API/build hashes and known exclusions are published.

### Deployment and stabilization

1. Perform the approved deployment.
2. Check health gates, user workflow, authorization boundaries, data persistence, and observability.
3. Observe for the agreed stabilization window; roll forward/back only under the approved runbook.
4. Publish the final release record with exact commits, hashes, approvals, results, known limitations, and support path.

### Final release exit

- The declared production workflow works in its verified environment.
- Its database migration is the one separately approved and executed.
- Deployment and post-deployment checks pass.
- The release report is reproducible and makes no claim beyond its evidence.

## Separate route-completeness debt

The M3 scope records 11 unresolved, non-executable routes. They are informational for the selected spatial route only; broader TLPS completeness requires source-backed resolution or retirement of each:

- `/mobile/auth/create-organisation`
- `/mobile/auth/invite`
- `/mobile/auth/accept-invite`
- `/mobile/auth/sign-out`
- `/offline`
- `/mobile/admin/api-keys`
- `/mobile/admin/webhooks`
- `/mobile/admin/integrations`
- `/mobile/admin/audit-log`
- `/mobile/admin/data-retention`
- `/mobile/admin/feature-flags`

Route debt is not closed by adding aliases without source evidence. Full TLPS release also needs a separate inventory of all application routes, workflows, and production surfaces; resolving these 11 alone does not establish full product completeness.

## Current critical path

1. Preserve the implemented local conformance route, contract-set hash, and browser/test evidence; keep the real identity, durable API host, and environment as explicit external gates.
2. Review spatial payload and resolve the remaining PATCH, stale-version conflict, read-query, and identity decisions.
3. Validate and hash the resolved API artifact; add canonical API IR validation and conformance evidence.
4. Decide whether the intended release is local/demo or production-backed; if production-backed, identify and verify host, identity, persistence, and environment.
5. Reconcile and commit the scoped roadmap/API/M3 artifacts; regenerate the schema proof against that exact clean release snapshot.
6. Complete M3 acceptance evidence on the exact snapshot, or record the deliberately narrower local/demo boundary.
7. Complete M4 target-specific readiness and plan review when a real target exists.
8. Obtain M5 execution approval and record migration results.
9. Obtain M6 deployment approval, deploy, verify, and publish final release evidence.

No migration or deployment approval is granted by this roadmap.
