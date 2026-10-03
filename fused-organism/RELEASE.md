# Release contract and current gate status

## Historical release: 0.4.1 / M2 closeout

Version 0.4.1 is the completed M2 browser and React-adapter certification baseline. Its acceptance evidence and limits are retained as historical records in `docs/M2-CLOSEOUT.md`, `docs/CERTIFIED-SURFACES.md`, and `docs/NOT-CERTIFIED.md`. The original `npm run certify` gate applies to reproducing that M2 closeout; it does not imply that later M3 product integration or production release gates have passed.

M2 evidence includes the pinned Chromium lane, `gate:m2-closeout`, `gate:visual-policy`, React adapter tests, browser certification, reviewed visual baselines, and the published invariant/scope documents. M2 does not certify all product routes, physical camera operation, a production API host, database migration, or deployment.

## Current release track

The release target now follows the milestone model in [`ROADMAP.md`](ROADMAP.md), with detailed sequencing in [`docs/FINAL-RELEASE-ROADMAP.md`](docs/FINAL-RELEASE-ROADMAP.md):

| Milestone | Purpose | Current status |
|---|---|---|
| M3 | Bounded TLPS spatial product integration | **IN PROGRESS** — M3.1/M3.2 complete; M3.3 local contract, fixture-host, and route conformance implemented; verified host binding and acceptance remain incomplete. |
| M4 | Migration readiness | **BLOCKED / INCOMPLETE** — no target-bound reviewed upgrade plan and operational rehearsal evidence. |
| M5 | Migration execution | **NOT AUTHORIZED** — requires separate explicit, hash- and target-bound approval. |
| M6 | Deployment and final release | **NOT AUTHORIZED** — requires a separate deployment approval and passing production gates. |

The M3 selected route is `/mobile/223/3d-cad-previz`. Its authoritative saved-layout target is `eventsspatial.spatial_layouts`; `eventsspatial.exhibition_layouts` remains a distinct venue/exhibition deliverable. A local in-memory conformance fixture supports reads, creates, edits, fixture permission checks, and same-row version conflict handling. Local API semantics are frozen and validated; there is no real authenticated or durable API host, database transaction guarantee, or environment binding. The 11 unresolved route findings remain open for broader product-completeness claims.

## Required evidence by gate

- **M3 product integration:** exact source/contract hashes; validated contract; route-backed conformance and UI integration evidence; focused tests/build/browser results; explicit fixture-versus-host and authorization boundaries; remaining route findings and exclusions.
- **M4 migration readiness:** verified provider/version and target baseline/history; reviewed target-specific upgrade diff; compatibility/backfill rehearsal; backup and restore proof; recovery plan and named owners; reviewed plan bound to exact hashes. Plan review alone does not authorize execution.
- **M5 migration execution:** separate approval naming provider, target environment, exact migration hash, execution window, and operator; preflight, backup, execution output, and post-migration checks recorded.
- **M6 deployment/final release:** separate approval naming exact application artifacts and hashes, target environment, rollout window, health/rollback gates, and operator; production health evidence and final release record.

## Authority and claim boundary

Schema readiness, product-slice acceptance, migration-plan review, migration approval, and deployment approval are separate facts. Passing one does not imply the next. No document in this release contract authorizes migration execution or deployment. External package publication also remains separately gated by licensing, package ownership, provenance/signing, security review, and release-channel decisions.
