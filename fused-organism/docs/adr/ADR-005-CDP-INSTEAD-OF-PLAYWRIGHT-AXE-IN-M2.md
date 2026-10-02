# ADR-005 — Direct CDP instead of Playwright + axe-core in M2

Status: Accepted for **0.4.1 M2 closeout**.

## Context

The original M2 roadmap named Playwright and axe-core as likely browser-certification tools. The implemented M2 lane instead uses a system-provided Chromium executable through the Chrome DevTools Protocol (CDP).

## Decision

M2 uses **direct CDP** and does **not** claim Playwright or axe-core coverage.

Reasons:

1. the certified repository remains installable from the tree with an empty npm cache and no third-party package downloads;
2. M2 needs a narrow set of deterministic browser capabilities already exposed by CDP: accessibility tree inspection, real keyboard events, focus inspection, viewport emulation, media-feature emulation, and PNG capture;
3. Chromium is an environment prerequisite rather than a package dependency;
4. direct CDP makes the certification boundary explicit: MAATAA tests its own browser semantics without implying a broader automation-tool or WCAG rules-engine certification.

## Consequences

- M2 is certified only on the pinned Chromium build in `tests/browser/runtime-policy.json`.
- M2 automated accessibility checks are **contract checks**, not a full WCAG audit.
- No axe-core rule set was run.
- No Playwright runner/browser matrix was run.
- Cross-browser and full accessibility conformance remain future certification work and are listed in `docs/NOT-CERTIFIED.md`.

A later release may adopt Playwright and/or axe-core, but doing so requires an explicit ADR and changes to the reproducibility/dependency policy rather than silently changing the M2 evidence model.
