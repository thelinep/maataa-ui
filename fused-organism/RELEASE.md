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

Licence: Apache License 2.0, chosen 22 Nov 2026 (`LICENSE` and `NOTICE` in the root and in every package; the trademarks are not licensed). Publishing remains disabled. External publication still requires package ownership, provenance/signing, security review, and release-channel decisions. M2 does not provide full WCAG, cross-browser, protocol, HIL, penetration-test, or production-deployment certification.

## Stage 4 release controls

The selected first channel is versioned tarballs vendored into each consuming app. All 21 workspace packages remain `private: true`; the internal tarball workflow packs them without publishing to a registry. The provided GitHub identity is `thelinep`, and all package `repository` fields and the `@maataa/ui` homepage/bugs links now match `https://github.com/thelinep/maataa-ui`. This does not confirm npm ownership of either the `@maataa` or `@tlps` scope; public npm remains unselected.

The fused CI lane runs `npm audit --audit-level=high`, retains the existing `tests/security` checks, and certification scans the exact files listed by `npm pack --dry-run` for credential signatures. Package dry-run and clean Vite/Next.js consumer builds remain release checks. `npm run check:package-secrets` can be run locally; it reports package/file and signature type only and never prints matched values.

The latest full dependency audit on the release candidate reports zero vulnerabilities. It was run with the pinned Node 22.22.3 and npm 10.9.2 toolchain after moving Storybook build-only dependencies to the workspace root and applying scoped overrides for the Storybook docgen plugin and affected `minimatch` range. The full audit command and gate remain unchanged. See `docs/SECURITY-AUDIT-1.0.md` for the commit-bound validation record. All 21 workspace packages remain private for the vendored-tarball channel.

Changesets CLI 3.0.3 is configured for independent package versions, changelogs, and private-package tags. Use prerelease mode before versioning alpha packages (`npm run release:pre:enter-alpha`, then `npm run release:version`); exit prerelease mode only when the beta/1.0 version decision is approved. The manual tarball workflow runs on `master`, requires the `internal-tarball-release` GitHub environment, certifies the commit, scans packages, creates SHA-256 manifests, pushes only generated `@scope/package@version` tags, and uploads the tarball bundle. Configure that environment with required reviewers before running it.

No npm publish workflow is enabled for the selected channel. If public npm is later chosen, first confirm control of both npm scopes and make the provenance source repository public; npm's GitHub OIDC provenance requires a compatible public repository/package setup. GitHub Packages under `maataaos` would require package names scoped to that GitHub namespace, so it is not compatible with the current names as-is. The app teams still need to vendor each tarball bundle and define their update cadence.
