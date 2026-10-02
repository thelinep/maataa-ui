# Browser Certification — 0.4.1 / M2 closeout

## Runtime pin

`npm run gate:browser-runtime` requires the exact runtime declared in `tests/browser/runtime-policy.json`:

- browser family: **Chromium**;
- exact version: **144.0.7559.96**;
- device scale factor: **1**.

`MAATAA_BROWSER` may override the executable path, but the detected family/version must still match the pin. `MAATAA_XVFB` may override the Xvfb path. Other Chromium/Chrome versions are **not implied certified**.

`npm run certify:browser` launches that browser and communicates through the Chrome DevTools Protocol (CDP). See ADR-003 for the environment boundary and ADR-005 for why M2 uses direct CDP rather than Playwright + axe-core.

## Browser-required gates

Only the browser lane needs the external browser runtime: `gate:browser-runtime`, `test:browser`/`certify:browser`, guarded `visuals:update`, full `certify`, and the M2 `release:check`. Kernel/fresh-clone gates do not. The complete matrix is in `docs/GATE-MATRIX.md`.

## Certified browser behaviours

- accessibility-tree roles and names for adapter-produced `Button`, `Input`, and `Switch`;
- polite live-region semantics for adapter-produced `AriaLive`;
- arrow-key navigation for the fixture tablist;
- native dialog initial focus and focus restoration in the fixture;
- live-region command feedback;
- responsive no-overflow matrix at 390/768/1440 CSS pixels;
- reduced-motion media preference;
- forced-colors media preference;
- screenshot visual regression for the ten semantic-state swatches.

The fixture tablist/dialog/probes are certification fixtures, not exports of `@maataa/react`. See `docs/CERTIFIED-SURFACES.md`.

## Visual regression

See `docs/VISUAL-REGRESSION.md`. In summary, the capture is font-independent, runs at DPR 1, uses channel tolerance 10 and maximum changed-pixel ratio 0.003, and normal certification cannot update or create baselines.

The only supported baseline mutation flow is:

```bash
MAATAA_VISUAL_REVIEW=approved npm run visuals:update
```

## Accessibility scope

M2 provides automated browser accessibility-contract checks. It is **not** a full WCAG conformance statement, contains no axe-core rules-engine result, and contains no manual assistive-technology certification. Those exclusions are published in `docs/NOT-CERTIFIED.md`.
