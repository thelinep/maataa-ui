# Release contract — 0.4.1 M2 closeout

A 0.4.1 M2 release candidate must pass `npm run certify`.

Required M0/M1 evidence remains:

- compatibility contract/API/registry baselines;
- deprecation metadata;
- reproducible tree-only kernel lane;
- M0R retrospective findings/disposition.

M2 additionally requires:

- exact pinned Chromium runtime policy and gate;
- `gate:m2-closeout`;
- `gate:visual-policy`;
- React adapter tests;
- browser certification;
- reviewed baselines under `tests/browser/baselines/`;
- published invariant, gate, React-surface, certified-surface, visual-mechanics and exclusion documents;
- ADR-005 documenting direct CDP instead of Playwright/axe-core.

Publishing remains disabled. External publication still requires production licensing confirmation, package ownership, provenance/signing, security review, and release-channel decisions. M2 does not provide full WCAG, cross-browser, protocol, HIL, penetration-test, or production-deployment certification.
