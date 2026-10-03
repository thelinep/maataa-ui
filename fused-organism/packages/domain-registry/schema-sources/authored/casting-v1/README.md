# Casting composition schema slice

The casting proof covers 160 table IDs across eight contexts and five pinned flows. All 160 contracts are now canonical, structurally complete, and FK-closed. The resolved contract-set hash is `8789255de24c57fb57b83adde87e77fed65c6fc9f8d1c4bd9d744062a57c5e8c`; the logical-model hash is `9df0040ac7fdaf62972ed51020bf25eb53e77915dca84d1702def245ac5cc3db`.

The contracts are MAATAA-authored architectural definitions based on canonical table IDs, the application IR, and its selected flow behavior; no external database schema is claimed. Context reviews bind to exact contract-set hashes in their `*.review.json` records. `CAST-DRAFT-004` records the approved decision that actor fields reference global `identity.users`; application authorization must separately verify active organisation/workspace membership and applicable project access. The FK proves user identity exists only.

`contracts.draft.json` is retained as the reproducible composition build and preview envelope. Its `schemaLifecycle: DRAFT` and the generated Prisma metadata's `deployable: false` are intentional: canonical schema readiness does not approve migrations or deployment. The derived readiness is `SCHEMA_READY` for all 160 requested contracts and their 160-table closure. Prisma previews target PostgreSQL and SQLite/libSQL, and both pass the pinned local Prisma CLI validation.

Migration preview/execution, deployment approval, runtime membership authorization, and legal approval remain separate and are not granted by this package. Global schema coverage is still incomplete outside this casting slice.

## Rebuild and validate

From the `fused-organism` workspace root:

```sh
node packages/domain-registry/scripts/generate-casting-draft-contracts.mjs
node packages/domain-registry/scripts/validate-casting-prisma-previews.mjs
```

The validator checks structure, FK closure, canonical coverage, logical-model coverage, contract-set hash integrity, and both provider-specific Prisma previews. Provider projection findings are recorded in `projection-findings.json`.
