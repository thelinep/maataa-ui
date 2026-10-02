# MAATAA UI V3 Architecture — 0.4.1

The active graph remains 11 packages:

`contracts → core/registry → ai/governance/renderer/adapter-sdk → control → react → recipes → testing`

`@maataa/contracts` is the single semantic source for generic/control contracts. `@maataa/control` owns deterministic supervisory state, lease and safety pre-check semantics; it does not replace hardware safety. `@maataa/recipes` owns high-level compositions. Domain packs remain downstream and experimental until promoted through certification.

## M1 compatibility boundary

The frozen compatibility lines remain:

1. semantic v1 contracts;
2. named exports of the 11 active packages;
3. registry identity/authority/schema/state/binding semantics.

Generated state: `contracts/manifest.json`, `api/public-api.json`, `registry/components.registry.json`.
Reviewed baselines: `compatibility/`.

## M2 browser boundary

Browser certification is intentionally separate from tree-only kernel certification. A system Chromium/Chrome runtime is an environmental prerequisite and is never represented as an npm runtime dependency.

`@maataa/react` consumes an optional host-provided React peer through the explicit `createMaataaReact(React, services)` adapter. M2 certifies the MAATAA adapter contract and resulting browser semantics; the React project itself remains outside MAATAA's certification authority.

## Dependency direction

Foundation packages never import experimental/domain packages. The experimental domain fixture keeps this invariant executable.
