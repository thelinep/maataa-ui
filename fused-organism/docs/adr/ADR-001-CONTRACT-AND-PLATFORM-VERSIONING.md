# ADR-001 — Contract and Platform Versioning Are Independent

Status: Accepted in 0.3.3.

## Decision

The MAATAA UI platform/package release is currently `0.3.x`, while frozen wire/schema contracts may use compatibility family `v1` and semantic contract version `1.0.0`. These version spaces are intentionally independent.

`0.3.x` describes maturity and compatibility of the **software distribution**. `v1 / 1.0.0` describes the first frozen compatibility line of an individual **data contract**. A v1 contract does not claim that the overall platform is 1.0 or production-certified.

The mapping is carried in `contracts/manifest.json` and frozen by `compatibility/contracts.v1.json`. Breaking a frozen v1 shape requires a new contract identity/version; changing platform version alone does not alter contract version.

## Consequences

- Public documentation must always qualify `1.0.0` as a **contract version**, never platform maturity.
- The platform may remain pre-1.0 while preserving a stable v1 data contract.
- Contract evolution and package evolution are checked separately.
