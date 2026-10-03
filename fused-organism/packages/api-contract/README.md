# MAATAA API contract proposal validator

This package validates the local DRAFT contract for TLPS spatial preview. It checks proposal shape, operation and method/path uniqueness, canonical table and flow references, permissions, request/response/error schemas, payload/version rules, claim boundaries, pinned source hashes, and deterministic canonical JSON SHA-256.

Run from `fused-organism`:

```sh
node packages/api-contract/scripts/validate.mjs
node packages/api-contract/scripts/validate.mjs apps/tlps-application/api-contracts/spatial-preview.v1.draft.json --json
node --test packages/api-contract/test/*.test.mjs
```

`VALIDATED_LOCAL_API_CONTRACT` means the local authored API contract is internally valid and source-bound. It does not certify API Studio, a real host, real authentication, production authorization, durable persistence, migration, or deployment. Those remain distinct external gates.

The canonical registry pins Ajv 6.15.0. The proposal's nested layout-data JSON Schema is validated against the supported Draft-07-compatible subset; JSON Schema Draft 2020-12 meta-schema validation is not claimed.

Frozen local rules include the editor-derived `layoutData` envelope; strict unknown-property rejection; canvas and model bounds; deterministic `updated_at DESC, id ASC` ordering with limit/offset pagination; exact PATCH allowlist with whole-object `layoutData` replacement; required `expectedVersion`; and a no-write 409 `SPATIAL_LAYOUT_VERSION_CONFLICT`. Local fixture actors exercise view/create/edit permission checks and actor-derived tenant scope. This in-memory conformance host is not an HTTP service or transactional database.
