# Certification Report

> GENERATED from `certification/certification.json`. Do not edit this report manually.

Version: **1.0.0-alpha.0**
Status: **NOT_CERTIFIED**
Generated: 2026-10-01T20:04:34.492Z

## Fresh fused-product checks

- **kernel-test-suite** — PASS — 49/49 tests on 2026-10-02
- **ui-typescript** — PASS — No emit typecheck
- **integrated-build** — PASS — Kernel and UI artifacts emitted
- **ui-lint** — PASS_WITH_WARNINGS — 0 errors; 4 pre-existing hook/type warnings
- **ui-format** — PASS — Prettier check
- **ui-vitest** — BLOCKED — Missing @rollup/rollup-darwin-arm64 in installed legacy node_modules; host is Darwin ARM64
- **ui-product-smoke** — PASS — Allowed action, unapproved action blocked, compliance display stays truthful
- **toolchain** — FAIL — Installed npm 12.0.2; kernel policy requires npm 10.9.x
- **browser-runtime** — FAIL — Pinned Chromium unavailable: CHROMIUM_NOT_FOUND
- **clean-install** — NOT_VERIFIED — Offline lock regeneration blocked by uncached Storybook metadata
- **product-gate** — FAIL — Stopped before remaining gates because installed npm 12.0.2 violates the required npm 10.9.x range

## Historical kernel-only gates (not fresh evidence for this product)


- **m0-foundation** — PASS — `npm run gate:m0`
- **m2-closeout** — PASS — `npm run gate:m2-closeout`
- **toolchain** — PASS — `npm run gate:toolchain`
- **version-sync** — PASS — `npm run gate:version-sync`
- **drift** — PASS — `npm run gate:drift`
- **visual-policy** — PASS — `npm run gate:visual-policy`
- **registry-bindings** — PASS — `npm run check:registry-bindings`
- **react-policy** — PASS — `npm run check:react-policy`
- **compatibility** — PASS — `npm run check:compat`
- **lint** — PASS — `npm run lint`
- **format** — PASS — `npm run format:check`
- **boundaries** — PASS — `npm run check:boundaries`
- **exports** — PASS — `npm run check:exports`
- **react-adapter** — PASS — `npm run test:react`
- **tests** — PASS — `npm test`
- **build** — PASS — `npm run build`
- **fresh-clone** — PASS — `npm run fresh-clone`
- **browser-runtime** — PASS — `npm run gate:browser-runtime`
- **browser-certification** — PASS — `npm run certify:browser`
- **release** — PASS — `npm run release:check`

## Scope

Fused kernel plus @maataa/ui workspace. The inherited PASS gates below are historical evidence for the kernel-only closeout generated on 2026-09-30; they are not fresh results for the fused product. Fused package certification is pending clean install, platform-compatible UI tests, and fresh browser certification.

## Explicit exclusions

- third-party React implementation or React version matrix; M2 certifies the MAATAA host-adapter contract only
- cross-browser behaviour outside pinned Chromium 144.0.7559.96
- full WCAG conformance or manual assistive-technology certification
- axe-core rules-engine coverage
- Playwright test-runner coverage
- real ONVIF/RTSP/WebRTC camera interoperability
- real robotics, PLC, IoT, building, industrial, show-control, mobility or energy control
- hardware-in-the-loop operation or safety-rated emergency control
- penetration testing, external security audit or production deployment
- visual regression for the full public landing page or all 90 registry components
- browser rendering for headless-bound registry entries other than the explicitly certified React primitives
- M3 deferred React hooks until implemented and separately tested
