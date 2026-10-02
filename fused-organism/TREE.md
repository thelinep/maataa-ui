# MAATAA UI M2 — 0.4.1 Evidence Closeout

```text
MAATAA_UI_M2_0_4_1_CLOSEOUT/
├── .changeset/
│   ├── config.json
│   ├── m1-contract-api-freeze.md
│   ├── m2-closeout-evidence.md
│   └── README.md
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── release.yml
│   │   └── security.yml
│   └── CODEOWNERS
├── api/
│   ├── public-api.json
│   └── PUBLIC-API.md
├── apps/
│   ├── browser-cert/
│   │   ├── app.mjs
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── react-host-fixture.mjs
│   │   └── styles.css
│   ├── docs/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── product-landing.html
│   └── reference-control/
│       ├── app.mjs
│       ├── index.html
│       └── package.json
├── certification/
│   ├── certification.json
│   └── REPORT.md
├── compatibility/
│   ├── contracts.v1.json
│   ├── deprecations.json
│   ├── public-api.v1.json
│   └── registry.v1.json
├── contracts/
│   └── manifest.json
├── definitions/
│   ├── components.mjs
│   └── contracts.mjs
├── docs/
│   ├── adr/
│   │   ├── ADR-001-CONTRACT-AND-PLATFORM-VERSIONING.md
│   │   ├── ADR-002-RUNTIME-DEPENDENCY-POLICY.md
│   │   ├── ADR-003-BROWSER-CERTIFICATION-RUNTIME.md
│   │   ├── ADR-004-REACT-ADAPTER-CERTIFICATION-BOUNDARY.md
│   │   └── ADR-005-CDP-INSTEAD-OF-PLAYWRIGHT-AXE-IN-M2.md
│   ├── ADAPTER-SDK.md
│   ├── API-STABILITY.md
│   ├── ARCHITECTURE.md
│   ├── BROWSER-CERTIFICATION.md
│   ├── CERTIFICATION-SCOPE.md
│   ├── CERTIFIED-SURFACES.md
│   ├── GATE-MATRIX.md
│   ├── INVARIANTS.md
│   ├── M0-FOUNDATION-AUDIT.md
│   ├── M0R-FINDINGS.md
│   ├── M1-COMPLETION.md
│   ├── M2-CLOSEOUT.md
│   ├── M2-COMPLETION.md
│   ├── MIGRATION-V2-V3.md
│   ├── NOT-CERTIFIED.md
│   ├── REACT-ADAPTER.md
│   ├── REACT-CERTIFICATION.md
│   ├── REACT-SURFACE.md
│   ├── TESTING.md
│   └── VISUAL-REGRESSION.md
├── examples/
│   ├── camera-control/
│   │   ├── README.md
│   │   └── scenario.json
│   └── failure-matrix/
│       └── README.md
├── experimental/
│   ├── domain-fixture/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   └── V2-MIGRATION-MATRIX.md
├── governance/
│   ├── ACCESSIBILITY-ACCEPTANCE.md
│   ├── API-ACCEPTANCE.md
│   ├── COMPONENT-ACCEPTANCE.md
│   ├── CONTROL-SAFETY-ACCEPTANCE.md
│   ├── DEPRECATION-POLICY.md
│   ├── EMERGENCY-CHANGE.md
│   ├── INCIDENT-RESPONSE.md
│   ├── PERFORMANCE-ACCEPTANCE.md
│   ├── RELEASE-ACCEPTANCE.md
│   └── SECURITY-ACCEPTANCE.md
├── packages/
│   ├── adapter-sdk/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── ai/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── contracts/
│   │   ├── src/
│   │   │   ├── generated.d.ts
│   │   │   ├── generated.mjs
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── control/
│   │   ├── src/
│   │   │   ├── components.mjs
│   │   │   ├── index.mjs
│   │   │   ├── lease.mjs
│   │   │   ├── runtime.mjs
│   │   │   ├── safety.mjs
│   │   │   └── state-machine.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── core/
│   │   ├── src/
│   │   │   ├── a11y.mjs
│   │   │   ├── index.mjs
│   │   │   ├── primitives.mjs
│   │   │   └── tokens.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── governance/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── react/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── test/
│   │   │   └── react-adapter.test.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── recipes/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── registry/
│   │   ├── src/
│   │   │   ├── generated.mjs
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   ├── renderer/
│   │   ├── src/
│   │   │   └── index.mjs
│   │   ├── package.json
│   │   └── README.md
│   └── testing/
│       ├── src/
│       │   └── index.mjs
│       ├── package.json
│       └── README.md
├── registry/
│   └── components.registry.json
├── schemas/
│   ├── adapter.schema.json
│   ├── approval.schema.json
│   ├── audit-event.schema.json
│   ├── automation-rule.schema.json
│   ├── camera-state.schema.json
│   ├── control-command.schema.json
│   ├── control-lease.schema.json
│   ├── control-receipt.schema.json
│   ├── device.schema.json
│   ├── digital-twin.schema.json
│   ├── domain-record.schema.json
│   ├── evidence.schema.json
│   ├── incident.schema.json
│   ├── mission.schema.json
│   ├── policy-decision.schema.json
│   ├── recommendation.schema.json
│   ├── registry-entry.schema.json
│   ├── spatial-state.schema.json
│   ├── telemetry-sample.schema.json
│   ├── theme.schema.json
│   └── workspace.schema.json
├── scripts/
│   ├── lib/
│   │   └── browser-runtime.mjs
│   ├── browser-certify.mjs
│   ├── build.mjs
│   ├── certify.mjs
│   ├── check-api-compat.mjs
│   ├── check-boundaries.mjs
│   ├── check-browser-runtime.mjs
│   ├── check-contract-compat.mjs
│   ├── check-deprecations.mjs
│   ├── check-drift.mjs
│   ├── check-exports.mjs
│   ├── check-m0-foundation.mjs
│   ├── check-m2-closeout.mjs
│   ├── check-react-policy.mjs
│   ├── check-registry-bindings.mjs
│   ├── check-registry-compat.mjs
│   ├── check-toolchain.mjs
│   ├── check-version-sync.mjs
│   ├── check-visual-policy.mjs
│   ├── format-check.mjs
│   ├── fresh-clone.mjs
│   ├── generate-api-manifest.mjs
│   ├── generate-certification-report.mjs
│   ├── generate-contracts.mjs
│   ├── generate-invariant-map.mjs
│   ├── generate-registry.mjs
│   ├── generate-scope-docs.mjs
│   ├── generate.mjs
│   ├── lint.mjs
│   ├── png-diff.mjs
│   ├── release-check.mjs
│   ├── serve.mjs
│   └── update-visual-baselines.mjs
├── tests/
│   ├── accessibility/
│   │   ├── primitives.test.mjs
│   │   └── reference-app.test.mjs
│   ├── adapters/
│   │   └── simulator.test.mjs
│   ├── architecture/
│   │   └── invariants.test.mjs
│   ├── browser/
│   │   ├── baselines/
│   │   │   ├── manifest.json
│   │   │   ├── semantic-desktop.png
│   │   │   └── semantic-mobile.png
│   │   ├── browser-certification.browser.mjs
│   │   └── runtime-policy.json
│   ├── compatibility/
│   │   ├── contracts-compat.test.mjs
│   │   ├── public-api-compat.test.mjs
│   │   └── registry-compat.test.mjs
│   ├── contracts/
│   │   └── contracts.test.mjs
│   ├── control/
│   │   ├── failure-states.test.mjs
│   │   ├── lifecycle-invariants.test.mjs
│   │   └── state-machine.test.mjs
│   ├── e2e/
│   │   ├── camera-denied-flow.test.mjs
│   │   └── camera-governed-flow.test.mjs
│   ├── packages/
│   │   ├── domain-boundary-fixture.test.mjs
│   │   ├── packages.test.mjs
│   │   ├── react-peer-policy.test.mjs
│   │   └── runtime-dependencies.test.mjs
│   ├── registry/
│   │   ├── bindings.test.mjs
│   │   └── registry.test.mjs
│   ├── security/
│   │   ├── renderer.test.mjs
│   │   └── source-hygiene.test.mjs
│   └── visual/
│       └── semantic-state-tokens.test.mjs
├── .editorconfig
├── .gitignore
├── .npmrc
├── .nvmrc
├── architecture.json
├── BOUNDARIES.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── eslint.config.mjs
├── GOVERNANCE.md
├── LICENSE
├── package-lock.json
├── package.json
├── prettier.config.mjs
├── README.md
├── RELEASE.md
├── ROADMAP.md
├── SECURITY.md
├── tsconfig.base.json
└── tsconfig.json
```
