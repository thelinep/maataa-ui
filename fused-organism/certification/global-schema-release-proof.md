# MAATAA Global Schema Readiness Proof

Generated deterministically by `fused-organism/packages/domain-registry/scripts/generate-global-schema-proof.mjs`.

## Result

- Schema lifecycle: **CANONICAL**
- Schema readiness: **SCHEMA_READY**
- Contracts: **352/352 complete**
- Duplicate IDs: **0**
- Foreign-key closure: **PASS**
- Relation closure: **PASS**
- Contract-set SHA-256: `023f98b55c0be84ad6b0bf5f80d95a80d515c92069ba36057f66a9b0f484bcfa`
- Logical-schema SHA-256: `5638ba9529982882b04c2a5014d8b5b3923c1a661ccb27ec6b556386ff324da5`
- Registry hash: `b261f850bcc9565598c03e23bae47efbac38954fc7f072021c3f4da0ff45519d`
- Source commit: `812444ec6a738fdfe8737f0049b1b40ede08901b` (feat/fused-organism-parent; worktree clean)

## Provider previews

| Provider | Validation | Schema SHA-256 | Deferred logical findings |
|---|---|---|---:|
| postgresql | PASS | ae087b0d8df61300f5e087fc1338152c78309d09140674657c9efb3d81081b96 | 5 |
| sqlite | PASS | e635e1cde76737c0053f343044f4d3726ce292e12debd1b72f286b82ec278017 | 5 |

Prisma validation confirms each generated schema is syntactically and structurally valid for its Prisma provider. It does not prove runtime database behavior or implement the deferred invariants below.

## Provider findings

- `announcement_audience_matches_workspace_scope` (communications.announcements; conditional-nullability) — DEFERRED_TO_PROVIDER_MIGRATION.
- `direct_message_membership_pair_is_normalized` (communications.direct_message_threads; strictly-ordered-uuid-pair) — DEFERRED_TO_PROVIDER_MIGRATION.
- `direct_message_parent_thread_is_direct` (communications.direct_message_threads; referenced-row-predicate) — DEFERRED_TO_PROVIDER_MIGRATION.
- `one_active_thread_membership_episode` (communications.thread_members; at-most-one-active-row) — DEFERRED_TO_PROVIDER_MIGRATION.
- `thread_membership_episode_cannot_be_reopened_or_rekeyed` (communications.thread_members; immutable-episode-identity-and-terminal-state) — DEFERRED_TO_PROVIDER_MIGRATION.

## Review evidence

- Status: **approval evidence verified for all 17 canonical contexts**.
- Review artifacts use different binding scopes; the table labels the scope and the recorded reviewed-set or bundle SHA-256.

| Context | Contracts | Decision | Reviewer | Binding scope | Reviewed-set / bundle SHA-256 |
|---|---:|---|---|---|---|
| creative | 20 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | 4c49daf1a7a46a40e25000b05f783e8f376d5cf4ed38a78c6bb1fe62d0e8295c |
| logistics | 26 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | 6adad2f8afb7e7fc290e34ff0b736f8abb2e8018a9be58ce6cc18504d45a5237 |
| campaign | 22 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | 749d5e3f6fa6616b999e61da7bfc6e3f96e7e18fcbb25ef83d52b1a191abf7b1 |
| marketplace | 22 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | d1ecad5b39ba7c13715016a1b6013e0d66a1af06aaa4854b23f24fd62b048f30 |
| finance | 22 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | e7f03b66c918d98ca8f655a6f0287de480c5c1deb9252eb43cdaf2a94c80b56a |
| investor | 21 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | 0fcb7a5b2f8b28c68bccc6561688a8c1a503fea798073afbf2af277267c9e63c |
| eventsSpatial | 25 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | 4363ec6a1190e9c3eb7a238ccb23cad3b84c3263fc9db1bae022009d1462358a |
| intelligence | 22 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | e85945304f6a53c217323d5caa73435345a9d9254e89a197a1fd3d424cc40379 |
| public | 12 | REVIEWED / APPROVE | thelinep | EXACT_CANONICAL_CONTEXT_HASH | 14bb8e51a85acc130f83f323389509161c9ddedfa70b568fac3b3aba23e26fb1 |
| identity | 25 | REVIEWED / APPROVE | thelinep | EXACT_CASTING_160_SLICE_HASH_REFRESH | f873757dc6030c305d80d52f55c7f18772b1677eadd1045f4c841129afdb3c83 |
| people | 32 | REVIEWED / APPROVE | thelinep | EXACT_CASTING_160_SLICE_HASH_REFRESH | 8ea1f93f7b411e560abec4afd749725b75437f0b68ed34afca98c1eb847d6bdb |
| project | 17 | REVIEWED / APPROVE | thelinep | EXACT_CASTING_160_SLICE_HASH_REFRESH | b9e1a35a3d6f1cf3c18a0c2966e0f7db45cf7033dbff1650c8535a8243b96540 |
| evidence | 23 | REVIEWED / APPROVE | thelinep | EXACT_CASTING_160_SLICE_HASH_REFRESH | 56cae63f78f9ba4bfbe6ce5b0b53b3514ab2d9d569431d4475f02298a572fd60 |
| platform | 25 | REVIEWED / APPROVE | thelinep | EXACT_CASTING_160_SLICE_HASH_REFRESH | 337f7199af20b5dc6f342a5187af0db4003039aaebbc2df569aa269f8cd5a607 |
| production | 19 | REVIEWED / APPROVE | thelinep | EXACT_CASTING_160_SLICE_HASH_REFRESH | 0adac1cec6284cec517aa27444e6cadb6de7282ad11f8c5310fdf1c105e19836 |
| communications | 9 | REVIEWED / APPROVE | thelinep | EXACT_COMMUNICATIONS_DRAFT_HASH_AND_ID_SET | 41ac98624962fdd44140016c65c8a5e30cffce35ef68c3eb5dbfae788f9d1352 |
| organisation | 10 | APPROVED / APPROVED | thelinep | APPROVED_TABLE_ID_SET_AND_BUNDLE_SHA256 | 7d94dd0463a1e70e14700370cd2c7d14b4a441994aaf9c67705aa62867a1d8e9 |

## Validation

- Registry tests: **30/30 passed**.
- Registry integrity: **PASS**.
- Registry tlps-domain-registry@1.0.0: 0 blocker(s), 0 error(s), 0 warning(s), 11 info.
- Domain registry: VALID · Route registry: VALID · Registry publishable: YES · Schema compiler ready: YES
- Routes: 284 registered static, 0 registered dynamic, 0 declared only, 0 approved aliases, 11 unresolved.
- Application IR artifacts: PASS · 4 records pinned to M1
- Reproducible package hash: PASS · b261f850bcc9565598c03e23bae47efbac38954fc7f072021c3f4da0ff45519d
- Registry validation PASS: publishable; warnings and info are recorded above.
- `git diff --check` (tracked diff): **PASS**.
- Proof generator syntax: **PASS**.

## Authorization boundary

Schema readiness is **PASS**. Migration approval: **NOT GRANTED**. Deployment approval: **NOT GRANTED**. No migration or deployment was executed.
