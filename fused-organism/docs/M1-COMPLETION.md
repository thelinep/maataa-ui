# M1 — Contract/API Freeze — COMPLETE AFTER M0R RECONCILIATION

Release target: **0.3.3**

## Delivered

1. Stable v1 contract identifiers and explicit contract versions.
2. Generated `contracts/manifest.json`.
3. Reviewed `compatibility/contracts.v1.json` baseline.
4. Generated public package API manifest and documentation.
5. Reviewed `compatibility/public-api.v1.json` baseline.
6. Reviewed `compatibility/registry.v1.json` baseline.
7. `compatibility/deprecations.json` with validation gate.
8. `npm run check:compat` as a named certification gate.
9. Version synchronization across root, workspaces, lockfile, API manifest, and registry.
10. Additional deterministic-control invariants for terminal states, NACK, cancellation, expired leases, and observed-state verification.
11. Architecture invariants INV-007 through INV-009 mapped to executable tests.
12. 0.3.3 changeset and release documentation.

## Deliberately not included

M1 does not add browser certification, React peer-dependency productionization, screenshot visual regression, WCAG conformance certification, real ONVIF/RTSP/WebRTC interoperability, hardware-in-the-loop testing, or production deployment. Those remain M2 and later work.

## Reconciliation note

The original 0.3.2 M1 completion statement was too strong because M0 had not been named, registry entries were all merely marked headless without binding proof, React host-peer policy lacked an ADR, version sync was nested rather than top-level, and five lifecycle behaviours lacked individual invariant IDs. 0.3.3 closes those gaps.

## Postscript — M2

The exclusions above describe the M1 completion boundary at 0.3.3. Browser and React-adapter certification first landed in 0.4.0 and was evidence-closed in 0.4.1; see `docs/M2-COMPLETION.md` and `docs/M2-CLOSEOUT.md`.
