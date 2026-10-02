# MAATAA Domain Registry

## M2 executable composition preview

M1 is frozen at `registry@1.0.0` with the accepted 11 route deferrals recorded in `registry.manifest.json`. `src/composition.mjs` provides deterministic `resolveComposition()` / `resolve()`, `explainComposition()`, Application IR sealing/validation, logical schema preview, semantic diff, and route-impact indexes. Each Application IR carries the fixed M1 registry hash; the current package integrity hash is recorded separately.

The generated `applications/` proofs include the casting pipeline (flows 027–031), Campaign OS, Events/Wedding/Spatial, and InvestorHub. `composition/route-impact-indexes.json` preserves the unresolved route backlog with product and flow impact based only on authored mappings. Data Studio Compose runs this local resolver against the package and saves IR drafts in the browser.

Route readiness is scoped to selected flows. An unresolved selected route blocks that composition even when the package validator accepts explicitly deferred routes as recorded informational gaps. Planned tables remain compiler-blocking unless the application IR explicitly sets its local `allowPlanned` override. Optional public context requires explicit opt-in. A shared-service entry without a matching context package (currently the optional `ai` service) fails closed.

### M2.5 schema contract authoring

`schemas/table-contract.schema.json` defines the database-neutral table contract. `data/scalar-types.json` is the canonical scalar vocabulary; `data/table-contracts.json` is the versioned contract registry. A table contract can describe fields and enums, primary and unique keys, foreign keys, semantic relations, indexes, ownership, lifecycle, and source/review provenance. `src/contracts.mjs` derives completeness and validates references; completeness cannot be self-asserted. Changes are compared semantically before any migration work.

`assessCompileTestability()` is a separate draft-compilation gate: it permits unreviewed/reviewed provenance but still requires source references, complete structure, unique contract IDs, and recursively closed foreign-key/relation dependencies. `assessContractCoverage()` retains the stricter approval and retention requirements for `SCHEMA_READY`. `compileLogicalSchema()` emits a deterministic database-neutral model and SHA-256 only when structural closure passes; dependency contracts are included and listed explicitly. This gate does not promote contracts or grant migration approval.

The M2.7 Organisation approval is now applied as a scoped registry decision. The four earlier Organisation proposals were recovered from the recorded authoring source and their file hash matches the historical registry-manifest hash; the six exact approved contracts and retention decisions are preserved beside the approval record. All 10 Organisation tables now pass `SCHEMA_READY`, with 24 closed foreign-key edges across those tables and the required `identity.users` dependency. The four recovered contracts retain their original identity, fields, and primary keys; only approval metadata and the approved retention references changed.

`data/table-contracts.json` is the canonical registry and contains approved contracts only. It now contains 10 Organisation contracts. The nine other kernel proposals remain in the authored source package and do not count as canonical coverage or enter application schema previews. Structural closure checks can use them as draft dependencies, while canonical readiness checks only the approved registry. This keeps the Organisation proof reproducible through its unapproved `identity.users` dependency without promoting that draft.

Global canonical schema readiness remains `SCHEMA_INCOMPLETE`: 10 complete, 0 partial, and 342 name-only tables across the 352-table catalog. The casting proof selects 160 canonical tables and remains incomplete (10 complete, 0 partial, 150 name-only); nine non-canonical kernel proposals are reported separately in the authored-proposal inventory. All four proof applications remain at lifecycle `RESOLVED`. Data Studio's Compose → Contracts view reports canonical coverage; proposal review state remains in the authored source package. Prisma output and migration work remain blocked; this approval grants registry schema readiness only, not migration, deployment, or production legal/compliance approval.

The recovered 13-contract authoring source is stored at `schema-sources/authored/maataa-core-v1/contracts.json`. Its SHA-256 is `b1023d82cc7b3f14876c14f7b69a5789e70b80c7f3b945841010dc8ed5d5a3c0`, matching the historical hash captured in the session record. The supplied `BUNDLE_SHA256.txt` contains a bare digest without a named file or aggregate scope; it does not match any individual supplied bundle file, so it is retained as evidence but not treated as a verified checksum.

Registry publication and schema compilation are separate gates. A valid, publishable domain package does not imply schema compiler readiness. `registry.manifest.json` records both values, and its schema compiler gate remains blocked until all canonical tables have valid complete contracts. `schemas/compilation-plan.schema.json` remains a future downstream contract.

### M2.6 schema source intake

`schema-sources/registry.json` references immutable source records classified as `AUTHORITATIVE`, `CANDIDATE`, `SUPERSEDED`, or `REJECTED`. `schema-sources/candidates/neroevents-postgres-migrations.json` pins the separate NEVO repository's SQL files to a commit and blob SHAs with zero MAATAA context/table mappings. The registry gate rejects inconsistent source classification and adoption metadata.

`src/sql-proposal.mjs` and `npm run contracts:propose-sql -- --input <file> --source-id <id> --source-file <path>` emit proposal JSON after verifying the input's Git blob SHA. The importer never writes `data/table-contracts.json`; unsupported SQL becomes a diagnostic, physical FKs remain distinct from logical relations, and every proposal requires human review. `defaultLiteral` and `defaultExpression` keep stored values separate from executable defaults. Many-to-many relations require a named, authored join-table contract. Data Studio → Governance → Contract coverage shows table/context completeness, source authority, review state, missing sections, blocked targets, validation findings, and proof-app usage.

This package is the versioned source registry read by Data Studio. It keeps a **Draft Registry** inspectable even when invalid and exposes a fail-closed publish/compiler gate.

## Canonical package layout

- `catalog/spine.json` defines the five always-included contexts. Evidence is a default shared service, not a spine context; AI is optional; public context is opt-in.
- `catalog/future-production-tables.json` lists the exact 17 canonical table IDs classified as `planned`.
- `data/domain-catalog.json` holds all 352 tables across 18 domains. IDs follow `<context>.<name>`. IDs and statuses carry derivation provenance. The other 335 table statuses derive to `stubbed` from the explicit default rule.
- `contexts/<id>/context.json` contains each of the 17 versioned context packages; `data/context-registry.json` is their Data Studio projection.
- `products/compositions.json` contains six compiler-facing compositions separately from the 16 application product records.
- `flows/slice-map.json` resolves every distinct source slice to one context or an explicit special classification. `flows/flow-classifications.json` handles the eight source flows without product tags.
- `routes/` separates executable registered routes, source-declared patterns, authored aliases, deterministic resolutions, occurrence-level flow references, deferred route debt, pattern-derivation policy, and route findings.
- `schemas/` defines the current canonical table and context contracts; `sources/` preserves the source snapshots and hashes.

The `creative` context explicitly depends on `project` and `people`; `getContextDependencies("creative")` returns those dependencies, while `getContextDependents("creative")` returns the inverse. The validator checks semantic versions, valid and acyclic dependency edges, deterministic table identity/status, table ownership, slice/product mappings, route resolution, spine closure, and default evidence inclusion.

## Validation and publish policy

Run `npm run routes:sync --workspace @maataa/domain-registry` after replacing the authoritative manifest source. Run `npm test --workspace @maataa/domain-registry` for integrity and contract tests. Run `npm run validate --workspace @maataa/domain-registry` in CI; it verifies reproducible asset hashes and exits non-zero when blockers or errors remain. Warnings and information findings may be published with their report. Registry publication/consumption readiness is separate from schema compilation readiness: the latter requires complete, approved contracts for every selected table. Planned tables additionally require the explicit `{ allowPlanned: true }` override; stubbed tables resolve with their status visible.

Domain validity and route validity are reported separately. `compilerReady` is true only when there are no blockers or errors. An explicitly deferred unresolved route is informational for the package gate; the route itself remains unresolved and non-executable.

### Route registries

The route resolution precedence is `REGISTERED_STATIC` → `REGISTERED_DYNAMIC` → `DECLARED_UNREGISTERED` → `APPROVED_ALIAS` → `UNRESOLVED`. A declaration match is semantic information only: it is not registered and not executable, so it cannot satisfy the compiler route gate. Aliases require explicit provenance and an approver. No aliases are inferred from flow text.

The supplied application manifest contains 284 pages and has no `routeParams`, `pageGroups`, or `dynamicRoutes` field. It therefore provides 284 registered static routes, zero registered dynamic routes, and zero declared patterns. The flow document's `counts.sourcePages` value is 307, but its `indexes.byRoute` index has 293 distinct route paths: 282 resolve to registered pages and 11 do not. Two registered pages are not referenced by these flows. The 11 current gaps are explicitly classified as `missing-source`, owned by `platform`, and targeted for registry version `1.1.0`; they remain unresolved and non-executable. The 17-pattern review claim remains unverified. `routes/pattern-derivation-policy.json` records a reversible derivation rule with a minimum of three concrete routes; no patterns have been derived yet. Run `npm run routes:sync --workspace @maataa/domain-registry` after replacing the authoritative manifest source to regenerate the route artifacts.
