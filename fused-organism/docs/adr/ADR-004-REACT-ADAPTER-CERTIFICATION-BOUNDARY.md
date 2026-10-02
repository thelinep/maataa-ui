# ADR-004 — React adapter certification boundary

Status: Accepted and clarified at **0.4.1 / M2 closeout**.

`@maataa/react` declares React as an optional host-provided peer (`>=18.2.0 <20`) and does not bundle React or place it in package `dependencies`.

M2 certifies **MAATAA's React adapter contract**, not the third-party React implementation or a React-version matrix. The adapter exposes a stable `REACT_ADAPTER_CONTRACT_VERSION`, validates the minimum host APIs it consumes (`createElement`, `useState`, `useEffect`), and is exercised with a deterministic test-only host contract. A subset of adapter-produced semantics is then inspected in the pinned real Chromium runtime.

The fixture is not exported from `@maataa/react` and is not represented as React. The exact shipped and deferred hook lists are published in `docs/REACT-SURFACE.md`.
