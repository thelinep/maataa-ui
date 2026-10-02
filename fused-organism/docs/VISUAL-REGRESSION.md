# Visual Regression Mechanics — M2 / 0.4.1

M2 screenshot certification is deliberately narrow and deterministic.

## Runtime pin

- Browser: **Chromium 144.0.7559.96** exactly.
- Policy source: `tests/browser/runtime-policy.json`.
- Device scale factor (DPR): **1**.
- Visual viewports: **1280×900** and **390×844** CSS pixels.

Other Chromium/Chrome versions are **not implied certified**.

## Capture scope

Only `#visual-fixture` in `apps/browser-cert/index.html` is captured. The fixture contains the ten canonical semantic-state swatches:

`state.info`, `state.ai`, `state.proposal`, `state.approval`, `state.authorized`, `state.executing`, `state.verified`, `state.danger`, `state.stale`, `state.offline`.

It intentionally renders **no text**, so font rasterization is excluded from the pixel comparison. The surrounding browser-certification fixture may use `system-ui`, but it is outside the captured rectangle.

## Pixel rule

`tests/browser/baselines/manifest.json` is authoritative for the comparison mechanics:

- per-channel tolerance: **10**;
- a pixel is different when any RGBA channel differs by more than 10;
- maximum changed-pixel ratio: **0.003** (**0.3%**);
- dimensions must match exactly.

A dimension mismatch fails with ratio 1.

## Baseline update enforcement

Normal certification **cannot create or update a missing baseline**. A missing baseline is a failure.

Baseline mutation requires both an explicit maintainer command and an explicit review acknowledgement:

```bash
MAATAA_VISUAL_REVIEW=approved npm run visuals:update
```

That wrapper is the only supported update path. It passes a private update token to `browser-certify.mjs --update-baselines`. Running certification normally with an update token is rejected.

Baseline changes are expected to be reviewed in source control like any other compatibility artifact.
