# MAATAA UI Roadmap

## M0R — Retrospective foundation reconciliation — 0.3.3 — COMPLETE

Historical M0 omission is recorded without rewriting the sequence. `docs/M0R-FINDINGS.md` now carries the complete findings/disposition ledger; **0 blocking findings remain** before M3, while non-blocking future certification work is explicitly deferred.

## M1 — Contract/API freeze — 0.3.3 — COMPLETE AFTER RECONCILIATION

- v1 semantic contract freeze
- public API compatibility baseline
- registry compatibility baseline with executable bindings
- deprecation metadata gate
- lifecycle invariant hardening

## M2 — Browser & React Adapter Certification — 0.4.1 — COMPLETE WITH CLOSEOUT

- exact Chromium 144.0.7559.96 pin
- direct CDP browser lane; Playwright/axe-core decision documented
- React adapter host-contract version and validation
- shipped/deferred React hook map
- accessibility-tree semantics
- keyboard/focus/live-region certification
- responsive 390/768/1440 matrix
- reduced-motion and forced-colors emulation
- guarded PNG visual regression at DPR 1
- INV-001…INV-022 published mapping
- exact certified surface + explicit not-certified list
- M0R findings fully dispositioned

## M3 — Product integration + camera experimental package — NEXT / SCOPE DEFINED

Status: **SCOPE DEFINED · IMPLEMENTATION NOT STARTED**. M3 is one milestone with two coordinated workstreams, not two competing M3 definitions:

- **Product slice:** integrate a rendered spatial scene / camera-control preview in TLPS using `@tlps/domain-primitives`, MAATAA tokens/primitives, and only the React adapter hooks required by that scenario.
- **Experimental camera package:** define camera contracts and capability negotiation; establish simulator parity with the kernel command lifecycle; define discovery/stream/PTZ adapter boundaries; and exercise the failure matrix.
- Close the route and flow gaps that intersect the slice, and publish reproducible integration evidence with explicit exclusions.
- The initial slice is a rendered preview. It does not certify physical camera capture, real ONVIF/RTSP/WebRTC interoperability, or production hardware control.

Acceptance criteria and the 11-route disposition boundary are defined in [`docs/M3-PRODUCT-INTEGRATION-SCOPE.md`](docs/M3-PRODUCT-INTEGRATION-SCOPE.md).

## M4 — Real camera certification — 0.5.0

- real ONVIF discovery
- authenticated capability read
- RTSP/WebRTC viewing path
- PTZ command + ACK/NACK
- observed-state verification
- evidence receipt
- reconnect, timeout and mismatch recovery

## M5 — Edge/control runtime — 0.6.0

- edge gateway lifecycle
- reconnect/replay/idempotency
- lease enforcement
- telemetry ingestion and ordering
- device/gateway restart and failure-mode certification
