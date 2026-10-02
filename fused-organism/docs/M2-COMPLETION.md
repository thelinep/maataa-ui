# M2 — Browser & React Adapter Certification — COMPLETE WITH CLOSEOUT

Release target: **0.4.1**

## Delivered

1. Exact browser runtime pin: **Chromium 144.0.7559.96**.
2. Direct CDP browser certification, with Playwright/axe-core non-use documented in ADR-005.
3. Hardened `@maataa/react` host contract with explicit adapter version and peer range.
4. Unit coverage for every primitive and hook actually shipped by the M2 adapter surface.
5. Explicit list of React hooks shipped in M2 and deferred to M3 integration.
6. Real browser accessibility-tree assertions for the browser-certified React primitive subset.
7. Real keyboard tab navigation checks.
8. Dialog focus placement and deterministic focus restoration in the certification fixture.
9. Polite live-region verification for dynamic command state.
10. Responsive matrix at 390px, 768px and 1440px with horizontal-overflow prohibition.
11. `prefers-reduced-motion` emulation and verification.
12. `forced-colors: active` emulation and control-boundary verification.
13. Real PNG screenshot regression for all ten canonical semantic-state tokens.
14. Visual mechanics published: exact browser, DPR 1, font-independent capture, tolerance 10, max changed-pixel ratio 0.003, guarded update path.
15. INV-001 through INV-022 published as a one-to-one architecture/test map.
16. Browser-required vs tree-only gates published.
17. Exact M2 certified surfaces published.
18. Explicit not-certified list published.
19. `M0R-FINDINGS.md` published with zero unresolved blockers and written deferrals.
20. `gate:m2-closeout` added to prevent M3 from inheriting undocumented M2 gaps.

## Certification boundary

M2 certifies MAATAA's 11-package kernel, React adapter host contract, the explicitly listed browser surfaces, and browser behaviour on the pinned Chromium build. It does **not** certify upstream React, other browser versions, full WCAG conformance, axe-core, Playwright, real hardware/protocols, HIL, penetration testing, or production deployment.

See `docs/NOT-CERTIFIED.md` for the authoritative published exclusion list generated from `architecture.json`.
