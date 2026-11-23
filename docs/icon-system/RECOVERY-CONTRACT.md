# Unified icon system — recovery and integration contract

Canonical repository: `thelinep/maataa-ui`  
Integration branch: `feat/unified-icon-system-recovery`

## Preservation rules
- Retain every original source archive byte-for-byte with SHA-256 provenance.
- Preserve historical icon IDs, names, aliases, source paths and artwork; never silently rewrite them.
- Treat the recovered Asset Manager v6 registry as the initial canonical *candidate*, not as a validated replacement for earlier IDs.
- Historical v2 registry (205 records: 203 designs and two aliases), v3 React pack manifest (31 packs), v6 registry (1,602 semantic records), NEVO EOS, NEVO Events and ALLB assets remain separately traceable.
- Map every historical ID to a canonical ID, an explicit alias or an unresolved review item. Never infer equivalence solely from a similar name.
- Distinguish exact byte duplicates, structurally equivalent SVGs, and visually similar art; visual decisions require review.
- Do not overwrite existing MAATAA UI components or NEVO EOS assets during migration.

## Intended deliverables
1. Immutable source archive inventory and SHA-256 verification.
2. `historical-crosswalk.json` with provenance, mapping status and review notes.
3. `artwork-integrity.json` and `duplicate-review.json`.
4. `icon-registry.v1.json` with versioned schema and migration tests.
5. Searchable React icon manager using MAATAA UI tokens and components.
6. Explicit MAATAA UI and NEVO EOS adapters with non-breaking imports.
7. CI checks for stable IDs, SVG integrity, schema, tests and build; draft PR before merge.

## Release gates
No release or merge until all source archives are accounted for, no historical ID is lost, unresolved duplicates are reported, adapter tests pass, and GitHub Actions checks match the current PR head.

## Status
This document establishes ownership and preservation policy only. It does **not** certify that the crosswalk, audit, normalized registry, manager, integrations or release are complete.
