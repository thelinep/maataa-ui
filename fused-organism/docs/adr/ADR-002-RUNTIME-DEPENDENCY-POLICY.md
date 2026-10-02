# ADR-002 — External Runtime and Host Peer Dependency Policy

Status: Accepted in 0.3.3.

## Decision

The certified kernel claim is **zero external runtime dependencies in package `dependencies`**. Internal `@maataa/*` workspace dependencies are permitted.

Host frameworks are a separate class. `@maataa/react` declares React as an **optional host-provided peer dependency** (`>=18.2.0 <20`); it does not place React in `dependencies`, bundle React, or require React for the headless kernel/fresh-clone certification lane. A consumer that uses the React adapter must supply a compatible React runtime.

Therefore the phrase “zero external runtime dependencies” must never be interpreted as “no external host peers exist.”

## Enforcement

- `tests/packages/runtime-dependencies.test.mjs` rejects third-party entries in package `dependencies`.
- `npm run check:react-policy` verifies the React host-peer classification.
- `tests/packages/react-peer-policy.test.mjs` verifies the same rule in the test lane.
