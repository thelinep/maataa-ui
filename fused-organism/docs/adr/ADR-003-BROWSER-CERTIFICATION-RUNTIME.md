# ADR-003 — Browser certification runtime

Status: Accepted and tightened at **0.4.1 / M2 closeout**.

MAATAA UI keeps browser automation packages outside the npm workspace dependency graph. Browser certification uses a system-provided browser through the Chrome DevTools Protocol, launched under Xvfb when available. The browser executable is therefore a **certification environment prerequisite**, not an npm runtime dependency.

M2 no longer claims a broad Chromium/Chrome `>=120` range. The certified runtime is pinned in `tests/browser/runtime-policy.json` to **Chromium 144.0.7559.96** with device scale factor **1**. Any other family or version fails `npm run gate:browser-runtime`.

The tree-only `fresh-clone` gate remains kernel certification and does not install or require a browser. Full `npm run certify` additionally requires the pinned browser runtime and browser certification lane.
