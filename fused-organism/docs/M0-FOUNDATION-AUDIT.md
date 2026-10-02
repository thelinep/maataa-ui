# M0R — Retrospective Foundation Audit

M0 was **not executed as a named milestone before M1**. The project does not rewrite that history. M0R is the retrospective reconciliation layer that makes the missing foundation audit explicit.

The original six reconciliation topics—milestone sequencing, platform-vs-contract versioning, version synchronization, registry binding semantics, React peer/runtime classification and lifecycle-invariant identity—were resolved in 0.3.3.

Before M3, the broader foundation findings have now also been published and dispositioned in `docs/M0R-FINDINGS.md`.

## Acceptance

`npm run gate:m0` now requires:

- canonical npm-only workspace/tooling documents;
- ADR-001 and ADR-002;
- exact 11-package active surface;
- historical M0R status preserved as retrospective;
- `M0R-FINDINGS.md` present;
- `architecture.json` reporting **0 blocking M0R findings**.

M0R completion does not convert deferred future claims into certification. Cross-browser, full WCAG/manual AT, real protocols/devices, HIL/safety, external security audit and production deployment remain explicitly outside M2.
