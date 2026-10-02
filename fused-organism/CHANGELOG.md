# Changelog

## 0.4.1 — M2 Evidence Closeout

- pinned browser certification to exact Chromium 144.0.7559.96 instead of claiming an untested >=120 range;
- published generated INV-001 through INV-022 mapping;
- published exact React hooks shipped in M2 and generic hooks deferred to M3 integration;
- added ADR-005 documenting direct CDP instead of Playwright/axe-core;
- published browser-required vs tree-only gate matrix;
- hardened visual regression policy: DPR 1, font-independent fixture, channel tolerance 10, 0.3% pixel threshold, and guarded baseline updates;
- expanded semantic visual fixture to all ten canonical state tokens;
- published exact M2 certified surfaces and explicit not-certified list;
- published M0R-FINDINGS.md with zero unresolved blockers and written deferrals;
- added gate:m2-closeout and gate:visual-policy.

## 0.4.0 — M2 Browser & React Adapter Certification

- added real Chromium/Chrome certification through the DevTools Protocol;
- added system-browser runtime gate without adding browser npm dependencies;
- hardened `@maataa/react` with an explicit adapter contract version, peer range and host validation;
- added React adapter unit tests and browser accessibility-tree checks;
- added keyboard tab navigation, dialog focus restoration and live-region certification;
- added responsive 390/768/1440 viewport checks;
- added reduced-motion and forced-colors emulation checks;
- added real PNG screenshot visual regression with explicit baseline-update workflow;
- added INV-015 through INV-022 and M2 ADRs/documentation.

## 0.3.3 — M0R / M1 reconciliation

- added retrospective M0 foundation gate without rewriting milestone history
- added ADR-001 independent contract/platform versioning
- added ADR-002 external runtime vs React host-peer policy
- promoted version synchronization to a named top-level gate
- replaced ambiguous registry `headless` status with executable `headless-bound` bindings
- added React peer-policy gate and test
- mapped five lifecycle behaviours to INV-010 through INV-014

## 0.3.2 — M1 Contract/API Freeze

- froze v1 semantic contract identities and generated a contract manifest;
- added strict contract compatibility baseline and gate;
- generated the 11-package public API manifest and froze named-export compatibility;
- froze semantic registry identity/authority/package/schema/headless metadata and non-removable states;
- added validated deprecation metadata policy;
- added version synchronization across root, workspaces, lockfile, API manifest and registry;
- added deterministic control invariants for terminal-state irreversibility, NACK, cancellation, expired leases and observed-state verification;
- added INV-007 through INV-009 and mapped them to executable compatibility tests;
- added API stability, M1 completion and updated testing/release documentation.

## 0.3.1

Foundation/certification hardening:

- standardized the repository on npm 10.9.2 + Node 22.16.x; removed pnpm/turbo declarations;
- added a clean-cache offline fresh-clone gate to prove the tree is self-contained;
- renamed the drift gate to `gate:drift` and made `scripts/check-drift.mjs` explicit in the certification map;
- hardened the renderer against nested executable/accessor/prototype-pollution payloads;
- made registry bindings explicit (`headless` or render adapter) and added a resolution test;
- added an experimental fixture domain pack and executable domain-boundary verification;
- consolidated certification state into `certification/certification.json`; `REPORT.md` is generated from it;
- renamed the semantic token test so it no longer implies screenshot/visual-regression coverage;
- mapped every architecture invariant to a named executable test;
- aligned the public product surface with the 11-package certified kernel and marked broader domains as roadmap/experimental.

## 0.3.0

Initial foundation-first certification scaffold.
